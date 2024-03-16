import GameObject from "./GameObject";

/**
 * Game manages the control, update and rendering of the game.
 *
 * @author Salinder Sidhu
 */
export default class Game {
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

  addGameObjects(gameObjects: GameObject[]) {
    this.gameObjects.push(...gameObjects);
  }

  private loop = () => {
    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  };

  private update() {
    this.gameObjects.forEach((gameObject) => {
      gameObject.update();

      if (gameObject.canDelete()) {
        this.deleteGameObject(gameObject);
      }
    });
  }

  private render() {
    this.context.clearRect(0, 0, this.width, this.height);

    this.gameObjects
      .sort(this.sortGameObjectsByDrawPriority)
      .forEach((gameObject) => gameObject.render());
  }

  private deleteGameObject(gameObject: GameObject) {
    const index = this.gameObjects.indexOf(gameObject);

    if (index >= 0) {
      this.gameObjects.splice(index, 1);
    }
  }

  private sortGameObjectsByDrawPriority(
    gameObjectA: GameObject,
    gameObjectB: GameObject
  ) {
    return gameObjectA.drawPriority() - gameObjectB.drawPriority();
  }
}
