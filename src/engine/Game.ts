import GameObject from "./GameObject";

/**
 * Enum representing the possible states of the game.
 */
enum State {
  RUNNING,
  PAUSED,
}

/**
 * Game manages the control, update and rendering of the game.
 *
 * @author Salinder Sidhu
 */
export default class Game {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;
  protected fps: number = 0;

  height: number;
  width: number;

  private _gameObjects: GameObject[] = [];
  private _state: State = State.RUNNING;
  private _lastFrameTime = performance.now();
  private _frameCount = 0;

  /**
   * Constructs a new Game instance.
   *
   * @param canvasId The id of the HTML canvas element.
   * @throws Error if the canvas element with the specified id is not found.
   */
  constructor(canvasId: string) {
    if (!canvasId) {
      throw Error("Invalid canvas element id");
    }

    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)!;
    this.context = this.canvas.getContext("2d")!;
    this.height = this.canvas.height;
    this.width = this.canvas.width;

    this.loop();
  }

  /**
   * Add game objects to the game.
   *
   * @param gameObjects An array of GameObject instances to add to the game.
   */
  addGameObjects(gameObjects: GameObject[]) {
    this._gameObjects.push(...gameObjects);
  }

  /**
   * Start the game loop.
   */
  protected start() {
    this._state = State.RUNNING;
    this.loop();
  }

  /**
   * Toggles the pause/resume state of the game.
   */
  protected togglePause() {
    this._state = this._state === State.PAUSED ? State.RUNNING : State.PAUSED;
    if (this._state === State.RUNNING) {
      this.loop();
    }
  }

  /**
   * Main game loop that updates and renders the game. It is called recursively
   * using requestAnimationFrame.
   */
  private loop = () => {
    if (this._state !== State.RUNNING) {
      return;
    }

    this.updateFps();
    this.update(this.fps);
    this.render();

    requestAnimationFrame(this.loop);
  };

  /**
   * Update all game objects.
   *
   * @param fps The current frames per second.
   */
  private update(fps: number) {
    this._gameObjects.forEach((gameObject) => {
      gameObject.update(fps);

      if (gameObject.canDelete()) {
        this.deleteGameObject(gameObject);
      }
    });
  }

  /**
   * Render all game objects.
   */
  private render() {
    this.context.clearRect(0, 0, this.width, this.height);

    this._gameObjects
      .sort(this.sortGameObjectsByDrawPriority)
      .forEach((gameObject) => gameObject.render());
  }

  /**
   * Update the frames per second (FPS) of the game based on the time elapsed
   * since the last frame.
   */
  private updateFps() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this._lastFrameTime;

    this._frameCount++;

    this.fps = Math.round((this._frameCount * 1000) / deltaTime);
    this._frameCount = 0;
    this._lastFrameTime = currentTime;
  }

  /**
   * Delete a game object from the game.
   *
   * @param gameObject The GameObject instance to delete.
   */
  private deleteGameObject(gameObject: GameObject) {
    const index = this._gameObjects.indexOf(gameObject);

    if (index >= 0) {
      this._gameObjects.splice(index, 1);
    }
  }

  /**
   * Comparator function used to sort game objects by their draw priority.
   * Lower draw priority values will be rendered first.
   *
   * @param gameObjectA The first GameObject to compare.
   * @param gameObjectB The second GameObject to compare.
   * @returns A negative value if gameObjectA has lower draw priority,
   *          a positive value if gameObjectB has lower draw priority,
   *          or zero if both have equal draw priority.
   */
  private sortGameObjectsByDrawPriority(
    gameObjectA: GameObject,
    gameObjectB: GameObject
  ) {
    return gameObjectA.drawPriority() - gameObjectB.drawPriority();
  }
}
