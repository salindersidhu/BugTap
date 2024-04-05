/**
 * An abstract class used to create objects for a game with abstract methods
 * for updating state and rendering.
 *
 * @abstract
 * @author Salinder Sidhu
 */
export default abstract class Entity {
  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;

  private _isPausable: boolean;
  private _drawPriority: number;

  private _delete: boolean = false;

  /**
   * Create a new Entity instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   * @param drawPriority The priority for rendering the entity (default is 0).
   * @param isPausable Indicates if the entity is pausable (default is true).
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    drawPriority: number = 0,
    isPausable: boolean = true
  ) {
    this.canvas = canvas;
    this.context = context;

    this._isPausable = isPausable;
    this._drawPriority = drawPriority;
  }

  /**
   * Abstract function that updates the Entity.
   *
   * @abstract
   * @param fps The current frames per second.
   * @param entities An array of Entity instances.
   */
  abstract update(fps: number, entities: Entity[]): void;

  /**
   * Abstract function that renders the Entity.
   *
   * @abstract
   */
  abstract render(): void;

  /**
   * Flag the Entity to be deleted.
   */
  delete() {
    this._delete = true;
  }

  /**
   * Indicate if the Entity is deleted.
   *
   * @returns True if the Entity is deleted, otherwise false.
   */
  isDeleted() {
    return this._delete;
  }

  /**
   * Return the draw priority of the Entity.
   *
   * @returns The draw priority of the Entity.
   */
  drawPriority() {
    return this._drawPriority;
  }

  /**
   * Indicate if the Entity can be paused.
   *
   * @returns True if the Entity can be paused, otherwise false.
   */
  isPausable() {
    return this._isPausable;
  }
}
