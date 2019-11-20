<template>
  <div id="graph" >
    <h1>hello</h1>
    <div id="mountNode">
    </div>
  </div>
</template>

<script>
import G6 from '@antv/g6'
import '@antv/g6/build/plugin.behaviour.analysis'
import axios from 'axios'

export default {
  name: 'graph',
  data () {
    return {
      graph_data: {
        nodes: [],
        edges: []
      },
      graph: null,
      id: null
    }
  },
  methods: {
    getId () {
      this.id = this.$route.params.id
    },
    getNodeData (id) {
      let node = {}
      axios
        .post('http://bigcode.fudan.edu.cn/kg-debug/getNodeByID/', {id: id})
        .then(response => {
          node.id = response.data['id']
          node.label = response.data['name']
          this.$set(this.nodes, this.nodes.length, node)
          console.log(response)
          // this.graph.read(this.graph_data)
        })
        .catch(error => console.log(error))
    },
    getNodeRelation (id) {
      axios
        .post('http://bigcode.fudan.edu.cn/kg-debug/GetOutRelation/', {id: id, page_number: 0})
        .then(response => {
          // console.log(response)
          response.data.relations.forEach(async (relation) => {
            let edge = {}
            await axios
              .post('http://bigcode.fudan.edu.cn/kg-debug/getNodeByID/', {id: relation.end_id})
              .then(response2 => {
                let node = {}
                // console.log(response2)
                node.id = response2.data['id']
                node.label = response2.data['name']
                // let node = await this.getNodeData(relation.end_id)
                // console.log(node) // undefined
                edge.target = node.id
                edge.id = relation.id
                edge.source = id
                edge.label = relation.name
                this.$set(this.nodes, this.nodes.length, node)
                this.$set(this.edges, this.edges.length, edge)
              })
              .catch(error => console.log(error))
          })
          // console.log(this.graph_data)
          this.graph.read(this.graph_data)
        })
        .catch(error => console.log(error))
    }
  },
  created () {
    this.getId()
  },
  mounted () {
    this.initG6()
    this.getNodeData(this.id)
    this.getNodeRelation(this.id)
  }
}
</script>

<style scoped>
#graph{
  width: 90%;
  height: 100%;
  margin: 0 auto;
}
</style>
