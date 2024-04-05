import { Howl } from "howler";

import { Entity, Text } from "../engine";

const POINT_SOUND: string = "./assets/sound/point.mp3";

/**
 * Represents a score displayed in the game. The score is displayed on the
 * canvas at its specified position, moving vertically at a given speed and
 * gradually fading out over time.
 *
 * @author Salinder Sidhu
 */
export default class Point extends Entity {
  private _text: Text;

  private _x: number;
  private _y: number;
  private _moveSpeed: number = 60;
  private _fadeSpeed: number = 1;
  private _opacity: number = 1;

  private _soundPoint: Howl;

  /**
   * Create a new Point instance.
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
      `+${points}`,
      "Sans-serif",
      "30px",
      "bold",
      "#B8E600"
    );
    this._text.setOutline("black", 5);

    this._soundPoint = new Howl({
      src: [POINT_SOUND],
      html5: true,
    });

    this._soundPoint.play();
  }

  /**
   * Update the state of the point.
   *
   * @param fps The current frames per second.
   */
  update(fps: number) {
    this._y -= this._moveSpeed / fps;

    this._opacity -= 1 / (fps * this._fadeSpeed);
    if (this._opacity < 0) {
      this.delete();
    }
  }

  /**
   * Render the point object on the canvas.
   */
  render() {
    this._text.render(this.context, this._x, this._y, 0, this._opacity);
  }
}
