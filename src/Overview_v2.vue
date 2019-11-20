<template>
  <div style="width: 100%;height: 100%;">
    <div id="judgeFirefox" style="display: none;">
      <h2 style="text-align: center;margin: 30px auto;color: #eaeaeaeb;">
        Since Firefox can not support d3 very well, please use Chrome or Internet Explorer.
      </h2>
    </div>
    <div id="overviewGraph" style="width: 100%;height: 100%;">
      <!--    <span>woowo</span>-->
      <!--    <div style="width: 20px;display: inline-block;"></div>-->
      <!--    <div style="text-align: center;"><h2 id="overview_h2" style="margin:20px 0px 0px 0px;">Overview</h2></div>-->
      <h1  id="title" style="text-align: center">
        <router-link style="color: #ffffff;" to="/">
          API Structure Overview
        </router-link>
      </h1>
      <router-link to="/">
        <el-button id="recently_apis" icon="el-icon-s-home" type="primary" style="position: absolute;left: 11px;top: 16px;z-index: 10000;padding: 12px;" plain>Back to Home</el-button>
      </router-link>
      <el-button type="primary" style="position: fixed;right: 11px;top: 16px;z-index: 10000;" plain @click="display_labels" v-show="!drawer">Labels</el-button>
      <el-drawer
        title="These are our labels, different colors symbolize different types."
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
      <el-drawer
        :title="methodTitle"
        :visible.sync="drawerLeft"
        direction="ltr"
        size="65.5%"
        :before-close="handleClose">
        <div id='neo4jd3_selected' v-loading="loadingSelectedMethod"></div>
      </el-drawer>
      <el-row>
        <el-button type="primary" plain id="package" @click="handleClick('package')">package</el-button>
        <el-button type="warning" plain style="margin-left: 33.5%;" id="class" @click="handleClick('class')">class</el-button>
        <el-button type="success" plain style="float: right;" id="method" @click="handleClick('method')">method</el-button>
      </el-row>
      <div id='neo4jd3_package' class="neo4jd3_graph" v-loading="loading"></div>
      <div id='neo4jd3_class' class="neo4jd3_graph" v-loading="loadingClass">{{classInfo}}</div>
      <div id='neo4jd3_method' class="neo4jd3_graph" v-loading="loadingMethod">{{methodInfo}}</div>
<!--      <div id='neo4jd3_class' class="neo4jd3_graph" v-loading="loadingClass"></div>-->
<!--      <div id='neo4jd3_method' class="neo4jd3_graph" v-loading="loadingMethod"></div>-->
      <div id="infoBox" v-loading="loadingInfoBox">
        <div id="deletePage" style="display: inline-block;width: 100%;border-radius: 20px;background-color: #f7f7f7;">
          <h4 id="qualified_name" style="text-align: center;margin: 2.5% auto;color: #000000;word-break: break-word;">{{qualified_name}}</h4>
          <div id="selectAPI" style="background-color: rgb(251, 207, 207);margin: 5px auto 7px;width: 93%;padding: 10px;border-radius: 10px;display: none;">
            <div style="width: 100%;margin-bottom: 0.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
              <el-tooltip class="item" effect="dark" :content="selectNode.qualified_name" placement="top">
                <h5 style="color: #000000;display: inline;">Select API:{{selectNode.qualified_name}}</h5>
              </el-tooltip>
            </div>
            <div style="width: 100%;margin-bottom: 0.5rem;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">
              <el-tooltip class="item" effect="dark" :content="selectNode.short_description" placement="top">
                <p style="color: #000000;display: inline;">Description:{{selectNode.short_description}}</p>
              </el-tooltip>
            </div>
            <router-link tag="a" target="_blank" :to="/KnowledgeData/ + selectNode.id"><el-tag effect="dark">Encyclopedia</el-tag></router-link>
            <router-link tag="a" target="_blank" :to="/ElementGraph/ + selectNode.id"><el-tag effect="dark">Graph</el-tag></router-link>
