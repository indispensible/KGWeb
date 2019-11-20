new Vue({
    el: '#app',
    data () {
      return {
        package_list: [],
        class_list: [],
        method_list: [],
        circle2: null
      }
    },
    methods: {
        display_package () {
            let _this = this
            let width = document.body.clientWidth * 0.46,
                height = window.screen.height * 0.85,
                padding = 2.5, // separation between same-color circles
                clusterPadding = 7, // separation between different-color circles
                maxRadius = 12;

            let n = 200, // total number of circles
                m = 10; // number of distinct clusters

            let color = d3.scale.category10()
                .domain(d3.range(m));

            // The largest node for each cluster.
            let clusters = new Array(m);

            let nodes = d3.range(n).map(function() {
            let i = Math.floor(Math.random() * m),
                r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
                d = {cluster: i, radius: r};
            if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
                return d;
            });

            let force = d3.layout.force()
                .nodes(nodes)
                .size([width, height])
                .gravity(0)
                .charge(0)

            let svg = d3.select("#package").append("svg")
                .attr("width", width)
                .attr("height", height);

            let circle1 = svg.selectAll("circle")
                .data(nodes)
                .enter().append("circle")
            console.log(circle1.__proto__)
            circle1.attr("r", function(d) { return d.radius; })
                .style("fill", function(d) { return color(d.cluster); })
                .call(force.drag);

            circle1.__proto__ = circle1.__proto__.__proto__    
            _this.circle2 = circle1
            console.log(circle1.__proto__.__proto__)
            console.log(_this.circle2)
            force.on("tick", this.tick)
            // force.on("tick", function(e){
            //     _this.circle2
            //         .each(_this.cluster(10 * e.alpha * e.alpha))
            //         .each(_this.collide(.5))
            //         .attr("cx", function(d) { return d.x; })
            //         .attr("cy", function(d) { return d.y; });})
            .start();


            // let circle = svg.selectAll("circle")
            //     .data(nodes)
            //     .enter().append("circle")
            //     .attr("r", function(d) { return d.radius; })
            //     .style("fill", function(d) { return color(d.cluster); })
            //     .call(force.drag);
            // _this.circle = circle
            // console.log(_this.circle)
        },
        tick(e) {
            let _this = this
            // console.log(_this.circle)
            _this.circle2
                .each(_this.cluster(10 * e.alpha * e.alpha))
                .each(_this.collide(.5))
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        },
        cluster(alpha) {
            return function(d) {
                let cluster = clusters[d.cluster], k = 1;
            
                // For cluster nodes, apply custom gravity.
                if (cluster === d) {
                cluster = {x: width / 2, y: height / 2, radius: -d.radius};
                k = .1 * Math.sqrt(d.radius);
                }
            
                let x = d.x - cluster.x,
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
        },
        collide(alpha) {
            let quadtree = d3.geom.quadtree(nodes);
            return function(d) {
              let r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                  nx1 = d.x - r,
                  nx2 = d.x + r,
                  ny1 = d.y - r,
                  ny2 = d.y + r;
              quadtree.visit(function(quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                  let x = d.x - quad.point.x,
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
    },
    mounted () {
      this.$nextTick(function () {
        let _this = this
        // _this.display_package()
      })
    }
  })