/**
 * The Game module acts as an abstract module used to build a Game object
 * that manages the control, update and rendering of the game.
 *
 * @abstract
 * @author Salinder Sidhu
 */
export default abstract class Game {
  // Module constants and variables
  protected FPS: number = 0;
  protected ctx: CanvasRenderingContext2D | null = null;
  protected canvas: HTMLCanvasElement | null = null;
  protected gameObjects: { [key: string]: any[] } = {};
  protected customInit?: (ctx: CanvasRenderingContext2D) => void;
  protected customReset?: () => void;
  protected customUpdate?: (FPS: number, canvas: HTMLCanvasElement) => void;
  protected customRender?: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void;

  /**
   * Initialize the Game and call the custom init function if a custom
   * init function is connected to the Game.
   *
   * @param {number} FPS The game's frames per second.
   * @param {CanvasRenderingContext2D} ctx The 2D context of the game canvas.
   * @param {HTMLCanvasElement} canvas The game canvas.
   */
  abstract init(
    FPS: number,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ): void;

  /**
   * Reset the Game and call the custom reset function if a custom reset
   * function is connected to the Game.
   */
  abstract reset(): void;

  /**
   * Update the Game and call the custom update function if a custom
   * update function is connected to the Game.
   */
  abstract update(): void;

  /**
   * Render the Game and call the custom render function if a custom
   * render function is connected to the Game.
   */
  abstract render(): void;

  /**
   * Return the Game's collection of GameObjects specified by type, if the
   * collection of GameObjects do not exist for the specified type return
   * an empty array.
   *
   * @param {string} type The Type of GameObjects to return.
   * @return {object} The GameObjects.
   */
  abstract getGameObjects(type: string): any[];

  /**
   * Add a concrete GameObject with a specific type to the Game.
   *
   * @param {object} gameObject The concrete GameObject.
   * @param {string} type The concrete GameObject's type.
   */
  abstract addGameObject(gameObject: any, type: string): void;

  /**
   * Connect a custom Init function to the Game.
   *
   * @param {function} customInit The custom init function.
   */
  abstract connectCustomInit(
    customInit: (ctx: CanvasRenderingContext2D) => void
  ): void;

  /**
   * Connect a custom reset function to the Game.
   *
   * @param {function} customReset The custom reset function.
   */
  abstract connectCustomReset(customReset: () => void): void;

  /**
   * Connect a custom update function to the Game.
   *
   * @param {function} customUpdate The custom update function.
   */
  abstract connectCustomUpdate(
    customUpdate: (FPS: number, canvas: HTMLCanvasElement) => void
  ): void;

  /**
   * Connect a custom render function to the Game.
   *
   * @param {function} customRender The custom render function.
   */
  abstract connectCustomRender(
    customRender: (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement
    ) => void
  ): void;

  /**
   * Abstract function that defines the Game's mouse click event. This
   * function needs to be overridden.
   *
   * @abstract
   * @throws {Error} Abstract function.
   */
  abstract mouseClickEvent(): void;

  /**
   * Abstract function that defines the Game's mouse release event. This
   * function needs to be overridden.
   *
   * @abstract
   * @throws {Error} Abstract function.
   */
  abstract mouseReleaseEvent(): void;

  /**
   * Abstract function that defines the Game's mouse movement event. This
   * function needs to be overridden.
   *
   * @abstract
   * @throws {Error} Abstract function.
   */
  abstract mouseMoveEvent(): void;

  /**
   * Abstract function that defines the Game's keyboard press event. This
   * function needs to be overridden.
   *
   * @abstract
   * @throws {Error} Abstract function.
   */
  abstract keyPressEvent(): void;

  /**
   * Abstract function that defines the Game's keyboard release event.
   * This function needs to be overridden.
   *
   * @abstract
   * @throws {Error} Abstract function.
   */
  abstract keyReleaseEvent(): void;
}
