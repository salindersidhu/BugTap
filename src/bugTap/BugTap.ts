import {
  Game,
  filterObjectsByType,
  formatSeconds,
  getRandomNumber,
} from "../engine";

import Bug from "./Bug";
import Cursor from "./Cursor";
import Countdown from "./Countdown";
import Food from "./Food";
import Level from "./Level";
import Point from "./Point";

import BugManager from "./BugManager";
import FoodManager from "./FoodManager";

const AMOUNT_OF_FOOD: number = 10;
const COUNTDOWN: number = 3;
const MAX_BUGS_TO_SPAWN: number = 3;
const MAX_SPAWN_INTERVAL: number = 1500;
const MIN_BUGS_TO_SPAWN: number = 1;
const MIN_SPAWN_INTERVAL: number = 800;

/**
 * Represents the BugTap game, a simple clicker game where the player taps on
 * bugs to earn points before they eat all of the food.
 *
 * @author Salinder Sidhu
 */
export default class BugTap extends Game {
  private _time: number = 0;
  private _score: number = 0;

  private _isGameOver: boolean = false;

  private _bugSpawnTimeout: NodeJS.Timeout | null = null;
  private _timeElapsedTimeout: NodeJS.Timeout | null = null;

  /**
   * Create a new BugTap Game instance.
   *
   * @param canvasId The id of the HTML canvas element used for rendering the
   * game.
   */
  constructor(canvasId: string) {
    super(canvasId);

    this._initEventHandlers();
  }

  /**
   * Initialize event handlers for the game.
   */
  private _initEventHandlers() {
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.code !== "Space") {
        return;
      }

