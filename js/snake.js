class Snake {
	constructor(name, x, y, length, color, game) {
		this.name = name;
		this.game = game;

		this.delayUpdateTimer = 0;
		this.delayUpdateLimit = 8;
		this.delayUpdateMax = this.delayUpdateLimit;

		this.x = x;
		this.y = y;
		this.color = color;

		this.vx = 1;
		this.vy = 0;
		this.speed = 1;

		this.alive = true;

		this.food = null;

		this.length = length;
		this.body = [];

		for (let i = 0; i < this.length; i++) {
			this.body.push(new Food(this.x, this.y, this.game.scale, this.color));
		}

		this.generateFood();

		this.gauge = 0;
		this.gaugePoints = 20;
		this.gaugeLimit = 200;
		this.gaugeDraining = false;

		this.invulnerable = false;
		this.alpha = 1;
		this.alphaValue = 0.05;
		this.alphaDir = -this.alphaValue;
	}

	update() {
		if (this.alive) {
			if (this.delayUpdateTimer >= this.delayUpdateLimit) {
				this.x += this.vx;
				this.y += this.vy;

				console.log(this.x + ", " + this.y + " = " + this.food.x + ", " + this.food.y);
				
				if (this.x < 0) {
					this.x = this.game.rows - 1;
				}
				else if (this.x > this.game.rows - 1) {
					this.x = 0;
				}
				else if (this.y < 0) {
					this.y = this.game.cols - 1;
				}
				else if (this.y > this.game.cols - 1) {
					this.y = 0;
				}

				this.updatePosition();

				if (this.x === this.food.x && this.y === this.food.y) {
					this.delayUpdateLimit = this.delayUpdateMax - Math.floor(this.game.score / 5000);

					if (this.delayUpdateLimit < 1) {
						this.delayUpdateLimit = 1;
					}

					this.eat(this.food);
					this.generateFood();
					this.game.score += this.game.scorePoints;
					this.gauge += this.gaugePoints;

					console.log("EATEN");
				}
				else if (!this.invulnerable && this.isCollided(this.body[this.body.length - 1].x, this.body[this.body.length - 1].y)) {
					this.alive = false;
				}
				

				this.delayUpdateTimer = 0;
			}
			else {
				this.delayUpdateTimer++;
			}

			if (this.gaugeDraining) {
				if (this.gauge === 0) {
					this.gaugeDraining = false;
					this.invulnerable = false;
					this.alpha = 1;
				}
				else if (this.gauge > 0) {
					this.gauge--;

					if (this.alpha < 0.1) {
						this.alphaDir = this.alphaValue;
					}
					else if (this.alpha > 1) {
						this.alphaDir = -this.alphaValue;
					}

					this.alpha += this.alphaDir;
				}
				else if (this.gauge < 0) {
					this.gauge = 0;
				}
			}
			else if (this.gauge >= this.gaugeLimit) {
				this.gaugeDraining = true;
				this.invulnerable = true;
				this.alpha = 1;
			}

			this.checkKeyPress();
		}
	}

	render(ctx) {
		if (this.alive) {
			this.food.render(ctx);

			ctx.globalAlpha = this.alpha;
			ctx.strokeStyle = "white";

			for (let i = 0; i < this.body.length; i++) {
				if (i < this.body.length - 1) {
					ctx.globalAlpha = this.alpha * 0.5;
				}
				else {
					ctx.globalAlpha = this.alpha;
				}

				this.body[i].render(ctx);
			}

			if (this.alpha !== 1) {
				ctx.globalAlpha = 1;
			}

			ctx.strokeStyle = "black";

			this.game.renderText(this.name, (this.x * this.game.scale) + (this.game.scale / 2), (this.y * this.game.scale) - 10, "white", "center", "15px san-serif");
		}
	}

	checkKeyPress() {
		if (keypress[37] || keypress[65] && this.vx === 0) {
			this.vx = -this.speed;
			this.vy = 0;
		}
		else if (keypress[39] || keypress[68] && this.vx === 0) {
			this.vx = this.speed;
			this.vy = 0;
		}

		if (keypress[38] || keypress[87] && this.vy === 0) {
			this.vy = -this.speed;
			this.vx = 0;
		}
		else if (keypress[40] || keypress[83] && this.vy === 0) {
			this.vy = this.speed;
			this.vx = 0;
		}
	}

	generateFood() {
		if (!this.invulnerable && this.body.length >= this.game.rows * this.game.cols) {
			this.alive = false;
		}
		else {
			let x = this.game.randRange(0, this.game.cols);
			let y = this.game.randRange(0, this.game.rows);
			let color = this.game.foodColors[this.game.randRange(0, this.game.foodColors.length)];

			while (this.isCollided(x, y)) {
				x = this.game.randRange(0, this.game.cols);
				y = this.game.randRange(0, this.game.rows);
			}

			this.food = new Food(x, y, this.game.scale, color);
		}
	}

	updatePosition() {
		for (let i = 0; i < this.body.length; i++) {
			if (i === this.body.length - 1) {
				this.body[i].update({x: this.x, y: this.y});
			}
			else {
				this.body[i].update(this.body[i + 1]);
			}
		}
	}

	eat(food) {
		this.body.push(food);
	}

	isCollided(x, y) {
		for (let i = 0; i < this.body.length - 1; i++) {
			if (x === this.body[i].x && y === this.body[i].y) {
				return true;
			}
		}

		return false;
	}
}