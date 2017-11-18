let language = []
let languageUrls = []
let langBytes = []

/*  It might be nice to keep track of the name of the repo that each set of language stats comes from... Then I could ask, rank repos by language usage stats

  langBytes = []
    name: "repo_name",
    languages: {HTML: 4327, JavaScript: 1831}
  }

*/

fetchGET('https://api.github.com/users/gingin77/repos?per_page=100&page=1')

function fetchGET(url) {
  fetch(url)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function(data) {
        console.log(data)
        console.log(data.length)

        let dataObj = data

        for (let i = 0; i < data.length; i++) {
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
