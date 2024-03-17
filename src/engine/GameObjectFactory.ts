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
  private gameObjectClass: new (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) =>
    | T
    | ((
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        ...args: any[]
      ) => T);

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    gameObjectClass: new (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D
    ) =>
      | T
      | ((
          canvas: HTMLCanvasElement,
          context: CanvasRenderingContext2D,
          ...args: any[]
        ) => T)
  ) {
    this.canvas = canvas;
    this.context = context;
    this.gameObjectClass = gameObjectClass;
  }

  /**
   * Factory method to create a new instance of the specified GameObject
   * subclass.
   * @returns {T} A new instance of the specified GameObject subclass with the
   * canvas and context objects passed to it.
   */
  createGameObject(...args: any[]): T {
    if (typeof this.gameObjectClass === "function") {
      // If gameObjectClass is a constructor function
      const constructorFunc = this.gameObjectClass as new (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        ...args: any[]
      ) => T;
      return new constructorFunc(this.canvas, this.context, ...args);
    } else {
      // If gameObjectClass is a factory function
      const factoryFunc = this.gameObjectClass as (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        ...args: any[]
      ) => T;
      return factoryFunc(this.canvas, this.context, ...args);
    }
  }
}
