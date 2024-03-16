import { GameObject } from "../engine";

/**
 * Represents a cursor that tracks mouse movements.
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
    super(canvas, context);

    this.x = 0;
    this.y = 0;
    this.radius = 15;
    this.mouse = {
      x: this.canvas.width / 2,
      y: this.canvas.height / 2,
    };

    this.bindMouseMoveListener();

    // Hide default cursor
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
