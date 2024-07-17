export default class Pellet {
  constructor({ position }, tileLength) {
    this.position = position;
    this.image = new Image();
    this.image.src = "./images/coin.png";
    this.hasBeenEaten = false;
  }

  changeEatenState() {
    this.hasBeenEaten = this.hasBeenEaten ? false : true;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}
