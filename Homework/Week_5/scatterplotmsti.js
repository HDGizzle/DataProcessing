function msti() {
    window.onload = function() {
      let msti = d3.json("msti.json")
      let consconf = d3.json("consconf.json")
      Promise.all([msti, consconf]).then(data => {

        msti_data = data[0]
        consconf_data = data[1]
        console.log(msti_data)
        console.log(consconf_data)

        //width and height
        var margin = 40
        var w = 960
        var h = 500

      var xScale = d3.scaleLinear()
        .domain([d3.min(msti_data, function(d) { return d.time; }), d3.max(msti_data, function(d) { return d.time; })])
        .range([margin, w - margin * 4]);

      var yScale = d3.scaleLinear()
        .domain([d3.min(msti_data, function(d) { return d.datapoint; }), d3.max(msti_data, function(d) { return d.datapoint; })])
        .range([h - margin, margin]);

      var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
      var yAxis = d3.axisLeft().scale(yScale);

      const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')

      //create svg element
      var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

      svg.selectAll("circle")
        .data(msti_data.reverse())
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return xScale(d.time);
        })
        .attr("cy", function(d) {
          return yScale(d.datapoint);
        })
        .attr("r", 5)
        .attr("fill", "red")
        .on('mouseover', (d) => {
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip.html(`Percentage female researchers <span>${d.time}</span>: <span>${d.datapoint}</span>`)
          .style('left', `${d3.event.layerX}px`)
          .style('top', `${(d3.event.layerY - 28)}px`);
        })
        .on('mouseout', () => tooltip.transition().duration(500).style('opacity', 0));


      //x axis
      svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (h - margin) + ")")
        .call(xAxis)

      //y axis
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
        .text("Percentage female researchers");

  }).catch(function(e){
    throw(e);
  });

  console.log('Yes, you can!')
};
}
msti();
