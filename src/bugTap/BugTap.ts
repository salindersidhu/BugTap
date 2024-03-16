import { Game } from "../engine";

import Cursor from "./Cursor";

export default class BugTap extends Game {
  constructor(canvasId: string) {
    super(canvasId);

    const cursor = new Cursor(this.canvas, this.context);

    this.addGameObject(cursor);
  }
}
