d3.json('static_data/compObj_46_repos.json', function (data) {
  function strToDtSingle (d) {
    return new Date(d)
  }
  let w = strToDtSingle("2017-07-10T01:26:21Z")
  console.log(w)
  console.log(typeof w)

  let dataDate = strToDtSingle(data[0].pushed_at)
  console.log(dataDate)
  console.log(typeof dataDate)
  // var formatTime = d3.timeFormat("%d-%b-%y")

  data.forEach(function (d) {
    // d.date = formatTime(strToDtSingle(d.pushed_at))
    d.name = d.repo_name
    // d.number = Object.values(d.all_lang_bytes_for_repo)
  })
  console.log(data[0].pushed_at)

  let scdX = data.map((item) => item.pushed_at)
    .reduce(function (a, b) {
      return a.concat(b)
    }, []
  )
  console.log(scdX)

  let sortScdX = scdX.sort(function (a, b) {
    return Date.parse(a) > Date.parse(b)
  })
  console.log(sortScdX)

  let prsdDts = strToDt(sortScdX)

  function strToDt (arrOfDtStrs) {
    let cnsTructedDts = []
    for (let d = 0; d < arrOfDtStrs.length; d++) {
      let date = new Date(arrOfDtStrs[d])
      cnsTructedDts.push(date)
    }
    let parsedDates = []
    for (let p = 0; p < cnsTructedDts.length; p++) {
      let date = cnsTructedDts[p]
      let yr = date.getUTCFullYear()
      let day = date.getUTCDate()
      let month = date.getUTCMonth()
      let desiredFormat = yr + '-' + month + '-' + day
      parsedDates.push(desiredFormat)
    }
    return parsedDates
  }

  let dateMin = strToDtSingle(prsdDts[0])
  console.log(prsdDts[0])
  console.log(dateMin)
  let dateMax = strToDtSingle(prsdDts[prsdDts.length - 1])
  console.log(prsdDts[prsdDts.length - 1])
  console.log(dateMax)

  let firstLangByteNum = getFirsLangCount(data)
  function getFirsLangCount (data) {
    let newArr = []
    for (let i = 0; i < data.length; i++) {
      let countsForFirstLang = Object.values(data[i].all_lang_bytes_for_repo)
      countsForFirstLang = countsForFirstLang.reduce((acc, cur) => acc + cur, 0)
      newArr.push(countsForFirstLang)
    }
    newArr.reduce(function (a, b) {
      return a.concat(b)
    }, []
    )
    return newArr
  }

  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom

  var x = d3.scaleTime()
    .domain([dateMin, dateMax])
    .range([0, width])
    // .domain(d3.extent(data, function(d) { return d.date; }));

  var y = d3.scaleLinear()
    .domain([0, 200000])
    .range([0, height])
    // .domain([0, d3.max(data, function(d) { return d.close; })]);

  // Adds the svg canvas
  var svg = d3.select('body')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)

  var g = svg.selectAll('g')
    .append('g')
    .attr('transform',
        'translate(' + margin.left + ',' + margin.top + ')')

  // Add the x Axis
  svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x))

  // draw dots
  svg.selectAll('dot')
      .data(data)
    .enter().append('circle')
      .attr('r', 3.5)
      .attr('cx', function (d) { return strToDtSingle(d) })
      // .attr('cy', function (d) { return y(d.name) })

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
