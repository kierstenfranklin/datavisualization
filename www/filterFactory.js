angular.module("dataVisualization")
    .factory("filterFactory", function(){
        var neighborhoods = [{name: "All", lat: 39.294720, long: -76.6058617},
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
        var crimeTypes = ["All", "Agg. Assault", "Arson", "Assault By Threat", "Auto Theft", "Burglary", "Common Assault", "Homicide", "Larceny", "Larceny from Auto", "Rape", "Robbery - Carjacking", "Robbery - Commercial", "Robbery - Residence", "Robbery - Street", "Shooting"];
        var timeFilters = ["All", "Before", "After"];

        var factory = {};
        factory.getNeighborhoods = function(){
            return neighborhoods;
        }
        factory.getCrimeTypes = function(){
            return crimeTypes;
        }
        factory.getTimeFilters = function(){
            return timeFilters;
        }
        return factory;
    });
