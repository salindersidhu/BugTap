import { Entity } from "../engine";

const TABLE: string = "./assets/graphics/table.png";

/**
 * The Level class represents the background level of the game. It renders the
 * background using an image.
 *
 * @author Salinder Sidhu
 */
export default class Level extends Entity {
  private _image: HTMLImageElement;
  private _pattern: CanvasPattern | null = null;
  private _isImageLoaded: boolean = false;

  /**
   * Creates a new Level instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context);

    this._image = new Image();
    this._image.src = TABLE;
    this._image.onload = () => {
      this._isImageLoaded = true;
      this._pattern = this.context.createPattern(this._image, "repeat");
    };
  }

  /**
   * Update the Level's state (not implemented).
   *
   * @param fps The current frames per second.
   */
  update(_: number) {}

  /**
   * Render the background for the Level.
   */
  render() {
    // Image is not yet loaded or pattern is not created, do not render
    if (!this._isImageLoaded || !this._pattern) {
      return;
    }

    const { width: canvasWidth, height: canvasHeight } = this.canvas;

    // Save current state of the canvas prior to rendering
    this.context.save();

    // Set the fill style to the pattern
    this.context.fillStyle = this._pattern;

    // Fill the entire canvas with the pattern
    this.context.globalAlpha = 1;
    this.context.fillRect(0, 0, canvasWidth, canvasHeight);

    // Restore the canvas state prior to rendering
    this.context.restore();
  }
}
