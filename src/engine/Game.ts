import Entity from "./Entity";

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

  private _entities: Entity[] = [];
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
   * Add an Entity to the game.
   *
   * @param entity The Entity instance to add to the game.
   */
  protected addEntity(entity: Entity) {
    this._entities.push(entity);
  }

  /**
   * Add a collection of Entity instances to the game.
   *
   * @param entities An array of Entity instances to add to the game.
   */
  protected addEntities(entities: Entity[]) {
    this._entities.push(...entities);
  }

  /**
   * Return all Entity instances added to the game.
   *
   * @returns A collection of all Entity instances added to the game.
   */
  protected getEntities(): Entity[] {
    return this._entities;
  }

  /**
   * Return all Entity instances, of a specific type, added to the game.
   *
   * @template T The type of Entity instances to fetch.
   * @param type The constructor representing the type of Entity instances.
   * @returns A collection of all Entity instances, of the specified type,
   * added to the game.
   */
  protected getEntitiesOfType<T extends Entity>(type: {
    new (...args: any[]): T;
  }): T[] {
    return this._entities.filter((entity) => entity instanceof type) as T[];
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
   * Stop the game.
   */
  protected stop() {
    this._state = State.STOPPED;
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
   * Update all Entity insstances based on the current state of the game and
   * the frames per second. If the game is stopped or if a pausable Entity is
   * paused, it will not be updated. Each Entity's update method is called,
   * and if it can be deleted, it will be removed from the game.
   *
   * @param fps The current frames per second.
   */
  private _update(fps: number) {
    this._entities.forEach((entity) => {
      if (
        this._state === State.STOPPED ||
        (entity.isPausable() && this._state === State.PAUSED)
      ) {
        return;
      }

      entity.update(fps);
      if (entity.canDelete()) {
        this._deleteEntity(entity);
      }
    });
  }

  /**
   * Render all Entity instances in sorted order based on their draw priority.
   */
  private _render() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this._entities
      .sort(this._sortEntitiesByDrawPriority)
      .forEach((entity) => entity.render());
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
   * Delete an Entity from the game.
   *
   * @param targetEntity The Entity to delete.
   */
  private _deleteEntity(targetEntity: Entity) {
    this._entities = this._entities.filter((entity) => entity !== targetEntity);
  }

  /**
   * Comparator function used to sort game objects by their draw priority.
   * Lower draw priority values will be rendered first.
   *
   * @param entityA The first Entity to compare.
   * @param entityB The second Entity to compare.
   * @returns A negative value if EntityA has lower draw priority, a positive
   * value if EntityB has lower draw priority, or zero if both have equal draw
   * priority.
   */
  private _sortEntitiesByDrawPriority(entityA: Entity, entityB: Entity) {
    return entityA.drawPriority() - entityB.drawPriority();
  }
}
