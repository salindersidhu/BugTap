import StaticSprite from "./SpriteStatic";

/**
 * The SpriteAnimated class provides functions for creating and rendering
 * an animated image from a sprite.
 *
 * @author Salinder Sidhu
 */
export default class SpriteAnimated extends StaticSprite {
  private _framesPerSecond: number;
  private _frameCounter: number = 0;
  private _numFrames: number;

  /**
   * Create an instance of SpriteAnimated.
   *
   * @param spriteSrc The source URL of the sprite image.
   * @param height The height of the sprite frame.
   * @param width The width of the sprite frame.
   * @param framesPerSecond The number of frames per second for the animation.
   * @param numFrames The total number of frames in the sprite animation.
   * @param initFrame The initial frame index (default is -1).
   */
  constructor(
    spriteSrc: string,
    height: number,
    width: number,
    framesPerSecond: number,
    numFrames: number,
    initFrame: number = -1
  ) {
    super(spriteSrc, height, width, initFrame);

    // Ensure framesPerSecond is not negative
    this._framesPerSecond = Math.max(0, framesPerSecond);
    this._numFrames = numFrames;
  }

  /**
   * Update the sprite animation frame by frame on each function call.
   */
  update() {
    this._frameCounter += 1;
    if (this._frameCounter >= 100 / this._framesPerSecond) {
      // Reset the frame counter
      this._frameCounter -= 100 / this._framesPerSecond;

      // Increment the frame index and reset it at the end of the animation
      this.frameIndex = (this.frameIndex + 1) % this._numFrames;
    }
  }
}
