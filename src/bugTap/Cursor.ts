import { Entity } from "../engine";

/**
 * Represents a cursor that tracks mouse movements.
 *
 * @author Salinder Sidhu
 */
export default class Cursor extends Entity {
  x: number;
  y: number;
  radius: number;

  /**
   * Creates a new Cursor instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context, 1, false);

    this.radius = 15;
    this.x = -this.radius;
    this.y = -this.radius;

    this._bindMouseMoveListener();

    // Hide the default cursor
    this.canvas.style.cursor = "none";
  }

  private _handleMouseMove = (event: MouseEvent) => {
    this.x = event.offsetX;
    this.y = event.offsetY;
  };

  private _bindMouseMoveListener() {
    this.canvas.addEventListener("mousemove", this._handleMouseMove);
  }

  private _unbindMouseMoveListener() {
    this.canvas.removeEventListener("mousemove", this._handleMouseMove);
  }

  /**
   * Delete the cursor instance and unbinds event listeners.
   */
  delete() {
    super.delete();
    this._unbindMouseMoveListener();
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
    this.context.beginPath();
    this.context.fillStyle = "black";
    this.context.strokeStyle = "black";
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.context.save();
    this.context.globalAlpha = 0.4;
    this.context.fill();
    this.context.restore();
    this.context.globalAlpha = 0.4;
    this.context.lineWidth = 2;
    this.context.stroke();
    this.context.closePath();
  }
}
