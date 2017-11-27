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
  let langsTotal2 = comprehensiveObj.map((objs) => objs.all_lang_bytes_for_repo)
  let bigArrOfArrays = []
  for (let i = 0; i < langsTotal2.length; i++) {
    let kvPairs = Object.entries(langsTotal2[i])
    bigArrOfArrays.push(kvPairs)
  }
  bigArrOfArrays = bigArrOfArrays.reduce((a, b) => a.concat(b), [])
  let arrOfLangs = bigArrOfArrays.map((lang) => lang[0]).reduce((a, b) => a.concat(b), [])
  let unique = [...new Set(arrOfLangs)]
  let newTotalCounts = []
  let totalCountObjForU = {}
  for (let u = 0; u < unique.length; u++) {
    let langCountforU = []
    for (let l = 0; l < bigArrOfArrays.length; l++) {
      if (unique[u] === bigArrOfArrays[l][0]) {
        langCountforU.push(bigArrOfArrays[l][1])
      }
    }
    langCountforU = langCountforU.reduce((acc, curr) => acc + curr, 0)
    totalCountObjForU = {
      language: unique[u],
      counts: langCountforU
    }
    newTotalCounts.push(totalCountObjForU)
  }
  console.log(newTotalCounts)
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
d3.json('static_data/repoPrimryLang_ary.txt', function (data) {
  repoPrimryLang = data
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

  let margin = {right: 10, left: 10}
  var barWidth = 50
  var width = (barWidth + 14) * data.length
  var height = 380

  var x = d3.scaleLinear()
    .domain([0, data.length])
    .range([margin.right, width])

  var y = d3.scaleLinear()
    .domain([0, d3.max(data, function (datum) {
      return datum.count
    })])
    .rangeRound([0, height])

// add the canvas to the DOM
  var languageBars = d3.select('#graphicOne')
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
