  $("#header_opp span").click(function(){
    $(".checkboxon").removeClass("checkboxon");
    if($(this).text() == "编辑"){
      $(this).text("完成");
      $(".foot-bar").css({bottom: "0rem", opacity: 0});
      $(".foot-edit").css({bottom: "1rem", opacity: 1});
    }else{
      $(this).text("编辑");
      $(".foot-bar").css({bottom: "1rem", opacity: 1});
      $(".foot-edit").css({bottom: "0rem", opacity: 0});
    }
  });

  //多选 click
  $(".list .checkbox").click(function(){
    console.log($(this).get(0));
    var status = $(this).hasClass("checkboxon");
    if(status){
      $(this).removeClass("checkboxon");
       var p = parseFloat($(this).siblings(".cent").find(".price").text().substring(1));
       var n = parseFloat($(this).siblings(".cent").find("input").val());
       var t = parseFloat($(".total .num span").text().substring(1)) - n * p;
       $(".total .num span").text("￥" + t.toFixed(1));
       changeBtn(t.toFixed(1));
   }else{
       $(this).addClass("checkboxon");
       var p = parseFloat($(this).siblings(".cent").find(".price").text().substring(1));
       var n = parseFloat($(this).siblings(".cent").find("input").val());
       var t = parseFloat($(".total .num span").text().substring(1)) + n * p;
       if(t.toFixed(1)==0){

       }
       $(".total .num span").text("￥" + t.toFixed(1));
       changeBtn(t.toFixed(1));
   }

        var count = 0;
        var list_count = $(this).parent().parent().find(".list").size();
        $(this).parent().parent().find(".list .checkbox").each(function(){
          var a = $(this).hasClass("checkboxon");
          console.log(a);
          if(a){
            count++;
          }
        });


    if(count == list_count){
      $(this).parent().parent().find(".head-tit .checkbox").addClass("checkboxon");
    }else{
      $(this).parent().parent().find(".head-tit .checkbox").removeClass("checkboxon");
    }
  });

  //
  $(".head-tit .checkbox").click(function(){
    var status = $(this).hasClass("checkboxon");
    if(status){
      $(this).removeClass("checkboxon");
      $(this).parent().siblings(".list").find(".checkbox").removeClass("checkboxon");
    }else{
      $(this).addClass("checkboxon");
      $(this).parent().siblings(".list").find(".checkbox").addClass("checkboxon");
    }
  });

//-minus
  $(".minus").click(function(){
    var n = parseInt($(this).siblings("input").val()) - 1;
    n = n == -1 ? 0 : n;
    $(this).siblings("input").val(n);
    var price = parseFloat($(this).parent().siblings(".text").find(".price").text().substring(1));
    console.log($(this).parent().siblings(".checkbox"));
    var s = $(this).parent().parent().siblings(".checkbox").hasClass("checkboxon");
    if(s){
      var t = parseFloat($(".total .num span").text().substring(1));
      if(t > 0){
        t = parseFloat($(".total .num span").text().substring(1)) - price;
      }else{
        t = parseFloat($(".total .num span").text().substring(1));
      }
      
      $(".total .num span").text("￥" + t.toFixed(1));
      changeBtn(t.toFixed(1));
    }
  });
//+plus
  $(".plus").click(function(){
    var n = parseInt($(this).siblings("input").val()) + 1;

    $(this).siblings("input").val(n);
    var price = parseFloat($(this).parent().siblings(".text").find(".price").text().substring(1));
    var s = $(this).parent().parent().siblings(".checkbox").hasClass("checkboxon");
    if(s){
      var t = parseFloat($(".total .num span").text().substring(1)) + price;
      $(".total .num span").text("￥" + t.toFixed(1));
      changeBtn(t.toFixed(1));
    }
  });

  function changeBtn(p){
    console.log($(".btn"));
    if(p == 0){
      $(".btn:last").removeAttr("style");
    }else{
      $(".btn:last").attr("style", "background: rgb(255, 102, 153)");
    }
  }

 
