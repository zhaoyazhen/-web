init = {
	checkboxall: function() {
		$('[data-checkAll]').on('click', function() {
			var $this = $(this);
						
			$(".checkbox").each(function() {
				if ($this.hasClass("checkboxon")) {
					$(this).removeClass("checkboxon");
					$(this).find("input[type='checkbox']").attr("checked", false);
				} else {
					$(this).addClass("checkboxon");
					$(this).find("input[type='checkbox']").attr("checked", true);
				}
			});
			
			init.computed();
			
			event.stopPropagation();
			return false;
		});
		
		// 店铺全选
		$('[data-shopAll]').on('click', function() {
			var ischeck = $(this).attr('class');
			
			if (ischeck == 'checkbox') {
				$(this).addClass('checkboxon');
				$(this).find('input[type="checkbox"]').attr('checked', true);
			} else {
				$(this).removeClass('checkboxon');
				$(this).find('input[type="checkbox"]').attr('checked', false);
			}
			
			$(this).parents('li').find('input[type="checkbox"]').each(function() {
				$(this).attr("checked", !$(this).attr("checked"));
				
				if ($(this).attr("checked"))
					$(this).parent().addClass('checkboxon');
				else
					$(this).parent().removeClass('checkboxon');
			});
			
			init.computed();
			
			event.stopPropagation();
			return false;
		});
		
		$('.checkbox').on('click', function() {
			var $this	= $(this);
			var isAll	= 1;
			var len		= $(this).parents('li').find('.list input[type="checkbox"]').length;
			
			var ischeck = $(this).attr('class');
			if (ischeck == 'checkbox') {
				$(this).addClass('checkboxon')
				$(this).find('input[type="checkbox"]').attr('checked', true)
			} else {
				$(this).removeClass('checkboxon')
				$(this).find('input[type="checkbox"]').attr('checked', false)
			}
			
			$(this).parents('li').find('.list input[type="checkbox"]').each(function() {
				if ($(this).attr("checked"))
					isAll += 1;
				else
					isAll -= 1;
			});
			
			if (isAll > len) {
				$this.parents('li').find('[data-shopall]').addClass('checkboxon');
				$('[data-shopall] input[type="checkbox"]').attr('checked', true)
			} else {
				$this.parents('li').find('[data-shopall]').removeClass('checkboxon');
				$('[data-shopall] input[type="checkbox"]').attr('checked', false);
			}
			
			if ($('.cart-main .checkbox').length == $('.cart-main .checkboxon').length)
				$('[data-checkAll]').addClass('checkboxon');
			else
				$('[data-checkAll]').removeClass('checkboxon');
			
			init.computed();
			
			event.stopPropagation();
			return false;
		});
		
		init.edit();
	},
	
	edit: function() {
		var isedit = false;
		$('[data-edit]').on('click', function() {
			$(".checkboxon").find("input").removeAttr("checked");
			$(".checkboxon").removeClass("checkboxon");
			
			if (isedit) {
				$(this).html('编辑')
				$('.foot-bar').animate({
					bottom: '1rem',
					opacity: 'show',
				}, 500)
				$('.foot-edit').animate({
					bottom: 0,
					opacity: 'toggle',
				}, 500)

				isedit = false;
			} else {
				$(this).html('完成')
				$('.foot-edit').animate({
					bottom: '1rem',
					opacity: 'show',
				}, 500)
				$('.foot-bar').animate({
					bottom: 0,
					opacity: 'toggle',
				}, 500)
				isedit = true;
			}
		})
		$('[data-delete]').on('click', function() {
			del();
		});
		
	},
	computed:function(){
		var totalPrice	= 0;
		var totalNum	= 0;
		
		$("[data-price]").each(function(){
			if($(this).parents(".list").find(".checkbox input").attr("checked")){
				var price	= parseFloat($(this).attr("data-price"));
				var num		= parseInt($(this).parents(".list").find("[data-cartid]").val());
				
				num			= num > 1 ? num : 1;
				price		= price * num;
				
				totalPrice	+= price;
				totalNum	+= num;
			}
		});
		
		$('[data-total]').html("￥" + totalPrice);
		$('[data-settlement]').html("结算" + "(" + totalNum + ")");
		

		if (totalNum > 0)
			$("[data-settlement]").css("background", "#f69");
		else
			$("[data-settlement]").removeAttr("style");
	}
}

