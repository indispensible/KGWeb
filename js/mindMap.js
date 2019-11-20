var urlId = 0
var so_2_url = {}
var warning_2_url = {}
task_2_sentences = {}
characteristic_2_sentences = {}
functionality_2_sentences = {}

function create_mind_map(data){
    var mind = {
        "meta":{
            "name":"吕港",
            "author":"1547554745@qq.com",
            "version":"1.0"
        },
        "format":"node_array",
        "data":data
    };
    // console.log(mind)
    // console.log(so_2_url)
    // console.log(warning_2_url)
    var options = {
        container:'jsmind_container',
        theme:'belizehole',
        editable: true
    };
    var jm = new jsMind(options);
    layer.closeAll('loading');
    jm.show(mind);
    var colors = {
        "root": "#3498db",
        "characteristic":"#E6A23C",
        "functionality":"#67C23A",
        "sampleCode": "#909399",
        'stackOverflow': 'rgb(0, 255, 190)',
        'task': '#70edee',
        'warning': '#F56C6C'
    }
    // console.log($("jmnode[nodeid='root'").width())
    var translationWidth = ($("jmnode[nodeid='root'").width() + 20) / 2
    var left = $("jmnode[nodeid='root'")[0].offsetLeft
    var needTran = left - translationWidth - 1 + 'px'
    $("jmnode[nodeid='root'").animate({left: needTran});
    $("jmexpander").click(function(){
        // let translationWidth = ($("jmnode[nodeid='root'").width() + 20) / 2
        // let left = $("jmnode[nodeid='root'")[0].offsetLeft
        // let needTran = left - translationWidth - 1 + 'px'
        $("jmnode[nodeid='root'").animate({left: needTran});
    })
    var nodes = $("jmnode").each(function(i, obj){
        var childId = obj.getAttribute("nodeid")
        var childType = childId.split("_")[0]
        console.log(childType)
        obj.style.backgroundColor = colors[childType]
    })
    var tip_lvgang = ''
    $('jmnode').on('mouseenter',function () {
        var nodeid = this.getAttribute("nodeid")
        var nodeInfoList = nodeid.split("_")
        // console.log(nodeInfoList)
        var judgeNode = nodeInfoList[nodeInfoList.length - 1]
        var hoverText = this.innerHTML
        if(parseInt(judgeNode).toString() != "NaN"){
            var nodeType = nodeInfoList[0]
            if (nodeType == "sampleCode") {
                hoverText = "Please try to click me."
            }
            if (nodeType == "characteristic") {
                hoverText = '<div style="padding: 2px 6px 2px;line-height: 24px;word-break: break-all;overflow: hidden;font-size: 14px;"><pre style="white-space: pre-wrap;word-wrap: break-word;">name:' + hoverText + '<hr/>context:' + characteristic_2_sentences[hoverText] + '</pre></div>'
            }
            if (nodeType == "functionality") {
                hoverText = '<div style="padding: 2px 6px 2px;line-height: 24px;word-break: break-all;overflow: hidden;font-size: 14px;"><pre style="white-space: pre-wrap;word-wrap: break-word;">name:' + hoverText + '<hr/>context:' + functionality_2_sentences[hoverText] + '</pre></div>'
            }
        }
        tip_lvgang = layer.tips(hoverText, this, {
            tips: [1, '#68bdf6'],
            time: 400000,
            maxWidth: 481
          });
    });
    
    $('jmnode').on('mouseleave',function () {
        // console.log(this)
        // layer.closeAll('tips');
        layer.close(tip_lvgang);
    });

    $("jmnode").click(function(){
        // console.log(this)
        var nodeid = this.getAttribute("nodeid")
        var nodeInfoList = nodeid.split("_")
        // console.log(nodeInfoList)
        var judgeNode = nodeInfoList[nodeInfoList.length - 1]
        if(parseInt(judgeNode).toString() != "NaN"){
            var nodeType = nodeInfoList[0]
            // "characteristic"
            if (nodeType == "characteristic") {
                console.log(this)
            }
            // "functionality"
            if (nodeType == "functionality") {
                console.log(this)
            }
            // "sampleCode"
            if (nodeType == "sampleCode") {
                let sampleCode = this.innerHTML
                console.log(sampleCode)
                //页面层-自定义
                layer.open({
                    type: 1,
                    title: "Code",
                    maxWidth: '1000px',
                    shadeClose: true,
                    // btn: ['ok'],
                    content: '<div style="padding: 20px 20px 25px;line-height: 24px;word-break: break-all;overflow: hidden;font-size: 14px;overflow-x: hidden;overflow-y: auto;"><pre>' + sampleCode + '</pre></div>'
                });

            }
            // 'stackOverflow'
            if (nodeType == "stackOverflow") {
                var so = this.innerHTML
                // console.log(so)
                window.open(so_2_url[so])
            }
            // 'task'
            if (nodeType == "task") {
                let title = this.innerHTML
                let task = task_2_sentences[title]
                console.log(task)
                //页面层-自定义
                layer.open({
                    type: 1,
                    title: title,
                    maxWidth: '500px',
                    shadeClose: true,
                    // btn: ['ok'],
                    content: '<div style="padding: 20px 20px 25px;line-height: 24px;word-break: break-all;overflow: hidden;font-size: 14px;overflow-x: hidden;overflow-y: auto;"><pre>' + task + '</pre></div>'
                });
            }
            // 'warning'
            if (nodeType == "warning") {
                var warning = this.innerHTML
                // console.log(warning)
                window.open(warning_2_url[warning])
            }
        }
    })
}

