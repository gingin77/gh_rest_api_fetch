let arrayOfLangObjs = []
let repoPrimryLang = []
let neededlangByteUrls = []
let langBytesAryofObjs = []
let langsTotal = []
let existingArray = []

// d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function (ghdata) {
  // console.log(ghdata)
  // let dataObj = ghdata
  // for (let i = 0; i < dataObj.length; i++) {
  //   let langObj = {}
  //   langObj.repo_name = dataObj[i].name
  //   langObj.primary_repo_lang = dataObj[i].language
  //   langObj.url_for_all_repo_langs = dataObj[i].languages_url
  //   langObj.created_at = dataObj[i].created_at
  //   langObj.pushed_at = dataObj[i].pushed_at
  //
  //   arrayOfLangObjs.push(langObj)
  //
  //   repoPrimryLang.push(dataObj[i].language)
  // }
  // console.log(arrayOfLangObjs)
  // evalIfArrysNotNull(arrayOfLangObjs, existingArray)

d3.json('static_data/langBytesFirst.json', function (data) {
  existingArray = data
  evalIfArrysNotNull(arrayOfLangObjs, existingArray)
})

d3.json('static_data/arrayOfLangObjs.json', function (dataObj) {
  for (let i = 0; i < dataObj.length; i++) {
    let langObj = {}
    langObj.repo_name = dataObj[i].repo_name
    langObj.primary_repo_lang = dataObj[i].primary_repo_lang
    langObj.url_for_all_repo_langs = dataObj[i].url_for_all_repo_langs
    langObj.created_at = dataObj[i].created_at
    langObj.pushed_at = dataObj[i].pushed_at

    arrayOfLangObjs.push(langObj)

    repoPrimryLang.push(dataObj[i].primary_repo_lang)
  }
  evalIfArrysNotNull(arrayOfLangObjs, existingArray)
})

function evalIfArrysNotNull () {
  console.log('evalIfArrysNotNull was called')
  console.log(arrayOfLangObjs.length)
  console.log(existingArray.length)
  if (arrayOfLangObjs.length !== 0 && existingArray.length !== 0) {
    findNewRepos(arrayOfLangObjs, existingArray)
    findUpdatedRepos(arrayOfLangObjs, existingArray)
  }
}

let newRepoUrlsToFetch = []
let existingObjsToKeep = []
let updatedUrlsToFetch = []
let combinedArr = []
let findNewReposComplete = false
let getURLsUpdtdReposComplete = false

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

function combineNewWithExistingObjs (newDataObjsArr, existingObjsToKeep) {
  let updatedCompObj = existingObjsToKeep.concat(newDataObjsArr)
  console.log(updatedCompObj)
  console.log(updatedCompObj.length)
}
