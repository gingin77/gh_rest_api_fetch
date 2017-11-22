d3.json('static_data/compObj_46_repos.json', function (data) {
  function strToDtSingle (d) {
    return new Date(d)
  }

  //Create a date parser
  var formatTime = d3.timeFormat('%d-%b-%y')

  // var formatTime = d3.timeFormat("%B %d, %Y");
  console.log(formatTime(strToDtSingle(data[0].pushed_at)))
  console.log(formatTime(data[0].pushed_at))


  // var ParseDate = d3.timeFormat("%d-%b-%y").parse
  //
  // var strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");



  data.forEach(function (d) {
    d.date = strToDtSingle(d.pushed_at)
    console.log(d.date)
    d.name = d.repo_name
    // d.number = Object.values(d.all_lang_bytes_for_repo)
  })

  let justPushDates = data.map((item) => item.pushed_at)
    .reduce(function (a, b) {
      return a.concat(b)
    }, []
  )

  let srtdPshDtArray = justPushDates.map((item) => new Date(item))
    .sort(function (a, b) {
      return Date.parse(a) > Date.parse(b)
    })

  let dateMin = srtdPshDtArray[0]
  let dateMax = srtdPshDtArray[srtdPshDtArray.length - 1]


  let margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 700 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom

  let x = d3.scaleTime()
    .domain([dateMin, dateMax])
    .range([0, width])
    console.log(x(dateMin) * 2)
    console.log(x(dateMax) / 2)
    console.log(x.invert(600))
    console.log(x.ticks(10))


  let y = d3.scaleLinear()
    .domain([0, 20000])
    .range([height, 0])
    // .domain([0, d3.max(data, function(d) { return d.close; })]);


  // let sortjustPushDates = justPushDates.sort(function (a, b) {
  //   return Date.parse(a) > Date.parse(b)
  // })
  // console.log(typeof sortjustPushDates[0])

  // let prsdDts = strToDt(sortjustPushDates)
  //
  // function strToDt (arrOfDtStrs) {
  //   let cnsTructedDts = []
  //   for (let d = 0; d < arrOfDtStrs.length; d++) {
  //     let date = new Date(arrOfDtStrs[d])
  //     cnsTructedDts.push(date)
  //   }
  //   let parsedDates = []
  //   for (let p = 0; p < cnsTructedDts.length; p++) {
  //     let date = cnsTructedDts[p]
  //     let yr = date.getUTCFullYear()
  //     let day = date.getUTCDate()
  //     let month = date.getUTCMonth()
  //     let desiredFormat = yr + '-' + month + '-' + day
  //     parsedDates.push(desiredFormat)
  //   }
  //   return parsedDates
  // }

  // let firstLangByteNum = getFirsLangCount(data)
  // function getFirsLangCount (data) {
  //   let newArr = []
  //   for (let i = 0; i < data.length; i++) {
  //     let countsForFirstLang = Object.values(data[i].all_lang_bytes_for_repo)
  //     countsForFirstLang = countsForFirstLang.reduce((acc, cur) => acc + cur, 0)
  //     newArr.push(countsForFirstLang)
  //   }
  //   newArr.reduce(function (a, b) {
  //     return a.concat(b)
  //   }, []
  //   )
  //   return newArr
  // }

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
      .attr("cy", 6)
      // .attr('cy', function (d) { return y(d.name) })

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
