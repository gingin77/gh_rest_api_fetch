let language = []
let languageUrls = []
let arrayOfLangObjs = []
let neededUrls = []
// let langBytes = []

// d3.json('https://api.github.com/users/gingin77/repos?per_page=100&page=1', function(data) {
//   console.log(data)
//   let dataObj = data
//
//   for (let i = 0; i < data.length; i++) {
//     let langObj = {}
//     langObj.repo_name = dataObj[i].name
//     langObj.primary_language = dataObj[i].language
//     langObj.url_lang_bytes = dataObj[i].languages_url
//     langObj.created_at = dataObj[i].created_at
//     langObj.pushed_at = dataObj[i].pushed_at
//
//     arrayOfLangObjs.push(langObj)
//
//     language.push(dataObj[i].language)
//     languageUrls.push(dataObj[i].languages_url)
//   }
//
//   console.log(arrayOfLangObjs)
//
//   let p = d3.select("body")
//               .selectAll("p")
//               .data(language)
//               .enter().append("p")
//               .text(function (d, i) {
//                   return d;
//               })
// });

d3.json('arrayOfLangObjs.json.txt', function (data) {
  let langObj = data
  let thirtyMoRcntPshdRepos = langObj.slice().sort((a, b) =>
    new Date(b.pushed_at) - new Date(a.pushed_at)
  ).slice(0, 30)
  neededUrls = thirtyMoRcntPshdRepos.map(function (obj) {
    return obj.url_lang_bytes
  })
  console.log(neededUrls)
})
