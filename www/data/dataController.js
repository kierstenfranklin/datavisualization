angular.module('crimeData', [])
.controller('dataController', function($scope, $http){

    $http.get('data/data.json').then(function(result){
        $scope.crimes = result.data.data;

        $scope.crimeTypes = ["ALL", "AGG. ASSAULT", "ARSON", "ASSAULT BY THREAT", "AUTO THEFT", "BURGLARY", "COMMON ASSAULT", "HOMICIDE", "LARCENY", "LARCENY FROM AUTO", "RAPE", "ROBBERY - CARJACKING", "ROBBERY - COMMERCIAL", "ROBBERY - RESIDENCE", "ROBBERY - STREET", "SHOOTING"];
        $scope.crimeType = $scope.crimeTypes[0];
        $scope.timeFilters = ["all", "before", "after"];
        $scope.timeFilter = $scope.timeFilters[0]

        console.log($scope.crimes[1]);

        $scope.setNeighborhood=function(neighborhood){
            $scope.neighborhood = neighborhood;
        }
        $scope.setCrimeType=function(crimeType){
            $scope.crimeType = crimeType;
        }
        $scope.setTimeFilter=function(timeFilter){
            $scope.timeFilter = timeFilter;
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
    });


});
