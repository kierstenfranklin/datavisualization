angular.module('dataVisualization')
.directive('graphDirective', function(){
    return {
        replace: false,
        scope: {
            crimes: "=",
            selectedCrimesPerDay: "="
        },
        template : '<div></div>',
        link: function(scope, element, attrs){
            var w = 900;
            var h = 600;
            var margin = {
                top: 58,
                bottom: 100,
                left: 80,
                right: 40
            };
            var width = w - margin.left - margin.right;
            var height = h - margin.top - margin.bottom;

            var svg = d3.select("#graph1").append("svg")
            .attr("id", "chart")
            //.attr("ng-controller", "dataController")
            .attr("width", w)
            .attr("height", h);
            var chart = svg.append("g")
            .classed("display", true)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            var dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S");
            /*var crimesPerDay = [];
            for(var i = 0; i< scope.crimes.length; i++){
                if(crimesPerDay[scope.crimes[i][8]]){
                    crimesPerDay[scope.crimes[i][8]]++;
                }else{
                    crimesPerDay[scope.crimes[i][8]] = 0;
                    crimesPerDay[scope.crimes[i][8]]++;
                }
            }
            var burglaryPerDay = [];
            for(var i = 0; i< scope.crimes.length; i++){
                if(burglaryPerDay[scope.crimes[i][8]] && scope.crimes[i][12] === "BURGLARY"){
                    burglaryPerDay[scope.crimes[i][8]]++;
                }else if (scope.crimes[i][12] === "BURGLARY"){
                    burglaryPerDay[scope.crimes[i][8]] = 0;
                    burglaryPerDay[scope.crimes[i][8]]++;
                }
            }*/
            //console.log(burglaryPerDay);
            var x = d3.scaleTime()
            .domain(d3.extent(scope.crimes, function(d,i){
                var date = dateParser(scope.crimes[i][8]);
                return date;
            }))
            .range([0, width]);
            var y = d3.scaleLinear()
            .domain([0, d3.max(d3.entries(scope.selectedCrimesPerDay), function(d){
                return d.value;;
            })])
            .range([height, 0]);

            console.log(d3.max(d3.entries(scope.selectedCrimesPerDay), function(d){
                return d.value;
            }));
            var xAxis = d3.axisBottom()
                .scale(x)
                .ticks(12);
            var yAxis = d3.axisLeft()
                .scale(y)
                .ticks(6);

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
            }

            plot.call(chart, {
                data: d3.entries(scope.selectedCrimesPerDay),
                axis: {
                    x: xAxis,
                    y: yAxis
                }
            });
            scope.$watch("selectedCrimesPerDay",function(newValue,oldValue) {
                y = d3.scaleLinear()
                .domain([0, d3.max(d3.entries(scope.selectedCrimesPerDay), function(d){
                    return d.value;;
                })])
                .range([height, 0]);
                yAxis = d3.axisLeft()
                    .scale(y)
                    .ticks(6);
                    chart.selectAll('*').remove();
                plot.call(chart, {
                    data: d3.entries(scope.selectedCrimesPerDay),
                    axis: {
                        x: xAxis,
                        y: yAxis
                    }
                });
            });

        }

    }

});
