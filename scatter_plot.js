d3.json('static_data/compObj_46_repos.json', function (data) {
  function strToDtSingle (d) {
    return new Date(d)
  }

  let myData = data
  transformLangObj(myData)

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
  }

  let langBytesFirst = makeBytesFirst(myData)

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
    return newDataObjsArr
  }

  let sortbyDate = d3.nest()
    .key(function (d) {
      return d.pushed_at
    })
    .sortKeys(d3.ascending)
    .entries(langBytesFirst)

  let minDate = new Date(sortbyDate[0].key),
    maxDate = new Date(sortbyDate[sortbyDate.length - 1].key),
    xMax = addOneWeek(maxDate)
    xMin = subtrOneWeek(minDate)
    console.log(xMin)
    console.log(minDate)

  function addOneWeek (maxDate) {
    let day = maxDate.getDate()
    let month = maxDate.getMonth()
    let yr = maxDate.getFullYear()
    if ((day + 7) < 28) {
      return new Date(yr + '-' + (month + 1) + '-' + (day + 7))
    } else {
      return new Date(yr + '-' + (month + 2) + '-' + 7)
    }
  }

  function subtrOneWeek (minDate) {
    let day = minDate.getDate()
    console.log(day)
    let month = minDate.getMonth()
    let yr = minDate.getFullYear()
    if ((day - 3) < 1) {
      console.log('(day - 3) <= 1)')
      return new Date(yr + '-' + (month) + '-' + 28)
    } else {
      return new Date(yr + '-' + (month + 1) + '-' + (day - 3))
    }
  }

  let margin = {
      top: 10,
      right: 80,
      bottom: 40,
      left: 40
    },
    width = 740 - margin.left,
    height = 340 - margin.top - margin.bottom

  // setup x
  let xScale = d3.scaleTime().domain([xMin, xMax]).range([margin.right, width - margin.left]),
    xValue = function (d) {
      return xScale(strToDtSingle(d.pushed_at))
    },
    xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(2)).tickFormat(d3.timeFormat('%b %e'))

  // setup y
  let yScale = d3.scaleLinear().domain([0, 42000]).range([height - 2, 0]),
    yValue = function (d) {
      return yScale(d.count)
    },
    yAxis = d3.axisLeft(yScale)

  // Add the svg canvas
  let svg = d3.select('body')
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
    .attr('x', (width / 2) + 20)
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

  // setup dot colors
  let blue = '#457DB7',
    red = '#991B67', /* '#B71808',  */
    purple = '#A99CCD',
    peach = '#E6AC93',  /*  '#CA602E', */
    grey = '#8F8F90',
  cValue = function (d) { return d.language },
  color = d3.scaleOrdinal()
    .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript', 'Shell', 'Null'])
    .range([blue, red, purple, peach, grey, grey, grey])

  // draw dots
  svg.selectAll('dot')
    .data(langBytesFirst)
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

  // add the tooltip area to the webpage
  let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

  let lcolor = d3.scaleOrdinal()
    .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript/Shell/Null'])
    .range([blue, red, purple, peach, grey])

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
