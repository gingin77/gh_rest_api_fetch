d3.json('static_data/compObj_46_repos.json', function (data) {
  function strToDtSingle (d) {
    return new Date(d)
  }

  let myData = data
  transformLangObj(myData)
  console.log(myData)

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
      console.log(bytObj)
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
  console.log(langBytesFirst)

  let dataByDate = d3.nest().key(function(d) {return d.pushed_at; })
  console.log(dataByDate.entries(myData).map((item) => item))

  let dataByLangByte = d3.nest().key(function (d) { return d.all_lang_bytes_for_repo.map((obj) => obj.language) })
  console.log(dataByLangByte.entries(myData).map((item) => item))

  data.forEach(function (d) {
    // d.test = d3.map([d3.entries(d.all_lang_bytes_for_repo)], function(d) {return d.value })
    let testKeys = d3.keys(d.all_lang_bytes_for_repo)
    // console.log(testKeys)

    d.numbers = d3.values(d.all_lang_bytes_for_repo)
    // console.log(d.numbers)
    let test2 = 0
    let number = d.numbers.map( function (item) {
      test2 = item
    })
    // console.log(number)
    // d.numbers = testValues.map((item) => item)
    // console.log(d.numbers)
    let testValuesMap = d3.map(d.numbers)
    // // ^^ sample output:
    // Object { "$0": 7928, "$1": 5646, "$2": 1692 }

    let values1 = testValuesMap.each( function(d) { return d.values })
    // console.log(values1)


    d.test = d3.entries(d.all_lang_bytes_for_repo)
    // ^^gives an array containing an Object where output is:
        //     […]
        // 0: Object { key: "Ruby", value: 2785 }
        // length: 1
        // __proto__: Array []
    let map = d3.map(d.test)
    // ^^ gives an Object containing an Object. Outpus is:
    //     {…}
    // "$0": Object { key: "Ruby", value: 2785 }
    // __proto__: Object { constructor: t(), has: has(), get: get(), … }

    let mapToo = d3.map(d.all_lang_bytes_for_repo)
    // ^^ give back the following 2 output examples:
    // {…}
      // "$Ruby": 2785
      // __proto__: Object { constructor: t(), has: has(), get: get(), … }
      // scatter_plot.js:31:5
      // Object {  }
      // scatter_plot.js:31:5
    // {…}
      // "$CSS": 7928
      // "$HTML": 1692
      // "$JavaScript": 5646


    // let values = map.get(value)
    // d.values = d3.values(d.test)
    // var propertyNest = d3.nest()
    //   propertyNest.key(function(d){return d})
    //   propertyNest.key(function(d){return d.test})
    //   propertyNest.entries(data.properties)
    //
    // d.numbers =
    // console.log(d.test)
    console.log(mapToo)
    // console.log(map.values())
    // console.log(values)
    // d.numbers = d3.map([], function (d) { return d.values })

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
    // console.log(dateMin)
    // console.log(x(dateMin))
    // console.log(dateMax)
    // console.log(x(dateMax))

  let y = d3.scaleLinear()
    .domain([0, 20000])
    .range([height, 0])
    // console.log(y(1000))

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
      .data(langBytesFirst)
    .enter().append('circle')
      .attr('r', 3.5)
      .attr('cx', function (d) { return x(strToDtSingle(d.pushed_at)) })
      .attr('cy', function (d) { return y(d.count) })

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