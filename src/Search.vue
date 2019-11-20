<template>
    <div id="search" class="top_search">
      <h1  id="title" style="text-align: center">
        <router-link style="color: #ffffff;" to="/">
          Search
        </router-link>
      </h1>
      <el-button type="danger" style="position: fixed;right: 12px;top: 16px;" plain @click="display_labels">Filter</el-button>
      <div id="search_div" style="position: fixed;right: 12px;bottom: 15px;display: none;">
        <el-button type="primary" icon="el-icon-caret-top" circle @click="changeHash('#search')"></el-button>
      </div>
      <div style="position: fixed;left: 20px;top: 70px;">
<!--        <el-tooltip class="item" effect="dark" content="Back to search" placement="right">-->
<!--          <el-button id="search_button" type="danger" plain style="margin:0px 0px 15px;width: 144px;"  @click="changeHash('#search')">Search</el-button>-->
<!--        </el-tooltip>-->
        <el-tooltip class="item" effect="dark" content="API summary under this task" placement="right">
          <el-button id="summary_button" type="warning" style="margin:0px 0px 15px;width: 144px;display: none;"  plain @click="changeHash('#summary')">API Summary</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="How to accomplishing program task" placement="right">
          <el-button id="button_task" type="info" style="margin:0px 0px 15px;width: 144px;display: none;"  plain @click="changeHash('#task')">API Task</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="Compare these APIs" placement="right">
          <el-button id="comparison_button" type="success" style="display: none;margin:0px 0px 15px;width: 144px;"  plain @click="changeHash('#comparison')">API Comparison</el-button>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="Search in API Knowledge Graph" placement="right">
          <el-button type="primary" id="related_api_button" style="margin:0px 0px 15px;width: 144px;display: none;"  plain @click="changeHash('#node-content')">Entity Search</el-button>
        </el-tooltip>
      </div>
      <el-drawer
        title="These are our labels, and you can filter examples by labels."
        :visible.sync="drawer">
<!--        <span>These are our labels, and you can click on any of them to see an example.</span>-->
        <span class="label-radio" :class="{ 'active' : label === 'all'}" @click="query_label('all')">all</span>
        <span class="label-radio" v-for="(item, index) in publicLabel" :key="index" :class="{ 'active' : label === item.name}" @click="query_label(item.name)">{{item.name}}</span>
      </el-drawer>
<!--      导航栏-->

      <div id="search-box" style="margin: 70px 20%;display: flex;">
<!--        <el-input  placeholder="Please input your question for searching." v-model="query" @keyup.enter.native="search">-->
<!--&lt;!&ndash;          <el-button type="info" icon="el-icon-star-off" style="padding: 0px 15px;" slot="prepend" @click="example">Example</el-button>&ndash;&gt;-->
<!--          <el-button type="primary" icon="el-icon-search" slot="append" style="padding: 0px 15px;" @click="search">Search</el-button>-->
<!--        </el-input>-->
        <el-autocomplete
          popper-class="my-autocomplete"
          v-model="query"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="state"
          placeholder="Please input your question for searching."
          @select="handleSelect">
<!--          <el-button type="primary" icon="el-icon-search" slot="append" style="padding: 0px 15px;" @click="search">Search</el-button>-->
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <div>
          <el-button id="search_button_primary" type="primary" icon="el-icon-search" slot="append" style="background-color: #f5f7fa;color: #909399;border: 1px solid #dcdfe6;height: 40px;border-bottom-left-radius: 0px;border-top-left-radius: 0px;" @click="search">Search</el-button>
        </div>
