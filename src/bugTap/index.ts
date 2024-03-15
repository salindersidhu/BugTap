import { Game } from "../engine";

import Cursor from "./Cursor";

export default class BugTap extends Game {
  mouse: {
    x: number;
    y: number;
  };

  constructor(canvasId: string) {
    super(canvasId);

    this.mouse = {
      x: this.height * 0.5,
      y: this.width * 0.5,
    };

    this.canvas.addEventListener("mousemove", (event) => {
      this.mouse.x = event.offsetX;
      this.mouse.y = event.offsetY;
    });

    this.canvas.style.cursor = "none";

    const cursor = new Cursor(200, 200, this.mouse);

    this.addGameObject(cursor);
  }
}
