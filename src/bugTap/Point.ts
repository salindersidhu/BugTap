import { GameObject, Text } from "../engine";

/**
 * @author Salinder Sidhu
 */
export default class Point extends GameObject {
  private _text: Text;

  private _x: number;
  private _y: number;
  private _moveSpeed: number = 5;
  private _opacity: number = 1;
  private _fadeSpeed: number = 1;

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

    this._text = new Text(`+ ${points}`, "bold 30px Sans-serif", "#B8E600");
    this._text.setOutline("black", 6);
  }

  update(fps: number): void {
    this._y -= 0.3 * this._moveSpeed;
    this._opacity -= 1 / (fps * this._fadeSpeed);
    if (this._opacity < 0) {
      this.delete();
    }
  }

  render(): void {
    this._text.render(this.context, this._x, this._y, 0, this._opacity);
  }
}
