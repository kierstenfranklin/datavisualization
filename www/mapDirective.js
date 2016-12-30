angular.module('dataVisualization')
.directive('mapDirective', function(){
    return{
        replace: false,
        scope: {
            crimes: '=',
            neighborhood: '=',
            crimeType: '=',
            timeFilter: '=',
            time: '=',
            changeGradient: '=',
            updateMethod: '='
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {

            scope.$watch("neighborhood",function(newValue,oldValue) {
                initMap();
            });
            scope.$watch("crimeType", function(newValue,oldValue){
                initMap();
            });
            scope.$watch("timeFilter", function(newValue, oldValue){
                initMap();
            });
            scope.$watch("time", function(newValue, oldValue){
                initMap();
            });
            scope.$watch("changeGradient", function(newValue, oldValue){
                initMap();
            });
            var map, heatmap;

            function initMap() {
                var zoom, radius;
                if(scope.neighborhood.name === "All"){
                    zoom = 13;
                    radius = 17;
                }else{
                    zoom = 15;
                    radius = 20;
                }
                map = new google.maps.Map(document.getElementById('map'), {

                    zoom: zoom,
                    center: {lat: scope.neighborhood.lat, lng: scope.neighborhood.long},
                    mapTypeId: 'roadmap'
                });
                heatmap = new google.maps.visualization.HeatmapLayer({
                    data: getPoints(),
                    map: map
                });
                if(scope.changeGradient === true){
                    var gradient = [
                        'rgba(0, 255, 255, 0)',
                        'rgba(0, 255, 255, 1)',
                        'rgba(0, 191, 255, 1)',
                        'rgba(0, 127, 255, 1)',
                        'rgba(0, 63, 255, 1)',
                        'rgba(0, 0, 255, 1)',
                        'rgba(0, 0, 223, 1)',
                        'rgba(0, 0, 191, 1)',
                        'rgba(0, 0, 159, 1)',
                        'rgba(0, 0, 127, 1)',
                        'rgba(63, 0, 91, 1)',
                        'rgba(127, 0, 63, 1)',
                        'rgba(191, 0, 31, 1)',
                        'rgba(255, 0, 0, 1)'
                    ]
                    heatmap.set('gradient', gradient);

                }
                heatmap.set('radius', radius);

            }
            initMap();

            function getPoints() {
                var points = [];
                var selectedCrimes = [];
                var selectedNeighborhood = scope.neighborhood.name;
                var selectedCrimeType = scope.crimeType.toUpperCase();
                for(var i = 0; i < scope.crimes.length; i++){
                    if(selectedNeighborhood === 'All' || scope.crimes[i][16] === selectedNeighborhood){
                        if(selectedCrimeType === 'ALL' || scope.crimes[i][12] === selectedCrimeType){
                            if(scope.timeFilter === 'All' || scope.timeFilter === 'Before' && scope.time > scope.crimes[i][9] || scope.timeFilter === 'After' && scope.time < scope.crimes[i][9]){
                                selectedCrimes.push(scope.crimes[i]);
                                var latitude = scope.crimes[i][17][1];
                                var longitude = scope.crimes[i][17][2];
                                if(latitude && longitude){
                                    latitude = latitude.substring(0,6);
                                    longitude = longitude.substring(0,7);
                                    points.push(new google.maps.LatLng(latitude, longitude));
                                }
                            }
                        }
                    }
                }
                scope.updateMethod(selectedCrimes);
                return points;
            }

        }
    }
});
