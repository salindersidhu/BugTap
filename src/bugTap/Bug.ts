import { SpriteAnimated, GameObject, BoundingBox } from "../engine";

/**
 * Representing the state of a bug.
 */
enum State {
  ALIVE,
  DEAD,
}

/**
 * @author Salinder Sidhu
 */
export default class Bug extends GameObject {
  private _x: number;
  private _y: number;
  private _height: number;
  private _width: number;

  private _angle: number = 0;
  private _speed: number;

  private _state: State = State.ALIVE;

  private _sprite: SpriteAnimated;

  boundingBox: BoundingBox;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number,
    spriteSrc: string,
    speed: number,
    numFrames: number,
    initFrame: number = 0
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    this._speed = speed;

    this.boundingBox = new BoundingBox(x, y, height, width);

    this._sprite = new SpriteAnimated(
      spriteSrc,
      height,
      width,
      speed,
      numFrames,
      initFrame
    );
  }

  update(fps: number) {
    this._moveToPoint(this.canvas.width / 2, this.canvas.height / 2);

    this._sprite.update(fps);
  }

  render() {
    this._sprite.render(this.context, this._x, this._y, this._angle);
  }

  private _moveToFood() {}

  private _moveToPoint(x: number, y: number) {
    // Compute the distance to the point
    const dx = x - this._x - this._width / 2;
    const dy = y - this._y - this._height / 2;

    // Compute the hypotenuse
    const hypotenuse = Math.hypot(dx, dy);

    // Move towards the point
    if (hypotenuse > 1) {
      // Normalize dx and dy to get the unit vector
      const ndx = dx / hypotenuse;
      const ndy = dy / hypotenuse;

      const nSpeed = 0.3 * this._speed;

      this._x += ndx * nSpeed;
      this._y += ndy * nSpeed;

      // Update the angle based on direction of movement
      this._angle = Math.atan2(ndy, ndx);
    }
  }
}
