var language_bytes = <%= language_byte_count %>
console.log(language_bytes)

var childrenFunction = function(d){return d.elements};
var sizeFunction = function(d){return d.count;};
var colorFunction = function(d){return Math.floor(Math.random()*20)};
var nameFunction = function(d){return d.name;};

var color = d3.scale.linear()
            .domain([0,10,15,20])
            .range(["#060026","#c9c9c9","#504494","#e6e6e7"]);

drawTreemap(400, 400, '#byte_freq', language_bytes, childrenFunction, nameFunction, sizeFunction, colorFunction, color);

function drawTreemap(height,width,elementSelector,language_bytes,childrenFunction,nameFunction,sizeFunction,colorFunction,colorScale){

    var treemap = d3.layout.treemap()
        .children(childrenFunction)
        .size([width,height])
        .value(sizeFunction);

    var div = d3.select(elementSelector)
        .append("div")
        .style("position","relative")
        .style("width",width + "px")
        .style("height",height + "px")
        .style("color","#F6F5F6");

    div.data(language_bytes).selectAll("div")
        .data(function(d){return treemap.nodes(d);})
        .enter()
        .append("div")
        .attr("class","cell")
        .style("margin","10px")
        .style("padding","10px")
        .style("background",function(d){ return colorScale(colorFunction(d));})
        .call(cell)
        .text(nameFunction);
}

function cell(){
    this
        .style("left",function(d){return d.x + "px";})
        .style("top",function(d){return d.y + "px";})
        .style("width",function(d){return d.dx - 1 + "px";})
        .style("height",function(d){return d.dy - 1 + "px";});
}

let htmlName = language_bytes[0].elements[5].name
let jsName = language_bytes[0].elements[4].name
console.log(jsName)

let cellDivs = document.getElementsByClassName('cell')

function readCellDivs (textEl) {
  for (i = 0; i < cellDivs.length; i++){
        if (cellDivs[i].innerText === textEl){
            return cellDivs[i]
        }
    }
}
let htmlBox = readCellDivs(htmlName)
htmlBoxCurrentStyle = htmlBox.getAttribute('style')
htmlBox.setAttribute('style', htmlBoxCurrentStyle + "padding-bottom: 0px")

let jsBox = readCellDivs(jsName)
jsBoxCurrentStyle = jsBox.getAttribute('style')
jsBox.setAttribute('style', jsBoxCurrentStyle + "margin-top: 19px")
