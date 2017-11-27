let arrayOfLangObjs = []
let repoPrimryLang = []
let allLangUrls = []
let neededlangByteUrls = []
let langBytesAryofObjs = []
let langsTotal = []

d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function (ghdata) {
  let dataObj = ghdata
  for (let i = 0; i < dataObj.length; i++) {
    let langObj = {}
    langObj.repo_name = dataObj[i].name
    langObj.primary_repo_lang = dataObj[i].language
    langObj.url_for_all_repo_langs = dataObj[i].languages_url
    langObj.created_at = dataObj[i].created_at
    langObj.pushed_at = dataObj[i].pushed_at

    arrayOfLangObjs.push(langObj)

    repoPrimryLang.push(dataObj[i].language)
    allLangUrls.push(dataObj[i].languages_url)
  }
  console.log(repoPrimryLang)
  enrichUrls(arrayOfLangObjs)

// Transform data for d3 to use for bar graph
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
  console.log(d3ArrayMinusNull)

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

function enrichUrls (arrayOfLangObjs) {
  console.log('enrichUrls was called')
  let thirtyMoRcntPshdRepos = arrayOfLangObjs.slice().sort((a, b) =>
    new Date(b.pushed_at) - new Date(a.pushed_at)
  )
  neededlangByteUrls = thirtyMoRcntPshdRepos.map((obj) => obj.url_for_all_repo_langs)
  console.log(neededlangByteUrls)
  console.log(neededlangByteUrls.length)
  getAllLanguageBytes(neededlangByteUrls)
}

function getAllLanguageBytes (array) {
  console.log('getAllLanguageBytes was called')
  for (let i = 0; i < array.length; i++) {
    getLanguageBytes(array[i])
  }
}

function getLanguageBytes (url) {
  console.log('getLanguageBytes was called')
  fetch(url)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function (data) {
        let repoInfo = {}
        repoInfo.url_for_all_repo_langs = url
        repoInfo.all_lang_bytes_for_repo = data
        langBytesAryofObjs.push(repoInfo)

        evalLangBytArrStatus(langBytesAryofObjs)
      })
    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
}

function evalLangBytArrStatus () {
  if (langBytesAryofObjs.length === neededlangByteUrls.length) {
    tallyLangByteCounts(langBytesAryofObjs)
    buildComprehensiveObj(arrayOfLangObjs, langBytesAryofObjs)
  }
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

let comprehensiveObjArr = []

function buildComprehensiveObj (array1, array2) {
  console.log('buildComprehensiveObj was called')
  let comprehensiveObj = {}
  for (let i = 0; i < array1.length; i++) {
    let compare = array1[i].url_for_all_repo_langs
    for (let q = 0; q < array2.length; q++) {
      if (compare === array2[q].url_for_all_repo_langs) {
        comprehensiveObj = {
          repo_name: array1[i].repo_name,
          url_for_all_repo_langs: array1[i].url_for_all_repo_langs,
          primary_repo_lang: array1[i].primary_repo_lang,
          created_at: array1[i].created_at,
          pushed_at: array1[i].pushed_at,
          all_lang_bytes_for_repo: array2[q].all_lang_bytes_for_repo
        }
        comprehensiveObjArr.push(comprehensiveObj)
      }
    }
  }
  console.log(comprehensiveObjArr)
}
console.log(comprehensiveObjArr)

let transformedArry = transformLangObj(comprehensiveObjArr)
console.log(transformedArry)

// Use language and count as keys, instead of 'language': 'count' key:value pairs
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
  console.log(myData)
  return myData
}

// Restructure array of objects. Instead of one object per repository, establish one object for every set of language byte counts for each reposity
let langBytesFirst = makeBytesFirst(transformedArry)

function makeBytesFirst (myData) {
  let newDataObjsArr = []
  myData.map(function (repObj) {
    let bytObj = repObj.all_lang_bytes_for_repo
    let newDataObj = {}
    if (bytObj.length !== 0) {
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
    } else {
      newDataObj = {
        'language': 'Null',
        'count': 0,
        'repo_name': repObj.repo_name,
        'pushed_at': repObj.pushed_at,
        'primary_repo_lang': 'na',
        'url_for_all_repo_langs': repObj.url_for_all_repo_langs
      }
      newDataObjsArr.push(newDataObj)
    }
  })
  console.log(newDataObjsArr)
  return newDataObjsArr
}
