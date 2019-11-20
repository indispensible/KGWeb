new Vue({
  el: '#app',
  data () {
    return {
      loading: 'loading……',
      id: 1,
      isActive: true,
      api_1: '',
      api_2: '',
      // 各个knowledge的knowledge_type的命名集合
      functionalityList: ['Functionality'],
      characteristicList: ['Characteristic', 'Constraint'],
      categoryList_Membership: ['Membership'],
      categoryList_Concept_Classification: ['Concept Classification'],
      // 前端展现类型的顺序
      sortedDisplay: ['categoryList_Concept_Classification', 'categoryList_Membership', 'characteristic', 'functionality'],
      // 待整合的functionality集合
      rawFunctionalityList: [],
      // 两个api的相似方法
      tableDataSame: [],
      // 第一个api的独有方法
      tableDataDifferenceApi1: [],
      // 第二个api的独有方法
      tableDataDifferenceApi2: [],
      // 原始从后端导入的数据
      rawDataFromBackEnd: {},
      options: [{
          value: 'a',
          label: 'concise'
        }, {
          value: 'b',
          label: 'complete'
        }],
      value: 'a',
      // 默认是缩略版即关键词版
      post_url: 'http://bigcode.fudan.edu.cn/kg-debug/APIDifference/APIDifference/',
      url_query: '',
      judge_url_query: 1
    }
  },
  methods: {
    // calculateNumber (){
    //   let _this = this
    //   let rawData = _this.tableDataSame
    //   let functionality = 0
    //   let characteristic = 0
    //   let category = 0
    //   for (let key in rawData) {
    //     if (rawData[key]['type'] == 'functionality') {
    //       functionality += 1
    //     } else if (rawData[key]['type'] == 'characteristic') {
    //       characteristic += 1
    //     } else if (rawData[key]['type'] == 'category') {
    //       category += 1
    //     }
    //   }
    //   _this.functionalityNumber = functionality
    //   _this.characteristicNumber = characteristic
    //   _this.categoryNumber = category
    // },
    // objectSpanMethod({ row, column, rowIndex, columnIndex }) {
    //   let _this = this
    //   if (columnIndex === 0) {
    //     if (rowIndex === 0) {
    //       return {
    //         rowspan: _this.functionalityNumber,
    //         colspan: 1
    //       };
    //     } else if (rowIndex === _this.functionalityNumber) {
    //       return {
    //         rowspan: _this.characteristicNumber,
    //         colspan: 1
    //       };
    //     } else if (rowIndex === _this.functionalityNumber + _this.characteristicNumber) {
    //       return {
    //         rowspan: _this.categoryNumber,
    //         colspan: 1
    //       };
    //     } else {
    //       return {
    //         rowspan: 0,
    //         colspan: 0
    //       };
    //     }
    //   }
    // },
    // change_class ({row, column, rowIndex, columnIndex}) {
    //   let _this = this
    //   if (rowIndex === 0 && columnIndex === 0) {
    //     return 'functionality'
    //   } else if (rowIndex === _this.functionalityNumber && columnIndex === 0) {
    //     return 'characteristic'
    //   } else if (rowIndex === _this.functionalityNumber + _this.characteristicNumber && columnIndex === 0) {
    //     return 'category'
    //   }
    //   return '';
    // },
    deal_recent_search () {
        this.judge_url_query += 1  
        // 分类别处理
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
        let query = this.api_1 + " vs " + this.api_2
        let storage_array =  storage["API Comparison"].split("::!::")
        let index = storage_array.indexOf(query)
        if (index >= 0) {
            storage_array.splice(index, 1)
        }
        storage_array.unshift(query)
        storage_array = storage_array.slice(0,101)
        storage["API Comparison"] = storage_array.join("::!::")
        // 整体处理
        if (storage["all labels search"] == '' || storage["all labels search"] == undefined){
          storage["all labels search"] = "File to byte[] in Java:-!-:API Summary::!::StringBuffer vs  StringBuilder:-!-:API Comparison::!::How to create a toast:-!-:API Step Tutorial::!::Getting a File's MD5 Checksum in Java:-!-:Entity Search"
        }
        let all_query = query + ":-!-:API Comparison"
        if (this.judge_url_query == 1) {
          all_query = this.url_query + ":-!-:API Comparison"
        }
        let all_storage_array =  storage["all labels search"].split("::!::")
        let all_index = all_storage_array.indexOf(all_query)
        if (all_index >= 0) {
            all_storage_array.splice(all_index, 1)
        }
        all_storage_array.unshift(all_query)
        all_storage_array = all_storage_array.slice(0,101)
        storage["all labels search"] = all_storage_array.join("::!::")
    },
    change_search () {
      let _this = this
      if (_this.value == 'a') {
        // 这里是缩略版的url
        _this.post_url = 'http://bigcode.fudan.edu.cn/kg-debug/APIDifference/APIDifference/'
      } else {
        // 这里是完全版的url
        _this.post_url = 'http://bigcode.fudan.edu.cn/kg-debug/APIDifference/APIDifference/'
      }
      _this.$refs.sameTable.style.display = 'none'
      _this.$refs.api1Table.style.display = 'none'
      _this.$refs.api2Table.style.display = 'none'
      _this.$refs.presentation.style.display = 'none'
      _this.rawFunctionalityList = []
      _this.tableDataSame = []
      _this.tableDataDifferenceApi1 = []
      _this.tableDataDifferenceApi2 = []
      _this.rawDataFromBackEnd = {}
    },
    change_class_type ({row, rowIndex}) {
      let rawData = row
      // console.log(row)
      if (rawData["type"] == 'functionality') {
        if (rawData["just_merge"]) {
          return 'functionalityMerge'
        } else {
          return 'functionality'
        }
      } else if (rawData['type'] == 'characteristic') {
        return 'characteristic'
      } else if (rawData['type'] == 'categoryList_Membership') {
        return 'categoryList_Membership'
      } else if (rawData['type'] == 'categoryList_Concept_Classification') {
        return 'categoryList_Concept_Classification'
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
      _this.$refs.api1Table.style.display = 'none'
      _this.$refs.api2Table.style.display = 'none'
      _this.$refs.presentation.style.display = 'none'
      _this.rawFunctionalityList = []
      _this.tableDataSame = []
      _this.tableDataDifferenceApi1 = []
      _this.tableDataDifferenceApi2 = []
      _this.rawDataFromBackEnd = {}
    },
    example2: function () {
      let _this = this
      _this.api_1 = 'java.util.HashSet'
      _this.api_2 = 'java.util.Hashtable'
      _this.$refs.sameTable.style.display = 'none'
      _this.$refs.api1Table.style.display = 'none'
      _this.$refs.api2Table.style.display = 'none'
      _this.$refs.presentation.style.display = 'none'
      _this.rawFunctionalityList = []
      _this.tableDataSame = []
      _this.tableDataDifferenceApi1 = []
      _this.tableDataDifferenceApi2 = []
      _this.rawDataFromBackEnd = {}
    },
    display_loading: function() {
      let _this = this
      _this.trim()
      _this.$refs.sameTable.style.display = 'none'
      _this.$refs.api1Table.style.display = 'none'
      _this.$refs.api2Table.style.display = 'none'
      _this.$refs.presentation.style.display = 'none'
      _this.rawFunctionalityList = []
      _this.tableDataSame = []
      _this.tableDataDifferenceApi1 = []
      _this.tableDataDifferenceApi2 = []
      _this.rawDataFromBackEnd = {}
      _this.loading = "loading……"
      if (_this.api_1 == '' || _this.api_2 == ''){
        alert('The input is empty!!!')
      } else {
        _this.isActive = false
        axios
          .post(
            _this.post_url,
            // 'http://127.0.0.1:5000/APIDifference/',
            {api_1: _this.api_1, api_2: _this.api_2})
          .then(response => {
            this.deal_recent_search()
            _this.rawDataFromBackEnd = response.data
            if(_this.rawDataFromBackEnd != null){
              _this.deal_data()
              _this.hidden_loading()
            } else {
              let loadingSentence = "Sorry, we can't find the difference between " + _this.api_1 + " and " + _this.api_2
              alert(loadingSentence)
              this.loading = loadingSentence
            }
          })
          .catch(error => {
            console.log(error)
            // alert("Sorry! Network Error!")
            let loadingSentence = "Sorry, we can't find the difference between " + _this.api_1 + " and " + _this.api_2
            alert(loadingSentence)
            this.loading = loadingSentence
          })
        // _this.isActive = false
        // _this.deal_data()
        // _this.hidden_loading()
      }
    },
    hidden_loading: function () {
      let _this = this
      // console.log(_this.tableDataSame)
      _this.isActive = true
      _this.$refs.sameTable.style.display = ''
      _this.$refs.api1Table.style.display = 'inline-block'
      _this.$refs.api2Table.style.display = 'inline-block'
      _this.$refs.presentation.style.display = ''
      // if(_this.tableDataSame.length != 0){
      //     _this.$refs.sameTable.style.display = ''
      // }
      // if(_this.tableDataDifferenceApi1.length != 0){
      //     _this.$refs.api1Table.style.display = 'inline-block'
      // }
      // if(_this.tableDataDifferenceApi2.length != 0){
      //     _this.$refs.api2Table.style.display = 'inline-block'
      // }
    },
    trim: function() {
      let _this = this
      _this.api_1 = _this.api_1.replace(/(^\s*)|(\s*$)/g, "")
      _this.api_2 = _this.api_2.replace(/(^\s*)|(\s*$)/g, "")
    },
    deal_first_second_same_source (first_source, second_source) {
        let new_second_source = new Array()
        for (let i in second_source) {
          let judge = 1
          for (let j in first_source) {
            if (second_source[i] == first_source[j]){
              judge = 2
              break
            }
          }
          if (judge == 1) {
            new_second_source.push(second_source[i])
          }
        }
        return new_second_source
    },
    deal_first_or_second_duplicate_source (source) {
        let new_source = new Array()
        for (let i in source) {
          let judge = 1
          for (let j in new_source) {
            if (source[i] == new_source[j]){
              judge = 2
              break
            }
          }
          if (judge == 1) {
            new_source.push(source[i])
          }
        }
        return new_source
    },
    deal_data () {
      let _this = this
      let sameData = new Array()
      let Api1Difference = new Array()
      let Api2Difference = new Array()
      let group_item_collection = _this.rawDataFromBackEnd["group_item_collection"]
      let first_independent_collection = _this.rawDataFromBackEnd["first_independent_collection"]
      let second_independent_collection = _this.rawDataFromBackEnd["second_independent_collection"]
      // 形成tableDataSame,这个需要处理first或者second有多个的情况
      for (let num in group_item_collection) {
          let group_item_collection_single = group_item_collection[num]
          let knowledge_type = _this.judge_knowledge_type(group_item_collection_single["knowledge_type"])
          let first_api_knowledge_list = group_item_collection_single["first_api_knowledge_list"]
          let second_api_knowledge_list = group_item_collection_single["second_api_knowledge_list"]
          let first_length = first_api_knowledge_list.length
          let second_length = second_api_knowledge_list.length
          let long_length = 0
          let short_length = 0
          let sign_longer = 0
          let children_data = new Array()
          // 清理两个api的来源的数据，目的是去重
          let new_first_source = _this.deal_first_or_second_duplicate_source(first_api_knowledge_list[0]["info_from_text"])
          first_api_knowledge_list[0]["info_from_text"] = new_first_source
          let new_second_source = _this.deal_first_or_second_duplicate_source(second_api_knowledge_list[0]["info_from_text"])
          second_api_knowledge_list[0]["info_from_text"] = new_second_source
          if (first_length >= second_length) {
              long_length = first_length
              short_length = second_length
              sign_longer = 1
          } else {
              long_length = second_length
              short_length = first_length
              sign_longer = 2
          }
          let dealtData = {}
          // 判断是否合并，并加入合并项目的个数
          if (group_item_collection_single["are_they_same"]) {
              new_second_source = _this.deal_first_second_same_source(first_api_knowledge_list[0]["info_from_text"] , second_api_knowledge_list[0]["info_from_text"])
              if (long_length + short_length > 2) {
                dealtData = {
                  id: _this.id,
                  type: knowledge_type,
                  api_1_name: first_api_knowledge_list[0]["node_info"]["name"] + "(" + (long_length+short_length-2) + ")",
                  api_2_name: second_api_knowledge_list[0]["node_info"]["name"],
                  api_1_source: first_api_knowledge_list[0]["info_from_text"],
                  api_2_source: new_second_source,
                  same: true
                }
              } else {
                dealtData = {
                  id: _this.id,
                  type: knowledge_type,
                  api_1_name: first_api_knowledge_list[0]["node_info"]["name"],
                  api_2_name: second_api_knowledge_list[0]["node_info"]["name"],
                  api_1_source: first_api_knowledge_list[0]["info_from_text"],
                  api_2_source: new_second_source,
                  same: true
                }
              }
              _this.id = _this.id + 1
          } else {
            // console.log(first_api_knowledge_list[0]["node_info"]["name"] + ":" + first_length)
            // console.log(second_api_knowledge_list[0]["node_info"]["name"] + ":" + second_length)
            if (first_length > 1 && second_length > 1) {
              dealtData = {
                  id: _this.id,
                  type: knowledge_type,
                  api_1_name: first_api_knowledge_list[0]["node_info"]["name"] + "(" + (first_length - 1) + ")",
                  api_2_name: second_api_knowledge_list[0]["node_info"]["name"] + "(" + (second_length - 1) + ")",
                  api_1_source: first_api_knowledge_list[0]["info_from_text"],
                  api_2_source: second_api_knowledge_list[0]["info_from_text"],
                  same: false
              }
            } else if (first_length > 1) {
              dealtData = {
                  id: _this.id,
                  type: knowledge_type,
                  api_1_name: first_api_knowledge_list[0]["node_info"]["name"] + "(" + (first_length - 1) + ")",
                  api_2_name: second_api_knowledge_list[0]["node_info"]["name"],
                  api_1_source: first_api_knowledge_list[0]["info_from_text"],
                  api_2_source: second_api_knowledge_list[0]["info_from_text"],
                  same: false
              }
            } else if (second_length > 1) {
              dealtData = {
                  id: _this.id,
                  type: knowledge_type,
                  api_1_name: first_api_knowledge_list[0]["node_info"]["name"],
                  api_2_name: second_api_knowledge_list[0]["node_info"]["name"] + "(" + (second_length - 1) + ")",
                  api_1_source: first_api_knowledge_list[0]["info_from_text"],
                  api_2_source: second_api_knowledge_list[0]["info_from_text"],
                  same: false
              }
            } else {
              dealtData = {
                  id: _this.id,
                  type: knowledge_type,
                  api_1_name: first_api_knowledge_list[0]["node_info"]["name"],
                  api_2_name: second_api_knowledge_list[0]["node_info"]["name"],
                  api_1_source: first_api_knowledge_list[0]["info_from_text"],
                  api_2_source: second_api_knowledge_list[0]["info_from_text"],
                  same: false
              }
            }
            _this.id = _this.id + 1
          }
          // 处理左右要合并并有子项的数据
          if (long_length > 1 && group_item_collection_single["are_they_same"]) {
              for (let i = 1; i < long_length; i++) {
                  if (i < short_length) {
                      let children_dealt_data_1 = {
                          id: _this.id,
                          type: knowledge_type,
                          api_1_name: first_api_knowledge_list[i]["node_info"]["name"],
                          api_2_name: '',
                          api_1_source: first_api_knowledge_list[i]["info_from_text"],
                          api_2_source: [],
                          same: true
                      }
                      _this.id = _this.id + 1
                      children_data.push(children_dealt_data_1)
                      let children_dealt_data_2 = {
                          id: _this.id,
                          type: knowledge_type,
                          api_1_name: second_api_knowledge_list[i]["node_info"]["name"],
                          api_2_name: '',
                          api_1_source: second_api_knowledge_list[i]["info_from_text"],
                          api_2_source: [],
                          same: true
                      }
                      _this.id = _this.id + 1
                      children_data.push(children_dealt_data_2)
                  } else {
                      if (sign_longer == 1){
                          let children_dealt_data = {
                              id: _this.id,
                              type: knowledge_type,
                              api_1_name: first_api_knowledge_list[i]["node_info"]["name"],
                              api_2_name: '',
                              api_1_source: first_api_knowledge_list[i]["info_from_text"],
                              api_2_source: [],
                              same: true
                          }
                          _this.id = _this.id + 1
                          children_data.push(children_dealt_data)
                      } else {
                          let children_dealt_data = {
                              id: _this.id,
                              type: knowledge_type,
                              api_1_name: second_api_knowledge_list[i]["node_info"]["name"],
                              api_2_name: '',
                              api_1_source: second_api_knowledge_list[i]["info_from_text"],
                              api_2_source: [],
                              same: true
                          }
                          _this.id = _this.id + 1
                          children_data.push(children_dealt_data)
                      }
                  }
              }
              dealtData['children'] = children_data
            // 处理左右不用合并并有子项的数据
          } else if (long_length > 1) {
              for (let i = 1; i < long_length; i++) {
                  if (i < short_length) {
                      let children_dealt_data = {
                          id: _this.id,
                          type: knowledge_type,
                          api_1_name: first_api_knowledge_list[i]["node_info"]["name"],
                          api_2_name: second_api_knowledge_list[i]["node_info"]["name"],
                          api_1_source: first_api_knowledge_list[i]["info_from_text"],
                          api_2_source: second_api_knowledge_list[i]["info_from_text"],
                          same: false
                      }
                      _this.id = _this.id + 1
                      children_data.push(children_dealt_data)
                  } else {
                      if (sign_longer == 1){
                          let children_dealt_data = {
                              id: _this.id,
                              type: knowledge_type,
                              api_1_name: first_api_knowledge_list[i]["node_info"]["name"],
                              api_2_name: '',
                              api_1_source: first_api_knowledge_list[i]["info_from_text"],
                              api_2_source: [],
                              same: false
                          }
                          _this.id = _this.id + 1
                          children_data.push(children_dealt_data)
                      } else {
                          let children_dealt_data = {
                              id: _this.id,
                              type: knowledge_type,
                              api_1_name: '',
                              api_2_name: second_api_knowledge_list[i]["node_info"]["name"],
                              api_1_source: '',
                              api_2_source: second_api_knowledge_list[i]["info_from_text"],
                              same: false
                          }
                          _this.id = _this.id + 1
                          children_data.push(children_dealt_data)
                      }
                  }
              }
              dealtData['children'] = children_data
          }
          sameData.push(dealtData)
      }
      // console.log(sameData)
      let sortedSameDate = new Array()
      for (let num in _this.sortedDisplay) {
        sortedSameDate = _this.sorted_same_data(sortedSameDate, sameData, _this.sortedDisplay[num])
      }
      sortedSameDate = _this.sorted_functionality_data(sortedSameDate)
      // console.log(sortedSameDate)
      _this.tableDataSame = sortedSameDate
      // 形成tableDataDifferenceApi1
      for (let num in first_independent_collection) {
          let first_independent_collection_single = first_independent_collection[num]
          let knowledge_type = _this.judge_knowledge_type(first_independent_collection_single["knowledge_type"])
          let new_first_source = _this.deal_first_or_second_duplicate_source(first_independent_collection_single["api_knowledge"]["info_from_text"])
          first_independent_collection_single["api_knowledge"]["info_from_text"] = new_first_source
          let dealtData = {
              id: _this.id,
              type: knowledge_type,
              api_1_name: first_independent_collection_single["api_knowledge"]["node_info"]["name"],
              api_1_source: first_independent_collection_single["api_knowledge"]["info_from_text"],
          }
          _this.id = _this.id + 1
          Api1Difference.push(dealtData)
      }
      _this.tableDataDifferenceApi1 = Api1Difference
      // 形成tableDataDifferenceApi2
      for (let num in second_independent_collection) {
          let second_independent_collection_single = second_independent_collection[num]
          let knowledge_type = _this.judge_knowledge_type(second_independent_collection_single["knowledge_type"])
          let new_second_source = _this.deal_first_or_second_duplicate_source(second_independent_collection_single["api_knowledge"]["info_from_text"])
          second_independent_collection_single["api_knowledge"]["info_from_text"] = new_second_source
          let dealtData = {
              id: _this.id,
              type: knowledge_type,
              api_2_name: second_independent_collection_single["api_knowledge"]["node_info"]["name"],
              api_2_source: second_independent_collection_single["api_knowledge"]["info_from_text"],
          }
          _this.id = _this.id + 1
          Api2Difference.push(dealtData)
      }
      _this.tableDataDifferenceApi2 = Api2Difference
    },
    sorted_same_data (sortedSameDate, sameData, typeName) {
      let _this = this
      for (let num in sameData) {
        if (sameData[num]["type"] == typeName) {
          if (typeName == "functionality") {
            _this.rawFunctionalityList.push(sameData[num])
          } else {
            sortedSameDate.push(sameData[num])
          }
        }
      }
      return sortedSameDate
    },
    sorted_functionality_data (sortedSameDate) {
      let _this = this
      let apiNameToNumber = {}
      let apiName = []
      let sortedFunctionalityList = []
      let mergedSortedFunctionalityList = []
      for ( let num in _this.rawFunctionalityList) {
        apiNameToNumber[_this.rawFunctionalityList[num]["api_1_name"]] = num
        apiName.push(_this.rawFunctionalityList[num]["api_1_name"])
      }
      let sortedApiName = apiName.sort()
      let indexNum = 0
      for (let num in sortedApiName) {
        indexNum = apiNameToNumber[sortedApiName[num]]
        // sortedSameDate.push(_this.rawFunctionalityList[indexNum])
        sortedFunctionalityList.push(_this.rawFunctionalityList[indexNum])
      }
      console.log(sortedFunctionalityList)
      for (let num = 0 ; num < sortedFunctionalityList.length ; num++){
        // console.log(num)
        // console.log(!sortedFunctionalityList[num]["children"])
        if (!sortedFunctionalityList[num]["children"] && sortedFunctionalityList[num]["same"]) {
          let children_data = new Array()
          let firstSentence = sortedFunctionalityList[num]["api_1_name"]
          let endNum = 0
          let sameList = []
          for (endNum = num + 1 ; endNum < sortedFunctionalityList.length ; endNum++) {
            if (!sortedFunctionalityList[endNum]["children"] || !sortedFunctionalityList[num]["same"]){
              endNum = endNum
            } else {
              console.log(endNum)
              sameList.push(endNum)
              continue
            }
            let secondSentence = sortedFunctionalityList[endNum]["api_1_name"]
            // console.log(firstSentence + " : " +secondSentence)
            // console.log(_this.judge_first_word_same(firstSentence, secondSentence))
            if (_this.judge_first_word_same(firstSentence, secondSentence)) {
              sortedFunctionalityList[num]["just_merge"] = true
              sortedFunctionalityList[endNum]["just_merge"] = true
              children_data.push(sortedFunctionalityList[endNum])
            } else {
              break
            }
          }
          if (children_data.length > 0) {
            sortedFunctionalityList[num]["api_1_name"] = sortedFunctionalityList[num]["api_1_name"] + "(" + children_data.length + ")"
            sortedFunctionalityList[num]["children"] = children_data
          }
          mergedSortedFunctionalityList.push(sortedFunctionalityList[num])
          for (indexNum in sameList) {
            mergedSortedFunctionalityList.push(sortedFunctionalityList[sameList[indexNum]])
          }
          num = endNum - 1
        } else {
          mergedSortedFunctionalityList.push(sortedFunctionalityList[num])
        }
      }
      console.log(mergedSortedFunctionalityList)
      for (let num in mergedSortedFunctionalityList) {
        sortedSameDate.push(mergedSortedFunctionalityList[num])
      }
      return sortedSameDate
    },
    judge_first_word_same (firstSentence, secondSentence) {
      let firstWordFirstSentence = firstSentence.split(" ")[0]
      let firstWordSecondSentence = secondSentence.split(" ")[0]
      if (firstWordFirstSentence === firstWordSecondSentence) {
        return true
      } else {
        return false
      }
    },
    judge_knowledge_type (knowledge_type) {
      let _this = this
      let functionalityList = _this.functionalityList
      let characteristicList = _this.characteristicList
      let categoryList_Membership = _this.categoryList_Membership
      let categoryList_Concept_Classification = _this.categoryList_Concept_Classification
      for (let i in functionalityList) {
        if (knowledge_type == functionalityList[i]) {
            return "functionality"
        }
      }
      for (let i in characteristicList) {
        if (knowledge_type == characteristicList[i]) {
            return "characteristic"
        }
      }
      for (let i in categoryList_Membership) {
        if (knowledge_type == categoryList_Membership[i]) {
            return "categoryList_Membership"
        }
      }
      for (let i in categoryList_Concept_Classification) {
        if (knowledge_type == categoryList_Concept_Classification[i]) {
            return "categoryList_Concept_Classification"
        }
      }
    }
  },
  mounted: function () {
    this.$nextTick(function () {
      let url = window.location.href;
      // let url = decodeURIComponent(location.search);
      try {
        let name1 = url.split("?api_1_name=")[1]
        let name2 = name1.split("&api_2_name=")
        // console.log(name2)
        let api_1_name = name2[0]
        let api_2_name = name2[1]
        if (api_1_name != '' && api_1_name != null && api_2_name != '' && api_2_name != null) {
          this.api_1 = api_1_name
          this.api_2 = api_2_name
          this.display_loading()
        }
      } catch (error) {
        try {
          let query = decodeURIComponent(url.split("?query=")[1])
          if (query != undefined && query != "" && query != "undefined") {
            this.loading = "loading……"
            this.isActive = false
            axios
              .post(
                "http://bigcode.fudan.edu.cn/kg/api/apiDiff/QueryAPINames/",
                {"query": query})
              .then(response => {
                this.judge_url_query = 0
                this.url_query = query
                this.api_1 = response.data[0]["qualified_name"]
                this.api_2 = response.data[1]["qualified_name"]
                this.display_loading()
              })
              .catch(error => {
                console.log(error)
                let loadingSentence = "Sorry, we can't find two APIs in " + query
                alert(loadingSentence)
                this.loading = loadingSentence
              })
          } else {
            this.judge_url_query = 1
          }
        } catch (error) {
          this.judge_url_query = 1
          console.log("url中没有内容或者是没有正确内容")
        }
      }
    })
  }
})