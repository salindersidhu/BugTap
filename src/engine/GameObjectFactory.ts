import GameObject from "./GameObject";

/**
 * Represents a factory class for creating instances of GameObject subclasses.
 * @template T The type of GameObject subclass to instantiate.
 */
export default class GameObjectFactory<T extends GameObject> {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private gameObjectClass: new (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) => T;

  /**
   * Constructs a new GameObjectFactory.
   * @param {HTMLCanvasElement} canvas The HTML canvas element to pass to created GameObject instances.
   * @param {CanvasRenderingContext2D} context The 2D rendering context to pass to created GameObject instances.
   * @param {new (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => T} gameObjectClass The GameObject subclass to instantiate.
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gameObjectClass: new (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ) => T
  ) {
    this.canvas = canvas;
    this.context = context;
    this.gameObjectClass = gameObjectClass;
  }

  /**
   * Factory method to create a new instance of the specified GameObject subclass.
   * @returns {T} A new instance of the specified GameObject subclass with the canvas and context objects passed to it.
   */
  createGameObject(): T {
    return new this.gameObjectClass(this.canvas, this.context);
  }
}
