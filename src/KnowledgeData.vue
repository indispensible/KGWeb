<template>
    <div id="background_root" class="background" v-loading="loading">
      <div id="search_div" style="position: fixed;right: 12px;bottom: 15px;display: none;">
        <el-button type="primary" icon="el-icon-caret-top" circle @click="changeHash('#background_root')"></el-button>
      </div>
      <a href="http://bigcode.fudan.edu.cn/kg/index.html#/" style="text-decoration:none;">
        <el-button id="recently_apis" icon="el-icon-s-home" type="primary" style="position: absolute;left: 11px;top: 16px;z-index: 10000;padding: 12px;" plain>Back to Home</el-button>
      </a>
      <el-button id="mind_map" type="primary" style="position: fixed;right: 18px;top: 20px;z-index: 10000;display: none;"  plain @click="display_mindmap">Mind map</el-button>
      <div class="forward container" >
        <div class="side_bar">
          <ul class="nav_sidebar">
            <li><a @click="changeHash('#APIContent')">Table of Content</a></li>
            <li v-show="relation_name.length > 0"><a @click="changeHash('#Relations')" >Relations</a></li>
            <li><a @click="changeHash('#Knowledge_Graph')">Knowledge Graph</a></li>
            <li v-show="lang.length > 0"><a @click="changeHash('#Labels')">Labels</a></li>
            <li v-show="all_result_string.length > 0"><a @click="changeHash('#concept')">Associated concept</a></li>
            <li v-show="totalWarning.length > 0"><a @click="changeHash('#warningPage')">Warning</a></li>
