import GameObject from "./GameObject";

/**
 * Game manages the control, update and rendering of the game.
 *
 * @author Salinder Sidhu
 */
export default abstract class Game {
  canvasId: string | null = null;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  height: number;
  width: number;

  private gameObjects: GameObject[] = [];

  constructor(canvasId: string) {
    if (!canvasId) {
      throw Error("Invalid canvas element id");
    }

    this.canvas = <HTMLCanvasElement>document.getElementById(canvasId)!;
    this.context = this.canvas.getContext("2d")!;
    this.height = this.canvas.height;
    this.width = this.canvas.width;

    this.loop();
  }

  addGameObject(gameObject: GameObject) {
    this.gameObjects.push(gameObject);
  }

  private loop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update() {
    this.gameObjects.forEach((gameObject) => gameObject.update());
  }

  private render() {
    this.context.clearRect(0, 0, this.width, this.height);

    this.gameObjects
      .sort(this.sortGameObjectsByDrawPriority)
      .forEach((gameObject) => gameObject.render(this.context));
  }

  private sortGameObjectsByDrawPriority(
    gameObjectA: GameObject,
    gameObjectB: GameObject
  ) {
    return gameObjectA.getDrawPriority() - gameObjectB.getDrawPriority();
  }
}
