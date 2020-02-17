// var radiusScale = d3.scaleSqrt().range([5, 25]);
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;
    
  var svg = d3.select("#chart-container").append("svg").attr('x', 0).attr('y', 0).attr('viewBox', '0 0 960 960').attr('id', 'bar-chart')
  var timeline = svg.append("g").attr("class", "timeline").attr("transform","translate(0,385)")
  var div = d3.select(".chart").append("div").attr("class", "d3-tooltip").style("opacity", 0);
  var txt2016 = svg.append("text").attr("class", "victim 16").attr("transform", "translate(105,110)").text('83').attr('fill','rgb(102, 194, 165)')
  var txt2017 = svg.append("text").attr("class", "victim 17").attr("transform", "translate(365,300)").text('63').attr('fill','rgb(252, 141, 98)')
  var txt2018 = svg.append("text").attr("class", "victim 18").attr("transform", "translate(630,225)").text('71').attr('fill','rgb(141, 160, 203)')
  var txt2019 = svg.append("text").attr("class", "victim 19").attr("transform", "translate(866,160)").text('77').attr('fill','rgb(231, 138, 195)')
getData()
function getData() {
  d3.csv("data.csv", function(error, dataForChart) {
      if (error) return console.error(error);

      var yearDate = d3.timeParse('%Y');

      var x = d3.scaleTime().domain(d3.extent(dataForChart.map(function(d) { return yearDate(d['year']); }))).range([0, 800]);
      var xAxis = d3.axisBottom(x).ticks(5)
      timeline.append("g").attr("class", "x axis").attr("transform", "translate(115,530)").style("fill", "none").style("stroke", '#FFF').call(xAxis);

      makeCircle(dataForChart)
  });
  var ln = svg.append("line").attr("class", "x-axis-y").attr("transform","translate(0,400)").attr('x1', 40).attr('y1', 515).attr('x2', 960).attr('y2', 515).style("fill", "none").style("stroke", '#FFF').style("stroke-width", 5)
  var ln2016 = svg.append("line").attr("class", "2016").attr("transform","translate(0,400)").attr('x1', 0).attr('y1', -270).attr('x2', 960).attr('y2', -270).style("fill", "none").style("stroke", 'rgb(102, 194, 165)').style("stroke-width", 2).style("stroke-dasharray", ("3, 3"))
  var ln2017 = svg.append("line").attr("class", "2017").attr("transform","translate(0,400)").attr('x1', 0).attr('y1', -85).attr('x2', 960).attr('y2', -85).style("fill", "none").style("stroke", 'rgb(252, 141, 98)').style("stroke-width", 2).style("stroke-dasharray", ("3, 3"))
  var ln2018 = svg.append("line").attr("class", "2018").attr("transform","translate(0,400)").attr('x1', 0).attr('y1', -160).attr('x2', 960).attr('y2', -160).style("fill", "none").style("stroke", 'rgb(141, 160, 203)').style("stroke-width", 2).style("stroke-dasharray", ("3, 3"))
  var ln2019 = svg.append("line").attr("class", "2019").attr("transform","translate(0,400)").attr('x1', 0).attr('y1', -234).attr('x2', 960).attr('y2', -234).style("fill", "none").style("stroke", 'rgb(231, 138, 195)').style("stroke-width", 2).style("stroke-dasharray", ("3, 3"))

}

