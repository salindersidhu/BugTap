import GameObject from "./GameObject";

/**
 * Enum representing the possible states of the game.
 */
enum State {
  PAUSED,
  RUNNING,
  STOPPED,
}

/**
 * Manage the control flow, update and rendering of the game.
 *
 * @author Salinder Sidhu
 */
export default class Game {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected fps: number = 0;

  private _gameObjects: GameObject[] = [];
  private _state: State = State.STOPPED;
  private _lastFrameTime = performance.now();
  private _frameCount = 0;

  /**
   * Create a new Game instance.
   *
   * @param canvasId The id of the HTML canvas element.
   * @throws Error if the canvas element with the specified id is not found.
   */
  constructor(canvasId: string) {
    if (!canvasId) {
      throw Error("Please provide an HTMLCanvasElement id");
    }

    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)!;
    this.context = this.canvas.getContext("2d")!;

    this._loop();
  }

  /**
   * Add a GameObject to the game.
   *
   * @param gameObject The GameObject instance to add to the game.
   */
  protected addGameObject(gameObject: GameObject) {
    this._gameObjects.push(gameObject);
  }

  /**
   * Add a collection of GameObjects to the game.
   *
   * @param gameObjects An array of GameObject instances to add to the game.
   */
  protected addGameObjects(gameObjects: GameObject[]) {
    this._gameObjects.push(...gameObjects);
  }

  /**
   * Return all GameObject instances added to the game.
   *
   * @returns A collection of all GameObject instances added to the game.
   */
  protected getGameObjects(): GameObject[] {
    return this._gameObjects;
  }

  /**
   * Return all GameObject instances, of a specific type, added to the game.
   *
   * @template T The type of GameObjects to fetch.
   * @param type The constructor representing the type of GameObjectsto fetch.
   * @returns A collection of all GameObject instances, of the specified type,
   * added to the game.
   */
  protected getGameObjectsOfType<T extends GameObject>(type: {
    new (...args: any[]): T;
  }): T[] {
    return this._gameObjects.filter(
      (gameObject) => gameObject instanceof type
    ) as T[];
  }

  /**
   * Indicate if the game is paused.
   *
   * @returns True if the game is paused, otherwise false.
   */
  protected isPaused(): boolean {
    return this._state === State.PAUSED;
  }

  /**
   * Indicate if the game is running.
   *
   * @returns True if the game is running, otherwise false.
   */
  protected isRunning(): boolean {
    return this._state === State.RUNNING;
  }

  /**
   * Indicate if the game is stopped.
   *
   * @returns True if the game is stopped, otherwise false.
   */
  protected isStopped(): boolean {
    return this._state === State.STOPPED;
  }

  /**
   * Start the game.
   */
  protected start() {
    if (!this.isStopped()) {
      return;
    }

    this._state = State.RUNNING;
  }

  /**
   * Pause the game.
   */
  protected pause() {
    if (this.isStopped()) {
      return;
    }

    this._state = State.PAUSED;
  }

  /**
   * Resume the game.
   */
  protected resume() {
    if (this.isStopped()) {
      return;
    }

    this._state = State.RUNNING;
  }

  /**
   * Main game loop that continuously updates the frames per second, updates
   * game objects, and renders the game.
   */
  private _loop = () => {
    this._updateFps();
    this._update(this.fps);
    this._render();

    requestAnimationFrame(this._loop);
  };

  /**
   * Update all GameObjects based on the current state of the game and the
   * frames per second. If the game is stopped or if a pausable GameObject is
   * paused, it will not be updated. Each GameObject's update method is called,
   * and if it can be deleted, it will be removed from the game.
   *
   * @param fps The current frames per second.
   */
  private _update(fps: number) {
    this._gameObjects.forEach((gameObject) => {
      if (
        this._state === State.STOPPED ||
        (gameObject.isPausable() && this._state === State.PAUSED)
      ) {
        return;
      }

      gameObject.update(fps);
      if (gameObject.canDelete()) {
        this._deleteGameObject(gameObject);
      }
    });
  }

  /**
   * Render all GameObjects in sorted order based on their draw priority.
   */
  private _render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._gameObjects
      .sort(this._sortGameObjectsByDrawPriority)
      .forEach((gameObject) => gameObject.render());
  }

  /**
   * Update the frames per second of the game based on the time elapsed since
   * the last frame.
   */
  private _updateFps() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this._lastFrameTime;

    this._frameCount++;

    this.fps = Math.round((this._frameCount * 1000) / deltaTime);
    this._frameCount = 0;
    this._lastFrameTime = currentTime;
  }

  /**
   * Delete a GameObject from the game.
   *
   * @param gameObject The GameObject instance to delete.
   */
  private _deleteGameObject(gameObjectToDelete: GameObject) {
    this._gameObjects = this._gameObjects.filter(
      (gameObject) => gameObject !== gameObjectToDelete
    );
  }

  /**
   * Comparator function used to sort game objects by their draw priority.
   * Lower draw priority values will be rendered first.
   *
   * @param gameObjectA The first GameObject to compare.
   * @param gameObjectB The second GameObject to compare.
   * @returns A negative value if gameObjectA has lower draw priority, a
   * positive value if gameObjectB has lower draw priority, or zero if both
   * have equal draw priority.
   */
  private _sortGameObjectsByDrawPriority(
    gameObjectA: GameObject,
    gameObjectB: GameObject
  ) {
    return gameObjectA.drawPriority() - gameObjectB.drawPriority();
  }
}
