// Name: Gijs Beerens
// Student nr: 10904463
// scatterplot met onclick grouped bar chart
// sources: https://bl.ocks.org/mbostock/3887051
// https://gist.github.com/woodyrew/645d0258415db9205da52cb0e049ca28
// https://www.w3schools.com/w3css/w3css_templates.asp

window.onload = function() {
  let raw_data = d3.json("JSONlinkedviews.json")
  Promise.all([raw_data]).then(data => {

    // define variables: the idea is that you can fill out the section until the height and width and that it automatically
    // generates a scatterplot, however due to later complexities involving the onclick grouped bar chart it got a little difficult
    data = data[0]

    // define data for x and y axis
    var x = function(d) { return d.LifeExpectancy; }
    var y = function(d) { return d.hpi; }

    // scale data for x and y axis
    var xScaler = function(d) { return xScale(d.LifeExpectancy);}
    var yScaler = function(d) {  return yScale(d.hpi);}

    // define colors for scatterplot categories
    var colorcategory = function (d) { return color(d.Region);}

    // define legend categories
    var legendData = d3.values(data.map(function (d) { return d.Region; }))

    // define text for axes and title
    var ytext = "HPI Score"
    var xtext = "Life Expectancy"
    var graphTitle = "Comparison of HPI Score and Life Expectancy"

    // define means for grouped barchart
    var meanLE = d3.mean(data,function(d) { return +d.LifeExpectancy;})
    var meanWellBeing = d3.mean(data,function(d) { return +d.WellBeing * 10;})
    var meanFootprint = d3.mean(data,function(d) { return +d.Footprint * 10;})
    var meanIO = d3.mean(data,function(d) { return +d.InequalityOutcomes;})
    var meanHPI = d3.mean(data,function(d) { return +d.hpi;})

    // define scatterplot width height and margin
    var margin = 40
    var w = 1125
    var h = 500

    // check values for grouped bar chart
    console.log(meanLE, meanWellBeing, meanFootprint, meanIO, meanHPI)

    // define tooltip data and according text
    var tooltipdata = (d) => {
      tooltip.transition().duration(200).style('opacity', 0.9);
      // replace text with desired tooltip text
      tooltip.html(`HPI - LifeExpectancy <span>${d.Country}</span>: <span>${d.hpi}</span> - <span>${d.LifeExpectancy}</span>`)
      .style('left', `${d3.event.layerX}px`)
      .style('top', `${(d3.event.layerY - 28)}px`);
    }

    // function for xScaler
    var xScale = d3.scaleLinear()
      .domain([(d3.min(data, x)) - (d3.max(data, x) / 75), d3.max(data, x) + (d3.max(data, x) / 50)])
      .range([margin, w - margin * 4]);

    // Function for yScaler
    var yScale = d3.scaleLinear()
      .domain([d3.min(data, y) - (d3.max(data, y) / 25), d3.max(data, y) + (d3.max(data, y) / 15)])
      .range([h - margin, margin]);

    // axis scaling
    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft().scale(yScale);

    // define different colors for legend and dots categ
    var color = d3.scaleOrdinal(d3.schemeDark2);

    // define scatterplot tooltip
    const tooltip = d3.select('plot').append('div')
      .attr('class', 'tooltip')

    // create scatterplot svg
    var svg = d3.select("plot")
          .append("svg")
          .attr("width", w)
          .attr("height", h);

    // draw dots with according color and tooltip
    svg.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", xScaler)
      .attr("cy", yScaler)
      .attr("r", 5)
      .attr("fill", (colorcategory))
      .on('mouseover', tooltipdata)
      .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0))
      .on("click", barchart)

    // draw x axis title
		svg.append('text')
      .style("font", "12px Sans-serif")
      .attr('x', w - margin * 4)
			.attr('y', h - margin * 1.2)
			.attr('text-anchor', 'end')
			.attr('class', 'label')
			.text(xtext);

    // draw graph title
    svg.append('text')
      .style("font", "23px Sans-serif")
      .attr('x', w / 2 - (margin * 2.25))
      .attr('y', margin)
      .attr('class', 'label')
      .text(graphTitle)
      .style("text-anchor", "middle");

    // draw x axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - margin) + ")")
      .call(xAxis)
      .style("font", "15px Sans-serif")

    // draw y axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + margin + ")")
      .call(yAxis)
      .style("font", "15px Sans-serif")
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("x", - margin)
      .attr("dy", "2em")
      .attr("text-anchor", "end")
      .text(ytext);

    // define legend categories
    var unique = legendData.filter(function (elem, pos) {
      return legendData.indexOf(elem) == pos; })

    // define legend
    var legend = svg.selectAll(".legend")
      .data(unique.slice().reverse())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend color rectangles
    legend.append("rect")
      .attr("x", w - margin * 4.5)
      .attr("y", margin)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (function (d) { return color(d);}));

    // draw legend text
    legend.append("text")
      .attr("x", w - margin * 4.6)
      .attr("y", margin + 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d;})
      .style("font", "11px Sans-serif")
      .style("fill", (function (d) { return color(d);}));

    }).catch(function(e){
      throw(e);
    });
};


