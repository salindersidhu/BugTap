import { Game } from "../engine";

import Cursor from "./Cursor";

import BugManager from "./BugManager";
import FoodManager from "./FoodManager";

/**
 * @author Salinder Sidhu
 */
export default class BugTap extends Game {
  private bugManager: BugManager;
  private foodManager: FoodManager;

  constructor(canvasId: string) {
    super(canvasId);

    this.bugManager = BugManager.getInstance(this.canvas, this.context);
    this.foodManager = FoodManager.getInstance(this.canvas, this.context);

    this.initGameObjects();
    this.initEventHandlers();
  }

  /**
   * Create GameOjects and add them to the game.
   */
  private initGameObjects() {
    // Create a cursor to provide a visual indicator of the player's mouse
    const cursor = new Cursor(this.canvas, this.context);

    // Create food randomly spread near the center of the table
    const food = this.foodManager.generate(8);

    this.addGameObjects([cursor, ...food]);
  }

  /**
   * Initialize event handlers for the game.
   */
  private initEventHandlers() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        this.togglePause();
      }
    });
  }
}