function get_data() {
    var url = window.location.href
    var id = url.split("?id=")[1]
    if (id != '' && id != null) {
        urlId = id
        layer.load(2)
        // console.log(1)
        // var data = {'id': id}
        // var url1 = "http://bigcode.fudan.edu.cn/kg/api/graph/expandNode/"
        // console.log(data)
        // $.post(url1, data, function(result){
        //     console.log(result)
        // });
        axios
          .post(
            'http://bigcode.fudan.edu.cn/kg/api/graph/KnowledgeStructure/',
            {'id': parseInt(id), "top_number": 10})
          .then(response => {
            console.log(response)  
            // setInterval(function(){ alert("Hello"); }, 300000);
            dealt_data(response.data, id)
          })
          .catch(error => {
            console.log(error)
            alert("Sorry! Network Error!")
        })
    }
}

function save_storage(name, id){
    // 记录最近访问的api
    let storage=window.localStorage;
    let name_and_id = name + "::" + id
    console.log(name_and_id)
    if (storage["recent_apis"] == '' || storage["recent_apis"] == undefined) {
        storage["recent_apis"] = ""
    }
    let storage_array = storage["recent_apis"].split(":!:")
    let index = storage_array.indexOf(name_and_id)
    if (index >= 0) {
      storage_array.splice(index, 1)
    }
    storage_array.unshift(name_and_id)
    storage_array = storage_array.slice(0,51)
    storage["recent_apis"] = storage_array.join(":!:")
    console.log(storage)
}

