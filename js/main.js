let repoPrimryLang = []
let arrayOfLangObjs = []
let existingArray = []

d3.json('static_data/langBytesFirst.json', function (data) {
  console.log(data)
  existingArray = data
  evalIfArrysNotNull(arrayOfLangObjs, existingArray)
})

d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function (dataObj) {
  for (let i = 0; i < dataObj.length; i++) {
    let langObj = {}
    langObj.repo_name = dataObj[i].name
    langObj.primary_repo_lang = dataObj[i].language
    langObj.url_for_all_repo_langs = dataObj[i].languages_url
    langObj.created_at = dataObj[i].created_at
    langObj.pushed_at = dataObj[i].pushed_at

    arrayOfLangObjs.push(langObj)

    repoPrimryLang.push(dataObj[i].language)
  }
  console.log(arrayOfLangObjs)
  evalIfArrysNotNull(arrayOfLangObjs, existingArray)
})

function evalIfArrysNotNull () {
  if (arrayOfLangObjs.length !== 0 && existingArray.length !== 0) {
    findNewRepos(arrayOfLangObjs, existingArray)
    findUpdatedRepos(arrayOfLangObjs, existingArray)
  }
}

let newRepoUrlsToFetch = []
let existingObjsToKeep = []
let updatedUrlsToFetch = []

let findNewReposComplete = false
let getURLsUpdtdReposComplete = false

let combinedArr = []

function findNewRepos (newArray, existingArray) {
  console.log('findNewRepos was called')
  let unMatchedObjs = []
  let existingRepos = existingArray.map(obj => obj.repo_name)
  newArray.forEach(function (obj) {
    if (existingRepos.indexOf(obj.repo_name) === -1) {
      unMatchedObjs.push(obj)
    }
  })
  newRepoUrlsToFetch = unMatchedObjs.map((obj) => obj.url_for_all_repo_langs)
  console.log(newRepoUrlsToFetch.length)
  findNewReposComplete = true
  compileURLsToFetch(newRepoUrlsToFetch, updatedUrlsToFetch)
}

function findUpdatedRepos (newArray, existingArray) {
  console.log('findUpdatedRepos was called')
  let matchedObjs = []
  existingArray.forEach(function (existObj) {
    newArray.filter(function (newArObj) {
      if ((new Date(existObj.pushed_at).toString()) === (new Date(newArObj.pushed_at).toString())) {
        matchedObjs.push(existObj)
      }
    })
  })
  existingObjsToKeep = matchedObjs
  console.log(existingObjsToKeep)
  getURLsUpdtdRepos(matchedObjs)
}

function getURLsUpdtdRepos (arr) {
  let updatedObjsToFetch = []
  existingArray.forEach(function (existObj) {
    if (arr.indexOf(existObj) === -1) {
      updatedObjsToFetch.push(existObj)
    }
  })
  let UpdtdUrls = updatedObjsToFetch.map((obj) => obj.url_for_all_repo_langs)
  updatedUrlsToFetch = elimateDuplicates(UpdtdUrls)
  console.log(updatedUrlsToFetch)
  getURLsUpdtdReposComplete = true
  compileURLsToFetch(newRepoUrlsToFetch, updatedUrlsToFetch)
}

function elimateDuplicates (arr) {
  let outPut = []
  let obj = {}
  arr.forEach(i => obj[i] = 0)
  for (item in obj) { outPut.push(item) }
  return outPut
}

function compileURLsToFetch (newRepoUrlsToFetch, updatedUrlsToFetch) {
  console.log('compileURLsToFetch was called')
  console.log(findNewReposComplete)
  console.log(getURLsUpdtdReposComplete)

  if (findNewReposComplete === true && getURLsUpdtdReposComplete === true) {
    combinedArr = newRepoUrlsToFetch.concat(updatedUrlsToFetch)
    console.log(combinedArr)
    splitArryToURLs(combinedArr)
  }
}

function splitArryToURLs (array) {
   for (let i = 0; i < array.length; i++) {
     let url = array[i]
     console.log(url)
     getLanguageBytes(url)
   }
 }

let langBytesAryofObjs = []

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
  console.log(langBytesAryofObjs.length)
  if (langBytesAryofObjs.length === combinedArr.length) {
    // tallyLangByteCounts(langBytesAryofObjs)
    buildComprehensiveObj(arrayOfLangObjs, langBytesAryofObjs)
  }
}

let comprehensiveObjArr = []

function buildComprehensiveObj (array1, array2) {
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
  transformLangObj(comprehensiveObjArr)
}

// Use language and count as keys, instead of " 'language': 'count' " as the key:value pairs
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
  makeBytesFirst(comprehensiveObjArr)
}

// Restructure array of objects. Instead of one object per repository, establish one object for every set of language byte counts for each reposity
let newDataObjsArr = []
function makeBytesFirst (myData) {
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
  combineNewWithExistingObjs(newDataObjsArr, existingObjsToKeep)
  // strToDtSingle(newDataObjsArr)
}

