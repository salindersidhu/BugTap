import { Howl } from "howler";

import { GameObject, Text } from "../engine";

const SOUND_POINT: string = "./assets/sound/point.ogg";

/**
 * Represents a point object displayed in the game.
 *
 * @author Salinder Sidhu
 */
export default class Point extends GameObject {
  private _text: Text;

  private _x: number;
  private _y: number;
  private _moveSpeed: number = 2;
  private _opacity: number = 1;
  private _fadeSpeed: number = 1;

  private _soundPoint: Howl;

  /**
   * Creates a new Point instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   * @param points The number of points to display.
   * @param x The x-coordinate of the point.
   * @param y The y-coordinate of the point.
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    points: number,
    x: number,
    y: number
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;
    this._text = new Text(
      `+ ${points}`,
      "bold 30px Sans-serif",
      "#B8E600",
      "black",
      6
    );

    this._soundPoint = new Howl({
      src: [SOUND_POINT],
      html5: true,
    });

    this._soundPoint.play();
  }

  /**
   * Updates the position and opacity of the point object.
   *
   * @param fps The current frames per second.
   */
  update(fps: number) {
    this._y -= 0.3 * this._moveSpeed;
    this._opacity -= 1 / (fps * this._fadeSpeed);
    if (this._opacity < 0) {
      this.delete();
    }
  }

  /**
   * Renders the point object on the canvas.
   */
  render() {
    this._text.render(this.context, this._x, this._y, 0, this._opacity);
  }
}
