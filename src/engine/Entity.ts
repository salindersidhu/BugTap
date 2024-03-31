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
  private _canDelete: boolean;
  private _drawPriority: number;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    drawPriority: number = 0,
    isPausable: boolean = true
  ) {
    this.canvas = canvas;
    this.context = context;
    this._isPausable = isPausable;
    this._canDelete = false;
    this._drawPriority = drawPriority;
  }

  /**
   * Abstract function that updates the Entity.
   *
   * @abstract
   * @param fps The current frames per second.
   */
  abstract update(fps: number): void;

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
    this._canDelete = true;
  }

  /**
   * Indicate if the Entity can be deleted.
   *
   * @returns True if the Entity can be deleted, otherwise false.
   */
  canDelete() {
    return this._canDelete;
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
