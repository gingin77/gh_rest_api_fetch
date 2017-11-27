d3.json('static_data/tally_11-21-17.json', function (data) {
  console.log(data)

  let nestByLanguage = d3.nest()
    .key(function(d){return d.language})
    .entries(data)

    console.log(nestByLanguage)

    let width = 300,
      height = 50,
      div = d3.select("body").append("div")
         .style("position", "relative");


     let blue = '#457DB7',
       red = '#991B67', /* '#B71808',  */
       purple = '#A99CCD',
       peach = '#E6AC93',  /*  '#CA602E', */
       grey = '#8F8F90',
       cValue = function (d) { return d.language },
       color = d3.scaleOrdinal()
         .domain(['JavaScript', 'Ruby', 'CSS', 'HTML', 'CoffeeScript', 'Shell', 'Null'])
         .range([blue, red, purple, peach, grey, grey, grey])

    let treemap = d3.treemap()
      .size([width, height])
      .value(function (d) { return d.count })


})
