import Population from "./models/Population.mjs";
window.$CONTAINER = $(".container");
window.$MUTATION_PERCENTAGE = 30;
window.$BRAIN_SIZE = 500;
window.$POPULATION_SIZE = 1000;
window.$ONE_STEP = 5;
window.$ONLY_BEST = false;

let task;
let population;

$("#population").val(window.$POPULATION_SIZE);
$("#population").change(function(){
  window.$POPULATION_SIZE = this.value;
});
$("#mutationPercentage").val(window.$MUTATION_PERCENTAGE);
$("#mutationPercentage").change(function(){
  window.$MUTATION_PERCENTAGE = this.value;
});
$("#totalSteps").val(window.$BRAIN_SIZE);
$("#totalSteps").change(function(){
  window.$BRAIN_SIZE = this.value;
});
$("#oneStep").val(window.$ONE_STEP);
$("#oneStep").change(function(){
  window.$ONE_STEP = this.value;
});
$("#start").click(start);
$("#stop").click(stop);
$('#onlyBest').change(function() {
  if($(this).is(":checked")) {
    window.$ONLY_BEST = true;
    return;
  }
  window.$ONLY_BEST = false;
});

function start(){
  if(population){
    population.clear();
    $("#generation").html(1);
    $("#bestStep").html(0);
    $("#bestFitness").html(0);
    $("#fitnessSum").html(0);
  }
  population = new Population();
  population.show();
  task = setInterval(function(){
    if(!population.allDotsDead() && !population.complete){
      population.update();
    }else{
      population.calculateFitness();
      population.naturalSelection();
      population.mutateBabies();
      population.show();
      population.complete = false;
      $("#generation").html(population.generation);
      $("#bestStep").html(population.bestDot.brain.step);
      $("#bestFitness").html(population.bestDot.fitness);
      $("#fitnessSum").html(population.fitnessSum);
    }
  },1);
}
function stop(){
  clearInterval(task);
}
