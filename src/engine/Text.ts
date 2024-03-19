/**
 * The Text module provides functions for creating and rendering text with an
 * outline and opacity.
 *
 * @author Salinder Sidhu
 */
export default class Text {
  private text: string;
  private font: string;
  private colour: string;
  private speed: number;
  public opacity: number;
  private outlineColour: string | undefined;
  private outlineWidth: number | undefined;
  private canDrawOutline: boolean;

  /**
   * Create an instance of Text.
   *
   * @param text The text string to be displayed.
   * @param font The font and font styles of the text.
   * @param colour The fill colour of the text.
   * @param speed The speed, in seconds, of the fade effect.
   */
  constructor(text: string, font: string, colour: string, speed: number) {
    this.text = text;
    this.font = font;
    this.speed = speed;
    this.colour = colour;
    this.opacity = 1;
    this.canDrawOutline = false;
  }

  /**
   * Update the text's fade effect frame by frame on each function call.
   *
   * @param fps Frames per second.
   */
  update(fps: number) {
    // Reduce opacity
    this.opacity -= 1 / (fps * this.speed);
    // Condition the opacity so it is non-negative
    if (this.opacity < 0) {
      this.opacity = 0;
    }
  }

  /**
   * Render the fading text frame by frame on each function call.
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
    angle: number
  ) {
    // Save current state of the canvas
    context.save();

    // Translate and rotate canvas to draw the text at an angle
    context.translate(x, y);
    context.rotate(angle);
    context.translate(-x, -y);

    // Configure the canvas opacity
    context.globalAlpha = this.opacity;

    // Set canvas font
    context.font = this.font;

    // Draw the text outline if can draw outline flag is true
    if (this.canDrawOutline) {
      context.strokeStyle = this.outlineColour!;
      context.lineWidth = this.outlineWidth!;
      context.strokeText(this.text, x, y);
    }

    // Draw the actual text
    context.fillStyle = this.colour;
    context.fillText(this.text, x, y);

    // Restore the canvas state prior to rendering
    context.restore();
  }

  /**
   * Enable rendering of the text's outline and set the colour and width
   * of the text's outline.
   *
   * @param colour The colour of the text's outline.
   * @param width The width of the text's outline.
   */
  setOutline(colour: string, width: number) {
    this.outlineColour = colour;
    this.outlineWidth = width;
    this.canDrawOutline = true;
  }
}
