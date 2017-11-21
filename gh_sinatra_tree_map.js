// var languageBytes = <%= language_byte_count %>
// console.log(languageBytes)

d3.json('static_data/langTots_for30.json', function (datafile) {
  console.log(datafile)
  var languageBytes = datafile

  var childrenFunction = function (d) { return d.elements }
  var sizeFunction = function (d) { return d.count }
  var colorFunction = function (d) { return Math.floor(Math.random() * 20) }
  var nameFunction = function (d) { return d.name }

  var color = d3.scaleLinear()
              .domain([0, 10, 15, 20])
              .range(['#060026', '#c9c9c9', '#504494', '#e6e6e7'])

  drawTreemap(400, 400, '#byte_freq', languageBytes, childrenFunction, nameFunction, sizeFunction, colorFunction, color)

  function drawTreemap (height, width, elementSelector, languageBytes, childrenFunction, nameFunction, sizeFunction, colorFunction, colorScale) {
      var treemap = d3.treemap()
          .children(function (d) { return d.elements })
          .size([width, height])
          .value(sizeFunction)

      var div = d3.select(elementSelector)
          .append('div')
          .style('position', 'relative')
          .style('width', width + 'px')
          .style('height', height + 'px')
          .style('color', '#F6F5F6')

      div.data(languageBytes).selectAll('div')
          .data(function (d) {
            return treemap.nodes(d)
          })
          .enter()
          .append('div')
          .attr('class', 'cell')
          .style('margin', '10px')
          .style('padding', '10px')
          .style('background', function (d) {
            return colorScale(colorFunction(d))
          })
          .call(cell)
          .text(nameFunction)
  }

  function cell () {
    this
          .style('left', function (d) { return d.x + 'px' })
          .style('top', function (d) { return d.y + 'px' })
          .style('width', function (d) { return d.dx - 1 + 'px' })
          .style('height', function (d) { return d.dy - 1 + 'px' })
  }
})
