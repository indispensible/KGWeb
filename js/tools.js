new Vue({
  el: '#app',
  data () {
    return {
    	result_string: new Array(),
    	query_1_prompt: 'query',
    	query_2_prompt: 'subject',
    	query_1: '',
    	query_2: '',
    	example_1: 'A thread-safe, mutable sequence of characters.',
    	example_2: 'java.lang.StringBuffer',
    	isActive: true,
    	isSpacy: false,
    	options: [{
          value: 'a',
          label: 'CompleteSubject'
        }, {
          value: 'b',
          label: 'coreference'
        }, {
          value: 'c',
          label: 'spacy'
        }],
        value: 'a'
    }
  },
  methods: {
  	display_loading () {
  		let _this = this
  		let query_1 = _this.query_1.trim()
  		let query_2 = _this.query_2.trim()
  		_this.$refs.result.style.display = 'none'
  		_this.result_string = new Array()
  		if (_this.value == 'a') {
  			if(query_1=='' || query_2==''){
  				alert("The input should not be empty!")
  			} else{
  				 _this.isActive = false
		  		 axios
		          .post(
		            'http://bigcode.fudan.edu.cn/kg/api/apiDiff/CompleteSubject/',
		            // 'http://127.0.0.1:5000/APIDifference/',
		            {query: query_1, candidate_subject: query_2})
		          .then(response => {
		          	_this.result_string.push(response.data['after_result'])
		            _this.hidden_loading()
		          })
		          .catch(error => {
		            console.log(error)
		            alert("Sorry! Network Error!")
	          })
	        }
  		} else if (_this.value == 'b') {
  			if(query_1=='' || query_2==''){
  				alert("The input should not be empty!")
  			} else{
  				 _this.isActive = false
		  		 axios
		          .post(
		            'http://bigcode.fudan.edu.cn/kg/api/apiDiff/coreference/',
		            // 'http://127.0.0.1:5000/APIDifference/',
		            {query: query_1, qualified_name: query_2})
		          .then(response => {
		          	_this.result_string.push(response.data['after_result'])
		            _this.hidden_loading()
		          })
		          .catch(error => {
		            console.log(error)
		            alert("Sorry! Network Error!")
		          })
		    }
  		} else if (_this.value == 'c') {
  			if(query_1==''){
  				alert("The input should not be empty!")
  			} else{
  				 _this.isActive = false
		  		 axios
		          .post(
		            'http://bigcode.fudan.edu.cn/kg/api/apiDiff/spacy/',
		            // 'http://127.0.0.1:5000/APIDifference/',
		            {query: query_1})
		          .then(response => {
		          	_this.result_string = response.data['after_result']
		            _this.hidden_loading()
		          })
		          .catch(error => {
		            console.log(error)
		            alert("Sorry! Network Error!")
		          })
		    }
  		}
  	},
  	hidden_loading () {
  		this.$refs.result.style.display = ''
  		this.isActive = true
  	},
  	change_search () {
  		let _this = this
  		_this.query_1 = ''
  		_this.query_2 = ''
  		if (_this.value == 'a') {
  			_this.example_1 = 'A thread-safe, mutable sequence of characters.'
  			_this.example_2 = 'java.lang.StringBuffer'
  			_this.query_2_prompt = 'subject'
  			_this.isSpacy = false
  		} else if (_this.value == 'b') {
  			_this.example_1 = 'A mutable sequence of characters. This class provides an API compatible with StringBuffer, but with no guarantee of synchronization. This class is designed for use as a drop-in replacement for StringBuffer in places where the string buffer was being used by a single thread (as is generally the case). Where possible, it is recommended that this class be used in preference to StringBuffer as it will be faster under most implementations.'
  			_this.example_2 = 'java.lang.StringBuilder'
  			_this.query_2_prompt = 'qualified_name'
  			_this.isSpacy = false
  		} else if (_this.value == 'c') {
  		    _this.example_1 = 'A mutable sequence of characters. This class provides an API compatible with StringBuffer, but with no guarantee of synchronization. This class is designed for use as a drop-in replacement for StringBuffer in places where the string buffer was being used by a single thread (as is generally the case). Where possible, it is recommended that this class be used in preference to StringBuffer as it will be faster under most implementations.'
  			_this.query_2_prompt = 'query'
  			_this.isSpacy = true
  		}
  	},
  	example () {
  		let _this = this
  		if (_this.value == 'a') {
  			_this.query_1 = _this.example_1
  			_this.query_2 = _this.example_2
  		} else if (_this.value == 'b') {
  			_this.query_1 = _this.example_1
  			_this.query_2 = _this.example_2
  		} else if (_this.value == 'c') {
  		    _this.query_1 = _this.example_1
  		}
  	}
  }
})