function makeCircle(dataForChart) {
  var th2016 = dataForChart.filter(function (d) { return d.year == 2016 });
  var th2017 = dataForChart.filter(function (d) { return d.year == 2017 });
  var th2018 = dataForChart.filter(function (d) { return d.year == 2018 });
  var th2019 = dataForChart.filter(function (d) { return d.year == 2019 });
  var scaleY = d3.scaleLinear()
                  .domain([0, 95])
                  .range([915, 0]);

  var diameter = 18;
  
  var x = d3.scaleLinear()
    .domain([0, 12000])
    .range([ 0, width ]);
  var y = d3.scaleLinear()
    .domain([35, 90])
    .range([ height, 0]);
  var z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([ 4, 40]);
  var y_axis = d3.axisLeft()
    .scale(scaleY);
  svg.append("g")
    .attr("transform", "translate(40, 0)")
    .style("fill", "#fff").style("stroke", '#FFF')
    .call(y_axis);
  var myColor = d3.scaleOrdinal()
    .domain(["2016", "2017", "2018", "2019"])
    .range(d3.schemeSet2);

  svg.append('g')
    .selectAll("dot")
    .data(th2016)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("id", function (d) { return d.id; } )
      .attr("cx", function (d) { return x(d.cx); } )
      .attr("cy", function (d) { return y(d.cy); } )
      .attr("r", diameter)
      .style("fill", function (d) { return myColor(d.year); } )
      .on("mouseover", function(d) {
        d3.select(this)
          .attr('stroke-width', 0.3)
          .attr('stroke', '#fff')
        .transition()
          .style('fill', 'rgb(201, 62, 62, 1)')
        div.transition()
          .duration(200)
          .style("opacity", 1);
        div.html(`
          <div class="nama">${d.korban}</div>
          <div><span>Media : </span>${d.platform}</div>
          <div><span>Lokasi : </span>${d.location}</div>
          <div><span>Jenis Kekerasan : </span>${d.tindakan}</div>
          `)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr('stroke-width', 0)
        .transition()
        .style("fill", function (d) { return myColor(d.year); } )
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(500)
  
  svg.append('g')
    .selectAll("dot")
    .data(th2017)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("id", function (d) { return d.id; } )
      .attr("cx", function (d) { return x(d.cx); } )
      .attr("cy", function (d) { return y(d.cy); } )
      .attr("r", diameter)
      .style("fill", function (d) { return myColor(d.year); } )
      .on("mouseover", function(d) {
        d3.select(this)
          .attr('stroke-width', 0.3)
          .attr('stroke', '#fff')
        .transition()
          .style('fill', 'rgb(201, 62, 62, 1)')
        div.transition()
          .duration(200)
          .style("opacity", 1);
        div.html(`
        <div class="nama">${d.korban}</div>
        <div><span>Media : </span>${d.platform}</div>
        <div><span>Lokasi : </span>${d.location}</div>
        <div><span>Jenis Kekerasan : </span>${d.tindakan}</div>
          `)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr('stroke-width', 0)
        .transition()
        .style("fill", function (d) { return myColor(d.year); } )
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(500)

  svg.append('g')
    .selectAll("dot")
    .data(th2018)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("id", function (d) { return d.id; } )
      .attr("cx", function (d) { return x(d.cx); } )
      .attr("cy", function (d) { return y(d.cy); } )
      .attr("r", diameter )
      .style("fill", function (d) { return myColor(d.year); } )
      .on("mouseover", function(d) {
        d3.select(this)
          .attr('stroke-width', 0.3)
          .attr('stroke', '#fff')
        .transition()
          .style('fill', 'rgb(201, 62, 62, 1)')
        div.transition()
          .duration(200)
          .style("opacity", 1);
        div.html(`
        <div class="nama">${d.korban}</div>
        <div><span>Media : </span>${d.platform}</div>
        <div><span>Lokasi : </span>${d.location}</div>
        <div><span>Jenis Kekerasan : </span>${d.tindakan}</div>
          `)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr('stroke-width', 0)
        .transition()
        .style("fill", function (d) { return myColor(d.year); } )
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(500)
  
  svg.append('g')
    .selectAll("dot")
    .data(th2019)
    .enter()
    .append("circle")
      .attr("class", "bubbles")
      .attr("id", function (d) { return d.id; } )
      .attr("cx", function (d) { return x(d.cx); } )
      .attr("cy", function (d) { return y(d.cy); } )
      .attr("r", diameter)
      .style("fill", function (d) { return myColor(d.year); } )
      .on("mouseover", function(d) {
        d3.select(this)
          .attr('stroke-width', 0.3)
          .attr('stroke', '#fff')
        .transition()
          .style('fill', 'rgb(201, 62, 62, 1)')
        div.transition()
          .duration(200)
          .style("opacity", 1);
        div.html(`
        <div class="nama">${d.korban}</div>
        <div><span>Media : </span>${d.platform}</div>
        <div><span>Lokasi : </span>${d.location}</div>
        <div><span>Jenis Kekerasan : </span>${d.tindakan}</div>
          `)
          .style("left", (d3.event.pageX + 20) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
      .on("mouseout", function(d) {
        d3.select(this)
          .attr('stroke-width', 0)
        .transition()
        .style("fill", function (d) { return myColor(d.year); } )
        div.transition()
          .duration(500)
          .style("opacity", 0);
      })
      .transition()
      .duration(500)
}

function formatDatetime(date){
  var parseDate = d3.timeParse('%Y-%m-%d');
  return parseDate(date)
}