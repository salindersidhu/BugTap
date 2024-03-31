import Entity from "./Entity";

/**
 * Factory for creating instances of a concrete Entity.
 *
 * @template T The type of Entity to instantiate.
 * @author Salinder Sidhu
 */
export default class EntityFactory<T extends Entity> {
  private _canvas: HTMLCanvasElement;
  private _context: CanvasRenderingContext2D;

  private _entityFactory: (
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    ...args: any[]
  ) => T;

  /**
   * Constructs a new EntityFactory instance.
   *
   * @param canvas The HTML canvas element.
   * @param context The 2D rendering context of the canvas.
   * @param EntityFactory A function that creates instances of a concrete
   * Entity.
   */
  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    entityFactory: (
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      ...args: any[]
    ) => T
  ) {
    this._canvas = canvas;
    this._context = context;
    this._entityFactory = entityFactory;
  }

  /**
   * Create a new instance of a concrete Entity.
   *
   * @returns {T} A new instance of a concrete Entity with canvas and context
   * passed to it.
   */
  createEntity(...args: any[]): T {
    return this._entityFactory(this._canvas, this._context, ...args);
  }
}
