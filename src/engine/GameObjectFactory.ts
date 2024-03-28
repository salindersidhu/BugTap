import GameObject from "./GameObject";

/**
 * Factory class for creating instances of a concrete GameObject class.
 *
 * @template T The type of GameObject class to instantiate.
 * @author Salinder Sidhu
 */
export default class GameObjectFactory<T extends GameObject> {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;

  private gameObjectFactory: (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    ...args: any[]
  ) => T;

  /**
   * Constructs a new GameObjectFactory instance.
   *
   * @param canvas The HTML canvas element.
   * @param context The 2D rendering context of the canvas.
   * @param gameObjectFactory A function that creates instances of a concrete
   * GameObject class.
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gameObjectFactory: (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      ...args: any[]
    ) => T
  ) {
    this._canvas = canvas;
    this._context = context;
    this.gameObjectFactory = gameObjectFactory;
  }

  /**
   * Create a new instance of a concrete GameObject class.
   *
   * @returns {T} A new instance of a concrete GameObject class with canvas and
   * context passed to it.
   */
  createGameObject(...args: any[]): T {
    return this.gameObjectFactory(this._canvas, this._context, ...args);
  }
}
