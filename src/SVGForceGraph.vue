<template>
    <div id="graph" class="container">
      <div id="svg_graph" v-loading="loading"></div>
    </div>
</template>

<script>
import axios from 'axios'
import * as d3 from 'd3'
import { Notification } from 'element-ui'
// import '../assets/labelCorlor.js'

export default {
  name: 'SVGForceGraph',
  // props: {
  //   SVG_graphData: {
  //     type: String,
  //     default: '0'
  //   }
  // },
  data () {
    return {
      id: 0,
      nodes: [],
      edges: [],
      simulation: null,
      svg: null,
      g: null,
      link_distance: 90,
      nodeGroup: null,
      lineGroup: null,
      textGroup: null,
      loading: true
    }
  },
  methods: {
    getNodeRelation (id) {
      axios
        .post('http://bigcode.fudan.edu.cn/kg-debug/expandNode/', {id: id})
        .then(response => {
          response.data.relations.forEach((relation) => {
            let edge = {}
            edge.target = relation.end_id
            edge.source = relation.start_id
            edge.id = relation.id
            edge.name = relation.name
            this.$set(this.edges, this.edges.length, edge)
          })
          response.data.nodes.forEach((relatedNode) => {
            let node = {}
            node.id = relatedNode.id
            node.name = relatedNode.name
            node.labels = relatedNode.labels
            this.$set(this.nodes, this.nodes.length, node)
          })
          console.log('nodes')
          console.log(this.nodes)
          console.log('edges')
          console.log(this.edges)
          this.updateGraph()
        })
        .catch(error => console.log(error))
    },
    force_graph_init () {
      this.width = 800
      this.height = 600
      // init svg
      this.svg = d3.select('#svg_graph')
        .append('svg')
        .attr('width', this.width)
        .attr('height', this.height)
        // .call(d3.zoom()
        //   .scaleExtent([-5, 2])
        //   // for zoom transform
        //   .on('zoom', this.zoom_actions))
      this.g = this.svg.append('g').attr('class', 'svg_graph_container')
      // init links
      this.simulation = d3.forceSimulation().force('center', d3.forceCenter(this.width / 2, this.height / 2))
      this.simulation.force('charge', d3.forceManyBody().strength(-90))
        .force('collide', d3.forceCollide(2 * 9))
        .force('link', d3.forceLink().id(d => { return d.id }).distance(this.link_distance))
      this.nodeGroup = this.g.append('g').attr('class', 'node')
      this.lineGroup = this.g.append('g').attr('class', 'line')
      this.textGroup = this.g.append('g').attr('class', 'text')
      // this.sim.force('link').links(this.edges)
      // this.svg_links = this.g.append('g')
      //   .attr('class', 'edges')
      //   .selectAll('line')
      //   .data(this.edges)
      //   .enter()
      //   .append('line')
      //   .attr('stroke', 'black')
      //   .attr('stroke-width', 2)
      // this.svg_nodes = this.g.append('g').attr('class', 'nodes')
      // this.nodes.forEach(node => {
      //   this.svg_nodes.append('g')
      //     .attr('class', 'node')
      //     .attr('node_id', node.id)
      //     .data(node)
      //     .enter()
      //     .append('circle')
      //     .attr('r', '21')
      //     .style('fill', function (d) {
      //       switch (d.labels[0]) {
      //         case 'Software Concept': return '#1e88e4'
      //         case 'Descriptive Knowledge': return '#4DCF74'
      //         case 'API Concept': return '#BFD0E0'
      //         case 'API Package': return '#E9B872'
      //         case 'API Class': return '#3CBBB1'
      //         case 'API Interface': return '#DD1C1A'
      //         case 'API Field': return '#6369D1'
      //         case 'API Method': return '#105C38'
      //         case 'API Parameter': return '#454C63'
      //         case 'API Return Value': return '#B84569'
      //         case 'Exception': return '#7697C2'
      //       }
      //       console.log(this.labelColor(d.labels[0]))
      //       // return 'red'
      //     })
      //     .style('stroke', '#D1D1D1')
      //     .style('stroke-width', 2)
      //     .call(
      //       d3.drag()
      //         .on('start', this.start_drag)
      //         .on('drag', this.drag_effect)
      //         .on('end', this.end_drag)
      //     )
      // })
      // this.svg_nodes = this.g.append('g')
      //   .attr('class', 'nodes')
      //   .selectAll('circle')
      //   .data(this.nodes)
      //   .enter()
      //   .append('circle')
      //   .attr('r', '21')
      //   .attr('node_id', function (d) {
      //     return d.id
      //   })
      //   .style('fill', function (d) {
      //     switch (d.labels[0]) {
      //       case 'Software Concept': return '#1e88e4'
      //       case 'Descriptive Knowledge': return '#4DCF74'
      //       case 'API Concept': return '#BFD0E0'
      //       case 'API Package': return '#E9B872'
      //       case 'API Class': return '#3CBBB1'
      //       case 'API Interface': return '#DD1C1A'
      //       case 'API Field': return '#6369D1'
      //       case 'API Method': return '#105C38'
      //       case 'API Parameter': return '#454C63'
      //       case 'API Return Value': return '#B84569'
      //       case 'Exception': return '#7697C2'
      //     }
      //     console.log(this.labelColor(d.labels[0]))
      //     // return 'red'
      //   })
      //   .style('stroke', '#D1D1D1')
      //   .style('stroke-width', 2)
      //   .call(
      //     d3.drag()
      //       .on('start', this.start_drag)
      //       .on('drag', this.drag_effect)
      //       .on('end', this.end_drag)
      //   )
      // this.svg_texts = this.g.append('g')
      //   .attr('class', 'SVGtext')
      //   .selectAll('text')
      //   .data(this.nodes)
      //   .enter()
      //   .append('text')
      //   .style('fill', 'black')
      //   .attr('dx', 0)
      //   .attr('dy', 7)
      //   .style('font-family', 'Raleway')
      //   .attr('pointer-events', 'none')
      //   .attr('text-anchor', 'middle')
      //   .text(function (d) {
      //     return d.name
      //   })
      // this.sim.on('tick', this.ticked)
      // this.loading = false
    },
    drawNode (node) {
      let _this = this
      let nodeEnter = node.enter().append('circle')
      nodeEnter.attr('r', function (d) {
        return 30
      })
      nodeEnter.attr('fill', function (d) {
        return _this.labelColor(d.labels[0])
      })
      nodeEnter.style('opacity', 0.8)
      nodeEnter.style('stroke', function (d) {
        return '#ff4500'
      })
      nodeEnter.style('stroke-opacity', 0.6)
      nodeEnter.append('title').text(function (d) {
        return d.name
      })
      nodeEnter.on('click', function (d) {
        Notification({
          title: d.name,
          dangerouslyUseHTMLString: true,
          message: '<span class="node_tag" style=" color: ' + '#1e88e4' + ' ">' + d.labels[0] + '</span><br>' +
            '<a href="/KnowledgeData/ ' + d.id + '">ID: ' + d.id + '</a><br>'
          // duration: 0
        })
      })
      nodeEnter.on('dblclick', function (d) {
        let id = d.id
        _this.loading = true
        axios
          .post('http://bigcode.fudan.edu.cn/kg-debug/expandNode/', {id: id})
          .then(response => {
            for (let i = 0; i < response.data.relations.length; i++) {
              let relation = response.data.relations[i]
              if (_this.edges.find(function (x) { return x.id === relation.id })) {
                continue
              }
              let edge = {}
              edge.target = relation.end_id
              edge.source = relation.start_id
              edge.id = relation.id
              edge.name = relation.name
              _this.$set(_this.edges, _this.edges.length, edge)
            }
            for (let i = 0; i < response.data.nodes.length; i++) {
              let relatedNode = response.data.nodes[i]
              if (_this.nodes.find(function (x) { return x.id === relatedNode.id })) continue
              let node = {}
              node.id = relatedNode.id
              node.name = relatedNode.name
              node.labels = relatedNode.labels
              _this.$set(_this.nodes, _this.nodes.length, node)
            }
            _this.updateGraph()
            _this.loading = false
          })
          .catch(error => console.log(error))
      })
      // nodeEnter.on('dblclick', function (d) {
      //   this.$router.push({name: 'SVGForceGraph', params: { id: d.id }})
      // })
      nodeEnter.call(d3.drag()
        .on('start', _this.start_drag)
        .on('drag', _this.drag_effect)
        .on('end', _this.end_drag))
      return nodeEnter
    },
    drawLine (link) {
      // let _this = this
      let linkEnter = link.enter().append('line')
        .attr('id', function (d) {
          return d.id
        })
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
      return linkEnter
    },
    drawText (nodetext) {
      let nodetextEnter = nodetext.enter().append('text')
        .style('fill', '#000')
        .attr('dy', 4)
        .attr('text-anchor', 'middle')
        .text(function (d) {
          let te = d.name
          let teList = te.split('.')
          return teList[teList.length - 1]
        })
      return nodetextEnter
    },
    updateGraph () {
      let _this = this
      let nodes = this.nodes
      // update node
      let node = _this.nodeGroup.selectAll('circle').data(nodes, function (d) {
        return d
      })
      node.exit().remove()
      let nodeEnter = _this.drawNode(node)
      node = nodeEnter.merge(node).text(function (d) {
        return d.name
      })
      // update line
      let links = _this.edges
      let link = _this.lineGroup.selectAll('.line >path').data(links, function (d) {
        return d.id
      })
      link.exit().remove()
      let linkEnter = _this.drawLine(link)
      link = linkEnter.merge(link)
      // update node text
      let nodetext = _this.textGroup.selectAll('text').data(nodes, function (d) {
        return d.id
      })
      nodetext.exit().remove()
      let nodeTextEnter = _this.drawText(nodetext)
      nodetext = nodeTextEnter.merge(nodetext).text(function (d) {
        return d.name
      })
      nodetext.append('title').text(function (d) {
        return d.name
      })
      // simulation
      _this.simulation.nodes(nodes).on('tick', ticked)
      _this.simulation.force('link').links(links)
      _this.simulation.alphaTarget(0).restart()
      _this.loading = false
      function ticked () {
        // update line position
        link
          .attr('x1', function (d) { return d.source.x })
          .attr('y1', function (d) { return d.source.y })
          .attr('x2', function (d) { return d.target.x })
          .attr('y2', function (d) { return d.target.y })
        node
          .attr('cx', function (d) { return d.x })
          .attr('cy', function (d) { return d.y })
        nodetext
          .attr('x', function (d) { return d.x })
          .attr('y', function (d) { return d.y })
      }
      // handle event
      // stop svg zoom after double click
      _this.g.on('dblclick.zoom', null)
      // svg zoom using mouse
      _this.g.call(d3.zoom().transform, d3.zoomIdentity)
      // let svgNode = this.svg_nodes.selectAll('circle').data(this.nodes, d => d)
      // svgNode.exit().remove()
      // this.svg_nodes = svgNode
      // // svgNode.exit().remove()
      // console.log(this.nodes)
      // let nodeEnter = svgNode
      //   .enter()
      //   .append('circle')
      //   .attr('r', '21')
      //   .attr('node_id', function (d) {
      //     return d.id
      //   })
      //   .style('fill', function (d) {
      //     switch (d.labels[0]) {
      //       case 'Software Concept': return '#1e88e4'
      //       case 'Descriptive Knowledge': return '#4DCF74'
      //       case 'API Concept': return '#BFD0E0'
      //       case 'API Package': return '#E9B872'
      //       case 'API Class': return '#3CBBB1'
      //       case 'API Interface': return '#DD1C1A'
      //       case 'API Field': return '#6369D1'
      //       case 'API Method': return '#105C38'
      //       case 'API Parameter': return '#454C63'
      //       case 'API Return Value': return '#B84569'
      //       case 'Exception': return '#7697C2'
      //     }
      //     console.log(this.labelColor(d.labels[0]))
      //     // return 'red'
      //   })
      //   .style('stroke', '#D1D1D1')
      //   .style('stroke-width', 2)
      //   .call(
      //     d3.drag()
      //       .on('start', this.start_drag)
      //       .on('drag', this.drag_effect)
      //       .on('end', this.end_drag)
      //   )
      // this.svg_nodes = nodeEnter.merge(svgNode)
      // this.svg_links.selectAll('line')
      //   .data(this.edges)
      //   .enter()
      //   .append('line')
      //   .attr('stroke', 'black')
      //   .attr('stroke-width', 2)
      // this.svg_texts.selectAll('text')
      //   .data(this.nodes)
      //   .enter()
      //   .append('text')
      //   .style('fill', 'black')
      //   .attr('dx', 0)
      //   .attr('dy', 7)
      //   .style('font-family', 'Raleway')
      //   .attr('pointer-events', 'none')
      //   .attr('text-anchor', 'middle')
      //   .text(function (d) {
      //     return d.name
      //   })
    },
    // ticked () {
    //   this.svg_links
    //     .attr('x1', function (d) { return d.source.x })
    //     .attr('y1', function (d) { return d.source.y })
    //     .attr('x2', function (d) { return d.target.x })
    //     .attr('y2', function (d) { return d.target.y })
    //   this.svg_nodes
    //     .attr('cx', function (d) { return d.x })
    //     .attr('cy', function (d) { return d.y })
    //   this.g.selectAll('circle').on('click', function (d) {
    //     let id = d.id
    //     Notification({
    //       title: d.name,
    //       dangerouslyUseHTMLString: true,
    //       message: '<span class="node_tag" style=" color: ' + '#1e88e4' + ' ">' + d.labels[0] + '</span><br>' +
    //         '<a href="/KnowledgeData/ ' + id + '">ID: ' + id + '</a><br>',
    //       duration: 0
    //     })
    //   })
    //   this.svg.on('dblclick.zoom', null)
    //   let _this = this
    //   this.g.selectAll('circle').on('dblclick', function (d) {
    //     let id = d.id
    //     axios
    //       .post('http://bigcode.fudan.edu.cn/kg-debug/expandNode/', {id: id})
    //       .then(response => {
    //         for (let i = 0; i < response.data.relations.length; i++) {
    //           let relation = response.data.relations[i]
    //           if (_this.edges.find(function (d) { return d.id === relation.id })) {
    //             continue
    //           }
    //           let edge = {}
    //           edge.target = relation.end_id
    //           edge.source = relation.start_id
    //           edge.id = relation.id
    //           edge.name = relation.name
    //           _this.$set(_this.edges, _this.edges.length, edge)
    //         }
    //         for (let i = 0; i < response.data.nodes.length; i++) {
    //           let relatedNode = response.data.nodes[i]
    //           if (_this.nodes.find(function (d) { return d.id === relatedNode.id })) continue
    //           let node = {}
    //           node.id = relatedNode.id
    //           node.name = relatedNode.name
    //           node.labels = relatedNode.labels
    //           _this.$set(_this.nodes, _this.nodes.length, node)
    //         }
    //         _this.updateGraph()
    //       })
    //       .catch(error => console.log(error))
    //   })
    //   this.svg_texts
    //     .attr('x', function (d) { return d.x })
    //     .attr('y', function (d) { return d.y })
    // },
    // zoom_actions () {
    //   this.g.attr('transform', d3.event.transform)
    // },
    // get the focused circle
    start_drag () {
      d3.event.active || this.simulation.alphaTarget(0.3).restart()
      d3.event.subject.fx = d3.event.subject.x
      d3.event.subject.fy = d3.event.subject.y
    },
    drag_effect () {
      d3.event.subject.fx = d3.event.x
      d3.event.subject.fy = d3.event.y
    },
    end_drag () {
      d3.event.active || this.simulation.alphaTarget(0)
      d3.event.subject.fx = null
      d3.event.subject.fy = null
    },
    labelColor (node) {
      switch (node) {
        case 'Software Concept': return '#1e88e4'
        case 'Descriptive Knowledge': return '#4DCF74'
        case 'API Concept': return '#BFD0E0'
        case 'API Package': return '#E9B872'
        case 'API Class': return '#3CBBB1'
        case 'API Interface': return '#DD1C1A'
        case 'API Field': return '#6369D1'
        case 'API Method': return '#105C38'
        case 'API Parameter': return '#454C63'
        case 'API Return Value': return '#B84569'
        case 'Exception': return '#7697C2'
      }
    }
  },
  mounted () {
    this.getNodeRelation(this.id)
    this.force_graph_init()
  },
  created () {
    this.id = this.$route.params.id
  },
  watch: {
    '$route': function () {
      this.id = this.$route.params.id
    }
  }
}
</script>

<style scoped>
@import "assets/font/Raleway.css";
#ground{
  background-color: rgb(26, 172, 164);
}
.svg_graph_container{
  margin: 0 auto;
}
.node_tag{
  display: inline-block;
  height: 28px;
  line-height: 28px;
  border-radius: 3px;
  color: #fff !important;
  background-color: #1e88e4;
  padding: 0px 10px;
  white-space: nowrap;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}
</style>
