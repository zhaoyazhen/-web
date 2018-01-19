zbj = {
	SITE_URL:"http://m.zhubaojie.com/index.php/",
	MAIN_URL:"http://www.zhubaojie.com/"
};

wss = WSS = {
	winWidth:$(window).width(),
	winHeight:$(window).height(),
	status:{
		stopPropagation:1
	},
	call:function(func, args) {
		if (typeof func === "string") {
			var fs = func.split('.');
			if (fs.length > 1) {
				func = window;
				$.each(fs, function (i, f) {
					func = func[f];
				});
			} else {
				func = window[func];
			}
		}
		
		if (typeof func === "function")
			return func.apply(null, args);
		else
			return null;
	},
	func:{
		inArray:function(value, array) {
			if ($.inArray(value, array) != -1)
				return true;
			else
				return false;
		},
		isset:function(item, object) {
			if (object instanceof Object)
				return item in object;
			else if (object instanceof Array)
				return inArray(item, object);
			else
				return false;
		},
		confirm:function() {
			var msg		= typeof arguments[0] !== "undefined" ? arguments[0] : "";
			var callYes	= typeof arguments[0] !== "undefined" ? arguments[1] : null;
			var callNo	= typeof arguments[0] !== "undefined" ? arguments[2] : null;
			
			layer.open({
				content:msg,
				btn:["确认", "取消"],
				yes:function() {
					if (callYes)
						callYes.call();
				},
				no:function() {
					if (callNo)
						callNo.call();
				}
			});
		},
		trim:function() {
			var str		= typeof arguments[0] !== "undefined" ? arguments[0] : "";
			var chars	= typeof arguments[1] !== "undefined" ? arguments[1] : null;
			
			if (chars)
				var rule = new RegExp("(^" + chars + "*)|(" + chars + "*$)", "g");
			else
				var rule = new RegExp("(^[ |\t|\0|\n|\r]*)|([ |\t|\0|\n|\r]*$)", "g");
			
			return str.replace(rule, "");
		},
		ltrim:function(string) {
			var str		= typeof arguments[0] !== "undefined" ? arguments[0] : "";
			var chars	= typeof arguments[1] !== "undefined" ? arguments[1] : null;
			
			if (chars)
				var rule = new RegExp("^" + chars + "*", "g");
			else
				var rule = new RegExp("^[ |\t|\0|\n|\r]*", "g");
			
			return str.replace(rule, "");
		},
		rtrim:function(string) {
			var str		= typeof arguments[0] !== "undefined" ? arguments[0] : "";
			var chars	= typeof arguments[1] !== "undefined" ? arguments[1] : null;
			
			if (chars)
				var rule = new RegExp(chars + "*$", "g");
			else
				var rule = new RegExp("[ |\t|\0|\n|\r]*$", "g");
			
			return str.replace(rule, "");
		},
		redirect:function(url) {
			location.href = wss.func.trim(zbj.SITE_URL, "/") + "/" + wss.func.trim(url, "/");
		},
		siteUrl:function(url) {
			return wss.func.trim(zbj.SITE_URL, "/") + "/" + wss.func.trim(url, "/");
		},
		device:function() {
			var agent = navigator.userAgent.toLowerCase();
			
			// 将版本字符转化成浮点型
			var parseVersion = function(label) {
				var exp = new RegExp(label+"/([^\\s\\_\\-]+)");
				
				label = (agent.match(exp)||[])[1];
				
				return label ? label.replace(/(?!^\d+\.)(\b\d+)./g, "$1") : false;
			};
			
			var result = {
				//获取当前操作系统
				os: function() {
					if (/windows/.test(agent))
						return "windows";
					else if(/linux/.test(agent))
						return "linux";
					else if(/|iphone|ipod|ipad|ios/.test(agent))
						return "ios";
				}()
				// 获取微信版本，不在微信WebWiew则返回falase
				,weixin:parseVersion("micromessenger")
				
				// 获取你的App版本，不在App WebWiew则返回falase。记得把myapp改成你的app特殊标识
				,myapp:parseVersion("myapp")
			};
			
			
			result.android	= /android/.test(agent);	//是否安卓
			result.ios		= result.os === "ios";		//是否IOS
			
			return result;
		}
	},
	init:function() {
		//截断表单提交
		$(document).on("submit", "form", function() {
			if (typeof $(this).attr("id") != "undefined") {
				WSS.form.submit($(this));
				return false;
			}
		});
	},
	form:{
		callback:{
			callbacks:{},
			reg:function(elemId, callbacks) {
				if (typeof wss.form.callback.callbacks[location.href] === "undefined")
					wss.form.callback.callbacks[location.href] = [];
				
				wss.form.callback.callbacks[location.href][elemId]	= callbacks;
			},
			getCallbacks:function(elemId) {
				if (typeof wss.form.callback.callbacks[location.href] === "object") {
					var callback = wss.form.callback.callbacks[location.href];
					
					if (typeof callback[elemId] === "object")
						return callback[elemId];
					else
						return false;
				} else
					return false;
			}
		},
		submit:function($form) {
			var elemId = $form.attr("id");
			
			if ( ! $form.length)
				return;
			
			var method	= $form.attr("method");
			
			if ( ! (method = (typeof(method) == "undefined" ? false : method)))
				return;
			
			method = method.toUpperCase();
			
			var action	= $form.attr("action");
			if ( ! (action = (typeof(action) == "undefined" ? false : action)))
				return;
			
			if ( ! WSS.func.inArray(method, ["GET", "POST"]))
				return;
			
			if ( ! action.length)
				return;
						
			$.ajax({
				url:action,
				data:$form.serialize(),
				type:method,
				dataType:"json",
				success:function(result, textStatus) {
					var buttons = $form.attr("wss-data-buttons");
					buttons		= buttons.toLowerCase()

					if (buttons == "nobutton") {
						var showDialog	= $form.attr("wss-data-showdialog");
						var callbacks	= false;
						
						if (showDialog == "false" || result.message.length == 0) {
							if (callbacks = wss.form.callback.getCallbacks(elemId)) {
								if (typeof callbacks.callback === "function") {
									var callback = callbacks.callback;
									callback.apply($form, [result]);
									//layer.closeAll();
								}
							}
						} else {
							var param		= {
								content:result.message,
								time:2
							};
							
							param.end = function() {
								if (callbacks = wss.form.callback.getCallbacks(elemId)) {
									if (typeof callbacks.callback === "function") {
										var callback = callbacks.callback;
										callback.apply($form, [result]);
										//layer.closeAll();
									}
								}
							};
						
							layer.open(param);
						}
					} else {
						var param = {
							content:result.message
						};
						
						if (typeof buttons !== "undefined") {
							switch (buttons) {
								case "confirmonly":
									param.btn = ["确认"];
									break;
								case "cancelonly":
									param.btn = ["取消"];
									break;
								case "both":
									param.btn = ["确认", "取消"];
									break;
								default:
									break;
							}
							
							if (elemId.length) {
								var callbacks = false;
								
								if (callbacks = wss.form.callback.getCallbacks(elemId)) {
									if (typeof callbacks.success === "function")
										param.yes = function() {
											var callback = callbacks.success;
											callback.apply($form, [result]);
											layer.closeAll();
										};
									
									if (typeof callbacks.fail === "function")
										param.no = function() {
											var callback = callbacks.fail;
											callback.apply($form, [result]);
											layer.closeAll();
										};
								}
							}
						} else
							param.time = 3;
						
						layer.open(param);
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown) {
					layer.open({
						content:"请求错误！",
						time:2 //2秒后自动关闭
					});
				},
				complete:function(XMLHttpRequest, textStatus) {
				}
			});
		}
	},
	validate:{
		valid:function(v) {
			var rules	= v.rules;
			var message	= v.message;
			var rule	= "";
			
			for (var elemId in rules) {
				for (var fun in rules[elemId]) {
					rule = rules[elemId][fun];
					
					if (typeof rule === "function") {
						if ( ! rule.apply()) {
							layer.open({
								content:message,
								time:2,
								btn:["确认"],
								end:function() {
									$("#" + elemId).focus();
								}
							});
							
							return false;
						}
					} else
						if ( ! WSS.call("WSS.validate." + fun, [elemId, rules[elemId][fun], message[elemId][fun]]))
							return false;
				}
			}
			
			return true;
		},
		/**
		 * 参数1：验证的元素ID
		 * 参数2：规则（可以是数值、function等）
		 * 参数3：错误提示
		 */
		required:function(elemId, rule, message) {
			if ( ! rule)
				return true;
			
			if ( ! $("#" + elemId).val().length) {
				layer.open({
					content:message,
					btn:["确认"],
					end:function() {
						$("#" + elemId).focus();
					}
				});
				
				return false;
			} else
				return true;
		},
		isMobile:function(elemId, rule, message) {
			if ( ! rule)
				return true;
			
			var val		= $("#" + elemId).val();
			var pattern	= /^1[34578]\d{9}$/;  
			
			if ( ! pattern.test(val)) {
				layer.open({
					content:message,
					btn:["确认"],
					end:function() {
						$("#" + elemId).focus();
					}
				});
				
				return false;
			} else
				return true;
		},
		compare:function(elemId, rule, message) {
			if ( ! rule)
				return true;
			
			if ($("#" + elemId).val() !== $("#" + rule).val()) {
				layer.open({
					content:message,
					btn:["确认"],
					end:function() {
						$("#" + elemId).focus();
					}
				});
				
				return false;
			} else
				return true;
		},
		checked:function(elemId, rule, message) {
			if ( ! rule)
				return true;
			
			if (typeof $("#" + elemId).attr("checked") === "undefined") {
				layer.open({
					content:message,
					btn:["确认"],
					end:function() {
						$("#" + elemId).focus();
					}
				});
				
				return false;
			} else
				return true;
		}
	}
};

$(function() {
	WSS.init();
});