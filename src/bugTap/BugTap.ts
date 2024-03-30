import { Game, formatSeconds, getRandomNumber } from "../engine";

import Bug from "./Bug";
import Cursor from "./Cursor";
import Countdown from "./Countdown";
import Food from "./Food";
import Level from "./Level";
import Point from "./Point";

import BugManager from "./BugManager";
import FoodManager from "./FoodManager";

const AMOUNT_OF_FOOD: number = 10;
const COUNTDOWN_SECONDS: number = 3;
const MAX_BUGS_TO_SPAWN: number = 3;
const MAX_SPAWN_INTERVAL: number = 1500;
const MIN_BUGS_TO_SPAWN: number = 1;
const MIN_SPAWN_INTERVAL: number = 800;

/**
 * @author Salinder Sidhu
 */
export default class BugTap extends Game {
  private bugManager: BugManager;
  private foodManager: FoodManager;

  private _time: number = 0;
  private _score: number = 0;

  private _bugSpawnTimeout: NodeJS.Timeout | null = null;
  private _timeElapsedTimeout: NodeJS.Timeout | null = null;

  constructor(canvasId: string) {
    super(canvasId);

    this.bugManager = BugManager.getInstance(this.canvas, this.context);
    this.foodManager = FoodManager.getInstance(this.canvas, this.context);

    const level = new Level(this.canvas, this.context);
    const cursor = new Cursor(this.canvas, this.context);
    this.addGameObjects([level, cursor]);

    this._initEventHandlers();
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

    const restartButton = document.getElementById("restart-button");
    restartButton?.addEventListener("click", this._restartGameOnClick);

    this.canvas.addEventListener("mousedown", this._canvasOnClick);
  }

  /**
   * Handle event when restart game button is clicked.
   */
  private _restartGameOnClick = () => {
    const gameOverSection = document.getElementById("score-section");
    const gameSection = document.getElementById("game-section");
    gameOverSection?.classList.add("hidden");
    gameSection?.classList.remove("hidden");

    this._restartGame();
  };

  /**
   * Handle event when the start button is clicked.
   */
  private _startButtonOnClick = () => {
    const welcomeSection = document.getElementById("welcome-section");
    const gameSection = document.getElementById("game-section");
    welcomeSection?.classList.add("hidden");
    gameSection?.classList.remove("hidden");

    this._restartGame();
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
  private _canvasOnClick = (event: MouseEvent) => {
    const numFood = this.getGameObjectsOfType(Food).length;

    if (!this.isRunning() || numFood < 1) {
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

      const score = document.getElementById("game-score");
      score!.innerHTML = this._score.toString();

      bug.setDead();
    }
  };

  /**
   * Reset the game.
   */
  private _restartGame() {
    // Create a countdown
    const countdown = new Countdown(
      this.canvas,
      this.context,
      COUNTDOWN_SECONDS
    );
    this.addGameObject(countdown);

    // Start the game and initalize food
    this.start();
    this._initFood();

    // Reset the time elapsed and score
    this._setTime(0);
    this._setScore(0);

    // Start game handlers after the countdown
    setTimeout(() => {
      this._handleBugSpawn();
      this._handleTimeElapsed();
      this._handleGameOver();
    }, COUNTDOWN_SECONDS * 1000);
  }

  /**
   * Spawn bugs at random times.
   */
  private _handleBugSpawn() {
    const bugSpawn = () => {
      const numFood = this.getGameObjectsOfType(Food).length;

      if (this.isRunning() && numFood > 0) {
        const numBugsToSpawn = getRandomNumber(
          MIN_BUGS_TO_SPAWN,
          MAX_BUGS_TO_SPAWN
        );
        Array(numBugsToSpawn)
          .fill(null)
          .forEach(() => {
            const bug = this.bugManager.spawn(this.canvas);
            this.addGameObject(bug);
          });
      }

      const spawnInterval = getRandomNumber(
        MIN_SPAWN_INTERVAL,
        MAX_SPAWN_INTERVAL
      );
      this._bugSpawnTimeout = setTimeout(bugSpawn, spawnInterval);
    };

    bugSpawn();
  }

  /**
   * Handle the time elapsed counter.
   */
  private _handleTimeElapsed() {
    const time = document.getElementById("game-time");
    const numFood = this.getGameObjectsOfType(Food).length;

    const timeElapsed = () => {
      if (numFood < 1) {
        return;
      }

      if (!this.isPaused()) {
        this._time++;
        time!.innerHTML = formatSeconds(this._time);
      }

      this._timeElapsedTimeout = setTimeout(timeElapsed, 1000);
    };

    timeElapsed();
  }

  /**
   * Handle when the game is over. Game over occurs when there is no food on the
   * table and all the bugs have fled.
   */
  private _handleGameOver() {
    const time = document.getElementById("game-over-time");
    const score = document.getElementById("game-over-score");

    const gameSection = document.getElementById("game-section");
    const gameOverSection = document.getElementById("score-section");

    const gameOver = () => {
      const numBugs = this.getGameObjectsOfType(Bug).length;
      const numFood = this.getGameObjectsOfType(Food).length;

      if (this.isRunning() && numFood < 1 && numBugs < 1) {
        gameSection?.classList.add("hidden");
        gameOverSection?.classList.remove("hidden");

        time!.innerHTML = formatSeconds(this._time);
        score!.innerHTML = this._score.toString();

        this.stop();

        if (this._bugSpawnTimeout !== null) {
          clearTimeout(this._bugSpawnTimeout);
          this._bugSpawnTimeout = null;
        }
        if (this._timeElapsedTimeout !== null) {
          clearTimeout(this._timeElapsedTimeout);
          this._timeElapsedTimeout = null;
        }

        return;
      }
      setTimeout(gameOver, 1000);
    };

    gameOver();
  }

  /**
   * Create food spread randomly near the center of the table.
   */
  private _initFood() {
    const food = this.foodManager.generate(AMOUNT_OF_FOOD);
    this.bugManager.receiveFood(food);
    this.addGameObjects(food);
  }

  /**
   * Set the game time to the specified value and update the displayed game time.
   *
   * @param time The new game time value.
   */
  private _setTime(time: number) {
    this._time = time;

    const gameTime = document.getElementById("game-time");
    gameTime!.innerHTML = formatSeconds(this._time);
  }

  /**
   * Set the game score to the specified points and update the displayed game
   * score.
   *
   * @param points The points to set as the new game score.
   */
  private _setScore(points: number) {
    this._score = points;

    const gameScore = document.getElementById("game-score");
    gameScore!.innerHTML = this._score.toString();
  }
}
