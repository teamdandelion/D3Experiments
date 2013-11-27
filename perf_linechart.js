var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.log()
    .domain([0.5E3, 1E7])
    .range([0, width]);

var y = d3.scale.log()
    .domain([200, .01])
    .range([0, height]);

var xAxis = d3.svg.axis()
    .scale(x)
    .ticks(null, "e")
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .ticks(null, "g")
    .orient("left");

var color = d3.scale.category10();

var line = d3.svg.line()
    .x(function(d) { return x(d.numPrimes); })
    .y(function(d) { return y(d.time); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/prime_times.csv", function(error, data) {
  var languageNames = ["C", "Java", "Haskell", "Python"]
  color.domain(languageNames);

  var languages = languageNames.map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {numPrimes: +d.numPrimes, time: +d[name]};
      })
    };
  });

  languages.forEach(function(language) {
    language.values = language.values.filter(function(v) {
      return v.time === v.time && v.time !== 0;
    });
  });

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
