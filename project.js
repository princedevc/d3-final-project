var svg_width = 800;
var svg_height = 500;
var scatter_data;
var margin = { top: 45,  bottom: 40,left: 130, right: 90 };
var scatter_width = svg_width - margin.left - margin.right;
var scatter_height = svg_height - margin.top - margin.bottom;

const xscale = d3.scaleLinear()
    .range([0, scatter_width]); //svg range
const yscale = d3.scalePoint()
    .range([0, scatter_height]);


d3.csv("foot.csv").then(function (data) {
    console.log(data);
    scatter_data = data;
    draw(d3.select("input").attr("value"));

})
function draw(slider_value) {
    var svg = d3.select("svg");

    xscale.domain([
        d3.min(scatter_data.map(function (entry) { return entry.finalPosition })
        ),
        d3.max(scatter_data.map(function (entry) { return entry.finalPosition * 1.5 }) //instead of salary
        )]);

    yscale.domain(scatter_data.map(function (entry) { return entry.club; }))

    var g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`)
        .classed("globalgroup", true);

    const yAxis = d3.axisLeft(yscale).tickSize(-innerWidth);
    g.append("g").call(yAxis).attr("font-size", "15");

    const xAxis = d3.axisBottom(xscale).tickSize(-innerWidth);
    g.append("g").call(xAxis)
        .attr("transform", `translate(0, ${scatter_height})`);
    var label = svg.append('g')
        .attr('class', 'final')
        .attr('transform', `translate(10,10)`);
    label.append('text')
        .attr('x', svg_height - 80)
        .attr('y', svg_height - 20)
        .text('Final position');

    label.append('text')
       
        .attr('x', 40)
        .attr('y', 20)
        .text('clubs');

    draw_scatter(slider_value);
}
function draw_scatter(slider_value) {
    var scatters = d3.select(".globalgroup").selectAll("circle").data(scatter_data.filter(function (entry) {
        return entry.shortYear == slider_value;
    }));
    let mouse_over = function (data) {
        d3.selectAll("circle")
            .style("opacity", .4);
        d3.select(this)
            .style("opacity", 1)
            .style("stroke", "gold").attr("r", 16).style("fill", "black");
            //this displays the text when you hover over the circle
        d3.select("svg").append("text").text( data.salary)
        .attr("x",xscale(data.finalPosition)+100)
        .attr("y",xscale(data.finalPosition) + 20).attr('id', 'tt');

    }

    let mouse_out = function () {
        d3.selectAll("circle").transition().duration(300)
            .style("opacity", .8)
        d3.select(this).transition().duration(300)
            .style("stroke", "transparent").attr("r", 8).style("fill", "#e5ffaa");
            d3.select('#tt').remove(); 
    }
    scatters.enter().append("circle").merge(scatters)

        .attr("cy", function (data) {
            return yscale(data.club);
        })
        .attr("cx", function (entry) {
            return xscale(entry.finalPosition); // /100
        })
        .attr("r", 8)
        .attr("fill", "#e5ffaa")
        .on("mouseover", mouse_over)
        .on("mouseout", mouse_out);
}

function slider_change(slider_value) {
    console.log(slider_value);
    draw_scatter(slider_value);
}

