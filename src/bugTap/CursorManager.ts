import { GameObjectFactory } from "../engine";

import Cursor from "./Cursor";

/**
 * Manages the creation and behavior of the cursor.
 *
 * @author Salinder Sidhu
 */
export default class CursorManager {
  private static instance: CursorManager;
  private cursorFactory: GameObjectFactory<Cursor>;

  /**
   * Creates an instance of CursorManager.
   *
   * @param canvas The HTMLCanvasElement for rendering.
   * @param context The CanvasRenderingContext2D for drawing.
   */
  private constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this.cursorFactory = new GameObjectFactory<Cursor>(
      canvas,
      context,
      (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
        return new Cursor(canvas, context);
      }
    );
  }

  /**
   * Return the singleton instance of CursorManager.
   *
   * @param canvas - The HTMLCanvasElement for rendering.
   * @param context - The CanvasRenderingContext2D for drawing.
   * @returns The CursorManager instance.
   */
  public static getInstance(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ): CursorManager {
    if (!CursorManager.instance) {
      CursorManager.instance = new CursorManager(canvas, context);
    }
    return CursorManager.instance;
  }

  /**
   * Create a Cursor.
   *
   * @returns The created Cursor.
   */
  public create(): Cursor {
    return this.cursorFactory.createGameObject();
  }
}
