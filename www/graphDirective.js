angular.module("dataVisualization")
.directive("graphDirective", function(){
    return {
        replace: false,
        scope: {
            crimes: "=",
            selectedCrimesPerDay: "=",
            changeGradient: "="
        },
        template : "<div></div>",
        link: function(scope, element, attrs){
            var wrapperDiv = document.getElementById("graphWrapper");
            var w = wrapperDiv.clientWidth;
            var h = 500;
            var margin = {
                top: 58,
                bottom: 100,
                left: 80,
                right: 40
            };
            var width = w - margin.left - margin.right;
            var height = h - margin.top - margin.bottom;

            var svg = d3.select("#graphWrapper").append("svg")
                .attr("id", "chart")
                .attr("width", w)
                .attr("height", h);
            var chart = svg.append("g")
                .classed("display", true)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S");

            var x = d3.scaleTime()
                .domain(d3.extent(scope.crimes, function(d,i){
                    var date = dateParser(scope.crimes[i][8]);
                    return date;
            }))
                .range([0, width]);
            var y = d3.scaleLinear()
                .domain([0, d3.max(d3.entries(scope.selectedCrimesPerDay), function(d){
                return d.value;
            })])
                .range([height, 0]);

            var xAxis = d3.axisBottom()
                .scale(x)
                .ticks(12);
            var yAxis = d3.axisLeft()
                .scale(y)
                .ticks(6)
                .tickFormat(d3.format("d"));

            var line = d3.line()
            .x(function(d){
                var date = dateParser(d.key);
                return x(date);
            })
            .y(function(d){
                return y(d.value);
            });
            var area = d3.area()
            .x(function(d){
                var date = dateParser(d.key);
                return x(date);
            })
            .y0(height)
            .y1(function(d){
                return y(d.value);
            });


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

            function plot(params){

                drawAxis.call(this, params);

                //enter
                this.selectAll(".area")
                .data([params.data])
                .enter()
                .append("path")
                .classed("area", true);
                this.selectAll(".trendline")
                .data([params.data])
                .enter()
                .append("path")
                .classed("trendline", true);
                this.selectAll(".point")
                .data(params.data)
                .enter()
                .append("circle")
                .classed("point", true)
                .attr("r", 1.5);

                //update
                this.selectAll(".area")
                .attr("d", function(d){
                    return area(d);
                });
                this.selectAll(".trendline")
                .attr("d", function(d){
                    return line(d);
                });
                this.selectAll(".point")
                .attr("cx", function(d){
                    var date = dateParser(d.key);
                    return x(date);
                })
                .attr("cy", function(d){
                    return y(d.value);
                });

                //exit()
                this.selectAll(".area")
                .data([params.data])
                .exit()
                .remove();
                this.selectAll(".trendline")
                .data([params.data])
                .exit()
                .remove();
                this.selectAll(".point")
                .data(params.data)
                .exit()
                .remove();
            }

            function drawAxis(params){
                this.append("g")
                .classed("x axis", true)
                .attr("transform", "translate(0," + height + ")")
                .call(params.axis.x);
                this.append("g")
                .classed("y axis", true)
                .attr("transform", "translate(0,0)")
                .call(params.axis.y);


                //y label
            	this.select(".y.axis")
            		.append("text")
            		.attr("x", 0)
            		.attr("y", 0)
            		.style("text-anchor", "middle")
                    .style("fill", "black")
            		.attr("transform", "translate(-50," + height/2 + ") rotate(-90)")
            		.text("Number of Crimes");
                //x label
            	this.select(".x.axis")
            		.append("text")
            		.attr("x", 0)
            		.attr("y", 0)
            		.style("text-anchor", "middle")
                    .style("fill", "black")
            		.attr("transform", "translate(" + width/2 + ",80)")
            		.text("Time (Months)");

                //title
                this.append("text")
                    .attr("x", width/2)
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "18px")
                    .style("font-weight", "bold")
                    .text("Crimes Per Day");
            }


            plot.call(chart, {
                data: d3.entries(scope.selectedCrimesPerDay),
                axis: {
                    x: xAxis,
                    y: yAxis
                }
            });
            scope.$watch("selectedCrimesPerDay",function(newValue,oldValue) {
                redraw();
            });

            function redraw(){
                y = d3.scaleLinear()
                .domain([0, d3.max(d3.entries(scope.selectedCrimesPerDay), function(d){
                    return d.value;
                })])
                .range([height, 0]);

                var max = d3.max(d3.entries(scope.selectedCrimesPerDay), function(d){
                    return d.value;
                });
                var tickCount;
                if(max >= 10){
                    tickCount = 6;
                }else{
                    tickCount = max;
                }

                yAxis = d3.axisLeft()
                    .scale(y)
                    .ticks(tickCount)
                    .tickFormat(d3.format("d"));


                svg.append("linearGradient")
                    .attr("id", "temperature-gradient")
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", 0).attr("y1", height)
                    .attr("x2", 0).attr("y2", 0)
                    .selectAll("stop")
                    .data([
                        {offset: "0%", color: colors.third },
                        {offset: "50%", color: colors.second },
                        {offset: "100%", color: colors.first }
                    ])
                    .enter().append("stop")
                    .attr("offset", function(d) { return d.offset; })
                    .attr("stop-color", function(d) { return d.color; });


                chart.selectAll("*").remove();
                plot.call(chart, {
                    data: d3.entries(scope.selectedCrimesPerDay),
                    axis: {
                        x: xAxis,
                        y: yAxis
                    }
                });
            }

        }


    }

});