<!--            <li v-show="all_result_string.length > 0"><a @click="changeHash('#concept')">Associated concept</a></li>-->
            <li><a @click="changeHash('#Properties')">Properties</a></li>
              <ul>
                <li v-for="(value, key, index) in majority_properties" :key="key +'toc'"><a @click="changeHash('#'+'pro'+index)">{{key}}</a></li>
              </ul>
          </ul>
        </div>
        <div class="API_Content" >
          <div class="APIContent" id="APIContent">
          <h1>{{ name }} </h1>
          <div><span class="node_tag" :style="{ background : bColor }">{{ labels[0] }}</span></div>
          <hr>
          <div id="relationDiv" v-show="relation_name.length > 0" class="section">
            <h4 id="Relations">Relations</h4>
            <hr>
            <div >
              <table class="table table-bordered table-hover" style="width: 50%;">
                <thead>
                <tr>
                  <th>key</th>
                  <th>value</th>
                </tr>
                </thead>
                <tbody v-for="(item,index) in AdjacentNodesNameList" :key=" index  + 'adjacentNode'">
                <tr v-show="index < relation_show">
                  <td>{{relation_name[index]}}</td>
                  <td><router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id">{{item.name}}</router-link></td>
                </tr>
                </tbody>
              </table>
              <el-button type="text" @click="show_more_relation" v-show="relation_show < relation_name.length || r_show != '+more'">{{r_show}}</el-button>
            </div>
          </div>
          <div id="graph" class="section">
            <h4 id="Knowledge_Graph">Knowledge Graph</h4>
            <el-row>
              <el-button type="warning" plain @click="graphDisplay" size="small">{{graphString}}</el-button>
              <el-button type="warning" plain @click="GoGraph" size="small">Graph Detail</el-button>
            </el-row>
            <ForceGraph :graphData="id" v-show="graphShow"></ForceGraph>
          </div>
          <div id="language" v-show="lang.length > 0" class="section">
            <h4 id="Labels">Labels</h4>
            <hr>
            <el-table :data="language_table.slice(0,label_show)" scope="scope" style="width: 70%;">
              <el-table-column label="language" >
                <template slot-scope="scope">
                  {{lang[scope.$index]}}
                </template>
              </el-table-column>
              <el-table-column prop="label" label="label"></el-table-column>
              <el-table-column prop="description" label="description"></el-table-column>
              <el-table-column prop="alias" label="alias"></el-table-column>
            </el-table>
            <el-button type="text" @click="dialogLabelVisible = true" v-show="label_show < lang.length || l_show != '+more'">{{l_show}}</el-button>
            <el-dialog title="Label" :visible.sync="dialogLabelVisible" style="" :center="true" >
              <el-table :data="language_table" scope="scope" >
                <el-table-column label="language" >
                  <template slot-scope="scope">
                    {{lang[scope.$index]}}
                  </template>
                </el-table-column>
                <el-table-column prop="label" label="label"></el-table-column>
                <el-table-column prop="description" label="description"></el-table-column>
                <el-table-column prop="alias" label="alias"></el-table-column>
              </el-table>
            </el-dialog>
          </div>
          <div id="concept" class="section" v-show="all_result_string.length > 0">
            <h4 id="conceptPage">Associated Concept</h4>
            <hr>
            <div id="main" style="width: 100%;height: 402px;border-radius: 12px;"></div>
            <el-drawer
              title="Related APIs"
              size="40%"
              direction="ltr"
              :visible.sync="drawer">
              <div v-for="(item, index) in current_api">
                <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id">
                  <el-card class="inner_card" shadow="never" style="font-size: 19px!important;">
                    {{item.qualified_name}}
                  </el-card>
                </router-link>
              </div>
              <div style="width: 100%; border-radius: 20px;text-align: center;padding-top: 12px;padding-bottom: 12px;">
                <el-pagination
                  @current-change="change_data_word_cloud"
                  background
                  layout="prev, pager, next"
                  :page-size="10"
                  :total="total_api_num">
                </el-pagination>
              </div>
            </el-drawer>
          </div>
          <div id="warningPage" v-show="totalWarning.length > 0" class="section">
            <h4 id="warning">Warning</h4>
            <hr>
            <div >
              <table class="table table-bordered table-hover" style="width: 100%;">
                <thead>
                <tr>
                  <th style="width: 25%">tag</th>
                  <th style="width: 75%">text</th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,index) in currentWarning">
                    <td style="width: 25%">{{item.warning_tag}}</td>
                    <td style="width: 75%">{{item.warning_text}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style="width: 100%; border-radius: 20px;text-align: center;padding-top: 12px;padding-bottom: 12px;">
              <el-pagination
                @current-change="change_data"
                background
                layout="prev, pager, next"
                :page-size="3"
                :total="totalNum">
              </el-pagination>
            </div>
          </div>
<!--            <div id="concept" class="section" v-show="all_result_string.length > 0">-->
<!--              <h4 id="conceptPage">Associated Concept</h4>-->
<!--              <hr>-->
<!--              <div id="main" style="width: 100%;height: 402px;border-radius: 12px;"></div>-->
<!--            </div>-->
          <div id="propertiesDiv" class="section">
            <h4 id="Properties">Properties</h4>
            <hr>
            <div>
                <dl v-for="(value, key, index) in majority_properties" :key=" value + key + 'majority_properties'">
                  <dt :id="'pro' + index">{{key}} :</dt>
                  <dd v-if="typeof value == 'string'">{{value}}</dd>
                  <dd v-if="typeof value == 'number'">{{value}}</dd>
                  <dd v-else-if="typeof value == 'object'" v-for="li in value" :key="li + key + 'majority_properties'">{{li}}</dd>
                </dl>
              <!--</div>-->
            </div>
          </div>

<!--          <div id="language" v-show="lang.length > 0" class="section">-->
<!--            <h4 id="Labels">Labels</h4>-->
<!--            <hr>-->
<!--            <el-table :data="language_table.slice(0,label_show)" scope="scope" style="width: 70%;">-->
<!--              <el-table-column label="language" >-->
<!--                <template slot-scope="scope">-->
<!--                  {{lang[scope.$index]}}-->
<!--                </template>-->
<!--              </el-table-column>-->
<!--              <el-table-column prop="label" label="label"></el-table-column>-->
<!--              <el-table-column prop="description" label="description"></el-table-column>-->
<!--              <el-table-column prop="alias" label="alias"></el-table-column>-->
<!--            </el-table>-->
<!--            <el-button type="text" @click="dialogLabelVisible = true" v-show="label_show < lang.length || l_show != '+more'">{{l_show}}</el-button>-->
<!--            <el-dialog title="Label" :visible.sync="dialogLabelVisible" style="" :center="true" >-->
<!--              <el-table :data="language_table" scope="scope" >-->
<!--                <el-table-column label="language" >-->
<!--                  <template slot-scope="scope">-->
<!--                    {{lang[scope.$index]}}-->
<!--                  </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="label" label="label"></el-table-column>-->
<!--                <el-table-column prop="description" label="description"></el-table-column>-->
<!--                <el-table-column prop="alias" label="alias"></el-table-column>-->
<!--              </el-table>-->
<!--            </el-dialog>-->
<!--          </div>-->
        </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import ForceGraph from './forceGraph'
import $ from 'jquery'

export default {
  components: {ForceGraph},
  inject: ['reload'],
  name: 'KnowledgeData',
  data () {
    return {
      id: null,
      name: null,
      properties: null,
      description: 'adf',
      labels: [],
      majority_properties: null,
      page_number: 0,
      AdjacentNodesNameList: [],
      relation_name: [],
      alias_list: {},
      description_list: {},
      site_list: [],
      label_list: {},
      lang: [],
      language_table: [],
      other: [],
      relations: '',
      relation_show: 5,
      label_show: 5,
      l_show: '+more',
      r_show: '+more',
      dialogLabelVisible: false,
      graphShow: false,
      graphString: 'Display Graph',
      bColor: '#fff',
      totalWarning: [],
      currentWarning: [],
      pageNum: 0,
      totalNum: 0,
      all_result_string: [],
      myChart: '',
      related_api: {},
      current_api: {},
      total_api_num: 0,
      current_api_num: 0,
      drawer: false,
      totalChart: 0,
      loading: false
    }
  },
  created () {
    this.id = this.$route.params.id
  },
  methods: {
      handleScroll () {
          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
          // console.log(scrollTop)
          if (scrollTop >= 250) {
              // document.getElementById("search_div").style.display = ""
              $("#search_div").fadeIn()
          } else {
              // document.getElementById("search_div").style.display = "none"
              $("#search_div").fadeOut()
          }
      },
    change_data_word_cloud (val) {
        this.drawer = true
        let current_num = (val - 1) * 10
        this.current_api = {}
        this.current_api_num = current_num
        if (current_num + 10 > this.related_api.length) {
            let num = current_num
            for (let index = 0; index < this.related_api.length - num; index++){
                this.current_api[index] = this.related_api[current_num]
                current_num++
            }
        } else {
            for (let index = 0; index < 10; index++){
                this.current_api[index] = this.related_api[current_num]
                current_num++
            }
        }
    },
    wordCloudRelatedAPI () {
        let _this = this
        this.myChart.on('click', function(params){
            this.total_api_num = 0
            this.related_api = {}
            let api_id = params.data.conceptId
            // this.drawer = true
            axios
                .post(
                    'http://bigcode.fudan.edu.cn/kg/api/graph/sharedConcept/',
                    {"id": api_id, "top_num": 88})
                .then(response => {
                    _this.related_api = response.data
                    _this.total_api_num = _this.related_api.length
                    _this.change_data_word_cloud(1)
                })
                .catch(error => {
                    console.log(error)
                    alert("Sorry! Network Error!")
                })
        })
    },
    wordCloud(){
      let _this = this
      let main_div = document.getElementById('main')
      console.log(document.getElementById("APIContent").clientWidth)
      main_div.style.width = document.getElementById("APIContent").clientWidth + 'px'
      main_div.style.borderRadius = "15px";
      this.myChart = this.$echarts.init(main_div)
      let option = {
        // title: {
        //   text: 'Associated Concept',
        //   x: 'center',
        //   textStyle: {
        //     fontSize: 23
        //   },
        //   top: 8
        // },
        backgroundColor: '#F7F7F7',
        tooltip: {
          show: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false
            }
          }
        },
        series: [{
          name: 'Associated Concept',
          type: 'wordCloud',
          //size: ['9%', '99%'],
          sizeRange: [16, 40],
          //textRotation: [0, 45, 90, -45],
          rotationRange: [-45, 90],
          //shape: 'circle',
          textPadding: 0,
          autoSize: {
            enable: true,
            minSize: 6
          },
          drawOutOfBound:true,
          textStyle: {
            normal: {
              color: function() {
                return 'rgb(' + [
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160),
                  Math.round(Math.random() * 160)
                ].join(',') + ')';
              }
            },
            emphasis: {
              shadowBlur: 10,
              shadowColor: '#333'
            }
          },
          data: []
        }]
      }
      let jsonList = new Array()
      for (let item in _this.all_result_string) {
        // console.log(_this.all_result_string[item]["domain name"])
        jsonList.push({
          name: _this.all_result_string[item]["domain name"],
          value: _this.all_result_string[item]["times"],
          conceptId: _this.all_result_string[item]["id"]
        })
      }
      // console.log(jsonList)
      option.series[0].data = jsonList;
      // _this.myChart.resize()
      this.myChart.clear()
      this.myChart.setOption(option);
      if (this.totalChart < 2) {
          this.wordCloudRelatedAPI()
      }
      // this.loading = false
    },
    display_word_cloud() {
      axios
        .post(
          'http://bigcode.fudan.edu.cn/kg/api/graph/visualAssociatedConcept/',
          {'id': parseInt(this.id)})
        .then(response => {
          this.all_result_string = ''
          this.myChart = ''
          this.all_result_string = response.data
          this.totalChart += 1
          this.wordCloud()
        })
        .catch(error => {
          console.log(error)
          // alert("Sorry! Network Error!")
        })
    },
    display_mindmap() {
      let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/mindMap.html?id=" + this.id
      window.open(url, '_blank')
    },
    graphDisplay () {
      this.graphShow = !this.graphShow
      if (this.graphString === 'Hide Graph') this.graphString = 'Display Graph'
      else if (this.graphString === 'Display Graph') this.graphString = 'Hide Graph'
    },
    changeHash (idName) {
      document.querySelector(idName).scrollIntoView({
          behavior: "smooth",
          block: "start"
      })
    },
    GoGraph () {
      // this.$router.push({name: 'ElementGraph', params: { id: this.id }})
      let goGraph = this.$router.resolve({name: 'ElementGraph', params: { id: this.id }})
      window.open(goGraph.href, '_blank')
    },
    show_more_relation () {
      this.relation_show = (this.relation_show === this.relation_name.length) ? 5 : this.relation_name.length
      this.r_show = (this.r_show === '+more') ? '-few' : '+more'
    },
    show_more_label () {
      this.label_show = (this.label_show === this.language_table.length) ? 5 : this.language_table.length
      this.l_show = (this.l_show === '+more') ? '-few' : '+more'
    },
    getId () {
      this.id = this.$route.params.id
    },
    handleProperty (properties) {
      this.alias_list = {}
      this.description_list = {}
      this.label_list = {}
      this.lang = []
      for (let prop in properties) {
        if (prop.substring(0, 5) === 'alias') {
          let la = prop.replace('alias_', '')
          this.alias_list[la] = properties[prop]
        } else if (prop.substring(0, 13) === 'descriptions_') {
          let la = prop.replace('descriptions_', '')
          this.description_list[la] = properties[prop]
        } else if (prop.substring(0, 5) === 'site:') {
          this.$set(this.site_list, this.site_list.length, {[prop]: properties[prop]})
        } else if (prop.substring(0, 6) === 'labels') {
          let la = prop.replace('labels_', '')
          this.$set(this.lang, this.lang.length, la)
          this.label_list[la] = properties[prop]
        } else {
          this.$set(this.other, this.other.length, {[prop]: properties[prop]})
        }
      }
    },
    handleAll (lang, labelsList, descriptionList, aliasList) {
      this.language_table = []
      lang.sort(function (a, b) {
        return a > b
      })
      for (let i = 0; i < lang.length; i++) {
        let dict = {}
        if (labelsList.hasOwnProperty(lang[i])) {
          dict['label'] = labelsList[lang[i]]
        } else if (!labelsList.hasOwnProperty(lang[i])) {
          dict['label'] = 'null'
        }
        if (descriptionList.hasOwnProperty(lang[i])) {
          dict['description'] = descriptionList[lang[i]]
        } else if (!descriptionList.hasOwnProperty(lang[i])) {
          dict['description'] = 'null'
        }
        if (aliasList.hasOwnProperty(lang[i])) {
          dict['alias'] = aliasList[lang[i]]
        } else if (!aliasList.hasOwnProperty(lang[i])) {
          dict['alias'] = 'null'
        }
        this.$set(this.language_table, this.language_table.length, dict)
      }
    },
    getNodeData () {
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getNodeByID/', {id: this.id})
        .then(response => {
          this.name = response.data.name
          this.properties = response.data.properties
          this.labels = response.data.labels
          this.bColor = this.labelColor(this.labels[0])
          console.log(response.data.majority_properties)
          this.majority_properties = {}
          // this.majority_properties = response.data.majority_properties
          for(let i in response.data.majority_properties){
              // console.log(i)
              if (i != "id" && i != "api_type" && i != "entity_category" && i != "added_in_version") {
                  console.log(response.data.majority_properties[i])
                  this.majority_properties[i] = response.data.majority_properties[i]
                  // if (i == "short_description ") {
                  //     this.majority_properties[i] = response.data.majority_properties[i].replace(/<[^>]+>/g,"")
                  // } else {
                  //     this.majority_properties[i] = response.data.majority_properties[i]
                  // }
              }
          }
          console.log(this.majority_properties)
          this.handleProperty(this.properties)
          this.handleAll(this.lang, this.label_list, this.description_list, this.alias_list)

          if (response.data.mindmap == 1) {
              document.getElementById("mind_map").style.display = ""
          }

          // 可以注释，通过名字来得到词云
          // this.display_word_cloud()
          // 记录最近访问的api
          let storage=window.localStorage
          let name_and_id = response.data.name + "::" + response.data.id
          console.log(name_and_id)
          if (storage["recent_apis"] == '' || storage["recent_apis"] == undefined) {
            storage["recent_apis"] = ""
          }
          console.log(storage.getItem("recent_apis"))
          let storage_array = storage.getItem("recent_apis").split(":!:")
          let index = storage_array.indexOf(name_and_id)
          if (index >= 0) {
            storage_array.splice(index, 1)
          }
          storage_array.unshift(name_and_id)
          storage_array = storage_array.slice(0,51)
          console.log("这里是存储的位置")
          console.log(storage_array)
          storage.setItem("recent_apis", storage_array.join(":!:"))
          console.log(localStorage)
          // this.$addStorageEvent("recent_apis", storage_array.join(":!:"))
          // storage["recent_apis"] = storage_array.join(":!:")
          // console.log(storage)

          // console.log(this.majority_properties)
        })
        .catch(error => {
              console.log(error)
              console.log("报错")
            }
        )
    },
    labelColor (label) {
      switch (label) {
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
    },
    getNodeRelation () {
      let _this = this
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/expandNode/', {id: this.id})
        .then(response => {
          this.AdjacentNodesNameList = []
          this.relation_name = []
          let tempNodes = []
          if (response.data.relations.length > 0) {
            response.data.nodes.forEach(nodes => {
              if (nodes.id !== _this.id) {
                let node = {}
                node.id = nodes.id
                node.name = nodes.name
                tempNodes.push(node)
                // this.$set(this.AdjacentNodesNameList, this.AdjacentNodesNameList.length, node)
              }
            })
            console.log(tempNodes)
            response.data.relations.forEach(relation => {
              let node = {}
              tempNodes.forEach(function (d) {
                if (d.id === relation.end_id) node = d
              })
              _this.$set(_this.AdjacentNodesNameList, _this.AdjacentNodesNameList.length, node)
              _this.$set(_this.relation_name, _this.relation_name.length, relation.name)
            })
            console.log(_this.AdjacentNodesNameList)
            this.loading = false
          }
        })
    },
    getWarning (){
      axios
        .post(
          'http://bigcode.fudan.edu.cn/kg/api/graph/RelatedWarning/',
          {'id': parseInt(this.id), "top_num": 8})
        .then(response => {
          console.log(response.data)
          // setInterval(function(){ alert("Hello"); }, 300000);
          console.log(response.data.length)
          this.totalWarning = response.data
          this.totalNum = response.data.length
          this.change_data(1)
          this.loading = false
        })
        .catch(error => {
          console.log(error)
          alert("Sorry! Network Error!")
        })
    },
    change_data (val) {
      // console.log(val)
      let _this = this
      let current_num = (val - 1) * 3
      _this.currentWarning = []
      _this.pageNum = current_num
      if (current_num + 3 > _this.totalWarning.length) {
        let num = current_num
        for (let index = 0; index < _this.totalWarning.length - num; index++){
          console.log(_this.totalWarning[current_num])
          _this.currentWarning[index] = _this.totalWarning[current_num]
          current_num++
        }
      } else {
        for (let index = 0; index < 3; index++){
          _this.currentWarning[index] = _this.totalWarning[current_num]
          current_num++
        }
      }
    }
  },
  // watch: {
  //   '$route' (to, from) {
  //     this.getId()
  //     this.getNodeData()
  //     this.getNodeRelation()
  //   }
  // },
  mounted () {
    window.addEventListener('scroll', this.handleScroll)
    this.getNodeData()
    this.getNodeRelation()
    this.getWarning()
    this.graphDisplay()
    this.display_word_cloud()
    this.loading = true
  },
  watch: {
    '$route': function () {
      this.id = this.$route.params.id
      this.getNodeData()
      this.getWarning()
      this.getNodeRelation()
      this.display_word_cloud()
      this.loading = true
    }
  }
}
</script>
<style scoped>
@import "assets/font/Raleway.css";