<!--        <el-button style="margin-top: 20px;" type="primary" @click="example1">Example1</el-button>-->
<!--        <el-button style="margin-top: 20px;" type="primary" @click="example2">Example2</el-button>-->
      </div>
      <div id="comparison" v-loading="loadingComparison" style="background-color: rgb(240, 255, 223);border-radius: 5px;width: 880px;margin: 15px auto;padding:27px 0px 15px;display: none;">
        <div style="margin-left: 30px;">
          <ul style="margin-right: 8px;">
            <li v-for="item in comparisons"><pre style="white-space: pre-wrap">{{item}}</pre></li>
          </ul>
          <el-tag  effect="dark" style="font-size: 18px;height: 38px;line-height: 36px;border-radius: 5px;" @click="more_comparison">Comparison</el-tag>
          <el-tag class="graph-button"  style="float: right;margin-right: 28px;margin-top: 10px;" @click="more_comparison">More comparisons</el-tag>
        </div>
      </div>
      <div id="summary" v-loading="loadingSummary" style="background-color: rgb(255, 237, 210);border-radius: 5px;width: 880px;margin: 15px auto;padding:27px 0px 15px;display: none;">
        <div style="margin-left: 30px;">
<!--          <h3 style="text-align: center;">API summary under this task.</h3>-->
          <div style="margin-right: 7px;" v-for="related_class_method_1 in all_related_class_method">
            <div v-for="related_class_method in related_class_method_1">
              <div class="introduction" v-for="(related, index) in related_class_method">
                <p class="intro_name" style="color: #007bff;font-weight: bold;" v-if="related['url'] == ''">{{index}}</p>
                <a class="intro_name" style="color: #007bff;font-weight: bold;" v-else :href="related['url']" target="_blank">{{index}}</a>
                <ol>
                  <li v-for="(related_number) in related['sentence']">{{related_number}}</li>
                </ol>
              </div>
            </div>
          </div>
          <el-tag  effect="dark" style="font-size: 18px;height: 38px;line-height: 36px;border-radius: 5px;" @click="more_summary">Summary</el-tag>
          <el-tag class="graph-button"  style="float: right;margin-right: 28px;margin-top: 10px;" @click="more_summary">More summaries</el-tag>
        </div>
      </div>
      <div id="task" v-loading="loadingTask" style="background-color: rgb(214, 227, 240);border-radius: 5px;width: 880px;margin: 15px auto;padding:27px 0px 15px;display: none;">
        <div style="margin-left: 30px;">
          <h3>{{task_title}}</h3>
          <ul>
            <li v-for="item in task_step"><span style="color: #ff004d;">{{item[0]}}</span> {{item[1]}}</li>
          </ul>
          <pre>{{task_code}}</pre>
          <el-tag  effect="dark" style="font-size: 18px;height: 38px;line-height: 36px;border-radius: 5px;" @click="more_task">Task</el-tag>
          <el-tag class="graph-button"  style="float: right;margin-right: 28px;margin-top: 10px;" @click="more_task">More tasks</el-tag>
        </div>
      </div>
      <div id="node-content" v-loading="loading">
        <div v-for="(item, index) in nodes" :key="index" class="node">
          <span class="number">{{current_number + index + 1}}</span>
          <div class="node_block">
            <h4 class="name" @click="detail(item.id)" :title="item.name">{{item.name}}</h4>
            <el-tag v-for="(label, i) in item.labels" type="item.type" effect="dark" :key="i">{{label}}</el-tag>
            <div>
              <button class="graph-button" @click="graph(item.id)">Graph</button>
              <button class="graph-button" @click="mindmap(item.id)" style="margin-left: 12px;" v-show="item.mindmap == 1">Mindmap</button>
            </div>
          </div>
          <button class="detail-button" @click="detail(item.id)">Encyclopedia</button>
        </div>
        <div ref="page" style="margin: 0px auto;display: none;">
          <el-pagination
            style="text-align: center;margin-top: 28px;"
            @current-change="change_data"
            background
            layout="prev, pager, next"
            :page-size="10"
            :current-page="current_page"
            :total="all_nodes_number">
          </el-pagination>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import $ from 'jquery'
