import { Howl } from "howler";

import { Entity, Text } from "../engine";

const COLOR = "black";
const FONT_SIZE: number = 48;
const SCALE_SPEED: number = 30;
const START_COLOR: string = "#6FBF19";
const START_TEXT: string = "GO";
const SOUND_PING: string = "./assets/sound/ping.wav";
const SOUND_START: string = "./assets/sound/start.wav";

/**
 * Displays a countdown on the game. The countdown decreases over time, and the
 * text scales and fades accordingly. When the countdown reaches zero, the
 * Countdown object is deleted.
 *
 * @author Salinder Sidhu
 */
export default class Countdown extends Entity {
  private _text: Text | undefined;

  private _countdown: number;
  private _opacity: number = 1;
  private _scale: number = 1;

  private _soundPing: Howl;
  private _soundStart: Howl;

  /**
   * Create an instance of Countdown.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    countdown: number
  ) {
    super(canvas, context, 1);

    this._countdown = countdown;
    this._updateCountdownText();

    this._soundPing = new Howl({
      src: [SOUND_PING],
      html5: true,
    });
    this._soundStart = new Howl({
      src: [SOUND_START],
      html5: true,
    });
  }

  /**
   * Update the Countdown state.
   *
   * @param fps The current frames per second.
   */
  update(fps: number) {
    if (this._opacity === 1) {
      this._countdown > 0 ? this._soundPing.play() : this._soundStart.play();
    }

    // Update opacity and scale
    this._opacity -= 1 / fps;
    this._scale += SCALE_SPEED / fps;
    this._scale = Math.min(
      this._scale,
      Math.max(this.canvas.height / FONT_SIZE)
    );

    if (this._opacity < 0) {
      // Decrement the countdown, reset opacity and scale
      this._countdown -= 1;
      this._opacity = 1;
      this._scale = 1;

      this._updateCountdownText();
    }

    if (this._countdown < 0) {
      this.delete();
    }
  }

  /**
   * Update the countdown text.
   */
  private _updateCountdownText() {
    this._text = new Text(
      this._countdown < 1 ? START_TEXT : this._countdown.toString(),
      "Sans-serif",
      `${FONT_SIZE}px`,
      "bold",
      this._countdown < 1 ? START_COLOR : COLOR
    );
  }

  /**
   * Render the countdown text.
   */
  render() {
    this.context.save();

    this.context.textBaseline = "middle";
    this.context.textAlign = "center";

    this._text?.render(
      this.context,
      this.canvas.width / 2,
      this.canvas.height / 2,
      0,
      Math.max(this._opacity, 0),
      this._scale
    );

    this.context.restore();
  }
}
