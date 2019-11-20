<template>
  <div style="width: 100%; height: 100%;">
    <h1  id="title" style="text-align: center;margin-top: 25px;">
      <router-link style="color: #00162be6;" to="/">
        {{title}}
      </router-link>
    </h1>
    <a href="http://bigcode.fudan.edu.cn/kg/index.html#/" style="text-decoration:none;">
      <el-button id="recently_apis" icon="el-icon-s-home" type="primary" style="position: absolute;left: 11px;top: 16px;z-index: 10000;padding: 12px;" plain>Back to Home</el-button>
    </a>
    <el-button type="primary" style="position: fixed;right: 11px;top: 16px;z-index: 10000;" plain @click="display_labels" v-show="!drawer">Labels</el-button>
    <el-drawer
      title="These are our labels, and you can click on any of them to see a random example."
      :visible.sync="drawer">
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="6"><div class="grid-content" style="background-color: #409EFF;">package</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #E6A23C;">class</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #67C23A;">method</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #faafc2;">interface</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="6"><div class="grid-content" style="background-color: #fcea7e;">field</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #fa5f86;">parameter</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #c9d96f;">value</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #ff004d;">sentence</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="6"><div class="grid-content" style="background-color: #70edee;">entity</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #00ffbe;">wikidata</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #004dff;">operation</div></el-col>
        <el-col :span="6"><div class="grid-content" style="background-color: #abff00;">type</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="8"><div class="grid-content" style="background-color: #ffc766;">construct method</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #405f9e;">enum class</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #a5abb6;">annotation class</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="8"><div class="grid-content" style="background-color: #6dce9e;">return value</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #ced2d9;">enum constants</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #e84646;">primary type</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="8"><div class="grid-content" style="background-color: #47991f;">filed of class</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #b88cbb;">domain term</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #ff0086;">code element</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="8"><div class="grid-content" style="background-color: #f2baf6;">exception class</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #ff928c;">error class</div></el-col>
        <el-col :span="8"><div class="grid-content" style="background-color: #78cecb;">xml attribute</div></el-col>
      </el-row>
      <el-row :gutter="20" style="width: 98%;text-align: center;margin: 0px auto 27px;">
        <el-col :span="12"><div class="grid-content" style="background-color: #fcda19;">exception condition</div></el-col>
        <el-col :span="12"><div class="grid-content" style="background-color: #797b80;">base override method</div></el-col>
      </el-row>
    </el-drawer>
    <div id='neo4jd3' v-loading="loading">
    </div>
  </div>
</template>

<script>
import { Neo4jD3 } from './neo4j'
import axios from 'axios'

