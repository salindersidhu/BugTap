import { GameObject } from "../engine";

/**
 * Represents a cursor that tracks mouse movements.
 *
 * @author Salinder Sidhu
 */
export default class Cursor extends GameObject {
  x: number;
  y: number;
  radius: number;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context, 1);

    this.radius = 15;
    this.x = -this.radius;
    this.y = -this.radius;

    this.bindMouseMoveListener();

    // Hide the default cursor
    this.canvas.style.cursor = "none";
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.x = event.offsetX;
    this.y = event.offsetY;
  };

  private bindMouseMoveListener() {
    this.canvas.addEventListener("mousemove", this.handleMouseMove);
  }

  private unbindMouseMoveListener() {
    this.canvas.removeEventListener("mousemove", this.handleMouseMove);
  }

  delete() {
    super.delete();
    this.unbindMouseMoveListener();
  }

  update(_: number) {}

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
