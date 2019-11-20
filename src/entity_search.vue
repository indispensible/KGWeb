<template>
  <div id="discover">
    <div id="banner">
      <router-link style="color: #ffffff;position: relative;margin: -3% auto 30px;" to="/">
        Entity Search
      </router-link>
      <p style="font-size: 18px;color: rgba(255, 255, 255, 0.8);line-height: 22px;width: 50%;text-align: justify;margin: -5.8% auto 0px;font-family: inherit;">Based on the knowledge Graph Structure and the API Document description, we built an entity search model, support filtering by query.</p>
    </div>
    <router-link to="/">
      <el-button id="recently_apis" icon="el-icon-s-home" type="primary" style="position: absolute;left: 11px;top: 16px;z-index: 10000;padding: 12px;" plain>Back to Home</el-button>
    </router-link>
    <el-button type="warning" style="position: fixed;right: 12px;top: 16px;" v-show="showFilter" plain @click="display_labels">Filter</el-button>
    <el-drawer
      title="These are our labels, and you can filter examples by labels."
      :visible.sync="drawer">
      <span class="label-radio" :class="{ 'active' : label === 'all'}" @click="query_label('all')">all</span>
      <span class="label-radio" v-for="(item, index) in publicLabel" :key="index" :class="{ 'active' : label === item.name}" @click="query_label(item.name)">{{item.name}}</span>
    </el-drawer>
    <div id="content">
      <div id="button-block">
        <div>
          <input type="text" id="input-query" placeholder="QUERY" class="search_input" name="rank_1" v-model="query">
        </div>
        <div>
          <input class="btn search" type="button" value="Example" style="color: #fff;" id="example" @click="example">
          <input class="btn search" type="button" value="Search" id="search" style="color: #fff;margin-left: 5px;" @click="search">
        </div>
      </div>
    </div>
    <div id="node-content" v-loading="loading">
      <div v-for="(item, index) in nodes" :key="index" class="node">
        <span class="number">{{current_number + index + 1}}</span>
        <div class="node_block">
          <el-tooltip class="item" effect="dark" :content="item.name" placement="top">
            <h4 class="name" @click="detail(item.id)" :title="item.name">{{item.name}}</h4>
          </el-tooltip>
          <el-tag v-for="(label, i) in item.labels" type="item.type" effect="dark" :key="i">{{label}}</el-tag>
          <div>
            <button class="graph-button" @click="graph(item.id)">Graph</button>
            <button class="graph-button" @click="detail(item.id)" style="margin-left: 12px;" v-show="item.mindmap == 1">Encyclopedia</button>
          </div>
        </div>
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
    <div style="width: 100%;height: 30px;background-color: #f5f6fc;"></div>
  </div>
</template>

<script>
    import axios from 'axios'
    import $ from 'jquery'
    export default {
        name: 'entity_search',
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
                loadingComparison: false,
                showFilter: false
            }
        },
        methods: {
            deal_recent_search () {
                // 分类别处理
                let query = this.query.replace(/(^\s*)|(\s*$)/g, "")
                let storage=window.localStorage
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
                let storage_array =  storage["Entity Search"].split("::!::")
                let index = storage_array.indexOf(query)
                if (index >= 0) {
                    storage_array.splice(index, 1)
                }
                storage_array.unshift(query)
                storage_array = storage_array.slice(0,101)
                storage["Entity Search"] = storage_array.join("::!::")
                // 整体处理
                if (storage["all labels search"] == '' || storage["all labels search"] == undefined){
                    storage["all labels search"] = "File to byte[] in Java:-!-:API Summary::!::StringBuffer vs  StringBuilder:-!-:API Comparison::!::How to create a toast:-!-:API Step Tutorial::!::Getting a File's MD5 Checksum in Java:-!-:Entity Search"
                }
                let all_query = query + ":-!-:Entity Search"
                let all_storage_array =  storage["all labels search"].split("::!::")
                let all_index = all_storage_array.indexOf(all_query)
                if (index >= 0) {
                    all_storage_array.splice(all_index, 1)
                }
                all_storage_array.unshift(all_query)
                all_storage_array = all_storage_array.slice(0,101)
                storage["all labels search"] = all_storage_array.join("::!::")
            },
            display_labels () {
                this.drawer = true
            },
            example: function () {
                this.query = 'Getting a File\'s MD5 Checksum in Java'
                this.class_name_or_number = '22'
            },
            search () {
                this.loading = true
                this.label = "all"
                if(this.query.trim() == '' || this.query == null) {
                    alert("The input should not be empty!")
                    this.loading = false
                } else {
                    axios
                        .post('http://bigcode.fudan.edu.cn/kg/api/graph/searchWithBM25/', {query: this.query, "max_num":666})
                        .then(response => {
                            this.deal_recent_search()
                            this.all_nodes = response.data.nodes
                            this.first_get_data()
                            this.loading = false
                            this.showFilter = true
                        })
                }
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
                            this.all_nodes = response.data.nodes
                            this.first_get_data()
                            this.loading = false
                            this.drawer = false
                        })
                        .catch(error => console.log(error))
                } else {
                    let labelName = ""
                    if (this.label != "all") {
                        labelName = this.label
                    }
                    axios
                        .post('http://bigcode.fudan.edu.cn/kg/api/graph/searchWithBM25/', {query: this.query.replace(/(^\s*)|(\s*$)/g, ""), max_num: 666, label: labelName})
                        .then(response => {
                            this.all_nodes = response.data.nodes
                            this.first_get_data()
                            this.loading = false
                            this.drawer = false
                        })
                        .catch(error => console.log(error))
                }
            },
            graph (id) {
                let graph = this.$router.resolve({name: 'ElementGraph', params: {id: id}})
                window.open(graph.href, '_blank')
            },
            detail (id) {
                let detail = this.$router.resolve({name: 'KnowledgeData', params: {id: id}})
                window.open(detail.href, '_blank')
            },
            getPublicLabels () {
                axios
                    .post('http://bigcode.fudan.edu.cn/kg/api/graph/getPublicLabels/')
                    .then(response => {
                        this.publicLabel = response.data
                    })
                    .catch(error => console.error(error))
            },
        },
        mounted () {
            this.$nextTick(function () {
                let divApp = document.getElementById("body")
                divApp.style.backgroundColor = "#f5f6fc"
                this.getPublicLabels()
                let url = window.location.href;
                let query = decodeURIComponent(url).split("?query=")[1]
                // let url = decodeURIComponent(location.search);
                // let query = url.split("?query=")[1]
                if (query != '' && query != undefined && query != "undefined") {
                    this.query = query
                    this.search()
                } else {
                    this.query = ""
                }
            })
        },
    }
