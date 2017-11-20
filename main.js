let arrayOfLangObjs = []
let repoPrimryLang = []
let allLangUrls = []
let neededlangByteUrls = []
// let langBytes = []

d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function (ghdata) {
  console.log(ghdata)
  let dataObj = ghdata
  console.log(dataObj)

  for (let i = 0; i < dataObj.length; i++) {
    let langObj = {}
    langObj.repo_name = dataObj[i].name
    langObj.primary_repo_lang = dataObj[i].language
    langObj.url_lang_bytes = dataObj[i].languages_url
    langObj.created_at = dataObj[i].created_at
    langObj.pushed_at = dataObj[i].pushed_at

    arrayOfLangObjs.push(langObj)

    repoPrimryLang.push(dataObj[i].language)
    allLangUrls.push(dataObj[i].languages_url)
  }

  console.log(arrayOfLangObjs)
  filterUrls(arrayOfLangObjs)
// })
//
//
// d3.json('static_data/arrayOfLangObjs.json.txt', function(data) {

// d3.json('static_data/language.txt', function(langsdata) {
  // repoPrimryLang = langsdata

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

function filterUrls (arrayOfLangObjs) {
  let allLangUrls2 = arrayOfLangObjs.map((obj) => obj.url_lang_bytes)
  console.log(allLangUrls2)
  let thirtyMoRcntPshdRepos = arrayOfLangObjs.slice().sort((a, b) =>
    new Date(b.pushed_at) - new Date(a.pushed_at)
  ).slice(0, 30)
  neededlangByteUrls = thirtyMoRcntPshdRepos.map((obj) => obj.url_lang_bytes)
  console.log(neededlangByteUrls)
}

// function getLanguageBytes(url) {
//   fetch(url)
//     .then(function(response) {
//       if (response.status !== 200) {
//         console.log(response.status)
//         return
//       }
//       response.json().then(function(data) {
//         console.log(data)
//         let repoInfo = {}
//         repoInfo.repo_url = url
//         repoInfo.langStats = data
//         console.log(repoInfo)
//
//         langBytes.push(repoInfo)
//       })
//     })
//     .catch(function(err) {
//       console.log('Fetch Error :-S', err)
//     })
// }
//
// // let langsTotal = []
//
// function tallyLangByteCounts (langBytes) {
//   for (let i = 0; i < langBytes.length; i++) {
//     let langArray = Object.getOwnPropertyNames(langBytes[i].langStats)
//     let statsArray = Object.values(langBytes[i].langStats)
//     let listedInLangsTotal = langsTotal.map(function (obj) {
//       return obj.language
//     })
//     for (let q = 0; q < langArray.length; q++) {
//       let langObj = {}
//       langObj.language = langArray[q]
//       langObj.count = statsArray[q]
//
//       if (langsTotal.length === 0) {
//         langsTotal.push(langObj)
//       } else {
//         if (listedInLangsTotal.includes(langArray[q]) === true) {
//           let indexPos = listedInLangsTotal.indexOf(langArray[q])
//           langsTotal[indexPos].count = langsTotal[indexPos].count + statsArray[q]
//         } else {
//           langsTotal.push(langObj)
//         }
//       }
//     }
//   }
// }