export default {
  name: 'showElementsGraph',
  props: {
    extend: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      drawer: false,
      title: '',
      loading: true,
      nodeData: {},
      neo4jd3: null,
      nodes: [],
      edges: [],
      id: null,
      startData: {}
    }
  },
  methods: {
    display_labels () {
      this.drawer = true
    },
    init_single () {
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getNodeByID/', {id: this.id})
        .then(response => {
          this.init()
        })
        .catch(error => console.error(error))
    },
    init_extend () {
      this.loading = true
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/expandNode/', {id: this.id})
        .then(response => {
          console.log(response)
          for (let i in response.data.nodes) {
            if (this.id == response.data.nodes[i].id) {
              this.title = response.data.nodes[i].name

              // 记录最近访问的api
              let storage=window.localStorage;
              let name_and_id = this.title  + "::" + this.id
              console.log(name_and_id)
              let storage_array = storage["recent_apis"].split(":!:")
              let index = storage_array.indexOf(name_and_id)
              if (index >= 0) {
                storage_array.splice(index, 1)
              }
              storage_array.unshift(name_and_id)
              storage_array = storage_array.slice(0,51)
              storage["recent_apis"] = storage_array.join(":!:")
              console.log(storage)
              break
            }
          }
          response.data.relations.forEach((relation) => {
            if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
              let edge = {}
              edge.end_id = relation.end_id
              edge.start_id = relation.start_id
              edge.target = relation.end_id
              edge.source = relation.start_id
              edge.id = relation.id
              edge.type = relation.name
              edge.properties = relation.properties
              this.$set(this.edges, this.edges.length, edge)
            }
            // let edge = {}
            // edge.end_id = relation.end_id
            // edge.start_id = relation.start_id
            // edge.target = relation.end_id
            // edge.source = relation.start_id
            // edge.id = relation.id
            // edge.type = relation.name
            // edge.properties = relation.properties
            // this.$set(this.edges, this.edges.length, edge)
          })
          response.data.nodes.forEach((relatedNode) => {
            // let node = relatedNode.nodes
            // this.$set(this.nodes, this.nodes.length, relatedNode)
            if(relatedNode.labels.indexOf("type") >= 0 && relatedNode.labels[1] != undefined) {
              relatedNode.labels[0] = relatedNode.labels[1]
            }
            if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
              this.$set(this.nodes, this.nodes.length, relatedNode)
            }
          })
          // this.neo4jd3.cleanGraph()
          console.log('nodes')
          console.log(this.nodes)
          console.log('edges')
          console.log(this.edges)
          this.startData = {'nodes': this.nodes, 'relationships': this.edges}
          console.log(this.startData)
          // this.neo4jd3.updateWithD3Data(this.startData)
          this.init()
          this.loading = false
        })
        .catch(error => console.error(error))
    },
    init () {
      let _this = this
      this.neo4jd3 = new Neo4jD3('#neo4jd3', {
        D3Data: this.startData,
        icons: {
        },
        images: {
        },
        minCollision: 60,
        nodeRadius: 25,
        onNodeDoubleClick: function (node) {
          // 可以将双击扩展事件取消掉
          _this.get_expand_node(node.id)
        },
        onRelationshipDoubleClick: function (relationship) {
          console.log('double click on relationship: ' + JSON.stringify(relationship))
        }
      })
    },
    get_expand_node (id) {
      this.loading = true
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/expandNode/', {id: id})
        .then(response => {
          console.log(response)
          let edges = []
          let nodes = []
          response.data.relations.forEach((relation) => {
            if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
              let edge = {}
              edge.end_id = relation.end_id
              edge.start_id = relation.start_id
              edge.target = relation.end_id
              edge.source = relation.start_id
              edge.id = relation.id
              edge.type = relation.name
              edge.properties = relation.properties
              edges.push(edge)
              this.$set(this.edges, this.edges.length, edge)
            }
          })
          response.data.nodes.forEach((relatedNode) => {
            // let node = relatedNode.nodes
            if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
              nodes.push(relatedNode)
              this.$set(this.nodes, this.nodes.length, relatedNode)
            }
          })
          // this.neo4jd3.cleanGraph()
          console.log('nodes')
          console.log(this.nodes)
          console.log('edges')
          console.log(this.edges)
          // this.startData = {'nodes': this.nodes, 'relationships': this.edges}
          // this.neo4jd3.updateWithD3Data(this.startData)
          // this.init()
          this.neo4jd3.updateWithD3Data({'nodes': nodes, 'relationships': edges})
          this.loading = false
        })
        .catch(error => console.log(error))
    }
  },
  mounted () {
    if (this.extend === true) {
      this.init_extend()
    } else {
      this.init_single()
    }
    // this.get_expand_node(this.id)
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
  a:hover{
    text-decoration: none;
  }
  .grid-content {
    border-radius: 6px;
    height: 40px;
    line-height: 40px;
    box-shadow: 2px 3px 4px rgba(0,0,0,.3);
  }
#neo4jd3{
  height: 92%;
  width: 92%;
  margin: 30px auto 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  background-color: #f5f6fc;
  border-radius: 25px;
}
.neo4jd3 {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.neo4jd3-graph {
  border: 1px solid #ddd;
  border-radius: 5px;
}

.neo4jd3-info {
  font-size: 16px;
  padding: 10px;
  position: absolute;
}
.neo4jd3-info a {
  border: 1px solid;
  display: inline-block;
  font-size: 14px;
  line-height: 1.428571429;
  margin-left: 5px;
  margin-top: 5px;
  padding: 6px 12px;
}
.neo4jd3-info a.class {
  color: white;
}
.neo4jd3-info a.property {
  background-color: #fff;
  border-color: #ccc;
  color: #333;
}
.neo4jd3-info a.btn {
  margin-left: 5px;
  margin-top: 5px;
  opacity: 1;
}
.neo4jd3-info a.info {
  background-color: #a5abb6;
  border: 1px solid #9aa1ac;
  color: white;
}

.node.node-highlighted .ring {
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=50)';
  filter: alpha(opacity=50);
  opacity: .5;
  stroke: #888;
  stroke-width: 12px;
}
.node .outline {
  cursor: pointer;
  fill: #a5abb6;
  pointer-events: all;
  stroke: #9aa1ac;
  stroke-width: 2px;
}
.node .ring {
  fill: none;
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
  filter: alpha(opacity=0);
  opacity: 0;
  stroke: #6ac6ff;
  stroke-width: 8px;
}
.node .text.icon {
  font-family: FontAwesome;
}

.node.selected .ring,
.node:hover .ring {
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=30)';
  filter: alpha(opacity=30);
  opacity: .3;
}

.relationship {
  cursor: default;
}
.relationship line {
  stroke: #aaa;
}
.relationship .outline {
  cursor: default;
}

.relationship .overlay {
  cursor: default;
  fill: #6ac6ff;
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=0)';
  filter: alpha(opacity=0);
  opacity: 0;
}
.relationship text {
  cursor: default;
}

.relationship.selected .overlay,
.relationship:hover .overlay {
  -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=30)';
  filter: alpha(opacity=30);
  opacity: .3;
}

svg {
  cursor: move;
}
</style>
