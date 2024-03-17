import { BoundingBox, GameObject, StaticSprite } from "../engine";

/**
 * Represents a food item in the game.
 *
 * @author Salinder Sidhu
 */
export default class Food extends GameObject {
  private _x: number;
  private _y: number;

  private _staticSprite: StaticSprite;

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
    this._staticSprite = new StaticSprite(
      spriteSrc,
      height, // Use the same height and width as the food item
      width,
      initFrame
    );
  }

  update() {}

  render() {
    this._staticSprite.render(this.context, this._x, this._y, 0);
  }
}
