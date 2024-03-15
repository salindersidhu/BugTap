/**
 * BoundingBox provides functions for calculating bounding box collision
 * detection.
 *
 * @author Salinder Sidhu
 */
export default class BoundingBox {
  private x: number;
  private y: number;
  private width: number;
  private height: number;

  /**
   * Create an instance of BoundingBox.
   * @param {number} x The BoundingBox's initial x position coordinate.
   * @param {number} y The BoundingBox's initial y position coordinate.
   * @param {number} width The BoundingBox's width.
   * @param {number} height The BoundingBox's height.
   */
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * Update the position of the BoundingBox to a new point.
   *
   * @param {number} x The new x coordinate of the BoundingBox's position.
   * @param {number} y The new y coordinate of the BoundingBox's position.
   */
  update(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  /**
   * Return true if this BoundingBox completely overlaps another BoundingBox,
   * otherwise return false.
   *
   * @param {BoundingBox} bbox A BoundingBox object.
   * @return {boolean}
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
   * @param {BoundingBox} bbox A BoundingBox object.
   * @return {boolean}
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
   * @param {number} x The x coordinate of the point.
   * @param {number} y The y coordinate of the point.
   * @return {boolean}
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
