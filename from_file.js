let arrayOfLangObjs = []
let repoPrimryLang = []
let allLangUrls = []
let neededlangByteUrls = []
let langBytesAryofObjs = []
let langsTotal = []

d3.json('static_data/compObj_46_repos.json', function (ghdata) {
  let dataObj = ghdata
  console.log(dataObj)
})

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
  console.log(repoPrimryLang)
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
