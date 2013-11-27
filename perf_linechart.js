var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 560 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([0, width]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var color = d3.scale.category10();

var line = d3.svg.line()
    .x(function(d) { return x(d.numPrimes); })
    .y(function(d) { return x(d.seconds); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("prime_times.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) {return key !== "numPrimes"; }));

  var languages = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {numPrimes: +d.numPrimes, time: +d[name]};
      })
    };
  });

  x.domain([1000, 1000000]);
  y.domain([0, 100]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

  var language = svg.selectAll(".language")
    .data(languages)
    .enter().append("g")
    .attr("class", "language");

  language.append("path")
    .attr("class", "line")
    .attr("d", function(d) {return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });

});