export default {
  name: 'Search',
  data () {
    return {
      select: '',
      input5: '',
      loading: false,
      query: '',
      nodes: [],
      drawer: false,
      publicLabel: [],
      label: '',
      all_nodes: {},
      all_nodes_number: 0,
      current_number: 0,
      current_page: 1,
      comparison: [],
      task_title: '',
      task_step: [],
      task_code: '',
      all_related_class_method: {},
      api_1: '',
      api_2: '',
      comparisons: [],
      restaurants: [],
      state: true,
      loadingSummary: false,
      loadingTask: false,
      loadingComparison: false
    }
  },
  methods: {
    handleScroll () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
        // console.log(scrollTop)
        if (scrollTop >= 400) {
            // document.getElementById("search_div").style.display = ""
            $("#search_div").fadeIn()
        } else {
            // document.getElementById("search_div").style.display = "none"
            $("#search_div").fadeOut()
        }
    },
    changeHash (idName) {
        // $('html, body').animate({
          document.querySelector(idName).scrollIntoView({
              behavior: "smooth",
              block: "start"
          })
        // }, 600);
    },
    deal_recent_search () {
        let query = this.query.replace(/(^\s*)|(\s*$)/g, "")
        let storage=window.localStorage
        let storage_array = storage["recent_search"].split("::!::")
        let index = storage_array.indexOf(query)
        if (index >= 0) {
            storage_array.splice(index, 1)
        }
        storage_array.unshift(query)
        storage_array = storage_array.slice(0,101)
        storage["recent_search"] = storage_array.join("::!::")
        console.log(storage)
    },
    querySearch(queryString, cb) {
        this.restaurants = this.loadAll();
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
    loadAll() {
        let recent_search = []
        let storage=window.localStorage
        // storage["recent_search"] = ''
        console.log(storage)
        if (storage["recent_search"] == '' || storage["recent_search"] == undefined || storage["recent_search"] == []) {
            storage["recent_search"] = "How to create a toast::!::StringBuffer vs  StringBuilder::!::StringBuilder"
        }
        let storage_array =  storage["recent_search"].split("::!::")
        console.log(storage_array)
        for (let i in storage_array) {
            if (storage_array[i] != "" && storage_array[i] != undefined) {
                recent_search.push({"value": storage_array[i]})
            }
        }
        return recent_search
    },
    handleSelect(item) {
        console.log(item);
        this.search();
    },
    more_task () {
        // this.$router.push({path: 'task', query: {"query": encodeURI(document.getElementById("task").getAttribute("query"))}})
        let taskPage = this.$router.resolve({path: 'task', query: {"query": document.getElementById("task").getAttribute("query")}});
        window.open(taskPage.href, '_blank');
      // window.open('http://bigcode.fudan.edu.cn/kg/index.html#/task?query=' + encodeURI(document.getElementById("task").getAttribute("query")), '_blank')
    },
    more_comparison() {
      window.open('http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/index.html?api_1_name=' + this.api_1 + "&api_2_name=" + this.api_2, '_blank')
    },
    more_summary () {
      window.open('http://bigcode.fudan.edu.cn/kg/index.html#/APIKGSummary?query=' + encodeURI(document.getElementById("summary").getAttribute("query")), '_blank')
    },
    search_task () {
      this.task_code = ''
      this.task_step = []
      this.task_title = ''
      // document.getElementById("task").style.display = "none"
      document.getElementById("task").style.display = ""
      this.loadingTask = true
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/Task/', {"query": this.query, "top_number":1})
        .then(response => {
          this.loadingTask = false
          if (response.data != {} && response.data != undefined && response.data != '' && this.api_1 == "" && this.api_2 == ""){
            document.getElementById("button_task").style.display = "block"
            document.getElementById("task").style.display = ""
            document.getElementById("task").setAttribute("query", this.query)
            response.data = response.data[0]
            console.log(response.data)
            try {
              this.task_code  = response.data["sample_code"][0].replace(/^\s*|\s*$/g,"").replace(/&nbsp;/g, " ")
            } catch (e) {
              this.task_code  = ""
            }
            this.task_title = response.data["title"]
            let tasks = []
            let deal_tasks = []
            for (let i in response.data) {
              if (i != "sample_code" && i != "title") {
                tasks = response.data[i]
              }
            }
            for (let i in tasks) {
              for (let j in tasks[i]) {
                deal_tasks.push(tasks[i][j])
              }
            }
            this.task_step = deal_tasks
          } else {
            document.getElementById("task").style.display = "none"
          }
          // console.log(this.task_code)
          // console.log(this.task_title)
          // console.log(deal_tasks)
        })
        .catch(error => console.log(error))
    },
    search_comparison () {
      this.api_1 = ""
      this.api_2 = ""
      this.comparisons = []
      // document.getElementById("comparison").style.display = "none"
      document.getElementById("comparison").style.display = ""
      this.loadingComparison = true
      document.getElementById("task").style.display = "none"
      document.getElementById("summary").style.display = "none"
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/apiDiff/ComparisonSearch/', {"query": this.query})
        .then(response => {
            this.loadingComparison = false
            if (response.data['is_compare_query'] == 0) {
              document.getElementById("comparison").style.display = ""
              document.getElementById("task").style.display = "none"
              document.getElementById("comparison_button").style.display = "block"
              // document.getElementById("comparison").setAttribute("query", this.query)
              // document.getElementById("summary").style.display = "none"
              this.api_1 = response.data["first_api"]
              this.api_2 = response.data["second_api"]
              let types = ["Concept Classification", "Membership", "Functionality", "Characteristic"]
              let comparisons = []
              let group_item_collection = response.data["group_item_collection"]
              let num = 0
              for (let i in types) {
                let now_num = 0
                for (let j in group_item_collection){
                  if (group_item_collection[j]["knowledge_type"] == types[i] && !group_item_collection[j]["are_they_same"]) {
                    let threshold = 2
                    if (num >= 4) {
                      threshold = 1
                    }
                    now_num += 1
                    if (now_num > threshold) {
                      break
                    } else {
                      num += 1
                      console.log(group_item_collection[j])
                      let string_comparison = this.api_1 + ": " + group_item_collection[j]["first_api_knowledge_list"][0]["node_info"]["name"].replace(/(^\s*)|(\s*$)/g, "") + ";\n" + this.api_2 + ": " + group_item_collection[j]["second_api_knowledge_list"][0]["node_info"]["name"].replace(/(^\s*)|(\s*$)/g, "")
                      comparisons.push(string_comparison)
                    }
                  }
                }
              }
              console.log(comparisons)
              this.comparisons = comparisons
            } else {
              document.getElementById("comparison").style.display = "none"
              this.search_task()
              this.search_summary()
            }
        })
        .catch(error => console.log(error))
    },
    search_summary () {
      this.all_related_class_method = {}
      // document.getElementById("summary").style.display = "none"
      document.getElementById("summary").style.display = ""
      this.loadingSummary = true
      axios
        .post('http://bigcode.fudan.edu.cn/kg-debug/APISummary/createAPISummary/', {"query": this.query, "class_name_or_number": "1"})
        .then(response => {
            console.log(response.data)
            this.loadingSummary = false
            if(response.data != {} && response.data[0] != [] && response.data[0].length > 0) {
              // console.log('ok')
              // if (this.api_1 == "" && this.api_2 == "") {
                document.getElementById("summary_button").style.display = "block"
                document.getElementById("summary").style.display = ""
                document.getElementById("summary").setAttribute("query", this.query)
                this.all_related_class_method = response.data
                console.log(this.all_related_class_method)
              // }
            } else {
                document.getElementById("summary").style.display = "none"
            }
        })
        .catch(error => console.log(error))
    },
    first_get_data () {
      let _this = this
      let number = 0
      _this.$refs.page.style.display = ""
      _this.current_number = 0
      _this.all_nodes_number = 0
      _this.current_page = 1
      for(let index in _this.all_nodes){
        number += 1
      }
      _this.all_nodes_number = number
      // console.log(number)
      _this.nodes = []
      if (number >= 10) {
        for(let index in _this.all_nodes){
          // console.log(index)
          if (index > 9) {
            break
          } else {
            _this.nodes.push(_this.all_nodes[index])
          }
        }
      } else {
        for(let index in _this.all_nodes){
          _this.nodes.push(_this.all_nodes[index])
        }
      }
    },
    change_data (val) {
      let _this = this
      let number = (val - 1) * 10
      _this.$refs.page.style.display = ""
      _this.current_page = val
      _this.current_number = number
      _this.nodes = []
      if (number + 10 > _this.all_nodes_number) {
        let num = number
        for (let index = 0; index < _this.all_nodes_number - num; index++){
          _this.nodes.push( _this.all_nodes[number])
          number++
        }
      } else {
        for (let index = 0; index < 10; index++){
          _this.nodes.push( _this.all_nodes[number])
          number++
        }
      }
    },
    query_label (label) {
      // if (label === 'all') this.label = null
      this.label = label
      // console.log(label)
      this.loading = true
      if (this.query.replace(/(^\s*)|(\s*$)/g, "") == '' || this.query == null) {
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/getRandomNodesByLabel/', {label: this.label, max_num: 666})
          .then(response => {
            // this.nodes = response.data.nodes
            this.all_nodes = response.data.nodes
            // console.log(this.nodes)
            this.first_get_data()
            this.loading = false
            this.loading = false
            this.drawer = false
            // console.log(this.nodes)
          })
          .catch(error => console.log(error))
      } else {
        // console.log(this.label)
        let labelName = ""
        if (this.label != "all") {
          labelName = this.label
        }
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/searchWithBM25/', {query: this.query.replace(/(^\s*)|(\s*$)/g, ""), max_num: 666, label: labelName})
          .then(response => {
            // this.nodes = response.data.nodes
            this.all_nodes = response.data.nodes
            // console.log(this.nodes)
            this.first_get_data()
            this.loading = false
            this.loading = false
            this.drawer = false
            // console.log(this.nodes)
          })
          .catch(error => console.log(error))
      }
    },
    display_labels () {
      this.drawer = true
      // let spanBody = document.getElementsByClassName("el-drawer__body")
      // spanBody[0].style.padding = "20px"
      // let spanTitle = document.getElementById("el-el-drawer__title")
      // console.log(spanTitle)
      // spanTitle[0].style.color = "#1d1e1f"
    },
    getPublicLabels () {
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getPublicLabels/')
        .then(response => {
          this.publicLabel = response.data
        })
        .catch(error => console.error(error))
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    search () {
      this.loading = true
      this.label = "all"
      if(this.query.trim() == '' || this.query == null) {
        alert("The input should not be empty!")
        this.loading = false
      } else {
        document.getElementById("button_task").style.display = "none"
        document.getElementById("related_api_button").style.display = "none"
        document.getElementById("summary_button").style.display = "none"
        document.getElementById("comparison_button").style.display = "none"
        // this.search_task()
        // this.search_summary()
        this.search_comparison()
        this.deal_recent_search()
        // document.getElementById("app").click()
        axios
          .post('http://bigcode.fudan.edu.cn/kg/api/graph/searchWithBM25/', {query: this.query, "max_num":666})
          .then(response => {
            this.all_nodes = response.data.nodes
            document.getElementById("related_api_button").style.display = "block"
            // console.log(this.nodes)
            this.first_get_data()
            this.loading = false
          })
        // alert(this.input5)
        // this.loading = true
      }
    },
    openInfo () {
      this.$notify.info({
        title: 'Notification',
        position: 'bottom-right',
        message: 'You can click the node to see the information about it.'
      })
    },
    detail (id) {
      // this.$router.push({name: 'KnowledgeData', params: {id: id}})
      let detail = this.$router.resolve({name: 'KnowledgeData', params: {id: id}})
      window.open(detail.href, '_blank')
    },
    example1 () {
      this.query = 'How to create a toast'
    },
    example2 () {
      this.query = 'StringBuffer vs  StringBuilder'
    },
    graph (id) {
      // this.$router.push({name: 'ElementGraph', params: {id: id}})
      let graph = this.$router.resolve({name: 'ElementGraph', params: {id: id}})
      window.open(graph.href, '_blank')
    },
    mindmap (id) {
      // this.$router.push({name: 'ElementGraph', params: {id: id}})
      // let graph = this.$router.resolve({name: 'ElementGraph', params: {id: id}})
      // window.open(graph.href, '_blank')
      let url = "http://bigcode.fudan.edu.cn/kg/APISummary/APIDifference/mindMap.html?id=" + id
      window.open(url, '_blank')
    }
  },
  mounted () {
    this.$nextTick(function () {
      let divApp = document.getElementById("app")
      divApp.style.backgroundColor = "#00162d"
      window.addEventListener('scroll', this.handleScroll)
      // console.log(spanTitle)
      // #1d1e1f
      this.getPublicLabels()
      let url = window.location.href;
      let query = decodeURI(url.split("?query=")[1])
      // console.log(query)
      if (query != '' && query != undefined && query != "undefined") {
        this.query = query
        this.search()
      } else {
        this.query = ""
      }
    })
  }
}
</script>

<style scoped>

  #button_task:hover{
    background-color: rgb(214, 227, 240);
    color: #000000;
  }

  >>>.el-loading-mask {
    background-color: rgba(255,255,255,.75);
  }
  >>>.el-input__inner:focus {
    border-color: #909399;
    outline: 0;
  }
  >>>.el-input>input {
    border-bottom-right-radius: 0px;
    border-top-right-radius: 0px;
  }
  >>>.el-autocomplete {
    width: 100%;
  }
  >>> .el-drawer__header {
    color: #1d1e1f;
  }
  .label-radio{
    text-transform: capitalize;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    margin-top: 13px;
    margin-right: 4px;
    padding: 1px 0;
    transition: .2s;
    color: #6c6e7a;
    border-bottom: 2px solid transparent;
    margin-left: 21px;
  }
  .active{
    font-weight: 700;
    color: #4c5fe2;
    border-bottom-color: #4c5fe2;
  }
  .label-radio:hover{
    text-decoration: none;
    color: #4c5fe2;
    border-bottom-color: #4c5fe2;
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
  #search {
    padding-top: 30px;
    background-color: #00162d;
  }
  #search-box{
    margin: 0 20%;
  }
  .el-input__inner{
    outline: none;
  }
  #node-content{
    width: 880px;
    margin: 0px auto;
    background-color: #00162d;
    padding-top: 10px;
    padding-bottom: 30px;
  }
  .node{
    position: relative;
    height: 200px;
    /*border-top: 1px solid #e5e9ef;*/
    background-color: #f9f9f9;
    border-radius: 4px;
    padding: 20px 15px 10px 82px;
    overflow: hidden;
    margin-top: 30px;
  }
  /*.node:hover{*/
  /*  !*transform: scale(1.02);*!*/
  /*  !*box-shadow: 0 2px 8px rgba(0,0,0,.3);*!*/
  /*  border-radius: 4px;*/
  /*  z-index: 100;*/
  /*}*/
  .number{
    font-weight: 700;
    line-height: 64px;
    position: absolute;
    top: 5px;
    left: 0;
    display: block;
    width: 82px;
    text-align: center;
    color: #000;
    font-size: 35px;
  }
  .node_block{
    max-width: 600px;
    position: relative;
    float: left;
  }
  .el-tag{
    margin-right: 10px;
    user-select: none;
    margin-top: 10px;
  }
  .el-tag:hover{
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
  }
  .el-tag:active{
    transform: scale(0.98);
  }
  .name{
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 700!important;
    /*font-style: italic;*/
    overflow: hidden;
    /*display: block;*/
    /*margin-bottom: 10px;*/
  }
  .name:hover{
    text-decoration: underline;
    cursor: pointer;
  }
  .detail-button{
    position: absolute;
    top: 70px;
    right: 40px;
    display: block;
    float: right;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    box-sizing: border-box;
    min-width: 130px;
    height: 48px;
    padding: 12px 24px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    text-transform: uppercase;
    color: #fec937;
    border: 1px solid #fec937;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: #fff;
    outline:none;
  }
  .detail-button:hover{
    cursor: pointer;
    background-color:  #fec937;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
  }
  .detail-button:active{
    transform: scale(0.98);
  }
  .graph-button{
    display: inline-block;
    /*display: block;*/
    margin-top: 30px;
    font-size: 14px;
    font-weight: 600;
    line-height: 16px;
    box-sizing: border-box;
    min-width: 80px;
    height: 40px;
    padding: 12px 24px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    text-transform: uppercase;
    color: #ff8d29;
    border: 1px solid #ff8d29;
    border-radius: 4px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: #fff;
    outline:none;
  }
  .graph-button:hover{
    cursor: pointer;
    color: #fff;
    background-color: #ff8d29;
  }
  .graph-button:active{
    transform: scale(0.98);
  }
</style>
