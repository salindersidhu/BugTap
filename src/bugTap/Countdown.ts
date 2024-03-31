import { Howl } from "howler";

import { Entity, Text } from "../engine";

const FONT_SIZE: number = 48;
const SCALE_SPEED: number = 30;
const TEXT_HEIGHT_RATIO: number = 3;
const TEXT_WIDTH_RATIO: number = 4;
const SOUND_PING: string = "./assets/sound/ping.wav";

/**
 * Displays a countdown on the game. The countdown decreases over time, and the
 * text scales and fades accordingly. When the countdown reaches zero, the
 * Countdown object is deleted.
 *
 * @author Salinder Sidhu
 */
export default class Countdown extends Entity {
  private _text: Text;

  private _x: number;
  private _y: number;
  private _countdown: number;
  private _opacity: number = 1;
  private _scale: number = 1;

  private _soundPing: Howl;

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

    this._x = this.canvas.width / 2;
    this._y = this.canvas.height / 2;
    this._countdown = countdown;

    this._text = new Text(
      this._countdown.toString(),
      "bold 48px Sans-serif",
      "black"
    );

    this._soundPing = new Howl({
      src: [SOUND_PING],
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
      this._soundPing.play();
    }

    // Update opacity and scale
    this._opacity -= 1 / fps;
    this._scale += SCALE_SPEED / fps;
    this._scale = Math.min(
      this._scale,
      Math.max(this.canvas.height / FONT_SIZE)
    );

    if (this._opacity < 0) {
      // Decrement the countdown
      this._countdown -= 1;
      // Reset text opacity and scale
      this._opacity = 1;
      this._scale = 1;

      this._text = new Text(
        this._countdown.toString(),
        `bold ${FONT_SIZE}px Sans-serif`,
        "black"
      );
    }

    if (this._countdown < 1) {
      this.delete();
    }
  }

  /**
   * Render the countdown text.
   */
  render() {
    this._text.render(
      this.context,
      this._x - (FONT_SIZE / TEXT_WIDTH_RATIO) * this._scale,
      this._y + (FONT_SIZE / TEXT_HEIGHT_RATIO) * this._scale,
      0,
      Math.max(this._opacity, 0),
      this._scale
    );
  }
}
