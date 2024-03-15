import Sprite from "./Sprite";

/**
 * The ResourceManager module provides functions for creation, storage and
 * management of game resources.
 *
 * @author Salinder Sidhu
 */
export default class ResourceManager {
  private static images: { [id: string]: HTMLImageElement } = {};
  private static sprites: { [id: string]: Sprite } = {};

  /**
   * Return a new Image object
   *
   * @private
   * @param {string} src The source file path of the image.
   * @param {number} width The image's width.
   * @param {number} height The image's height.
   * @return {object} An Image object.
   */
  private static createImage(
    src: string,
    width: number,
    height: number
  ): HTMLImageElement {
    const image = new Image();
    image.src = src;
    image.width = width;
    image.height = height;
    return image;
  }

  /**
   * Add a new Image with a unique ID to the ResourceManager.
   *
   * @param {string} id The image's unique id.
   * @param {string} src The source file path of the image.
   * @param {number} width The image's width.
   * @param {number} height The image's height.
   * @throws {Error} Image object with the specified ID already exists.
   */
  public static addImage(
    id: string,
    src: string,
    width: number,
    height: number
  ): void {
    if (!this.images.hasOwnProperty(id)) {
      this.images[id] = this.createImage(src, width, height);
    } else {
      throw new Error(`Image with ID ${id} already exists!`);
    }
  }

  /**
   * Add a new Sprite with a unique ID to the ResourceManager.
   *
   * @param {string} id The sprite image's unique id.
   * @param {string} src The source file path of the sprite image.
   * @param {number} weight The sprite image's width.
   * @param {number} height The sprite image's height.
   * @param {number} numFrames The number of frames in the sprite image.
   * @throws {Error} Sprite object with the specified ID already exists.
   */
  public static addSprite(
    id: string,
    src: string,
    width: number,
    height: number,
    numFrames: number
  ): void {
    if (!this.sprites.hasOwnProperty(id)) {
      const image = this.createImage(src, width, height);

      const sprite = new Sprite(image, numFrames, width / numFrames);
      this.sprites[id] = sprite;
    } else {
      throw new Error(`Sprite with ID ${id} already exists!`);
    }
  }

  /**
   * Return an Image object corresponding to a unique ID.
   *
   * @param {string} id The unique ID corresponding to an Image object.
   * @return {object} An Image object.
   * @throws {Error} Image object with the specified ID does not exist!
   */
  public static getImage(id: string): HTMLImageElement {
    if (this.images.hasOwnProperty(id)) {
      return this.images[id];
    }
    throw new Error(`Image with ID ${id} does not exist!`);
  }

  /**
   * Return a Sprite object corresponding to a unique ID.
   *
   * @param {string} id The unique ID corresponding to a Sprite object.
   * @return {object} A Sprite object.
   * @throws {Error} Sprite object with the specified ID does not exist!
   */
  public static getSprite(id: string): Sprite {
    if (this.sprites.hasOwnProperty(id)) {
      return this.sprites[id];
    }
    throw new Error(`Sprite with ID ${id} does not exist!`);
  }
}
