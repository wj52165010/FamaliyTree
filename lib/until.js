(function(window,docoument,$){
	
	var _={
		depthclone:'',//深度拷贝属性(该属于用于继承,多个属性用逗号分隔;通常该属性用于配置属性深度拷贝)
		enumerables:['hasOwnProperty', 'valueOf', 'isPrototypeOf', 'propertyIsEnumerable','toLocaleString', 'toString', 'constructor'],
		toString:Object.prototype.toString,
		valueFn:function(value) {return function() {return value;};},
		isUndefined:function(value){return typeof value === 'undefined';},
		isDefined:function(value){return typeof value !== 'undefined';},
		isObject:function(value){return value != null && typeof value === 'object';},
		isString:function(value){return typeof value === 'string';},
		isNumber:function(value){return typeof value === 'number';},
		isDate:function(value){return _.toString.call(value) === '[object Date]';},
		isArray:function(value){return _.toString.call(value) === '[object Array]';},
		isFunction:function(value){return typeof value === 'function';},
		isRegExp:function(value) {return _.toString.call(value) === '[object RegExp]';},
		isFile:function(obj) {return _.toString.call(obj) === '[object File]';},
		isBoolean:function(value) {return typeof value === 'boolean';},
		isWindow:function(obj) {return obj && obj.document && obj.location && obj.alert && obj.setInterval;},
		trim:(function() {
			if (!String.prototype.trim) {
				return function(value) {
				  return _.isString(value) ? value.replace(/^\s\s*/, '').replace(/\s\s*$/, '') : value;
				};
			}
			  return function(value) {
				return _.isString(value) ? value.trim() : value;
			  };
		})(),
		key:function(obj,keyIndex){
			var i=0,result='';
			for(var key in obj){
				if(keyIndex===i){
					result=key;
				}
				i++;
			}
			
			return result;
		},
		isArrayLike:function(obj) {
		  if (obj == null || _.isWindow(obj)) {
			return false;
		  }

		  var length = obj.length;

		  if (obj.nodeType === 1 && length) {
			return true;
		  }
		  return _.isString(obj) || _.isArray(obj) || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj;
		},
		each:function(obj,iterator,context){
		  var key;
		  if (obj) {
			if (_.isFunction(obj)){
			  for (key in obj) {
				if (key != 'prototype' && key != 'length' && key != 'name' && (!obj.hasOwnProperty || obj.hasOwnProperty(key))) {
				  iterator.call(context, obj[key], key);
				}
			  }
			} else if (obj.forEach && obj.forEach !== _.each) {
			  obj.forEach(iterator, context);
			} else if (_.isArrayLike(obj)) {
			  for (key = 0; key < obj.length; key++)
				if(iterator.call(context, obj[key], key)==false)break;
			} else {
			  for (key in obj) {
				if (obj.hasOwnProperty(key)) {
				  if(iterator.call(context, obj[key], key)==false)break;
				}
			  }
			}
		  }
		  return obj;
		},
		find:function(obj,referobj,condition){
			var result=[];
			condition=condition || referobj;
			var blnArr=_.isArray(referobj);
			var blnRefer=!_.isFunction(referobj);
			var blnFlag=false;
			
			if(blnArr){
				_.each(referobj,function(item,index){
					result=result.concat(_.find(obj,item,condition));
				});
				
				return result;
			}
			
			_.each(obj,function(item,key){
				blnFlag=blnRefer?condition.call(referobj,item,key):condition(item,key);				
				if(blnFlag){
					result.push(item);
				}
			});
			
			return result;
		},
		//交叉连接数组(连接两个数组不相同的部分)
		CrossConcat:(function(){
			Array.prototype.CrossConcat=function(arr,callback){
				var self=this;
				if(arr.length==0){return self;}
				
				for(var i=0;i<arr.length;i++){
					var item=arr[i];
					var blnContain=false;
					for(j=0;j<self.length;j++){
						var arrItem=self[j];
						if(item===arrItem){
							blnContain=true;
							break;
						}
					}
					if(!blnContain){
						if(callback){
							self.push(callback(item));
						}else{
							self.push(item);
						}
					}
				}
			};
		}()),
		//复制对象(把一个对象的引用给另一个对象)
		//notDelPro:'不允许删除的属性'/string
		Copy:function(oriObj,cpObj,notDelPro){
			//删除原来对象的所有属性
			for(var key in oriObj){
				if((','+(notDelPro || '')+',').indexOf(','+key+',')>=0){continue;}
				delete oriObj[key];
			}
			//复制对象到新的引用地址去
			for(var key in cpObj){
				oriObj[key]=cpObj[key];
			}
			return oriObj;
		},
		//引管理(缓存或获取指定对象的相关引用对象)
		RM:(function(){
			var  _r=function(){
				this.refs={};//引用数组
				this.idName='rm_ref_id';
				this.idMappingObj={};
			};
			
			//清空引用池数据
			_r.prototype.clear=function(){
				this.refs={};
				this.idMappingObj={};
			};
			
			//获取引用池中的对应对象
			_r.prototype.cache=function(obj){
				var self=this;
				
				return self.idMappingObj[obj[self.idName] || ''];
			};
			
			//获取指定对象的相关引用对象
			_r.prototype.get=function(obj){
				var self=this,existID=obj[self.idName] || '';
				return !existID?null:self.refs[existID];
			};
			
			//替换引用
			//oriObj:原来的对象元素
			//repObj:替换的对象元素
			_r.prototype.replace=function(oriObj,repObj){
				var self=this;existID=oriObj[self.idName] || '';
				if(!existID){return;}
				return _.Copy(self.idMappingObj[existID],repObj,self.idName);
			};
			
			//设置指定对象相关引用对象
			_r.prototype.set=function(obj,arrRef){
				var self=this,id=_.guid(),existID=obj[self.idName] || '';
				var concatArr=arrRef || [];
				if(!u.isArray(concatArr)){concatArr=[concatArr];}
				
				var finalId=existID || id;
				
				self.idMappingObj[finalId]=obj;
				obj[self.idName]=finalId;
				self.refs[finalId]=self.refs[finalId] || [];
				self.refs[finalId].CrossConcat(concatArr);
				
				if(!_.isArray(arrRef)){return;}
				_.each(arrRef,function(ref,key){
					self.set(ref,obj);
				});
				
			};
			
			return _r;
		}()),
		pros:function(obj){
			if(!_.isObject(obj) ||  _.isArray(obj)){return [];}
			var result=[];
			_.each(obj,function(val,key){
				if(!_.isFunction(val) && !_.isRegExp(val)){
					result.push(key);
				}
			});
			
			return result;
		},
		apply:function (object, config, defaults) {
			if (defaults) {
				_.apply(object, defaults);
			}

			if (object && config && typeof config === 'object') {
				var i, j, k;

				for (i in config) {
					if (typeof config[i] === 'function') {
						config[i].$funcName = i;
					}

					if (typeof config[i] === 'object' && (object[_.depthclone] != '' && object[_.depthclone] != undefined) && (',' + _.depthclone + ',').indexOf(',' + i + ',') >= 0) {
						object[i] = object[i] || new Object();
						_.apply(object[i], config[i]);
						continue;
					}
					object[i] = config[i];

				}

				if (_.enumerables) {
					for (j = _.enumerables.length; j--;) {
						k = _.enumerables[j];
						if (config.hasOwnProperty(k)) {
							object[k] = config[k];
						}
					}
				}
			}
			return object;
		},
		format: function (format) {
            var formatRe = /\{(\d+)\}/ig;

            var args = new Array();
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }

            return format.replace(formatRe, function (m, i) {
                return args[i];
            });
        },
		one:function(func, context, delaytime){
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
		guid: function () {
            var S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
		//异步链式编程函数(简易版仿Q函数)
		Q:(function(){
			var _p=function(relatedQueue,errCallback,finalBack){
				this._id=_.guid();
				this.blnGo=false;
				this.execQueue=relatedQueue ||[];
				this.execQueue.push({id:this._id,funcs:[],self:this});
				this._err=errCallback || [];
				this._finalBack=finalBack || function(){};
			};
			_p.prototype.err=function(callback){
				this._err.push(callback);
			};
			_p.prototype.getFuncs=function(){
				var self=this;
				var execObj,_index;
				_.each(this.execQueue,function(obj,index){
					if(obj.id==self._id){
						execObj=obj;
						_index=index;
					}
				});
				execObj.index=_index;
				return execObj;
			};
			_p.prototype.then=function(onResolved,onRejected){
				this.getFuncs().funcs=[onResolved,onRejected];
				return new _p(this.execQueue,this._err,this._finalBack);
			};
			_p.prototype.resolve=_p.prototype.ok=function(){
				var args=arguments;
				var self =this;
				_.one(function(){
					self.blnGo=true;
					var funcObj=self.getFuncs();
					if(funcObj.funcs.length<2){self._finalBack(result);return;}
					var result=funcObj.funcs[0].apply(self,args || []);
					var blnPromise=result instanceof _p;
				
					if(blnPromise && self.execQueue[funcObj.index+1]){
						var nextQ=self.execQueue[funcObj.index+1].self;
						result.execQueue=nextQ.execQueue;
						result._id=nextQ._id;
						result._err=nextQ._err;
					}
					else if(self.execQueue[funcObj.index+1] && self.blnGo){
						//如果存在下一个执行环节自动跳转到下一个执行环节中
						self.execQueue[funcObj.index+1].self.resolve(result);
					}
				},new Object(),50);
			};
			_p.prototype.reject=_p.prototype.no=function(){
				var args=arguments;
				var self=this;
				self.blnGo=false;
				_.one(function(){
					if(self.getFuncs().funcs[1]){
						self.getFuncs().funcs[1].apply(self,args || []);
					}else if(_.isFunction(self._err[0])){
						self._err[0].apply(self,args || []);
					}
				},new Object(),50);
			};
			
			return _p;
		}()),
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
					if(Fx.VisitOri!='pc' && !isJs)_.one(function(){if(!invoke){invoke=true;if(callback){callback(false);callback=null;}}},new Object(),200);
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
			var arr=_.Clone(loadarr);
			if(arr.length<=0){return;}
			var loadFunc=function(arr){
				if(arr.length==0){return;}
				var url= arr.shift();
				var fileSuffix=(url==null || url=='')?'':url.match(/[^\.]+$/) || '';
				if(fileSuffix=='js' || fileSuffix=='css'){
					var blnJs=fileSuffix=='js';//是否是Js文件	
					_.loadJsCss(url,function(flag){
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
		}
	};
	window['u']=window['u'] || _;
	
})(window,document,(window['Zepto'] || jQuery));