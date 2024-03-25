import { Howl } from "howler";

import { Game, addToStore, clearStore, getRandomNumber } from "../engine";

import Food from "./Food";
import Bug from "./Bug";

import BugManager from "./BugManager";
import CursorManager from "./CursorManager";
import FoodManager from "./FoodManager";
import Point from "./Point";

const SOUND_POINT: string = "./assets/sound/click.ogg";

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

  private _time: number = 0;
  private _score: number = 0;

  private _food: Food[] = [];

  private _soundPoint: Howl;

  constructor(canvasId: string) {
    super(canvasId);

    this.bugManager = BugManager.getInstance(this.canvas, this.context);
    this.cursorManager = CursorManager.getInstance(this.canvas, this.context);
    this.foodManager = FoodManager.getInstance(this.canvas, this.context);

    const cursor = this.cursorManager.create();
    this.addGameObject(cursor);

    this._initEventHandlers();

    clearStore();

    this._soundPoint = new Howl({
      src: [SOUND_POINT],
      html5: true,
    });
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
    const button = document.getElementById("pause-resume-button");
    const score = document.getElementById("score");

    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code === "Space") {
        this.isPaused() ? this.resume() : this.pause();

        if (this.isPaused()) {
          button?.setAttribute("src", "assets/graphics/play.png");
        } else if (this.isRunning()) {
          button?.setAttribute("src", "assets/graphics/pause.png");
        }
      }
    });

    button?.addEventListener("click", () => {
      this.isPaused() ? this.resume() : this.pause();

      if (this.isStopped()) {
        this.start();
        this._initFood();
        this._spawnBugsRandomly();
        this._startTimeElapsed();
      }

      if (this.isPaused()) {
        button.setAttribute("src", "assets/graphics/play.png");
      } else if (this.isRunning()) {
        button.setAttribute("src", "assets/graphics/pause.png");
      }
    });

    this.canvas.addEventListener("mouseup", () => {
      if (this.isStopped()) {
        button?.setAttribute("src", "assets/graphics/pause.png");

        this.start();
        this._initFood();
        this._spawnBugsRandomly();
        this._startTimeElapsed();
      }
    });

    this.canvas.addEventListener("mousedown", (event: MouseEvent) => {
      for (const gameObject of this.getGameObjects()) {
        if (gameObject instanceof Bug) {
          if (
            (gameObject as Bug).boundingBox.isOverlappingPoint(
              event.offsetX,
              event.offsetY
            )
          ) {
            if (gameObject.isAlive()) {
              this._soundPoint.play();
              const points = gameObject.getPoints();
              this._score += points;

              const point = new Point(
                this.canvas,
                this.context,
                points,
                gameObject.boundingBox.x,
                gameObject.boundingBox.y
              );
              this.addGameObject(point);

              score!.innerHTML = `Score: ${this._score}`;
              addToStore("score", this._score.toString());
              gameObject.setDead();
            }
          }
        }
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
   * Start the time elapsed counter.
   */
  private _startTimeElapsed() {
    const time = document.getElementById("time");

    function formatSeconds(seconds: number) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const paddedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
      return `${minutes}:${paddedSeconds}`;
    }

    const startTime = () => {
      if (!this.isPaused()) {
        this._time++;
        time!.innerHTML = `Time: ${formatSeconds(this._time)}`;
        addToStore("time", this._time.toString());
      }
      setTimeout(startTime, 1000);
    };

    startTime();
  }

  /**
   * Spawn a bug and add it to the game.
   */
  private _spawnBug() {
    const bug = this.bugManager.spawn(this.canvas);
    this.addGameObject(bug);
  }
}
