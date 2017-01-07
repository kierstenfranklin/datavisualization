angular.module('crimeData', [])
.controller('dataController', function($scope, $http, $filter){

    $http.get('data/data.json').then(function(result){
        $scope.crimes = result.data.data;
        $scope.selectedCrimes = $scope.crimes;

        $scope.numberOfPages = function(){
            return Math.ceil($scope.selectedCrimes.length / $scope.pageSize);
        };
        $scope.selectedCrimesPerDay = [];
        for(var i = 0; i< $scope.crimes.length; i++){
            if($scope.selectedCrimesPerDay[$scope.crimes[i][8]]){
                $scope.selectedCrimesPerDay[$scope.crimes[i][8]]++;
            }else{
                $scope.selectedCrimesPerDay[$scope.crimes[i][8]] = 0;
                $scope.selectedCrimesPerDay[$scope.crimes[i][8]]++;
            }
        }
        console.log('HERE', $scope.selectedCrimesPerDay);
    });
    $scope.curPage = 0;
    $scope.pageSize = 10;

    $scope.crimeTypes = ["All", "Agg. Assault", "Arson", "Assault By Threat", "Auto Theft", "Burglary", "Common Assault", "Homicide", "Larceny", "Larceny from Auto", "Rape", "Robbery - Carjacking", "Robbery - Commercial", "Robbery - Residence", "Robbery - Street", "Shooting"];
    $scope.crimeType = $scope.crimeTypes[0];
    $scope.timeFilters = ["All", "Before", "After"];
    $scope.timeFilter = $scope.timeFilters[0];
    $scope.changeGradient = false;

    $scope.time = {};

    $scope.setDefault=function(){
        $scope.neighborhood = $scope.neighborhoods[0];
        $scope.crimeType = $scope.crimeTypes[0];
        $scope.timeFilter = $scope.timeFilters[0];
    }

    $scope.setNeighborhood=function(neighborhood){
        $scope.neighborhood = neighborhood;
        
    }
    $scope.setCrimeType=function(crimeType){
        //crimeType = crimeType.toUpperCase();
        $scope.crimeType = crimeType;
    }
    $scope.setTimeFilter=function(timeFilter){
        $scope.timeFilter = timeFilter;
    }
    $scope.setChangeGradient=function(changeGradient){
        $scope.changeGradient = changeGradient;
    }
    $scope.updateCrimes=function(selectedCrimes){
        $scope.curPage=0;
        $scope.selectedCrimes = selectedCrimes;
        var selectedTime = $filter('date')($scope.time.value, "HH:mm:ss");
        var selectedNeighborhood = $scope.neighborhood.name;
        var selectedCrimeType = $scope.crimeType.toUpperCase();
        $scope.selectedCrimesPerDay = [];
        $scope.selectedCrimes = [];
        $scope.points = [];
        for(var i = 0; i< $scope.crimes.length; i++){
            //console.log($scope.timeFilter + "time: " + $scope.time + "compared to " + $scope.crimes[i][9]  )
        if(selectedNeighborhood === 'All' || $scope.crimes[i][16] === selectedNeighborhood){
            if(selectedCrimeType === 'ALL' || $scope.crimes[i][12] === selectedCrimeType){
                if($scope.timeFilter === 'All' || $scope.timeFilter === 'Before' && selectedTime > $scope.crimes[i][9] || $scope.timeFilter === 'After' && selectedTime < $scope.crimes[i][9]){
                    //console.log("found");
                    if($scope.selectedCrimesPerDay[$scope.crimes[i][8]]){
                        $scope.selectedCrimesPerDay[$scope.crimes[i][8]]++;
                    }else{
                        $scope.selectedCrimesPerDay[$scope.crimes[i][8]] = 0;
                        $scope.selectedCrimesPerDay[$scope.crimes[i][8]]++;
                    }
                    $scope.selectedCrimes.push($scope.crimes[i]);
                    var latitude = $scope.crimes[i][17][1];
                    var longitude = $scope.crimes[i][17][2];
                    if(latitude && longitude){
                        latitude = latitude.substring(0,6);
                        longitude = longitude.substring(0,7);
                        $scope.points.push(new google.maps.LatLng(latitude, longitude));
                    }
                }
            }
        }
    }

    }





    $scope.neighborhoods = [{name: "All", lat: 39.294720, long: -76.6058617},
    {name: "Canton", lat: 39.281637, long: -76.5758397},
    {name: "Central Park Heights", lat:39.343224, long: -76.6716077},
    {name: "Charles Village", lat:39.318968, long:-76.6183417},
    {name: "Fells Point", lat:39.283728, long:-76.5955767},
    {name: "Belair-Edison", lat:39.320965, long:-76.5768377},
    {name: "Inner Harbor", lat:39.28584, long:-76.6139267 },
    {name: "Highlandtown", lat:39.289242, long:-76.5682287 },
    {name: "Cherry Hill", lat:39.250234, long:-76.6287227 },
    {name: "Brooklyn", lat:39.237866, long:-76.6058287 },
    {name: "Mondawmin", lat:39.313887, long:-76.6562667},
    {name: "Sandtown-Winchester", lat:39.303742, long:-76.6462407},
    {name: "Woodberry", lat:39.335142, long:-76.6536797 }];
    $scope.neighborhood= $scope.neighborhoods[0];

    $scope.prevPage=function(){
        if($scope.curPage != 0){
        $scope.curPage=$scope.curPage-1;
        }
    }
    $scope.nextPage=function(){
        console.log($scope.selectedCrimes.length/$scope.pageSize - 1);
        if($scope.curPage < $scope.selectedCrimes.length/$scope.pageSize - 1){

            $scope.curPage = $scope.curPage+1;
        }
    }




    })
.filter('pagination', function(){
     return function(input, start){
      start = +start;
      if(input){
          return input.slice(start);
      }
     };
 });
