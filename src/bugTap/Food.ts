import { BoundingBox, GameObject, SpriteStatic } from "../engine";

/**
 * Represents a food item in the game.
 *
 * @author Salinder Sidhu
 */
export default class Food extends GameObject {
  private _x: number;
  private _y: number;

  private _sprite: SpriteStatic;

  boundingBox: BoundingBox;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number,
    spriteSrc: string,
    initFrame: number
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;

    this.boundingBox = new BoundingBox(x, y, height, width);
    this._sprite = new SpriteStatic(spriteSrc, height, width, initFrame);
  }

  update(_: number): void {}

  render() {
    this._sprite.render(this.context, this._x, this._y, 0);
  }
}
