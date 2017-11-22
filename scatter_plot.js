d3.json('static_data/four_obj_test.json', function (data) {
  function strToDtSingle (d) {
    return new Date(d)
  }

  data.forEach(function (d) {
    d.name = d.repo_name
    d.numbers = d3.values(d.all_lang_bytes_for_repo)
    // console.log(d.numbers)
  })

  let pushedAtDates = data.map((item) => item.pushed_at)
    .reduce((a, b) => a.concat(b), []),
    srtdPshDtArray = pushedAtDates.map((item) => new Date(item))
    .sort((a, b) => Date.parse(a) > Date.parse(b))

  let dateMin = srtdPshDtArray[0],
    dateMax = srtdPshDtArray[srtdPshDtArray.length - 1]



  let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom

  let x = d3.scaleTime()
    .domain([dateMin, dateMax])
    .range([0, width])
    console.log(dateMin)
    console.log(x(dateMin))
    console.log(dateMax)
    console.log(x(dateMax))

  let y = d3.scaleLinear()
    .domain([0, 20000])
    .range([height, 0])
    console.log(y(1000))

  // Adds the svg canvas
  var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  var g = svg.selectAll('g')
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')

  // draw dots
  svg.selectAll('dot')
      .data(data)
    .enter().append('circle')
      .attr('r', 3.5)
      .attr('cx', function (d) { return x(strToDtSingle(d.pushed_at)) })
      .attr('cy', function (d) { return y(d.numbers) })

  // Add the x Axis
  svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

  // text label for the x axis
  svg.append('text')
      .attr('transform',
            'translate(' + (width / 2) + ' ,' +
                           (height + margin.top + 20) + ')')
      .style('text-anchor', 'middle')
      .text('Date')

  // Add the y Axis
  svg.append('g')
      .call(d3.axisLeft(y))

  // text label for the y axis
  svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Value')
})
