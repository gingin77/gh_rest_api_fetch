d3.json('static_data/compObj_46_repos.json', function (data) {
  function strToDtSingle (d) {
    return new Date(d)
  }

  let myData = data
  transformLangObj(myData)

  function transformLangObj (myData) {
    myData.map(function (obj) {
      let lObj = obj.all_lang_bytes_for_repo
      let nArr = []
      Object.keys(lObj).forEach(key => {
        let nKVP = {
          language: key,
          count: lObj[key]
        }
        nArr.push(nKVP)
      })
      obj.all_lang_bytes_for_repo = nArr
    })
  }

  let langBytesFirst = makeBytesFirst(myData)
  function makeBytesFirst (myData) {
    let newDataObjsArr = []
    myData.map(function (repObj) {
      let bytObj = repObj.all_lang_bytes_for_repo
      let newDataObj = {}
      bytObj.map(function (langByteObj) {
        newDataObj = {
          'language': langByteObj.language,
          'count': langByteObj.count,
          'repo_name': repObj.repo_name,
          'pushed_at': repObj.pushed_at,
          'primary_repo_lang': repObj.primary_repo_lang,
          'url_for_all_repo_langs': repObj.url_for_all_repo_langs
        }
        newDataObjsArr.push(newDataObj)
      })
    })
    return newDataObjsArr
  }

  langBytesFirst.forEach(function (d) {
    d.language = d.language
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

    // setup x
    var xScale = d3.scaleTime().domain([dateMin, dateMax]).range([0, width]), // value -> display
      xValue = function (d) { return xScale(strToDtSingle(d.pushed_at)) } // data -> value

    // xMap = function(d) { return xScale(xValue(d)) }, // data -> display
    // xAxis = d3.svg.axis().scale(xScale).orient("bottom")

  // // setup y
  // var yValue = function(d) { return d["Protein (g)"];}, // data -> value
  //     yScale = d3.scale.linear().range([height, 0]), // value -> display
  //     yMap = function(d) { return yScale(yValue(d));}, // data -> display
  //     yAxis = d3.svg.axis().scale(yScale).orient("left");

  let y = d3.scaleLinear()
    .domain([0, 170000])
    .range([height, 0])

  // setup fill color
  let cValue = function (d) { return d.language },
      color = d3.scaleOrdinal()
      .range(['blue', 'red', 'purple', 'green', 'Orange'])
      .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript'])

  // Adds the svg canvas
  var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  var g = svg.selectAll('g')
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')

  // add the tooltip area to the webpage
  var tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

  // draw dots
  svg.selectAll('dot')
      .data(langBytesFirst)
    .enter().append('circle')
      .attr('r', 3.5)
      .attr('cx', xValue)
      .attr('cy', function (d) { return y(d.count) })
      .style("fill", function(d) { return color(cValue(d)) })
      .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 1)
          tooltip.html(d.language + "<br/>" + d.repo_name)
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px")
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0)
      });

  // Add the x Axis
  svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(xScale))
    .append('text')
      .text('Date')

  // Add the y Axis
  svg.append('g')
    .attr('class', 'y axis')
      .call(d3.axisLeft(y))

  // text label for the y axis
  svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Bytes')
})
