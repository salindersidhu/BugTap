import type Game from "./Game";

/**
 * The System module provides functions for handling the core game events,
 * general game management and rendering tasks.
 *
 * @author Salinder Sidhu
 */
export default class System {
  // Module constants and variables
  private canvas: HTMLCanvasElement | null = null;
  private isGamePaused: boolean = false;
  private isGameActive: boolean = false;
  private connectedGame: Game | null = null;

  /**
   * Trigger a mouse event function on the game canvas.
   *
   * @private
   * @param {MouseEvent} evt The mouse event object.
   * @param {HTMLCanvasElement} canvas The canvas object.
   * @param {Function} mouseEvtFunct The function to trigger on the mouse event.
   */
  private triggerMouseEvent(
    evt: MouseEvent,
    canvas: HTMLCanvasElement,
    mouseEvtFunct: Function
  ): void {
    // Trigger mouse event if System is active and not paused
    if (this.isGameActive && !this.isGamePaused) {
      // Obtain the mouse coordinates relative to the canvas
      const mouseX = evt.pageX - canvas.offsetLeft;
      const mouseY = evt.pageY - canvas.offsetTop;
      // Trigger the mouse event function on the mouse event
      mouseEvtFunct(mouseX, mouseY);
    }
  }

  /**
   * Main game system loop, continuously updates and renders the connected game.
   *
   * @private
   */
  private mainLoop(): void {
    if (this.isGameActive && !this.isGamePaused) {
      this.connectedGame.update();
      this.connectedGame.render();
    }
  }

  /**
   * Initialize the System.
   *
   * @param {number} FPS The game's frames per second.
   * @param {string} canvasID The ID of the canvas DOM element.
   * @param {*} game The Game module to connect to the System.
   * @throws {Error} Cannot find a connected game.
   */
  public init(FPS: number, canvasID: string, game: any): void {
    if (game) {
      // Bind the game to the System
      this.connectedGame = game;
      // Obtain the canvas and canvas 2D context from the DOM
      this.canvas = document.getElementById(canvasID) as HTMLCanvasElement;
      const ctx = this.canvas.getContext("2d")!;
      // Initialize the connected game module
      this.connectedGame?.init(FPS, ctx, this.canvas);
      // Execute the System main loop indefinitely
      setInterval(() => this.mainLoop(), 1000 / FPS);
    } else {
      throw new Error("Cannot initialize system, no connected game was found!");
    }
  }

  /**
   * Function that toggles the System's state between paused or running.
   */
  public togglePause(): void {
    this.isGamePaused = !this.isGamePaused;
  }

  /**
   * Return if the System is paused.
   *
   * @return {boolean}
   */
  public isPaused(): boolean {
    return this.isGamePaused;
  }

  /**
   * Return if the System is active.
   *
   * @return {boolean}
   */
  public isActive(): boolean {
    return this.isGameActive;
  }

  /**
   * Start the System and the connected game.
   *
   * @throws {Error} Cannot find a connected game.
   */
  public start(): void {
    if (this.connectedGame) {
      // Reset the connected game module
      this.connectedGame.reset();
      this.isGameActive = true;
    } else {
      throw new Error("Cannot start system, no connected game was found!");
    }
  }

  /**
   * Stop the System and the connected game.
   */
  public stop(): void {
    this.isGameActive = false;
  }

  /**
   * Enable the use of mouse click events in the Game.
   */
  public enableMouseClick(): void {
    // Add event listener for mouse click events to the canvas
    this.canvas?.addEventListener(
      "mousedown",
      (evt) => {
        this.triggerMouseEvent(
          evt,
          this.canvas!,
          this.connectedGame.mouseClickEvent
        );
      },
      false
    );
  }

  /**
   * Enable the use of mouse release events in the Game.
   */
  public enableMouseRelease(): void {
    // Add event listener for mouse release events to the canvas
    this.canvas?.addEventListener(
      "mouseup",
      (evt) => {
        this.triggerMouseEvent(
          evt,
          this.canvas!,
          this.connectedGame.mouseReleaseEvent
        );
      },
      false
    );
  }

  /**
   * Enable the use of mouse move events in the Game.
   */
  public enableMouseMove(): void {
    // Add event listener for mouse move events to the canvas
    this.canvas?.addEventListener(
      "mousemove",
      (evt) => {
        this.triggerMouseEvent(
          evt,
          this.canvas!,
          this.connectedGame.mouseMoveEvent
        );
      },
      false
    );
  }

  /**
   * Enable the use of keyboard press events in the Game.
   */
  public enableKeyPress(): void {
    // Add event listener for keyboard press events to the canvas
    window.addEventListener(
      "keydown",
      (evt) => {
        this.connectedGame.keyPressEvent(evt);
      },
      false
    );
  }

  /**
   * Enable the use of keyboard release events in the Game.
   */
  public enableKeyRelease(): void {
    // Add event listener for keyboard release events to the canvas
    window.addEventListener(
      "keyup",
      (evt) => {
        this.connectedGame.keyReleaseEvent(evt);
      },
      false
    );
  }
}
