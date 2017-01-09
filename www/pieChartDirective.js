angular.module("dataVisualization")
.directive("pieChartDirective", function(){
    return {
        replace: false,
        scope: {
            selectedCrimesMonthly: "=",
            changeGradient: "="

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
            var colors = {
                first: "#FF604A",
                second: "#F1F762",
                third: "#A1F75E"
            };
            var color = createScale();

            scope.$watch("changeGradient", function(newValue, oldValue){
                if(scope.changeGradient === false){
                    colors = {
                        first: "#FF604A",
                        second: "#F1F762",
                        third: "#A1F75E"
                    }
                }else{
                    colors = {
                        first: "#FF604A",
                        second:"#5D5DD4",
                        third: "#66FCFF"
                    }
                }
            });


        var svg = d3.select("#pieWrapper").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("id", "chart2")
        .append("g")
        .attr("transform", "translate(" + (width / 2) +  "," + (height / 2) + ")");

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

        createChart(svg);
        createTitle(svg)



        scope.$watch("selectedCrimesMonthly",function(newValue,oldValue) {
            svg.selectAll("*").remove();
            color = createScale();
            createChart(svg);
            createTitle(svg)

        });

        function createScale(){
            var max = d3.max(d3.entries(scope.selectedCrimesMonthly), function(d){
                return d.value;
            });
            var color = d3.scaleLinear()
            .domain([0, max])
            .range([colors.third, colors.second, colors.first]);

            return color;
        }
        function createTitle(){
            svg.append("text")
            .attr("x", 0)
            .attr("y", -221)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Crimes Per Month");
        }
        function createChart(svg){
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];
            var sum = 0;
            for(var i = 1; i < scope.selectedCrimesMonthly.length; i++){
                if(scope.selectedCrimesMonthly[i]){
                    sum = sum + scope.selectedCrimesMonthly[i];
                }
            }
            path = svg.selectAll("path")
            .data(pie(d3.entries(scope.selectedCrimesMonthly)))
            .enter()
            .append("path")
            .attr("d", arc)
            .classed("path", true)
            .attr("fill", function(d, i) {
                return color(d.data.value);
            });
            path.on("mouseenter", function(d){
                d3.select(this)
                	.attr("fill", "red");
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
                d3.select(this).attr("fill", function(d) {
                return "" + color(d.data.value) + "";
                });
                tooltip.style("display", "none");
            });
        }
    }
}
});
