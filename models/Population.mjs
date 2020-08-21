import Dot from "./Dot.mjs";
export default class Popultion {
  constructor() {
    this.generation = 1;
    this.dotList = [];
    this.fitnessSum = 0;
    this.bestDotIndex = 0;
    this.bestDot = {};
    this.complete = false;
    for(let i=0;i<window.$POPULATION_SIZE;i++){
      this.dotList[i] = new Dot();
    }
  }

  show(){
    this.dotList.forEach((dot) => {
      dot.show();
    });
  }

  update(){
    this.dotList.forEach((dot) => {
      dot.update();
      if(dot.reachedGoal){
        this.complete = true;
      }
    });
  }

  allDotsDead() {
    for (var i = 0; i< this.dotList.length; i++) {
      if (!this.dotList[i].dead && !this.dotList[i].reachedGoal) {
        return false;
      }
    }
    return true;
  }

  calculateFitness(){
    this.dotList.forEach((dot) => {
      dot.calculateFitness();
    });
  }

  calculateBest(){
    var max = 0;
    var maxIndex = 0;
    for (var i = 0; i< this.dotList.length; i++) {
      if (this.dotList[i].fitness > max) {
        max = this.dotList[i].fitness;
        maxIndex = i;
      }
    }
    this.bestDotIndex = maxIndex;
    if (this.dotList[this.bestDotIndex].reachedGoal) {
      this.bestStep = this.dotList[this.bestDotIndex].brain.step;
    }
  }

  calculateFitnessSum() {
    this.fitnessSum = 0;
    for (var i = 0; i< this.dotList.length; i++) {
      this.fitnessSum += this.dotList[i].fitness;
    }
  }

  naturalSelection() {
    var newDots = [];
    this.calculateBest();
    this.calculateFitnessSum();

    newDots[0] = this.dotList[this.bestDotIndex].getBaby();
    newDots[0].isBest = true;
    this.bestDot = this.dotList[this.bestDotIndex];
    for (var i = 1; i< this.dotList.length; i++) {
      var parent = this.selectParent();
      newDots[i] = parent.getBaby();
    }
    for (var i = 0; i< this.dotList.length; i++) {
      this.dotList[i].deleteDom();
    }
    this.dotList = [];
    for (var i = 0; i< newDots.length; i++) {
      this.dotList[i] = newDots[i].clone();
    }
    newDots= [];
    this.generation ++;
  }

  clear(){
    this.dotList.forEach((dot) => {
      dot.deleteDom();
    });
  }

  selectParent() {
    return this.dotList[this.bestDotIndex];
  }

  mutateBabies(){
    this.dotList.forEach((dot) => {
      if(!dot.isBest){
        dot.brain.mutate();
      }
    });
  }
}
