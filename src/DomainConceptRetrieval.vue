<template>
  <div id="DCR">
    <div id="content">
      <h1 id="title" style="text-align: center">Concept Graph Extraction</h1>
      <div id="intro" ><span style="font-weight: bold">Tips:</span> The Concept Graph Extractor can extracte concepts and relations between them from the text you input. And three formats are currently supported, which are plain text, java code and html code.
        Press the Extract-Entity button when you fill the editor and choose the correct format. Then it will return nodes(concepts), relations and a graph.
      </div>
      <div id="radio_g">
        <el-radio-group v-model="radio">
          <el-radio-button label="Plain Text"></el-radio-button>
          <el-radio-button label="Java Code"></el-radio-button>
          <el-radio-button label="Html Code"></el-radio-button>
        </el-radio-group>
      </div>
      <div id="input_frame">
        <div class="codemirror">
          <codemirror ref="myCm" v-model="text" :options="cmOptions"></codemirror>
        </div>
        <el-button id="example" type="warning" @click="example">Plain Text Example</el-button>
        <el-button id="extract" type="success" @click="extract">Extract Concept</el-button>
      </div>
      <div id="Entity" v-show="show">
        <h5>Nodes</h5>
        <div id="nodes">
          <span>{{terms}}</span>
        </div>
        <h5>Relations</h5>
        <div id="relations">
          <span>{{relations}}</span>
        </div>
        <div>
          <h5 v-show="nodes.length > 0">Graph</h5>
          <div id='graph' class="x" v-show="nodes.length > 0">
            <canvas ref="canvas"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GraphData from './forceGraph'
import axios from 'axios'
import {codemirror, CodeMirror} from 'vue-codemirror'
import * as d3 from 'd3'
// language js
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/closetag.js'

// import 'codemirror/mode/java/java.js'
// theme css

import 'codemirror/theme/base16-dark.css'
import 'codemirror/theme/paraiso-light.css'

export default {
  name: 'DomainConceptRetrieval',
  components: {GraphData, codemirror, CodeMirror},
  data () {
    // const text = `const bbb = 222;\nconst ccc = 111;\neee fff ggg`
    return {
      radio: 'Plain Text',
      text: '',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'text/html',
        theme: 'paraiso-light',
        lineNumbers: true,
        line: true,
        lineWrapping: true,
        autoCloseTags: true
        // more codemirror options, 更多 codemirror 的高级配置...
      },
      edges: [],
      nodes: [],
      relations: 'None',
      terms: 'None',
      graph: null,
      width: null,
      height: null,
      strength: -60,
      link_distance: 90,
      e: null,
      getIterator: -1,
      show: false
    }
  },
  methods: {
    onCmReady (cm) {
      console.log('the editor is readied!', cm)
    },
    onCmFocus (cm) {
      console.log('the editor is focus!', cm)
    },
    onCmCodeChange (newCode) {
      console.log('this is new code', newCode)
      this.text = newCode
    },
    example () {
      this.text = 'StringBuffer class is a thread-safe mutable sequence of characters. A StringBuffer is like a string, but can be modified. '
    },
    extract () {
      let _this = this
      _this.show = true
      this.nodes.length = 0
      this.edges.length = 0
      this.terms = 'None'
      this.relations = 'None'
      console.log(this.text)
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/entityRetrieval/extractTextEntity/', {text: this.text, flag: this.radio})
        .then(response => {
          if (response.data.terms.length > 0) {
            _this.terms = ''
            response.data.terms.forEach(function (d, index) {
              _this.terms += '"' + d + '", '
              let node = {}
              node.id = index + 1
              node.name = d.toLowerCase()
              _this.$set(_this.nodes, _this.nodes.length, node)
            })
          }
          if (response.data.relations.length > 0) {
            _this.relations = ''
            response.data.relations.forEach(function (d, index) {
              let edge = {}
              edge.id = index + 1
              edge.name = d[1].toLowerCase()
              let flag = false
              _this.nodes.forEach(function (node, index) {
                if (d[2] === node.name) {
                  edge.target = node.id
                  flag = true
                }
                if (d[0] === node.name) {
                  edge.source = node.id
                }
              })
              // edge.target = _this.nodes.findIndex(d[2])
              // edge.source = _this.nodes.findIndex(d[0])
              if (flag === true) {
                _this.relations += '(' + d[0] + ', ' + d[1] + ', ' + d[2] + '), '
                _this.$set(_this.edges, _this.edges.length, edge)
              }
            })
          }
          console.log(this.nodes)
          console.log(this.edges)
          console.log(response)
          this.force_graph_init()
        })
        .catch(error => console.log(error))
    },
    force_graph_init () {
      var canvas = document.querySelector('canvas')
      canvas.width = document.querySelector('#Entity').offsetWidth
      canvas.height = canvas.width / 1.8
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
      this.show_graph = true
    },
    restart () {
      this.graph.alpha(1)
      this.run()
    }
  },
  computed: {
    codemirror () {
      return this.$refs.myCm.codemirror
    }
  },
  watch: {
    radio (val) {
      console.log(val)
      if (val === 'Plain Text') this.cmOptions.mode = 'text/plain'
      else if (val === 'Java Code') this.cmOptions.mode = 'text/x-java'
      else if (val === 'Html Code') this.cmOptions.mode = 'text/html'
      console.log(this.cmOptions.mode)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>
#content{

}
#title{
  margin-top: 40px;
  margin-bottom: 40px;
  color: #5F6368;
}
#intro{
  width: 900px;
  margin: 20px auto 20px auto;
  color: #5F6368;
  background-color: #f5f6fc;
  border-radius: 5px;
  padding: 20px 20px;
}
#input_frame{
  width: 900px;
  margin: 20px auto 0 auto;
}
.codemirror{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  /*height: 300px;*/
}
#nodes{
  margin: 20px auto;
  background-color: #409EFF;
  color: white;
  border-radius: 5px;
  padding: 20px 20px;
}
#relations{
  margin: 20px auto;
  padding: 20px 20px;
  background-color: #909399;
  color: white;
  border-radius: 5px;
}
#graph{
  margin: 20px auto 20px auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
#Entity{
  width: 900px;
  margin: 20px auto;
}
#extract{
  margin-top: 20px;
  margin-bottom: 20px;
}
#radio_g{
  margin: 10px auto;
  width: 900px;
}
</style>
