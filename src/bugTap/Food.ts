import { Howl } from "howler";

import { BoundingBox, Entity, Sprite } from "../engine";

const SOUND_EAT_FOOD: string = "./assets/sound/eat.ogg";

/**
 * Representing the state of food.
 */
enum State {
  ACTIVE,
  EATEN,
}

/**
 * Represents a Food in the BugTap game. When Food is eaten, it will gradually
 * fade out.
 *
 * @author Salinder Sidhu
 */
export default class Food extends Entity {
  private _sprite: Sprite;

  private _state: State = State.ACTIVE;
  private _opacity: number = 1;
  private _fadeSpeed: number = 0.7;

  private _soundEatFood: Howl;

  boundingBox: BoundingBox;

  /**
   * Creates a new Food instance.
   *
   * @param canvas The HTMLCanvasElement for rendering.
   * @param context The CanvasRenderingContext2D for drawing.
   * @param x The initial X coordinate of the food item.
   * @param y The initial Y coordinate of the food item.
   * @param height The height of the food item.
   * @param width The width of the food item.
   * @param spriteSrc The URL of the sprite image for rendering.
   * @param initFrame The initial frame of the animated sprite.
   */
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

    this.boundingBox = new BoundingBox(x, y, height, width);
    this._sprite = new Sprite(spriteSrc, height, width, 0, 1, initFrame);

    this._soundEatFood = new Howl({
      src: [SOUND_EAT_FOOD],
      html5: true,
    });
  }

  /**
   * Update the state of the food item.
   *
   * @param fps The frames per second.
   */
  update(fps: number) {
    if (this._state === State.ACTIVE) {
      return;
    }

    this._opacity -= 1 / (fps * this._fadeSpeed);
    if (this._opacity < 0) {
      this.delete();
    }
  }

  /**
   * Render the food item on the canvas.
   */
  render() {
    const { x, y } = this.boundingBox;
    this._sprite.render(this.context, x, y, 0, this._opacity);
  }

  /**
   * Mark the food item as eaten and play the sound effect for eating food.
   */
  eaten() {
    if (this._state === State.EATEN) {
      return;
    }

    this._soundEatFood.play();
    this._state = State.EATEN;
  }

  /**
   * Indicate if the Food has been eaten.
   *
   * @returns True if the Food has been eaten, otherwise false.
   */
  isEaten() {
    return this._state === State.EATEN;
  }
}