      this._pauseButton__OnClick();
    });

    const button = document.getElementById("pause-resume-button");
    button?.addEventListener("click", this._pauseButton__OnClick);

    const startButton = document.getElementById("start-button");
    startButton?.addEventListener("click", this._startButton__OnClick);

    const restartButton = document.getElementById("restart-button");
    restartButton?.addEventListener("click", this._restartGame__OnClick);

    const gameButton = document.getElementById("game-link");
    gameButton?.addEventListener("click", this._gameButton__onClick);

    const highScoreButton = document.getElementById("high-score-link");
    highScoreButton?.addEventListener("click", this._highScoreButton_onClick);

    this.canvas.addEventListener("mousedown", this._canvas__OnClick);
  }

  /**
   * Handle event when restart game button is clicked.
   */
  private _restartGame__OnClick = () => {
    const gameOverSection = document.getElementById("game-over-section");
    const gameSection = document.getElementById("game-section");
    gameOverSection?.classList.add("hidden");
    gameSection?.classList.remove("hidden");

    this._restartGame();
  };

  /**
   * Handle event when the start button is clicked.
   */
  private _startButton__OnClick = () => {
    const welcomeSection = document.getElementById("welcome-section");
    const gameSection = document.getElementById("game-section");
    welcomeSection?.classList.add("hidden");
    gameSection?.classList.remove("hidden");

    this._restartGame();
  };

  /**
   * Handle event when the pause button is clicked.
   */
  private _pauseButton__OnClick = () => {
    this.isPaused() ? this.resume() : this.pause();

    const buttonIcon = document
      .getElementById("pause-resume-button")
      ?.getElementsByTagName("i")[0];

    if (this.isPaused()) {
      buttonIcon?.classList.replace("fa-pause", "fa-play");
    } else if (this.isRunning()) {
      buttonIcon?.classList.replace("fa-play", "fa-pause");
    }
  };

  /**
   * Handle event when the game canvas is clicked.
   *
   * @param event The MouseEvent representing the click event on the game
   * canvas.
   */
  private _canvas__OnClick = (event: MouseEvent) => {
    const numFood = filterObjectsByType(this.entities, Food).length;
    if (!this.isRunning() || numFood < 1) {
      return;
    }

    const bugs = filterObjectsByType(this.entities, Bug);
    for (const bug of bugs) {
      if (
        !bug.boundingBox.isOverlappingPoint(event.offsetX, event.offsetY) ||
        !bug.isAlive()
      ) {
        continue;
      }

      const points = bug.getPoints();
      this._setScore(this._score + points);

      const point = new Point(
        this.canvas,
        this.context,
        points,
        bug.boundingBox.x,
        bug.boundingBox.y
      );
      this.addEntity(point);

      bug.setDead();
    }
  };

  /**
   * Update the state of game and high score buttons based on whether the game
   * view is active.
   *
   * @param isGameActive Indicates whether the game view is currently active.
   */
  private _updateButtonStates(isGameActive: boolean) {
    const gameButton = document.getElementById("game-link");
    const highScoreButton = document.getElementById("high-score-link");

    gameButton?.classList.toggle("active", isGameActive);
    highScoreButton?.classList.toggle("active", !isGameActive);
  }

  /**
   * Handle the click event on the game button.
   */
  private _gameButton__onClick = () => {
    if (!this.isStopped()) {
      return;
    }

    this._updateButtonStates(true);

    const welcomeSection = document.getElementById("welcome-section");
    const gameOverSection = document.getElementById("game-over-section");
    const highScoreSection = document.getElementById("high-score-section");

    gameOverSection?.classList.toggle("hidden", !this._isGameOver);
    welcomeSection?.classList.toggle("hidden", this._isGameOver);
    highScoreSection?.classList.add("hidden");
  };

  /**
   * Handle the click event on the high score button.
   */
  private _highScoreButton_onClick = () => {
    if (!this.isStopped()) {
      return;
    }

    this._updateButtonStates(false);

    const welcomeSection = document.getElementById("welcome-section");
    const gameOverSection = document.getElementById("game-over-section");
    const highScoreSection = document.getElementById("high-score-section");

    welcomeSection?.classList.add("hidden");
    gameOverSection?.classList.add("hidden");
    highScoreSection?.classList.remove("hidden");
  };

  /**
   * Reset the game.
   */
  private _restartGame() {
    this.clearAllEntities();

    // Create food, Level, Cursor and Countdown
    const foodManager = FoodManager.getInstance(this.canvas, this.context);
    const food = foodManager.generate(AMOUNT_OF_FOOD);
    const level = new Level(this.canvas, this.context);
    const cursor = new Cursor(this.canvas, this.context);
    const countdown = new Countdown(this.canvas, this.context, COUNTDOWN);
    this.addEntities([level, cursor, countdown, ...food]);

    this.start();

    // Reset the time elapsed and score
    this._setTime(0);
    this._setScore(0);

    // Start game handlers when the countdown is completed
    this._checkCountdown();
  }

  /**
   * Check if the countdown has completed, then start the game handlers.
   */
  private _checkCountdown = () => {
    const numCountdown = filterObjectsByType(this.entities, Countdown).length;
    if (numCountdown < 1) {
      this._initGameHandlers();
      return;
    }
    setTimeout(this._checkCountdown, 100);
  };

  /**
   * Initialize the game handlers including bug spawning, time elapsed tracking
   * and game over detection.
   */
  private _initGameHandlers() {
    this._handleSpawningBugs();
    this._handleTimeElapsed();
    this._handleGameOver();
  }

  /**
   * Spawn bugs at random times.
   */
  private _handleSpawningBugs() {
    const bugManager = BugManager.getInstance(this.canvas, this.context);

    const spawnBugs = () => {
      const numFood = filterObjectsByType(this.entities, Food).length;

      if (this.isRunning() && numFood > 0) {
        const numBugsToSpawn = getRandomNumber(
          MIN_BUGS_TO_SPAWN,
          MAX_BUGS_TO_SPAWN
        );
        Array(numBugsToSpawn)
          .fill(null)
          .forEach(() => {
            const bug = bugManager.spawn(this.canvas);
            this.addEntity(bug);
          });
      }

      const spawnInterval = getRandomNumber(
        MIN_SPAWN_INTERVAL,
        MAX_SPAWN_INTERVAL
      );
      this._bugSpawnTimeout = setTimeout(spawnBugs, spawnInterval);
    };

    spawnBugs();
  }

  /**
   * Handle the time elapsed counter.
   */
  private _handleTimeElapsed() {
    const timeElapsed = () => {
      const numFood = filterObjectsByType(this.entities, Food).length;
      if (numFood < 1) {
        return;
      }

      if (!this.isPaused()) {
        this._setTime(this._time + 1);
      }

      this._timeElapsedTimeout = setTimeout(timeElapsed, 1000);
    };

    timeElapsed();
  }

  /**
   * Handle when the game is over. Game over occurs when there is no food on
   * the table and all the bugs have fled.
   */
  private _handleGameOver() {
    const checkAndHandleGameOver = () => {
      const numBugs = filterObjectsByType(this.entities, Bug).length;
      const numFood = filterObjectsByType(this.entities, Food).length;

      if (this.isRunning() && numFood < 1 && numBugs < 1) {
        this._isGameOver = true;
        this._gameOverActions();
        return;
      }
      setTimeout(checkAndHandleGameOver, 1000);
    };

    // Start checking for game over
    checkAndHandleGameOver();
  }

  /**
   * Define the actions to be taken when the game is over.
   */
  private _gameOverActions = () => {
    const time = document.getElementById("game-over-time");
    const score = document.getElementById("game-over-score");
    const gameSection = document.getElementById("game-section");
    const gameOverSection = document.getElementById("game-over-section");

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
  };

  /**
   * Set the game time to the specified value and update the displayed game
   * time.
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
