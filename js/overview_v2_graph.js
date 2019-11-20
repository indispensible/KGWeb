var width = document.body.clientWidth * 0.46,
    height = window.screen.height * 0.85,
    padding = 2.5, // separation between same-color circles
    clusterPadding = 7, // separation between different-color circles
    maxRadius = 12;

var n = 400, // total number of circles
    m = 1; // number of distinct clusters

var color = d3.scale.category10()
    .domain(d3.range(m));

// The largest node for each cluster.
var clusters = new Array(m);

var nodes = d3.range(n).map(function() {
  var i = Math.floor(Math.random() * m),
      r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
      d = {cluster: i, radius: r};
  if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
  return d;
});

var force = d3.layout.force()
    .nodes(nodes)
    .size([width, height])
    .gravity(0)
    .charge(0)
    .on("tick", tick)
    .start();

var svg = d3.select("#package").append("svg")
    .attr("width", width)
    .attr("height", height);

force.drag().on("dragstart",function(d,i){
    d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
})

var circle1 = svg.selectAll("g")
    .data(nodes)
  .enter().append("g")
    // .attr("r", function(d) { return d.radius; })
    // .style("fill", function(d) { return "#FF9800"; })
    // .call(force.drag)

var circle = circle1.append("circle")
                    .attr("r", function(d) { return d.radius; })
                    .style("fill", function(d) { return "#FF9800"; })
console.log(circle1)
circle1
    .append("text")
    .attr("dy", ".35em")
    .text(function(d) { return d.radius; })

// var cicle = svg.selectAll("circle").data(nodes).style("fill", function(d) { return "#FF9800"; });

  console.log(circle)

function tick(e) {
  circle
      .each(cluster(10 * e.alpha * e.alpha))
      .each(collide(.5))
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; })
  circle1.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });    
}

// Move d to be adjacent to the cluster node.
function cluster(alpha) {
  return function(d) {
    var cluster = clusters[d.cluster],
        k = 1;

    // For cluster nodes, apply custom gravity.
    if (cluster === d) {
      cluster = {x: width / 2, y: height / 2, radius: -d.radius};
      k = .1 * Math.sqrt(d.radius);
    }

    var x = d.x - cluster.x,
        y = d.y - cluster.y,
        l = Math.sqrt(x * x + y * y),
        r = d.radius + cluster.radius;
    if (l != r) {
      l = (l - r) / l * alpha * k;
      d.x -= x *= l;
      d.y -= y *= l;
      cluster.x += x;
      cluster.y += y;
    }
  };
}

// Resolves collisions between d and all other circles.
function collide(alpha) {
  var quadtree = d3.geom.quadtree(nodes);
  return function(d) {
    var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
        nx1 = d.x - r,
        nx2 = d.x + r,
        ny1 = d.y - r,
        ny2 = d.y + r;
    quadtree.visit(function(quad, x1, y1, x2, y2) {
      if (quad.point && (quad.point !== d)) {
        var x = d.x - quad.point.x,
            y = d.y - quad.point.y,
            l = Math.sqrt(x * x + y * y),
            r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
        if (l < r) {
          l = (l - r) / l * alpha;
          d.x -= x *= l;
          d.y -= y *= l;
          quad.point.x += x;
          quad.point.y += y;
        }
      }
      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    });
  };
}