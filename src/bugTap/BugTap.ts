import { Game } from "../engine";

import Cursor from "./Cursor";
import FoodManager from "./FoodManager";

/**
 * @author Salinder Sidhu
 */
export default class BugTap extends Game {
  private foodManager: FoodManager;

  constructor(canvasId: string) {
    super(canvasId);

    this.foodManager = FoodManager.getInstance(this.canvas, this.context);

    this.initGameObjects();
  }

  /**
   * Create GameOjects and add them to the game.
   */
  private initGameObjects() {
    // Create a cursor to provide a visual indicator of the player's mouse
    const cursor = new Cursor(this.canvas, this.context);

    // Create food randomly spread near the center of the table
    const food = this.foodManager.generateFood(8);

    this.addGameObjects([cursor, ...food]);
  }
}