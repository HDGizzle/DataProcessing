// Gijs Beerens - 10804463
// sources:

function consconf() {
  window.onload = function() {
    let msti = d3.json("msti.json")
    let consconf = d3.json("consconf.json")
    Promise.all([msti, consconf]).then(data => {

      consconf_data = data[1]

      // define width height and padding
      var margin = 40
      var w = 960
      var h = 500

      // scale time horizontally
  		var xScale = d3.scaleLinear()
  			.domain([d3.min(consconf_data, function(d) { return d.time; }), d3.max(consconf_data, function(d) { return d.time; })])
  			.range([margin, w - margin * 4]);

      // scale datapoints vertically
  		var yScale = d3.scaleLinear()
  			.domain([d3.min(consconf_data, function(d) { return d.datapoint; }), d3.max(consconf_data, function(d) { return d.datapoint; })])
  			.range([h - margin, margin]);

      // define x and y axis
  		var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
  		var yAxis = d3.axisLeft().scale(yScale);

      // define different colors
      var color = d3.scaleOrdinal(d3.schemeDark2);

      // define tooltip
      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')

  		//create svg element
  		var svg = d3.select("body")
  					.append("svg")
  					.attr("width", w)
  					.attr("height", h);

      // draw dots with according color and tooltip
  		svg.selectAll("circle")
  			.data(consconf_data.reverse())
  			.enter()
  			.append("circle")
  			.attr("cx", function(d) {
  				return xScale(d.time);
  			})
  			.attr("cy", function(d) {
  				return yScale(d.datapoint);
  			})
  			.attr("r", 5)
  			.attr("fill", (function (d) { return color(d.Country);}))
        .on('mouseover', (d) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Consumer confidence <span>${d.Country}</span> <span>${d.time}</span>: <span>${d.datapoint}</span>`)
          .style('left', `${d3.event.layerX}px`)
          .style('top', `${(d3.event.layerY - 28)}px`);
        })
        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));

  		// draw x axis
  		svg.append("g")
        .attr("class", "axis")
  			.attr("transform", "translate(0," + (h - margin) + ")")
  			.call(xAxis)

  		// draw y axis
  		svg.append("g")
        .attr("class", "axis")
  			.attr("transform", "translate(" + margin + ")")
  			.call(yAxis)
        .append("text")
        .attr("fill", "#000")
        .attr("transform", "rotate(-90)")
        .attr("x", - margin)
        .attr("dy", "2em")
        .attr("text-anchor", "end")
        .text("Consumer confidence");

      // format data for making legend
      var legendData = d3.values(consconf_data.map(function (d) { return d.Country; }))
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
        .attr("x", w - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (function (d) { return color(d);}));

      // draw legend text
      legend.append("text")
        .attr("x", w - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d;})
        .style("fill", (function (d) { return color(d);}));

      }).catch(function(e){
        throw(e);
      });
  };
}
consconf();
