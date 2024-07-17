export default class Pellet {
  constructor({ position = { x: 0, y: 0 } }, tileLength = 10) {
    this.position = position;
    this.tileLength = tileLength; // Assuming tileLength might be used for scaling or other purposes in the future
    this.image = new Image();
    this.image.src = "./images/coin.png";
    this.hasBeenEaten = false;

    // Set the onload event to calculate the aspect ratio once the image is loaded
    this.image.onload = () => {
      this.aspectRatio = this.image.width / this.image.height;
    };
  }

  changeEatenState() {
    this.hasBeenEaten = !this.hasBeenEaten;
  }

  draw(ctx) {
    if (this.image.complete && this.aspectRatio) {
      const reducedWidth = this.tileLength; // Set the desired reduced width here
      const reducedHeight = reducedWidth / this.aspectRatio;
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        reducedWidth,
        reducedHeight
      );
    } else {
      // Fallback if the image is not yet loaded
      ctx.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.tileLength,
        this.tileLength
      );
    }
  }
}
