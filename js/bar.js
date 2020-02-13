// var radiusScale = d3.scaleSqrt().range([5, 25]);
var svg = d3.select("#chart-container").append("svg").attr('x', 0).attr('y', 0).attr('viewBox', '0 0 960 550').attr('id', 'bar-chart')
var timeline = svg.append("g").attr("class", "timeline")
var div = d3.select("body").append("div").attr("class", "d3-tooltip").style("opacity", 0);
var margin = {top: 10, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

getData()
function getData() {
  d3.csv("data.csv", function(error, dataForChart) {
      if (error) return console.error(error);

      var yearDate = d3.timeParse('%Y');

      var x = d3.scaleTime().domain(d3.extent(dataForChart.map(function(d) { return yearDate(d['year']); }))).range([0, 930]);
      var xAxis = d3.axisBottom(x).ticks(5)
      timeline.append("g").attr("class", "x axis").attr("transform", "translate(10,530)").call(xAxis);

      makeCircle(dataForChart)
  });
}

function makeCircle(dataForChart) {
  var th2016 = dataForChart.filter(function (d) { return d.year == 2016 });
  var th2017 = dataForChart.filter(function (d) { return d.year == 2017 });
  var th2018 = dataForChart.filter(function (d) { return d.year == 2018 });
  var th2019 = dataForChart.filter(function (d) { return d.year == 2019 });
  
  var x = d3.scaleLinear()
    .domain([0, 12000])
    .range([ 0, width ]);
  var y = d3.scaleLinear()
    .domain([35, 90])
    .range([ height, 0]);
  var z = d3.scaleLinear()
    .domain([200000, 1310000000])
    .range([ 4, 40]);

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
      .attr("r", function (d) { return z(d.estnum); } )
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
          <div><span>Tanggal:</span> ${d.date}</div>
          <div><span>Lokasi:</span> ${d.location}</div>
          <div><span>Korban:</span> ${d.estnum} orang</div>
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
      .attr("r", function (d) { return z(d.estnum); } )
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
          <div><span>Tanggal:</span> ${d.date}</div>
          <div><span>Lokasi:</span> ${d.location}</div>
          <div><span>Korban:</span> ${d.estnum} orang</div>
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
      .attr("r", function (d) { return z(d.estnum); } )
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
          <div><span>Tanggal:</span> ${d.date}</div>
          <div><span>Lokasi:</span> ${d.location}</div>
          <div><span>Korban:</span> ${d.estnum} orang</div>
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
      .attr("r", function (d) { return z(d.estnum); } )
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
          <div><span>Tanggal:</span> ${d.date}</div>
          <div><span>Lokasi:</span> ${d.location}</div>
          <div><span>Korban:</span> ${d.estnum} orang</div>
          `)
          .style("left", (d3.event.pageX - 200) + "px")
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
  console.log(parseDate(date));
  return parseDate(date)
}