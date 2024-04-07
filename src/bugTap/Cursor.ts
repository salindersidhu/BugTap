import { Entity, filterObjectsByType } from "../engine";

import Bug from "./Bug";

const CURSOR_COLOR: string = "black";
const CURSOR_COLOR_OVER_BUG: string = "white";
const CURSOR_OUTLINE: number = 2.5;
const CURSOR_OPACITY: number = 0.5;
const CURSOR_RADIUS: number = 15;

/**
 * Represents a circular cursor that follows the player's mouse. he cursor is
 * rendered with a defined radius and a semi-transparent appearance.
 *
 * @author Salinder Sidhu
 */
export default class Cursor extends Entity {
  private _x: number = 0;
  private _y: number = 0;
  private _isOverBug: boolean = false;

  /**
   * Creates a new Cursor instance.
   *
   * @param canvas The HTML canvas element for rendering.
   * @param context The 2D rendering context of the canvas.
   */
  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context, 1, false);

    this.canvas.addEventListener("mouseenter", this._updateCursorPosition);
    this.canvas.addEventListener("mousemove", this._updateCursorPosition);

    // Hide the default cursor
    this.canvas.style.cursor = "none";
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
   *
   * @param _: The frames per second (not used).
   * @param entities An array of Entity instances.
   */
  update(_: number, entities: Entity[]) {
    this._isOverBug = false;

    const bugs = filterObjectsByType(entities, Bug);
    for (const bug of bugs) {
      if (bug.boundingBox.isOverlappingPoint(this._x, this._y)) {
        this._isOverBug = true;
        break;
      }
    }
  }

  /**
   * Render the cursor on the canvas.
   */
  render() {
    const color = this._isOverBug ? CURSOR_COLOR_OVER_BUG : CURSOR_COLOR;

    // Save current state of the canvas prior to rendering
    this.context.save();

    // Enable anti-aliasing
    this.context.imageSmoothingEnabled = true;

    this.context.beginPath();

    // Draw a circle representing the cursor
    this.context.arc(this._x, this._y, CURSOR_RADIUS, 0, Math.PI * 2);

    this.context.save();

    // Set the fill of the cursor
    this.context.globalAlpha = CURSOR_OPACITY;
    this.context.fillStyle = color;
    this.context.fill();

    this.context.restore();

    // Set the stroke of the cursor
    this.context.strokeStyle = color;
    this.context.globalAlpha = CURSOR_OPACITY;
    this.context.lineWidth = CURSOR_OUTLINE;
    this.context.stroke();

    this.context.closePath();

    // Restore the canvas state prior to rendering
    this.context.restore();
  }
}
