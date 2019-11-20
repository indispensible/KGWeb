<template>
  <div>
    <section>
      <div id="bg">
        <div class="container" id="introduction">
          <span class="slogan-title first-words">
            API Knowledge Graph&nbsp;&nbsp;
          </span>
          <el-button id="recently_apis" type="primary" style="position: absolute;right: 11px;top: 16px;z-index: 10000;" plain @click="display_apis" v-show="!drawer">Recently search APIs</el-button>
          <el-drawer
            title="Recently search APIs"
            :visible.sync="drawer">
            <div id="drawer_no_search" style="width: 95%;margin: 0px auto;" v-if="recently_apis_with_id.length <= 0">No recent search history.</div>
            <div v-for="(item, index) in recently_apis_with_id" v-else>
<!--              <el-button style="padding: 0px;width: 100%;margin: 8px 0px 0px;border: 0px;text-align: left;" @click="change_recently_search">-->
              <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id">
                <el-card class="inner_card" shadow="never" style="font-size: 19px!important;">
<!--                  <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id">-->
                    {{item.name}}
<!--                  </router-link>-->
                </el-card>
              </router-link>
<!--              </el-button>-->
            </div>
          </el-drawer>
          <div id="cursor" style="display: inline;">
            <span id="lvgang_title" style="color: rgb(213, 213, 213);font-size: 30px;"></span>
          </div>
<!--          <div id="typed-strings">-->
<!--            <p>API knowledge graph is an API centric knowledge base that links API elements (e.g., libraries, classes, methods, parameters), their descriptive knowledge (e.g., functionalities, directives), and related background knowledge (e.g., concepts about computer and programming). You can explore interesting API knowledge by searching and graph-based navigating. The current version supports JDK and Android APIs.</p>-->
<!--          </div>-->
          <div style="margin: 40px auto 50px;text-align: justify;" class="third-div" id="cursor_1">
            <span class="slogan-desc" id="typed">API knowledge graph is an API centric knowledge base that links API elements (e.g., libraries, classes, methods, parameters), their descriptive knowledge (e.g., functionalities, directives), and related background knowledge (e.g., concepts about computer and programming). You can explore interesting API knowledge by searching and graph-based navigating. The current version supports JDK and Android APIs.</span>
          </div>
          <div>
            <div style="display: inline;" class="second-div">
              <el-button class="dis" type="primary" plain @click="overview">Overview</el-button>
            </div>
            <!--            <el-button class="dis" type="primary" plain @click="discover">Discover</el-button>-->
<!--            <div style="display: inline;margin-left: 13px;" class="second-div">-->
<!--              <el-button class="dis" type="primary" plain @click="search">Search</el-button>-->
<!--            </div>-->
            <div style="display: inline;margin-left: 13px;" class="second-div">
              <el-button class="dis" type="primary" plain @click="timeline">Timeline</el-button>
            </div>
          </div>
          <div id="search-box" style="margin: 50px 2.5% 30px;display: flex;">
<!--            <el-input  placeholder="Please input your question for searching." v-model="query">-->
<!--&lt;!&ndash;              <el-button type="info" icon="el-icon-star-off" style="padding: 0px 15px;" slot="prepend" @click="example">Example</el-button>&ndash;&gt;-->
<!--              <el-button type="primary" icon="el-icon-search" slot="append" style="padding: 0px 15px;" @click="goSearch">Search</el-button>-->
<!--            </el-input>-->
<!--            <el-button style="margin-top: 20px;" type="primary" @click="example1">Example1</el-button>-->
<!--            <el-button style="margin-top: 20px;" type="primary" @click="example2">Example2</el-button>-->
            <el-tooltip class="item" effect="dark" :content="displayLabelMean" placement="top">
              <div>
                  <el-select v-model="select" slot="prepend" placeholder="Please Choose" @change="change_search">
                    <el-tooltip class="item" effect="dark" content="Input programming task to generate  hybrid  summaries for classes" placement="right">
                      <el-option label="API Summary" value="1"></el-option>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Input 2 APIs to generate comparison results" placement="right">
                      <el-option label="API Comparison" value="2"></el-option>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Input programming task to generate  task-solving activities" placement="right">
                      <el-option label="API Step Tutorial" value="3"></el-option>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="Search in Knowledge Graph" placement="right">
                      <el-option label="Entity Search" value="4"></el-option>
                    </el-tooltip>
                  </el-select>
              </div>
            </el-tooltip>
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="query"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="state"
              :placeholder="displayLabelMean"
              @select="handleSelect"
              @keyup.enter.native="secondVersionSearch">
              <template slot-scope="{ item }">
                <div class="name" :name="item.value" :label="item.label">
                  {{ item.value }}
                  <span style="float: right;color: rgb(90, 133, 197);font-size: 14px;">{{item.label}}</span>
                </div>
              </template>
            </el-autocomplete>
            <div>
              <el-button type="primary" icon="el-icon-search" slot="append" style="background-color: #f5f7fa;color: #909399;border: 1px solid #dcdfe6;height: 40px;border-bottom-left-radius: 0px;border-top-left-radius: 0px;" @click="secondVersionSearch">Search</el-button>
            </div>
          </div>
        </div>
      </div>
    </section>