>>>.el-card__body {
      padding: 20px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

.el-card {
  border-radius: 20px;
}

.el-card:hover {
  boder: 1px solid #ebeef5 !important;
  border-radius: 15px;
}

a:hover {
  text-decoration: none;
}

.inner_card {
  border: 1px solid rgba(255, 255, 255, 0);
  font-size: 17px !important;
  margin-top: 8px;
  color: #1e88e5;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  /*max-width: 300px;*/
}

.inner_card:hover {
  border: 1px solid #ebeef5;
  color: #fff;
  background-color: #1e88e5;
}

>>> .el-drawer {
  overflow-y: scroll;
}

>>> #main>div{
  border-radius: 16px;
}

.background{
  height: 100%;
  width: 100%;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: auto;
  padding-right: auto;
  background-color: #ffffff;
  /*background-color: rgba(245,245,245,0.8);*/
}
.section{
  margin-top: 30px;
}

.section p{
  font-size: 15px;
  font-weight: 300;
  font-style: normal;
  line-height: 25px;
  color: #616366;
  margin: 0px 0px 17px 0px;
  padding: 0px;
}
/*#graph{*/
  /*border: solid 1px grey;*/
/*}*/
.el-dialog{
  /*position: absolute;*/
  /*top: 20%;*/
  /*left: 50%;*/
  /*margin: 0 !important;*/
  /*max-height: calc(100% - 30px);*/
  /*max-width: calc(100% - 30px);*/
  /*transform: translate(-50%, -50%);*/
  /*display: flex !important;*/
  /*flex-direction: column !important;*/
}
.el-dialog__body{
  /*height: 700px!important;*/
  /*overflow: auto!important;*/
}
ul{
  list-style: none;
}

