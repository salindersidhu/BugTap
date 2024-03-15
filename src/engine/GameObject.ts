import type BoundingBox from "./BoundingBox";

/**
 * GameObject is an abstract class used to create objects for a game with
 * abstract methods for updating state and rendering.
 *
 * @abstract
 * @author Salinder Sidhu
 */
export default abstract class GameObject {
  protected drawPriority: number;
  protected canDelete: boolean;
  protected boundingBox!: BoundingBox;

  constructor(drawPriority: number = 0) {
    this.drawPriority = drawPriority;
    this.canDelete = false;
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
  abstract render(context: CanvasRenderingContext2D): void;

  /**
   * Flag the GameObject to be deleted.
   */
  flagAsDelete() {
    this.canDelete = true;
  }

  /**
   * Return the GameObject's draw priority.
   */
  getDrawPriority() {
    return this.drawPriority;
  }
}
