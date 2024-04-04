/**
 * The Text class provides functions for creating and rendering text with
 * outline and opacity.
 *
 * @author Salinder Sidhu
 */
export default class Text {
  private _text: string;

  private _fontFamily: string;
  private _fontSize: string;
  private _fontWeight: number | string;

  private _colour: string;
  private _hasOutline: boolean = false;
  private _outlineColour: string = "";
  private _outlineWidth: number = 0;

  /**
   * Create an instance of Text.
   *
   * @param text The text string to be displayed.
   * @param fontFamily The font family name.
   * @param fontSize The size of the font.
   * @param fontWeight The weight (or boldness) of the font.
   * @param colour The fill colour of the text.
   */
  constructor(
    text: string,
    fontFamily: string,
    fontSize: string,
    fontWeight: number | string,
    colour: string
  ) {
    this._text = text;
    this._fontFamily = fontFamily;
    this._fontSize = fontSize;
    this._fontWeight = fontWeight;
    this._colour = colour;
  }

  /**
   * Set the outline color and width for the text.
   *
   * @param colour The colour of the text's outline.
   * @param width The width of the text's outline.
   */
  setOutline(colour: string, width: number) {
    this._outlineColour = colour;
    this._outlineWidth = width;
    this._hasOutline = true;
  }

  /**
   * Return the text string associated with the canvas Text.
   *
   * @returns The text string.
   */
  getText() {
    return this._text;
  }

  /**
   * Render text on the canvas with the specified position, angle, and opacity.
   *
   * @param context The 2D canvas context.
   * @param x The x position coordinate of the fading text.
   * @param y The y position coordinate of the fading text.
   * @param angle The angle, in radians, of the fading text.
   * @param scale The scale factor for the text (default is 1).
   */
  render(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    opacity: number,
    scale: number = 1
  ) {
    // Save current state of the canvas
    context.save();

    // Configure the canvas opacity
    context.globalAlpha = opacity;

    // Set canvas font
    context.font = `${this._fontWeight} ${this._fontSize} ${this._fontFamily}`;

    // Enable anti-aliasing
    context.imageSmoothingEnabled = true;

    // Translate and rotate canvas to draw the text at an angle
    context.translate(x, y);
    context.rotate(angle);
    context.translate(-x, -y);

    // Scale the canvas to draw the text scaled
    context.translate(x, y);
    context.scale(scale, scale);
    context.translate(-x, -y);

    // Draw the text outline if can draw outline flag is true
    if (this._hasOutline) {
      context.strokeStyle = this._outlineColour;
      context.lineWidth = this._outlineWidth;
      context.strokeText(this._text, x, y);
    }

    // Draw the text
    context.fillStyle = this._colour;
    context.fillText(this._text, x, y);

    // Restore the canvas state prior to rendering
    context.restore();
  }
}
