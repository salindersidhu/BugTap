/**
 * GameObject is an abstract class used to create objects for a game with
 * abstract methods for updating state and rendering.
 *
 * @abstract
 * @author Salinder Sidhu
 */
export default abstract class GameObject {
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
   * Abstract function that updates the GameObject.
   *
   * @abstract
   * @param fps The current frames per second.
   */
  abstract update(fps: number): void;

  /**
   * Abstract function that renders the GameObject.
   *
   * @abstract
   */
  abstract render(): void;

  /**
   * Flag the GameObject to be deleted.
   */
  delete() {
    this._canDelete = true;
  }

  /**
   * Checks if the GameObject can be deleted.
   *
   * @returns True if the GameObject can be deleted, otherwise false.
   */
  canDelete() {
    return this._canDelete;
  }

  /**
   * Returns the draw priority of the GameObject.
   *
   * @returns The draw priority of the GameObject.
   */
  drawPriority() {
    return this._drawPriority;
  }

  /**
   * Check if the GameObject is pausable.
   *
   * @returns True if the GameObject is pausable, otherwise false.
   */
  isPausable() {
    return this._isPausable;
  }
}
