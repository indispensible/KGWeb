import axios from 'axios'

function label2color (label) {
  axios
    .get('http://bigcode.fudan.edu.cn/kg/api/graph/getPublicLabels/')
    .then(response => {

    })
    .catch(error => console.error(error))
}

export default { label2color }
