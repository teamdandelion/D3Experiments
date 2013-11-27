var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 700 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.log()
    .domain([0.5E3, 3E9])
    .range([0, width]);

var y = d3.scale.log()
    .domain([10000, .01])
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

d3.json("prime_times.json", function(error, data) {
  var languageNames = ["C", "Java", "Haskell", "Python"]
  color.domain(languageNames);

  var numPrimes = data.numPrimes;
  var languages = languageNames.map(function(name) {
    return {
      name: name,
      values: data[name].map(function(time, i) {
        return {numPrimes: +numPrimes[i], time: +time};
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

  var legend = svg.append("g")
    .attr("class", "legend")
    .attr("x", width - 65)
    .attr("y", 25)
    .attr("height", 100)
    .attr("width", 100);

    legend.selectAll('g').data(languages)
    .enter()
    .append('g')
    .each(function(d, i) {
      var g = d3.select(this);
      g.append("rect")
        .attr("x", width - 65)
        .attr("y", i*25)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", color(d.name));

      g.append("text")
        .attr("x", width - 50)
        .attr("y", i * 25 + 8)
        .attr("height",30)
        .attr("width",100)
        .style("fill", color(d.name))
        .text(d.name);

    });

});