</script>

<style scoped>
  .name{
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  #node-content{
    width: 880px;
    margin: 0px auto;
    /*background-color: #00162d;*/
    /*padding-top: 10px;*/
    /*padding-bottom: 30px;*/
  }
  .node{
    position: relative;
    height: 200px;
    background-color: #ffffff;
    border-radius: 8px;
    padding: 20px 15px 10px 82px;
    overflow: hidden;
    margin-top: 30px;
    box-shadow: 0 2px 8px rgba(0,0,0,.2);
  }
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
    max-width: 780px;
    position: relative;
    float: left;
  }
  .el-tag{
    margin-right: 10px;
    user-select: none;
    margin-top: 10px;
  }
  .el-tag:hover{
    cursor: text;
    box-shadow: 0 2px 8px rgba(0,0,0,.3);
  }
  .el-tag:active{
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
  .label-radio:hover{
    text-decoration: none;
    color: #4c5fe2;
    border-bottom-color: #4c5fe2;
  }

  .el-pagination {
    text-align: center!important;
    background-color: #ffffff!important;
    padding: 16px 0px;
    width: 880px;
    margin: 0px auto;
    border-radius: 8px;
  }
  a:hover{
    text-decoration: none;
  }
  body{
    background-color: #f5f6fc;
  }
  .introduction{
    width: 60%;
    margin: auto;
    padding: 9px 20px;
    background-color: #fff;
    color: #1f2129;
    border-radius: 5px;
    /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  }
  .intro_name{
    color: #F56C6C!important;
    margin-bottom: 5px!important;
    font-weight: bold;
  }
  .search{
    /*font-size: 14px;*/
    /*font-weight: 600;*/
    line-height: 22px;
    box-sizing: border-box;
    min-width: 130px;
    height: 48px;
    padding: 12px 24px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    /*text-transform: uppercase;*/
    border: 1px solid #4c5fe2;
    border-radius: 4px;
    margin-top: 18px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: #4c5fe2;
    outline: none;
    width: 20%;
  }
  #input-query{
    background-color: #fff;
    /*font-size: 14px;*/
    /*font-weight: 600;*/
    line-height: 22px;
    box-sizing: border-box;
    min-width: 130px;
    height: 48px;
    padding: 12px 24px;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
    border: 1px solid #4c5fe2;
    border-radius: 4px;
    margin-top: 20px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    outline: none;
    width: 50%;
  }
  .search_summary_hidden{
    display: none;
  }
  #discover {
    background-color: #f5f6fc;
    height: 100%;
  }

  #banner {
    height: 450px;
    background: linear-gradient(45deg, #0B4182 1%, #1e88e5 64%, #40BAF5 97%);
    vertical-align: center;
    font-size: 50px;
    /*font-family: na;*/
    font-style: italic;
    color: #fff;
    text-align: center;
    line-height: 300px;
  }

  #content {
    position: relative;
    top: -75px;
    background-color: #fff;
    border-radius: 5px;
    /*height: 500px;*/
    width: 900px;
    margin: 0 auto;
  }

  #button-block {
    height: 150px;
    width: 100%;
    padding: auto;
    text-align: center;
    border-bottom: 1px solid #e5e9ef
  }
</style>
