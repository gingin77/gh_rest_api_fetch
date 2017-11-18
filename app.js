let language = []
let languageUrls = []

fetchGET('https://api.github.com/users/gingin77/repos?per_page=100&page=1')

function fetchGET (url) {
  fetch(url)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function (data) {
        console.log(data)
        console.log(data.length)

        let dataObj = data

        for (let i = 0; i < data.length; i++) {
          language.push(dataObj[i].language)
          languageUrls.push(dataObj[i].languages_url)
        }
        // console.log(languageUrls[0])
        // getLanguageBytes(languageUrls[0])

        for (let q = 0; q < languageUrls.length; q++) {
          getLanguageBytes(languageUrls[q])
        }

    })
    .catch(function (err) {
      console.log('Fetch Error :-S', err)
    })
  })
}

// getURLS(languageUrls)
//
// // let urlArray = []
// let byteUrl = ''

// function getURLS () {
//   console.log("getURLS was called")
//   let urlArray = Object.values(languageUrls)
//   console.log(urlArray)
//   for (let q = 0; q < languageUrls.length; q++) {
//     getLanguageBytes(languageUrls[q])
//   }
// }

// getLanguageBytes('https://api.github.com/repos/gingin77/Authentication_proj/languages')

function getLanguageBytes (url) {
  fetch(url)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(response.status)
        return
      }
      response.json().then(function (data) {
        console.log(data)

        let langObj = data

        // for (let i = 0; i < langObj.length; i++) {
        //   language.push(dataObj[i].language)
        //   languageUrls.push(dataObj[i].languages_url)
        // }
      })
    })
}
