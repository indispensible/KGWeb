var items = document.querySelectorAll(".timeline li");

function isElementInViewport(el) {
  var rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function callbackFunc() {
  for (var i = 0; i < items.length; i++) {
    if (isElementInViewport(items[i])) {
      if(!items[i].classList.contains("in-view")){
        items[i].classList.add("in-view");
      }
    } else if(items[i].classList.contains("in-view")) {
        items[i].classList.remove("in-view");
    }
  }
}
 
window.addEventListener("load", callbackFunc);
window.addEventListener("scroll", callbackFunc);

$("#timeH1").click(function(){
  window.location.href = "http://bigcode.fudan.edu.cn/kg/index.html#/";
})

$(document).ready(function(){
    $(".timeLi").mouseenter(function(){
        // var _this = this
        var nowId = $(this).attr('id')
        // var h1Id = "#h1_" + nowId
        // var p1 = "#p1_" + nowId
        var p2 = "#p2_" + nowId
        $(p2).show("slow")
        // $(h1Id).css("display", "none")
        // $(p1).css("display", "none")
        // $(p2).show("slow")
        // $(h1Id).css("display", "none")
        // $(h1Id).hide()
        // $(p1).hide(function(){
        //   $(h1Id).css("display", "none")
        //   $(p1).css("display", "none")
        //   $(p2).show()
        // })
        // $(".timeLi").mouseleave(function(){
        //   $(p2).hide("slow")
        //   // $(p2).css("display", "none")
        //   // $(h1Id).show("slow")
        //   // $(p1).show("slow")
        //     // $(p2).hide(function(){
        //     //   $(p2).css("display", "none")
        //     //   $(h1Id).show()
        //     //   $(p1).show()
        //     // })
        // })
    })
    // $("li").mouseleave(function(){
    //     $(".p2").css("display", "none")
    // })
})