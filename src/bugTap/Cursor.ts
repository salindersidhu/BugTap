import { GameObject } from "../engine";

export default class Cursor extends GameObject {
  x: number;
  y: number;
  radius: number;
  mouse: {
    x: number;
    y: number;
  };

  constructor(x: number, y: number, mouse: any) {
    super();

    this.x = x;
    this.y = y;
    this.radius = 15;
    this.mouse = mouse;
  }

  update() {
    this.x = this.mouse.x;
    this.y = this.mouse.y;
  }

  render(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    context.save();
    context.globalAlpha = 0.6;
    context.fill();
    context.restore();
    context.stroke();
  }
}
