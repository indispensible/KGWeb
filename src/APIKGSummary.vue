<template>
  <div id="discover">
      <div id="banner">
        <router-link style="color: #ffffff;position: relative;margin: -3% auto 30px;" to="/">
          API Summary
        </router-link>
        <p style="font-size: 18px;color: rgba(255, 255, 255, 0.8);line-height: 22px;width: 50%;text-align: justify;margin: -5.8% auto 0px;font-family: inherit;">We propose an approach for generating on-demand, extrinsic hybrid summaries for API classes, relevant to a programming task, formulated as a natural language query. The summaries include the most relevant sentences extracted from the API reference documentation and the most relevant methods.</p>
      </div>
    <router-link to="/">
      <el-button id="recently_apis" icon="el-icon-s-home" type="primary" style="position: absolute;left: 11px;top: 16px;z-index: 10000;padding: 12px;" plain>Back to Home</el-button>
    </router-link>
    <div id="content">
      <div id="button-block">
        <div>
          <input type="text" id="input-query" placeholder="QUERY" class="search_input" name="rank_1" v-model="query">
<!--          <input type="text" id="input_number_or_class" placeholder="class name or number" class="search" name="rank_1" v-model="class_name_or_number" style="background: #fff;min-width: 240px;margin: 20px 0 0 10px;">-->
        </div>
        <div>
<!--          <input class="btn search" type="button" value="Search" id="search" v-bind:test_id="searchMarginLeft | search_input_margin_left">-->
          <input class="btn search" type="button" value="Example" style="color: #fff;" id="example2" @click="example2">
          <input class="btn search" type="button" value="Search" id="search" style="color: #fff;margin-left: 5px;" @click="display_loading">
<!--          <input class="btn search" type="button" value="Example1" style="color: #fff;" id="example1" @click="example1">-->
<!--          <input class="btn search" type="button" value="Example2" style="color: #fff;" id="example2" @click="example2">-->
        </div>
      </div>
    </div>
    <div>
      <div ref="loading" v-bind:class="{search_summary_hidden:isActive}" style="text-align: center;font-size: 26px;">loading……</div>
    </div>
    <div id="page" v-bind:class="{search_summary_hidden:display_summary}" style="background-color: #f5f6fc;">
      <div style="width: 100%;background-color: #f5f6fc;" v-for="related_class_method_1 in current_related_class_method">
        <div v-for="related_class_method in related_class_method_1">
          <div class="introduction" v-for="(related, index) in related_class_method">
            <p class="intro_name" v-if="related['url'] == ''">{{index}}</p>
            <a class="intro_name" v-else :href="related['url']" target="_blank">{{index}}</a>
            <ol>
              <li v-for="(related_number) in related['sentence']">{{related_number}}</li>
            </ol>
          </div>
        </div>
        <div style="height: 25px;background-color: #f5f6fc;"></div>
      </div>
      <el-pagination
        @current-change="change_data"
        background
        layout="prev, pager, next"
        :page-size="5"
        :total="total_all_related_class_method">
      </el-pagination>
    </div>
    <div style="width: 100%;height: 30px;background-color: #f5f6fc;"></div>
