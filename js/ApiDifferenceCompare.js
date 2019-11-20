new Vue({
  el: '#app',
  data () {
    return {
      id: 1,
      isActive: true,
      api_1: '',
      api_2: '',
      // 两个api的相似方法
      tableDataSame: [],
      // 原始从后端导入的数据
      rawDataFromBackEnd: {}
    }
  },
  methods: {
    change_class_type ({row, rowIndex}) {
      let rawData = row
      // console.log(row)
      if (rawData["type"] == 'mention') {
        return 'mention'
      } else if (rawData['type'] == 'similar') {
        return 'similar'
      }
      return '';
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row['same']){
        if (columnIndex === 0) {
          return [1, 2];
        } else if (columnIndex === 1) {
          return [0, 0];
        }
      }
    },
    example1: function () {
      let _this = this
      _this.api_1 = 'java.lang.StringBuffer'
      _this.api_2 = 'java.lang.StringBuilder'
      _this.$refs.sameTable.style.display = 'none'
      _this.$refs.presentation.style.display = 'none'
    },
    example2: function () {
      let _this = this
      _this.api_1 = 'java.util.HashSet'
      _this.api_2 = 'java.util.Hashtable'
      _this.$refs.sameTable.style.display = 'none'
      _this.$refs.presentation.style.display = 'none'
    },
    display_loading: function() {
      let _this = this
      _this.trim()
      if (_this.api_1 == '' || _this.api_2 == ''){
        alert('The input is empty!!!')
      } else {
        _this.isActive = false
        _this.$refs.sameTable.style.display = 'none'
        _this.$refs.presentation.style.display = 'none'
        axios
          .post(
            'http://bigcode.fudan.edu.cn/kg-debug/APIDifference/BaseLine/',
            // 'http://127.0.0.1:5000/APIDifference/',
            {api_1: _this.api_1, api_2: _this.api_2})
          .then(response => {
            _this.rawDataFromBackEnd = response.data
            _this.deal_data()
            _this.hidden_loading()
          })
          .catch(error => {
            console.log(error)
            alert("Sorry! Network Error!")
          })
      }
    },
    hidden_loading: function () {
      let _this = this
      // console.log(_this.tableDataSame)
      _this.isActive = true
      _this.$refs.sameTable.style.display = ''
      _this.$refs.presentation.style.display = ''
    },
    trim: function() {
      let _this = this
      _this.api_1 = _this.api_1.replace(/(^\s*)|(\s*$)/g, "")
      _this.api_2 = _this.api_2.replace(/(^\s*)|(\s*$)/g, "")
    },
    deal_data () {
      let _this = this
      let sameData = new Array()
      let group_item_collection_merge = _this.rawDataFromBackEnd["merge"]
      let group_item_collection_pairs = _this.rawDataFromBackEnd["pairs"]
      // 形成tableDataSame
      for (let num in group_item_collection_merge) {
        let dealtData = {}
        dealtData = {
            id: _this.id,
            type: 'mention',
            api_1_name: group_item_collection_merge[num],
            api_2_name: group_item_collection_merge[num],
            same: true
        }
        _this.id = _this.id + 1
        sameData.push(dealtData)
      }
      for (let num in group_item_collection_pairs) {
        let dealtData = {}
        dealtData = {
            id: _this.id,
            type: 'similar',
            api_1_name: group_item_collection_pairs[num]["first"],
            api_2_name: group_item_collection_pairs[num]["second"],
            same: false
        }
        _this.id = _this.id + 1
        sameData.push(dealtData)
      }
      _this.tableDataSame = sameData
    }
  }
})