// define barchart function
var barchart =  function (d, meanLE, meanWellBeing, meanFootprint, meanIO, meanHPI) {

  // define width height and margins for grouped bar chart
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // scale x and y variables
  var x0 = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var x1 = d3.scaleBand().padding(0.1);
  var y = d3.scaleLinear().rangeRound([height - margin.top, margin.left]);

  // define bar keys
  var keys = ["Real_Value", "Mean"]

  // define colors for bars
  var color = d3.scaleOrdinal().range(["#98abc5", "#ff8c00"]);

  // define data: I hardcoded the means because i was not able to get the means defined atop the scatterplot into the barchart function
  var data = [{txt : "Life Expectancy (Age)", Real_Value : d.LifeExpectancy, Mean : 70.9},
  {txt : "Well-Being (0 - 100)", Real_Value : d.WellBeing * 10, Mean : 54},
  {txt : "Ecological Footprint (1000m2)", Real_Value : d.Footprint * 10, Mean : 32.6},
  {txt : "Inequality Outcomes (%)", Real_Value : Number(d.InequalityOutcomes), Mean : 23.3},
  {txt : "Happy Planet Index", Real_Value : d.hpi, Mean : 26.4}];

  // define tooltip for barchart
  const div = d3.select('plot').append('div').attr('class', 'tooltip2').style('opacity', 0);

  // define barchart svg
  var svg = d3.select("plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // define x and y domains
  x0.domain(data.map(function(d) { return d.txt; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; })})])

    // draw bars + tooltips
  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d) { return "translate(" + x0(d.txt) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
    .attr("x", function(d) { return x1(d.key); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x1.bandwidth())
    .attr("height", function(d) { return height - margin.top - y(d.value); })
    .attr("fill", function(d) { return color(d.key); })
    .on('mouseover', d => { div
        .transition()
        .duration(200)
        .style('opacity', 0.9);
      div
        .html(d.value)
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY - 28 + 'px');
    })
    .on('mouseout', () => { div
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

    // draw x axis
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (height - margin.top) + ")")
      .call(d3.axisBottom(x0));

    // draw y axis
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("x", - margin.left * 2)
      .attr("dy", "1.5em")
      .attr("text-anchor", "start")
      .text("Value");

    // draw chart title
    svg.append('text')
      .style("font", "20px Sans-serif")
      .attr('x', width / 2 )
      .attr('y', margin.top * 1.5)
      .attr('class', 'label')
      .text(d.Country)
      .style("text-anchor", "middle");

    // define barchart legend
    var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 14)
      .attr("text-anchor", "end")
      .selectAll(".legend")
      .data(keys.slice().reverse())
      .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // draw legend squares
    legend.append("rect")
      .attr("x", width - margin.right)
      .attr("y", margin.top * 3)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color);

    // draw legend text
    legend.append("text")
      .attr("x", width - margin.right * 1.2)
      .attr("y",  margin.top * 3.4)
      .attr("dy", "0.32em")
      .text(function(d) { return d; })
      .attr("fill", color);
}

// Change style of navbar on scroll
window.onscroll = function() {myFunction()};
function myFunction() {
    var navbar = document.getElementById("myNavbar");
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        navbar.className = "w3-bar" + " w3-card" + " w3-animate-top" + " w3-white";
    }
    else {
        navbar.className = navbar.className.replace(" w3-card w3-animate-top w3-white", "");
    }
}

// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    var x = document.getElementById("navDemo");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    }
    else {
        x.className = x.className.replace(" w3-show", "");
    }
}
