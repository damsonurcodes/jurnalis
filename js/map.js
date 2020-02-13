var radiusScale = d3.scaleSqrt().range([5, 25]);
var svg = d3.select("#geo-map-container").append("svg").attr('x', 0).attr('y', 0).attr('viewBox', '0 0 960 550').attr('id', 'geo-map')
var bg = svg.append('rect').attr('width', '100%').attr('height', '500').attr('fill', '#3b3b3b')
var g_world_clip = svg.append('clipPath').attr('id', 'seizure-map-clip')
    g_world_clip.append('rect').attr('width', '100%').attr('height', '500')
var g_world = svg.append("g").attr('clip-path', 'url(#seizure-map-clip)').attr("class", "countries")
var projection = d3.geoMercator().scale(1000).translate([-1550, 180]);
var g_bubbles = svg.append("g").attr('clip-path', 'url(#seizure-map-clip)').attr("class", "seizure-bubbles")
var zoom = d3.zoom().scaleExtent([1, 8]).on('zoom', zoomed);

function zoomed() {
  t = d3.event.transform;
  g_world.attr(
     "transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")"
  );
  g_bubbles.attr(
    "transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")"
 );
}

svg.call(zoom)

var path = d3.geoPath().projection(projection);
var count_bg = svg.append('rect').attr("transform", "translate(" + 640 + "," + 95 + ")").attr('height', '5em').attr('width', '4em').attr('fill', 'red')
var count_text =  svg.append("text").attr("transform", "translate(" + 660 + "," + 100 + ")").attr("class", "seizure-total").text("0");
var title = svg.append("text").attr("class", "vis-title").attr("transform", "translate(" + 650 + "," + 140 + ")").text('jurnalis')
var range = title.append('tspan').attr('x', 0).attr('dy', '1.3em').text("(select a time range)");

var timeline = svg.append("g").attr("class", "timeline")
var bursh_g = timeline.append("g").attr("class", "brush")

// tooltips
var bartip = d3.select('.container').append('div').attr('class', 'bartip').style('display', 'none');
var div = d3.select("body").append("div").attr("class", "d3-tooltip").style("opacity", 0);

d3.json("countries.json",
  function(json) {
    countries = g_world
   .selectAll("path")
   .data(json.features)
   .enter().append("path")
   .attr("d", path)
   .style("fill", '#9C5E18')
   .attr("stroke", "#3B3B3B")
   .attr("stroke-width", 1)
   .style("opacity", 0.5)
  }
)
getData()
// Calls updateMapPoints() and makeLegend()
function getData(seizures) {
  d3.csv("data.csv", function(error, dataForMap) {
    if (error) return console.error(error);

    var parseDate = d3.timeParse('%Y-%m-%d %H:%M:%S');

    var dataForTimeline = [],
        dateCount = {};

    dataForMap.forEach(function(d, idx) {
      
      d.TIME = parseDate(d['date']);
      d.YEAR = d.TIME.getFullYear();
      d.ESTNUM = +d['estnum'];
      d.Latitude = +d['latitude'];
      d.Longitude = +d['longitude'];

      if (!dateCount[d.TIME]) {
          dateCount[d.TIME] = d.ESTNUM
      } else {
          dateCount[d.TIME] += d.ESTNUM;
      }
      return d
    });

    Object.keys(dateCount).forEach(function(time) {
      dataForTimeline.push({ TIME: new Date(time), ESTNUM: dateCount[time] });
    });
    dataForTimeline.sort(function(a,b) { return a.TIME - b.TIME; });

    radiusScale.domain(d3.extent(dataForMap, function(d) { return +d.ESTNUM; }));

    makeTimeline(dataForMap, dataForTimeline);
});
};

// Creates the event timeline and sets up callbacks for brush changes
function makeTimeline(dataForMap, dataForTimeline) {
  var margin = { top: 10, right: 10, bottom: 20, left: 15 },
      w = 960 - margin.left - margin.right,
      h = 40 - margin.bottom //margin-top is gap by timeline group translate

  timeline
      .attr("transform", "translate("+ margin.left + " , 510)");

  var x = d3.scaleTime()
      .domain(d3.extent(dataForTimeline.map(function(d) { console.log(d.TIME); return d.TIME; })))
      .range([0, w]);

  var xAxis = d3.axisBottom(x)
    .ticks(5)

  timeline.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + h + ")")
      .call(xAxis);

  //brush reference: http://rajvansia.com/scatterplotbrush-d3-v4.html
  var brush = d3.brushX()
      .extent([[0, 0], [w, h]]) // brushable area
      .on("brush end", function() { brushCallback(dataForMap, x); })
  var initial_range = [new Date(2019, 0, 1), x.domain()[1]].map(x)

  bursh_g
      .call(brush)
    	 .call(brush.move, initial_range)

  var ticks = timeline.selectAll('.axis .tick')
  ticks.on('click', function(d){
    var year = +d3.select(this).select('text').text()
    var valid = (!isNaN(year)) && year > 2015 && year < 2020
    if (valid) {
      if (year == 2019){
        bursh_g.call(brush.move, [new Date(2019, 0, 1), x.domain()[1]].map(x))
      } else{
        bursh_g.call(brush.move, [new Date(year, 0, 1), new Date(year+1, 0, 1)].map(x))
      }
    }
  })

};

