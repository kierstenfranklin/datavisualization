angular.module("dataVisualization")
.filter("pagination", function(){
     return function(input, start){
      start = +start;
      if(input){
          return input.slice(start);
      }
     };
 });
