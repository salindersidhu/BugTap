import { BoundingBox, EntityFactory, getRandomNumber } from "../engine";

import Food from "./Food";

const foodSprite = "./assets/graphics/food.png";

const FOOD_HEIGHT: number = 56;
const FOOD_WIDTH: number = 56;
const MAX_FOOD_ATTEMPTS = 500;
const NUMBER_OF_FOOD_FRAMES: number = 16;

/**
 * The FoodManager class handles the creation and management of food objects
 * in the game.
 *
 * @author Salinder Sidhu
 */
export default class FoodManager {
  private static _instance: FoodManager;
  private _foodFactory: EntityFactory<Food>;

  /**
   * Creates an instance of FoodManager.
   *
   * @param canvas The HTMLCanvasElement for rendering.
   * @param context The CanvasRenderingContext2D for drawing.
   */
  private constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this._foodFactory = new EntityFactory<Food>(
      canvas,
      context,
      (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        height: number,
        width: number,
        spriteSrc: string,
        initFrame: number
      ) => {
        return new Food(
          canvas,
          context,
          x,
          y,
          height,
          width,
          spriteSrc,
          initFrame
        );
      }
    );
  }

  /**
   * Return the singleton instance of FoodManager.
   *
   * @param canvas - The HTMLCanvasElement for rendering.
   * @param context - The CanvasRenderingContext2D for drawing.
   * @returns The FoodManager instance.
   */
  public static getInstance(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ): FoodManager {
    if (!FoodManager._instance) {
      FoodManager._instance = new FoodManager(canvas, context);
    }
    return FoodManager._instance;
  }

  /**
   * Generate an array of Food objects with random positions.
   *
   * @param amount The number of Food objects to generate.
   */
  public generate(amount: number): Food[] {
    const food: Food[] = [];

    let attempts = 0;
    let availableFrames = Array.from(
      { length: NUMBER_OF_FOOD_FRAMES },
      (_, i) => i
    );

    while (food.length < amount) {
      attempts++;

      // Generate random coordinates for a food's bounding box
      const x = getRandomNumber(150, 744);
      const y = getRandomNumber(100, 444);

      // Skip food creation if new food will intersect with any existing food
      const newBoundingBox = new BoundingBox(x, y, FOOD_WIDTH, FOOD_HEIGHT);
      const isOverlapping = food.some((existingFood) =>
        newBoundingBox.isIntersecting(existingFood.boundingBox)
      );
      if (isOverlapping) {
        continue;
      }

      // Exceeded maximum number of attempts
      if (attempts > MAX_FOOD_ATTEMPTS) {
        break;
      }

      // If all frames have been used, refresh the availableFrames list
      if (availableFrames.length === 0) {
        availableFrames = Array.from(
          { length: NUMBER_OF_FOOD_FRAMES },
          (_, i) => i
        );
      }

      // Pick a random frame index from available frames list
      const randomIndex = getRandomNumber(0, availableFrames.length - 1);
      const frameIndex = availableFrames.splice(randomIndex, 1);

      // Create Food
      const newFood = this._foodFactory.createEntity(
        x,
        y,
        FOOD_WIDTH,
        FOOD_HEIGHT,
        foodSprite,
        frameIndex
      );
      food.push(newFood);
    }

    return food;
  }
}
