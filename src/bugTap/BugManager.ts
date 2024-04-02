import { EntityFactory, getRandomItem, getRandomNumber } from "../engine";

import Bug from "./Bug";

const RED_BUG: string = "./assets/graphics/bug_red.png";
const ORANGE_BUG: string = "./assets/graphics/bug_orange.png";
const GREY_BUG: string = "./assets/graphics/bug_grey.png";

/**
 * Interface representing the data structure for a Bug's properties.
 */
interface BugProps {
  points: number;
  speed: number;
  spriteSrc: string;
}

const BUG_HEIGHT: number = 50;
const BUG_WIDTH: number = 45;
const NUMBER_OF_BUG_FRAMES: number = 2;

const bugProps: BugProps[] = [
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
  private static _instance: BugManager;
  private _bugFactory: EntityFactory<Bug>;

  /**
   * Create an instance of BugManager.
   *
   * @param canvas The HTMLCanvasElement for rendering.
   * @param context The CanvasRenderingContext2D for drawing.
   */
  private constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D
  ) {
    this._bugFactory = new EntityFactory<Bug>(
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
    if (!BugManager._instance) {
      BugManager._instance = new BugManager(canvas, context);
    }
    return BugManager._instance;
  }

  /**
   * Spawn a Bug.
   *
   * @param canvas - The HTMLCanvasElement for rendering.
   * @returns The newly spawned Bug.
   */
  public spawn(canvas: HTMLCanvasElement): Bug {
    const bugProp = getRandomItem(bugProps)!;

    // Define arrays to store possible coordinates for each side
    const topSideCoordinates = [
      getRandomNumber(0, canvas.width - BUG_WIDTH),
      -BUG_HEIGHT,
    ];
    const rightSideCoordinates = [
      canvas.width,
      getRandomNumber(0, canvas.height - BUG_HEIGHT),
    ];
    const bottomSideCoordinates = [
      getRandomNumber(0, canvas.width - BUG_WIDTH),
      canvas.height,
    ];
    const leftSideCoordinates = [
      -BUG_WIDTH,
      getRandomNumber(0, canvas.height - BUG_HEIGHT),
    ];

    // Define an array to store possible side coordinate pairs
    const sideCoordinates = [
      topSideCoordinates,
      rightSideCoordinates,
      bottomSideCoordinates,
      leftSideCoordinates,
    ];

    const [x, y] = sideCoordinates[getRandomNumber(0, 3)];
    const { spriteSrc, speed, points } = bugProp;

    return this._bugFactory.createEntity(
      x,
      y,
      BUG_HEIGHT,
      BUG_WIDTH,
      spriteSrc,
      speed,
      points,
      NUMBER_OF_BUG_FRAMES
    );
  }
}
