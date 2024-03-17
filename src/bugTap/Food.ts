import { GameObject, SpriteAnimation, getRandomNumber } from "../engine";

/**
 *
 */
export default class Food extends GameObject {
  private _x: number;
  private _y: number;
  private _height: number;
  private _width: number;
  //private _spriteImage: string;

  //spriteAnimation: SpriteAnimation;

  counter: number = 0;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number
    //spriteImage: string
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;
    this._height = height;
    this._width = width;
  }

  update() {}

  render() {
    this.context.fillStyle = "black";
    this.context.globalAlpha = 1;
    this.context.fillRect(this._x, this._y, this._width, this._height);
  }
}
