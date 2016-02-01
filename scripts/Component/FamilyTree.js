Fx.define('FamilyTreeComp', {
	id: '',//唯一标示符
	extend:'Fx.cls.TreeComp',
	BtnSize:{
		width:100,
		height:30,
	},
	//添加按钮
	btns:{
		'父亲':{name:'添加父亲',sex:1},
		'母亲':{name:'添加母亲',sex:0},
		'爱人':{name:'添加爱人',sex:0},
		'兄弟':{name:'添加兄弟',sex:1},
		'儿子':{name:'添加儿子',sex:1},
		'女儿':{name:'添加女儿',sex:0},
		'祖父':{name:'添加祖父',sex:1},
		'祖母':{name:'添加祖母',sex:0},
		'外祖父':{name:'添加外祖父',sex:1},
		'外祖母':{name:'添加外祖母',sex:0},
		'二爸':{name:'添加二爸',sex:1},
		'二妈':{name:'添加二妈',sex:0},
		'姨父':{name:'添加姨父',sex:1},
		'姨母':{name:'添加姨母',sex:0}
	},
	nodeMappingbtn:{
		//根节点
		//'root':[['父亲','母亲'],'兄弟',['儿子','女儿','二爸','二妈'],'爱人'],
		'root':[['父亲','母亲'],'兄弟',['儿子','女儿',{'二爸':1},{'二妈':1},{'姨父':1},{'姨母':1}],'爱人'],
		'兄弟':['兄弟'],
		'爱人':['兄弟'],
		'父亲':[['父亲','母亲']],
		'母亲':[['父亲','母亲']],
		'儿子':[['儿子','女儿']],
		'女儿':[['儿子','女儿']],
		'二爸':[['爱人','兄弟']],
		'二妈':[['爱人','儿子']],
		'姨父':[['爱人','兄弟']],
		'姨母':[['爱人','兄弟']]
	},
	defPlaceNode:{blnPlace:true},//默认占位节点(不显示)
	//引用管理
	RM:(function(){
		return new u.RM();
	}()),
	config:{
		//data:[
		//	{name:'路飞',type:'root',items:[
		//		[{name:'添加父亲',type:'btn'},{name:'添加母亲',type:'btn'}],
		//		{name:'1234',items:[{blnPlace:true},{name:'添加兄弟',type:'btn'}]},
		//		[{name:'添加儿子',type:'btn'},{name:'添加女儿',type:'btn'}],
		//		{name:'添加爱人',type:'btn'}
		//	]}
		//]
		data:[{name:'路飞',kind:'root',sex:1}],
		//新增回调函数
		addFunc:function(data,addData){
			var p=new u.Q();
			//成功后调用
			//console.log(data);
			p.ok();
			return p;
		},
		//删除回调函数
		delFunc:function(data,delData){
			var p=new u.Q();
			//成功后调用
			//console.log(delData);
			p.ok();
			return p;
		},
		addFriendCallback:function(){
			var p=new u.Q();
			var data=[{name:'123',birthday:'2012-1-12',like:'喜好',img:'1.jpg',id:'3'},{name:'忘记',birthday:'2012-1-12',like:'喜好'},{name:'忘记',birthday:'2012-1-12',like:'喜好'},{name:'忘记',birthday:'2012-1-12',like:'喜好'}];
			p.ok(data);
			return p;
		},
		addFriend:function(context){
			var self=this;
			var nameCtrl=self.find('input[name="addRelative_name"]');//姓名元素
			var birthdayCtrl=self.find('input[name="addRelative_birthday"]');//生日元素
			var likeCtrl=self.find('input[name="addRelative_like"]');//喜好元素
			var personImgCtrl=self.find('img[name="personImg"]');//个人图片元素
			Fx.alert.LoadPageTip({
				title:'好友列表',
				content:'',
				blnAutoCancel:false,
				style:{'font-size':'0.7em','width':'400px'},
				headerStyle:{'background-color':'#B5C998','color':'#527135'},
				appendFunc:function(container,tipWindow,ctrl){
					var addFriendTask=new u.Q();
					addFriendTask.then(function(){
						return context.config.addFriendCallback();
					}).then(function(data){
						//构建列表数据
						var listHtml='';
						u.each(data,function(item,index){
							listHtml+=Fx.format(context.ListItem,item.name,item.birthday,item.like,Fx.objcetToString(item));
						});
						
						container.html(Fx.format(context.FriendList,listHtml));
						//注册列表项单击事件
						container.find('tr[name="FriendItem"]').click(function(){
							var data=eval('('+$(this).attr('item-data')+')');
							nameCtrl.attr('item-data',$(this).attr('item-data'));
							nameCtrl.val(data.name);
							birthdayCtrl.val(data.birthday);
							likeCtrl.val(data.like);
							personImgCtrl.attr('src',context.config.baseImgUrl+data.img);
							ctrl.remove();
						});
						
						$('div[name="addPerson_scroll"]').slimScroll({
							position: 'right',
							size:'8px'
						});
						
					});
					addFriendTask.ok();
				}
			});
		}
	},
	AppendTo:function(Tag, config){
		var self=this;
		self.callParent([Tag, config]);
		//注册"添加"按钮单击事件
		self.Me.on('click','div[name="addBtnPerson"]',function(){
			var key=$(this).attr('id'),nodes=self.NodeInfo;
			self.AddNodeForm(function(name,birthday,like,img,data){
				u.each(nodes,function(item,index){
					if(key===index){
						//替换数据并刷新数据
						self.ReplaceNode(self.packageData,item.data,function(){
							//重新加载树形结构
							var addTask=new u.Q();
							addTask.then(function(){
								return self.config.addFunc.call(this,self.packageData,data);
							}).then(function(){
								self.RfreshNodes(self.packageData);
							});
							addTask.ok();
						},{id:data.id || '',name:name,birthday:birthday,like:like,img:img});
					}
				});
			});
		});
	},
	//替换节点
	//list:替换的集合对象
	//item:被替换目标
	ReplaceNode:function(list,item,callback,repalceObj){
		var self=this;
		u.each(list,function(data,index){
			if(data instanceof Array){
				self.ReplaceNode(data,item,callback,repalceObj);
			}else{
				if(!data.blnPlace){
					if(data.id==item.id){
						repalceObj.sex=item.sex || 0;
						repalceObj.kind=item.btnType;
						repalceObj.blnNoBtn=item.blnNoBtn || false;
						repalceObj.reserveDir=item.reserveDir || 0;
						
						if(item.type=='relatedBtn'){
							repalceObj.id=item.id;
							repalceObj[self.RM.idName]=item[self.RM.idName] || '';
							if(item.related){
								repalceObj.related=item.related;
							}
							
							self.RM.replace(item,repalceObj);//替换引用池中的对象
						}
						if(list[index+1] && item.relatedOffIndex==1 && item.type=='relatedBtn'){
							list[index+1].blnHasBtn=true;
							delete item.standardLine;
							delete list[index+1].standardLine;
						}
						if(list[index-1] && item.relatedOffIndex==-1 && list[index-1].type=='relatedBtn'){
							list[index-1].standardLine=true;
							repalceObj.standardLine=false;
						}
					
						list[index]=repalceObj || {name:'节点'};
						if(callback)callback();
					}else{
						if(data.items && data.items.length>0){
							self.ReplaceNode(data.items,item,callback,repalceObj);
						}
					}
				}
			}
		});
	},
	//删除节点(用占位符的方式)
	CascaDelNode:function(nodeInfo){
		var self=this,data=nodeInfo.data;
		self.defPlaceNode.kind=data.kind;
		self.defPlaceNode.id=data.id;
		self.defPlaceNode[self.RM.idName]=data[self.RM.idName] || '';
		if(data.related &&  data.related.length>0){
			//关联节点
			self.defPlaceNode.related=data.related;
		}
		
		self.RM.replace(data,self.defPlaceNode);//替换引用池中的对象
		self.HandleNodeData(self.packageData,data,'replace',function(reuslt){
			var delTask=new u.Q();
			delTask.then(function(){
				return self.config.delFunc.call(self,self.packageData,nodeInfo.data);
			}).then(function(){
				self.RfreshNodes(self.packageData);
			});
			delTask.ok();
		},self.config.data,null,self.defPlaceNode);
	},
	//刷新数据
	RfreshNodes:function(data){
		var self=this;
		self.callParent([data]);
	},
	//动态添加新增按钮
	AutoAddBtn:function(list){
		var self=this;
		u.each(list,function(data,index){
			if(data instanceof Array){
				self.AutoAddBtn(data);
			}else{
				self.AddBtnHandle(data);
				if(data.items && data.items.length>0){
					self.AutoAddBtn(data.items);
				}
			}
		});
	},
	//重新计算关联线长度
	CountRelatedLineLength:function(nodeData,rawLength,nodeSize){
		//如果存在关联按钮需要重新计算关联按钮的连线长度
		var self=this,btnSize=self.BtnSize;
		var relatedLineLength=0;
		if(nodeData.type==='relatedBtn'){
			//关联线按钮
			relatedLineLength=rawLength+(nodeSize.width-btnSize.width)/2;
		}
		
		return relatedLineLength || rawLength;
	},
	//判断是否采用制定线为分支基线
	DecideBaseLine:function(nodeData,oriLine,baseLine){
		//不包含子项的关联节点分支线为基线
		var self=this,result=oriLine;
		if(nodeData.standardLine){
			result=baseLine;
			self.RM.get(nodeData)[0]['baseLine']=baseLine;
		}else if(nodeData.standardLine==false){
			result=self.RM.cache(nodeData)['baseLine'];
		}

		return result;
	},
	//重新排序(用于多个分支节点的重构)
	//proofArr:依据数组
	//sortArr:排序数组
	AgainSort:function(proofArr,sortArr){
		var self=this,result=[];
		u.each(proofArr,function(item,index){
			var id=u.isObject(item)?u.key(item,0):item;
			var arr= u.find(sortArr,function(sortItem,index){
				return sortItem.kind==id;
			});
			if(arr.length>0){
				result.push(arr[0]);
			}else{
				result.push(self.defPlaceNode);
			}
		});
		
		return result;
	},
	//迭代处理数据接入操作
	ExtraIterHandle:function(item,parent){
		var self=this;
		var btns=self.nodeMappingbtn[item.kind];
		var btnsObj=self.btns;
		var blnRoot=item.kind=='root';//是否为根节点
		
		if((item.type!='btn' && item.type!='relatedBtn' && !item.blnNoBtn) || (item.blnHasBtn && item.type=='relatedBtn' ) ){
			item.items=item.items || [];
			u.each(btns,function(btn,index){
				var type=(btn instanceof Array)?'arr':'obj';
				
				switch(type){
					case 'arr':
						var preRelatedId='';
						var blnRelatedtNode=0;//是否为第一个关联节点
						var relatedNodes=[];//关联节点集合(用户相互引用)
						u.each(btn,function(btnItem,btnIndex){
							var blnrelated=u.isObject(btnItem);//是否为关联节点(默认相邻两个节点为关联节点)
							blnRelatedtNode=blnrelated?++blnRelatedtNode:blnRelatedtNode;
							btnItem=blnrelated?u.key(btnItem,0):btnItem;
							var relatedId=u.guid();
							preRelatedId=blnRelatedtNode==1?relatedId:preRelatedId;
							
							item.items[index]=!u.isArray(item.items[index])?[]:item.items[index];
							item.items[index]= self.AgainSort(btn,item.items[index]);//重新排序
		
							if(!item.items[index][btnIndex] || (item.items[index][btnIndex] &&  (item.items[index][btnIndex].blnPlace==true ||  !u.isUndefined(item.items[index][btnIndex].blnPlace)))){
								var btnObj=Fx.Clone(btnsObj[btnItem]);
								btnObj.type=blnRelatedtNode>0?'relatedBtn':'btn';
								btnObj.id=(item.items[index][btnIndex].id && blnRelatedtNode>0)?item.items[index][btnIndex].id:blnRelatedtNode>0?relatedId:null;
								btnObj[self.RM.idName]=item.items[index][btnIndex][self.RM.idName] || '';
								if(blnRelatedtNode==1){
									//关联节点(不包含子节点)
									btnObj.blnNoBtn=true;//是否不包含新增按钮
									btnObj.relatedOffIndex=1;//关联节点索引偏移量
									if(btnObj[self.RM.idName]){btnObj=self.RM.replace(btnObj,btnObj);}
									
									if(item.items[index][btnIndex+1] 
										&& item.items[index][btnIndex+1].type!='btn' 
										&& item.items[index][btnIndex+1].type!='relatedBtn' 
										&& !item.items[index][btnIndex+1].blnPlace)
									{
										btnObj.standardLine=true;
										item.items[index][btnIndex+1].standardLine=false;
									}
									
									self.RM.set(btnObj,relatedNodes);
									relatedNodes.push(btnObj);
								}
								if(blnRelatedtNode==2){
									//关联节点(包含子节点)
									btnObj.related=item.items[index][btnIndex].related?item.items[index][btnIndex].related:[preRelatedId];
									btnObj.relatedOffIndex=-1;//关联节点索引偏移量
									if(btnObj[self.RM.idName]){btnObj=self.RM.replace(btnObj,btnObj);}
									self.RM.set(btnObj,relatedNodes);
								}
								
								btnObj.btnType=btnItem;
								item.items[index][btnIndex]=btnObj;
								item.items[index][btnIndex].kind=btnItem;
								if(blnRoot){
									btnObj.reserveDir=index;
								}else{
									btnObj.reserveDir=item.reserveDir;
								}
							}
							if(blnRelatedtNode==2){blnRelatedtNode=0;preRelatedId='';relatedNodes=[]}
						});
						break;
					case 'obj':
						if(!item.items[index] || (item.items[index] &&  (item.items[index].blnPlace==true ||  !u.isUndefined(item.items[index].blnPlace)))){
							var btnObj=Fx.Clone(btnsObj[btn]);
							var dir=u.isNumber(item.reserveDir)?item.reserveDir:-1;
							btnObj.type='btn';
							btnObj.btnType=btn;
							if(dir>=0){
								//固定方位
								for(var i=0;i<=dir;i++){
									if(i==dir && item.items[i] && (item.items[i].blnPlace==true || !u.isUndefined(item.items[i].blnPlace))){
										item.items[i]=btnObj;
									}else{
										if(item.items[i]){
											item.items[i].kind=btn;
										}
										item.items[i]=i==dir?item.items[i]?item.items[i]:btnObj:self.defPlaceNode;
									}
								}
							}else{		
								item.items[index]=btnObj;
							}
							if(blnRoot){
								btnObj.reserveDir=index;
							}else{
								btnObj.reserveDir=item.reserveDir;
							}
						}else{
							item.items[index].kind=btn;
						}
						break;
				}
			});
		}
		
		return this.callParent([item]);
	},
	//建立节点
	BuildNode:function(data,referobj,path){
		var self=this,result='',size=self.container,nodeSize=self.NodeSize;
		var nodeInfo={},result='',top=0,left=0;
		var relativeNode=null;
		var id=Fx.getGuidGenerator();
		if(!referobj){
			if(!u.isArray(data)){
				//单个起始节点
				nodeInfo={
					id:id,
					type:'node',
					kind:data.btnType || 'root',
					name:data.name,
					top:size.height/2-nodeSize.height/2,
					left:size.width/2-nodeSize.width/2,
					width:nodeSize.width,
					height:nodeSize.height,
					path:[],
					parent:[],
					child:[]
				};
				result+=Fx.format(self.Node,
					data.name,
					size.height/2-nodeSize.height/2,
					size.width/2-nodeSize.width/2,
					nodeSize.width,
					nodeSize.height,
					nodeSize.height,
					id,
					data.img || self.config.baseImgUrl+self.randomImg(),
					"display:none;",
					data.sex==0?'#c5b27e':'#7EBEDC'
				);
			}else{
				//多个起始节点(目前为2个起始节点)
				var commonNode=null;
				var refNode={obj:null};
				var connectLen=300;//两个节点连接线长度
				var wholeLen=nodeSize.width*2+connectLen;//2个节点连接后的整体长度
				var hasIdentity=false;
				u.each(data,function(node,index){
					var hasChild=node.items && node.items.length>0;					
					if(hasChild || (!hasIdentity && index%2>0)){
						hasIdentity=true;
						commonNode=nodeInfo={
							id:u.guid(),
							type:'node',
							kind:data.btnType || 'root',
							name:node.name,
							top:size.height/2-nodeSize.height/2,
							left:index%2==0?size.width/2-wholeLen/2:size.width/2-wholeLen/2+connectLen+nodeSize.width,
							width:nodeSize.width,
							height:nodeSize.height,
							path:[],
							parent:[],
							child:[]
						};
						result=Fx.format(self.Node,
							nodeInfo.name,
							nodeInfo.top,
							nodeInfo.left,
							nodeInfo.width,
							nodeInfo.height,
							nodeInfo.height,
							nodeInfo.id,
							node.img || self.config.baseImgUrl+self.randomImg()
						);
						refNode.obj=node;
					}else{
						commonNode=relativeNode={
							id:u.guid(),
							type:'node',
							kind:data.btnType || 'root',
							name:node.name,
							top:size.height/2-nodeSize.height/2,
							left:index%2==0?size.width/2-wholeLen/2:size.width/2-wholeLen/2+connectLen+nodeSize.width,
							width:nodeSize.width,
							height:nodeSize.height,
							path:[],
							parent:[],
							child:[]
						};
						result=Fx.format(self.Node,
							relativeNode.name,
							relativeNode.top,
							relativeNode.left,
							relativeNode.width,
							relativeNode.height,
							relativeNode.height,
							relativeNode.id,
							node.img || self.config.baseImgUrl+self.randomImg()
						);
						node.refNode=refNode;
					}
					
					self.Me.append(result);
					node.branchDir=index%2==0?'right':'left';
					commonNode.data=node;
					self.NodeInfo[commonNode.id]=commonNode;
					self.LayoutTask.top=commonNode.top<self.LayoutTask.top?commonNode.top:self.LayoutTask.top;
					self.LayoutTask.left=commonNode.left<self.LayoutTask.left?commonNode.left:self.LayoutTask.left;
					
					node.branchLine=self.BuildLine(commonNode,node.branchDir=='right'?self.Direction.right:self.Direction.left,connectLen/2+self.config.linewidth/2);
				})
				
				return nodeInfo;
			}
			
		}else{
			var blnBtn=data.type && (data.type=='btn' || data.type=='relatedBtn')?true:false;
			nodeSize=blnBtn?self.BtnSize:self.NodeSize;
			//分支节点
			switch(referobj.type){
				case 'V'://竖线
					if(referobj.dir=='top'){
						//向上
						nodeInfo={
							id:id,
							type:blnBtn?'btn':'node',
							kind:data.btnType || 'root',
							name:data.name,
							top:referobj.top-nodeSize.height,
							left:referobj.left-nodeSize.width/2+referobj.width/2,
							width:nodeSize.width,
							height:nodeSize.height,
							parent:[],
							child:[]
						};
					}else{
						//向下
						nodeInfo={
							id:id,
							type:blnBtn?'btn':'node',
							kind:data.btnType || 'root',
							name:data.name,
							top:referobj.top+referobj.height,
							left:referobj.left-nodeSize.width/2+referobj.width/2,
							width:nodeSize.width,
							height:nodeSize.height,
							parent:[],
							child:[]
						};
					}
					break;
				case 'H'://横线
					if(referobj.dir=='left'){
						//向左
						nodeInfo={
							id:id,
							type:blnBtn?'btn':'node',
							kind:data.btnType || 'root',
							name:data.name,
							top:referobj.top+referobj.height/2-nodeSize.height/2,
							left:referobj.left-nodeSize.width,
							width:nodeSize.width,
							height:nodeSize.height,
							parent:[],
							child:[]
						};
					}else{
						//向右
						nodeInfo={
							id:id,
							type:blnBtn?'btn':'node',
							kind:data.btnType || 'root',
							name:data.name,
							top:referobj.top+referobj.height/2-nodeSize.height/2,
							left:referobj.left+referobj.width,
							width:nodeSize.width,
							height:nodeSize.height,
							parent:[],
							child:[]
						};
					}
					
					break;
			}

			if(!blnBtn){
				result+=Fx.format(self.Node,
					data.name,
					nodeInfo.top,
					nodeInfo.left,
					nodeInfo.width,
					nodeInfo.height,
					nodeInfo.height,
					id,
					data.img || self.config.baseImgUrl+self.randomImg(),
					'',
					data.sex==0?'#c5b27e':'#7EBEDC'
				);
			}else{
				result+=Fx.format(self.addBtn,
					data.name,
					nodeInfo.top,
					nodeInfo.left,
					nodeInfo.width,
					nodeInfo.height,
					nodeInfo.height,
					id
				);
			}
		}
		self.Me.append(result);
		nodeInfo.name=data.name;
		nodeInfo.path=path || [];
		nodeInfo.data=data;
		self.NodeInfo[nodeInfo.id]=nodeInfo;
		self.LayoutTask.top=nodeInfo.top<self.LayoutTask.top?nodeInfo.top:self.LayoutTask.top;
		self.LayoutTask.left=nodeInfo.left<self.LayoutTask.left?nodeInfo.left:self.LayoutTask.left;
		
		return nodeInfo;
	},
	addBtn:'<div id="{6}" class="addBtnPerson" name="addBtnPerson" style="top:{1}px;left:{2}px;width:{3}px;height:{4}px;line-height:{5}px;">{0}</div>',
	Node:'<div id="{6}" class="Node" style="top:{1}px;left:{2}px;width:{3}px;height:{4}px;line-height:{5}px;border-color:{9}"><div class="NodeContainer"><div class="img"><img src="{7}" /></div><div class="info">{0}</div><span class="closeBtn" name="closeBtn" style="{8}">X</span></div></div>',
	FriendList:'<div name="addPerson_scroll" style="max-height:300px;"><table class="table table-bordered  table-hover"><thead><tr><th class="text-center">姓名</th><th class="text-center">生日</th><th class="text-center">喜好</th></tr></thead><tbody>{0}</tbody></table></div>',
	ListItem:'<tr name="FriendItem" item-data="{3}"><td class="text-center">{0}</td><td class="text-center">{1}</td><td class="text-center">{2}</td></tr>'
});