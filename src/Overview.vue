<template>
  <div style="width: 100%;height: 100%;">
<!--    <span>woowo</span>-->
<!--    <div style="width: 20px;display: inline-block;"></div>-->
<!--    <div style="text-align: center;"><h2 id="overview_h2" style="margin:20px 0px 0px 0px;">Overview</h2></div>-->
    <h1  id="title" style="text-align: center">
      <router-link style="color: #ffffff;" to="/">
        Overview
      </router-link>
    </h1>
    <div id='neo4jd3' v-loading="loading"></div>
    <div id="infoBox" v-loading="loadingInfoBox">
      <div id="deletePage" style="display: inline-block;width: 100%;border-radius: 20px;background-color: #f7f7f7;">
        <h4 id="qualified_name" style="text-align: center;margin: 2.5% auto;color: #000000;word-break: break-word;">{{qualified_name}}</h4>
        <div class="relate_api" style="margin: 5px auto 7px;width: 90%;background: #a3a3a3;padding: 10px;border-radius: 10px;" v-for="(item, index) in current_apis" :key="index">
          <div class="number">
            <span>{{current_number + index + 1}}</span>
          </div>
          <div style="display: inline-block;width: 84%">
            <div style="width: 100%;margin-bottom: 0.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
              <el-tooltip class="item" effect="dark" :content="item.qualified_name" placement="top">
                <h5 style="color: #000000;display: inline;">{{item.qualified_name}}</h5>
              </el-tooltip>
            </div>
<!--            <h5 style="color: #000000;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;" title="test">{{item.qualified_name}}</h5>-->
<!--            api difference-->
<!--            <el-tag effect="dark" @click="different(item.qualified_name)">different</el-tag>-->
            <router-link tag="a" target="_blank" :to="/ElementGraph/ + item.id"><el-tag effect="dark">graph</el-tag></router-link>
            <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id"><el-tag effect="dark">detail</el-tag></router-link>
            <el-tag effect="dark" @click="associated_concept(item.qualified_name)">associated concept</el-tag>
          </div>
        </div>
      </div>
      <div id="page" ref="page" style="margin: 0px auto;width: 100%;display: none;position: absolute;bottom: 0px;padding-top: 11px;">
        <el-pagination
          style="text-align: center;padding: 2px 0px;"
          @current-change="change_data"
          background
          layout="prev, pager, next"
          :page-size="page_size"
          :current-page="current_page"
          :total="all_relate_api_number">
        </el-pagination>
      </div>
    </div>
<!--    <div id="page" ref="page">-->
<!--      <el-pagination-->
<!--        style="text-align: center;padding: 2px 0px;"-->
<!--        @current-change="change_data"-->
<!--        background-->
<!--        layout="prev, pager, next"-->
<!--        :page-size="page_size"-->
<!--        :current-page="current_page"-->
<!--        :total="all_relate_api_number">-->
<!--      </el-pagination>-->
<!--    </div>-->
    <el-row :gutter="20" style="width: 90%;text-align: center;margin: 0px auto 27px;">
      <el-col :span="4"><div class="grid-content" style="background-color: #68bdf6;">package</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #6dce9e;">class</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #faafc2;">interface</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #f2baf6;">exception class</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #ff928c;">error class</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #fcea7e;">field</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 90%;margin: 0px auto 27px;text-align: center;">
      <el-col :span="4"><div class="grid-content" style="background-color: #ffc766;">construct method</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #405f9e;">enum class</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #a5abb6;">annotation class</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #78cecb;">xml attribute</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #b88cbb;">method</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #ced2d9;">enum constants</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 90%;margin: 0px auto 27px;text-align: center;">
      <el-col :span="4"><div class="grid-content" style="background-color: #e84646;">primary type</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #fa5f86;">parameter</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #ffab1a;">return value</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #fcda19;">exception condition</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #797b80;">base override method</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #c9d96f;">value</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 90%;margin: 0px auto 30px;text-align: center;">
      <el-col :span="4"><div class="grid-content" style="background-color: #47991f;">filed of class</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #70edee;">entity</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #00ffbe;">wikidata</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #02ff75;">domain term</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #004dff;">operation</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #ff0086;">code_element</div></el-col>
    </el-row>
    <el-row :gutter="20" style="width: 90%;margin: 0px auto 30px;text-align: center;">
      <el-col :span="4"><div class="grid-content" style="background-color: #ff004d;">sentence</div></el-col>
      <el-col :span="4"><div class="grid-content" style="background-color: #abff00;">type</div></el-col>
    </el-row>
  </div>
</template>

