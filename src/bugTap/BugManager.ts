import { GameObjectFactory, getRandomItem, getRandomNumber } from "../engine";

import Bug from "./Bug";
import Food from "./Food";

/**
 * Interface representing data structure for bug properties.
 */
interface BugData {
  points: number;
  speed: number;
  spriteSrc: string;
}

const redBugSprite = "./assets/graphics/bug_red.png";
const orangeBugSprite = "./assets/graphics/bug_orange.png";
const greyBugSprite = "./assets/graphics/bug_grey.png";

const numBugFrames = 2;

const bugHeight = 50;
const bugWidth = 45;

const bugData: BugData[] = [
  { points: 1, speed: 5, spriteSrc: redBugSprite },
  { points: 3, speed: 10, spriteSrc: orangeBugSprite },
  { points: 5, speed: 15, spriteSrc: greyBugSprite },
];

/**
 * The BugManager class manages the spawning of bug GameObjects.
 *
 * @author Salinder Sidhu
 */
export default class BugManager {
  private static instance: BugManager;
  private bugFactory: GameObjectFactory<Bug>;
  private _food: Food[] = [];

  /**
   * Creates an instance of BugManager.
   *
   * @param canvas The HTMLCanvasElement for rendering.
   * @param context The CanvasRenderingContext2D for drawing.
   */
  private constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this.bugFactory = new GameObjectFactory<Bug>(
      canvas,
      context,
      (
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        height: number,
        width: number,
        spriteSrc: string,
        speed: number,
        numFrames: number
      ) => {
        return new Bug(
          canvas,
          context,
          x,
          y,
          height,
          width,
          spriteSrc,
          speed,
          this._food,
          numFrames
        );
      }
    );
  }

  /**
   * Return the singleton instance of BugManager.
   *
   * @param canvas - The HTMLCanvasElement for rendering.
   * @param context - The CanvasRenderingContext2D for drawing.
   * @returns The BugManager instance.
   */
  public static getInstance(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ): BugManager {
    if (!BugManager.instance) {
      BugManager.instance = new BugManager(canvas, context);
    }
    return BugManager.instance;
  }

  /**
   * Receives an array of Food for bug interaction.
   *
   * @param food An array of Food to be assigned to the BugManager.
   */
  public receiveFood(food: Food[]) {
    this._food = food;
  }

  /**
   * Spawns a new bug GameObject.
   *
   * @param canvas - The HTMLCanvasElement for rendering.
   * @returns The newly spawned Bug GameObject.
   */
  public spawn(canvas: HTMLCanvasElement): Bug {
    const selectedBugData = getRandomItem(bugData)!;

    // Define arrays to store possible coordinates for each side
    const topSideCoordinates = [
      getRandomNumber(0, canvas.width - bugWidth),
      -bugHeight,
    ];
    const rightSideCoordinates = [
      canvas.width,
      getRandomNumber(0, canvas.height - bugHeight),
    ];
    const bottomSideCoordinates = [
      getRandomNumber(0, canvas.width - bugWidth),
      canvas.height,
    ];
    const leftSideCoordinates = [
      -bugWidth,
      getRandomNumber(0, canvas.height - bugHeight),
    ];

    // Define an array to store possible side coordinate pairs
    const sideCoordinates = [
      topSideCoordinates,
      rightSideCoordinates,
      bottomSideCoordinates,
      leftSideCoordinates,
    ];

    // Choose a random side
    const side = getRandomNumber(0, 3); // 0: top, 1: right, 2: bottom, 3: left

    // Select coordinates based on the chosen side
    const [x, y] = sideCoordinates[side];

    return this.bugFactory.createGameObject(
      x,
      y,
      bugHeight,
      bugWidth,
      selectedBugData.spriteSrc,
      selectedBugData.speed,
      numBugFrames
    );
  }
}
