angular.module('crimeData', [])
.controller('dataController', function($scope, $http, $filter, filterFactory, $timeout){

    $http.get('data/data.json').then(function(result){
        $scope.crimes = result.data.data;
        $scope.selectedCrimes = $scope.crimes;
        $scope.selectedCrimesPerDay = [];
        $scope.updateCrimes();
    });
    $scope.neighborhoods = filterFactory.getNeighborhoods();
    $scope.crimeTypes = filterFactory.getCrimeTypes();
    $scope.timeFilters = filterFactory.getTimeFilters();

    $scope.setDefault=function(){
        $scope.neighborhood = $scope.neighborhoods[0];
        $scope.crimeType = $scope.crimeTypes[0];
        $scope.timeFilter = $scope.timeFilters[0];
        $scope.curPage = {};
        $scope.time = {};
        $scope.curPage.value = 0;
        $scope.changeGradient = false;
    }
    $scope.resetDefault = function(){
        $scope.setDefault();
        $scope.updateCrimes();
    }

    $scope.setDefault();

    $scope.setNeighborhood=function(neighborhood){
        $scope.neighborhood = neighborhood;
        $scope.updateCrimes();
    }
    $scope.setCrimeType=function(crimeType){
        $scope.crimeType = crimeType;
        $scope.updateCrimes();
    }
    $scope.setTimeFilter=function(timeFilter){
        $scope.timeFilter = timeFilter;
        $scope.updateCrimes();
    }
    $scope.setChangeGradient=function(changeGradient){
        $scope.changeGradient = changeGradient;
        $scope.updateCrimes();
    }
    $scope.reloadMap = function(method){
        $scope.reload = method;
    }
    $scope.updateCrimes=function(){
        console.log($scope.neighborhood);
        $scope.curPage.value=0;
        var selectedTime = $filter('date')($scope.time.value, "HH:mm:ss");
        var selectedNeighborhood = $scope.neighborhood.name;
        var selectedCrimeType = $scope.crimeType.toUpperCase();
        $scope.selectedCrimesPerDay = [];
        $scope.selectedCrimes = [];
        $scope.points = [];
        for(var i = 0; i< $scope.crimes.length; i++){
            if(selectedNeighborhood === 'All' || $scope.crimes[i][16] === selectedNeighborhood){
                if(selectedCrimeType === 'ALL' || $scope.crimes[i][12] === selectedCrimeType){
                    if($scope.timeFilter === 'All' || $scope.timeFilter === 'Before' && selectedTime > $scope.crimes[i][9] || $scope.timeFilter === 'After' && selectedTime < $scope.crimes[i][9]){
                        buildCrimesPerDayChart($scope.crimes[i]);
                        buildMap($scope.crimes[i]);
                    }
                }
            }
        }
        if($scope.reload){
            $timeout(function(){
                $scope.reload();
            }, 250);
        }

    }
    function buildCrimesPerDayChart(crime){
        if($scope.selectedCrimesPerDay[crime[8]]){
            $scope.selectedCrimesPerDay[crime[8]]++;
        }else{
            $scope.selectedCrimesPerDay[crime[8]] = 0;
            $scope.selectedCrimesPerDay[crime[8]]++;
        }
    }
    function buildMap(crime){
        $scope.selectedCrimes.push(crime);
        var latitude = crime[17][1];
        var longitude = crime[17][2];
        if(latitude && longitude){
            latitude = latitude.substring(0,6);
            longitude = longitude.substring(0,7);
            $scope.points.push(new google.maps.LatLng(latitude, longitude));
        }
    }
})
