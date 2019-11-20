new Vue({
  el: '#app',
  data () {
    return {
    	all_result_string: '',
    	query_prompt: 'query',
    	query: '',
    	isActive: true
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
            'http://bigcode.fudan.edu.cn/kg/api/apiDiff/AnalyzeAPIDeclaration/',
            // 'http://127.0.0.1:5000/APIDifference/',
            {declaration: query})
          .then(response => {
            _this.all_result_string = response.data
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
  		this.query = "public class HashMap<K,V> extends AbstractMap<K,V> implements Map<K,V>, Cloneable, Serializable"
  	}
  }
})