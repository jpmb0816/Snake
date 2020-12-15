class Food {
	constructor(x, y, scale, color) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.color = color;
	}

	update(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}

	render(ctx) {
		ctx.fillStyle = this.color;
		ctx.strokeRect(this.x * this.scale, this.y * this.scale, this.scale, this.scale);
		ctx.fillRect(this.x * this.scale, this.y * this.scale, this.scale, this.scale);
	}
}