<template>
    <div id="discover">
        <div id="banner">
          <router-link style="color: #ffffff;" to="/">
            Discover
          </router-link>
        </div>
      <div id="content">
        <div id="button-block">
          <button id="random" @click="get_random_node_by_label">Random</button>
        </div>
        <div id="labels">
          <h3>Labels</h3>
          <span class="label-radio" :class="{ 'active' : label === 'all'}" @click="query_label('all')">all</span>
          <span class="label-radio" v-for="(item, index) in publicLabel" :key="index" :class="{ 'active' : label === item.name}" @click="query_label(item.name)">{{item.name}}</span>
<!--          <el-radio-group v-model="label">-->
<!--            <el-radio-button v-for="(item,index) in publicLabel" :key="index" :label="item.name"></el-radio-button>-->
<!--          </el-radio-group>-->
        </div>
        <div id="nodes-content" v-loading="loading">
          <div v-for="(item,index) in nodes" :key="index" class="node">
            <span class="number">{{index + 1}}</span>
            <div class="node_block">
              <h4 class="name" @click="detail(item.id)" :title="item.name">{{item.name}}</h4>
              <el-tag v-for="(label, i) in item.labels" type="item.type" effect="dark" :key="i" @click="query_label(label)">{{label}}</el-tag>

              <button class="graph-button" @click="graph(item.id)">Graph</button>
            </div>
            <button class="detail-button" @click="detail(item.id)">Learn More</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Discover',
  data () {
    return {
      nodes: [],
      label: 'all',
      publicLabel: [],
      loading: true
    }
  },
  methods: {
    get_random_node_by_label () {
      this.loading = true
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getRandomNodesByLabel/', {label: this.label})
        .then(response => {
          this.nodes = response.data.nodes
          this.loading = false
          console.log(this.nodes)
        })
        .catch(error => console.log(error))
    },
    query_label (label) {
      // if (label === 'all') this.label = null
      this.label = label
      console.log('label')
      console.log(label)
      this.get_random_node_by_label()
    },
    detail (id) {
      this.$router.push({name: 'KnowledgeData', params: {id: id}})
    },
    graph (id) {
      this.$router.push({name: 'ElementGraph', params: {id: id}})
    },
    getPublicLabels () {
      axios
        .post('http://bigcode.fudan.edu.cn/kg/api/graph/getPublicLabels/')
        .then(response => {
          this.publicLabel = response.data
        })
        .catch(error => console.error(error))
    }
  },
  mounted () {
    this.get_random_node_by_label()
    this.getPublicLabels()
  }
  // watch: {
  //   label: function (val) {
  //     this.query_label(val)
  //   }
  // }
}
</script>

<style scoped>
a:hover{
  text-decoration: none;
}
#discover{
  background-color: #f5f6fc;
}
#banner{
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
#content{
  position: relative;
  top: -150px;
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
  background-color:  #4c5fe2;
  outline:none;
}
#random:active{
  transform: scale(.98);
}
#random:hover{
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
}
#button-block{
  height: 150px;
  width: 100%;
  padding: auto;
  text-align: center;
  border-bottom: 1px solid #e5e9ef
}
#labels{
  padding: 10px 20px;
}
.label-radio{
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
.node{
  position: relative;
  height: 200px;
  border-top: 1px solid #e5e9ef;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 15px 10px 82px;
  overflow: hidden;
}
.node:hover{
  transform: scale(1.02);
  box-shadow: 0 2px 8px rgba(0,0,0,.3);
  border-radius: 4px;
  z-index: 100;
}
.number{
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
