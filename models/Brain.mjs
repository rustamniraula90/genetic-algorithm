export default class Brain {
  constructor() {
    this.step = 0;
    this.size = window.$BRAIN_SIZE;
    this.directions = [];
    this.mutationRate = (window.$MUTATION_PERCENTAGE/100);
    this.randomize();
  }

  randomize(){
    for(var i=0;i<this.size;i++){
      this.directions[i] = getRndInteger(0,5);
    }
  }

  mutate(){
    for (var i =0; i< this.directions.length; i++) {
      var rand = Math.random();
      if (rand < this.mutationRate) {
        this.directions[i] = this.directions[i] = getRndInteger(0,5);
      }
    }
  }

  clone(){
    var clone = new Brain(this.size);
    for (var i = 0; i < this.directions.length; i++) {
      clone.directions[i]=this.directions[i];
    }
    return clone;
  }

}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
