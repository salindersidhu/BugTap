import type BoundingBox from "./BoundingBox";

/**
 * The GameObject module acts as an abstract object used to build objects
 * for a game with abstract methods for updating and rendering the objects.
 *
 * @abstract
 * @author Salinder Sidhu
 */
export default abstract class GameObject {
  protected drawPriority: number;
  protected canDelete: boolean;
  protected boundingBox!: BoundingBox;

  constructor() {
    this.drawPriority = 0;
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
  abstract render(): void;

  /**
   * Flag the GameObject to be deleted.
   */
  flagToDelete() {
    this.canDelete = true;
  }
}