// Called whenever the timeline brush range (extent) is updated
// Filters the map data to those points that fall within the selected timeline range
function brushCallback(dataForMap, x) {
	if (!d3.event.selection){
  	updateTitleText(null, []);
  	updateMapPoints([])
  	return
	}
  var newDateRange = d3.event.selection.map(x.invert) || x.domain()
  var filteredData = dataForMap.filter(d => (d.TIME >= newDateRange[0] && d.TIME <= newDateRange[1]) )
  updateMapPoints(filteredData)
  updateTitleText(newDateRange, filteredData);
}

// Updates the vis title text to include the passed date array: [start Date, end Date]
function updateTitleText(newDateArray, filteredData) {
  if (!newDateArray) {
      range.text("(select a time range)");
  } else {
      var from = formatDatetime(newDateArray[0]),
          to =   formatDatetime(newDateArray[1])

      range.text(from + " - " + to);
  }
  //update count
  var total = filteredData.map(d=>+d.ESTNUM).reduce((acc, cur)=>acc+cur, 0)
  count_text.text(`${d3.format(',')(Math.round(total))}`)
  count_bg
    .attr('x', count_text.node().getBBox().x)
    .attr('y', count_text.node().getBBox().y)
    .attr('width', +title.node().getBBox().width + 20)
}

function updateMapPoints(data){
var circles = g_bubbles.selectAll("circle.seizure-bubble").data(data, function(d) { return d.id });

circles // update existing points
    .attr("fill", "rgba(201, 62, 62, 0.5)")
    .attr("cx", function(d) { return projection([+d.Longitude, +d.Latitude])[0]; })
    .attr("cy", function(d) { return projection([+d.Longitude, +d.Latitude])[1]; })
    .attr("r",  function(d) { return radiusScale(+d.ESTNUM); })

circles.enter().append("circle")
    .attr('class', 'seizure-bubble')
    .attr('id', function(d) { return d.id; })
    .attr("fill", "rgba(201, 62, 62, 0.5)")
    .attr("cx", function(d) { return projection([+d.Longitude, +d.Latitude])[0]; })
    .attr("cy", function(d) { return projection([+d.Longitude, +d.Latitude])[1]; })
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
        <div><span>Tanggal:</span> ${formatDatetime(d.TIME)}</div>
        <div><span>Lokasi:</span> ${d.location}</div>
        <div><span>Korban:</span> ${d.ESTNUM} orang</div>
        `)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      d3.select(this)
        .attr('stroke-width', 0)
      .transition()
        .style('fill', 'rgba(201, 62, 62, 0.5)')
      div.transition()
        .duration(500)
        .style("opacity", 0);
    })
    .attr("r",  0)
  .transition()
    .duration(500)
    .attr("r",  function(d) { return radiusScale(+d.ESTNUM); })

circles.exit() // exiting points
    .attr("r",  function(d) { return radiusScale(+d.ESTNUM); })
  .transition()
    .duration(500)
    .attr("r", 0).remove();
}

// Updates the points displayed on the map, to those in the passed data array
function updateMapPointsAutoPlay(data, year) {
  var circles = g_bubbles.selectAll("circle.seizure-bubble").data(data, function(d) { return d.id });

  if (year == "2000") { //reset
    svg.selectAll("circle.seizure-bubble").remove()
  }

  circles.enter().append("circle") // new entering points
      .attr('class', 'seizure-bubble')
      .attr("fill", "rgba(240, 135, 24, 0.3)")
      .attr("cx", function(d) { return projection([+d.Longitude, +d.Latitude])[0]; })
      .attr("cy", function(d) { return projection([+d.Longitude, +d.Latitude])[1]; })
      .attr("r",  0)
    .transition()
      .duration(500)
      .attr("r",  function(d) { return radiusScale(+d.ESTNUM); });

  circles.exit() // exiting points
    .transition()
      .duration(500)
      .attr("fill", "rgba(201, 62, 62, 0.3)")
};

function formatDatetime(date){
return d3.timeFormat("%d %b %Y")(date)
// return date.getFullYear() + "-" +(date.getMonth() + 1)+ "-" +date.getDate()
}