function dealt_data(response, rootId){
    console.log("response")
    console.log(response)
    var data = new Array()
    var rootData = {"id":"root", "isroot":true, "topic":response.qualified_name}
    save_storage(response.qualified_name, rootId)
    data.push(rootData)
    // characteristic
    if (response['characteristic'] != '' && response['characteristic'] != undefined) {
        var characteristic = {"id":"characteristic", "parentid":"root", "topic":"characteristic", "direction":"right"}
        data.push(characteristic)
        for (let i in response.characteristic){
            var characteristicChild = {"id":"characteristic_" + i, "parentid":"characteristic", "topic":response.characteristic[i]["name"]}
            data.push(characteristicChild)
            let sentences = ""
            for (let j in response.characteristic[i]["context"]) {
                sentences += response.characteristic[i]["context"][j] + "\n"
            }
            characteristic_2_sentences[response.characteristic[i]["name"]] = sentences
        }
    }
    // functionality
    if (response['functionality'] != '' && response['functionality'] != undefined) {
        var functionality = {"id":"functionality", "parentid":"root", "topic":"functionality", "direction":"right"}
        data.push(functionality)
        for (let i in response.functionality){
            var functionalityChild = {"id":"functionality_" + i, "parentid":"functionality", "topic":response.functionality[i]["name"]}
            data.push(functionalityChild)
            let sentences = ""
            for (let j in response.functionality[i]["context"]) {
                sentences += response.functionality[i]["context"][j] + "\n"
            }
            functionality_2_sentences[response.functionality[i]["name"]] = sentences
        }
    }
    // sample_code
    if (response['sample_code'] != '' && response['sample_code'] != undefined) {
        var sample_code = {"id":"sampleCode", "parentid":"root", "topic":"sample code", "direction":"right"}
        data.push(sample_code)
        for (let i in response.sample_code){
            var sample_codeChild = {"id":"sampleCode_" + i, "parentid":"sampleCode", "topic":response.sample_code[i]}
            data.push(sample_codeChild)
        }   
    }
    // tutorial
    // if (response['tutorial'] != '' && response['tutorial'] != undefined) {
    //     var tutorial = {"id":"tutorial", "parentid":"root", "topic":"task", "direction":"right"}
    //     data.push(tutorial)
    //     for (let i in response.tutorial){
    //         var tutorialChild = {"id":"tutorial_" + i, "parentid":"tutorial", "topic":response.tutorial[i]}
    //         data.push(tutorialChild)
    //     }   
    // }

    // task
    if (response['task'] != '' && response['task'] != undefined) {
        var tutorial = {"id":"task", "parentid":"root", "topic":"API Step Tutorial", "direction":"right"}
        data.push(tutorial)
        for (let i in response.task){
            var tutorialChild = {"id":"task_" + i, "parentid":"task", "topic":response.task[i]["title"]}
            data.push(tutorialChild)
            let sentences = ""
            for (let j in response.task[i]["sentence"]) {
                sentences += response.task[i]["sentence"][j] + "\n"
            }
            task_2_sentences[response.task[i]["title"]] = sentences
        }   
    }
    // stack_overflow
    if (response['stack_overflow'] != '' && response['stack_overflow'] != undefined) {
        var stack_overflow = {"id":"stackOverflow", "parentid":"root", "topic":"stack overflow", "direction":"right"}
        data.push(stack_overflow)
        for (let i in response.stack_overflow){
            var stack_overflowChild = {"id":"stackOverflow_" + i, "parentid":"stackOverflow", "topic":response.stack_overflow[i]["title"]}
            so_2_url[response.stack_overflow[i]["title"]] = response.stack_overflow[i]["url"]
            data.push(stack_overflowChild)
        }   
    }
    // warning
    if (response['waring'] != '' && response['waring'] != undefined) {
        var waring = {"id":"warning", "parentid":"root", "topic":"warning", "direction":"right"}
        data.push(waring)
        var warning_types = ['Affirmative', 'Alternative', 'Condition', 'Emphasis', 'Error/Exception', 'Imperative', 'Negative', 'Note', 'Recommendation', 'Temporal']
        for(let i in warning_types) {
            let judge_have = 0
            for (let j in response.waring) {
                if (response.waring[j]["warning_tag"] == warning_types[i]) {
                    if (judge_have == 0) {
                        var warning_type = {"id":"warning_" + warning_types[i] , "parentid":"warning", "topic": warning_types[i]}
                        data.push(warning_type)
                    }
                    judge_have += 1
                    let warningChild = {"id":"warning_" + warning_types[i] + "_" + judge_have, "parentid":"warning_" + warning_types[i], "topic":response.waring[j]["warning_text"]}
                    warning_2_url[response.waring[j]["warning_text"]] = response.waring[j]["warning_url"]
                    data.push(warningChild)
                }
            }
        }   
    }

    // 处理百科界面数据
    // var rootData = ""
    // var nodes = response.nodes
    // for (var i in nodes) {
    //     if (nodes[i].id == rootId) {
    //         var rootNode = nodes[i]
    //         rootData = {"id":"root", "isroot":true, "topic":rootNode.name}
    //         data.push(rootData)
    //         // APIContent
    //         // console.log(rootNode)
    //         if(rootNode.labels != [] && rootNode.labels != null){
    //             var label = {"id":"APIContent", "parentid":"root", "topic":"Label", "direction":"left"}
    //             var labelchild = {"id":"APIContent_1", "parentid":"APIContent", "topic":rootNode.labels[0]}
    //             data.push(label)
    //             data.push(labelchild)
    //         }
    //         // Properties
    //         if(rootNode.properties != [] && rootNode.properties != null){
    //             var properties = {"id":"Properties", "parentid":"root", "topic":"Properties", "direction":"right"}
    //             data.push(properties)
    //             var numP = 0
    //             for (var j in rootNode.properties) {
    //                 numP += 1
    //                 var propertyName = j
    //                 var propertyParent = {"id":"Properties_" + numP, "parentid":"Properties", "topic":j}
    //                 var propertyParentId = "Properties_" + numP
    //                 data.push(propertyParent)
    //                 if (propertyName != "alias") {
    //                     numP += 1
    //                     var propertyChild = {"id":"Properties_" + numP, "parentid":propertyParentId, "topic":rootNode.properties[j]}
    //                     data.push(propertyChild)
    //                 } else {
    //                     for (var m in rootNode.properties[j]) {
    //                         numP += 1
    //                         var propertyChild = {"id":"Properties_" + numP, "parentid":propertyParentId, "topic":rootNode.properties[j][m]}
    //                         data.push(propertyChild)
    //                     }
    //                 }
    //             }
    //         }
    //         // Relations
    //         if(response.relations != [] && response.relations != null){
    //             var nodesId2Name = {}
    //             var nodeRelations = response.relations
    //             var relations = {"id":"Relations", "parentid":"root", "topic":"Relations", "direction":"left"}
    //             var numP = 0
    //             data.push(relations)
    //             for(var j in nodes){
    //                 nodesId2Name[nodes[j]["id"]] = nodes[j]["name"]
    //             }
    //             for (var j in nodeRelations) {
    //                 if (nodeRelations[j]["end_id"] != rootId) {
    //                     numP += 1
    //                     var relationId = "Relations_" + numP
    //                     var relationName = {"id":relationId, "parentid":"Relations", "topic":nodeRelations[j]["name"]}
    //                     data.push(relationName)
    //                     numP += 1
    //                     var relationChild = {"id":"Relations_" + numP, "parentid":relationId, "topic":nodesId2Name[nodeRelations[j]["end_id"]]}
    //                     data.push(relationChild)
    //                 } else {
    //                     numP += 1
    //                     var relationId = "Relations_" + numP
    //                     var relationName = {"id":relationId, "parentid":"Relations", "topic":nodeRelations[j]["name"]}
    //                     data.push(relationName)
    //                     numP += 1
    //                     var relationChild = {"id":"Relations_" + numP, "parentid":relationId, "topic":nodesId2Name[nodeRelations[j]["start_id"]]}
    //                     data.push(relationChild)
    //                 }
    //             }
    //         }
    //         break
    //     }
    // }
    // console.log(data)
    create_mind_map(data)
}

$(document).ready(function(){
    get_data()
    $("#encyclopaedia").click(function(){
        var url = "http://bigcode.fudan.edu.cn/kg/index.html#/KnowledgeData/" + urlId
        window.open(url)
    })
})