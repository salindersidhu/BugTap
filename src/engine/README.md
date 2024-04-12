# BugTap Engine Docs

## Class Diagrams

The class diagrams illustrate the core components of a game engine designed for developing interactive web-based games. The diagrams depict relationships and interactions between classes such as `Entity`, `EntityFactory`, `Game`, `Sprite`, `BoundingBox`, and `Text`. These classes represent fundamental elements of game development, including game entities, collision detection, and rendering images or text. The relationships depicted in the diagrams showcase how these classes collaborate to create, manage, and render game elements within the engine.

```mermaid
classDiagram
    class BoundingBox {
        - x: number
        - y: number
        - width: number
        - height: number
        + constructor(x: number, y: number, width: number, height: number)
        + isOverlapping(bbox: BoundingBox): boolean
        + isIntersecting(bbox: BoundingBox): boolean
        + isOverlappingPoint(x: number, y: number): boolean
    }

    class Sprite {
      -_image: HTMLImageElement
      -_height: number
      -_width: number
      -_frameIndex: number
      -_numFrames: number
      -_speed: number
      -_frameCounter: number
      +constructor(src: string, height: number, width: number, speed: number, numFrames: number, initFrame: number = -1)
      +update(fps: number): void
      +render(context: CanvasRenderingContext2D, x: number, y: number, angle: number, opacity: number = 1): void
    }

    class Text {
      -_text: string
      -_fontFamily: string
      -_fontSize: string
      -_fontWeight: number | string
      -_colour: string
      -_hasOutline: boolean
      -_outlineColour: string
      -_outlineWidth: number
      +constructor(text: string, fontFamily: string, fontSize: string, fontWeight: number | string, colour: string)
      +setOutline(colour: string, width: number): void
      +getText(): string
      +render(context: CanvasRenderingContext2D, x: number, y: number, angle: number, opacity: number, scale: number = 1): void
    }

    class Entity {
        - canvas: HTMLCanvasElement
        - context: CanvasRenderingContext2D
        - _isPausable: boolean
        - _drawPriority: number
        - _delete: boolean = false
        + constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, drawPriority: number = 0, isPausable: boolean = true)
        + abstract update(fps: number, entities: Entity[]): void
        + abstract render(): void
        + delete(): void
        + isDeleted(): boolean
        + drawPriority(): number
        + isPausable(): boolean
    }
    Entity --> Sprite : Contains
    Entity --> BoundingBox : Contains
    Entity --> Text : Contains

    class EntityFactory {
        - _canvas: HTMLCanvasElement
        - _context: CanvasRenderingContext2D
        - _entityFactory: Function
        + constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, entityFactory: Function)
        + createEntity(...args: any[]): T
    }
    EntityFactory --* Entity : Composition

    class Game {
      -debug: boolean = false
      -canvas: HTMLCanvasElement
      -context: CanvasRenderingContext2D
      -entities: Entity[] = []
      -_fps: number = 0
      -_state: State = State.STOPPED
      -_lastFrameTime: number
      -_frameCount: number = 0
      +constructor(canvasId: string)
      +protected addEntity(entity: Entity): void
      +protected addEntities(entities: Entity[]): void
      +protected clearAllEntities(): void
      +protected isPaused(): boolean
      +protected isRunning(): boolean
      +protected isStopped(): boolean
      +protected start(): void
      +protected pause(): void
      +protected resume(): void
      +protected stop(): void
      -_loop(): void
      -_update(fps: number, entities: Entity[]): void
      -_render(): void
      -_updateFps(): void
      -_deleteEntity(targetEntity: Entity): void
      -_sortEntitiesByDrawPriority(entityA: Entity, entityB: Entity): number
    }
    Game --> Entity : Contains
```