let updatedCompObj = []
let combineNewWithExistComplete = false

function combineNewWithExistingObjs (newDataObjsArr, existingObjsToKeep) {
  updatedCompObj = existingObjsToKeep.concat(newDataObjsArr)
  console.log(updatedCompObj)
  combineNewWithExistComplete = true
  console.log(updatedCompObj.length)
  drawScatterPlot()
}

function drawScatterPlot () {
  console.log("drawScatterPlot was called");
  d3.json('static_data/langBytesFirst.json', function (data) {
    let myData = []
    evalDataSetForD3 (data, combineNewWithExistComplete)

    function evalDataSetForD3 (data, combineNewWithExistComplete) {
      console.log(combineNewWithExistComplete)
      if (combineNewWithExistComplete) {
        myData = updatedCompObj
        console.log(myData)
      } else {
        myData = data
        console.log(myData)
      }
    }

    function strToDtSingle (d) {
      return new Date(d)
    }

    let sortbyDate = d3.nest()
      .key(function (d) {
        return d.pushed_at
      })
      .sortKeys(d3.ascending)
      .entries(myData)

    let minDate = new Date(sortbyDate[0].key),
      maxDate = new Date(sortbyDate[sortbyDate.length - 1].key),
      xMax = new Date(maxDate).addWeeks(1),
      xMin = new Date(minDate).addWeeks(-1)

    // Setup margin, height and width to define svg area
    let margin = {
        top: 10,
        right: 80,
        bottom: 60,
        left: 10
      },
      width = 740 - margin.left,
      height = 500 - margin.top - margin.bottom

    // Setup x values (scale; values displayed, and axis attributes)
    let xScale = d3.scaleTime().domain([xMin, xMax]).range([margin.right, width - margin.left]),
      xValue = function (d) { return xScale(strToDtSingle(d.pushed_at)) },
      xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(2)).tickFormat(d3.timeFormat('%b %e'))

    // Setup y values (scale; values displayed, and axis attributes)
    let yScale = d3.scaleLinear().domain([0, 82000]).range([height - 2, 0]),
      yValue = function (d) { return yScale(d.count) },
      yAxis = d3.axisLeft(yScale)

    // Add the svg canvas to DOM
    let svg = d3.select('#for_svg')
      .append('svg')
      .attr('width', width + margin.left)
      .attr('height', height + margin.top + margin.bottom)

    let g = svg.selectAll('g')

    // Add the x Axis
    svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
      .append('text')
      .attr('class', 'label')
      .attr('x', margin.right + ((width) / 2) - 20)
      .attr('y', 40)
      .text('Date of Most Recent Commit')

    // Add the y Axis
    svg.append('g')
      .attr('transform', 'translate(' + margin.right + ', 0)')
      .call(yAxis)
      .append('text')
      .attr('class', 'label')
      .attr('transform', 'rotate(-90)')
      .attr('y', (-1 * margin.right) + 10)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('Number of Bytes Stored')

    // Setup dot colors
    let blue = '#457DB7',
      rubyred = '#991B67',
      purple = '#A99CCD',
      peach = '#E6AC93',
      grey = '#8F8F90',
      cValue = function (d) { return d.language },
      color = d3.scaleOrdinal()
        .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript', 'Shell', 'Null'])
        .range([blue, rubyred, purple, peach, grey, grey, grey])

    // Draw dots
    svg.selectAll('dot')
      .data(myData)
      .enter().append('circle')
      .attr('r', 3.5)
      .attr('cx', xValue)
      .attr('cy', yValue)
      .style('fill', function (d) { return color(cValue(d)) })
      .on('mouseover', function (d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 1)
        tooltip.html(d.language + '<br/>' + d.repo_name)
          .style('left', (d3.event.pageX + 4) + 'px')
          .style('top', (d3.event.pageY - 12) + 'px')
      })
      .on('mouseout', function (d) {
        tooltip.transition()
          .duration(200)
          .style('opacity', 0)
      })

    // Add the tooltip area to the webpage
    let tooltip = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)

    // Set up alternative text to use for legend
    let lcolor = d3.scaleOrdinal()
      .domain(['JS', 'Ruby', 'CSS', 'HTML', 'Misc'])
      .range([blue, rubyred, purple, peach, grey])

    // Set up legend
    let legend = svg.selectAll('.legend')
      .data(lcolor.domain())
      .enter().append('g')
      .attr('class', 'legend')
      .attr('transform', function (d, i) {
        return 'translate(4,' + i * 18 + ')'
      })

    legend.append('rect')
      .attr('x', margin.right + 4)
      .attr('width', 14)
      .attr('height', 14)
      .style('fill', lcolor)

    legend.append('text')
      .attr('class', 'legend_label')
      .attr('x', margin.right + 22)
      .attr('y', 7)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(function (d) { return d })
  })
}
