/**
 * The SpriteStatic provides functions for creating and rendering a single
 * frame from a sprite.
 *
 * @author Salinder Sidhu
 */
export default class SpriteStatic {
  protected frameIndex: number;

  private _height: number;
  private _width: number;

  private _image: HTMLImageElement;

  /**
   * Create an instance of SpriteStatic.
   *
   * @param spriteSrc The source URL of the sprite image.
   * @param height The height of the sprite frame.
   * @param width The width of the sprite frame.
   * @param initFrame The initial frame index (default is -1).
   */
  constructor(
    spriteSrc: string,
    height: number,
    width: number,
    initFrame: number = -1
  ) {
    this.frameIndex = initFrame;

    this._height = height;
    this._width = width;

    // Load image
    this._image = new Image();
    this._image.src = spriteSrc;
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
      this.frameIndex * this._width,
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
