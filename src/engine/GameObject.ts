import BoundingBox from "./BoundingBox";

/**
 * GameObject is an abstract class used to create objects for a game with
 * abstract methods for updating state and rendering.
 *
 * @abstract
 * @author Salinder Sidhu
 */
export default abstract class GameObject {
  private _canDelete: boolean;
  private _drawPriority: number;

  protected boundingBox: BoundingBox;

  protected canvas: HTMLCanvasElement;
  protected context: CanvasRenderingContext2D;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    boundingBox: BoundingBox = new BoundingBox(0, 0, 0, 0),
    drawPriority: number = 0
  ) {
    this.canvas = canvas;
    this.context = context;
    this.boundingBox = boundingBox;
    this._canDelete = false;
    this._drawPriority = drawPriority;
  }

  /**
   * Abstract function that updates the GameObject.
   *
   * @abstract
   */
  abstract update(): void;

  /**
   * Abstract function that renders the GameObject.
   *
   * @abstract
   */
  abstract render(): void;

  /**
   * Flag the GameObject to be deleted.
   */
  protected delete() {
    this._canDelete = true;
  }

  /**
   * Indicate if the GameObject can be deleted.
   */
  canDelete() {
    return this._canDelete;
  }

  /**
   * Return the GameObject's draw priority.
   */
  drawPriority() {
    return this._drawPriority;
  }
}
