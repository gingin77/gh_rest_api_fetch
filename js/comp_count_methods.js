let langsTotal = []

d3.json('static_data/langBytesFirst.json', function (data) {
  let langNest = d3.nest()
  .key(function (d) { return d.language })
  .rollup(function (s) {
    return d3.sum(s, function (d) {
      return d.count
    })
  })
  .entries(data)

  console.log(langNest)
})

d3.json('static_data/compObj_46_11_27.json', function (data) {
  rebuildAllLangObj(data)
  tallyLangByteCounts(data)
})

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