<!--    <div style="width: 100%;background-color: #f5f6fc;" v-bind:class="{search_summary_hidden:display_summary}" v-for="related_class_method_1 in all_related_class_method">-->
<!--      <div v-for="related_class_method in related_class_method_1">-->
<!--        <div class="introduction" v-for="(related, index) in related_class_method">-->
<!--          <p class="intro_name" v-if="related['url'] == ''">{{index}}</p>-->
<!--          <a class="intro_name" v-else :href="related['url']" target="_blank">{{index}}</a>-->
<!--          <ol>-->
<!--            <li v-for="(related_number) in related['sentence']">{{related_number}}</li>-->
<!--          </ol>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div style="height: 30px;background-color: #f5f6fc;"></div>-->
<!--    </div>-->
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'APIKGSummary',
  data () {
    return {
      nodes: [],
      label: 'all',
      publicLabel: [],
      loading: true,
      isActive: true,
      display_summary: true,
      query: '',
      class_name_or_number: 22,
      all_related_class_method: {},
      total_all_related_class_method: 0,
      current_related_class_method: {}
    }
  },
  methods: {
    // deal_data () {
    //   let rawData = JSON.parse(JSON.stringify(this.all_related_class_method))
    //   let totalLength = 0
    //   // eslint-disable-next-line no-unused-vars
    //   for (let ever in rawData) {
    //     totalLength += 1
    //   }
    //   let dealtData = {}
    //   for (let i = 0; i < totalLength; i++) {
    //     let apiUrl = 'https://docs.oracle.com/javase/8/docs/api'
    //     let dealtRowData = {}
    //     let className = ''
    //     let j = -1
    //     // console.log(rawData[i])
    //     for (let key in rawData[i]) {
    //       j += 1
    //       let value = rawData[i][key]
    //       // console.log(key)
    //       if (j === 0) {
    //         className = key + '.'
    //         let apiUrlKey = key.split('.')
    //         for (let n in apiUrlKey) {
    //           apiUrl = apiUrl + '/' + apiUrlKey[n]
    //         }
    //         apiUrl += '.html'
    //         let url = {'url': apiUrl}
    //         let id = {'id': j}
    //         dealtRowData[key] = value
    //         dealtRowData[key].push(url)
    //         dealtRowData[key].push(id)
    //       } else {
    //         let apiUrlKey = key.split(className)
    //         key = apiUrlKey[1]
    //         // let methodUrl = apiUrl + '#' + apiUrlKey[-1] + '--'
    //         // let url = {'url': methodUrl}
    //         let id = {'id': j}
    //         dealtRowData[key] = value
    //         // dealtRowData[key].push(url)
    //         dealtRowData[key].push(id)
    //       }
    //     }
    //     dealtData[i] = dealtRowData
    //   }
    //   // console.log(dealtData)
    //   this.all_related_class_method = dealtData
    // },
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
        let storage_array =  storage["API Summary"].split("::!::")
        let index = storage_array.indexOf(query)
        if (index >= 0) {
            storage_array.splice(index, 1)
        }
        storage_array.unshift(query)
        storage_array = storage_array.slice(0,101)
        storage["API Summary"] = storage_array.join("::!::")
        // 整体处理
        if (storage["all labels search"] == '' || storage["all labels search"] == undefined){
            storage["all labels search"] = "File to byte[] in Java:-!-:API Summary::!::StringBuffer vs  StringBuilder:-!-:API Comparison::!::How to create a toast:-!-:API Step Tutorial::!::Getting a File's MD5 Checksum in Java:-!-:Entity Search"
        }
        let all_query = query + ":-!-:API Summary"
        let all_storage_array =  storage["all labels search"].split("::!::")
        let all_index = all_storage_array.indexOf(all_query)
        if (index >= 0) {
            all_storage_array.splice(all_index, 1)
        }
        all_storage_array.unshift(all_query)
        all_storage_array = all_storage_array.slice(0,101)
        storage["all labels search"] = all_storage_array.join("::!::")
    },
    first_get_data () {
      let _this = this
      let number = 0
      _this.total_all_related_class_method = number
      for(let index in _this.all_related_class_method){
        number += 1
      }
      _this.total_all_related_class_method = number
      // console.log(number)
      _this.current_related_class_method = {}
      if (number >= 5) {
        for(let index in _this.all_related_class_method){
          // console.log(index)
          if (index > 4) {
            break
          } else {
            _this.current_related_class_method[index] = _this.all_related_class_method[index]
          }
        }
      } else {
        for(let index in _this.all_related_class_method){
           _this.current_related_class_method[index] = _this.all_related_class_method[index]
        }
      }
    },
    change_data (val) {
      let _this = this
      let number = (val - 1) * 5
      _this.current_related_class_method = {}
      if (number + 5 > _this.total_all_related_class_method) {
        let num = number
        for (let index = 0; index < _this.total_all_related_class_method - num; index++){
          _this.current_related_class_method[index] = _this.all_related_class_method[number]
          number++
        }
      } else {
        for (let index = 0; index < 5; index++){
          _this.current_related_class_method[index] = _this.all_related_class_method[number]
          number++
        }
      }
    },
    display_loading: function () {
      let _this = this
      if (_this.query === '') {
        alert('The query is empty')
      } else if (_this.class_name_or_number === '') {
        alert('The class name or number is empty')
      } else {
        this.isActive = false
        this.display_summary = true
        this.total_all_related_class_method = 0
        axios
          .post(
            'http://bigcode.fudan.edu.cn/kg-debug/APISummary/createAPISummary/',
            // 'http://127.0.0.1:5000/createAPISummary/',
            {query: _this.query, class_name_or_number: _this.class_name_or_number + ''})
          .then(response => {
            // console.log(response.data)
            this.deal_recent_search()
            _this.all_related_class_method = response.data
            _this.first_get_data()
            _this.hidden_loading()
            // let responseJson = JSON.parse(response.data)
            // console.log(responseJson)
          })
          .catch(error => {
            console.log(error)
            alert("Sorry! We can't find related API.")
          })
      }
    },
    hidden_loading: function () {
      // let lis = document.getElementsByClassName('number')
      // lis.style.backgroundColor = "#ffffff"
      // console.log(lis)
      // console.log(lis['length'])
      // console.log(lis[1])
      // lis[1].setAttribute("background-color", '#ffffff')
      // for (let index in lis.item(0)) {
      //   console.log(index)
      //   // lis.style.backgroundColor = "#ffffff"
      // }
      this.isActive = true
      this.display_summary = false
    },
    example1: function () {
      this.query = 'Add all files recursively from root with Java 8 Stream'
      this.class_name_or_number = 'java.nio.file.Files'
    },
    example2: function () {
      this.query = 'File to byte[] in Java'
      this.class_name_or_number = '22'
    }
  },
  mounted () {
    // this.search_input_margin_left()
    this.$nextTick(function () {
      let divApp = document.getElementById("body")
      divApp.style.backgroundColor = "#f5f6fc"
      let url = window.location.href;
      // let url = decodeURIComponent(location.search);
      let query = decodeURIComponent(url).split("?query=")[1]
      // console.log(query)
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
  .el-pagination {
    text-align: center!important;
    background-color: #ffffff!important;
    padding: 16px 0px;
    width: 60%;
    margin: 0px auto;
    border-radius: 15px;
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

  #random {
    /*position: relative;*/
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
    color: #fff;
    border: 1px solid #4c5fe2;
    border-radius: 4px;
    margin-top: 51px;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-color: #4c5fe2;
    outline: none;
  }

  #random:active {
    transform: scale(.98);
  }

  #random:hover {
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
  }

  #button-block {
    height: 150px;
    width: 100%;
    padding: auto;
    text-align: center;
    border-bottom: 1px solid #e5e9ef
  }

  #labels {
    padding: 10px 20px;
  }

  .label-radio {
    text-transform: capitalize;
    cursor: pointer;
    user-select: none;
    display: inline-block;
    margin-top: 16px;
    margin-right: 32px;
    padding: 1px 0;
    transition: .2s;
    color: #6c6e7a;
    border-bottom: 2px solid transparent;
  }

  .active {
    font-weight: 700;
    color: #4c5fe2;
    border-bottom-color: #4c5fe2;
  }

  .label-radio:hover {
    text-decoration: none;
    color: #4c5fe2;
    border-bottom-color: #4c5fe2;
  }

  .node {
    position: relative;
    height: 200px;
    border-top: 1px solid #e5e9ef;
    background-color: #fff;
    border-radius: 4px;
    padding: 20px 15px 10px 82px;
    overflow: hidden;
  }

  .node:hover {
    transform: scale(1.02);
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
    border-radius: 4px;
    z-index: 100;
  }

  .number {
    font-weight: 700;
    line-height: 64px;
    position: absolute;
    top: 13px;
    left: 0;
    display: block;
    width: 82px;
    text-align: center;
    color: #000;
    font-size: 50px;
  }

  .node_block {
    max-width: 600px;
    position: relative;
    float: left;
  }

  .el-tag {
    margin-right: 10px;
    user-select: none;
    margin-top: 10px;
  }

  .el-tag:hover {
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
  }

  .el-tag:active {
    transform: scale(0.98);
  }

  .name {
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 700 !important;
    /*font-style: italic;*/
    overflow: hidden;
    /*display: block;*/
    /*margin-bottom: 10px;*/
  }

  .name:hover {
    text-decoration: underline;
    cursor: pointer;
  }

  .detail-button {
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
    outline: none;
  }

  .detail-button:hover {
    cursor: pointer;
    background-color: #fec937;
    color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .3);
  }

  .detail-button:active {
    transform: scale(0.98);
  }

  .graph-button {
    display: block;
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
    outline: none;
  }

  .graph-button:hover {
    cursor: pointer;
    color: #fff;
    background-color: #ff8d29;
  }

  .graph-button:active {
    transform: scale(0.98);
  }
</style>
