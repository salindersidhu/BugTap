import { BoundingBox, GameObject, Sprite } from "../engine";

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
  private _sprite: Sprite;
  private _angle: number = 0;
  private _speed: number;
  private _state: State = State.ALIVE;
  private _opacity: number = 1;
  private _fadeSpeed: number = 0.7;

  private _food: Food[] = [];

  private _spawnX: number = 0;
  private _spawnY: number = 0;

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

    this._sprite = new Sprite(
      spriteSrc,
      height,
      width,
      speed,
      numFrames,
      initFrame
    );
    this._speed = speed;

    this._food = food;

    this._spawnX = x;
    this._spawnY = y;

    this.boundingBox = new BoundingBox(x, y, height, width);
  }

  /**
   * Updates the bug's position, animation frame, and interactions.
   *
   * @param fps The frames per second.
   */
  update(fps: number) {
    this._sprite.update(fps);

    this._updateDeath(fps);
    this._updateMovement(fps);
    this._updateEatingFood();
  }

  /**
   * Updates the bug's state when it's dead, handling the death animation.
   *
   * @param fps The frames per second.
   */
  private _updateDeath(fps: number) {
    if (this._state === State.DEAD) {
      this._opacity -= 1 / (fps * this._fadeSpeed);
      if (this._opacity < 0) {
        this.delete();
      }
    }
  }

  /**
   * Updates the bug's movement based on food availability. If there's no food,
   * the bug moves back to its spawn point.
   *
   * @param fps The frames per second.
   */
  private _updateMovement(fps: number) {
    if (this._food.length < 1) {
      this._state = State.DEAD;
      this._moveToPoint(this._spawnX, this._spawnY);
      return;
    }
    this._moveToFood(this._food);
  }

  /**
   * Updates the bug's interaction with food. If the bug overlaps with any
   * food, it eats the food.
   */
  private _updateEatingFood() {
    for (const _food of this._food) {
      if (_food.boundingBox.isOverlapping(this.boundingBox)) {
        _food.eaten();

        // Remove the eaten food from the array
        const index = this._food.indexOf(_food);
        if (index >= 0) {
          this._food.splice(index, 1);
        }
      }
    }
  }

  /**
   * Renders the bug on the canvas.
   */
  render() {
    const { x, y } = this.boundingBox;
    this._sprite.render(this.context, x, y, this._angle, this._opacity);
  }

  /**
   * Move the bug towards the nearest food.
   *
   * @param food An array of Food objects.
   */
  private _moveToFood(food: Food[]) {
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
    const { x, y, width, height } = nearestFood.boundingBox;
    const foodCenterX = x + width / 2;
    const foodCenterY = y + height / 2;

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
    const { x, y, width, height } = this.boundingBox;
    const {
      x: foodX,
      y: foodY,
      width: foodWidth,
      height: foodHeight,
    } = food.boundingBox;

    const bugCenterX = x + width / 2;
    const bugCenterY = y + height / 2;
    const foodCenterX = foodX + foodWidth / 2;
    const foodCenterY = foodY + foodHeight / 2;

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
    const { x: bugX, y: bugY, width, height } = this.boundingBox;
    const dx = x - bugX - width / 2;
    const dy = y - bugY - height / 2;

    // Compute the hypotenuse
    const hypotenuse = Math.hypot(dx, dy);

    // Move towards the point
    if (hypotenuse > 1) {
      // Normalize dx and dy to get the unit vector
      const ndx = dx / hypotenuse;
      const ndy = dy / hypotenuse;

      const nSpeed = 0.3 * this._speed;

      this.boundingBox.x += ndx * nSpeed;
      this.boundingBox.y += ndy * nSpeed;

      // Update the angle based on direction of movement
      this._angle = Math.atan2(ndy, ndx);
    }
  }
}
