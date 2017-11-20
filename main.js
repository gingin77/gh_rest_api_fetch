let repoPrimryLang = []
let allLangUrls = []
let arrayOfLangObjs = []
let neededlangByteUrls = []
let langBytes = []

// d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function(data) {
//   console.log(data)
//   let dataObj = data
//
  // for (let i = 0; i < data.length; i++) {
  //   let langObj = {}
  //   langObj.repo_name = dataObj[i].name
  //   langObj.primary_repoPrimryLang = dataObj[i].repoPrimryLang
  //   langObj.url_lang_bytes = dataObj[i].repoPrimryLangs_url
  //   langObj.created_at = dataObj[i].created_at
  //   langObj.pushed_at = dataObj[i].pushed_at
  //
  //   arrayOfLangObjs.push(langObj)
  //
  //   repoPrimryLang.push(dataObj[i].repoPrimryLang)
  //   allLangUrls.push(dataObj[i].repoPrimryLangs_url)
  // }
//
//   console.log(arrayOfLangObjs)
// })


d3.json('static_data/arrayOfLangObjs.json.txt', function(data) {
  let langObj = data
  let thirtyMoRcntPshdRepos = langObj.slice().sort((a, b) =>
    new Date(b.pushed_at) - new Date(a.pushed_at)
  ).slice(0, 30)
  neededlangByteUrls = thirtyMoRcntPshdRepos.map((obj) =>
    obj.url_lang_bytes)
})

d3.json('static_data/language.txt', function(langsdata) {
  repoPrimryLang = langsdata
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

  var data = sortedArrayForD3

  // [{
  // 		"language": "Ruby",
  // 		"count": 8
  // 	},
  // 	{
  // 		"language": "JavaScript",
  // 		"count": 12
  // 		},
  // 	{
  // 		"language": "CSS",
  // 		"count": 5
  // 		},
  // 	{
  // 	"language": "HTML",
  // 	"count": 3
  // }]

  console.log(data)

  var barWidth = 50
  var width = (barWidth + 12) * data.length
  var height = 380
  console.log(typeof height)

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

  // console.log(y(datum.count))
  // Add labels on bars
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
