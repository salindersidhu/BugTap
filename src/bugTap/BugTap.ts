import { Game, getRandomNumber } from "../engine";

import Food from "./Food";

import BugManager from "./BugManager";
import CursorManager from "./CursorManager";
import FoodManager from "./FoodManager";

/**
 * @author Salinder Sidhu
 */
export default class BugTap extends Game {
  private readonly AMOUNT_OF_FOOD: number = 10;

  private readonly MIN_BUGS_TO_SPAWN: number = 1;
  private readonly MAX_BUGS_TO_SPAWN: number = 3;
  private readonly MIN_SPAWN_INTERVAL: number = 800;
  private readonly MAX_SPAWN_INTERVAL: number = 1500;

  private cursorManager: CursorManager;
  private bugManager: BugManager;
  private foodManager: FoodManager;

  private _food: Food[] = [];

  constructor(canvasId: string) {
    super(canvasId);

    this.bugManager = BugManager.getInstance(this.canvas, this.context);
    this.cursorManager = CursorManager.getInstance(this.canvas, this.context);
    this.foodManager = FoodManager.getInstance(this.canvas, this.context);

    this.initGameObjects();
    this.initEventHandlers();
    this.spawnBugsRandomly();
  }

  /**
   * Create GameOjects and add them to the game.
   */
  private initGameObjects() {
    // Create a cursor to provide a visual indicator of the player's mouse
    const cursor = this.cursorManager.create();

    // Create food spread randomly near the center of the table
    this._food = this.foodManager.generate(this.AMOUNT_OF_FOOD);
    this.bugManager.receiveFood(this._food);

    this.addGameObjects([cursor, ...this._food]);
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

    this.canvas.addEventListener("mouseup", () => {
      if (this.isStopped()) {
        this.start();
      }
    });
  }

  /**
   * Spawn bugs continuously at random times.
   */
  private spawnBugsRandomly() {
    const spawnBugRandomly = () => {
      if (this.isRunning() && this._food.length > 0) {
        const numBugsToSpawn = getRandomNumber(
          this.MIN_BUGS_TO_SPAWN,
          this.MAX_BUGS_TO_SPAWN
        );
        Array(numBugsToSpawn)
          .fill(null)
          .forEach(() => {
            this.spawnBug();
          });
      }
      const spawnInterval = getRandomNumber(
        this.MIN_SPAWN_INTERVAL,
        this.MAX_SPAWN_INTERVAL
      );
      setTimeout(spawnBugRandomly, spawnInterval);
    };

    spawnBugRandomly();
  }

  /**
   * Spawn a bug and add it to the game.
   */
  private spawnBug() {
    const bug = this.bugManager.spawn(this.canvas);
    this.addGameObject(bug);
  }
}
