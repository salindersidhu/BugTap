import { Game, clearStore, getRandomNumber, setToStore } from "../engine";

import Bug from "./Bug";
import Cursor from "./Cursor";
import Food from "./Food";
import Level from "./Level";
import Point from "./Point";

import BugManager from "./BugManager";
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

  private bugManager: BugManager;
  private foodManager: FoodManager;

  private _time: number = 0;
  private _score: number = 0;

  private _food: Food[] = [];

  constructor(canvasId: string) {
    super(canvasId);

    this.bugManager = BugManager.getInstance(this.canvas, this.context);
    this.foodManager = FoodManager.getInstance(this.canvas, this.context);

    const level = new Level(this.canvas, this.context);
    const cursor = new Cursor(this.canvas, this.context);
    this.addGameObjects([level, cursor]);

    this._initEventHandlers();

    clearStore();
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
        this._pauseButtonOnClick();
      }
    });

    const button = document.getElementById("pause-resume-button");
    button?.addEventListener("click", this._pauseButtonOnClick);

    const startButton = document.getElementById("start-button");
    startButton?.addEventListener("click", this._startButtonOnClick);

    this.canvas.addEventListener("mousedown", this._canvasOnMouseClick);
  }

  /**
   * Handle event when the start button is clicked.
   */
  private _startButtonOnClick = () => {
    this.start();
    this._initFood();
    this._spawnBugsRandomly();
    this._startTimeElapsed();

    const welcomeSection = document.getElementById("welcome-section");
    const gameSection = document.getElementById("game-section");
    welcomeSection?.classList.add("hidden");
    gameSection?.classList.remove("hidden");
  };

  /**
   * Handle event when the pause button is clicked.
   */
  private _pauseButtonOnClick = () => {
    this.isPaused() ? this.resume() : this.pause();

    const button = document.getElementById("pause-resume-button");
    if (this.isPaused()) {
      button?.setAttribute("src", "assets/graphics/play.png");
    } else if (this.isRunning()) {
      button?.setAttribute("src", "assets/graphics/pause.png");
    }
  };

  /**
   * Handle event when the game canvas is clicked.
   */
  private _canvasOnMouseClick = (event: MouseEvent) => {
    if (!this.isRunning() || this._food.length < 1) {
      return;
    }

    for (const bug of this.getGameObjectsOfType(Bug)) {
      if (!bug.boundingBox.isOverlappingPoint(event.offsetX, event.offsetY)) {
        continue;
      }

      if (!bug.isAlive()) {
        continue;
      }

      const points = bug.getPoints();
      this._score += points;

      const point = new Point(
        this.canvas,
        this.context,
        points,
        bug.boundingBox.x,
        bug.boundingBox.y
      );
      this.addGameObject(point);

      const score = document.getElementById("score");
      score!.innerHTML = `Score: ${this._score}`;

      setToStore("score", this._score.toString());
      bug.setDead();
    }
  };

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

    const startTimeElapsed = () => {
      if (this._food.length < 1) {
        return;
      }

      if (!this.isPaused()) {
        this._time++;
        time!.innerHTML = `Time: ${formatSeconds(this._time)}`;
        setToStore("time", this._time.toString());
      }
      setTimeout(startTimeElapsed, 1000);
    };

    startTimeElapsed();
  }

  /**
   * Spawn a bug and add it to the game.
   */
  private _spawnBug() {
    const bug = this.bugManager.spawn(this.canvas);
    this.addGameObject(bug);
  }
}
