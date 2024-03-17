import {
  BoundingBox,
  Game,
  GameObjectFactory,
  getRandomNumber,
} from "../engine";

import Cursor from "./Cursor";
import Food from "./Food";

/**
 * @author Salinder Sidhu
 */
export default class BugTap extends Game {
  private cursorFactory: GameObjectFactory<Cursor>;
  private foodFactory: GameObjectFactory<Food>;

  constructor(canvasId: string) {
    super(canvasId);

    this.cursorFactory = new GameObjectFactory<Cursor>(
      this.canvas,
      this.context,
      (canvas, context) => new Cursor(canvas, context)
    );

    this.foodFactory = new GameObjectFactory<Food>(
      this.canvas,
      this.context,
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

    this.initGameObjects();
  }

  /**
   * Create GameOjects and add them to the game.
   */
  private initGameObjects() {
    // Create a cursor to provide a visual indicator of the player's mouse
    const cursor = this.cursorFactory.createGameObject();

    // Create food randomly spread near the center of the table
    let food = this.generateFood(7);

    this.addGameObjects([cursor, ...food]);
  }

  /**
   * Generate an array of Food objects with random positions.
   *
   * @param amount The number of Food objects to generate.
   */
  private generateFood(amount: number): Food[] {
    const food: Food[] = [];

    const spriteSrc = "./assets/graphics/food.png";
    const numFrames = 16;
    const width = 56;
    const height = 56;

    let availableFrames = Array.from({ length: numFrames }, (_, i) => i);

    while (food.length < amount) {
      // Generate random coordinates for a food's bounding box
      const x = getRandomNumber(150, 744);
      const y = getRandomNumber(100, 444);

      // Skip food creation if new food will intersect with any existing food
      const newBoundingBox = new BoundingBox(x, y, width, height);
      const isOverlapping = food.some((existingFood) =>
        newBoundingBox.isIntersecting(existingFood.boundingBox)
      );
      if (isOverlapping) {
        continue;
      }

      // If all frames have been used, refresh the availableFrames list
      if (availableFrames.length === 0) {
        availableFrames = Array.from({ length: numFrames }, (_, i) => i);
      }

      // Pick a random frame index from available frames list
      const randomIndex = getRandomNumber(0, availableFrames.length - 1);
      const frameIndex = availableFrames.splice(randomIndex, 1);

      // Create Food
      const newFood = this.foodFactory.createGameObject(
        x,
        y,
        width,
        height,
        spriteSrc,
        frameIndex
      );
      food.push(newFood);
    }

    return food;
  }
}
