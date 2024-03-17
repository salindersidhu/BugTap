/**
 * The SpriteAnimation module provides functions for creating and rendering
 * an animated image from a sprite sheet.
 *
 * @author Salinder Sidhu
 */
export default class SpriteAnimation {
  private _cyclesPerSecond: number;
  private _frameIndex: number;

  private _height: number;
  private _width: number;
  private _numFrames: number;

  private _image: HTMLImageElement;
  private _opacity: number;
  private _cycleCounter: number;

  constructor(
    spriteSrc: string,
    height: number,
    width: number,
    cyclesPerSecond: number,
    numFrames: number,
    initFrame: number = -1
  ) {
    this._cyclesPerSecond = cyclesPerSecond;
    this._numFrames = numFrames;
    this._frameIndex = initFrame;

    this._height = height;
    this._width = width;

    this._opacity = 1;
    this._cycleCounter = 0;

    // Load image
    this._image = new Image();
    this._image.src = spriteSrc;
  }

  /**
   * Update the sprite animation frame by frame on each function call.
   */
  update() {
    this._cycleCounter += 1;
    if (this._cycleCounter > this._cyclesPerSecond) {
      this._cycleCounter -= this._cyclesPerSecond; // Reset the cycle counter

      // Increment the frame index and reset it at the end of the animation
      this._frameIndex = (this._frameIndex + 1) % this._numFrames;
    }
  }

  /**
   * Render the animated sprite frame by frame on each function call.
   *
   * @param {CanvasRenderingContext2D} context The 2D canvas context.
   * @param {number} x The x position coordinate of the sprite animation.
   * @param {number} y The y position coordinate of the sprite animation.
   * @param {number} angle The angle, in radians, of the sprite animation.
   */
  render(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) {
    // Configure the translation point to sprite's center when rotating
    const translateX = x + this._width / 2;
    const translateY = y + this._height / 2;

    // Save current state of the canvas prior to rendering
    context.save();

    // Configure the canvas opacity
    context.globalAlpha = this._opacity;

    // Translate and rotate canvas to draw the Sprite at an angle
    context.translate(translateX, translateY);
    context.rotate(angle);
    context.translate(-translateX, -translateY);

    // Draw a frame of the Sprite
    context.drawImage(
      this._image,
      this._frameIndex * this._width,
      0,
      this._width,
      this._height,
      x,
      y,
      this._width,
      this._height
    );

    // Restore the canvas state prior to rendering
    context.restore();
  }
}
