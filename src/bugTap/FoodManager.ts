import { BoundingBox, GameObjectFactory, getRandomNumber } from "../engine";

import Food from "./Food";

const foodSprite = "./assets/graphics/food.png";

const numFoodFrames = 16;

const foodHeight = 56;
const foodWidth = 56;

/**
 * The FoodManager class handles the creation and management of food objects
 * in the game.
 *
 * @author Salinder Sidhu
 */
export default class FoodManager {
  private static instance: FoodManager;
  private foodFactory: GameObjectFactory<Food>;

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
    this.foodFactory = new GameObjectFactory<Food>(
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
    if (!FoodManager.instance) {
      FoodManager.instance = new FoodManager(canvas, context);
    }
    return FoodManager.instance;
  }

  /**
   * Generate an array of Food objects with random positions.
   *
   * @param amount The number of Food objects to generate.
   */
  public generate(amount: number): Food[] {
    const food: Food[] = [];

    let availableFrames = Array.from({ length: numFoodFrames }, (_, i) => i);

    while (food.length < amount) {
      // Generate random coordinates for a food's bounding box
      const x = getRandomNumber(150, 744);
      const y = getRandomNumber(100, 444);

      // Skip food creation if new food will intersect with any existing food
      const newBoundingBox = new BoundingBox(x, y, foodWidth, foodHeight);
      const isOverlapping = food.some((existingFood) =>
        newBoundingBox.isIntersecting(existingFood.boundingBox)
      );
      if (isOverlapping) {
        continue;
      }

      // If all frames have been used, refresh the availableFrames list
      if (availableFrames.length === 0) {
        availableFrames = Array.from({ length: numFoodFrames }, (_, i) => i);
      }

      // Pick a random frame index from available frames list
      const randomIndex = getRandomNumber(0, availableFrames.length - 1);
      const frameIndex = availableFrames.splice(randomIndex, 1);

      // Create Food
      const newFood = this.foodFactory.createGameObject(
        x,
        y,
        foodWidth,
        foodHeight,
        foodSprite,
        frameIndex
      );
      food.push(newFood);
    }

    return food;
  }
}
