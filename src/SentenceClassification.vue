<template>
  <div id="SentenceFunction" class="container">
    <div id="content" ref="content">
        <h1  id="title" style="text-align: center">
<!--          <router-link style="color: #ffffff;" to="/">-->
<!--            Knowledge Pattern Prediction-->
<!--          </router-link>-->
          <router-link style="color: #ffffff;" to="/">
            Knowledge Pattern Prediction
          </router-link>
<!--          <p style="font-size: 18px;color: rgba(255, 255, 255, 0.8);line-height: 22px;width: 50%;text-align: justify;margin: -6% auto 0px;font-family: inherit;">等待添加描述信息。</p>-->
        </h1>
      <div id="input_frame">
        <el-form :model="form" :rules="rules" ref="form" @submit.native.prevent>
          <el-form-item prop="sentence">
            <el-input placeholder="please input sentence for prediction" v-model="form.sentence" clearable @keyup.enter.native="predict('form')">
              <el-button type="primary" slot="append" icon="el-icon-search" @click="predict('form')">Predict</el-button>
            </el-input>
          </el-form-item>
          <el-button type="primary" @click="example1">Example1</el-button>
          <el-button type="success" @click="example2">Example2</el-button>
          <el-button type="warning" @click="example3">Example3</el-button>
        </el-form>
      </div>
      <h4 v-show="preShow">Prediction</h4>
      <div id="prediction" v-show="preShow">
        <p><span>Sentence:</span><br>{{show_sentence}}</p>
        <p class="p_content"><span>Prediction:</span>&nbsp;&nbsp;{{type_text}}</p>
      </div>
      <h4>Introduction</h4>
      <div id="introduction">
      <p class="intro_name">[Functionality]</p>
      <p>—
        description of the functionality of API
        entities. Example: “Object used to report key and button events”.
      </p>
      <p class="intro_name">[Directive]</p>
      <p>—
        description about the usage of the API such as, correct or
        incorrect usage situations, constraints on method parameters, situations
        of exception throwing. Example: “IllegalArgumentException:
        if the modifiers parameter contains invalid modifiers”.
      </p>
      <p class="intro_name">[Other]</p>
      <p class="p_content ">—
        all other situations, usually implementation details.
      </p>
    </div>
      <div id="error" v-show="errorShow">
        <span>An error occurred on the server</span>
        <i id="error_close" class="el-icon-close" @click="errorShow = false"></i>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SentenceClassification',
  data () {
    return {
      form: {
        sentence: null
      },
      type_text: '',
      preShow: false,
      errorShow: false,
      show_sentence: null,
      rules: {
        sentence: [
          {required: true, message: 'Please input query', trigger: 'blur, change'}
        ]
      }
    }
  },
  methods: {
    example1 () {
      this.form.sentence = 'Appends the specified StringBuffer to this sequence.'
      // axios
      //   .get('http://bigcode.fudan.edu.cn/kg/api/function/functionExample/')
      //   .then(response => {
      //     this.form.sentence = response.data[0].text
      //   })
      //   .catch(error => console.log(error))
    },
    example2 () {
      this.form.sentence = 'This is unique only within the scope of the ORB that created the object adapter.'
      // axios
      //   .get('http://bigcode.fudan.edu.cn/kg/api/function/functionExample/')
      //   .then(response => {
      //     this.form.sentence = response.data[1].text
      //   })
      //   .catch(error => console.log(error))
    },
    example3 () {
      this.form.sentence = 'For details, see Threads and Swing, a section in The Java Tutorial.'
    },
    predict (form) {
      this.errorShow = false
      let _this = this
      this.$refs[form].validate((valid) => {
        if (valid) {
          axios
            .post('http://bigcode.fudan.edu.cn/kg/api/function/functionPredict/', {query: _this.form.sentence})
            .then(response => {
              console.log(response)
              let type = response.data.type
              switch (type) {
                case '1':
                  _this.type_text = 'Functionality'
                  break
                case '2':
                  _this.type_text = 'Directive'
                  break
                case '0':
                  _this.type_text = 'Others'
                  break
                default:
                  _this.type_text = 'Cannot Predidct exactlly'
                  break
              }
              _this.show_sentence = _this.form.sentence
              _this.$refs.content.style.marginTop = 0
              // _this.$refs.content.style.transform = 'translate(0px, -200px)'
              if (_this.preShow !== true) {
                setTimeout(function () {
                  _this.preShow = true
                }, 1000)
              }
            })
            .catch(error => {
              _this.$notify({
                title: 'Error',
                message: 'An error occurred on the server',
                type: 'error'
              })
              _this.errorShow = true
              console.log(error)
            })
        } else {
          _this.$notify({
            title: 'Error',
            message: 'Query cannot be empty',
            type: 'warning'
          })
          return false
        }
      })
    }
  },
  mounted () {
    this.$nextTick(function () {
      let body = document.getElementsByTagName("body")
      body[0].style.backgroundColor = "#00162d"
    })
  }
}
</script>

<style scoped>
  a:hover{
    text-decoration: none;
  }
  #SentenceFunction{
    padding: 100px auto 0 auto !important;
    margin: auto auto;
  }
  #content{
    width: 800px;
    margin: 50px auto 40px auto;
    transition: margin-top 1s;
  }
  #title{
    text-align: center;
    margin-top: 40px;
    margin-bottom: 40px;
    color: #f5f6fc;
  }
  .el-input:hover{
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .el-input__inner:focus{
    border: none!important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04) !important;
  }
  h4{
    margin-top: 30px;
    margin-bottom: 20px;
  }
  #prediction{
    margin: 0 auto 0 auto;
    width: 800px;
    padding: 20px 20px;
    background-color: #979ba6b5;
    color: #f5f6fc;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  .p_content{
    margin-bottom: 0 !important;
  }
  #introduction{
    width: 800px;
    margin: 10px auto;
    padding: 20px 20px;
    background-color: #f5f6fc;
    color: #1f2129;
    border-radius: 5px;
     /*box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);*/
  }
  .intro_name{
    color: #F56C6C!important;
    margin-bottom: 5px!important;
    font-weight: bold;
  }
  #input_frame{
    width: 800px;
    margin: 20px auto 0 auto;
  }
  #error{
    margin: 40px auto 0 auto;
    font-family: "Raleway";
    width: 800px;
    background-color: #F56C6C;
    color: white;
    border-radius: 5px;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
  }
  #error_close{
    float: right;
    line-height: 50px;
    cursor: pointer;
  }
  h1{
    color: #f5f6fc;
  }
  h4{
    color: #f5f6fc;
  }
</style>
