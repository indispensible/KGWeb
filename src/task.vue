<template>
  <div id="discover">
    <div id="banner">
      <router-link style="color: #ffffff;position: relative;margin: -3% auto 30px;" to="/">
        API Step Tutorial
      </router-link>
      <p style="font-size: 18px;color: rgba(255, 255, 255, 0.8);line-height: 22px;width: 50%;text-align: justify;margin: -5.8% auto 0px;font-family: inherit;">Accomplishing a program task usually involves performing multiple activities in a logical order. Task-solving activities may have different relationships, such as subactivityof, precede-follow, and different attributes, such as location, condition, API, code. We refer to task-solving activities and their relationships and attributes as know-how knowledge. Programming task know-how knowledge is commonly documented in semi-structured textual tutorials. Published paper on related work.</p>
    </div>
    <router-link to="/">
      <el-button id="recently_apis" icon="el-icon-s-home" type="primary" style="position: absolute;left: 11px;top: 16px;z-index: 10000;padding: 12px;" plain>Back to Home</el-button>
    </router-link>
    <div id="content">
      <div id="button-block">
        <div>
          <input type="text" id="input-query" placeholder="QUERY" class="search_input" name="rank_1" v-model="query">
        </div>
        <div>
          <input class="btn search" type="button" value="Example" style="color: #fff;" id="example" @click="example">
          <input class="btn search" type="button" value="Search" id="search" style="color: #fff;margin-left: 5px;" @click="display_loading">
        </div>
      </div>
    </div>
    <div>
      <div ref="loading" v-show="isActive" style="text-align: center;font-size: 26px;">loading……</div>
    </div>
    <div id="task" style="display: none;">
      <div style="border-radius: 10px;background-color: rgb(214, 227, 240);width: 900px;margin: 22px auto;padding:27px 5px 15px 30px;" v-for="(item, index) in current_task">
        <h3>{{item.task_title}}</h3>
        <ul>
          <li v-for="item1 in item.task_step"><span style="color: #ff004d;">{{item1[0]}}</span> {{item1[1]}}</li>
        </ul>
        <pre>{{item.task_code}}</pre>
      </div>
      <div style="border-radius: 8px;background-color: rgb(214, 227, 240);width: 900px;text-align: center;margin: 0px auto 25px;padding: 12px 0px;">
        <el-pagination
          @current-change="change_data"
          background
          layout="prev, pager, next"
          :page-size="4"
          :total="total_task_num">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "task",
        data () {
            return {
                isActive: false,
                query: '',
                task_title: '',
                task_step: [],
                task_code: '',
                untreated_all_task: {},
                all_task: [],
                total_task_num: 66,
                current_task: [],
                page_size: 4
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
                let storage_array =  storage["API Step Tutorial"].split("::!::")
                let index = storage_array.indexOf(query)
                if (index >= 0) {
                    storage_array.splice(index, 1)
                }
                storage_array.unshift(query)
                storage_array = storage_array.slice(0,101)
                storage["API Step Tutorial"] = storage_array.join("::!::")
                // 整体处理
                if (storage["all labels search"] == '' || storage["all labels search"] == undefined){
                    storage["all labels search"] = "File to byte[] in Java:-!-:API Summary::!::StringBuffer vs  StringBuilder:-!-:API Comparison::!::How to create a toast:-!-:API Step Tutorial::!::Getting a File's MD5 Checksum in Java:-!-:Entity Search"
                }
                let all_query = query + ":-!-:API Step Tutorial"
                let all_storage_array =  storage["all labels search"].split("::!::")
                let all_index = all_storage_array.indexOf(all_query)
                if (index >= 0) {
                    all_storage_array.splice(all_index, 1)
                }
                all_storage_array.unshift(all_query)
                all_storage_array = all_storage_array.slice(0,101)
                storage["all labels search"] = all_storage_array.join("::!::")
            },
            change_data(val) {
                document.getElementById("task").style.display = ""
                this.isActive = false
                let number = (val - 1) * this.page_size
                this.current_task = {}
                if (number + this.page_size > this.total_task_num) {
                    let num = number
                    for (let index = 0; index < this.total_task_num - num; index++){
                        this.current_task[index] = this.all_task[number]
                        number++
                    }
                } else {
                    for (let index = 0; index < this.page_size; index++){
                        this.current_task[index] = this.all_task[number]
                        number++
                    }
                }
            },
            deal_all_task () {
                this.all_task = []
                for (let i in this.untreated_all_task) {
                    let task_code = ""
                    let task_step = ""
                    let task_title = this.untreated_all_task[i]["title"]
                    let tasks = []
                    let deal_tasks = []
                    try {
                        task_code  = this.untreated_all_task[i]["sample_code"][0].replace(/^\s*|\s*$/g,"").replace(/&nbsp;/g, " ")
                    } catch (e) {
                        task_code  = ""
                    }
                    for (let j in this.untreated_all_task[i]) {
                        if (j != "sample_code" && j != "title") {
                            tasks = this.untreated_all_task[i][j]
                        }
                    }
                    for (let m in tasks) {
                        for (let j in tasks[m]) {
                            deal_tasks.push(tasks[m][j])
                        }
                    }
                    task_step = deal_tasks
                    this.all_task.push({"task_code": task_code, "task_step": task_step, "task_title": task_title})
                }
                console.log(this.all_task)
                this.total_task_num = this.all_task.length
                this.change_data(1)
            },
            example: function () {
                this.query = 'How to create a toast'
            },
            display_loading: function () {
                if (this.query === '') {
                    alert('The query is empty')
                } else {
                    this.total_task_num = 0
                    document.getElementById("task").style.display = "none"
                    this.isActive = true
                    axios
                        .post(
                            'http://bigcode.fudan.edu.cn/kg/api/graph/Task/',
                            {query: this.query, top_number:  66})
                        .then(response => {
                            console.log(response.data)
                            this.deal_recent_search()
                            this.untreated_all_task = response.data
                            this.deal_all_task()
                        })
                        .catch(error => {
                            console.log(error)
                            alert("Sorry! We can't find related responses.")
                        })
                }
            },
        },
        mounted () {
            this.$nextTick(function () {
                let divApp = document.getElementById("body")
                divApp.style.backgroundColor = "#f5f6fc"
                let url = window.location.href;
                let query = decodeURIComponent(url).split("?query=")[1]
                // console.log(location.search)
                // let url = decodeURIComponent(location.search);
                // let query = url.split("?query=")[1]
                if (query != '' && query != undefined && query != "undefined") {
                    this.query = query
                    this.display_loading()
                } else {
                    this.query = ""
                }
            })
        }
    }
</script>

<style scoped>
  a:hover{
    text-decoration: none;
  }
  body{
    background-color: #f5f6fc;
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
