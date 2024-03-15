import type Sprite from "./Sprite";

/**
 * The SpriteAnimation module provides functions for creating and rendering
 * an animated sprite.
 *
 * @author Salinder Sidhu
 */
export default class SpriteAnimation {
  private fps: number;
  private image: HTMLImageElement;
  private frameIndex: number;
  private height: number;
  private numFrames: number;
  private frameWidth: number;
  public opacity: number;
  private cycleCounter: number;

  /**
   * Create an instance of SpriteAnimation.
   *
   * @param {Sprite} sprite The Sprite object of the sprite animation.
   * @param {number} fps Frames per second.
   * @param {number} [initFrame] - The initial animation starting frame.
   */
  constructor(sprite: Sprite, fps: number, initFrame?: number) {
    this.fps = fps;
    this.image = sprite.image;
    this.frameIndex = initFrame ?? -1;
    this.height = sprite.image.height;
    this.numFrames = sprite.numFrames;
    this.frameWidth = sprite.frameWidth;
    this.opacity = 1;
    this.cycleCounter = 0;
  }

  /**
   * Update the sprite animation frame by frame on each function call.
   */
  update() {
    this.cycleCounter += 1;
    if (this.cycleCounter > this.fps) {
      this.cycleCounter = 0;
      // Update and reset the frame index at the end of the animation
      this.frameIndex = (this.frameIndex + 1) % this.numFrames;
    }
  }

  /**
   * Render the animated sprite frame by frame on each function call.
   *
   * @param {CanvasRenderingContext2D} context The 2D canvas context.
   * @param {number} x The x position coordinate of the sprite animation.
   * @param {number} y The y position coordinate of the sprite animation.
   * @param {number} angle The angle, in radians, of the sprite animation.
   */
  render(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) {
    // Configure the translation point to sprite's center when rotating
    const translateX = x + this.frameWidth / 2;
    const translateY = y + this.height / 2;

    // Save current state of the canvas prior to rendering
    context.save();

    // Configure the canvas opacity
    context.globalAlpha = this.opacity;

    // Translate and rotate canvas to draw the Sprite at an angle
    context.translate(translateX, translateY);
    context.rotate(angle);
    context.translate(-translateX, -translateY);

    // Draw a frame of the Sprite
    context.drawImage(
      this.image,
      this.frameIndex * this.frameWidth,
      0,
      this.frameWidth,
      this.height,
      x,
      y,
      this.frameWidth,
      this.height
    );

    // Restore the canvas state prior to rendering
    context.restore();
  }

  /**
   * Reduce the opacity of the sprite animation. This generates a fade out
   * effect for sprite animation.
   *
   * @param {number} FPS The game's frames per second.
   * @param {number} fadeSpeed The speed, in seconds, of the fade out
   * effect.
   */
  reduceOpacity(FPS: number, fadeSpeed: number) {
    this.opacity -= 1 / (FPS * fadeSpeed);
    // Condition the opacity so it is non-negative
    if (this.opacity < 0) {
      this.opacity = 0;
    }
  }
}
