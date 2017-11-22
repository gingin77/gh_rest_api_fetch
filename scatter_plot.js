d3.json('static_data/compObj_46_repos.json', function (gitHubData) {
  console.log(gitHubData)
  let dataObj = gitHubData

  function getDataForScatterPlot (array) {
    let data = array.map(function (objs) {
      return {
        pushed_at: objs.pushed_at,
        repo_name: objs.repo_name,
        all_lang_bytes_for_repo: objs.all_lang_bytes_for_repo
      }
    })
    return data
  }
  let scatterData = getDataForScatterPlot(dataObj)

  // Parse the date / time
  // var strictIsoParse = d3.utcParse('%Y-%m-%dT%H:%M:%S.%LZ')

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

  function strToDtSingle (datesting) {
    let date = new Date(datesting)
    let yr = date.getUTCFullYear()
    let day = date.getUTCDate()
    let month = date.getUTCMonth()
    date = yr + '-' + month + '-' + day
    return date
  }
  // let prsdDts = strToDt(sortScdX)
  // console.log(prsdDts)
  // console.log(typeof prsdDts[0])

  gitHubData.forEach(function(d) {
    d.date = strToDtSingle(d.pushed_at)
    d.name = d.repo_name
    // d.number = Object.values(d.all_lang_bytes_for_repo)
    console.log(d.date)
  })
  console.log(gitHubData)




  let scdX = scatterData.map((item) => item.pushed_at)
    .reduce(function (a, b) {
      return a.concat(b)
    }, []
  )

  let firstLangByteNum = getFirsLangCount(scatterData)
  function getFirsLangCount (scatterData) {
    let newArr = []
    for (let i = 0; i < scatterData.length; i++) {
      let countsForFirstLang = Object.values(scatterData[i].all_lang_bytes_for_repo)
      countsForFirstLang = countsForFirstLang.reduce((acc, cur) => acc + cur, 0)
      newArr.push(countsForFirstLang)
    }
    newArr.reduce(function (a, b) {
      return a.concat(b)
    }, []
    )
    return newArr
  }

  let sortScdX = scdX.sort(function (a, b) {
    return Date.parse(a) > Date.parse(b)
  })

  let mockData = makeMockData(prsdDts, firstLangByteNum)
  function makeMockData (array1, array2) {
    let newArrOfObjs = []
    for (let p = 0; p < array1.length; p++) {
      let newObj = {}
      newObj = {
        date: array1[p],
        number: array2[p]
      }
      newArrOfObjs.push(newObj)
    }
    return newArrOfObjs
  }

  let dateMin = prsdDts[0]
  let dateMax = prsdDts[prsdDts.length - 1]

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

  // draw dots
  svg.selectAll("dot")
      .data(mockData)
    .enter().append("circle")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.date); })
      .attr("cy", function(d) { return y(d.number); })

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
