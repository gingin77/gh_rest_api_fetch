let repoPrimryLang = []

// Transform data for d3 to use for column graph
d3.json('static_data/repoPrimLangs_11_27.txt', function (inputdata) {
  repoPrimryLang = inputdata

  let repoPrimLangCountObj = repoPrimryLang.reduce(function (allLangs, lang) {
    allLangs[lang] = allLangs[lang] ? allLangs[lang] + 1 : 1
    return allLangs
  }, {})
  let arrayForD3 = Object.keys(repoPrimLangCountObj).map(function (k) {
    return {language: k, count: repoPrimLangCountObj[k]}
  })
  let sortedArrayForD3 = arrayForD3.slice().sort((a, b) =>
    b.count - a.count
  )
  let d3ArrayMinusNull = sortedArrayForD3.filter(language => language.language !== 'null')

// Use d3 to render vertical column graph
  let data = d3ArrayMinusNull
  let margin = {right: 10, left: 10}
  let barWidth = 50
  let width = (barWidth + 14) * data.length
  let height = 380

  let x = d3.scaleLinear()
    .domain([0, data.length])
    .range([margin.right, width])

  let y = d3.scaleLinear()
    .domain([0, d3.max(data, function (datum) {
      return datum.count
    })])
    .rangeRound([0, height])

// add the canvas to the DOM
  let languageBars = d3.select('#graphicOne')
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

// Add labels to bars
  languageBars.selectAll('text')
    .data(data)
    .enter()
    .append('svg:text')
    .attr('class', 'barLabels')
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
})
