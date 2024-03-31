import { EntityFactory, getRandomItem, getRandomNumber } from "../engine";

import Bug from "./Bug";
import Food from "./Food";

const RED_BUG: string = "./assets/graphics/bug_red.png";
const ORANGE_BUG: string = "./assets/graphics/bug_orange.png";
const GREY_BUG: string = "./assets/graphics/bug_grey.png";

/**
 * Interface representing data structure for bug properties.
 */
interface BugData {
  points: number;
  speed: number;
  spriteSrc: string;
}

const numBugFrames = 2;

const bugHeight = 50;
const bugWidth = 45;

const bugData: BugData[] = [
  { points: 1, speed: 3, spriteSrc: RED_BUG },
  { points: 3, speed: 5, spriteSrc: ORANGE_BUG },
  { points: 5, speed: 8, spriteSrc: GREY_BUG },
];

/**
 * The BugManager class manages the spawning of bug Entities.
 *
 * @author Salinder Sidhu
 */
export default class BugManager {
  private static instance: BugManager;
  private bugFactory: EntityFactory<Bug>;
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
    this.bugFactory = new EntityFactory<Bug>(
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
        points: number,
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
          points,
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
   * Receive an array of Food for bug interaction.
   *
   * @param food An array of Food to be assigned to the BugManager.
   */
  public receiveFood(food: Food[]) {
    this._food = food;
  }

  /**
   * Spawn a new Bug.
   *
   * @param canvas - The HTMLCanvasElement for rendering.
   * @returns The newly spawned Bug.
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

    return this.bugFactory.createEntity(
      x,
      y,
      bugHeight,
      bugWidth,
      selectedBugData.spriteSrc,
      selectedBugData.speed,
      selectedBugData.points,
      numBugFrames
    );
  }
}
