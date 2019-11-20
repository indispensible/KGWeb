<template>
    <div id='graph_canvas' class="x" v-loading="loading">
      <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import * as d3 from 'd3'
import axios from 'axios'

export default {
  name: 'graphData',
  props: {
    graphData: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      nodes: [],
      edges: [],
      graph: null,
      width: null,
      height: null,
      strength: -60,
      link_distance: 90,
      e: null,
      getIterator: -1,
      loading: true
    }
  },
  methods: {
    // getId () {
    //   this.id = this.$route.params.id
    // },
    getNodeRelation (id) {
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/expandNode/', {id: id})
        .then(response => {
          console.log(response)
          this.nodes = []
          this.edges = []
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
          this.force_graph_init()
        })
        .catch(error => console.log(error))
    },
    // graph init
    force_graph_init () {
      var canvas = document.querySelector('canvas')
      canvas.width = document.querySelector('#graph').offsetWidth
      canvas.height = canvas.width / 1.5
      this.e = canvas.getContext('2d')
      this.width = canvas.width
      this.height = canvas.height
      this.graph = d3.forceSimulation(this.nodes).force('center', d3.forceCenter(this.width / 2, this.height / 2))
      this.graph.force('charge', d3.forceManyBody())
        .force('collide', d3.forceCollide(this.width / 20))
        .force('link', d3.forceLink().id(d => { return d.id }).distance(this.link_distance))
      this.graph.on('tick', this.render)
      this.graph.force('link').links(this.edges)
      this.initDrag()
      this.restart()
      this.loading = false
    },
    // create canvas
    render () {
      if (document.querySelector('canvas') !== null) {
        this.e = document.querySelector('canvas').getContext('2d')
        this.e.clearRect(0, 0, this.width, this.height)
        this.e.lineWidth = 1
        this.e.strokeStyle = 'black'
        this.e.beginPath()
        this.edges.forEach(a => {
          // this.e.strokeStyle = this.label2color(a.label)
          this.e.moveTo(a.source.x, a.source.y)
          this.e.lineTo(a.target.x, a.target.y)
          this.e.stroke()
        })
        this.e.lineWidth = 3
        this.e.strokeStyle = 'white'
        this.nodes.forEach(a => {
          this.e.fillStyle = 'red'
          this.e.beginPath()
          // 起始点坐标，圆的半径，起始角，弧度值
          this.e.arc(a.x, a.y, this.width / 45, 0, 2 * Math.PI)
          this.e.fill()
          this.e.stroke()
        })
        this.e.font = '14px Comic Sans MS'
        this.e.fillStyle = 'black'
        this.e.textAlign = 'center'
        this.nodes.forEach(a => {
          this.e.fillText(a.name, a.x, a.y + 2.5 * 2)
        })
      }
    },
    // set line color
    label2color (label) {
      if (label[0] === 'Software Concept') return 'blue'
      if (label[0] === 'has cname') return 'black'
    },
    // init drag action
    initDrag () {
      let canvas = document.querySelector('canvas')
      d3.select(canvas).call(
        d3.drag().container(canvas)
          .subject(this.find_subject)
          .on('start', this.start_drag).on('drag', this.drag_effect).on('end', this.end_drag))
    },
    // get the focused circle
    find_subject () {
      return this.graph.find(d3.event.x, d3.event.y)
    },
    start_drag () {
      d3.event.active || this.graph.alphaTarget(0.3).restart()
      d3.event.subject.fx = d3.event.subject.x
      d3.event.subject.fy = d3.event.subject.y
    },
    drag_effect () {
      d3.event.subject.fx = d3.event.x
      d3.event.subject.fy = d3.event.y
    },
    end_drag () {
      d3.event.active || this.graph.alphaTarget(0)
      d3.event.subject.fx = null
      d3.event.subject.fy = null
    },
    run () {
      this.graph.restart()
    },
    restart () {
      this.graph.alpha(1)
      this.run()
    }
  },
  mounted () {
    // this.getNodeData(this.id)
    console.log(this.graphData)
    this.getNodeRelation(this.graphData)
    // this.force_graph_init()
  },
  watch: {
    graphData: function (val) {
      console.log(val)
      this.getNodeRelation(val.id)
    },
    '$route': function () {
      this.graphData = this.$route.params.id
      this.getNodeRelation(this.graphData)
    }
  }
}
</script>

<style scoped>
#graph_canvas {
  margin: 20px auto;
}
</style>