@media (max-width: 991px) {
  .nav_sidebar{
    display: none;
  }
  .API_Content{
    width: 100%;
    /*box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);*/
    /*border: solid 1px;*/
    /*border-radius: 2px;*/
    /*box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);*/
  }
}
@media (min-width: 992px) {
  .side_bar{
    float: left;
  }
  .API_Content{
    margin-left: 250px;
    padding: 30px 40px;
    /*box-shadow: 0 1px 2px 0 rgba(0,0,0,.05);*/
    /*border: solid 1px;*/
    /*border-radius: 2px;*/
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
  .nav_sidebar{
    position: fixed;
    top: 0;
    padding: 20px 20px;
    margin-top: 30px;
    max-height: 100%;
    overflow-y: auto;
    width: 230px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.1);
  }
}
.nav_sidebar li:active{
  color: #1e88e4;
  font-weight: bold;
  /*color: #1e88e5;*/
}
.nav_sidebar li:hover{
  color: #1e88e4;
  boder-bottom: thick dotted #ff0000;
}
.nav_sidebar > li:after{
  display: block;
  content: "";
  clear: both;
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
  margin: 0px 0px 8px 6px;
}
.node_tag:hover{
  color:#fff !important;;
}
a:hover{
  cursor: pointer;
}
</style>
