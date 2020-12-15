
class GameEngine {
	constructor() {
		this.title = 'Snake';
		this.author = 'JP Beyong';

		this.scale = 30;
		this.cols = 20;
		this.rows = 20;
		
		this.MAX_WIDTH = this.cols * this.scale;
		this.MAX_HEIGHT = this.rows * this.scale;

		this.centerX = Math.floor(this.MAX_WIDTH / 2);
		this.centerY = Math.floor(this.MAX_HEIGHT / 2);

		this.BG_COLOR = 'black';
		this.defaultFont = '30px san-serif';

		this.canvas = null;
		this.ctx = null;

		this.score = 0;
		this.scorePoints = 100;
		this.highscore = this.score;

		this.foodColors = ["yellow", "orange", "red", "violet", "green", "blue"];
		this.snake = null;

		this.recentlyStarted = true;

		this.createCanvas(this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	// Main Functions

	init() {
		this.snake = new Snake(globalName, Math.floor(this.cols / 2), Math.floor(this.rows / 2), 5, 'yellow', this);
	}

	update() {
		if (this.snake && this.snake.alive) {
			this.snake.update();
		}
	}

	render() {
		this.renderBackgroundScreen();

		if (this.recentlyStarted) {
			this.renderStartingScreen();
		}
		else if (this.snake && this.snake.alive) {
			this.renderInGameScreen();
		}
		else {
			this.renderPlayAgainScreen();
		}
	}

	// Render Screen Functions

	renderBackgroundScreen() {
		this.ctx.fillStyle = this.BG_COLOR;
		this.ctx.fillRect(0, 0, this.MAX_WIDTH, this.MAX_HEIGHT);
	}

	renderStartingScreen() {
		this.renderText(this.title, this.centerX, 240, 'white', 'center');
		this.renderText('By: ' + this.author, this.centerX, 270, 'white', 'center');

		if (globalName.length === 0) {
			this.renderText('{Please enter your name}', this.centerX, 320, 'yellow', 'center', '15px san-serif');
		}
		else {
			this.renderText(globalName, this.centerX, 320, 'yellow', 'center', '15px san-serif');
		}

		this.renderText('[Press Enter to Play]', this.centerX, 340, 'white', 'center', '15px san-serif');

		if (keypress[13] && globalName.length > 0) {
			this.recentlyStarted = false;
			this.init();
		}
	}

	renderInGameScreen() {
		this.snake.render(this.ctx);
		this.renderText(this.score, 40, 50, 'white');

		this.ctx.globalAlpha = 0.6;

		this.ctx.fillStyle = "white";
		this.ctx.fillRect(this.MAX_WIDTH - 20, 100, 10, this.snake.gaugeLimit * 2);

		this.ctx.fillStyle = "orange";
		this.ctx.fillRect(this.MAX_WIDTH - 20, 500 - (this.snake.gauge * 2), 10, this.snake.gauge * 2);

		this.ctx.globalAlpha = 1;
	}

	renderPlayAgainScreen() {
		if (this.score > this.highscore) {
			this.highscore = this.score;
		}

		this.renderText('Score: ' + this.score, this.centerX, 220, 'white', 'center');
		this.renderText('High Score: ' + this.highscore, this.centerX, 270, 'white', 'center');
		this.renderText('You died ' + globalName, this.centerX, 320, 'yellow', 'center', '15px san-serif');
		this.renderText('[Press Enter to Play Again]', this.centerX, 350, 'white', 'center', '15px san-serif');

		if (keypress[13]) {
			this.score = 0;
			this.init();
		}
	}

	// Canvas Functions

	createCanvas(width, height) {
		this.canvas = document.createElement('canvas');
		this.ctx = this.canvas.getContext('2d');

		this.canvas.width = width;
		this.canvas.height = height;

		document.body.appendChild(this.canvas);
	}

	renderText(text, x, y, color, alignment, font) {
		if (font === undefined) {
			font = this.defaultFont;
		}

		if (alignment === 'center') {
			this.ctx.textBaseline = 'middle';
			this.ctx.textAlign = 'center';
		}

		this.ctx.font = font;
		this.ctx.fillStyle = color;
		this.ctx.fillText(text, x, y);

		if (alignment === 'center') {
			this.ctx.textBaseline = 'alphabetic';
			this.ctx.textAlign = 'start';
		}
	}

	// Special Functions

	collide(a, b) {
		if (a.x < b.x + b.width && a.x + a.width > b.x) {
			if (a.y < b.y + b.height && a.y + a.height > b.y) {
				return true;
			}
		}

		return false;
	}

	randRange(min, max) {
		return Math.floor((Math.random() * (max - min)) + min);
	}
}