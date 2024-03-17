import { BoundingBox, GameObject } from "../engine";

/**
 * Represents a food item in the game.
 */
export default class Food extends GameObject {
  private _x: number;
  private _y: number;
  private _height: number;
  private _width: number;

  private _boundingBox: BoundingBox;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;
    this._height = height;
    this._width = width;

    this._boundingBox = new BoundingBox(x, y, height, width);
  }

  update() {}

  /**
   * Determines whether this food item intersects with another food item.
   *
   * @param {Food} food The other food item to check intersection with.
   */
  isIntersectingWithFood(food: Food): boolean {
    return this._boundingBox.isIntersecting(food._boundingBox);
  }

  render() {
    this.context.fillStyle = "black";
    this.context.globalAlpha = 1;
    this.context.fillRect(this._x, this._y, this._width, this._height);
  }
}
