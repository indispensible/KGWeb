new Vue({
  el: '#app',
  data () {
    return {
    	all_result_string: '',
    	query_prompt: 'query',
    	query: '',
    	isActive: true,
      graph_data: [],
      graph_links: [],
      parent_id: 0,
      parent_name: '',
      parent_num: 0
    }
  },
  methods: {
  	display_loading () {
  		let _this = this
  		let query = _this.query.trim()
  		_this.$refs.result.style.display = 'none'
  		if (query == '') {
        alert("The input should not be empty!")
      } else {
       _this.isActive = false
       axios
          .post(
            'http://bigcode.fudan.edu.cn/kg/api/graph/visualDocSize/',
            // 'http://127.0.0.1:5000/APIDifference/',
            {'query': query})
          .then(response => {
            _this.all_result_string = response.data
            _this.get_parent()
            _this.dealt_data()
            _this.wordCloud()
            _this.hidden_loading()
          })
          .catch(error => {
            console.log(error)
            alert("Sorry! Network Error!")
        })
      }
  	},
  	hidden_loading () {
  		this.$refs.result.style.display = ''
  		this.isActive = true
  	},
  	example () {
      this.$refs.result.style.display = 'none'
  		this.query = "java.lang.StringBuffer"
  	},
    wordCloud () {
      let _this = this
      let main_div = document.getElementById('main')
      // console.log(window.innerWidth)
      main_div.style.width = window.innerWidth*0.96 + 'px'
      let myChart = echarts.init(main_div)
      option = {
          title: {
              text: 'Document Size',
              textStyle: {
                  fontSize: 23
              },
              top: 8
          },
          backgroundColor: '#F7F7F7',
          animation: false,
          tooltip: {},
          label: {
              normal: {
                  show: true,
                  textStyle: {
                      fontSize: 12
                  },
              }
          },
          legend: {
              x: "center",
              show: false,
              data: ["parent", "child"]
          },
          series: [{
                  type: 'graph',
                  layout: 'force',
                  symbolSize: 27,
                  focusNodeAdjacency: false,
                  animationDuration: 1000,
                  animationEasingUpdate: 'quinticInOut',
                  roam: true,
                  categories: [{
                      name: 'parent',
                      itemStyle: {
                          normal: {
                              color: "#409EFF",
                          }
                      }
                  }, {
                      name: 'child',
                      itemStyle: {
                          normal: {
                              color: "#E6A23C",
                          }
                      }
                  }],
                  label: {
                      normal: {
                          show: true,
                          textStyle: {
                              fontSize: 12
                          },
                      }
                  },
                  force: {
                    repulsion: 20,
                    gravity: 0,
                    edgeLength: 20,
                    layoutAnimation: false,
                      // repulsion: 20,
                      // layoutAnimation: true,
                  },
                  edgeSymbolSize: [5, 15],
                  edgeLabel: {
                      normal: {
                          show: true,
                          textStyle: {
                            fontSize: 12,
                            color:"#000"
                          },
                          formatter: "{c}"
                      }
                  },
                  data: _this.graph_data,
                  links: _this.graph_links,
                  lineStyle: {
                      normal: {
                          opacity: 0.2,
                          width: 2,
                          curveness: 0.05
                      }
                  }
              }
          ]
      }
      myChart.setOption(option)
    },
    get_parent () {
      let _this = this
      let nodes = _this.all_result_string['nodes']
      _this.parent_id = _this.all_result_string["relations"][0]["end_id"]
      for (let item in nodes){
        if (nodes[item]["id"] == _this.parent_id){
          _this.parent_name = nodes[item]["name"] + '.'
          _this.parent_num = item
          break
        }
      }
    },
    dealt_data () {
      let _this = this
      let nodes = _this.all_result_string['nodes']
      let size_info = _this.all_result_string['size_info']
      let relations = _this.all_result_string['relations']
      for (let item in nodes) {
          let id = nodes[item]["id"]
          let size_num = 0
          let category_num = 0
          let qualified_name = nodes[item]["name"]
          let relation_name = ''
          // 查找size
          for (let size_item in size_info) {
            if (size_info[size_item]["id"] == id) {
              size_num = parseInt(size_info[size_item]["size"])
              break
            }
          }
          // 查找关系名
          for (let relation_item in relations) {
            if (relations[relation_item]["start_id"] == id) {
              relation_name = relations[relation_item]["name"]
              break
            }
          }
          size = size_num * 1.2 + 8
          if (size > 26) {
            size = 26
          }
          if (id != _this.parent_id) {
              category_num = 1
              if (qualified_name.indexOf(_this.parent_name) != -1) {
                qualified_name = qualified_name.split(_this.parent_name)[1]
              }
          } else {
            size = 27
          }
          _this.graph_data.push({
              'name': qualified_name,
              "showName": nodes[item]["name"],
              'category': category_num,
              'draggable': "true",
              // "fixed": "true",
              'symbolSize': size,
              tooltip:{
                  formatter: nodes[item]["name"]
              }
          })
          _this.graph_links.push({
              'target': parseInt(_this.parent_num),
              'source': parseInt(item),
              'value': relation_name,
              lineStyle:{
                normal:{
                  color: "#000"
                }
              }
          })
      }
      console.log(_this.graph_data)
      console.log(_this.graph_links)
    }
  }
})