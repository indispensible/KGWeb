new Vue({
  el: '#app',
  data () {
    return {
    	all_result_string: '',
    	query_prompt: 'query',
    	query: '',
    	isActive: true,
      myChart: '',
      totalChart: 0,
      related_api: {},
      current_api: {},
      total_api_num: 0,
      current_api_num: 0
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
            'http://bigcode.fudan.edu.cn/kg/api/graph/visualAssociatedConcept/',
            // 'http://127.0.0.1:5000/APIDifference/',
            {'query': query})
          .then(response => {
            _this.all_result_string = ''
            _this.myChart = ''
            _this.totalChart += 1
            _this.all_result_string = response.data
            _this.$refs.related_api.style.display = 'none'
            // console.log(response.data)
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
      main_div.style.width = window.innerWidth*0.8 + 'px'
      main_div.style.borderRadius = "15px";
      _this.myChart = echarts.init(main_div)
      option = {
            title: {
                text: 'Associated Concept',
                x: 'center',
                textStyle: {
                    fontSize: 23
                },
                top: 8
            },
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
        _this.myChart.clear()
        _this.myChart.setOption(option);
        if(_this.totalChart < 2){
            _this.myChart.on('click', function(params){
              _this.total_api_num = 0
              _this.related_api = {}
              // alert(params.name + ":" + params.value)
              // url = "./associatedConcept.html?name=" + params.data.conceptId
              // console.log(params.data.conceptId)
              // window.open(url)
              let api_id = params.data.conceptId
              axios
              .post(
                'http://bigcode.fudan.edu.cn/kg/api/graph/sharedConcept/',
                // 'http://127.0.0.1:5000/APIDifference/',
                {"id": api_id})
              .then(response => {
                _this.related_api = response.data
                _this.total_api_num = _this.related_api.length
                _this.change_data(1)
              })
              .catch(error => {
                console.log(error)
                alert("Sorry! Network Error!")
              })
            })
        }
    },
    change_data (val) {
      // console.log(val)
      let _this = this
      _this.$refs.related_api.style.display = ''
      let current_num = (val - 1) * 10
      _this.current_api = {}
      _this.current_api_num = current_num
      if (current_num + 10 > _this.related_api.length) {
        let num = current_num
        for (let index = 0; index < _this.related_api.length - num; index++){
          console.log(_this.related_api[current_num])
          _this.current_api[index] = _this.related_api[current_num]
          current_num++
        }
      } else {
        for (let index = 0; index < 10; index++){
          // console.log(_this.related_api[current_num])
          _this.current_api[index] = _this.related_api[current_num]
          current_num++
        }
      }
      // console.log(_this.related_api)
      // console.log(_this.current_api)
    }
  },
  mounted () {
    this.$nextTick(function () {
      // 这里要做的是判断是否有url中是否有name，进而判断是否要直接得到词云
      let _this = this
      let url = window.location.href;
      let name = url.split("?name=")[1]
      // console.log(name)
      if (name != '' && name != null) {
        _this.query = name
        _this.display_loading()
      }
    })
  }
})