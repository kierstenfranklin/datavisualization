angular.module("dataVisualization")
.directive("pieChartDirective", function(){
    return {
        replace: false,
        scope: {
            selectedCrimesMonthly: "="

        },
        template: "<div></div>",
        link: function(scope){
            var wrapperDiv = document.getElementById("pieWrapper");
            var width = wrapperDiv.clientWidth;
            var height = 500;
            var margin = {
                right: 20,
                left: 20,
                top: 58
            };
            w = width - margin.right- margin.left;
            var radius = Math.min(w, height) / 2;
            var donutWidth = 75;
            var color = d3.scaleOrdinal(d3.schemeCategory20);
            var sum = 0;
            for(var i = 1; i < scope.selectedCrimesMonthly.length; i++){
                sum = sum + scope.selectedCrimesMonthly[i];
            }
            var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        var svg = d3.select("#pieWrapper").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "chart2")
        .append("g")
        .attr("transform", "translate(" + (width / 2) +  ',' + (height / 2) + ")");

        var arc = d3.arc()
        .innerRadius(radius-donutWidth)
        .outerRadius(radius);
        var pie = d3.pie()
        .value(function(d) {
            return d.value;
        })
        .sort(null);
        var tooltip = d3.select("#graph2")
        .append("div")
        .attr("class", "tooltip");
        tooltip.append("div")
        .attr("class", "month");
        tooltip.append("div")
        .attr("class", "count");
        tooltip.append("div")
        .attr("class", "percent");
        var path = svg.selectAll('path')
        .data(pie(d3.entries(scope.selectedCrimesMonthly)))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', function(d, i) {
            return color(d.data.key);
        });
        path.on("mouseenter", function(d){
            var percent = Math.round(100 * d.data.value / sum);
            tooltip.select(".month").html(monthNames[d.data.key - 1]);
            tooltip.select(".count").html(d.data.value);
            tooltip.select(".percent").html(percent + "%");
            tooltip.style("opacity", 1);
            tooltip.style("display", "block");
            tooltip.style("left", (d3.event.offsetX) + "px")
            tooltip.style("top", (d3.event.offsetY - 28) + "px");
        })
        .on("mouseleave", function(d){
            tooltip.style("display", "none");
        });


        scope.$watch("selectedCrimesMonthly",function(newValue,oldValue) {
            svg.selectAll('*').remove();


            var sum = 0;
            for(var i = 1; i < scope.selectedCrimesMonthly.length; i++){
                if(scope.selectedCrimesMonthly[i]){
                    sum = sum + scope.selectedCrimesMonthly[i];
                }
            }
            path = svg.selectAll('path')
            .data(pie(d3.entries(scope.selectedCrimesMonthly)))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d, i) {
                return color(d.data.key);
            });
            path.on("mouseenter", function(d){
                var percent = Math.round(100 * d.data.value / sum);

                tooltip.select(".month").html(monthNames[d.data.key - 1]);
                tooltip.select(".count").html(d.data.value + " crimes");
                tooltip.select(".percent").html(percent + "%");
                tooltip.style("opacity", 1);
                tooltip.style("display", "block");
                tooltip.style("left", (d3.event.offsetX) + "px")
                tooltip.style("top", (d3.event.offsetY - 28) + "px");
            })
            .on("mouseleave", function(d){
                tooltip.style("display", "none");
            });
            svg.append("text")
            .attr("x", 0)
            .attr("y", -221)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Crimes Per Month");
            console.log("width", width/2);
            console.log('height', margin.top/2);
        });

    }
}
});
