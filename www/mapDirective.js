angular.module('dataVisualization')
.directive('mapDirective', function(){
    return{
        replace: false,
        scope: {
            crimes: '=',
            neighborhood: '=',
            crimeType: '=',
            timeFilter: '='
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {

            scope.$watch("neighborhood",function(newValue,oldValue) {
                initMap();
            });
            scope.$watch("crimeType", function(newValue,oldValue){
                initMap();
            })
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
                heatmap.set('radius', radius);

            }
            initMap();

            function getPoints() {
                var points = [];
                var selectedNeighborhood = scope.neighborhood.name;
                console.log("selected neighboorhood" + selectedNeighborhood);
                var selectedCrimeType = scope.crimeType;
                console.log("type " + selectedCrimeType);
                for(var i = 0; i < scope.crimes.length; i++){
                    if(scope.crimes[i][16] === selectedNeighborhood && scope.crimes[i][12] === selectedCrimeType ||
                        selectedNeighborhood === 'All' && scope.crimes[i][12] === selectedCrimeType ||
                        scope.crimes[i][16] === selectedNeighborhood && selectedCrimeType === "ALL" ||
                        selectedNeighborhood === 'All' && selectedCrimeType === "ALL"){
                        var latitude = scope.crimes[i][17][1];

                        var longitude = scope.crimes[i][17][2];
                        if(latitude && longitude){
                            latitude = latitude.substring(0,6);
                            longitude = longitude.substring(0,7);
                            points.push(new google.maps.LatLng(latitude, longitude));
                        }
                    }

                }
                return points;
            }

        }
    }
});
