new Vue({
  el: '#app',
  data () {
    return {
    	all_nodes:[],
      all_relations:[],
      all_labels: {},
      nodeList: [],
      edgeList: [],
      myChart: ''
    }
  },
  methods: {
    show_graph () {
      let _this = this
      axios
        .post(
          'http://bigcode.fudan.edu.cn/kg/api/graph/overall/',
        )
        .then(response => {
          _this.all_labels = {
                "entity": "#4f19c7",
                "type": "#c71969",
                "primary type": "#c71919",
                "code_element": "#3419c7",
                "package": "#1984c7",
                "interface": "#19c719",
                "class": "#8419c7",
                "enum class": "#19c7b9",
                "exception class": "#c719b9",
                "error class": "#c79f19",
                "annotation class": "#19b9c7",
                "method": "#8419c7",
                "construct method": "#b9c719",
                "field of class": "#409EFF",
                "enum constants": "#67C23A",
                "parameter": "#E6A23C",
                "value": "#F56C6C",
                "return value": "#909399",
                "unknown": "#E00000",
                "base override method": "#33CCCC",
                "android27": "#6666CC",
                "domain term": "#9966CC",
                "operation": "#CCFF66",
                "wikidata": "#00FF33"
            }
            // console.log(all_labels['type'])
            _this.all_nodes = []
            _this.all_relations = []
            _this.all_nodes = response.data["all_nodes"]
            _this.all_relations = response.data["all_relations"]
            _this.create_graph()
        })
        .catch(error => {
          console.log(error)
          alert("Sorry! Network Error!")
        })
    },
    create_graph () {
      let _this = this
      _this.dealt_data()
      option = {
          title: {
              text: 'Overview',
              x: 'center',
              textStyle: {
                  fontSize: 23
              },
              top: 8
          },
          animationDurationUpdate: 6000,
          animationEasingUpdate: 'quinticInOut',
          series : [
              {
                  type: 'graph',
                  layout: 'none',
                  // progressiveThreshold: 700,
                  data: [],
                  edges: [],
                  label: {
                      emphasis: {
                          position: 'right',
                          show: true
                      }
                  },
                  roam: true,
                  focusNodeAdjacency: true,
                  lineStyle: {
                      normal: {
                          width: 0.8,
                          curveness: 0.3,
                          opacity: 0.7
                      }
                  }
              }
          ]
      }
      option.series[0].data = _this.nodeList;
      option.series[0].edges = _this.edgeList;
      _this.myChart.setOption(option);
    },
    dealt_data () {
      // x[-1500:1500]; y[-1500:1500]
      let _this = this
      let name_2_id = {}
      let count_node = -1
      for (let item in _this.all_nodes) {
        count_node += 1
        let nodeId = parseInt(_this.all_nodes[item]["id"])
        name_2_id[nodeId] = count_node
        let nodeName = _this.all_nodes[item]["name"]
        let nodeColor = _this.all_labels[_this.all_nodes[item]["main_label"]]
        // console.log(nodeColor)
        if (nodeColor == '' || nodeColor == null) {
          nodeColor = "#E00000"
        }
        let x = Math.random() * 2 - 1
        let y = Math.random() * 2 - 1
        while((x * x + y * y) > 1) {
          y = Math.random() * 2 - 1
        }
        let nodeX = x * 2333
        let nodeY = y * 2333
        let number = 1
        for (let item_1 in _this.all_relations) {
          if (parseInt(_this.all_relations[item_1]['e']) == nodeId || parseInt(_this.all_relations[item_1]['s']) == nodeId) {
              number += 1
          }
        }
        let nodeSize = number * 3.2
        if (nodeSize > 108) {
          nodeSize = 108
          // x = 1 - Math.random() * 0.1
          // y = 1 - Math.random() * 0.1
          // // while(x < 1.1 && x > -1.1) {
          // //   x = Math.random() * 2.6 - 1.3
          // // }
          // // while(y < 1.1 && y > -1.1) {
          // //   y = Math.random() * 2.6 - 1.3
          // // }
          // nodeX = x*1500
          // nodeY = y*1500
        }
        _this.nodeList.push({
            x: nodeX,
            y: nodeY,
            id: nodeId,
            name: nodeName,
            symbolSize: nodeSize,
            itemStyle: {
                normal: {
                    color: nodeColor
                }
            }
        })
      }
      for (let item_2 in _this.all_relations) {
        _this.edgeList.push({
          source: name_2_id[_this.all_relations[item_2]['s']],
          target: name_2_id[_this.all_relations[item_2]['e']]
        })
        // _this.edgeList.push({
        //   source: _this.all_relations[item_2]['s'],
        //   target: _this.all_relations[item_2]['e']
        // })
      }
      _this.myChart.hideLoading();
    }
  },
  mounted () {
    this.$nextTick(function () {
      let _this = this
      let main_div = document.getElementById('main')
      // console.log(window.innerWidth)
      main_div.style.width = window.innerWidth + 'px'
      _this.myChart = echarts.init(main_div)
      _this.myChart.showLoading()
      _this.show_graph()
    })
  }
})