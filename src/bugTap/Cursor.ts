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
  mouse: {
    x: number;
    y: number;
  };

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    super(canvas, context, 1);

    this.radius = 15;
    this.x = -this.radius;
    this.y = -this.radius;
    this.mouse = {
      x: this.x,
      y: this.y,
    };

    this.bindMouseMoveListener();

    // Hide the default cursor
    this.canvas.style.cursor = "none";
  }

  private handleMouseMove = (event: MouseEvent) => {
    this.mouse = {
      x: event.offsetX,
      y: event.offsetY,
    };
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

  update() {
    this.x = this.mouse.x;
    this.y = this.mouse.y;
  }

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
