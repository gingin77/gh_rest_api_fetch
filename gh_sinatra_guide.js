// var x = d3.scaleLinear()
// var d3Scale = require('d3-scale')

var data = [{
		"language": "Ruby",
		"count": 8
	},
	{
		"language": "JavaScript",
		"count": 12
		},
	{
		"language": "CSS",
		"count": 5
		},
	{
	"language": "HTML",
	"count": 3
}]

// d3.json('static_data/sinat_lang_count.json', function (data) {
//     var data = data
    console.log(data)

    var barWidth = 50
    var width = (barWidth + 12) * data.length
    var height = 380
    console.log(typeof height)

    var x = d3.scaleLinear()
              .domain([0, data.length])
              .range([0, width])

    var y = d3.scaleLinear()
              .domain([0, d3.max(data, function (datum) {
                return datum.count
              })])
              .rangeRound([0, height])

    // add the canvas to the DOM
    var languageBars = d3.select('#lang_freq')
      .append('svg:svg')
      .attr('width', width)
      .attr('height', height * 1.1)

  // set bar heights based on data
  languageBars.selectAll('rect')
      .data(data)
      .enter()
      .append('svg:rect')
      .attr('x', function (datum, index) {
        return x(index)
      })
      .attr('y', function (datum) {
        return height - y(datum.count)
      })
      .attr('height', function (datum) {
        return y(datum.count)
      })
      .attr('width', barWidth)

// console.log(y(datum.count))
  // Add labels on bars
  languageBars.selectAll('text')
      .data(data)
      .enter()
      .append('svg:text')
      .attr('x', function (datum, index) {
        return x(index) + barWidth
      })
      .attr('y', function (datum) {
        return height - y(datum.count)
      })
      .attr('dx', -barWidth / 2)
      .attr('dy', '1.2em')
      .attr('text-anchor', 'middle')
      .text(function (datum) {
        return datum.count
      })

  // Add labels to x-axis
  languageBars.selectAll('text.yAxis')
      .data(data)
      .enter().append('svg:text')
      .attr('x', function (datum, index) {
        return x(index) + barWidth
      })
      .attr('y', height)
      .attr('dx', -barWidth / 2)
      .attr('text-anchor', 'middle')
      .text(function (datum) {
        return datum.language
      })
      .attr('transform', 'translate(0, 18)')
      .attr('class', 'yAxis')
// })