<!--    <section>-->
<!--      <div style="width: 100%;background-color: #00162d;height: 200px;">-->
<!--        <div id="search-box" style="margin: 0px 18%;">-->
<!--          <el-input  placeholder="Please input your question for searching." v-model="query">-->
<!--            <el-button type="info" icon="el-icon-star-off" style="padding: 0px 15px;" slot="prepend">Example</el-button>-->
<!--            <el-button type="primary" icon="el-icon-search" slot="append" style="padding: 0px 15px;">Search</el-button>-->
<!--          </el-input>-->
<!--          &lt;!&ndash;        <el-button style="margin-top: 20px;" type="primary" @click="example">Example</el-button>&ndash;&gt;-->
<!--        </div>-->
<!--      </div>-->
<!--    </section>-->
    <div id="Statistics">
      <el-row type="flex" justify="center">
        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="5" :pull="1" class="third-div">
          <transition name="el-fade-in-linear">
            <el-card class="outer" shadow="hover">
              Most Popular
              <div class="inner" v-for="item in popular_data" :key="item.id">
                <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id">
<!--                <a target="_blank" :href="'http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/mindMap.html?id='  + item.id">-->
                  <el-card class="inner_card" shadow="never">
                    {{item.name}}
                  </el-card>
<!--                </a>-->
                </router-link>
              </div>
            </el-card>
          </transition>
        </el-col>

        <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="5" :push="1" class="third-div">
          <transition name="el-fade-in-linear">
            <el-card class="outer" shadow="hover">
              Recently Added
              <div class="inner" v-for="item in recent_data" :key="item.id">
<!--                <a target="_blank" :href="'http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/mindMap.html?id='  + item.id">-->
<!--                  <el-card class="inner_card" shadow="never">-->
<!--                    {{item.name}}-->
<!--                  </el-card>-->
<!--                </a>-->
                <router-link tag="a" target="_blank" :to="/KnowledgeData/ + item.id">
                  <el-card class="inner_card" shadow="never">
                    {{item.name}}
                  </el-card>
                </router-link>
              </div>
            </el-card>
          </transition>
        </el-col>

        <!--                <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="4" :push="1">-->
        <!--                        <el-card class="outer" shadow="hover" >-->
        <!--                            Statistics-->
        <!--                            <div class="inner" >-->
        <!--                                <el-card class="inner_card" shadow="never" v-for="(value,key) in statistics_data" :key="key">-->
        <!--                                    {{key}}:   <span style="font-family:arial;font-weight: 500;">{{value}}</span>-->
        <!--                                </el-card>-->
        <!--                            </div>-->
        <!--                        </el-card>-->
        <!--                </el-col>-->
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :xs="14" :sm="14" :md="14" :lg="14" :xl="12">
          <div id="myChart"
               style="width: 100%;height: 410px;margin: 45px auto 0px;background-color: #ffffff;border-radius: 25px;"></div>
        </el-col>
      </el-row>
    </div>

    <div id="show">
      <div id="system_tool">
        <div id="third_title">
          SYSTEMS & TOOLS
        </div>
        <el-row type="flex" justify="center">
