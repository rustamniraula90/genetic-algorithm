$(document).ready(function(){
	var $container = $("#container");
	const POPULATION_SIZE = 100;
	const BRAIN_SIZE = 1000;
	const STEP =1;

	class Brain{
		constructor(size){
			this.step = 0;
			this.size = size;
			this.directions = [];
			this.randomize();

		}

		randomize(){
			for(var i=0;i<this.size;i++){
				this.directions[i] = getRndInteger(0,5);
			}
		}

		clone(){
			var clone = new Brain(this.size);
		    for (var i = 0; i < this.directions.length; i++) {
		      clone.directions[i]=this.directions[i];
		    }
		    return clone;
		}
		mutate() {
		    var mutationRate = 0.01;//chance that any vector in directions gets changed
		    for (var i =0; i< this.directions.length; i++) {
		      var rand = Math.random();
		      if (rand < mutationRate) {
		        //set this direction as a random direction
		        this.directions[i] = this.directions[i] = getRndInteger(0,5);
		      }
		    }
	  	}
	}

	class Dot {
		constructor() {
		  	this.brain = new Brain(BRAIN_SIZE);
		  	this.posX = 250;
		  	this.posY = 480;
		  	this.dead = false;
			this.reachedGoal = false;
			this.isBest = false;
			this.fitness = 0;
			this.domElement = $('<div>').addClass("dot");
			this.acc = 0;
	  	}
	  	show(){
		  	if(this.isBest){
		  		$container.append(this.domElement.addClass("best").css({"left":this.posX,"top":this.posY}));
		  	}else{
				$container.append(this.domElement.css({"left":this.posX,"top":this.posY}));
		  	}
	  	}
	  	move() {
		    if (this.brain.directions.length > this.brain.step) {
		      this.acc = this.brain.directions[this.brain.step];
		      this.brain.step++;
		    } else {
		      this.dead = true;
		    }
		    switch (this.acc) {
		    	case 1://left
		    		this.posX = this.posX-STEP;
		    		this.domElement.css("left",this.posX);
		    		break;
	    		case 2://up
	    			this.posY = this.posY-STEP;
	    			this.domElement.css("top",this.posY);
		    		break;
	    		case 3://right
	    			this.posX = this.posX+STEP;
	    			this.domElement.css("left",this.posX);
		    		break;
	    		case 4://down
	    			this.posY = this.posY+STEP;
	    			this.domElement.css("top",this.posY);
		    		break;
		    	default:
		    		break;
		    }	   
	  	}
	  	update(){
		  	if (!this.dead && !this.reachedGoal) {
		      this.move();
		      if (this.posX< 0|| this.posY<0 || this.posX>495 || this.posY>495) {
		        this.dead = true;
		      } else if ((this.posX>217 && this.posX<233) && (this.posY>42 && this.posX<58)) {
		        this.reachedGoal = true;
		      }
		    }
	  	}
	  	calculateFitness() {
		    if (this.reachedGoal) {
		      this.fitness = 1.0/16.0 + 10000.0/(this.brain.step * this.brain.step);
		    } else {
		      var distanceToGoal = this.calculateDistance(this.posX,this.posY, 225, 50);
		      this.fitness = 1.0/(distanceToGoal * distanceToGoal);
		    }
	  	}

	  	calculateDistance(x1, y1, x2, y2) {       
		    return Math.sqrt((y2 - y1) * (y2 - y1) + (x2 - x1) * (x2 - x1));
		}
		getBaby() {
		    var baby = new Dot();
		    baby.brain = this.brain.clone();
		    return baby;
		}
		clone(){
			var cloneDot = new Dot();
			cloneDot.brain = this.brain.clone();
			cloneDot.isBest = this.isBest;
			return cloneDot;
		}
		deleteDom(){
			this.domElement.remove();
		}
	}

	class Population{
		constructor(size){
			this.generation = 1;
			this.fitnessSum = 0;
			this.bestDotIndex = 0;
			this.dotList =[];
			this.bestStep = 1000;
			for(var i=0;i<size;i++){
				this.dotList[i] = new Dot();
			}
		}
		show(){
			for(var i=0;i<this.dotList.length;i++){
				this.dotList[i].show();
			}
		}
		update() {
		    for (var i = 0; i< this.dotList.length; i++) {
		      if (this.dotList[i].brain.step > this.bestStep) {
		        this.dotList[i].dead = true;
		      } else {
		        this.dotList[i].update();
		      }
		    }
		}
		calculateFitness() {
		    for (var i = 0; i< this.dotList.length; i++) {
		      this.dotList[i].calculateFitness();
		    }
	  	}
	  	allDotsDead() {
		    for (var i = 0; i< this.dotList.length; i++) {
		      if (!this.dotList[i].dead && !this.dotList[i].reachedGoal) { 
		        return false;
		      }
		    }
		    return true;
		}
		calculateFitnessSum() {
		    this.fitnessSum = 0;
		    for (var i = 0; i< this.dotList.length; i++) {
		      this.fitnessSum += this.dotList[i].fitness;
		    }
		}
		setBestDot() {
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
		      this.bestStep = this.dotList[bestDotIndex].brain.step;
		      console.log("step:", this.bestStep);
		    }
		}
		selectParent() {
		    var rand = getRandomDouble(0,this.fitnessSum,(""+this.fitnessSum).split(".")[1].length);
		    var runningSum = 0;

		    for (var i = 0; i< this.dotList.length; i++) {
		      runningSum+= this.dotList[i].fitness;
		      if (runningSum > rand) {
		        return this.dotList[i];
		      }
		    }
		    return null;
		  }
		mutateDots(){
			for (var i = 0; i< dots.length; i++) {
				this.dotList.mutate();
			}
		}
		naturalSelection() {
		   	var newDots = [];
		    this.setBestDot();
		    this.calculateFitnessSum();

		    newDots[0] = this.dotList[this.bestDotIndex].getBaby();
		    newDots[0].isBest = true;
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
		    this.gen ++;
		}
		mutateBabies() {
		    for (var i = 1; i< this.dotList.length; i++) {
		      this.dotList[i].brain.mutate();
		    }
		}
	}

	function getRndInteger(min, max) {
  		return Math.floor(Math.random() * (max - min) ) + min;
	}

	function getRandomDouble(min, max, precision) {
    return Math.round(Math.random() * Math.pow(10, precision)) /
            Math.pow(10, precision) * (max - min) + min;
	}

	function run(){
		var population = new Population(POPULATION_SIZE);
		population.show();
		setInterval(function(){
			if(!population.allDotsDead()){
					population.update();
			}else{
				population.calculateFitness();
				population.naturalSelection();
				population.mutateBabies();
			}
		},1);
	}
	run();
});