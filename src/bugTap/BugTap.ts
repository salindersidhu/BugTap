import { Game, GameObjectFactory, getRandomNumber } from "../engine";

import Cursor from "./Cursor";
import Food from "./Food";

export default class BugTap extends Game {
  private cursorFactory: GameObjectFactory<Cursor>;
  private foodFactory: GameObjectFactory<Food>;

  constructor(canvasId: string) {
    super(canvasId);

    this.cursorFactory = new GameObjectFactory<Cursor>(
      this.canvas,
      this.context,
      Cursor
    );

    this.foodFactory = new GameObjectFactory<Food>(
      this.canvas,
      this.context,
      // @ts-ignore: Ignoring type error for factory function with specific arguments
      (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        height: number,
        width: number
      ) => {
        return new Food(canvas, context, x, y, height, width);
      }
    );

    this.initGameObjects();
  }

  /**
   * Create GameOjects and add them to the game.
   */
  private initGameObjects() {
    // Create a cursor to provide visual indicator of the player's mouse
    const cursor = this.cursorFactory.createGameObject();

    // Create food randomly spread near the center of the table
    let food = this.generateFood(6);

    this.addGameObjects([cursor, ...food]);
  }

  /**
   * Generate an array of Food objects with random positions.
   *
   * @param amount The number of Food objects to generate.
   * @returns An array of Food objects.
   */
  private generateFood(amount: number): Food[] {
    return Array.from({ length: amount }, () => {
      // Generate random positions specified by the bound variables
      const x = getRandomNumber(150, 744);
      const y = getRandomNumber(100, 444);

      // Create a Food object with the random positions
      return this.foodFactory.createGameObject(x, y, 56, 56);
    });
  }
}
