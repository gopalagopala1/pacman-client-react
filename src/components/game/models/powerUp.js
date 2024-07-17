export default class PowerUp {
  constructor({ position }, tileLength) {
    this.position = position;
    this.image = new Image();
    this.image.src = "./images/coin.png";
    this.hasBeenEaten = false;
    this.rate = -tileLength / 50;
    this.tileLength = tileLength;
    this.radius = (tileLength * 7) / 20; // Initialize radius as in the original code
  }

  changeEatenState() {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  update(ctx) {
    this.draw(ctx);
    this.flash();
  }

  draw(ctx) {
    const scaledWidth = (this.image.width / this.tileLength) * this.radius * 2;
    const scaledHeight =
      (this.image.height / this.tileLength) * this.radius * 2;
    const offsetX = (scaledWidth - this.image.width) / 2;
    const offsetY = (scaledHeight - this.image.height) / 2;

    ctx.drawImage(
      this.image,
      this.position.x - offsetX,
      this.position.y - offsetY,
      scaledWidth,
      scaledHeight
    );
  }

  flash() {
    if (
      this.radius <= this.tileLength / 4 ||
      this.radius >= (this.tileLength * 9) / 20
    ) {
      this.rate = -this.rate;
    }
    this.radius += this.rate;
  }
}
