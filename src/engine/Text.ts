/**
 * The Text class provides functions for creating and rendering text with
 * outline and opacity.
 *
 * @author Salinder Sidhu
 */
export default class Text {
  private _text: string;
  private _font: string;
  private _colour: string;
  private _outlineColour: string;
  private _outlineWidth: number;

  /**
   * Create an instance of Text.
   *
   * @param text The text string to be displayed.
   * @param font The font and font styles of the text.
   * @param colour The fill colour of the text.
   * @param outlineColour The colour of the text's outline.
   * @param outlineWidth The width of the text's outline.
   */
  constructor(
    text: string,
    font: string,
    colour: string,
    outlineColour: string,
    outlineWidth: number
  ) {
    this._text = text;
    this._font = font;
    this._colour = colour;
    this._outlineColour = outlineColour;
    this._outlineWidth = outlineWidth;
  }

  /**
   * Render text on the canvas with the specified position, angle, and opacity.
   *
   * @param context The 2D canvas context.
   * @param x The x position coordinate of the fading text.
   * @param y The y position coordinate of the fading text.
   * @param angle The angle, in radians, of the fading text.
   */
  render(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    opacity: number
  ) {
    // Save current state of the canvas
    context.save();

    // Translate and rotate canvas to draw the text at an angle
    context.translate(x, y);
    context.rotate(angle);
    context.translate(-x, -y);

    // Configure the canvas opacity
    context.globalAlpha = opacity;

    // Set canvas font
    context.font = this._font;

    // Draw the text outline if can draw outline flag is true
    context.strokeStyle = this._outlineColour;
    context.lineWidth = this._outlineWidth;
    context.strokeText(this._text, x, y);

    // Draw the actual text
    context.fillStyle = this._colour;
    context.fillText(this._text, x, y);

    // Restore the canvas state prior to rendering
    context.restore();
  }
}
