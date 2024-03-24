/**
 * The Sprite class provides functions for creating and rendering an animated
 * image.
 *
 * @author Salinder Sidhu
 */
export default class Sprite {
  private _image: HTMLImageElement;
  private _height: number;
  private _width: number;

  private _frameIndex: number;
  private _numFrames: number;
  private _speed: number;
  private _frameCounter: number = 0;

  /**
   * Create an instance of Sprite.
   *
   * @param src The source URL of the sprite image.
   * @param height The height of the sprite frame.
   * @param width The width of the sprite frame.
   * @param speed The speed factor for the animation.
   * @param numFrames The total number of frames in the sprite animation.
   * @param initFrame The initial frame index (default is -1).
   */
  constructor(
    src: string,
    height: number,
    width: number,
    speed: number,
    numFrames: number,
    initFrame: number = -1
  ) {
    this._image = new Image();
    this._image.src = src;
    this._height = height;
    this._width = width;

    this._frameIndex = initFrame;
    this._numFrames = numFrames;
    this._speed = Math.max(0, speed); // Ensure speed is not negative
  }

  /**
   * Update the sprite frame by frame based on the given frames per second.
   *
   * @param fps The current frames per second.
   */
  update(fps: number) {
    this._frameCounter += 1;
    if (this._frameCounter >= fps / this._speed) {
      // Reset the frame counter
      this._frameCounter -= fps / this._speed;

      // Increment the frame index and reset it at the end of the animation
      this._frameIndex = (this._frameIndex + 1) % this._numFrames;
    }
  }

  /**
   * Render a frame from the sprite.
   *
   * @param context The 2D canvas rendering context.
   * @param x The x-coordinate of the sprite's position.
   * @param y The y-coordinate of the sprite's position.
   * @param angle The angle of rotation for the sprite (in radians).
   */
  render(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    opacity: number = 1
  ) {
    // Configure the translation point to sprite's center when rotating
    const translateX = x + this._width / 2;
    const translateY = y + this._height / 2;

    // Save current state of the canvas prior to rendering
    context.save();

    // Configure the canvas opacity
    context.globalAlpha = opacity;

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
