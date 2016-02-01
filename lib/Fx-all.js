/*页面框架布局文件*/
var Fx = Fx || {}; //全局主页面对象
(function () {
    var enumerables = ['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable',
                       'toLocaleString', 'toString', 'constructor'];
    /*合并两个对象的值*/
    Fx.apply = function (object, config, defaults) {
		if (defaults) {
            Fx.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                if (typeof config[i] === 'function') {
                    config[i].$funcName = i;
                }

                if (typeof config[i] === 'object' && (object[Fx.depthclone] != '' && object[Fx.depthclone] != undefined) && (',' + Fx.depthclone + ',').indexOf(',' + i + ',') >= 0) {
                    object[i] = object[i] || new Object();
                    Fx.apply(object[i], config[i]);
                    continue;
                }
                object[i] = config[i];

            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }
        return object;
    };

    /*定义Fx声明类型方法*/
    Fx.apply(Fx, {
        depthclone: 'config',//深度拷贝属性(该属于用于继承,多个属性用逗号分隔;通常该属性用于配置属性深度拷贝)
        //Fx自定类型集合
        cls: new Array(),
        //Fx自定义枚举
        Enums: new Array(),
        /* 
         * 定义类型
         * clsName:类型名称
         * config:类型相关配置
         */
        define: function (clsName, config, blnEnum) {
            config = config || {};

            blnEnum = (blnEnum == undefined ? false : blnEnum);

            config.callParent = function (arguments) {
                return this.superObj[this.callParent.caller.$funcName].apply(this, (arguments || []));
            };

            //判断是否是声明枚举类型
            if (blnEnum == true) {
                Fx.Enums[clsName] = config;
                return;
            }

            Fx.cls[clsName] = function () {
                var struc = new Object();
                var arrDepthclone = Fx.depthclone.split(',');
                for (var i = 0; i < arrDepthclone.length; i++) {
                    struc[arrDepthclone[i]] = {};
                }

                if (config.extend) {
                    //需要继承
                    var extendObj = eval(config.extend + "()");
                    config.superObj = extendObj;
                    Fx.apply(struc, extendObj);
                }
                //设置默认的唯一标示符
                var cloConfig = Fx.Clone(config);
                cloConfig.id = Fx.getGuidGenerator();
                return Fx.apply(struc, cloConfig);
            }

        },
        support: {
            touch: (window.Modernizr && Modernizr.touch === true) || (function () {
                'use strict';
                return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
            })(),

            transforms3d: (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
                'use strict';
                var div = document.createElement('div').style;
                return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
            })(),

            transforms: (window.Modernizr && Modernizr.csstransforms === true) || (function () {
                'use strict';
                var div = document.createElement('div').style;
                return ('transform' in div || 'WebkitTransform' in div || 'MozTransform' in div || 'msTransform' in div || 'MsTransform' in div || 'OTransform' in div);
            })(),

            transitions: (window.Modernizr && Modernizr.csstransitions === true) || (function () {
                'use strict';
                var div = document.createElement('div').style;
                return ('transition' in div || 'WebkitTransition' in div || 'MozTransition' in div || 'msTransition' in div || 'MsTransition' in div || 'OTransition' in div);
            })(),

            classList: (function () {
                'use strict';
                var div = document.createElement('div');
                return 'classList' in div;
            })(),
            //判断元素是否为Jquery对象
            //dom:元素
            IsJqObj: function (dom) {
                var BlnJQuery = false; //判断对象是否Jquery对象
                if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
                //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
                if (dom.selector != undefined) { BlnJQuery = true; }
                
                return BlnJQuery;
            }
        },
		//兼容Placeholder
		//contianer:input容器
		placeholder:function(contianer){
			var isPlaceholder=function(){
					var input = document.createElement('input');
					return 'placeholder' in input;
				};
				if(!isPlaceholder()){
					var inputs=contianer.find('input[type="text"],input[type="password"]');
					var browser=Fx.browserInfo();
					var blnIE8=(browser.version=='8.0' && browser.browser=='IE');
					
					for(var i=0;i<inputs.length;i++){
						var input=$(inputs[i]);
						input.val(input.attr('placeholder'));
						input.css('color','#999');
						if(input.attr('type')=='password'){
							if(blnIE8){
								//IE8
								input.next().show();
								input.hide();
								input.attr('oriType','password');
								input.next().attr('oriType','password');
								input.next().attr('oriShow','password');
							}else{
								input.attr('type','text');
								input.attr('oriType','password');
							}
						}
						
						input.focus(function(){
							if($(this).attr('placeholder')==$(this).val()){
									$(this).val('');
							}
							if($(this).attr('oriType')=='password'){
								if(blnIE8){
									//IE8
									if($(this).attr('oriShow')=='password'){
										$(this).hide();
										$(this).val($(this).attr('placeholder'));
										$(this).prev().show();
										$(this).prev().focus();
									}
								}else{
									$(this).attr('type','password');
								}
							}
				
						});
						
						input.blur(function(){
							if($(this).val()==''){
								$(this).val($(this).attr('placeholder'));
							}
							if($(this).attr('oriType')=='password' && ($(this).val()==$(this).attr('placeholder'))){
								if(blnIE8){
									//IE8
									$(this).next().show();
									$(this).hide();
								}else{
									$(this).attr('type','text');
								}
							}
						});
					}
				}
		},
		//浏览器信息
		browserInfo:function(){
			var ua = navigator.userAgent.toLowerCase(),
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
			rFirefox = /(firefox)\/([\w.]+)/,
			rOpera = /(opera).+version\/([\w.]+)/,
			rChrome = /(chrome)\/([\w.]+)/,
			rSafari = /version\/([\w.]+).*(safari)/;
			var match = rMsie.exec(ua);
			if (match != null) {
				return {
					browser: "IE",
					version: match[2] || "0"
				};
			}
			var match = rFirefox.exec(ua);
			if (match != null) {
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			}
			var match = rOpera.exec(ua);
			if (match != null) {
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			}
			var match = rChrome.exec(ua);
			if (match != null) {
				return {
					browser: match[1] || "",
					version: match[2] || "0"
				};
			}
			var match = rSafari.exec(ua);
			if (match != null) {
				return {
					browser: match[2] || "",
					version: match[1] || "0"
				};
			}
			if (match != null) {
				return {
					browser: "",
					version: "0"
				};
			}
		},
		//动画执行完回调函数
		//dom:'执行动画元素'
		//callback:动画执行完回调函数
		animationend:function(dom,callback){
			var t;
			var curanimation=null;
			dom = Fx.support.IsJqObj(dom) ? dom[0]:dom;
			
			var animations = {
			  'animation':'animationend',
			  'Oanimation':'oanimationend ',
			  'Mozanimation':'mozAnimationEnd ',
			  'Webkitanimation':'webkitAnimationEnd  ',
			  'Msanimation':'MSAnimationEnd '
			};

			for(t in animations){
				if(dom.style[t] !== undefined ){
					curanimation=animations[t];
				}
			}
			
			if(!curanimation){return;}
			dom.addEventListener(curanimation, function(){ //动画结束时事件 
				callback(dom);
			}); 		
		},
        browser: {
            ie8: (function () {
                'use strict';
                var rv = -1; // Return value assumes failure.
                if (navigator.appName === 'Microsoft Internet Explorer') {
                    var ua = navigator.userAgent;
                    var re = new RegExp(/MSIE ([0-9]{1,}[\.0-9]{0,})/);
                    if (re.exec(ua) !== null)
                        rv = parseFloat(RegExp.$1);
                }
                return rv !== -1 && rv < 9;
            })(),

            ie10: window.navigator.msPointerEnabled,
            ie11: window.navigator.pointerEnabled
        },
        Clone: function (myObj) {
            if (typeof (myObj) != 'object') return myObj;
            if (myObj == null) return myObj;
            if (myObj instanceof Array) {
                myNewObj = new Array();
            } else {
                var myNewObj = new Object();
            }
            for (var i in myObj)
                myNewObj[i] = this.Clone(myObj[i]);
            return myNewObj;
        },
		//获取地址栏参数值
		GetQueryString:function(url,name)
		{
			var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");   
			var num=url.indexOf("?");
			var search=url.substr(num+1);
			var r = search.match(reg);
			if(r!=null)return  unescape(r[2]); return null;
		},
		/* 
         * 字符串日期转化时间戳
         * timeStr:日期字符串(yyyy-MM-dd hh:mm:ss)
         */
		Timestamp:function(timeStr){
			return Date.parse(timeStr.replace(/-/g, "/"))/1000;
		},
		/* 
         * 将时间戳转化为指定日期格式
         * timestampStr:时间戳字符串
		 * format:日期格式字符串(yyyy-MM-dd h:m:s)
         */
		 DateByTimestamp:function(timestampStr,format){
			 var dateFormat=function(dateobj){
				 var date = {
						  "M+": dateobj.getMonth() + 1,
						  "d+": dateobj.getDate(),
						  "h+": dateobj.getHours(),
						  "m+": dateobj.getMinutes(),
						  "s+": dateobj.getSeconds(),
						  "q+": Math.floor((dateobj.getMonth() + 3) / 3),
						  "S+": dateobj.getMilliseconds()
				   };
			   if (/(y+)/i.test(format)) {
					  format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
			   }
			   for (var k in date) {
					  if (new RegExp("(" + k + ")").test(format)) {
							 format = format.replace(RegExp.$1, RegExp.$1.length == 1
									? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
					  }
			   }
				return format;				 
			 };
			 
			 var newDate = new Date();
			 newDate.setTime(timestampStr * 1000);
			 
			 return dateFormat(newDate);
		 },
		 
		 DateFormat:function(dateobj,format){
		  var date = {
					  "M+": dateobj.getMonth() + 1,
					  "d+": dateobj.getDate(),
					  "h+": dateobj.getHours(),
					  "m+": dateobj.getMinutes(),
					  "s+": dateobj.getSeconds(),
					  "q+": Math.floor((dateobj.getMonth() + 3) / 3),
					  "S+": dateobj.getMilliseconds()
			   };
		   if (/(y+)/i.test(format)) {
				  format = format.replace(RegExp.$1, (dateobj.getFullYear() + '').substr(4 - RegExp.$1.length));
		   }
		   for (var k in date) {
				  if (new RegExp("(" + k + ")").test(format)) {
						 format = format.replace(RegExp.$1, RegExp.$1.length == 1
								? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
				  }
		   }
			return format;	
		 },
		 //网站访问源
		VisitOri:(function(){
			 var browser={
				versions:(function(){
				   var u = navigator.userAgent;
				   return {
					//移动终端浏览器版本信息
					trident: u.indexOf('Trident') > -1, //IE内核
					presto: u.indexOf('Presto') > -1, //opera内核
					webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/), //是否为移动终端
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
					iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, //是否iPad
					webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
					};
				   })()
		   };
		   
			 if( browser.versions.android || browser.versions.iPhone || browser.versions.iPad){
				return 'phone';
			 }
				return 'pc';
		})(),
        /* 
         * 加载文件
         * url:包含路径的文件名称
         * callback:文件加载完成后的回调函数
		 * isJs:判断是否是加载JS文件,否则加载Css文件
         */
       loadJsCss: function (url, callback, isJs) {// 非阻塞的加载 后面的js会先执行
            var isJs = (isJs === undefined ? true : isJs);
            function onloaded(script, callback) {//绑定加载完的回调函数
                if (script.readyState) { //ie
                    script.attachEvent('onreadystatechange', function () {
                        if (script.readyState == 'loaded' || script.readyState == 'complete') {
							//if(script.className=='loaded'){return;}
                            script.className = 'loaded';
                            callback && callback.constructor === Function && callback(true);
                        }
                    });
                } else {
					var invoke=false;
                    script.addEventListener('load', function () {
						if(invoke){return;}
						invoke=true;
						script.className = "loaded";
						callback && callback.constructor === Function && callback(false);
						callback=null;
					}, false);
					if(Fx.VisitOri!='pc' && !isJs)Fx.DelayTrigger(function(){if(!invoke){invoke=true;if(callback){callback(false);callback=null;}}},new Object(),200);
				}
            }
            if (!isJs) { //加载css
                var links = document.getElementsByTagName('link');
                for (var i = 0; i < links.length; i++) {//是否已加载
                    if (links[i].href.indexOf(url) > -1 && callback && (callback.constructor === Function)) {
						//已创建script
                        if (links[i].className === 'loaded') {//已加载
                            callback();
                        } else {//加载中
                            onloaded(links[i], callback);
                        }
                        return;
                    }
                }
                var link = document.createElement('link');
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                var head = document.getElementsByTagName('head')[0];
                head.insertBefore(link, head.getElementsByTagName('link')[0] || null);
				onloaded(link, callback);
            } else { //加载js
                var scripts = document.getElementsByTagName('script');
                for (var i = 0; i < scripts.length; i++) {//是否已加载
                    if (scripts[i].src.indexOf(url) > -1 && callback && (callback.constructor === Function)) {
                        //已创建script
                        if (scripts[i].className === 'loaded') {//已加载	
                            callback(true);
                        } else {//加载中
                            onloaded(scripts[i], callback);
                        }
                        return;
                    }
                }
                var script = document.createElement('script');
                script.type = "text/javascript";
                script.src = url;
                document.body.appendChild(script);
                onloaded(script, callback);

            }
        },
		/* 
         * 加载多个文件(js,css)
         * arr:文件地址数组
		 * callback:回调函数
         */
		loadMulFile:function(loadarr,callback){
			var arr=Fx.Clone(loadarr);
			
			if(arr.length<=0){return;}
			var loadFunc=function(arr){
				if(arr.length==0){return;}
				var url= arr.shift();
				var fileSuffix=Fx.Regex.Match(url,Fx.Regex.Regular.FileSuffix);
				if(fileSuffix=='js' || fileSuffix=='css'){
					var blnJs=fileSuffix=='js';//是否是Js文件	
					Fx.loadJsCss(url,function(flag){
						if(arr.length==0){
							if(!callback){return;}
							callback(flag);
							callback=null;
						}else{
							loadFunc(arr);
						}
					},blnJs);
					return;
				}
				loadFunc(arr);		
			};
			
			loadFunc(arr);
		},
		/* 
         * 映射集合中的对象/单个对象为新的对象
         * mapobj:映射对象/映射集合
         * mapcondition:映射条件{sourceAtrr(源属性):newAtrr:(映射后的新属性名)}
         */
		MapObject:function(mapobj,mapcondition){
			//内部方法
			
			var map=function(item){
				var newobj={};
				for(var key in item){
					if(mapcondition[key]){
						newobj[mapcondition[key]]=item[key];
					}else{
						newobj[key]=item[key];
					}
				}
				return newobj;
			};
			
			if(mapobj instanceof Array){
				var result=[];
				//数组
				for(var index=0;index<mapobj.length;index++){
					var item=mapobj[index];
					result.push(map(item));
				}
				
				return result;
			}else{
				//单个对象
				return map(mapobj);
			}
			
		},
        /* 
         * 格式化字符串
         * format:需要格式化的字符串
         */
        format: function (format) {
            var formatRe = /\{(\d+)\}/g;
            var args = new Array();
            for (var i = 1; i < arguments.length; i++) {
				if(arguments[i] instanceof  Array){
					for(var k=0;k<arguments[i].length;k++){
						args[k]=arguments[i][k];
					}
				}else{
					args[i - 1] = arguments[i];
				}
            }
            //检查替换字符串中包含的图片标签
            var imgSrc = new Array();//图片地址数组集合
            var imgReplace = Fx.Regex.Match(format, Fx.Regex.Regular.ImageUrl);

            for (var j = 0; j < imgReplace.length; j++) {
                var matchReuslt = Fx.Regex.Match(imgReplace[j], Fx.Regex.Regular.ImgSrc);//路径匹配结果
                if (matchReuslt == "") { continue; }
                if (!formatRe.test(matchReuslt[1])) { continue; }
                imgSrc.push(matchReuslt[1]);
            }

            return format.replace(formatRe, function (m, i) {
                //判断是否是替换图片地址信息(如果是则需要判断地址信息是否正确,确保程序不出现异常)
                for (var k = 0; k < imgSrc.length; k++) {
                    if (imgSrc[k] == m) {
                        return Fx.Regex.Verify(args[i], Fx.Regex.Regular.ImageFormat) == true ? args[i] : ''
                    }
                }
                return args[i];
            });
        },
        /* 
         * 对象转化成字符串格式
         * obj:需要转化的对象
         */
        objcetToString: function (obj) {
            if (obj == undefined) { return "0"; }
            var result = '';
            //判断对象是否是数组对象
            if (obj instanceof Array) {
                result += "[";
                var arrItem = new Array();
                for (var index = 0; index < obj.length; index++) {
                    arrItem.push(this.objcetToString(obj[index]));
                }
                result += arrItem.join(',') + "]";
            } else//单个对象
            {
                result += "{";
                var arrPro = new Array();
                for (var key in obj) {
                    if (obj[key] instanceof Array) {
                        arrPro.push(Fx.format("'{0}':{1}", key, this.objcetToString(obj[key])));
                    } else {
                        arrPro.push(Fx.format("'{0}':'{1}'", key, obj[key]));
                    }
                }

                result += arrPro.join(',');
                result += "}";
            }
            return result;
        },
        /* 
         * Json对象转化成字符串格式
         * obj:需要转化的对象
         */
        JsonToString: function (obj) {
            var self = this;
            if (obj == undefined) { return "0"; }
            var result = '';
            result += "{";
            var arrPro = new Array();
            for (var key in obj) {
                arrPro.push(Fx.format('"{0}":"{1}"', key, obj[key]));
            }
            return result += arrPro.join(',') + "}";
        },
        /* 
         * 转化带有PX单位的字符串为Int类型
         * obj:需要转化的对象
         */
        ConvertPxToInt: function (str) {
            if (str == undefined) { return 0; }
            if (!isNaN(str)) { return str; }
            return parseInt(str.replace('px', ''));
        },
		PxToInt:function(str){
			return this.ConvertPxToInt(str);
		},
        /* 
         * 获取当前元素距离页面左边的距离
         * obj:需要转化的对象
         */
        Left: function (obj) {
            var left = 0;
            var prevs = $(obj).prevAll();
            var self = this;
            var i = 0;
            var prevWidth = $(obj).css('width');
            var prevPaddingLeft = $(obj).css('padding-left');
            var prevPaddingRight = $(obj).css('padding-right');
            var marginLeft = $(obj).css('margin-left');
            var marginRight = $(obj).css('margin-right');
            left += (self.ConvertPxToInt(prevWidth) + self.ConvertPxToInt(prevPaddingLeft) + self.ConvertPxToInt(prevPaddingRight) + self.ConvertPxToInt(marginLeft) + self.ConvertPxToInt(marginRight));				//alert(left);			});
            return left;
        },
        /* 
         * 获取当前元素距离页面顶部的距离
         * obj:需要转化的对象
         */
        getHeight: function (el, outer, round) {
            'use strict';
            if (outer) return el.offsetHeight;

            var height = window.getComputedStyle(el, null).getPropertyValue('height');
            var returnHeight = parseFloat(height);
            //IE Fixes
            if (isNaN(returnHeight) || height.indexOf('%') > 0 || returnHeight < 0) {
                returnHeight = el.offsetHeight - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            }
            if (outer) returnHeight += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-top')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-bottom'));
            if (round) return Math.ceil(returnHeight);
            else return returnHeight;
        },
        getWidth: function (el, outer, round) {
            'use strict';
            var width = window.getComputedStyle(el, null).getPropertyValue('width');
            var returnWidth = parseFloat(width);
            //IE Fixes
            if (isNaN(returnWidth) || width.indexOf('%') > 0 || returnWidth < 0) {
                returnWidth = el.offsetWidth - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) - parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            }
            if (outer) returnWidth += parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-left')) + parseFloat(window.getComputedStyle(el, null).getPropertyValue('padding-right'));
            if (round) return Math.ceil(returnWidth);
            else return returnWidth;
        },
        /* 
         * 获取元素偏移量(Left&Top)
         * obj:需要转化的对象
         */
        getOffset: function (el) {
            'use strict';
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop = el.clientTop || body.clientTop || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            if (document.documentElement && !window.pageYOffset) {
                //IE7-8
                scrollTop = document.documentElement.scrollTop;
                scrollLeft = document.documentElement.scrollLeft;
            }
            return {
                top: box.top + scrollTop - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        },
        /*
		 * 生成GUID
		 *
		 */
        getGuidGenerator: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        /* 
         * 根据指定属性值,获取指定对象/集合
         * arr:数组
         * attr:属性名称
         * val:属性值
         * selCondition:查询条件
         */
        GetItemByAttr: function (arr, attr, val, selCondition) {
            var result = [];
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (selCondition) {
                    if (selCondition(item)) {
                        result.push(item);
                    }
                }
                else if (item[attr] + '' == val + '') {
                    result.push(item);
                }
            }

            return result;
        },
        /* 
         * 根据指定属性值,获取指定索引值
         * arr:数组
         * attr:属性名称
         * val:属性值
         */
        GetIndexByAttr: function (arr, attr, val) {
            var index = -1;
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item[attr] + '' == val + '') {
                    index = i;
                    break;
                }
            }
            return index;
        },
		/* 
         * 获取两个素组中不同的元素
         * arrA:依据数组
         * arrB:对比数组
         * key:判断两个对象相同的依据(key对象中指定属性名称)
         */
		 ArrDifferent:function(arrA,arrB,key){
			var cArrA=Fx.Clone(arrA);
			var cArrB=Fx.Clone(arrB);
			
			if(key){
				for(var i=0;i<cArrA.length;i++){
					Fx.DelItemByArr(cArrB,cArrA[i],key);
				}
			}else{
				for(var i=0;i<cArrA.length;i++){
					Fx.DelItemByArr(cArrB,cArrA[i],null,function(arrI,delItem){
						return arrI==delItem;
					});
				}
			}
			
			return cArrB;
		 },
        /* 
         * 删除数组中指定对象
         * arr:数组
         * item:删除对象
         * key:判断两个对象相同的依据(key对象中指定属性名称)
         * delCondition:删除条件(可选)
         */
        DelItemByArr: function (arr, item, key, delCondition) {
            var index = -1;
            for (var i = 0; i < arr.length; i++) {
                var arrI = arr[i];
                if (delCondition) {
                    if (delCondition(arrI, item)) {
                        index = i;
                        break;
                    }
                }
                else if (arrI[key] + '' == item[key] + '') {
                    index = i;
                    break;
                }
            }
            if (index < 0) { return; }
            return arr.splice(index, 1);
        },
        /* 
         * 延迟触发函数
         * func:'触发函数'
         * context:触发上下文(该参数必须是持久对象)
         * delaytime:延迟触发时间(默认延迟500毫秒)
         */
        DelayTrigger: function (func, context, delaytime) {
            delaytime = delaytime || 500;
            if (context.Fx_DelayTimerId) {
                clearTimeout(context.Fx_DelayTimerId);
                context.Fx_DelayTimerId = setTimeout(function () {
                    delete context.Fx_DelayTimerId;
                    func.apply(context, arguments || []);
                }, delaytime);
                return;
            }
            context.Fx_DelayTimerId = setTimeout(function () {
                delete context.Fx_DelayTimerId;
                func.apply(context, arguments || []);
            }, delaytime);
        },
        //根据身份证号计算出生日期/年龄/性别
        CalculBirthday:function(val) {
            var reuslt = {};
            var birthdayValue;
            var myYear = '';
            var myMonth = '';
            var myDay = '';

            if (15 == val.length) { //15位身份证号码 
                birthdayValue = val.charAt(6) + val.charAt(7);
                if (parseInt(birthdayValue) < 10) {
                    myYear = parseInt('20' + birthdayValue);
                }
                else {
                    myYear = parseInt('19' + birthdayValue);
                }

                myMonth = parseInt(val.charAt(8) + val.charAt(9));
                myDay = parseInt(val.charAt(10) + val.charAt(11));

                birthdayValue = myYear + '-' + myMonth + '-' + myDay;
                if (parseInt(val.charAt(14) / 2) * 2 != val.charAt(14))
                    reuslt.sex = '男';
                else
                    reuslt.sex = '女';
                reuslt.birthday = birthdayValue;
            }
            if (18 == val.length) { //18位身份证号码 
                myYear = parseInt(val.charAt(6) + val.charAt(7) + val.charAt(8) + val.charAt(9));
                myMonth = parseInt(val.charAt(10) + val.charAt(11));
                myDay = parseInt(val.charAt(12) + val.charAt(13));

                birthdayValue = myYear + '-' + myMonth + '-' + myDay;
                if (parseInt(val.charAt(16) / 2) * 2 != val.charAt(16))
                    reuslt.sex = '男';
                else
                    reuslt.sex = '女';

                reuslt.birthday = birthdayValue;
            }

            var myDate = new Date();

            var month = myDate.getMonth() + 1;

            var day = myDate.getDate();

            var year = myDate.getFullYear();

            var age = year - myYear - 1;
            if (month > myMonth) {
                age += 1;
            } else if (month == myMonth && day >= myDay) {
                age += 1;
            }
            reuslt.age = age;
            return reuslt;
        },
		/**
		* 获取输入光标在页面中的坐标
		* @param {HTMLElement} 输入框元素
		* @return {Object} 返回left和top,bottom
		*/
		getInputPositon: function (elem) {
			if (document.selection) { //IE Support
				elem.focus();
				var Sel = document.selection.createRange();
				return {
				left: Sel.boundingLeft,
				top: Sel.boundingTop,
				bottom: Sel.boundingTop + Sel.boundingHeight
				};
			} else {
				var that = this;
				var cloneDiv = '{$clone_div}', cloneLeft = '{$cloneLeft}', cloneFocus = '{$cloneFocus}', cloneRight = '{$cloneRight}';
				var none = '<span style="white-space:pre-wrap;"> </span>';
				var div = elem[cloneDiv] || document.createElement('div'), focus = elem[cloneFocus] || document.createElement('span');
				var text = elem[cloneLeft] || document.createElement('span');
				var offset = that._offset(elem), index = this._getFocus(elem), focusOffset = { left: 0, top: 0 };
				if (!elem[cloneDiv]) {
				elem[cloneDiv] = div, elem[cloneFocus] = focus;
				elem[cloneLeft] = text;
				div.appendChild(text);
				div.appendChild(focus);
				document.body.appendChild(div);
				focus.innerHTML = '|';
				focus.style.cssText = 'display:inline-block;width:0px;overflow:hidden;z-index:-100;word-wrap:break-word;word-break:break-all;';
				div.className = this._cloneStyle(elem);
				div.style.cssText = 'visibility:hidden;display:inline-block;position:absolute;z-index:-100;word-wrap:break-word;word-break:break-all;overflow:hidden;';
				};
				div.style.left = this._offset(elem).left + "px";
				div.style.top = this._offset(elem).top + "px";
				var strTmp = elem.value.substring(0, index).replace(/</g, '<').replace(/>/g, '>').replace(/n/g, '<br/>').replace(/s/g, none);
				text.innerHTML = strTmp;
				focus.style.display = 'inline-block';
				try { focusOffset = this._offset(focus); } catch (e) { };
				focus.style.display = 'none';
				return {
				left: focusOffset.left,
				top: focusOffset.top,
				bottom: focusOffset.bottom
				};
			}
		},
		// 克隆元素样式并返回类
		_cloneStyle: function (elem, cache) {
			if (!cache && elem['${cloneName}']) return elem['${cloneName}'];
			var className, name, rstyle = /^(number|string)$/;
			var rname = /^(content|outline|outlineWidth)$/; //Opera: content; IE8:outline && outlineWidth
			var cssText = [], sStyle = elem.style;
			for (name in sStyle) {
			if (!rname.test(name)) {
			val = this._getStyle(elem, name);
			if (val !== '' && rstyle.test(typeof val)) { // Firefox 4
			name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
			cssText.push(name);
			cssText.push(':');
			cssText.push(val);
			cssText.push(';');
			};
			};
			};
			cssText = cssText.join('');
			elem['${cloneName}'] = className = 'clone' + (new Date).getTime();
			this._addHeadStyle('.' + className + '{' + cssText + '}');
			return className;
		},
		// 向页头插入样式
		_addHeadStyle: function (content) {
			var style = this._style[document];
			if (!style) {
			style = this._style[document] = document.createElement('style');
			document.getElementsByTagName('head')[0].appendChild(style);
			};
			style.styleSheet && (style.styleSheet.cssText += content) || style.appendChild(document.createTextNode(content));
			},
			_style: {},
			// 获取最终样式
			_getStyle: 'getComputedStyle' in window ? function (elem, name) {
			return getComputedStyle(elem, null)[name];
			} : function (elem, name) {
			return elem.currentStyle[name];
		},
		// 获取光标在文本框的位置
		_getFocus: function (elem) {
			var index = 0;
			if (document.selection) {// IE Support
			elem.focus();
			var Sel = document.selection.createRange();
			if (elem.nodeName === 'TEXTAREA') {//textarea
			var Sel2 = Sel.duplicate();
			Sel2.moveToElementText(elem);
			var index = -1;
			while (Sel2.inRange(Sel)) {
			Sel2.moveStart('character');
			index++;
			};
			}
			else if (elem.nodeName === 'INPUT') {// input
			Sel.moveStart('character', -elem.value.length);
			index = Sel.text.length;
			}
			}
			else if (elem.selectionStart || elem.selectionStart == '0') { // Firefox support
			index = elem.selectionStart;
			}
			return (index);
		},
		// 获取元素在页面中位置
		_offset: function (elem) {
			var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement;
			var clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0;
			var top = box.top + (self.pageYOffset || docElem.scrollTop) - clientTop, left = box.left + (self.pageXOffset || docElem.scrollLeft) - clientLeft;
			return {
				left: left,
				top: top,
				right: left + box.width,
				bottom: top + box.height
			};
		}
    });

    Fx.apply(Fx, {
        //灰度对象
        Gray: {
            //判断是否是灰度
            blnGray: false,
            //灰度样式后缀名
            CssName: function () {
                return this.blnGray == true ? this.CssPostfix : '';
            },
            //灰度图片后缀名
            ImgName: 'Gray_',
            //样式后缀
            CssPostfix: '_Gray'
        },
        ajax: function (config) {
            $.ajax({
                type: config.type,
                url: config.url,
                data: config.data,
                async:config.async || true,
                dataType: config.dataType || 'text',
                beforeSend: config.beforeSend,
                complete: config.complete,
                success: config.success,
                error:config.error || function (XMLHttpRequest, textStatus, errorThrown) {
                    alert(XMLHttpRequest.status);
                }
            });
        },
        //Post方式提交页面
        //url:提交地址
        //param:提交参数
        PostSubmit: function (url, param) {
            var postUrl = url;//提交地址 
            param = param || {};

            var ExportForm = document.createElement("FORM");
            document.body.appendChild(ExportForm);
            ExportForm.method = "POST";
            for (var key in param) {
                var newElement = document.createElement("input");
                newElement.setAttribute("name", key);
                newElement.setAttribute("type", "hidden");
                newElement.value = param[key];
                ExportForm.appendChild(newElement);
            }

            ExportForm.action = postUrl;
            //ExportForm.target = "_blank";  
            ExportForm.submit();
            document.body.removeChild(ExportForm);

        },
        Skip: {

            //获取XMLHttpRequest对象(提供客户端同http服务器通讯的协议)

            getXmlHttpRequest: function () {
                if (window.XMLHttpRequest) // 除了IE外的其它浏览器
                    return new XMLHttpRequest();
                else if (window.ActiveXObject) // IE 
                    return new ActiveXObject("MsXml2.XmlHttp");

            },
            //导入内容
            includeJsText: function (rootObject, jsText) {
                if (rootObject != null) {
                    var oScript = document.createElement("script");
                    oScript.type = "text/javascript";
                    oScript.text = jsText;
                    rootObject.appendChild(oScript);
                }
            },
            //导入文件
            includeJsSrc: function (rootObject, fileUrl) {
                if (rootObject != null) {
                    var oScript = document.createElement("script");
                    oScript.type = "text/javascript";
                    oScript.src = fileUrl;
                    rootObject.appendChild(oScript);
                }
            },
            //同步加载
            addJs: function (rootObject, url) {

                var oXmlHttp = this.getXmlHttpRequest();

                oXmlHttp.onreadystatechange = function ()  //其实当在第二次调用导入js时,因为在浏览器当中存在这个*.js文件了,它就不在访问服务器,也就不在执行这个方法了,这个方法也只有设置成异步时才用到

                {
                    if (oXmlHttp.readyState == 4) //当执行完成以后(返回了响应)所要执行的

                    {
                        if (oXmlHttp.status == 200 || oXmlHttp.status == 304) //200有读取对应的url文件,404表示不存在这个文件

                        {

                            includeJsSrc(rootObject, url);
                        }

                        else {
                            alert('XML request error: ' + oXmlHttp.statusText + ' (' + oXmlHttp.status + ')');

                        }

                    }

                };

                //1.True 表示脚本会在 send() 方法之后继续执行，而不等待来自服务器的响应,并且在open()方法当中有调用到onreadystatechange()这个方法。通过把该参数设置为 "false"，可以省去额外的 onreadystatechange 代码,它表示服务器返回响应后才执行send()后面的方法.
                //2.同步执行oXmlHttp.send()方法后oXmlHttp.responseText有返回对应的内容,而异步还是为空,只有在oXmlHttp.readyState == 4时才有内容,反正同步的在oXmlHttp.send()后的操作就相当于oXmlHttp.readyState == 4下的操作,它相当于只有了这一种状态.
                oXmlHttp.open('GET', url, false);
                //url为js文件时,ie会自动生成 '<script src="*.js" type="text/javascript"><\/script>',ff不会  
                oXmlHttp.send(null);
                includeJsText(rootObject, oXmlHttp.responseText);
            }
        }
    });

    /*定义触摸屏事件*/
    Fx.apply(Fx, {
        //触屏事件
        TouchEven: {
            TouchClick: 'touchclick',
            Touchstart: 'touchstart',
            Touchmover: 'touchmove',
            Touchend: 'touchend',
            Gesturestart: 'gesturestart', //当有两根或多根手指放到屏幕上的时候触发 
            Gesturechange: 'gesturechange',// 当有两根或多根手指在屏幕上，并且有手指移动的时候触发 
            Gestureend:'gestureend'// 当倒数第二根手指提起的时候触发，结束gesture 
        },
        //事件映射
        EvenMap:(function() {
            var desktopEvents = ['mousedown', 'mousemove,mouseleave', 'mouseup'];
            if (Fx.browser.ie10) desktopEvents = ['MSPointerDown', 'MSPointerMove,MSPointerLeave', 'MSPointerUp'];
            if (Fx.browser.ie11) desktopEvents = ['pointerdown', 'pointermove,pointerleave', 'pointerup'];

            return {
                'touchstart': Fx.support.touch ? 'touchstart' : desktopEvents[0],
                'touchmove': Fx.support.touch ? 'touchmove' : desktopEvents[1],
                'touchend': Fx.support.touch ? 'touchend' : desktopEvents[2],
                'blur': 'blur',
                'gesturestart': 'gesturestart',
                'gesturechange': 'gesturechange',
                'gestureend': 'gestureend'
            };
        }()),
        //注册事件
        //EvenName:事件名字
        //dom:注册事件对象(可能为数组)
        //func:事件触发后调用方法
        RegisterEven: function (EvenName, dom, func) {
            var BlnJQuery = false;//判断对象是否Jquery对象
            var self = this;
            if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
            //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
            if (dom.selector != undefined) { BlnJQuery = true; }
            //JQuery对象
            if (BlnJQuery) {
                //判断是否是数组对象
                if (dom.length) {
                    //数组对象
                    dom.each(function () {
                        //单个对象
                        for (var i = 0; i < self.EvenMap[EvenName].split(',').length; i++) {
                            if (this.addEventListener) {
                                this.addEventListener(self.EvenMap[EvenName].split(',')[i], func, false);
                            } else {
                                this.attachEvent('on' + self.EvenMap[EvenName].split(',')[i], func);
                            }
                        }
                    });
                } else {
                    //单个对象
                    for (var i = 0; i < self.EvenMap[EvenName].split(',').length; i++) {
                        if (dom.addEventListener) {
                            dom.addEventListener(self.EvenMap[EvenName].split(',')[i], func, false);
                        } else {
                            dom.attachEvent('on' + self.EvenMap[EvenName].split(',')[i], func);
                        }
                    }
                }
            }
            //Js对象
            else
            {
                if (dom instanceof Array) {
                    //数组对象
                    for (var i = 0; i < dom.length; i++) {
                        var item = dom[i];

                        for (var j = 0; j < this.EvenMap[EvenName].split(',').length; j++) {
                            if (item.addEventListener) {
                                item.addEventListener(this.EvenMap[EvenName].split(',')[j], func, false);
                            } else {
                                item.attachEvent('on' + this.EvenMap[EvenName].split(',')[j], func);
                            }
                        }
                    }
                } else {
                    //单个对象
                    for (var i = 0; i < this.EvenMap[EvenName].split(',').length; i++) {
                        if (dom.addEventListener) {
                            dom.addEventListener(this.EvenMap[EvenName].split(',')[i], func, false);
                        } else {
                            dom.attachEvent('on' + this.EvenMap[EvenName].split(',')[i], func);
                        }
                    }
                }
            }
        },
        //触发元素指定事件
        //dom:触发事件的元素
        //evenName:触发事件名
        //params:触发事件时额外的参数
        Trigger: function (dom, evenName,params) {
            //如果是触发的屏幕单击事件(则需要特别处理)
            if (evenName == this.TouchEven.TouchClick) {
                this.Trigger(dom, Fx.EvenMap[this.TouchEven.Touchstart], params);
                this.Trigger(dom, Fx.EvenMap[this.TouchEven.Touchend], params);
                return;
            }

            var self = this;
            var BlnJQuery = false; //判断对象是否Jquery对象
            if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
            //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
            if (dom.selector != undefined) { BlnJQuery = true; }

            var BlnSupport = true;//是否支持该事件
            //浏览器功能监听对象
            if (Modernizr) { BlnSupport = Modernizr.hasEvent(evenName); }

            //创建事件对象
            var invokeInfo = { FuncName: '', Param: '',Event:null }; //调用信息
            if (document.createEvent) {
                var evt = document.createEvent("Events");
                evt.params = params || {};
                evt.initEvent(evenName, true, true);
                invokeInfo.FuncName = 'dispatchEvent';
                invokeInfo.Param = evt;

            } else {
                var event = document.createEventObject();
                event.params = params || {};
                invokeInfo.Event = event;
                invokeInfo.FuncName = 'fireEvent';
                invokeInfo.Param = BlnSupport == true ? evenName : 'on' + evenName;
            }
            if (BlnJQuery) {
                //JQuery对象
                //判断是否是数组对象
                if (dom.length) {
                    //数组对象
                    dom.each(function () {
                        if (invokeInfo.Event != null) {
                            this[invokeInfo.FuncName](invokeInfo.Param, invokeInfo.Event);
                        } else {
                            this[invokeInfo.FuncName](invokeInfo.Param);
                        }
                    });
                } else {                
                    //单个对象
                    if (invokeInfo.Event != null) {
                        dom[0][invokeInfo.FuncName](invokeInfo.Param, invokeInfo.Event);
                    } else {
                        dom[0][invokeInfo.FuncName](invokeInfo.Param);
                    }
                }
            } else {
                //Js对象
                //判断是否是数组对象
                if (dom instanceof Array) {
                    //数组对象
                    for (var i = 0; i < dom.length; i++) {
                        var item = dom[0];
                        if (invokeInfo.Event != null) {
                            item[invokeInfo.FuncName](invokeInfo.Param, invokeInfo.Event);
                        } else {
                            item[invokeInfo.FuncName](invokeInfo.Param);
                        }
                    }
                } else {
                    //单个对象
                    if (invokeInfo.Event != null) {
                        dom[invokeInfo.FuncName](invokeInfo.Param, invokeInfo.Event);
                    } else {
                        dom[invokeInfo.FuncName](invokeInfo.Param);
                    }
                }
            }
        },
        //触摸屏单击事件
        //dom:注册事件对象(可能为数组)
        //func:事件触发后调用方法
        TouchClick: function (dom, func) {
            var startFunc = function (event) {
                this.blnDown = false;
                this.cancelClick = false;

                $(this).css({
                    'transform': 'opacity(0.8)',
                    '-moz-transform': 'opacity(0.8)',
                    '-webkit-transform': 'opacity(0.8)',
                    '-o-transform': 'opacity(0.8)',
                    '-ms-transform': 'opacity(0.8)'
                });
                this.blnDown = true;

                this.currPageX = Fx.GetCoordinate(Fx.TouchEven.Touchstart, event).X;
                this.currPageY = Fx.GetCoordinate(Fx.TouchEven.Touchstart, event).Y;

                //func.apply(this, (arguments || []));
            };
            var endFunc = function () {
                $(this).css({
                    'transform': 'opacity(1)',
                    '-moz-transform': 'opacity(1)',
                    '-webkit-transform': 'opacity(1)',
                    '-o-transform': 'opacity(1)',
                    '-ms-transform': 'opacity(1)'
                });

                if (this.cancelClick == false) {
                    this.blnDown = false;
                    //把调用本函数的上下文用来调用外部的函数
					var BlnJQuery = false;//判断对象是否Jquery对象
					var self = this;
					if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
					//当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
					if (dom.selector != undefined) { BlnJQuery = true; }
					if(BlnJQuery){dom=dom[0];}
                    func.apply(dom, (arguments || []));
                }
            };

            var moveFunc = function (event) {
                if (this.blnDown == false) { return; }
                var x = Fx.GetCoordinate(Fx.TouchEven.Touchmover, event).X;
                var y = Fx.GetCoordinate(Fx.TouchEven.Touchmover, event).Y;
                var blnMove = (this.currPageX - x) * (this.currPageX - x) + (this.currPageY - y) * (this.currPageY - y) >= 25;

                //判断源生PC端Js事件
                if (event.type) {
                    switch (event.type) {
                        case 'mousemove': //鼠标移动事件

                            break;
                        case 'mouseleave': //鼠标离开事件
                            $(this).css({
                                'transform': 'scale(1)',
                                '-moz-transform': 'scale(1)',
                                '-webkit-transform': 'scale(1)',
                                '-o-transform': 'scale(1)',
                                '-ms-transform': 'scale(1)'
                            });
                            break;
                    }
                }

                if (blnMove == true) {
                    this.cancelClick = true;
                    $(this).css({
                        'transform': 'scale(1)',
                        '-moz-transform': 'scale(1)',
                        '-webkit-transform': 'scale(1)',
                        '-o-transform': 'scale(1)',
                        '-ms-transform': 'scale(1)'
                    });
                }
            };

            this.Touchstart(dom, startFunc);
            this.Touchend(dom, endFunc);
            this.Touchmove(dom, moveFunc);
        },
        //手指按下事件
        //dom:注册事件对象(可能为数组)
        //func:事件触发后调用方法
        Touchstart: function (dom, func) {
            this.RegisterEven('touchstart', dom, func);
        },

        Touchend: function (dom, func) {
            this.RegisterEven('touchend', dom, func);
        },

        Touchmove: function (dom, func) {
            this.RegisterEven('touchmove', dom, func);
        },
        //当有两根或多根手指放到屏幕上的时候响应事件
        Gesturestart:function(dom,func){
            this.RegisterEven('gesturestart', dom, func);
        },
        // 当有两根或多根手指在屏幕上，并且有手指移动的时候响应事件
        Gesturechange:function(dom,func){
            this.RegisterEven('gesturechange', dom, func);
        }, 
        // 当倒数第二根手指提起的时响应事件
        Gestureend:function(dom,func){
            this.RegisterEven('gestureend', dom, func);
        },
        //获取当前触发点X/Y坐标值
        //eventName:触屏事件名字
        //event:触发事件对象
        GetCoordinate: function (eventName, event) {
            var BlnSupport = true;//是否支持触屏事件
            //浏览器功能监听对象
            if (Modernizr) { BlnSupport = Modernizr.hasEvent(eventName); }
            if (BlnSupport) {
                //支持触屏事件
                return { X: event.touches[0].pageX || 0, Y: event.touches[0].pageY || 0 };
            } else {
                //不支持触屏事件(Js源生事件)
                return { X: event.clientX || 0, Y: event.clientY || 0 };
            }
        },
        //单例绑定事件
        //eventStr:事件字符串
        //dom:绑定事件源元素
        //func:事件处理函数
        SingleBind: function (eventStr, dom, func) {
            var queue = 'Fx_' + eventStr;//加入前缀避免与其他JS库命名冲突
            var BlnJQuery = false; //判断对象是否Jquery对象
            if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
            //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
            if (dom.selector != undefined) { BlnJQuery = true; }
            //如果是Jquery对象需要转化为JS对象
            if (BlnJQuery) { dom = dom[0]; }
            //生成事件唯一标识
            var id = queue + Fx.getGuidGenerator(); //唯一标示符
            //判断是否已经注册了该事件
            if (!dom) { return; }
            if (dom[queue]) {
                //已经注册
                dom[queue][id] = func;//添加事件处理函数到队列中
            } else {
                //未注册
                dom[queue] = new Object();//初始事件队列对象
                dom[queue][id] = func;//添加事件处理函数到队列中
                //绑定事件
                $(dom).bind(eventStr, function () {
                    var handler = this[queue];//事件处理集
                    for (var key in handler) {
                        handler[key].call(dom, []);
                    }
                });
            }
            //返回唯一标识(用于删除事件处理函数)
            return id;
        },
        //清除绑定事件
        //eventStr:事件字符串
        //dom:绑定事件元素
        //id:绑定事件唯一标识事件
        ClearBind: function (eventStr, dom, id) {
            if (!dom) { return;}
            var queue = 'Fx_' + eventStr;//加入前缀避免与其他JS库命名冲突
            var BlnJQuery = false; //判断对象是否Jquery对象
            if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
            //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
            if (dom.selector != undefined) { BlnJQuery = true; }
            //如果是Jquery对象需要转化为JS对象
            if (BlnJQuery) { dom = dom[0]; }

            if (dom[queue][id]) {
				delete dom[queue][id];
            }
        },
		//动态处理加载页面中包含的script/link文件
		//url:页面路径
		//callback:预处理完成后回调函数(返回处理后页面html)
		PreProcessPage:function(url,callback){
			Fx.ajax({
					type:'get',
					url:url,
					async:true,
					dataType:'html',
					success:function(result){
						var scripts= Fx.Regex.Match(result,Fx.Regex.Regular.Script);
						var links=Fx.Regex.Match(result,Fx.Regex.Regular.Link);
						var loadUrls=[];
						for(var i=0;i<scripts.length;i++){
							var src= Fx.Regex.Match(scripts[i], Fx.Regex.Regular.Src);
							if(src==""){continue;}
							var nLoad= Fx.Regex.Match(scripts[i], Fx.Regex.Regular.nLoad);
							if(nLoad[1]=='true'){continue;}
							
							loadUrls.push(src[1]);
						}
						for(var j=0;j<links.length;j++){
							var href=Fx.Regex.Match(links[j], Fx.Regex.Regular.Href);
							if(href==""){continue;}
							loadUrls.push(href[1]);
						}
						result=result.replace(Fx.Regex.Regular.Script,function(m,i){
							var nLoad= Fx.Regex.Match(m, Fx.Regex.Regular.nLoad);
					
							if(nLoad[1]=='true'){
								return m.replace(Fx.Regex.Regular.nLoad,'');
							}
							return '';
						});
						
						//result=result.replace(Fx.Regex.Regular.Script,'');
						result=result.replace(Fx.Regex.Regular.Link,'');
						var loadCount=0;

						if(loadUrls.length==0){
							if(loadCount>0){return;}
							loadCount++;
							callback(result);
						}

						Fx.loadMulFile(loadUrls,function(a){
							if(loadCount>0){return;}
							loadCount++;
							callback(result);
						});
					}
			});
		},
		//angularJs加载页面
		//html:加载的Html
		//container:追加到的容器对象
		//blnRemove:是否删除页面(true:删除;false:清空元素子元素)
		//param:传递参数
		AngularJsLoadPage:function(html,container,tipWindow,blnRemove,param,delFunc,oriScope){
			try{
				var scope;
				blnRemove=blnRemove || false;
				angular.element(document.body).injector().invoke(function ($compile,$rootScope) {  
					scope=oriScope || angular.element(document.body).scope().$new();
					scope.param=param||{};
					scope.hide=function(){
						tipWindow.hide();
					};
					scope.show=function(){
						tipWindow.show();
					};
					scope.RemoveSelf=function(flag){
						  $rootScope.$broadcast('PageRemove',tipWindow);
						  if(blnRemove){
							tipWindow.remove();
						  }else{
							tipWindow.html('');
						  }
						  scope.$destroy();
						  scope = null;
						  if(delFunc){
								delFunc(flag);
						  }
					};					
					container.append($compile($(html))(scope)); 			
					if(!oriScope)scope.$apply();  
				});
				return scope;
			}catch(e){
				container.append(html);  
			}
		}
    });
    /*定义弹窗函数*/
    Fx.alert = Fx.alert || {};
    Fx.apply(Fx.alert, {
        //停靠方向
        Direction: {
            LeftTop: 4,
            Left: 0,
            Top: 1,
            Right: 2,
            Bottom: 3
        },
        //在触发元素下方显示(自动定位触发元素位置)
        AutoPostionEl: function (el, config) {
            var self = this;
            var _config = {
                Width: '100px',
                Height: 'auto',
                LoadFunc: function () {
                }
            };
            Fx.apply(_config, config);
            var prixId = 'Fx_AutoPos';
            var id = Fx.getGuidGenerator(); //唯一标示符
            var window = self.AutoPosElWindow;//窗体
            //计算元素位置
            el = el.length ? el[0] : el;//转化Jquery对象为JS对象

            var offset = Fx.getOffset(el);
            var height = Fx.getHeight(el, true)-1;

            window = Fx.format(window,
									  Fx.format('{0}{1}', prixId, id),
									  Fx.format('width:{0}px;height:{1};left:{2}px;top:{3}px;position: absolute;z-index:10000;', Fx.ConvertPxToInt(_config.Width), _config.Height, offset.left, offset.top + height)//窗体样,
									 );
            //添加窗体
            $('body').append(window);
            var winObj = $(Fx.format('#{0}{1}', prixId, id));

            _config.LoadFunc(winObj);

            return winObj;

        },
        confirm: function (config) {
            //配置参数
            var _config = {
                //回调函数寄存器
                CallBackRegister: {},
                Caption: '', //标题栏
                Content: '',//内容
				style:{},	//自定义样式
                //按钮
                btns: [
                    { name: '确定', callBack: function () { alert('回调'); return true;} }
                ],
				LoadComplete:function(contentEl){} //加载完成事件
            };
            Fx.apply(_config, config || {});


            var InvokElement = this; //调用函数的元素
            var self = Fx.alert; //函数本身上下文

            var timerId = 0;
            //var callBack = function () {
            //    Fx.Trigger(InvokElement, Fx.TouchEven.Touchend);
            //    clearTimeout(timerId);
            //};

            var id = Fx.getGuidGenerator(); //唯一标示符
            //构造按钮
            var btnHtml = '';
            for (var i = 0; i < _config.btns.length; i++) {
                var item = _config.btns[i];

                //设置寄存器
                var IndetityFunc = Fx.getGuidGenerator(); //用于唯一标识按钮回电的寄存器
                _config.CallBackRegister[IndetityFunc] = item.callBack;
                item._CallBackId = IndetityFunc;
                delete item.callBack;
                btnHtml += Fx.format(self.BtnItem,
                        item.name, //按钮名称
                        Fx.objcetToString(item) //按钮相关数据
                       );

            }

            var Container = Fx.format(self.Mask,
                    Fx.format(self.Window,
                        _config.Caption,//标题
                        _config.Content,//内容
                        btnHtml //操作按钮
                    ), //窗体
                    id
	            );

            //timerId = setTimeout(callBack, 100);
            $('body').append(Container);
			 //注册按键事件
            var MaskWindow = $(Fx.format('#Fx_Alert_Mask_Container{0}', id));//窗体遮罩
			var MaskContainer=MaskWindow.find('div[class="Fx_Alert_Window_Container"]'); //窗体遮罩容器
		    MaskWindow.css('font-size', '1.0em');
			if(_config.style){
				MaskContainer.css(_config.style);
			}
			
			//绑定拖动事件
			if(Fx.cls.DragComp){
				var drag=new Fx.cls.DragComp();
				drag.Init(MaskContainer.find('div[class="Alert_Caption"]'),MaskContainer);
			}
			
            //调整弹窗的位置
            self.AdjustSize($(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_Mask"]', id)), $(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_Window_Container"]', id)));
       
            var popWindow = $(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_Window_Container"]', id));//窗体对象
            var btns = popWindow.find('span[class="BtnItem"]'); //操作按钮
            Fx.TouchClick(btns, function () {
                var data = eval('(' + $(this).attr('data') + ')');
                var func = _config.CallBackRegister[data._CallBackId];
                var blnClose = true;
                if (func) {
                    blnClose = func(this);
                }
                if (blnClose == false) { return; }
                //删除控件
                MaskWindow.remove();
            });
			
			_config.LoadComplete(MaskWindow.find('div[class="Alert_Content"]'));
        },
        //冒泡提示框
        //Title:提示信息
        //el:定位元素(提示框显示在该元素下方)
        //imageUrl:提示图片信息(改属性设置值后,title属性无效)
        //blnCancel:是否自动删除该对象
        //delayTime:删除延迟时间(单位毫秒)
        //arrowDirection:top/bottom
        //position:停靠位置(left,center,right)
        BubbleTip: function (title, el,imageUrl ,arrowDirection, blnCancel, delayTime,position) {
            var idPrefix = 'Fx_Alert_BubbleTip';
            var self = Fx.alert; //函数本身上下文
            var id = Fx.getGuidGenerator(); //唯一标示符

            blnCancel = blnCancel == undefined ? true : blnCancel;

            delayTime = delayTime || 5000;
            arrowDirection = arrowDirection || 'top';
            position = position || 'left';

            //计算元素位置
            el = el.length ? el[0] : el;//转化Jquery对象为JS对象

            var offset = Fx.getOffset(el);

            var height = Fx.getHeight(el, true);
            var width = Fx.getWidth(el,true);

            var imgContainer = '<img id="{0}" src="{1}" style="position:absolute;{2};width:80px;z-index:100;" />';

            var Container = null;
            if (!!imageUrl) {
                Container = Fx.format(imgContainer,
                    idPrefix + id,
                    imageUrl,
                    Fx.format('left:{0}px;top:{1}px', offset.left, '0')
                    );
            } else {
                Container = Fx.format(self.Bubble,
                    idPrefix + id,
                    title,
                    arrowDirection,
                    Fx.format('left:{0}px;top:{1}px', offset.left, '0')
                );
            }


            //添加对象
            $('body').append(Container);

            var eventIdentity = '';//绑定事件唯一标识
            var bindObject=null;//绑定事件对象
            var ctrObj = $(Fx.format('#{0}{1}', idPrefix, id));
        
            var timerId = setTimeout(function () {
                var curPostion = arrowDirection == 'top' ? (offset.top + height) : offset.top - Fx.getHeight(ctrObj[0], true);

                ctrObj.PosTop = curPostion;

                //设置左边位置
                var posLeft = 0;
                if (position == 'left') {
                    posLeft = offset.left;
                } else if (position == 'right') {
                    posLeft = offset.left + width - Fx.getWidth(ctrObj[0], true);
                }
                ctrObj.css('left', posLeft + 'px');
                Fx.Effect.Plummet(ctrObj, (curPostion) + 'px');
                clearTimeout(timerId);
            }, 500);

            if (blnCancel) {
                var timerId2 = setTimeout(function () {
                    ctrObj.remove();
                    if (bindObject != null) {
                        Fx.ClearBind('scroll', bindObject, eventIdentity);
                    }
                    clearTimeout(timerId2);
                }, delayTime);
            }

            var topScoll = new Object();

            //查找顶级Div对象
            function FindTopDiv(root, outObj) {
                var children = $(root).children('div[class!="Fx_Bubble_Container"]');
                var objCol = [];
                $.each(children, function () {
                    var scrollHeight = this.scrollHeight;//滚动条总高度
                    var clientHeight = this.clientHeight;//页面可视区域高度

                    objCol.push(this);
                    if (scrollHeight > clientHeight) {
                        outObj.IsExist = true;
                        outObj.Content = this;
                        return;
                    }
                });
                for (var i = 0; i < objCol.length; i++) {
                    if (outObj.IsExist) {
                        break;
                    }
                    FindTopDiv(objCol[i], outObj);
                }
            }

            var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//滚动条总高度
            var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;//页面可视区域高度
            if (scrollHeight > clientHeight) {
                //注册滚动条事件
                bindObject = window;
                eventIdentity= Fx.SingleBind('scroll', window, function () {
                    var scrollTop = $(this).scrollTop();
                    ctrObj.css('top', (ctrObj.PosTop - scrollTop) + 'px');
                });
            } else {
                //其他div对象只查找顶级div对象
                FindTopDiv('body', topScoll);
                bindObject = topScoll.Content;
                if (!!topScoll.Content) {
                    eventIdentity = Fx.SingleBind('scroll', $(topScoll.Content), function () {
                        var scrollTop = $(this).scrollTop();
                        ctrObj.css('top', (ctrObj.PosTop - scrollTop) + 'px');
                    });
                }
            }

            return ctrObj;
        },
        //停靠框
        Dock: function (config) {
            var _config = {
                //回调函数寄存器
                CallBackRegister: {},
                //停靠方向
                Direction: Fx.alert.Direction.LeftTop,
                Caption: '标题',//窗体标题
                Content: '',//窗体内容
                Width: '200px',//窗体宽度
                Height: '300px',//窗体高度
                BorderSzie: '3px',//边框宽度
                LoadFunc: function () { },//窗体加载后自动执行的函数
                //按钮
                btns: [
                    { name: '确定', callBack: function () { alert('回调') } }
                ]
            };

            Fx.apply(_config, config || {});
            var self = Fx.alert; //函数本身上下文
            var id = Fx.getGuidGenerator(); //唯一标示符

            //构造按钮
            var btnHtml = '';
            var btnArr = new Array();
            for (var i = 0; i < _config.btns.length; i++) {
                var item = _config.btns[i];

                //设置寄存器
                var IndetityFunc = Fx.getGuidGenerator(); //用于唯一标识按钮回电的寄存器
                _config.CallBackRegister[IndetityFunc] = item.callBack;
                item.FXID = IndetityFunc;

                item._CallBackId = IndetityFunc;
                delete item.callBack;
                btnArr.push(Fx.format(self.BtnItem,
                        item.name, //按钮名称
                        Fx.objcetToString(item) //按钮相关数据
                       ));
            }
            btnHtml = btnArr.join('<div class="BtnSpace"></div>');//添加按钮间的间隙


            //计算窗体高度/窗体边框样式/窗体样式/窗体动画
            var borderWidth = Fx.ConvertPxToInt(_config.BorderSzie);
            var windowHeight = 0;
            var windowAnimateShow = {};//窗体显示动画
            var windowAnimateClose = {};//窗体关闭动画
            var windowCss = 'min-width:{0}px;' +
								  'min-height:{1}px;' +
								  'left:{2}px;' +
								  'top:{3}px' +
								  'right{4}px' +
								  'bottom{5}px';
            var windowBorderCss = 'border-top-width:{0}px;' +
										  'border-right-width{1}px;' +
										  'border-bottom-width{2}px;' +
										  'border-left-width:{3}px;' +
										  'min-height:{4}px;' +
										  'border-top-left-radius:{5}px;' +
										  'border-top-right-radius:{6}px;' +
										  'border-bottom-left-radius:{7}px;' +
										  'border-bottom-right-radius:{8}px;';
            switch (_config.Direction) {
                case self.Direction.LeftTop: //左上方
                    windowHeight = Fx.ConvertPxToInt(_config.Height) - 2 * borderWidth;
                    windowAnimateShow = { left: '0px' };
                    windowAnimateClose = { left: '-' + Fx.ConvertPxToInt(_config.Width) + 'px' };
                    windowCss = Fx.format(windowCss, Fx.ConvertPxToInt(_config.Width), 0, '-' + Fx.ConvertPxToInt(_config.Width), 0, 'none', 'none');
                    windowBorderCss = Fx.format(windowBorderCss, borderWidth, borderWidth, borderWidth, 0, 0, 0, 5, 0, 5);
                    break;
            }

            var Container = Fx.format(self.Mask,
											  Fx.format(self.DockWindow,
															windowCss,
															windowBorderCss,
														    _config.Caption,//窗体标题
															_config.Content,//窗体内容
															btnHtml//操作按钮
														   ),
											  id);

            $('body').append(Container);
            //调整弹窗的位置
            self.AdjustSize($(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_Mask"]', id)));
            //注册按键事件
            var MaskWindow = $(Fx.format('#Fx_Alert_Mask_Container{0}', id));//窗体遮罩
            var popWindow = $(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Dock_Window_Container"]', id));//窗体对象
            var btns = popWindow.find('span[class="BtnItem"]'); //操作按钮
            Fx.TouchClick(btns, function () {
                var data = eval('(' + $(this).attr('data') + ')');
                var func = _config.CallBackRegister[data._CallBackId];
                //检查按钮是否可用
                var btnEnabled = true;
                var disanbledBtn = null;
                for (var i = 0; i < _config.btns.length; i++) {
                    if (_config.btns[i].FXID == data._CallBackId && _config.btns[i].disabled == true) {
                        disanbledBtn = _config.btns[i];
                        btnEnabled = false;
                        break;
                    }
                }
                if (btnEnabled == false) {
                    Fx.alert.Tip(disanbledBtn.errTitle, disanbledBtn.errInfo);
                    return false;
                }


                var blnClose = true;
                if (func) {
                    blnClose = func(this);
                }
                if (blnClose == false) { return; }
                //执行关闭动画
                popWindow.animate(windowAnimateClose, 'fast', '', function () {
                    //删除控件
                    MaskWindow.remove();
                });

            });

            _config.LoadFunc.call($(Fx.format('#Fx_Alert_Mask_Container{0}',id)),_config.btns);
            //执行弹出动画
            popWindow.animate(windowAnimateShow, 'fast');

        },
        //提示框
        //title:标题
        //contents:内容
        //cancelTime:消失时间
        //func:删除后执行的函数
        //delFunc:删除回调事件
        //blnAutoCancel:是否自动删除提示框
		//style:弹出框样式
        Tip: function (title, content, cancelTime, func,delFunc,blnAutoCancel,style) {
			var config={};
			if(arguments.length==1){
				//配置对象
				Fx.apply(config,arguments[0]);
			}else{
				config={
					title:title,
					content:content,
					cancelTime:cancelTime,
					func:func,
					delFunc:delFunc,
					blnAutoCancel:blnAutoCancel,
					style:style
				};
			}
			
            var self = this;
            cancelTime = config.cancelTime || 2000; //默认1秒
            blnAutoCancel = config.blnAutoCancel!=false && true;
          
            var id = Fx.getGuidGenerator();//唯一标识符
            var Container = Fx.format(self.TipWindowA,
                            id,//唯一标示符
                            config.title,//标题
                            config.content,//内容
                            blnAutoCancel?'display:none':'display:block' //设置删除按钮
                            );
            $('body').append(Container);
			
			var tipWindow = $(Fx.format('#TipWindow_{0}', id));
			tipWindow.css('font-size', '1.2em');
			if(config.style){
				tipWindow.css(config.style);
			}

            //调整弹窗的位置
            self.AdjustSize(null, $(Fx.format('div[id="TipWindow_{0}"]', id)));

            //注册降落特效
            Fx.Effect.Plummet(tipWindow, '40%');

            if (blnAutoCancel) {
                //定时删除提示框
                var timerId = setTimeout(function () {
                    tipWindow.remove();
                    clearTimeout(timerId);
                    if (config.func) {
                        config.func();
                    }
                }, cancelTime);
            } else {
                //注册删除单击事件
                $(Fx.format('div[id="TipWindow_{0}"]', id)).find('div[name="Alert_OptionBar"] > div[name="Del_Btn"]').click(function () {
                    if (config.delFunc) {
                        config.delFunc($(Fx.format('div[id="TipWindow_{0}"]', id)));
                    }
                    $(Fx.format('div[id="TipWindow_{0}"]', id)).remove();
                });
            }

            return $(Fx.format('div[id="TipWindow_{0}"]', id));
        },
        TipNoCaption: function (content, cancelTime, func, delFunc, blnAutoCancel,style) {
            var self = this;
			var config={};
			if(arguments.length==1){
				//配置对象
				Fx.apply(config,arguments[0]);
			}else{
				config={
					content:content,
					cancelTime:cancelTime,
					func:func,
					delFunc:delFunc,
					blnAutoCancel:blnAutoCancel,
					style:style
				};
			}
			
            cancelTime = configconfig.cancelTime || 2000; //默认1秒
            blnAutoCancel = config.blnAutoCancel != false && true;

            var id = Fx.getGuidGenerator();//唯一标识符
            var Container = Fx.format(self.TipWindow,
                            id,//唯一标示符
                            config.content,//内容
                            '确定',//按键名称
                            blnAutoCancel ? 'display:none' : 'display:block' //设置删除按钮
                            );
            $('body').append(Container);
            //调整弹窗的位置
            self.AdjustSize(null, $(Fx.format('div[id="TipWindow_{0}"]', id)));
            var tipWindow = $(Fx.format('#TipWindow_{0}', id));
            tipWindow.css('font-size', '1.5em');
			if(config.style){
				tipWindow.css(config.style);
			}

            //注册降落特效
            Fx.Effect.Plummet(tipWindow, '40%');

            if (blnAutoCancel) {
                //定时删除提示框
                var timerId = setTimeout(function () {
                    tipWindow.remove();
                    clearTimeout(timerId);
                    if (config.func) {
                        config.func();
                    }
                }, cancelTime);

            } 
            //注册删除单击事件
            $(Fx.format('div[id="TipWindow_{0}"]', id)).find('div[name="Del_Btn"]').click(function () {
                if (config.delFunc) {
                    config.delFunc($(Fx.format('div[id="TipWindow_{0}"]', id)));
                }
                $(Fx.format('div[id="TipWindow_{0}"]', id)).remove();
            });

            return $(Fx.format('div[id="TipWindow_{0}"]', id));
        },
		//动态加载页面窗体
		LoadPageTip: function (config) {
            var self = this;
			var iConfig={
				title:'',
				content:'',
				url:'', //模板地址
				cancelTime:2000,
				func:function(){},
				delFunc:function(){},
				blnAutoCancel:true,
				style:{},
				headerStyle:{},
				appendFunc:function(){},
				blnAngularPage:false,//判断是否angularJs页面(是的话需要特殊处理页面才能识别指令)
				callback:function(){} //添加后回调
			};
			Fx.apply(iConfig,config);
		    var id = Fx.getGuidGenerator();//唯一标识符
			//内部加载页面
			var LoadPage=function(){				
			   var cancelTime =iConfig.cancelTime; //默认1秒
			   var blnAutoCancel = iConfig.blnAutoCancel;
			   var Container=Fx.format(self.Mask,Fx.format(
							self.LoadPageWindow,
								id,//唯一标示符
								iConfig.title,//标题
								iConfig.blnAngularPage?'':iConfig.content,//内容
								blnAutoCancel ? 'display:none' : 'display:block' //设置删除按钮
								),id);
				$('body').append(Container);
				
				var tipWindow = $(Fx.format('#TipWindow_{0}', id));
				var tipHeader=tipWindow.find('div[name="TitleBar"]');
				tipWindow.css('font-size', '1.0em');
				if(iConfig.style){
					tipWindow.css(iConfig.style);
				}
				if(iConfig.headerStyle){
					tipHeader.css(iConfig.headerStyle);
				}
				//angularJs页面特别处理
				var angularPage;
				if(iConfig.blnAngularPage){
					//angularJs加载页面
					angularPage=Fx.AngularJsLoadPage(iConfig.content,tipWindow.find('div[name="Content"]'),$(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id)),true,iConfig.param);
				}
				
				
				//调整弹窗的位置
				self.AdjustSize(null, $(Fx.format('div[id="TipWindow_{0}"]', id)));
				var windowHeight=Fx.ConvertPxToInt($('body').css('height'));
				var tipHeight=Fx.ConvertPxToInt(tipWindow.css('height'));
				
				iConfig.callback(tipWindow.find('div[name="Content"]'),$(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id)));
				
				//注册降落特效
				Fx.Effect.Plummet(tipWindow, '20%');
				//绑定拖动事件
				if(Fx.cls.DragComp){
					var drag=new Fx.cls.DragComp();
					drag.Init(tipWindow.find('div[name="TitleBar"]'),$(Fx.format('div[id="TipWindow_{0}"]', id)));
				}
				
				//窗体加载完成触发事件
				if(iConfig.appendFunc){
					iConfig.appendFunc(tipWindow.find('div[name="Content"]'),tipWindow,$(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id)));
				}

				if (blnAutoCancel) {
					//定时删除提示框
					var timerId = setTimeout(function () {
						if(angularPage){
							angularPage.RemoveSelf();
						}else{
							$(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id)).remove();
						}
						clearTimeout(timerId);
						if (iConfig.func) {
							iConfig.func();
						}
					}, cancelTime);

				} 
				//注册删除单击事件
				$(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id)).find('div[name="Del_Btn"]').click(function () {
					if (iConfig.delFunc) {
						iConfig.delFunc($(Fx.format('div[id="TipWindow_{0}"]', id)));
					}
					
					if(angularPage){
						angularPage.RemoveSelf();
					}else{
						$(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id)).remove();
					}
				});
				
			};
			
			
			if(iConfig.url){
				Fx.ajax({
					type:'get',
					url:iConfig.url,
					async:true,
					success:function(result){
						var scripts= Fx.Regex.Match(result,Fx.Regex.Regular.Script);
						var links=Fx.Regex.Match(result,Fx.Regex.Regular.Link);
						var loadUrls=[];
						for(var i=0;i<scripts.length;i++){
							var src= Fx.Regex.Match(scripts[i], Fx.Regex.Regular.Src);
							if(src==""){continue;}
							var nLoad= Fx.Regex.Match(scripts[i], Fx.Regex.Regular.nLoad);
							if(nLoad[1]=='true'){continue;}
							
							loadUrls.push(src[1]);
						}
						for(var j=0;j<links.length;j++){
							var href=Fx.Regex.Match(links[j], Fx.Regex.Regular.Href);
							if(href==""){continue;}
							loadUrls.push(href[1]);
						}
						result=result.replace(Fx.Regex.Regular.Script,function(m,i){
							var nLoad= Fx.Regex.Match(m, Fx.Regex.Regular.nLoad);
					
							if(nLoad[1]=='true'){
								return m.replace(Fx.Regex.Regular.nLoad,'');
							}
							return '';
						});
						
						//result=result.replace(Fx.Regex.Regular.Script,'');
						result=result.replace(Fx.Regex.Regular.Link,'');
						var loadCount=0;

						if(loadUrls.length==0){
							if(loadCount>0){return;}
							loadCount++;
							LoadPage();
						}

						Fx.loadMulFile(loadUrls,function(a){
							if(loadCount>0){return;}
							loadCount++;
							LoadPage();
						});
					}
				});
				
				return;
			}
			
			LoadPage();
            return $(Fx.format('div[id="Fx_Alert_Mask_Container{0}"]', id));
        },
        //加载中提示框
        //CancelFunc:提示框消失后调用的函数
        //blnCancel:是否消除提示框
        LoadingTip: function (CancelFunc, blnCancel) {

            blnCancel = blnCancel == undefined ? false : true;

            var self = Fx.alert;
            var id = Fx.getGuidGenerator();//唯一标识符
            var blnAnimation = false;//是否支持动画属性
            //浏览器功能监听对象
            if (Modernizr) { blnAnimation = Modernizr.cssanimations; }
            //按钮单击后效果
            var timerId = 0;
            var InvokElement = this;
            //var callBack = function () {
            //    try
            //    {
            //        Fx.Trigger(InvokElement, Fx.TouchEven.Touchend);
            //        clearTimeout(timerId);
            //    }catch(e){}
            //};

            var delTimerId = 0;
            var delWindow = function () {
                if (blnCancel == false) { clearTimeout(delTimerId); return; }
                $(Fx.format('#Fx_Alert_Mask_Container{0}', id)).remove();
                if (CancelFunc) {
                    CancelFunc();
                }
            };

            var Container = Fx.format(self.Mask, blnAnimation == true ? self.LoadingWindow : self.NormalLoadingWindow, id);
            //timerId = setTimeout(callBack, 100);
            $('body').append(Container);

            delTimerId = setTimeout(delWindow, 1000);
            //调整弹窗的位置
            self.AdjustSize($(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_Mask"]', id)), $(Fx.format('#Fx_Alert_Mask_Container{0} > {1}[class="Fx_Alert_TipWindow_spinner"]', id, blnAnimation == true ? 'div' : 'img')));

            return $(Fx.format('#Fx_Alert_Mask_Container{0}', id));
        },
        //进度条
        ProgressBar:function(){
            var self = Fx.alert;
            var id = Fx.getGuidGenerator();//唯一标识符

            var Container = Fx.format(self.Mask,self.ProgressBarWindow, id);

            $('body').append(Container);

            self.AdjustSize($(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_Mask"]', id)), $(Fx.format('#Fx_Alert_Mask_Container{0} > div[class="Fx_Alert_ProgressBar"]', id)));

            //设置扩展方法
            var self = $(Fx.format('#Fx_Alert_Mask_Container{0}', id));

            //修改进度条值
            //value:进度条的值(百分比)
            self.UpdateProgress = function (value) {
                var proValue = $(this).find('span[name="value"]');//显示进度条值容器
                var proBg = $(this).find('div[name="Fx_Alert_ProgressBar_Bg"]');//进度条背景色容器
                proValue.html(value);
                proBg.css('width',value);
            }

            //删除对象
            self.Remove = function (callBack) {
                Fx.DelayTrigger(function () {
                    self.remove();
                    if (typeof (callBack) == 'function') {
                        callBack();
                    }
                }, this, 500);
            }

            return self;

        },
        //绑定浏览器大小改变事件(以便调整控件大小)
        //AdjustMask:调整遮罩大小元素
        //AdjustWindow:调整窗体大小
        AdjustSize: function (AdjustMask, AdjustWindow) {
            //设置透明遮罩高度
            var height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            if (AdjustMask) {
                AdjustMask.css({ height: height });
            }
            if (AdjustWindow) {
                //设置弹窗居中显示
                var popWindowWith = $(window).width() - AdjustWindow.width(); //弹窗宽度

                AdjustWindow.css('right', Fx.format('{0}px', popWindowWith / 2));
            }

            //调用调整控件大小函数
            $(window).bind('resize load', function () {
                //Fx.alert.AdjustSize(AdjustMask, AdjustWindow);
            });
        },
        /**************弹窗相关Html**************/
        //遮罩
        Mask: '<div class="Fx_Alert_Mask_Container" id="Fx_Alert_Mask_Container{1}"><div class="Fx_Alert_Mask"></div>{0}</div>',
        //窗体
        Window: '<div class="Fx_Alert_Window_Container" >' +
						'<div class="Alert_Border">' + //窗体边框
							'<div class="Alert_Caption">{0}</div>' +//标题栏
							'<div class="Alert_Content">{1}</div>' +//内容栏
							'<div class="Alert_Option">{2}</div>' +//操作栏
						'</div>' +
					'</div>',
        //按钮
        BtnItem: '<span class="BtnItem" data="{1}" style="cursor:pointer;">{0}</span>',
        //提示框A
        TipWindowA: '<div id="TipWindow_{0}" class="Fx_Alert_TipWindow_Container" >' +
							'<div class="Alert_Border">' + //窗体边框
								'<div class="Alert_Caption">{1}<div class="Alert_OptionBar" name="Alert_OptionBar" style="float:right;"><div style="{3}" class="Del_Btn" name="Del_Btn">X</div></div></div>' +//标题栏
								'<div class="Alert_Content">{2}</div>' +//内容栏
							'</div>' +
						 '</div>',
        //提示框
        TipWindow: '<div id="TipWindow_{0}" class="Fx_Alert_TipWindow_Container" >' +
							'<div class="Alert_NoBorder">' + //窗体边框
								'<div class="Alert_NoCaption">{1}<div class="Alert_OptionBar" name="Alert_OptionBar" style="float:right;"></div></div>' +//标题栏
								'<div class="Alert_NoContent" name="Del_Btn">{2}</div>' +//内容栏
							'</div>' +
						 '</div>',
        //加载中提示框(支持Html5)
        LoadingWindow: '<div class="Fx_Alert_TipWindow_spinner">' +
								'<div class="rect1"></div>' +
								'<div class="rect2"></div>' +
								'<div class="rect3"></div>' +
								'<div class="rect4"></div>' +
								'<div class="rect5"></div>' +
							  '</div>',
        //普通加载中提示框(不支持Html5)
        NormalLoadingWindow: '<img class="Fx_Alert_TipWindow_spinner" style="width:60px;height:60px;" src="images/LoadingImg.gif" />',
        //停靠窗体
        DockWindow: '<div class="Fx_Dock_Window_Container" style="{0}">' +
							'<div class="Alert_Border" style="{1}">' +
								'<div class="Alert_Caption">{2}</div>' +//标题栏
								'<div class="Alert_Content">{3}</div>' +//内容栏
								'<div class="Alert_Option">{4}</div>' +//操作栏
							'</div>' +
							'<div style="clear:both;"></div>' +
						  '</div>',
        //自动定位窗体
        AutoPosElWindow: '<div class="Fx_AutoPos_Container" id="{0}" style="{1}"></div>',
        //冒泡提示窗
        Bubble: '<div id={0} style="display: block;{3}" class="Fx_Bubble_Container">' +
					'<span class="Validform_checktip Validform_wrong">{1}</span>' +
					'<span class="dec_{2}">' +
						'<s class="dec1">◆</s>' +
						'<s class="dec2">◆</s>' +
					'</span>' +
				'</div>',
        //进度条窗体
        ProgressBarWindow: '<div class="Fx_Alert_ProgressBar"><span name="value">0%</span><div name="Fx_Alert_ProgressBar_Bg" class="Fx_Alert_ProgressBar_Bg"></div></div>',
		LoadPageWindow: '<div id="TipWindow_{0}" class="Fx_Alert_TipWindow_Container" >' +
										'<div class="Alert_NoBorder">' + //窗体边框
											'<div class="Alert_CaptionA" name="TitleBar">{1}<div class="Alert_OptionBar" name="Alert_OptionBar" style="float:right;"><div style="{3}" class="Del_Btn" name="Del_Btn">X</div></div></div>' +//标题栏
											'<div class="Alert_ContentA" name="Content">{2}</div>' +//内容栏
										'</div>' +
									 '</div>'
    });

    /*特效函数*/
    Fx.Effect = Fx.Effect || {};
    Fx.apply(Fx.Effect, {
        //硬件加速
        HardwareAcceler: {
            '-webkit-transform': 'translateZ(0)',
            '-moz-transform': 'translateZ(0)',
            '-ms-transform': 'translateZ(0)',
            '-o-transform': 'translateZ(0)',
            'transform': 'translateZ(0)',
            'webkit-backface-visibility': 'hidden',
            '-moz-backface-visibility': 'hidden',
            '-ms-backface-visibility': 'hidden',
            'backface-visibility': 'hidden',
            '-webkit-perspective': '1000',
            '-moz-perspective': '1000',
            '-ms-perspective': '1000',
            'perspective': '1000',
            '-webkit-transform': 'translate3d(0, 0, 0)',
            '-moz-transform': 'translate3d(0, 0, 0)',
            '-ms-transform': 'translate3d(0, 0, 0)',
            'transform': 'translate3d(0, 0, 0)'
        },
        /*横向移动特效*/
        //Target:目标对象
        HorizontalMove: function (Target) {
            var self = this;
            $(Target).css('margin-left', $(Target).width() + 'px');
            //设置过度效果
            Target.each(function (index) {

                $(this).css('margin-left', $(this).width() + 'px');
                $(this).css('margin-left', '0px');
                var delayTime = 0.1 * (index + 1);

                //设置硬件加速
                $(this).css(self.HardwareAcceler);
                //设置移动过度效果
                $(this).css({
                    '-webkit-transition': Fx.format('margin-left 1s ease-in-out {0}s', delayTime),
                    '-moz-transition': Fx.format('margin-left 1s ease-in-out {0}s', delayTime),
                    '-ms-transition': Fx.format('margin-left 1s ease-in-out {0}s', delayTime),
                    '-o-transition': Fx.format('margin-left 1s ease-in-out {0}s', delayTime),
                    'transition': Fx.format('margin-left 1s ease-in-out {0}s', delayTime)
                });

                //设置颜色转换
                $(this).css({
                    '-webkit-animation': Fx.format('ColorChange 1s ease-in-out {0}s', delayTime),
                    '-moz-animation': Fx.format('ColorChange 1s ease-in-out {0}s', delayTime),
                    '-ms-animation': Fx.format('ColorChange 1s ease-in-out {0}s', delayTime),
                    '-o-animation': Fx.format('ColorChange 1s ease-in-out {0}s', delayTime),
                    'animation': Fx.format('ColorChange 1s ease-in-out {0}s', delayTime)
                });
            });
        },
        //垂直降落
        //Target:使用特效的元素对象
        //EndPos:结束位置
        Plummet: function (Target, EndPos) {
            $(Target).css('top', EndPos);
            $(Target).css('opacity', 1);
            var delayTime = 0.0;
            //设置移动过度效果
            $(Target).css({
                '-webkit-transition': Fx.format('top 0.2s linear {0}s,opacity 0.5s linear 0s', delayTime),
                '-moz-transition': Fx.format('top 0.2s linear {0}s,opacity 0.5s linear 0s', delayTime),
                '-ms-transition': Fx.format('top 0.2s linear {0}s,opacity 0.5s linear 0s', delayTime),
                '-o-transition': Fx.format('top 0.2s linear {0}s,opacity 0.5s linear 0s', delayTime),
                'transition': Fx.format('top 0.2s linear {0}s,opacity 0.5s linear 0s', delayTime)
            });
        }
    });

    /*Js调用WCF*/
    Fx.WCF = Fx.WCF || {};
    Fx.apply(Fx.WCF, {
        //服务地址
        ServiceUrl: '',
        //调用
        //serviceUrl:服务地址
        //callBackFunc:回调方法
        //funcName:方法名
        Invoke: function (funcName, data, callBackFunc, serviceUrl) {
            serviceUrl = serviceUrl || this.ServiceUrl;//如果没有传入服务地址则是由初始化的服务地址
            alert(serviceUrl + funcName);
            Fx.ajax({
                type: 'get',
                url: serviceUrl + funcName + '?jsoncallback=?',
                dataType: 'json',
                async: false,
                data: data,
                success: function (data) {
                    callBackFunc(data);
                }
            });

        }
    });

    /*置顶按钮*/
    Fx.Stick = Fx.Stick || {};
    Fx.apply(Fx.Stick, {
        //按钮唯一标识
        id: '',
        //置顶按钮图标路径
        Icon: '/Content/ComponentImg/Stick.ico',
        //初始化置顶按钮
        Init: function () {
            var self = this;
            self.id = Fx.getGuidGenerator();//设置按钮唯一标识

            var result = '';
            result = Fx.format(self.Container,
                    self.id,
                    self.Icon
                    );

            $('body').append(result);

            var topScoll = new Object();

            //查找顶级Div对象
            function FindTopDiv(root, outObj) {
                var children = $(root).children('div');
                var objCol = [];
                $.each(children, function () {
                    var scrollHeight = this.scrollHeight;//滚动条总高度
                    var clientHeight = this.clientHeight;//页面可视区域高度
                    objCol.push(this);
                    if (scrollHeight > clientHeight) {
                        outObj.IsExist = true;
                        outObj.Content = this;
                        return;
                    }
                });
                for (var i = 0; i < objCol.length; i++) {
                    FindTopDiv(objCol[i], outObj);
                    if (outObj.IsExist) {
                        break;
                    }
                }
            }

            window.onload = function () {
                //判断窗体对象是否有滚动条
                var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//滚动条总高度
                var clientHeight = document.documentElement.clientHeight || document.body.clientHeight;//页面可视区域高度
                if (scrollHeight > clientHeight) {
                    //注册滚动条事件
                    window.onscroll = function () {
                        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;//距离顶部距离
                        scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;//滚动条总高度
                        clientHeight = document.documentElement.clientHeight || document.body.clientHeight;//页面可视区域高度

                        var top_div = document.getElementById(self.id);
                        if ((scrollTop >= 200 || (clientHeight + scrollTop + 5) >= scrollHeight) && scrollTop != 0) {
                            top_div.style.display = "inline";
                        } else {
                            top_div.style.display = "none";
                        }
                    };
                } else {
                    //其他div对象只查找顶级div对象
                    FindTopDiv('body', topScoll);

                    $(topScoll.Content).scroll(function () {
                        var scrollTop = this.scrollTop;//距离顶部距离
                        scrollHeight = this.scrollHeight || this.body.scrollHeight;//滚动条总高度
                        clientHeight = this.clientHeight || this.body.clientHeight;//页面可视区域高度

                        var top_div = document.getElementById(self.id);
                        if ((scrollTop >= 200 || (clientHeight + scrollTop + 5) >= scrollHeight) && scrollTop != 0) {
                            top_div.style.display = "inline";
                        } else {
                            top_div.style.display = "none";
                        }
                    });
                }
            }


            //注册按钮单击事件
            var btn = document.getElementById(self.id);//按钮对象
            Fx.TouchClick(btn, function () {
                //其他Div包含滚动条
                if (topScoll.IsExist) {
                    topScoll.Content.scrollTop = 0;
                }
                //窗体包含滚动条
                if (window.scrollTo) {
                    window.scrollTo(0, 0);
                } else if (document.documentElement) {
                    document.documentElement.scrollTop = 0;
                } else {
                    document.body.scrollTop = 0;
                }
            });
        },
        //按钮容器
        Container: '<div id="{0}" style="display:none;position:fixed;right:0px;bottom:5px;width:40px;height:40px;z-index:3000;background-color:#F6F6F6;border: 1px solid #DDD;border-radius: 5px;-moz-box-shadow:0px 1px 3px rgba(0, 0, 0, 0.15);-webkit-box-shadow:0px 1px 3px rgba(0, 0, 0, 0.15);box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15);"><img src="{1}" style="position: absolute;top:50%;left:50%;margin-left:-16px;margin-top:-16px;" /></div>'
    });

    /*通用DOM元素方法*/
    Fx.Dom = Fx.Dom || {};
    Fx.apply(Fx.Dom, {
        //尺寸标识
        Size: {
            '高': 1,
            '宽': 2
        },
        //元素尺寸标量
        DomScalar: {
            //高(标识)
            1: [
                'padding-top',
                'padding-bottom',
                'margin-top',
                'margin-bottom',
                'height'
            ],
            //宽(标识)
            2: [
                'padding-left',
                'padding-right',
                'margin-left',
                'margin-right',
                'width'
            ]
        },
        //元素尺寸
        //dom:元素
        //size:元素尺寸标识
        DomSize: function (dom, size) {
            var self = this;
            var result = 0;
            for (var index = 0; index < self.DomScalar[size].length; index++) {
                result += Fx.ConvertPxToInt($(dom).css(self.DomScalar[size][index]));
            }

            return result;
        },
        //自动判断元素内容是否超出元素显示宽度范围,超出后则改为滚动显示
        //dom:元素
        //content:元素内显示的内容
        AutoRoll: function (dom, content) {
            //判断是否为Jquery对象
            var blnJqObj = Fx.support.IsJqObj(dom);
            if (!blnJqObj) { dom = $(dom); }
            var domWidth = dom.width();
            var domFontSize = dom.css('font-size');
            var domPadding = dom.css('padding');
            var id = 'AutoRoll_' + Fx.getGuidGenerator();

            $(Fx.format('<div id="{0}" style="display:none;height:auto;">测</div>', id)).appendTo('body');

            var testObj = $(Fx.format('div[id="{0}"]',id));//测试dom元素对象

            testObj.css({ 'width': domWidth + 'px', 'font-size': domFontSize, 'Padding': domPadding });
            var idHeight = testObj.height();//高度指标
            testObj.html(content);

            var actualHeight = testObj.height();//显示内容后的实际高度
            testObj.remove();
            if (actualHeight > idHeight) {
                //内容已经超出,出现换行
                content = Fx.format('<marquee scrollamount="2" direction="Left">{0}</marquee>',content);
            }

            dom.html(content);
        }
    });
    /*正则表达式验证*/
    Fx.Regex = Fx.Regex || {};
    Fx.apply(Fx.Regex, {
        //规则
        Regular: {
			//手机号码
			'Phone': /^1(3\d|5[0-35-9]|7[07]|8[012345678-9])\d{8}$/,
			 //文件后缀名
            'FileSuffix': /[^\.]+$/,
			//Script标签
			'Script':/<script\b[^<>]*?\bsrc=.*?>.*?<\/script>/ig,
			//样式标签
			'Link':/<link\b[^<>]*?\bhref=.*?(?:>|\/>)/gi,
			//Href路径
			'Href':/href=['"]?([^'"]*)['"]?/i,
			//Src路径
			'Src':/src=['"]?([^'"]*)['"]?/i,
			//nLoad(不加载)
			'nLoad':/nLoad=['"]?([^'"]*)['"]?/i,
            //图片格式
            'ImageFormat': (/\.jpg$|\.jpeg$|\.png$|\.ico$|\.gif$/i),
            //图片标签
            'ImageUrl': /<img.*?(?:>|\/>)/gi,
            //图片地址(Src)
            'ImgSrc': /src=['"]?([^'"]*)['"]?/i,
            //身份证
            'Identity': /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        },
        //验证
        //验证字符串
        //regular:验证规则
        Verify: function (str, regular) {
            if (str == null || str == "") return false; //输入为空，认为是验证失败    
            return regular.test(str);
        },
        //匹配表达式内容
        Match: function (str, regular) {
            if (str == null || str == "") return "";
            return str.match(regular) || "";
        },
        //身份证验证
        //identityNumber:身份证号
        IdentityValid: function (identityNumber) {
            if (Fx.Regex.Regular['Identity'].test(identityNumber) === false) {
                return false;
            }

            var identityInfo = Fx.CalculBirthday(identityNumber);
            var birthday = identityInfo.birthday.split('-');//出生年月日
            var age = identityInfo.age;//年龄
            var sex = identityInfo.sex;//性别
            //判断出生年月是否合法
            if (parseInt(birthday[1]) > 12 || parseInt(birthday[2] > 31)) {
                //月份/日期
                return false;
            }
            //判断年龄是否合法
            if (parseInt(age) >= 200) {
                return false;
            }

            return true;
        }
    });
	
	/***验证表单***/
	Fx.valid=Fx.valid || {};
	Fx.apply(Fx.valid,{
		//全局所有验证dom元素缓存
		Chache:[],
		//清空所有缓存对象
		Clear:function(){
			var self=this;
			for(var i=0;i<self.Chache.length;i++){
				 var jdom=$(self.Chache[i]);
				 var id=jdom.attr('data_valid_id')+'_menu';
				 $('#'+id).remove();
			}
			self.Chache.splice(0);
		},
		//初始化验证插件
		//dom:验证的元素容器对象
		Init:function(dom){
			var parent=this;
			var bodyObj=new Object();
			Fx.apply(bodyObj,
			{
				validCache:null, //缓存验证对象
				//验证
				Exec:function(){
					var self=this;
					var flag=true;
					var cache=this.validCache;
					for(var i=0;i<cache.length;i++){
						var dom=cache[i];
						var jdom=$(dom);
						var type=jdom.attr('data_type');//验证类型
						//设置验证样式
						if(!parent.validData(jdom,type)){
							if(flag){jdom.focus()}
							flag=false;
							parent.setValidStyle(jdom,type)
						}
					}
					
					return flag;
				},
				//清除提示框
				Clear:function(){
					var self=this;
					for(var i=0;i<self.validCache.length;i++){
						 var jdom=$(self.validCache[i]);
						 var id=jdom.attr('data_valid_id')+'_menu';
						 $('#'+id).remove();
					}
				}
			});
			
			var mousewheel = document.all?"mousewheel":"DOMMouseScroll";
			$('body').bind(mousewheel, function(event) {
				bodyObj.Clear();
			});
			
			
			
			var BlnJQuery = false;//判断对象是否Jquery对象
            if (typeof (jQuery) != "undefined") { BlnJQuery = dom instanceof jQuery; }
            //当用Jquip(精简版Jquery时,需要判断对象是否包含selector属性)
            if (dom.selector != undefined) { BlnJQuery = true; }
			if(!BlnJQuery){dom=$(dom);}
			//查找所有元素下所有需要验证的对象元素并缓存
			bodyObj.validCache=dom.find('*[data_valid="true"]:visible');		
			//设置缓存对象标认
			for(var i=0;i<bodyObj.validCache.length;i++){
				parent.Chache.push(bodyObj.validCache[i]);
				var jobj=$(bodyObj.validCache[i]);
				
				jobj.attr('data_valid_id',Fx.getGuidGenerator());
				if(jobj.attr('data_type')=='required'){
					jobj.keyup(function(){
						parent.setValidStyle($(this),$(this).attr('data_type'));
					});
				}
				
				(function(jobj){
					if(jobj.attr('data_type')=='compare'){
						jobj.keyup(function(){
							if($('#'+jobj.attr('data-compareid')).val()==""){return;}
							parent.setValidStyle($(this),$(this).attr('data_type'));
						});
						$('#'+jobj.attr('data-compareid')).keyup(function(){
							parent.setValidStyle(jobj,jobj.attr('data_type'));
						});
					}
				})(jobj);
			}
			
			return bodyObj;
		},
		//验证数据
		//dom:验证元素对象
		//type:验证数据类型
		validData:function(dom,type){
			switch(type)
			{
				case 'required':
					if(dom.val()){return true;}
					return false;
				case 'compare':
					var compareObj=$('#'+dom.attr('data-compareid'));
					if(compareObj.val()==dom.val() && dom.val()!=''){return true;}
					return false;
				break;
			}
		},
		setValidStyle:function(dom,type){
			var self=this;
			var id=dom.attr('data_valid_id')+'_menu';
			//验证不通过
			if(!self.validData(dom,type)){
				var err_msg=dom.attr('data_error_msg');//错误信息
			
				var offset = Fx.getOffset(dom[0]);
				var height = Fx.getHeight(dom[0], true);
				var width=Fx.getWidth(dom[0],false);
				var menuItem=$('#'+id);
				if(menuItem.length<=0){
					$('body').append(Fx.format(self.menu,id,offset.top-50,offset.left+width-30,err_msg));
				}
				menuItem=$(Fx.format('div[id="{0}"]',id));
				menuItem.animate({'top':(self.menu,id,offset.top-30)+'px'});
				
				return false;
			}else{
				$('#'+id).remove();
				
				return true;
			}
		},
		menu:'<div id="{0}" class="validation-tip" style="top:{1}px;left:{2}px;">{3}</div>'
	});
	
	Fx.Cookie=Fx.Cookie || {};
	Fx.apply(Fx.Cookie,{
		set:function(name,value,time)
		{
			time=time || 's300'; //300秒
			var strsec = this.getsec(time);
			var exp = new Date();
			exp.setTime(exp.getTime() + strsec*1);
			document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}, 
		get:function(name)
		{
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		 
			if(arr=document.cookie.match(reg))
		 
				return unescape(arr[2]);
			else
				return null;
		}, 
		del:function(name)
		{
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=this.getCookie(name);
			if(cval!=null)
				document.cookie= name + "="+cval+";expires="+exp.toGMTString();
		},
		getsec:function(str)
		{
		   var str1=str.substring(1,str.length)*1;
		   var str2=str.substring(0,1);
		   if (str2=="s")
		   {
				return str1*1000;
		   }
		   else if (str2=="h")
		   {
			   return str1*60*60*1000;
		   }
		   else if (str2=="d")
		   {
			   return str1*24*60*60*1000;
		   }
		} 
	});
	
}());