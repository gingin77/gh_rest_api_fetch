let arrayOfLangObjs = []
let repoPrimryLang = []
let allLangUrls = []
let neededlangByteUrls = []
let langBytesAryofObjs = []
let langsTotal = []

d3.json('static_data/compObj_46_repos.json', function (ghdata) {
  let dataObj = ghdata
  rebuildAllLangObj(dataObj)
})

function rebuildAllLangObj (comprehensiveObj) {
  // First, build an array of objects that only contain the language stats. Throw out the repo identifying info
  let langsTotal2 = comprehensiveObj.map((objs) => objs.all_lang_bytes_for_repo)
  // Sample output, first 3 items in langsTotal2 array
    // 0: Object { JavaScript: 6886, HTML: 810 }
    // 1: Object { CSS: 13746, HTML: 11864 }
    // 2: Object { Ruby: 17820 }

  // Create an empty array that will hold all lang counts
  let bigAryOfObjs = []

  // Loop through the array of Objects created in first line of function.
  for (let i = 0; i < langsTotal2.length; i++) {
    // Convert each object  key-value pair
    let kv_pairs = Object.entries(langsTotal2[i])
    // Sample output from first 2 items from original array of objects. Note that shown below is each kv_pair array of arrays:
      // […]
        // 0: Array [ "JavaScript", 6886 ]
        // 1: Array [ "HTML", 810 ]
        // length: 2
        // __proto__: Array []

        // […]
        // 0: Array [ "CSS", 13746 ]
        // 1: Array [ "HTML", 11864 ]
        // length: 2
        // __proto__: Array []

    bigAryOfObjs.push(kv_pairs)
  }
  console.log(bigAryOfObjs)
    // Sample output, bigAryOfObjs is a bunch of arrays within arrays now
    // […]
    // 0: […]
      // 0: Array [ "JavaScript", 6886 ]
      // 1: Array [ "HTML", 810 ]
      // length: 2
      // __proto__: Array []
    // 1: […]
      // 0: Array [ "CSS", 13746 ]
      // 1: Array [ "HTML", 11864 ]
      // length: 2
      // __proto__: Array []
  bigAryOfObjs = bigAryOfObjs.reduce((a, b) => a.concat(b), [])
  console.log(bigAryOfObjs)
  // […]
    // [0…99]
      // 0: Array [ "JavaScript", 6886 ]
      // 1: Array [ "HTML", 810 ]
      // 2: Array [ "CSS", 13746 ]
      // 3: Array [ "HTML", 11864 ]
      // 4: Array [ "Ruby", 17820 ]
  let jsArr = bigAryOfObjs.filter(item => item[0] === 'JavaScript')
  console.log(jsArr)
  // […]
    // 0: Array [ "JavaScript", 6886 ]
    // 1: Array [ "JavaScript", 11119 ]
    // 2: Array [ "JavaScript", 17187 ]
    // 3: Array [ "JavaScript", 10989 ]
    // 4: Array [ "JavaScript", 13454 ]
  let jsArrCounts = jsArr.map(getCount => getCount[1])
  console.log(jsArrCounts)
  //   […]
    // 0: 6886
    // 1: 11119
    // 2: 17187
    // 3: 10989
    // 4: 13454
  let jsCount = jsArrCounts.reduce((acc, cur) => acc + cur, 0)
  console.log(jsCount)
  // 252004
}

function tallyLangByteCounts (langBytesAryofObjs) {
  console.log('tallyLangByteCounts was called')
  for (let i = 0; i < langBytesAryofObjs.length; i++) {
    let langArray = Object.getOwnPropertyNames(langBytesAryofObjs[i].all_lang_bytes_for_repo)
    let statsArray = Object.values(langBytesAryofObjs[i].all_lang_bytes_for_repo)
    let listedInLangsTotal = langsTotal.map(function (obj) {
      return obj.language
    })
    for (let q = 0; q < langArray.length; q++) {
      let langObj = {}
      langObj.language = langArray[q]
      langObj.count = statsArray[q]

      if (langsTotal.length === 0) {
        langsTotal.push(langObj)
      } else {
        if (listedInLangsTotal.includes(langArray[q]) === true) {
          let indexPos = listedInLangsTotal.indexOf(langArray[q])
          langsTotal[indexPos].count = langsTotal[indexPos].count + statsArray[q]
        } else {
          langsTotal.push(langObj)
        }
      }
    }
  } console.log(langsTotal)
}


// Transform data for d3 to use for column graph
d3.json('static_data/repoPrimryLang_ary.txt', function (primL_ary) {
  repoPrimryLang = primL_ary
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
  var data = d3ArrayMinusNull
  var barWidth = 50
  var width = (barWidth + 14) * data.length
  var height = 380

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

// Add labels to bars
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
})
