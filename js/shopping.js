
$("#header_opp span").click(function(){
	$(".goods-check").prop("checked", false);
    $(".checkboxon").removeClass("checkboxon");
    if($(this).text() == "编辑"){
      $(this).text("完成");
	  
      $(".payment-bar").css({bottom: "0rem", opacity: 0});
      $(".foot-edit").css({bottom: "1rem", opacity: 1});
    }else{
      $(this).text("编辑");
      $(".payment-bar").css({bottom: "1rem", opacity: 1});
      $(".foot-edit").css({bottom: "0rem", opacity: 0});
    }
  });






$(function(){
	// 数量减
	$(".minus").click(function() {
		var t = $(this).parent().find('.num');
		t.text(parseInt(t.text()) - 1);
		if (t.text() <= 1) {
			t.text(1);
		}
		TotalPrice();
	});
	// 数量加
	$(".plus").click(function() {
		var t = $(this).parent().find('.num');
		t.text(parseInt(t.text()) + 1);
		if (t.text() <= 1) {
			t.text(1);
		}
		TotalPrice();
	});
	/******------------分割线-----------------******/
	  // 点击商品按钮
  $(".goodsCheck").click(function() {
    var goods = $(this).closest(".shop-group-item").find(".goodsCheck"); //获取本店铺的所有商品
    var goodsC = $(this).closest(".shop-group-item").find(".goodsCheck:checked"); //获取本店铺所有被选中的商品
    var Shops = $(this).closest(".shop-group-item").find(".shopCheck"); //获取本店铺的全选按钮
    if (goods.length == goodsC.length) { //如果选中的商品等于所有商品
      Shops.prop('checked', true); //店铺全选按钮被选中
      if ($(".shopCheck").length == $(".shopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
        $("#AllCheck").prop('checked', true); //全选按钮被选中
        TotalPrice();
      } else {
        $("#AllCheck").prop('checked', false); //else全选按钮不被选中 
        TotalPrice();
      }
    } else { //如果选中的商品不等于所有商品
      Shops.prop('checked', false); //店铺全选按钮不被选中
      $("#AllCheck").prop('checked', false); //全选按钮也不被选中
      // 计算
      TotalPrice();
      // 计算
    }
  });
  // 点击店铺按钮
  $(".shopCheck").click(function() {
    if ($(this).prop("checked") == true) { //如果店铺按钮被选中
      $(this).parents(".shop-group-item").find(".goods-check").prop('checked', true); //店铺内的所有商品按钮也被选中
      if ($(".shopCheck").length == $(".shopCheck:checked").length) { //如果店铺被选中的数量等于所有店铺的数量
        $("#AllCheck").prop('checked', true); //全选按钮被选中
        TotalPrice();
      } else {
        $("#AllCheck").prop('checked', false); //else全选按钮不被选中
        TotalPrice();
      }
    } else { //如果店铺按钮不被选中
      $(this).parents(".shop-group-item").find(".goods-check").prop('checked', false); //店铺内的所有商品也不被全选
      $("#AllCheck").prop('checked', false); //全选按钮也不被选中
      TotalPrice();
    }
  });
  // 点击全选按钮
  $("#AllCheck1").click(function() {
   	allCheck($(this));
  });
  
    $("#AllCheck").click(function() {
   	allCheck($(this));
  });
  
  function allCheck(that){
	 
	   if (that.prop("checked") == true) { //如果全选按钮被选中
      $(".goods-check").prop('checked', true); //所有按钮都被选中
      TotalPrice();
    } else {
      $(".goods-check").prop('checked', false); //else所有按钮不全选
	  $(".settlement").css("background", "#ddd");
      TotalPrice();
    }
    $(".shopCheck").change(); //执行店铺全选的操作
  }
	//计算
  function TotalPrice() {
    var allprice = 0; //总价
    $(".shop-group-item").each(function() { //循环每个店铺
      var oprice = 0; //店铺总价
      $(this).find(".goodsCheck").each(function() { //循环店铺里面的商品
        if ($(this).is(":checked")) { //如果该商品被选中
          var num = parseInt($(this).parents(".shop-info").find(".num").text()); //得到商品的数量
          var price = parseFloat($(this).parents(".shop-info").find(".price").text()); //得到商品的单价
          var total = price * num; //计算单个商品的总价
          oprice += total; //计算该店铺的总价
        }
        $(this).closest(".shop-group-item").find(".ShopTotal").text(oprice.toFixed(2)); //显示被选中商品的店铺总价
      });
      var oneprice = parseFloat($(this).find(".ShopTotal").text()); //得到每个店铺的总价
      allprice += oneprice; //计算所有店铺的总价
    });
    $("#AllTotal").text(allprice.toFixed(2)); //输出全部总价
  }
});


//
$(".goods-check").click(checkStatus);

function checkStatus(){
	var count = 0;
	console.log($(".goods-check").size());
	$(".goods-check").each(function(item){
	
		if($(this).prop("checked")){
			$(".settlement").css("background", "#ff6699").removeAttr("disabled");
		}else{
			count++;
			if(count == $(".goods-check").size()){
				$(".settlement").css("background", "#ddd").attr("disabled",true);
			}
		}
		
	});
}
