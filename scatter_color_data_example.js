// https://bl.ocks.org/floofydugong/9c94ab01d8c3ed8ea3821d4a7e119b07

objects.selectAll(".dot")
    .data(data)
    .enter().append("circle")
    .classed("dot", true)
    .attr({
        r: function(d) {
            return 4 * Math.sqrt(d[rCat] / Math.PI);
        },
        cx: function(d) {
            return x(d[xCat]);
        },
        cy: function(d) {
            return y(d[yCat]);
        }
    })
.style("fill", function(d) {
    return color(d[colorCat]);
})
    .on("mouseover", tip.show)
    .on("mouseout", tip.hide);

var legend = svg.selectAll(".legend")
    .data(color.domain())
    .enter().append("g")
    .classed("legend", true)
    .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
    });
legend.append("rect")
    .attr("x", width + 10)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", color);
legend.on("click", function(type) {
    // dim all of the icons in legend
    d3.selectAll(".legend")
        .style("opacity", 0.1);
    // make the one selected be un-dimmed
    d3.select(this)
        .style("opacity", 1);
    // select all dots and apply 0 opacity (hide)
    d3.selectAll(".dot")
    // .transition()
    // .duration(500)
    .style("opacity", 0.0)
    // filter out the ones we want to show and apply properties
    .filter(function(d) {
        return d["first_careunit"] == type;
    })
        .style("opacity", 1) // need this line to unhide dots
    .style("stroke", "black")
    // apply stroke rule
    .style("fill", function(d) {
        if (d.hospital_expire_flag == 1) {
            return this
        } else {
            return "white"
        };
    });
});
legend.append("text")
    .attr("x", width + 26)
    .attr("dy", ".65em")
    .text(function(d) {
        return d;
    });
