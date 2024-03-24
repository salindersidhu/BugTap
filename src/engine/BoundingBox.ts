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
   * Return true if this BoundingBox completely overlaps another BoundingBox,
   * otherwise return false.
   *
   * @param bbox A BoundingBox object.
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
   * Return true if this BoundingBox intersects another BoundingBox, otherwise
   * return false.
   *
   * @param bbox A BoundingBox object.
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
   * Return true if this BoundingBox overlaps with a point, otherwise return
   * false.
   *
   * @param x The x coordinate of the point.
   * @param y The y coordinate of the point.
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
