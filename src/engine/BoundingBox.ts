/**
 * BoundingBox provides functions for calculating bounding box collision
 * detection.
 *
 * @author Salinder Sidhu
 */
export default class BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;

  /**
   * Create an instance of BoundingBox.
   *
   * @param x The BoundingBox's initial x position coordinate.
   * @param y The BoundingBox's initial y position coordinate.
   * @param width The BoundingBox's width.
   * @param height The BoundingBox's height.
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Indicate if this bounding box completely overlaps another bounding box.
   *
   * @param bbox A BoundingBox.
   * @returns True if this bounding box completely overlaps another bounding
   * box, otherwise false.
   */
  isOverlapping(bbox: BoundingBox): boolean {
    return (
      this.x <= bbox.x &&
      this.y <= bbox.y &&
      this.x + this.width >= bbox.x + bbox.width &&
      this.y + this.height >= bbox.y + bbox.height
    );
  }

  /**
   * Indicates if this bounding box intersects with another bounding box.
   *
   * @param bbox A BoundingBox.
   * @returns True if this bounding box intersects with another bounding box,
   * otherwise false.
   */
  isIntersecting(bbox: BoundingBox): boolean {
    return (
      this.x <= bbox.x + bbox.width &&
      this.x + this.width >= bbox.x &&
      this.y <= bbox.y + bbox.height &&
      this.y + this.height >= bbox.y
    );
  }

  /**
   * Indicates if this bounding box overlaps with a point.
   *
   * @param x The x coordinate of the point.
   * @param y The y coordinate of the point.
   * @returns True if this bounding box overlaps with the point, otherwise
   * false.
   */
  isOverlappingPoint(x: number, y: number): boolean {
    return (
      x > this.x &&
      x < this.x + this.width &&
      y > this.y &&
      y < this.y + this.height
    );
  }
}
