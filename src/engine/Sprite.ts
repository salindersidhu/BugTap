/**
 * Sprite represents a sprite sheet image. A single image consisting of
 * multiple frames that together form an animation.
 *
 * @author Salinder Sidhu
 */
export default class Sprite {
  public image: HTMLImageElement;
  public numFrames: number;
  public frameWidth: number;

  /**
   * Create an instance of Sprite.
   *
   * @param {HTMLImageElement} image The path to a sprite image.
   * @param {number} numFrames The number of frames on the sprite.
   * @param {number} frameWidth The width of each individual frame on
   * the sprite.
   */
  constructor(image: HTMLImageElement, numFrames: number, frameWidth: number) {
    // Sprite object attributes
    this.image = image;
    this.numFrames = numFrames;
    this.frameWidth = frameWidth;
  }
}
