import { SpriteAnimated, GameObject, BoundingBox } from "../engine";

import Food from "./Food";

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

  private _food: Food[] = [];

  boundingBox: BoundingBox;

  /**
   * Creates a new Bug instance.
   *
   * @param canvas The HTMLCanvasElement for rendering.
   * @param context The CanvasRenderingContext2D for drawing.
   * @param x The initial X coordinate of the bug.
   * @param y The initial Y coordinate of the bug.
   * @param height The height of the bug.
   * @param width The width of the bug.
   * @param spriteSrc The URL of the sprite image for rendering.
   * @param speed The speed of the bug.
   * @param food An array of Food objects for interaction.
   * @param numFrames The number of frames in the animated sprite.
   * @param initFrame The initial frame index of the animated sprite (default is 0).
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    height: number,
    width: number,
    spriteSrc: string,
    speed: number,
    food: Food[],
    numFrames: number,
    initFrame: number = 0
  ) {
    super(canvas, context);

    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    this._speed = speed;

    this._food = food;

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

  /**
   * Updates the bug's position and animation frame.
   *
   * @param fps The frames per second.
   */
  update(fps: number) {
    this._moveToFood(this._food);

    this._sprite.update(fps);
  }

  /**
   * Renders the bug on the canvas.
   */
  render() {
    this._sprite.render(this.context, this._x, this._y, this._angle);
  }

  /**
   * Move the bug towards the nearest food.
   *
   * @param food An array of Food objects.
   */
  private _moveToFood(food: Food[]) {
    // Do nothing if there's no food
    if (food.length === 0) {
      return;
    }

    // Compute the center coordinates of the nearest food
    let nearestFood = food[0];
    let minDistanceSquared = this._distanceSquared(nearestFood);
    for (const _food of food) {
      const distanceSquared = this._distanceSquared(_food);
      if (distanceSquared < minDistanceSquared) {
        minDistanceSquared = distanceSquared;
        nearestFood = _food;
      }
    }
    const foodCenterX = nearestFood.x + nearestFood.width / 2;
    const foodCenterY = nearestFood.y + nearestFood.height / 2;

    // Move towards the center of the nearest food
    this._moveToPoint(foodCenterX, foodCenterY);
  }

  /**
   * Computes the squared distance between the bug and a food object.
   *
   * @param food The Food object.
   * @returns The squared distance between the bug and the food object.
   */
  private _distanceSquared(food: Food): number {
    const bugCenterX = this._x + this._width / 2;
    const bugCenterY = this._y + this._height / 2;
    const foodCenterX = food.x + food.width / 2;
    const foodCenterY = food.y + food.height / 2;

    const dx = bugCenterX - foodCenterX;
    const dy = bugCenterY - foodCenterY;

    return dx * dx + dy * dy;
  }

  /**
   * Moves the bug towards a specified point.
   *
   * @param x The X coordinate of the target point.
   * @param y The Y coordinate of the target point.
   */
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