<!--            <el-tag effect="dark" @click="associated_concept(selectNode.qualified_name)">concept</el-tag>-->
<!--            <el-tag effect="dark" @click="mind_map(selectNode.id)">Mindmap</el-tag>-->
          </div>
          <h4 id="related_name" style="text-align: center;margin: 2.5% auto;color: #000000;word-break: break-word;display: none;">Related API</h4>
          <div class="relate_api" style="margin: 5px auto 7px;width: 93%;background: #a3a3a3;padding: 10px;border-radius: 10px;" v-for="(item, index) in current_apis" :key="index">
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
              <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id"><el-tag effect="dark">Encyclopedia</el-tag></router-link>
              <router-link tag="a" target="_blank" :to="/ElementGraph/ + item.id"><el-tag effect="dark">Graph</el-tag></router-link>
<!--              <el-tag effect="dark" @click="associated_concept(item.qualified_name)">concept</el-tag>-->
              <el-tag effect="dark" @click="mind_map(item.id)">Mindmap</el-tag>
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
    </div>
  </div>
</template>

<script>
  import { Neo4jD3 } from './neo4j'
  import axios from 'axios'
  // import $ from 'jquery'

  export default {
    name: 'Overview_v2',
    props: {
      extend: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        loadingSelectedMethod: true,
        methodTitle: 'test',
        drawerLeft: false,
        drawer: false,
        loadingInfoBox: false,
        loading: true,
        loadingClass: false,
        loadingMethod: false,
        nodeData: {},
        neo4jd3: null,
        nodes: [],
        edges: [],
        neo4jd3Class: null,
        nodesClass: [],
        edgesClass: [],
        neo4jd3Method: null,
        nodesMethod: [],
        edgesMethod: [],
        neo4jd3MethodDetail: null,
        nodesMethodDetail: [],
        edgesMethodDetail: [],
        id: null,
        startData: {},
        classData: {},
        methodData: {},
        methodDetailData: {},
        qualified_name: "Please try to double click the point in the left graph.",
        current_apis: [],
        related_apis: [],
        all_relate_api_number: 100,
        current_page: 1,
        current_number: 0,
        page_size: 4,
        activeName: 'package',
        selectNode:[],
        classInfo: "Please click the package point in package graph.",
        methodInfo: "Please click the class point in class graph.",
        selectPackageName: '',
        selectClassName: ''
      }
    },
    methods: {
      handleClose(done) {
        done()
        let neo4jd3_method = document.getElementById("neo4jd3_method")
        neo4jd3_method.style.zIndex = "2002"
      },
      display_labels () {
        this.drawer = true
      },
      delHtmlTag(str){
        return str.replace(/<[^>]+>/g,"");
      },
      handleClick(idName) {
        // console.log(idName);
        let package1 = document.getElementById("package")
        let class1 = document.getElementById("class")
        let method1 = document.getElementById("method")
        let neo4jd3_package = document.getElementById("neo4jd3_package")
        let neo4jd3_class = document.getElementById("neo4jd3_class")
        let neo4jd3_method = document.getElementById("neo4jd3_method")
        // let neo4jd3_class_child =  neo4jd3_class.getElementsByClassName('el-loading-mask')[0]
        // console.log(neo4jd3_class_child)
        // let neo4jd3_method_child = neo4jd3_method.getElementsByClassName('el-loading-mask')[0]
        if(idName == "package") {
          // #409EFF, #ecf5ff,#E6A23C, #fdf6ec,#67C23A,#f0f9eb
          // package1.style.backgroundColor = "#409EFF"
          package1.style.cssText = "background: #409EFF;border-color: #409EFF;color: #FFF;"
          class1.style.cssText = "background: #fdf6ec;border-color: #f5dab1;color: #E6A23C;margin-left: 34%;"
          method1.style.cssText = "background: #f0f9eb;border-color: #c2e7b0;color: #67C23A;float: right;"
          // neo4jd3_package.style.display = "inline-block"
          // neo4jd3_class_child.style.display = "none"
          // neo4jd3_method_child.style.display = "none"
          neo4jd3_package.style.zIndex = "2002"
          neo4jd3_class.style.zIndex = "-10"
          neo4jd3_method.style.zIndex = "-10"
        } else if(idName == "class") {
          package1.style.cssText = "color: #409EFF;background: #ecf5ff;border-color: #b3d8ff;"
          class1.style.cssText = "background: #E6A23C;border-color: #E6A23C;color: #FFF;margin-left: 34%;"
          method1.style.cssText = "background: #f0f9eb;border-color: #c2e7b0;color: #67C23A;float: right;"
          // neo4jd3_package.style.display = "none"
          // neo4jd3_class_child.style.display = ""
          // neo4jd3_method_child.style.display = "none"
          neo4jd3_package.style.zIndex = "-10"
          neo4jd3_class.style.zIndex = "2002"
          neo4jd3_method.style.zIndex = "-10"
        } else {
          // package1.style.backgroundColor = "#ecf5ff"
          // class1.style.backgroundColor = "#fdf6ec"
          // method1.style.backgroundColor = "#67C23A"
          package1.style.cssText = "color: #409EFF;background: #ecf5ff;border-color: #b3d8ff;"
          class1.style.cssText = "background: #fdf6ec;border-color: #f5dab1;color: #E6A23C;margin-left: 34%;"
          method1.style.cssText = "background: #67C23A;border-color: #67C23A;color: #FFF;float: right;"
          // neo4jd3_package.style.display = "none"
          // neo4jd3_class_child.style.display = "none"
          // neo4jd3_method_child.style.display = ""
          neo4jd3_package.style.zIndex = "-10"
          neo4jd3_class.style.zIndex = "-10"
          neo4jd3_method.style.zIndex = "2002"
        }
      },
      different (api_2_name) {
        let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html?api_1_name=" + this.qualified_name + "&api_2_name=" + api_2_name
        window.open(url, '_blank')
      },
      // detail (nodeId) {
      //   let url = "./KnowledgeData/" + nodeId
      //   // console.log(url)
      //   window.open(url, '_blank')
      // },
      mind_map (nodeId) {
        let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/mindMap.html?id=" + nodeId
        window.open(url, '_blank')
      },
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
            let related_name = document.getElementById("related_name")
            let related_name_height = related_name.clientHeight
            // let relate_api = document.getElementsByClassName("relate_api")[0]
            // let relate_api_height = relate_api.clientHeight
            let relate_api_height = 102
            let page = document.getElementById("page")
            let page_height = page.clientHeight
            // let page_height = 43
            this.page_size = Math.floor((infoBoxHeight - qualified_name_height - page_height - related_name_height - 133) / relate_api_height)
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
        document.getElementById("related_name").style.display = "none"
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/InfoBox/', {id: infoId})
          .then(response => {
            this.related_apis = response.data.related_apis
            // this.qualified_name = response.data.qualified_name
            this.qualified_name = "Information Box"
            document.getElementById('selectAPI').style.display = ""
            document.getElementById("related_name").style.display = ""
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
        this.handleClick("package")
        axios
          .get('http://bigcode.fudan.edu.cn/kg/api/graph/PackageOverview/')
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
            let edgeId = 1000
            response.data.relations.forEach((relation) => {
              // console.log(relation)
              if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
                edgeId += 1
                let edge = {}
                edge.end_id = relation[0]
                edge.start_id = relation[1]
                edge.target = relation[0]
                edge.source = relation[1]
                edge.id = edgeId
                edge.type = ''
                edge.properties = null
                this.$set(this.edges, this.edges.length, edge)
              }
            })
            // let nodeNum = 0
            response.data.nodes.forEach((relatedNode) => {
              // let node = relatedNode.nodes
              // this.$set(this.nodes, this.nodes.length, relatedNode)
              if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
                this.$set(this.nodes, this.nodes.length, relatedNode)
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
        this.neo4jd3 = new Neo4jD3('#neo4jd3_package', {
          D3Data: this.startData,
          icons: {
          },
          images: {
          },
          minCollision: 60,
          nodeRadius: 25,
          onNodeDoubleClick: function (node) {
            // _this.get_expand_node(node.id)
            console.log(node)
            _this.selectNode = node.majority_properties
            _this.selectNode.short_description = _this.delHtmlTag(_this.selectNode.short_description)
            _this.selectNode.id = node.id
            _this.selectPackageName = node.name + '.'
            _this.get_expand_node_Class(node.id)
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
                let edge = {}
                edge.end_id = relation.end_id
                edge.start_id = relation.start_id
                edge.target = relation.end_id
                edge.source = relation.start_id
                edge.id = relation.id + 2000
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
      },
      get_expand_node_Class (id) {
        let _this = this
        let neo4jd3_class = document.getElementById("neo4jd3_class")
        neo4jd3_class.innerHTML = "loading……"
        // console.log("get_expand_node_Class")
        this.classInfo = "loading……"
        this.handleClick("class")
        this.loadingClass = true
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/SelectDetail/', {id: id})
          .then(response => {
            console.log(response)
            let edges = []
            let nodes = []
            _this.edgesClass = []
            _this.nodesClass = []
            response.data.relations.forEach((relation) => {
              // if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
                let edge = {}
                edge.end_id = relation.end_id
                edge.start_id = relation.start_id
                edge.target = relation.end_id
                edge.source = relation.start_id
                edge.id = relation.id + 20000
                edge.type = relation.name
                edge.properties = relation.properties
                edges.push(edge)
                _this.$set(this.edgesClass, this.edgesClass.length, edge)
              // }
            })
            // this.edgesClass = edges
            response.data.nodes.forEach((relatedNode) => {
              // let node = relatedNode.nodes
              // if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
              //   console.log(relatedNode)
              //   if(relatedNode.labels.indexOf("type") >= 0 && relatedNode.labels[1] != undefined) {
              //     relatedNode.labels[0] = relatedNode.labels[1]
              //   }
                relatedNode.labels[0] = relatedNode["node_main_label"]
                if(relatedNode.labels.indexOf("unknown") < 0) {
                  if(relatedNode.labels.indexOf('class') >= 0) {
                    try{
                      // relatedNode["realName"] = relatedNode.name
                      relatedNode.labels[0] = "class"
                      relatedNode.name = relatedNode.name.split(_this.selectPackageName)[1]
                    }
                    catch (e) {
                      // relatedNode["realName"] = relatedNode.name
                      relatedNode.name = relatedNode.name
                    }
                    nodes.push(relatedNode)
                  } else {
                    nodes.push(relatedNode)
                  }
                }
              // nodes.push(relatedNode)
                this.$set(this.nodesClass, this.nodesClass.length, relatedNode)
              // }
            })
            // this.nodesClass = nodes
            _this.classData = {'nodes': _this.nodesClass, 'relationships': _this.edgesClass}
            _this.neo4jd3Class = null
            _this.init_class()
          })
          // .catch(error => console.log(error))
      },
      init_class(){
        let _this = this
        this.classInfo = ""
        this.neo4jd3Class = new Neo4jD3('#neo4jd3_class', {
          D3Data: this.classData,
          icons: {
          },
          images: {
          },
          minCollision: 60,
          nodeRadius: 25,
          onNodeDoubleClick: function (node) {
            // _this.get_expand_node(node.id)
            console.log(node)
            if(node.labels.indexOf('class') >= 0) {
              _this.selectNode = node.majority_properties
              if (_this.selectNode.short_description != '' && _this.selectNode.short_description != null){
                _this.selectNode.short_description = _this.delHtmlTag(_this.selectNode.short_description)
              }
              _this.selectNode.id = node.id
              _this.selectClassName = _this.selectPackageName + node.name + '.'
              _this.get_expand_node_Method(node.id)
              _this.get_info_box(node.id)
            } else {
              _this.selectNode = node.majority_properties
              if (_this.selectNode.short_description != '' && _this.selectNode.short_description != null){
                _this.selectNode.short_description = _this.delHtmlTag(_this.selectNode.short_description)
              }
              _this.selectNode.id = node.id
              _this.selectClassName = _this.selectPackageName + node.name + '.'
              _this.get_info_box(node.id)
              // alert("Please click class points which color is orange.")
            }
          },
          onRelationshipDoubleClick: function (relationship) {
            console.log('double click on relationship: ' + JSON.stringify(relationship))
          }
        })
      },
      get_expand_node_Method (id) {
        let _this = this
        let neo4jd3_method = document.getElementById("neo4jd3_method")
        neo4jd3_method.innerHTML = "loading……"
        this.methodInfo = "loading……"
        this.loadingMethod = true
        this.handleClick("method")
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/SelectDetail/', {id: id})
          .then(response => {
            console.log(response)
            let edges = []
            let nodes = []
            response.data.relations.forEach((relation) => {
              // if (this.edges.findIndex(ele => (ele.id === relation.id)) < 0) {
              let edge = {}
              edge.end_id = relation.end_id
              edge.start_id = relation.start_id
              edge.target = relation.end_id
              edge.source = relation.start_id
              edge.id = relation.id + 200000
              edge.type = relation.name
              edge.properties = relation.properties
              edges.push(edge)
              // this.$set(this.edges, this.edges.length, edge)
              // }
            })
            this.edgesMethod = edges
            response.data.nodes.forEach((relatedNode) => {
              // let node = relatedNode.nodes
              // if (this.nodes.findIndex(ele => (ele.id === relatedNode.id)) < 0) {
              console.log(relatedNode)
              if(relatedNode.labels.indexOf("unknown") < 0) {
                // if(relatedNode.labels.indexOf("type") >= 0 && relatedNode.labels[1] != undefined) {
                //   relatedNode.labels[0] = relatedNode.labels[1]
                // }
                relatedNode.labels[0] = relatedNode["node_main_label"]
                if(relatedNode.labels.indexOf('method') >= 0 && relatedNode.labels.indexOf('construct method') < 0) {
                  try{
                    relatedNode.name = relatedNode.name.split(_this.selectClassName)[1]
                  }
                  catch (e) {
                    relatedNode.name = relatedNode.name
                  }
                  nodes.push(relatedNode)
                } else {
                  nodes.push(relatedNode)
                }
              }
            })
            this.nodesMethod = nodes
            this.methodData = {'nodes': this.nodesMethod, 'relationships': this.edgesMethod}
            // let _this = this
            this.methodInfo = ""
            this.neo4jd3Method = new Neo4jD3('#neo4jd3_method', {
              D3Data: this.methodData,
              icons: {
              },
              images: {
              },
              minCollision: 60,
              nodeRadius: 25,
              onNodeDoubleClick: function (node) {
                _this.selectNode = node.majority_properties
                if (_this.selectNode.short_description != '' && _this.selectNode.short_description != null){
                  _this.selectNode.short_description = _this.delHtmlTag(_this.selectNode.short_description)
                }
                _this.selectNode.id = node.id
                _this.get_info_box(node.id)
                // _this.get_expand_node(node.id)
                if(node.labels.indexOf('method') >= 0) {
                  console.log(node)
                  _this.methodTitle = node.name
                  _this.display_method_detail(node.id)
                }
                // else {
                //   // let alertClass = "<p style='display: inline-block;'>Please click method points which color is</p> <p style='background-color: #67C23A;color: #67C23A;width: 60px;height: 22px;border-radius: 6px;display: inline-block;margin-bottom: -7px;'>"
                //   // _this.$alert(alertClass, 'Alert', {
                //   //   dangerouslyUseHTMLString: true
                //   // });
                //   _this.selectNode = node.majority_properties
                //   _this.selectNode.short_description = _this.delHtmlTag(_this.selectNode.short_description)
                //   _this.selectNode.id = node.id
                //   _this.get_info_box(node.id)
                //   // alert("Please click method points which color is green")
                // }
              },
              onRelationshipDoubleClick: function (relationship) {
                console.log('double click on relationship: ' + JSON.stringify(relationship))
              }
            })
            this.loadingMethod = false
          })
          .catch(error => console.log(error))
      },
      display_method_detail(method_id) {
        let neo4jd3_method = document.getElementById("neo4jd3_method")
        neo4jd3_method.style.zIndex = "-10"
        this.drawerLeft = true
        this.loadingSelectedMethod = true
        this.nodesMethodDetail = []
        this.edgesMethodDetail = []
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/expandNode/', {id: method_id})
          .then(response => {
            response.data.relations.forEach((relation) => {
              let edge = {}
              edge.end_id = relation.end_id
              edge.start_id = relation.start_id
              edge.target = relation.end_id
              edge.source = relation.start_id
              edge.id = relation.id + 300000
              edge.type = relation.name
              edge.properties = relation.properties
              this.$set(this.edgesMethodDetail, this.edgesMethodDetail.length, edge)
            })
            response.data.nodes.forEach((relatedNode) => {
              if(relatedNode.labels.indexOf("type") >= 0 && relatedNode.labels[1] != undefined) {
                relatedNode.labels[0] = relatedNode.labels[1]
              }
              this.$set(this.nodesMethodDetail, this.nodesMethodDetail.length, relatedNode)
            })
            this.methodDetailData = {'nodes': this.nodesMethodDetail, 'relationships': this.edgesMethodDetail}
            this.neo4jd3MethodDetail = new Neo4jD3('#neo4jd3_selected', {
              D3Data: this.methodDetailData,
              minCollision: 60,
              nodeRadius: 25
            })
            this.loadingSelectedMethod = false
          })
          .catch(error => console.error(error))
      }
    },
    mounted () {
      this.$nextTick(function () {
        let divApp = document.getElementById("app")
        divApp.style.backgroundColor = "#00162d"
        let bodyApp = document.getElementById("body")
        bodyApp.style.backgroundColor = "#00162d"
        // 要运行
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
          document.getElementById("judgeFirefox").style.display = ""
          document.getElementById("overviewGraph").style.display = "none"
        } else {
          this.init_extend()
        }
        // 不用运行
        // this.get_info_box(887)
        // this.handleClick("package")
        // this.display_method_detail(141005)
      })
    }
  }
</script>

<style scoped>
  >>>#el-drawer__title>span{
    font-size: 20px;
    color: #000000;
  }
  >>>#el-drawer__title{
    text-align: center;
  }
  #neo4jd3_selected{
    height: 92%;
    width: 96%;
    /*margin: 50px auto;*/
    margin-top: 10px;
    margin-left: 2%;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    display: inline-block;
    background-color: #f5f6fc;
  }
  #neo4jd3_package{
    height: 97%;
    width: 62.5%;
    /*margin: 50px auto;*/
    margin-top: 10px;
    margin-left: 2%;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    display: inline-block;
    background-color: #f5f6fc;
  }
  #neo4jd3_class{
    text-align: center;
    position: absolute!important;
    left: 0px;
    height: 97%;
    width: 62.5%;
    /*margin: 50px auto;*/
    margin-top: 10px;
    margin-left: 2%;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    display: inline-block;
    background-color: #f5f6fc;
    line-height: 100px;
    font-size: 20px;
  }
  #neo4jd3_method{
    text-align: center;
    position: absolute!important;
    left: 0px;
    height: 97%;
    width: 62.5%;
    /*margin: 50px auto;*/
    margin-top: 10px;
    margin-left: 2%;
    border-radius: 20px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
    display: inline-block;
    background-color: #f5f6fc;
    line-height: 100px;
    font-size: 20px;
  }
  >>>#package:hover {
    background: #409EFF!important;
    border-color: #409EFF!important;
    color: #FFF!important;
  }
  >>>#class:hover {
    background: #E6A23C!important;
    border-color: #E6A23C!important;
    color: #FFF!important;
  }
  >>>#method:hover {
    background: #67C23A!important;
    border-color: #67C23A!important;
    color: #FFF!important;
  }
  .el-row{
    margin-left: 3%;
    width: 61%;
  }
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
    margin-right: 6px;
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
    width: 31.5%;
    /*background-color: #F5F6FC;*/
    /*background-color: #f7f7f7;*/
    display: inline-block;
    float: right;
    margin-top: 10px;
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
  /*.neo4jd3_graph{*/
  /*  height: 97%;*/
  /*  width: 63%;*/
  /*  !*margin: 50px auto;*!*/
  /*  margin-top: 10px;*/
  /*  margin-left: 2%;*/
  /*  border-radius: 20px;*/
  /*  margin-bottom: 30px;*/
  /*  box-shadow: 0 2px 8px rgba(0,0,0,.3);*/
  /*  display: inline-block;*/
  /*  background-color: #f5f6fc;*/
  /*}*/
  /*#neo4jd3{*/
  /*  height: 97%;*/
  /*  width: 63%;*/
  /*  !*margin: 50px auto;*!*/
  /*  margin-top: 10px;*/
  /*  margin-left: 2%;*/
  /*  border-radius: 20px;*/
  /*  margin-bottom: 30px;*/
  /*  box-shadow: 0 2px 8px rgba(0,0,0,.3);*/
  /*  display: inline-block;*/
  /*  !*background-color: #f5f6fc;*!*/
  /*}*/
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
