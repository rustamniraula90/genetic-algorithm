import Brain from "./Brain.mjs";
export default class Dot {
  constructor(){
    this.brain = new Brain();
    this.positionX = 100;
    this.positionY = 390;
    this.dead = false;
    this.reachedGoal = false;
    this.isBest = false;
    this.domElement = $("<div>").addClass("dot");
    this.currentMove = 0;
    this.fitness = 0;
  }

  show(){
    if(this.isBest){
      window.$CONTAINER.append(this.domElement.addClass("best").css({"left":this.positionX,"top":this.positionY}));
    }else if(!window.$ONLY_BEST){
      window.$CONTAINER.append(this.domElement.css({"left":this.positionX,"top":this.positionY}));
    }
  }

  move(){
    if (this.brain.directions.length > this.brain.step) {
      this.currentMove = this.brain.directions[this.brain.step];
      this.brain.step++;
    } else {
      this.dead = true;
    }
    switch (this.currentMove) {
      case 1://left
      this.positionX = this.positionX-window.$ONE_STEP;
      this.domElement.css("left",this.positionX);
      break;
      case 2://up
      this.positionY = this.positionY-window.$ONE_STEP;
      this.domElement.css("top",this.positionY);
      break;
      case 3://right
      this.positionX = this.positionX+window.$ONE_STEP;
      this.domElement.css("left",this.positionX);
      break;
      case 4://down
      this.positionY = this.positionY+window.$ONE_STEP;
      this.domElement.css("top",this.positionY);
      break;
      default:
      break;
    }
  }

  update(){
    if (!this.dead && !this.reachedGoal) {
      this.move();
      if (this.positionX <= 1|| this.positionY <= 1 || this.positionX >= 198 || this.positionY >= 398) {
        this.dead = true;
      } else if ((this.positionX>90 && this.positionX<105) && (this.positionY>20 && this.positionY<35)) {
        this.reachedGoal = true;
      }
    }
  }

  calculateFitness() {
    if (this.reachedGoal) {
      this.fitness = 1 + 1.0/(this.brain.step * this.brain.step);
    } else {
      var distanceToGoal = this.calculateDistance(this.positionX,this.positionY, 100, 30);
      this.fitness = 1.0/distanceToGoal;
    }
  }

  calculateDistance(x1, y1, x2, y2) {
    return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
  }

  clone(){
    var cloneDot = new Dot();
    cloneDot.brain = this.brain.clone();
    cloneDot.isBest = this.isBest;
    return cloneDot;
  }

  getBaby() {
    var baby = new Dot();
    baby.brain = this.brain.clone();
    return baby;
  }

  deleteDom(){
    this.domElement.remove();
  }

}
