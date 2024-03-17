import { BoundingBox, GameObject, SpriteAnimation } from "../engine";

/**
 * Represents a food item in the game.
 *
 * @author Salinder Sidhu
 */
export default class Food extends GameObject {
  private _x: number;
  private _y: number;

  private _spriteAnimation: SpriteAnimation;

  boundingBox: BoundingBox;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number,
    spriteSrc: string,
    numFrames: number,
    initFrame: number
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;

    this.boundingBox = new BoundingBox(x, y, height, width);
    this._spriteAnimation = new SpriteAnimation(
      spriteSrc,
      height, // Use the same height and width as the food item
      width,
      0, // Adjust cycles per second as needed
      numFrames,
      initFrame
    );
  }

  update() {
    this._spriteAnimation.update();
  }

  render() {
    this._spriteAnimation.render(this.context, this._x, this._y, 0);
  }
}
