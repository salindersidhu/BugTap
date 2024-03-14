class Player {
    game: BugTap
    x: number;
    y: number;
    radius: number;
    
    constructor(game: BugTap) {
        this.game = game;
        this.x = this.game.height * 0.5;
        this.y = this.game.width * 0.5;
        this.radius = 20;
    }

    draw(context: CanvasRenderingContext2D) {
        context.beginPath();
        context.fillStyle = 'white'
        context.strokeStyle = 'white'
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();
    }

    update() {
        this.x = this.game.mouse.x;
        this.y = this.game.mouse.y;
    }
}


export default class BugTap {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D

    height: number;
    width: number;

    player: Player
    mouse: {
        x: number,
        y: number
    }

    constructor(canvasId: string) {
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasId)!;
        this.context = this.canvas.getContext('2d')!;

        this.player = new Player(this)

        this.height = this.canvas.height;
        this.width = this.canvas.width;

        this.mouse = {
            x: this.height * 0.5,
            y: this.width * 0.5,
        }

        this.canvas.addEventListener('mousemove', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
        })

        this.canvas.style.cursor = "none"

        this.animate();
    }

    animate = () => {
        this.context.clearRect(0, 0, this.width, this.height);
        this.render();
        requestAnimationFrame(this.animate)
    }

    render = () => {
        this.player.draw(this.context);
        this.player.update();
    }
}
