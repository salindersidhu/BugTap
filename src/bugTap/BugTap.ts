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

    const cursor = this.cursorManager.create();
    this.addGameObject(cursor);

    this._initEventHandlers();
  }

  /**
   * Create food spread randomly near the center of the table.
   */
  private _initFood() {
    this._food = this.foodManager.generate(this.AMOUNT_OF_FOOD);
    this.bugManager.receiveFood(this._food);

    this.addGameObjects(this._food);
  }

  /**
   * Initialize event handlers for the game.
   */
  private _initEventHandlers() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        this.isPaused() ? this.resume() : this.pause();
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      if (this.isStopped()) {
        this.start();
        this._initFood();
        this._spawnBugsRandomly();
      }
    });
  }

  /**
   * Spawn bugs continuously at random times.
   */
  private _spawnBugsRandomly() {
    const spawnBugRandomly = () => {
      if (this.isRunning() && this._food.length > 0) {
        const numBugsToSpawn = getRandomNumber(
          this.MIN_BUGS_TO_SPAWN,
          this.MAX_BUGS_TO_SPAWN
        );
        Array(numBugsToSpawn)
          .fill(null)
          .forEach(() => {
            this._spawnBug();
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
  private _spawnBug() {
    const bug = this.bugManager.spawn(this.canvas);
    this.addGameObject(bug);
  }
}
