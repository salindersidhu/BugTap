import { Entity } from "../engine";

/**
 * Represents a circular cursor that follows the player's mouse. he cursor is
 * rendered with a defined radius and a semi-transparent appearance.
 *
 * @author Salinder Sidhu
 */
export default class Cursor extends Entity {
  private _x: number = 0;
  private _y: number = 0;
  private _radius: number = 15;

  /**
   * Creates a new Cursor instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context, 1, false);

    this._bindMouseMoveListeners();

    // Hide the default cursor
    this.canvas.style.cursor = "none";
  }

  /**
   * Binds mouse move event listeners to the canvas.
   */
  private _bindMouseMoveListeners() {
    this.canvas.addEventListener("mouseenter", this._updateCursorPosition);
    this.canvas.addEventListener("mousemove", this._updateCursorPosition);
  }

  /**
   * Updates the cursor position based on the mouse event.
   *
   * @param event The mouse event.
   */
  private _updateCursorPosition = (event: MouseEvent) => {
    this._x = event.offsetX;
    this._y = event.offsetY;
  };

  /**
   * Update the cursor's state (not implemented).
   */
  update() {}

  /**
   * Render the cursor on the canvas.
   */
  render() {
    // Save current state of the canvas prior to rendering
    this.context.save();

    this.context.beginPath();

    // Draw a circle representing the cursor
    this.context.arc(this._x, this._y, this._radius, 0, Math.PI * 2);

    this.context.save();

    // Set the fill of the cursor
    this.context.globalAlpha = 0.4;
    this.context.fillStyle = "black";
    this.context.fill();

    this.context.restore();

    // Set the stroke of the cursor
    this.context.strokeStyle = "black";
    this.context.globalAlpha = 0.4;
    this.context.lineWidth = 2;
    this.context.stroke();

    this.context.closePath();

    // Restore the canvas state prior to rendering
    this.context.restore();
  }
}