<!--          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" :pull="1" id="entity_link_1">-->
<!--            <a target="_blank" href="http://bigcode.fudan.edu.cn/kg/fl_demo/index.html">-->
<!--              <el-card class="tools_box" style="height: 192px;">-->
<!--                <p style="line-height: 20px; font-size: 16px;vertical-align: middle;display: none;margin-bottom: 0px;" id="entity_link_2">Entity linking, also referred to as named entity linking, identifies the occurrence of a named entity in text and specific entity it is.</p>-->
<!--                <p style="margin-bottom: 0;" id="entity_link">Entity Link</p>-->
<!--              </el-card>-->
<!--            </a>-->
<!--          </el-col>-->
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="4" :pull="1" id="API_Summary_1">
            <router-link tag="a" target="_blank" to="/APIKGSummary">
              <el-card class="tools_box" style="height: 192px;">
                <p id="API_Summary_2" style="line-height: 20px; font-size: 16px;vertical-align: middle;margin-bottom: 0px;display: none;">We propose an approach for generating on-demand, extrinsic hybrid summaries for API classes, relevant to a programming task, formulated as a natural language query.</p>
                <p style="margin-bottom: 0;" id="API_Summary">API Summary</p>
              </el-card>
            </router-link>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="4" id="API_Difference_1">
            <a target="_blank" href="http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html">
              <el-card class="tools_box" style="height: 192px;">
                <p id="API_Difference_2" style="line-height: 20px; font-size: 16px;vertical-align: middle;margin-bottom: 0px;display: none;">We propose a knowledge graph-based approach APIComp that automatically extracts API comparison knowledge from API reference documentation to support the comparison of a pair of API classes or methods from different aspects.</p>
                <p style="margin-bottom: 0;" id="API_Difference">API Comparison</p>
              </el-card>
            </a>
          </el-col>
          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="4" :push="1" id="API_Task_1">
            <router-link tag="a" target="_blank" to="/task">
              <el-card class="tools_box" style="height: 192px;">
                <p id="API_Task_2" style="line-height: 20px; font-size: 16px;vertical-align: middle;margin-bottom: 0px;display: none;">Accomplishing a program task usually involves performing multiple activities in a logical order. Task-solving activities may have different relationships, such as subactivityof, precede-follow, and different attributes, such as location, condition, API, code.</p>
                <p style="margin-bottom: 0;" id="API_Task">API Step Tutorial</p>
              </el-card>
            </router-link>
          </el-col>
        </el-row>