$('[data-num]').on('click', '.plus', function() {
	var cartId	= $(this).prev().attr("data-cartid");
	var num 	= $(this).prev().val();
	
	if (isNaN(num))
		num = 1;
	
	num = parseInt(num);
	num += 1;
	
	var result = changeNum(cartId, num);
	
	if (result !== true)
		layer.open({
			content:result,
			time:2
		});
	else {
		$(this).prev().val(num);
		
		init.computed();
	}
});

$('[data-num]').on('click', '.minus', function() {
	var cartId	= $(this).next().attr("data-cartid");
	var num 	= $(this).next().val();
	
	if (isNaN(num))
		num = 1;
	
	num = parseInt(num);
	num = num - 1 >= 0 ? num - 1 : 0;
	
	var result = changeNum(cartId, num);
	
	if (result !== true)
		layer.open({
			content:result,
			time:2
		});
	else {
		$(this).next().val(num);
		
		init.computed();
	}
});

$('[data-num]').on('focusout', 'input', function() {
	var cartId		= $(this).attr("data-cartid");
	var goodsNum	= parseInt($(this).val());
	
	if (isNaN(goodsNum))
		return false;
	
	var result = changeNum(cartId, goodsNum);
	
	if (result !== true)
		layer.open({
			content:result,
			time:2
		});
	else
		init.computed();
});

function changeNum(cartId, goodsNum) {
	var flg = true;
	
	$.ajax({
			url:wss.func.siteUrl("cart/change_goods_num"),
			async:false,
			data:{cartId:cartId, goodsNum:goodsNum},
			type:"post",
			dataType:"json",
			success:function(data, textStatus) {
				if ( ! data.status)
					flg = data.message;
			}
	});
	
	return flg;
}
	
function del() {
	var cartIds = new Array();
	
	$(".list>.checkboxon").each(function() {
		cartIds.push($(this).attr("data_cartid"));
	});
	
	if (cartIds.length > 0) {

		layer.open({
			content:"您确定要删除这些商品吗？",
			btn:["确定", "取消"],
			yes:function() {
				$.ajax({
					url:wss.func.siteUrl("cart/del_goods"),
					async:false,
					data:{cartIds:cartIds.join(",")},
					type:"post",
					dataType:"json",
					success:function(result, textStatus) {
						if (result.status) {
							$(".list>.checkboxon").each(function() {
								if ($(this).parents("li").find(".list").length == 1)
									$(this).parents("li").remove();
								else
									$(this).parents(".list").remove();
							});
						} else
							layer.open({
								content:result.message,
								time:2
							});
						
						layer.closeAll();
					}
				});
			}
		});
	}
}

function settlement() {
	var goodsList = "";
	
	$(".list>.checkboxon").each(function() {
		var cartId		= $(this).attr("data_cartid");
		var goodsNum	= $(this).parents(".list").find(".plug-number>input").val();
		
		goodsList += cartId + "|" + goodsNum + ",";
	});
	
	if (goodsList)
		goodsList = goodsList.substr(0, goodsList.length - 1);
	else {
		layer.open({
			content:"请选择您要结算的商品。",
			time:2
		});

		return false;
	}
	
	$("#goods_list").val(goodsList);
		
	$("[name='frm_settlement']").submit();
}

wss.form.callback.reg("frm_settlement", {
	callback:function(result) {
		var param = result.data;
		
		wss.func.redirect("member/order/settlement/" + param);
	}
});

init.checkboxall();

$(function() {
	var $this = $("[data-checkAll]");
	
	$(".checkbox").each(function() {
		if ($this.hasClass("checkboxon")) {
			$(this).removeClass("checkboxon");
			$(this).find("input[type='checkbox']").attr("checked", false);
		} else {
			$(this).addClass("checkboxon");
			$(this).find("input[type='checkbox']").attr("checked", true);
		}
	});
	
	$this.addClass("checkboxon");
	$this.find("input[type='checkbox']").attr("checked", true);
	
	init.computed();
});