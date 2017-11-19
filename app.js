let language = []
let languageUrls = []
let arrayOfLangObjs = []
let langBytes = []

fetchGET('https://api.github.com/users/gingin77/repos?per_page=100&page=1')

function fetchGET(url) {
  fetch(url)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function (data) {
        console.log(data)
        let dataObj = data

        for (let i = 0; i < data.length; i++) {
          let langObj = {}
          langObj.repo_name = dataObj[i].name
          langObj.primary_language = dataObj[i].language
          langObj.url_lang_bytes = dataObj[i].languages_url
          langObj.created_at = dataObj[i].created_at
          langObj.pushed_at = dataObj[i].pushed_at

          arrayOfLangObjs.push(langObj)

          language.push(dataObj[i].language)
          languageUrls.push(dataObj[i].languages_url)
        }

        for (let q = 0; q < 2; q++) {
          getLanguageBytes(languageUrls[q])
        }
      })
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err)
    })
}

function getLanguageBytes(url) {
  fetch(url)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function(data) {
        console.log(data)
        let repoInfo = {}
        repoInfo.repo_url = url
        repoInfo.langStats = data
        console.log(repoInfo)

        langBytes.push(repoInfo)
      })
    })
    .catch(function(err) {
      console.log('Fetch Error :-S', err)
    })
}

let langsTotal = []

function tallyLangByteCounts (langBytes) {
  for (let i = 0; i < langBytes.length; i++) {
    let langArray = Object.getOwnPropertyNames(langBytes[i].langStats)
    let statsArray = Object.values(langBytes[i].langStats)
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
  }
}