<!--        <el-row type="flex" justify="center" style="margin: 25px auto;">-->
<!--          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" :pull="1" id="API_Difference_1">-->
<!--            <a target="_blank" href="http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html">-->
<!--              <el-card class="tools_box" style="height: 192px;">-->
<!--                <p id="API_Difference_2" style="line-height: 20px; font-size: 16px;vertical-align: middle;margin-bottom: 0px;display: none;">We propose a knowledge graph-based approach APIComp that automatically extracts API comparison knowledge from API reference documentation to support the comparison of a pair of API classes or methods from different aspects.</p>-->
<!--                <p style="margin-bottom: 0;" id="API_Difference">API Difference</p>-->
<!--              </el-card>-->
<!--            </a>-->
<!--          </el-col>-->
<!--          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" id="Associated_Concept_1">-->
<!--            <a target="_blank" href="http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/associatedConcept.html">-->
<!--              <el-card class="tools_box" style="height: 192px;">-->
<!--                <p id="Associated_Concept_2" style="line-height: 20px; font-size: 16px;vertical-align: middle;margin-bottom: 0px;display: none;">Visualize API related concept.</p>-->
<!--                <p style="margin-bottom: 0;" id="Associated_Concept">Associated Concept</p>-->
<!--              </el-card>-->
<!--            </a>-->
<!--          </el-col>-->
<!--          <el-col :xs="5" :sm="5" :md="5" :lg="5" :xl="5" :push="1">-->
<!--            <router-link tag="a" target="_blank" to="/APIKGSummary">-->
<!--              <el-card class="tools_box" style="display: none;">-->
<!--                <p style="margin-bottom: 0;">API Summary</p>-->
<!--              </el-card>-->
<!--            </router-link>-->
<!--          </el-col>-->
<!--        </el-row>-->
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import Typed from 'typed.js';
  import $ from 'jquery';

  export default {
    name: 'index',
    data() {
      return {
        drawer: false,
        query: '',
        show: true,
        top_number: 6,
        popular_data: [],
        recent_data: [],
        statistics_data: [],
        recently_apis_with_id: [],
        state: true,
        query_2_label: {},
        select: '1',
        label: "API Summary",
        displayLabelMean: "Input programming task to generate  hybrid  summaries for classes"
      }
    },
    watch: {
        recently_apis_with_id (val) {
            console.log(val)
        }
    },
    methods: {
      // change_recently_search () {
          // console.log(1)
          // this.drawer = false
          // let storage=window.localStorage
          // let storage_array =  storage["recent_apis"].split(":!:")
          // console.log(storage_array)
          // // storage_array.splice(storage_array.length - 1, 1)
          // this.recently_apis_with_id = []
          // for (let i in storage_array) {
          //     let storage_array_detail = storage_array[i].split("::")
          //     if(storage_array_detail[0] != "" && storage_array_detail[0] != undefined && storage_array_detail[0] != "undefined"){
          //         let item = {"name": storage_array_detail[0], "id": storage_array_detail[1]}
          //         this.recently_apis_with_id.push(item)
          //     }
          // }
      // },
      change_search () {
        //  "API Summary", "API Comparison", "API Step Tutorial", "Entity Search"
        let select_2_label = {
            1: "API Summary",
            2: "API Comparison",
            3: "API Step Tutorial",
            4: "Entity Search"
        }
        let select_2_mean = {
            1: "Input programming task to generate  hybrid  summaries for classes",
            2: "Input 2 APIs to generate comparison results",
            3: "Input programming task to generate  task-solving activities",
            4: "Search in Knowledge Graph",
        }
        this.label = select_2_label[parseInt(this.select)]
        this.displayLabelMean = select_2_mean[parseInt(this.select)]
      },
      querySearch(queryString, cb) {
          this.restaurants = this.loadAll();
          console.log(this.restaurants)
          let restaurants = this.restaurants;
          let results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
      },
      createFilter(queryString) {
          return (restaurant) => {
              return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
      },
      loadAll () {
          let recent_search = []
          // this.query_2_label = {}
          // 分类别展示
          let labels = ["API Summary", "API Comparison", "API Step Tutorial", "Entity Search"]
          let storage=window.localStorage
          // 解决ie下的localStorage不能实时变化的问题，可能是缓存问题
          // 方案一：有很小的不能实时更新的几率
          // let number_for_ie = Math.ceil(Math.random()*300000)
          // storage.setItem("all_null_item", number_for_ie)
          // 方案二：解决了方案一的bug
          let number_for_ie = Math.ceil(Math.random()*30) - 15
          if (number_for_ie == 0) {
              number_for_ie = 1
          }
          storage.setItem("all_null_item", storage.getItem("all_null_item") + number_for_ie)
          // 测试使用
          // storage.clear()
          if (storage["API Summary"] == '' || storage["API Summary"] == undefined) {
              storage["API Summary"] = "File to byte[] in Java"
          }
          if (storage["API Comparison"] == '' || storage["API Comparison"] == undefined) {
              storage["API Comparison"] = "StringBuffer vs  StringBuilder"
          }
          if (storage["API Step Tutorial"] == '' || storage["API Step Tutorial"] == undefined) {
              storage["API Step Tutorial"] = "How to create a toast"
          }
          if (storage["Entity Search"] == '' || storage["Entity Search"] == undefined) {
              storage["Entity Search"] = "Getting a File's MD5 Checksum in Java"
          }
          for (let m in labels) {
              let storage_array =  storage[labels[m]].split("::!::")
              for (let j in storage_array) {
                  if (storage_array[j] != "" && storage_array[j] != undefined && storage_array[j] != "undefined") {
                      recent_search.push({"value": storage_array[j], "label": labels[m]})
                      // this.query_2_label[storage_array[j]] = labels[m]
                  }
              }
          }
          // 整体展示
          let all_recent_search = []
          if (storage["all labels search"] == '' || storage["all labels search"] == undefined){
              storage["all labels search"] = "File to byte[] in Java:-!-:API Summary::!::StringBuffer vs  StringBuilder:-!-:API Comparison::!::How to create a toast:-!-:API Step Tutorial::!::Getting a File's MD5 Checksum in Java:-!-:Entity Search"
          }
          let storage_array =  storage["all labels search"].split("::!::")
          for (let j in storage_array) {
              if (storage_array[j] != "" && storage_array[j] != undefined && storage_array[j] != "undefined") {
                  let storage_array_child = storage_array[j].split(":-!-:")
                  if (storage_array_child[0] != "" && storage_array_child[0] != undefined && storage_array_child[0] != "undefined" && storage_array_child[1] != "" && storage_array_child[1] != undefined && storage_array_child[1] != "undefined") {
                      all_recent_search.push({"value": storage_array_child[0], "label": storage_array_child[1]})
                  }
              }
          }
          console.log(all_recent_search)
          return all_recent_search
      },
      loadAllForOneLabelSearch() {
          let recent_search = []
          let storage=window.localStorage
          if (storage["recent_search"] == '' || storage["recent_search"] == undefined || storage["recent_search"] == []) {
              storage["recent_search"] = "How to create a toast::!::StringBuffer vs  StringBuilder::!::StringBuilder"
          }
          let storage_array =  storage["recent_search"].split("::!::")
          for (let i in storage_array) {
              if (storage_array[i] != "" && storage_array[i] != undefined) {
                  recent_search.push({"value": storage_array[i]})
              }
          }
          console.log(recent_search)
          return recent_search
      },
      handleSelect(item) {
          console.log(item)
          // 没有左侧标签时运行
          // this.goSearch();
          // 四个label下的代码, "API Summary", "API Comparison", "API Step Tutorial", "Entity Search"
          if (item.label == "API Summary") {
              this.select = '1'
              let nextPage1 = this.$router.resolve({path: 'APIKGSummary', query: {"query": item.value}});
              window.open(nextPage1.href, '_blank');
          } else if (item.label == "API Comparison") {
              this.select = '2'
              window.open('http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html?query=' + encodeURIComponent(item.value), '_blank')
          } else if (item.label == "API Step Tutorial") {
              this.select = '3'
              let nextPage2 = this.$router.resolve({path: 'task', query: {"query": item.value}});
              window.open(nextPage2.href, '_blank');
          } else if (item.label == "Entity Search") {
              this.select = '4'
              let nextPage3 = this.$router.resolve({path: 'entitySearch', query: {"query": item.value}});
              window.open(nextPage3.href, '_blank');
          }
          let select_2_mean = {
              1: "Input programming task to generate  hybrid  summaries for classes",
              2: "Input 2 APIs to generate comparison results",
              3: "Input programming task to generate  task-solving activities",
              4: "Search in Knowledge Graph",
          }
          this.displayLabelMean = select_2_mean[parseInt(this.select)]
      },
      secondVersionSearch () {
          // console.log(this.query)
          if(this.query.trim() == '' || this.query == null) {
              alert("The input should not be empty!")
              // this.loading = false
          } else {
              if (this.label == "API Summary") {
                  let nextPage1 = this.$router.resolve({path: 'APIKGSummary', query: {"query": this.query}});
                  window.open(nextPage1.href, '_blank');
              } else if (this.label == "API Comparison") {
                  window.open('http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html?query=' + encodeURIComponent(this.query), '_blank')
              } else if (this.label == "API Step Tutorial") {
                  let nextPage2 = this.$router.resolve({path: 'task', query: {"query": this.query}});
                  window.open(nextPage2.href, '_blank');
              } else if (this.label == "Entity Search") {
                  let nextPage3 = this.$router.resolve({path: 'entitySearch', query: {"query": this.query}});
                  window.open(nextPage3.href, '_blank');
              }
          }
      },
      goSearch () {
        // console.log(this.query)
        if(this.query.trim() == '' || this.query == null) {
          alert("The input should not be empty!")
          // this.loading = false
        } else {
          let searchPage = this.$router.resolve({path: 'Search', query: {"query": this.query}});
          window.open(searchPage.href, '_blank');
          // window.open('http://bigcode.fudan.edu.cn/kg/index.html#/Search?query=' + encodeURI(this.query), '_blank')
          // let goSearch = this.$router.resolve({name: 'Search', params: { query: this.query}})
          // // console.log(goSearch)
          // window.open(goSearch.href,)
          // window.open(goSearch.href, '_blank')
        }
      },
      example1 () {
        this.query = 'How to create a toast'
      },
      example2 () {
        this.query = 'StringBuffer vs  StringBuilder'
      },
      display_apis (){
        let storage=window.localStorage
        // 解决了IE下localStorage不能实时更新的问题
        let number_for_ie = Math.ceil(Math.random()*30) - 15
        if (number_for_ie == 0) {
            number_for_ie = 1
        }
        storage.setItem("null_item", storage.getItem("null_item") + number_for_ie)

        console.log(storage.getItem("recent_apis"))
        console.log(storage)
        let storage_array =  storage.getItem("recent_apis").split(":!:")
        console.log(storage_array)
        // storage_array.splice(storage_array.length - 1, 1)
        this.recently_apis_with_id = []
        for (let i in storage_array) {
          let storage_array_detail = storage_array[i].split("::")
          if(storage_array_detail[0] != "" && storage_array_detail[0] != undefined && storage_array_detail[0] != "undefined"){
            let item = {"name": storage_array_detail[0], "id": storage_array_detail[1]}
            this.recently_apis_with_id.push(item)
          }
        }
        console.log(this.recently_apis_with_id)
        // if (this.recently_apis_with_id.length > 0) {
        //
        // }
        this.drawer = true
      },
      timeline() {
        window.open('http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/time.html', '_blank')
      },
      drawLine() {
        let _this = this
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        let xData = []
        let NumberData = []
        // let points = []
        // let number = 0
        for (let item in _this.statistics_data) {
          xData.push(item)
          NumberData.push(parseInt(_this.statistics_data[item]))
          // points.push({
          //   name: item,
          //   value: parseInt(_this.statistics_data[item]),
          //   xAxis: number,
          //   yAxis: parseInt(_this.statistics_data[item]) + 1
          // })
          // number++
        }
        // console.log(xData)
        // console.log(NumberData)
        myChart.setOption({
          title: {
            text: 'Statistics',
            x: 'center',
            // left: '39.5%',
            textStyle: {
              fontSize: 23,
              fontFamily: "Raleway, Helvetica, Arial, sans-serif"
            },
            top: 8
          },
          // color: ['#2f4554'],
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            data: xData
          },
          yAxis: {},
          series: [{
            name: 'amount',
            type: 'bar',
            barWidth: '76%',
            data: NumberData,
            itemStyle: {
              normal: {
                label: {
                  show: true,
                  position: 'top',
                  textStyle: {
                    color: '#333333',
                    fontSize: 14
                  }
                },
                barBorderRadius: [4, 4, 0, 0]
              }
            }
            // markPoint: {
            //   symbol: 'none',
            //   data: points
            // }
          }]
        });
      },
      overview() {
        // let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/overview.html"
        // window.open(url, '_blank')
        let overview = this.$router.resolve({path: 'Overview'})
        window.open(overview.href, '_blank')
      },
      discover() {
        let discover = this.$router.resolve({path: 'Discover'})
        window.open(discover.href, '_blank')
      },
      search() {
        let search = this.$router.resolve({path: 'Search'})
        window.open(search.href, '_blank')
      },
      hover_p () {
        let id_name_list = ["API_Summary", "API_Difference", "API_Task"]
        // let new_description = ["test1", "描述相应功能2", "描述相应功能3", "描述相应功能4", "描述相应功能5"]
        for (let item in id_name_list) {
          let id_name = id_name_list[item]
          let parent_name = id_name + "_1"
          let second_p = id_name + "_2"
          let nodeParent = document.getElementById(parent_name)
          let nodeP = document.getElementById(id_name)
          let secondP = document.getElementById(second_p)
          // let oldValue = nodeP.innerHTML;
          nodeParent.onmouseenter = function() {
            setTimeout(function(){
              // nodeP.innerHTML = new_description[item]
              nodeP.style.display = "none"
              secondP.style.display = "inline-block"
              // $("#"+second_p).fadeOut(380, function () {
              //     $("#" + second_p).show(380).css("display", "inline-block")
              // })
            }, 180);
          };
          nodeParent.onmouseleave = function() {
            // nodeP.innerHTML=oldValue;
            setTimeout(function(){
              // nodeP.innerHTML = oldValue
              secondP.style.display = "none"
              //   $("#"+second_p).fadeOut(320, function () {
              //       $("#"+id_name).fadeIn().css("display", "")
              //   })
              nodeP.style.display = ""
              //   $("#"+id_name).show().css("display", "")
            }, 180);
          }
        }
      }
    },
    // created: function () {
    //     window.addEventListener('setItem', (e) => {
    //         console.log(e);
    //     });
    // },
    mounted() {
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getPopularNodes/')
        .then(response => {
          (this.popular_data = response.data.nodes)
        })
        .catch(error => console.log(error))
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getNewNodes/', {top_number: this.top_number})
        .then(response => {
          (this.recent_data = response.data.nodes)
        })
        .catch(error => console.log(error))
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getKnowledgeGraphMetaData/')
        .then(response => {
          this.statistics_data = response.data
          console.log(this.statistics_data)
          this.drawLine()
        })
        .catch(error => console.log(error))
      let options = {
        strings: ['CodeWisdom', "Programmer's Assistant"],
        typeSpeed: 38,
        showCursor: true,
        backSpeed: 38,
        loop: true
      };
      new Typed('#lvgang_title', options);
      this.hover_p()
      let storage=window.localStorage;
      console.log(storage)
        // storage.clear()
      if (storage["recent_apis"] == '' || storage["recent_apis"] == undefined) {
        storage["recent_apis"] = ""
        // document.getElementById("recently_apis").style.display = "none"
      }
    }
  }
