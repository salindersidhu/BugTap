import GameObject from "./GameObject";

/**
 * Represents a factory class for creating instances of GameObject subclasses.
 *
 * @template T The type of GameObject subclass to instantiate.
 * @author Salinder Sidhu
 */
export default class GameObjectFactory<T extends GameObject> {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;

  private gameObjectFactory: (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    ...args: any[]
  ) => T;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gameObjectFactory: (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      ...args: any[]
    ) => T
  ) {
    this.canvas = canvas;
    this.context = context;
    this.gameObjectFactory = gameObjectFactory;
  }

  /**
   * Factory method to create a new instance of the specified GameObject
   * subclass.
   * @returns {T} A new instance of the specified GameObject subclass with the
   * canvas and context objects passed to it.
   */
  createGameObject(...args: any[]): T {
    return this.gameObjectFactory(this.canvas, this.context, ...args);
  }
}
