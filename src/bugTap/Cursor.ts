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
  private _radius: number;

  /**
   * Creates a new Cursor instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context, 1, false);

    this._radius = 15;
    this._bindMouseMoveListeners();

    // Hide the default cursor
    this.canvas.style.cursor = "none";
  }

  private _handleMouseMove = (event: MouseEvent) => {
    this._x = event.offsetX;
    this._y = event.offsetY;
  };

  private _bindMouseMoveListeners() {
    this.canvas.addEventListener("mouseenter", this._handleMouseMove);
    this.canvas.addEventListener("mousemove", this._handleMouseMove);
  }

  private _unbindMouseMoveListeners() {
    this.canvas.removeEventListener("mouseenter", this._handleMouseMove);
    this.canvas.removeEventListener("mousemove", this._handleMouseMove);
  }

  /**
   * Delete the cursor instance and unbind the mouse event listeners.
   */
  delete() {
    this._unbindMouseMoveListeners();

    super.delete();
  }

  /**
   * Update the cursor's state (not implemented).
   *
   * @param fps The current frames per second.
   */
  update(_: number) {}

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
