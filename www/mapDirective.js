angular.module('dataVisualization')
.directive('mapDirective', function(){
    return{
        replace: false,
        scope: {
            neighborhood: "=",
            changeGradient: '=',
            points: "=",
            updateMethod: "="
        },
        template: '<div></div>',
        link: function (scope, element, attrs) {
            var map, heatmap;
            var initMap = function() {
                console.log(scope.neighborhood);
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
                    data: scope.points,
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
            scope.updateMethod(initMap);
            initMap();

        }
    }
});
