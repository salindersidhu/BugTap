import { Game, GameObjectFactory } from "../engine";

import Cursor from "./Cursor";

export default class BugTap extends Game {
  private cursorFactory: GameObjectFactory<Cursor>;

  constructor(canvasId: string) {
    super(canvasId);

    this.cursorFactory = new GameObjectFactory<Cursor>(
      this.canvas,
      this.context,
      Cursor
    );

    this.initGameObjects();
  }

  /**
   * Create GameOjects and add them to the game.
   */
  private initGameObjects() {
    const cursor = this.cursorFactory.createGameObject();

    this.addGameObjects([cursor]);
  }
}