<script>
  import { Neo4jD3 } from './neo4j'
  import axios from 'axios'

  export default {
    name: 'Overview',
    props: {
      extend: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        loadingInfoBox: false,
        loading: true,
        nodeData: {},
        neo4jd3: null,
        nodes: [],
        edges: [],
        id: null,
        startData: {},
        qualified_name: "Please try to double click the point in the left graph.",
        current_apis: [],
        related_apis: [],
        all_relate_api_number: 100,
        current_page: 1,
        current_number: 0,
        page_size: 4,
        edgeId: 1000,
        nodeIds: []
      }
    },
    methods: {
      different (api_2_name) {
        let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html?api_1_name=" + this.qualified_name + "&api_2_name=" + api_2_name
        window.open(url, '_blank')
      },
      // detail (nodeId) {
      //   let url = "./KnowledgeData/" + nodeId
      //   // console.log(url)
      //   window.open(url, '_blank')
      // },
      associated_concept (name) {
        let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/associatedConcept.html?name=" + name
        window.open(url, '_blank')
      },
      first_get_data () {
        let number = 0
        this.$refs.page.style.display = ""
        this.current_number = 0
        this.all_relate_api_number = 0
        this.current_page = 1
        for(let index in this.related_apis){
          number += 1
        }
        this.all_relate_api_number = number
        this.loadingInfoBox = false
        if (number!=0) {
          this.$nextTick(function () {
            let infoBox = document.getElementById("infoBox")
            let infoBoxHeight = infoBox.clientHeight
            let qualified_name = document.getElementById("qualified_name")
            let qualified_name_height = qualified_name.clientHeight
            // let relate_api = document.getElementsByClassName("relate_api")[0]
            // let relate_api_height = relate_api.clientHeight
            let relate_api_height = 102
            let page = document.getElementById("page")
            let page_height = page.clientHeight
            // let page_height = 43
            this.page_size = Math.floor((infoBoxHeight - qualified_name_height - page_height) / relate_api_height)
            let deletePage = document.getElementById("deletePage")
            deletePage.style.height = infoBoxHeight - page_height + "px"
            // this.page_size = Math.floor((infoBoxHeight - qualified_name_height) / relate_api_height)

            this.current_apis = []
            if (number >= this.page_size) {
              for(let index in this.related_apis){
                // console.log(index)
                if (index >= this.page_size) {
                  break
                } else {
                  this.current_apis.push(this.related_apis[index])
                }
              }
            } else {
              for(let index in this.related_apis){
                this.current_apis.push(this.related_apis[index])
              }
            }
          })
        }
      },
      get_info_box (infoId) {
        this.loadingInfoBox = true
        this.qualified_name = ''
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/InfoBox/', {id: infoId})
          .then(response => {
            this.related_apis = response.data.related_apis
            this.qualified_name = response.data.qualified_name
            this.first_get_data()
            // console.log(this.nodes)
          })
          .catch(error => console.log(error))
      },
      change_data (val) {
        let _this = this
        let number = (val - 1) * this.page_size
        _this.$refs.page.style.display = ""
        _this.current_page = val
        _this.current_number = number
        _this.current_apis = []
        if (number + this.page_size> _this.all_relate_api_number) {
          let num = number
          for (let index = 0; index < _this.all_relate_api_number - num; index++) {
            _this.current_apis.push(_this.related_apis[number])
            number++
          }
        } else {
          for (let index = 0; index < this.page_size; index++) {
            _this.current_apis.push(_this.related_apis[number])
            number++
          }
        }
      },
      init_extend () {
        this.loading = true
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/PackageOverview/', {id: this.id})
          .then(response => {
            // let isChrome =  navigator.userAgent.indexOf('Chrome') > -1
            // // let neo4jd3 = document.getElementById("neo4jd3")
            // if (isChrome) {
            //   let neo4jd3 = document.getElementById("neo4jd3")
            //   let overview_h2 = document.getElementById("overview_h2")
            //   neo4jd3.style.marginLeft = "125px"
            //   neo4jd3.style.width = window.screen.width * 0.6 + "px"
            //   overview_h2.style.marginRight = window.screen.width * 0.045 + "px"
            // }
            // let neo4jd3 = document.getElementById("neo4jd3")
            // neo4jd3.style.width = window.screen.width * 0.65 + "px"
            console.log(response)
            // let edgeId = 1000
            response.data.relations.forEach((relation) => {
              // console.log(relation)
              if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
                this.edgeId += 1
                let edge = {}
                edge.end_id = relation[0]
                edge.start_id = relation[1]
                edge.target = relation[0]
                edge.source = relation[1]
                edge.id = this.edgeId
                edge.type = null
                edge.properties = null
                this.$set(this.edges, this.edges.length, edge)
              }
            })
            // let nodeNum = 0
            response.data.nodes.forEach((relatedNode) => {
              // let node = relatedNode.nodes
              // this.$set(this.nodes, this.nodes.length, relatedNode)
              if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
                if (this.nodeIds.indexOf(relatedNode.id) < 0){
                  this.nodeIds.push(relatedNode.id)
                  this.$set(this.nodes, this.nodes.length, relatedNode)
                }
                // nodeNum += 1
              }
            })
            // this.neo4jd3.cleanGraph()
            // console.log('nodes')
            // console.log(this.nodes)
            // console.log('edges')
            // console.log(this.edges)
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
            _this.get_expand_node(node.id)
            _this.get_info_box(node.id)
          },
          onRelationshipDoubleClick: function (relationship) {
            console.log('double click on relationship: ' + JSON.stringify(relationship))
          }
        })
      },
      get_expand_node (id) {
        this.loading = true
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/SelectDetail/', {id: id})
          .then(response => {
            console.log(response)
            let edges = []
            let nodes = []
            response.data.relations.forEach((relation) => {
              if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
                this.edgeId += 1
                let edge = {}
                edge.end_id = relation.end_id
                edge.start_id = relation.start_id
                edge.target = relation.end_id
                edge.source = relation.start_id
                edge.id = this.edgeId
                edge.type = relation.name
                edge.properties = relation.properties
                edges.push(edge)
                this.$set(this.edges, this.edges.length, edge)
              }
            })
            response.data.nodes.forEach((relatedNode) => {
              // let node = relatedNode.nodes
              if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
                // if (this.nodeIds)
                // this.$set(this.nodes, this.nodes.length, relatedNode)
                if (this.nodeIds.indexOf(relatedNode.id) < 0){
                  this.nodeIds.push(relatedNode.id)
                  this.$set(this.nodes, this.nodes.length, relatedNode)
                }
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
      this.$nextTick(function () {
        let divApp = document.getElementById("app")
        divApp.style.backgroundColor = "#00162d"
        let bodyApp = document.getElementById("body")
        bodyApp.style.backgroundColor = "#00162d"
        // 要运行
        this.init_extend()
        // 不用运行
        // this.get_info_box(887)
      })
    }
  }
</script>

<style scoped>
  .number{
    font-weight: 700;
    /*line-height: 100%;*/
    /*position: absolute;*/
    /*top: 5px;*/
    /*left: 0;*/
    display: inline-block;
    width: 10%;
    text-align: center;
    color: #000;
    font-size: 35px;
    vertical-align: top;
    margin-right: 8px;
    line-height: 35px;
    margin-top: 2px;
  }
  >>>.el-loading-mask {
    border-radius: 16px;
    background-color: #f7f7f7;
  }
  .el-tag{
    margin-right: 10px;
    user-select: none;
    margin-top: 5px;
    font-size: 14px;
  }
  .el-tag:hover{
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
  }
  .el-tag:active{
    transform: scale(0.98);
  }
  /*.bg-purple {*/
  /*  background: #d3dce6;*/
  /*}*/
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 6px;
    height: 40px;
    line-height: 40px;
    box-shadow: 2px 3px 4px rgba(0,0,0,.3);
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  a:hover{
    text-decoration: none;
  }
  #title{
    text-align: center;
    margin-top: 40px;
    margin-bottom: 40px;
    color: #f5f6fc;
  }
  #infoBox {
    height: 97.1%;
    width: 30.5%;
    /*background-color: #F5F6FC;*/
    /*background-color: #f7f7f7;*/
    display: inline-block;
    float: right;
    margin-top: 20px;
    margin-right: 2%;
    border-radius: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    position: relative;
  }
  /*#page {*/
  /*  !*height: 52px;*!*/
  /*  width: 30.5%;*/
  /*  !*background-color: #F5F6FC;*!*/
  /*  background-color: #f7f7f7;*/
  /*  display: inline-block;*/
  /*  float: right;*/
  /*  !*margin-top: 20px;*!*/
  /*  margin-right: 2%;*/
  /*  !*border-radius: 20px;*!*/
  /*  box-shadow: 0 2px 8px rgba(0,0,0,.3);*/
  /*}*/
  #neo4jd3{
    height: 97%;
    width: 63%;
    /*margin: 50px auto;*/
    margin-top: 20px;
    margin-left: 2%;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    display: inline-block;
    /*background-color: #f5f6fc;*/
  }
  .neo4jd3 {
    height: 100%;
    width: 100%;
    /*overflow: hidden;*/
  }
  .neo4jd3-graph {
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .neo4jd3-info {
    font-size: 16px;
    padding: 10px;
    /*position: absolute;*/
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

  >>>svg {
    cursor: move;
    background-color: #f7f7f7;
    border-radius: 20px;
    /*width: 90%;*/
    /*margin-left: 12%;*/
  }
</style>