</script>

<style scoped>
  @import "assets/font/Raleway.css";

  >>> .el-input--suffix > input {
    margin-right: 15px;
    padding-right: 15px;
  }
  >>> .el-input--suffix > span {
    right: 3px;
  }
  >>> .el-input__icon {
    width: 22px;
  }
  .name{
    font-size: 15.3px;
  }
  >>>.el-input__inner:focus {
    border-color: #909399;
    outline: 0;
  }
  >>>.el-input>input {
    /*border-bottom-right-radius: 0px;*/
    /*border-top-right-radius: 0px;*/
    border-radius: 0px;
  }
  >>>.el-autocomplete {
    width: 100%;
  }
  /*>>> canvas {*/
  /*  margin-left: 8px!important;*/
  /*}*/

  >>> .el-drawer {
    overflow-y: scroll;
  }

  #search-box{
    margin: 0 30%;
  }

  >>> html,body {
    height: 100%;
  }

  >>> #cursor_1 .typed-cursor {
    color: rgba(196, 227, 255, 0.8);
    font-size: 26px;
  }

  >>> #cursor .typed-cursor {
    color: rgb(213, 213, 213);
    font-size: 30px;
  }

  @keyframes moveTo
  {
    from {left:50px;}
  }

  @-webkit-keyframes moveTo /*Safari and Chrome*/
  {
    from {left:50px;}
  }

  >>> .fly_in {
    position: absolute;
    animation:moveTo 3s;
    -webkit-animation:moveTo 3s; /*Safari and Chrome*/
  }

  /*自定义一个透明度从0到1的动画，它的名称是fade-in*/
  @keyframes fade-in{
    0%{ opacity: 0;}
    100%{opacity:1;}
  }
  @-webkit-keyframes fade-in{
    0%{ opacity: 0;}
    100%{opacity:1;}
  }
  @-ms-keyframes fade-in{
    0%{ opacity: 0;}
    100%{opacity:1;}
  }
  @-o-keyframes fade-in{
    0%{ opacity: 0;}
    100%{opacity:1;}
  }
  @-moz-keyframes fade-in{
    0%{ opacity: 0;}
    100%{opacity:1;}
  }
  .first-words{
    opacity: 0;      /*实先规定文字的状态是不显示的*/
    animation: fade-in 1.5s ease 0s 1;
    -webkit-animation: fade-in 1.5s ease 0s 1;
    -moz-animation: fade-in 1.5s ease 0s 1;
    -o-animation: fade-in 1.5s ease 0s 1;
    -ms-animation: fade-in 1.5s ease 0s 1;

    /*规定动画的最后状态为结束状态*/
    animation-fill-mode:forwards;
    -webkit-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
  }

  .second-div{
    opacity: 0;      /*实先规定文字的状态是不显示的*/
    animation: fade-in 2.8s ease 0s 1;
    -webkit-animation: fade-in 2.8s ease 0s 1;
    -moz-animation: fade-in 2.8s ease 0s 1;
    -o-animation: fade-in 2.8s ease 0s 1;
    -ms-animation: fade-in 2.8s ease 0s 1;

    /*规定动画的最后状态为结束状态*/
    animation-fill-mode:forwards;
    -webkit-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
  }

  .third-div{
    opacity: 0;      /*实先规定文字的状态是不显示的*/
    animation: fade-in 2.3s ease 0s 1;
    -webkit-animation: fade-in 2.3s ease 0s 1;
    -moz-animation: fade-in 2.3s ease 0s 1;
    -o-animation: fade-in 2.3s ease 0s 1;
    -ms-animation: fade-in 2.3s ease 0s 1;

    /*规定动画的最后状态为结束状态*/
    animation-fill-mode:forwards;
    -webkit-animation-fill-mode: forwards;
    -o-animation-fill-mode: forwards;
    -ms-animation-fill-mode: forwards;
    -moz-animation-fill-mode: forwards;
  }

  #bg {
    padding: 20px 0;
    width: 100%;
    background: linear-gradient(45deg, #0B4182 1%, #1e88e5 64%, #40BAF5 97%);
    /*position:fixed;*/
    /*max-height: 600px;*/
    /*top: 53px;*/
  }

  #introduction {
    min-height: 400px;
    margin: 50px auto;
    margin-bottom: 30px;
  }

  .slogan-title {
    max-width: 610px;
    color: #fff;
    font-size: 42px;
    line-height: 48px;
    font-weight: bold;
    text-transform: capitalize;
  }

  .slogan-desc {
    margin: 40px auto;
    margin-bottom: 50px;
    color: rgba(196, 227, 255, 0.8);
    font-size: 26px;
    line-height: 28px;
    text-align: justify;
  }

  .el-button--primary.is-plain {
    color: #fff;
    font-weight: bold;
    font-size: 16px;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(64, 158, 255, 0) !important;
  }

  .el-button--primary.is-plain:hover {
    /*border-color: rgba(255,255,255,0.8) !important;*/
    background: #1e88e5 !important;
    border-color: #1e88e5;
  }

  .el-button--primary.is-plain:focus {
    background: #1e88e5 !important;
    border-color: #1e88e5;
  }

  .dis:hover {
    transition: all .5s;
    transform: translateY(-5px);
  }

  #Statistics {
    width: 100%;
    /*height: 600px;*/
    margin: 0 auto;
    padding: 50px;
  }

  .el-row {
    margin: 20px auto;
  }

  .el-col {
    text-align: center;
    border: #0f0f0f;
    font-size: 18px;
  }

  .el-card {
    border-radius: 20px;
  }

  .el-card:hover {
    boder: 1px solid #ebeef5 !important;
    border-radius: 15px;
  }

  .outer {
  }

  .outer:hover {
    margin-top: -5px;
  }

  .el-card__body {
    font-weight: bold;
    text-align: center;
  }

  .inner > a > .el-card > .el-card__body {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    -ms-text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  #Statistics > div > div.el-col.el-col-24.el-col-pull-1.el-col-xs-6.el-col-sm-6.el-col-md-6.el-col-lg-6.el-col-xl-4 > div > div > div:nth-child(6) > a > div > div {
    overflow: hidden !important;
    text-overflow: ellipsis !important;
    -ms-text-overflow: ellipsis !important;
    white-space: nowrap !important;
  }

  .transition-box {
    height: 480px;
    padding: 20px auto;

  }

  .inner {
    /*font-weight: bold;*/
  }

  a:hover {
    text-decoration: none;
  }

  .inner_card {
    font-weight: normal;
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

  #show {
    width: 100%;
    /*height: 600px; */
    padding-top: 70px;
    padding-bottom: 75px;
    /*background-color: #616366;*/
    background-image: linear-gradient(225deg, #39444d, #22292e 88%);
  }

  #third_title {
    width: 300px;
    font-size: 28px;
    font-weight: bold;
    color: #fff;
    margin: 0 auto;;
    margin-bottom: 40px;
    text-align: center;
  }

  .tools_box {
    text-align: center;
    line-height: 150px;
    min-height: 150px;
  }

  /*.tools_box:hover {*/
  /*  border: none;*/
  /*  color: #fff;*/
  /*  background-color: #1e88e5;*/
  /*  transition: all .5s;*/
  /*  transform: translateY(-5px);*/
  /*  !*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)*!*/
  /*}*/

  .tools_box:hover {
    border: none;
    color: #fff;
    background-color: #1e88e5;
    transition: all .5s;
    transform: translateY(-5px);
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)*/
  }

  /*#entity_link {*/
  /*  text-align: center;*/
  /*  line-height: 150px;*/
  /*  min-height: 150px;*/
  /*  cursor: not-allowed;*/
  /*  background-color: #f5f7fa;*/
  /*  border-color: #e4e7ed;*/
  /*}*/

  #Statistics {
    background-color: #f5f6fc;
  }
</style>
