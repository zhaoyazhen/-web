imgload = function() {
	$("img[data-src]").lazyload({
		data_attribute: "src",
		threshold: 200
	});
};

imgload();

splitPrice = function(price) {
	price = price.toString().split(".");

	if (price.length == 2) {
		p1 = price[0];
		p2 = price[1];
	} else {
		p1 = price[0];
		p2 = '00';
	}
	if (p2.length == 1)
		p2 += '0';
	return new Array(p1, p2);
};

$('input[type="radio"]:checked').parent('.radio').addClass('radioon');

$('.radio').click(function() {
	$('.radio').removeClass('radioon')
	$(this).addClass('radioon')
});

$('input[type="checkbox"]:checked').parent('.checkbox').addClass('checkboxon');

$(document).on("click", ".checkbox", function() {
	var ischeck = $(this).attr('class');
	if (ischeck == 'checkbox') {
		$(this).addClass('checkboxon')
		$(this).find('input[type="checkbox"]').attr('checked', true)
	} else {
		$(this).removeClass('checkboxon')
		$(this).find('input[type="checkbox"]').attr('checked', false)
	}
	return false;
});

$('[data-file]').on('change', 'input[type="file"]', function() {
	var $this = $(this);
	var type = ($('[data-file]').data('file'))
	var objUrl = getObjectURL(this.files[0]);
	if (objUrl) {
		$this.parent().find('img').attr("src", objUrl);
	}
	if (objUrl && type == 'icon') {
		$this.parent().find('i').remove()
		$this.parent().find('img').attr('src', objUrl)
	}
});

getObjectURL = function(file) {
	var url = null;
	if (window.createObjectURL != undefined) { // basic
		url = window.createObjectURL(file);
	} else if (window.URL != undefined) { // mozilla(firefox)
		url = window.URL.createObjectURL(file);
	} else if (window.webkitURL != undefined) { // webkit or chrome
		url = window.webkitURL.createObjectURL(file);
	}
	return url;
};

$(function(){
	var urlstr		= location.href;
	var urlstatus	= false;
	
	$(".footer a li").each(function() {
		var imgsrc = $(this).children("img").attr("src");
		$(this).children("img").attr("src", typeof imgsrc != "undefined" ? imgsrc.replace("Hover", "Default") : "");
	});
	
	//$(".footer a li").removeClass("on");
	
	if (wss.func.trim(location.href + "/", "/") == zbj.SITE_URL) {
		var imgsrc = $(".footer a li:eq(0)").children("img").attr("src");
		$(".footer a li:eq(0)").children("img").attr("src", typeof imgsrc != "undefined" ? imgsrc.replace("Default", "Hover") : "");
		
		//$(".footer a li:eq(0)").addClass("on");
	} else {
		$(".footer a:not(:eq(0))").each(function () {
			if ((urlstr + "/").indexOf($(this).attr("href")) > -1 && $(this).attr("href") != "") {
				var imgsrc = $(this).find("li").children("img").attr("src");
				$(this).find("li").children("img").attr("src", typeof imgsrc != "undefined" ? imgsrc.replace("Default", "Hover") : "");
		
				//$(this).find("li").addClass("on");
				urlstatus = true;
			}
		});
	}
	
	if ( ! urlstatus) {
		var imgsrc = $(".footer a li:eq(0)").children("img").attr("src");
		$(".footer a li:eq(0)").children("img").attr("src", typeof imgsrc != "undefined" ? imgsrc.replace("Default", "Hover") : "");
		
		//$(".footer a").eq(0).find("li").addClass("on");
	}
});