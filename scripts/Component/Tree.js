Fx.define('TreeComp', {
    id: '',//唯一标示符
    clsPrix: 'TreeComp',//内容视图Class前缀(该前缀对应指定样式表中的样式)
	Me:null,
	Q:null,//全局异步链对象(用于判断树形结构是否完全加载完成)
	blnClose:false,
	NodeSize:{
		width:200,
		height:100
	},
	//节点信息
	NodeInfo:{},
	//布局任务(调整布局,避免出界后无法出现滚动条)
	LayoutTask:{
		top:0,//距上边距高度任务
		left:0,//距左边聚宽度任务
	},
	container:{
		width:0,
		height:0
	},
	Direction:{
		top:0,
		right:1,
		bottom:2,
		left:3
	},
	//水平对齐方式
	Halign:{
		center:0,
		left:1,
		right:2
	},
	packageData:null,//内部组装数据(用于内部构造树形结构)
    config: {
		//横线单位长度
		HlineUnit:120,
		VlineUnit:110,
		branchLineWidth:300,//分支线长度
		linewidth:4,
		Imgs:['1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg'],//随机头像集合
		baseImgUrl:'personImg/',//默认图片地址
		addFriend:function(){
			
		},
        data:[
			{name:'根节点',type:'root'}//,items:[
				//[{name:'1234'},{name:'3123'}],
				//{name:'父亲1',items:[
				//	[{name:'上节点',items:[[{id:105,name:'祖父'},{name:'祖母'}]]},{name:'右节点',items:[[{name:'外祖父'},{name:'外祖母'}]]},{name:'ghhfg1',items:[[{name:'123'},{name:'fdgdfg'}]]},{name:'dsfgdgfd2'},{name:'ghhfg3'},{name:'dsfgdgfd4'},{id:10,name:'ghhfg5',related:[11],items:[[{name:'1231'},{name:'fdgdf'}]]},{id:11,name:'dsfgdgfd6'}]
				//]},
				//{name:'朋友',blnPlace:true},
				//[{id:1,name:'wj210',related:[2],items:[[{id:101,name:'wj5216',items:[[{id:1001,name:'1235',items:[[{name:'自动添加'}]]}]]},{id:102,name:'456'}]]},{id:2,name:'234'},{name:'ghhfg'},{id:3,name:'测试',related:[4]},{id:4,name:'的发顺丰'},{id:5,name:'而无诶',related:[6]},{id:6,name:'结核杆菌'},{name:'符合规范'},{id:7,name:'而无诶',related:[8]},{id:8,name:'结核杆菌'}]
			//]},
			//{name:'123'}
		]
    },
    /* 
	 * 添加控件到指定元素中
	 * Tag:目标名称(如果是元素对象则为元素名字,如果是元素Class名则为'.Class名字',id跟Class名字相仿)
	 * kind:Tag组件样式1
	 */
    AppendTo: function (Tag, config) {
        config = config || {};
        var self = this;
        //初始化配置参数
        Fx.apply(this.config, config);
		
		//获取容器尺寸
		self.container.width=$(Tag).width();
		self.container.height=$(Tag).height();
		
        //清空浮动
        var clearFloat = '<div style="clear:both;"></div>';
		
        $(Tag).append(this.GetHtml() + clearFloat);
		
		self.Me=$(Tag).find(Fx.format('#{0}{1}',self.clsPrix,self.id));
		
		//重构数据
		self.RfreshNodes(self.config.data);
		
		//注册节点单机事件
		self.Me.on('click','div[class="Node"]',function(){
			var key=$(this).attr('id'),nodes=self.NodeInfo;
			var path=null;
			//$(this).remove();
		});
		
		//注册节点关闭按钮单击事件
		self.Me.on('click','span[name="closeBtn"]',function(){
			if(!self.blnClose){alert('树形正在生成中,请稍候...');return;}
			var key=$(this).parents('div[class="Node"]').attr('id'),nodes=self.NodeInfo;
			u.each(nodes,function(item,id){
				if(id==key){
					self.CascaDelNode(item);
				}
			});
		});
		
		//注册节点新增按钮单击事件
		self.Me.on('click','span[name="addBtn"]',function(){
			if(!self.blnClose){alert('树形正在生成中,请稍候...');return;}
			var key=$(this).parents('div[class="Node"]').attr('id'),nodes=self.NodeInfo;
			self.AddNodeForm(function(name,birthday,like,img){
				u.each(nodes,function(item,id){
					if(id==key){
						var optionData=item.data;
						if(item.data.refNode){
							optionData=item.data.refNode.obj;
						}
						self.HandleNodeData(self.packageData,optionData,'add',function(){
							self.RfreshNodes(self.packageData);
						},self.config.data,null,{name:name,img:img});
					}
				});
			});
		});
    },
    /* 
     * 获取列表Html
     */
    GetHtml: function () {
        var self = this;

        return Fx.format(self.Container,
			self.clsPrix + self.id, //容器唯一标识符
			self.clsPrix,//容器Class
			''
		);
    },
	//添加节点窗体
	AddNodeForm:function(clickFunc){
		var self=this;
		Fx.alert.LoadPageTip({
			title:'新增亲人',
			content:'',
			blnAutoCancel:false,
			style:{'font-size':'0.7em','width':'400px','color':'#d6fbe4'},
			headerStyle:{'background-color':'#6aa080','color':'#d6fbe4','font-weight':'600'},
			appendFunc:function(container,tipWindow,ctrl){
				container.html(self.AddRelative);
				//注册弹窗内容相关事件
				var nameCtrl=container.find('input[name="addRelative_name"]');//姓名元素
				var birthdayCtrl=container.find('input[name="addRelative_birthday"]');//生日元素
				var likeCtrl=container.find('input[name="addRelative_like"]');//喜好元素
				var confirmCtrl=container.find('button[name="addRelative_confirm"]');//确定按钮
				var addFriendCtrl=container.find('button[name="addFriendByList"]');//从好友中添加按钮
				var personImgCtrl=container.find('img[name="personImg"]');//个人图片元素
				//确定按钮
				confirmCtrl.click(function(){
					var data=eval('('+nameCtrl.attr('item-data')+')') || {};
					clickFunc(nameCtrl.val(),birthdayCtrl.val(),likeCtrl.val(),personImgCtrl.attr('src'),data);	
					ctrl.remove();
				});
				
				//注册从好友添加按钮单击事件
				addFriendCtrl.click(function(){
					self.config.addFriend.call(container,self);
				});
			}
		});
	},
	//重新加载节点数据
	RfreshNodes:function(data){
		var self=this;
		_Q=null;
		self.Q=null;
		self.NodeInfo={};
		self.blnClose=false;
		self.LayoutTask={left:0,top:0};
		//清楚原来的节点
		self.Me.html('');
		//重构数据
		var outResult=[];
		self.AdjustRelatePos(data,outResult);
		//构建树
		self.Q=_Q=new u.Q(null,null,function(){
			self.adjustLayout();
			self.packageData=Fx.Clone(outResult);
			self.blnClose=true;
		});
		self.BuildTree(outResult,null,null,null,self.config.branchLineWidth);
		_Q.ok();
		
	},
	//级联删除节点元素(包含子节点/关联线)
	CascaDelNode:function(nodeInfo){
		var self=this,data=nodeInfo.data;
		self.HandleNodeData(self.packageData,data,'del',function(reuslt){
			self.RfreshNodes(self.packageData);
		},self.config.data);
		
		//u.each(path,function(line,index){
			//$('#'+line.id).remove();
		//});
	},
	//操作指定节点数据(新增/删除)
	//data:筛选数据集合
	//delData:需要删除/新增的数据对象
	//option:操作方式(add:'新增',del:'删除',update:'修改','replace':'替换')
	//callback:操作完成后执行的回调函数
	//parentsItem:父类数组项
	//arrIndex:嵌套数组中子数组在父数组的索引
	//optionData:操作数据(修改/)
	HandleNodeData:function(data,delData,option,callback,parentsItem,arrIndex,optionData){
		var self=this,key='id',child='items';
		u.each(data,function(item,index){
			if(item instanceof Array){
				//数组元素
				self.HandleNodeData(item,delData,option,callback,parentsItem,index,optionData);
			}else{
				//数据实体对象
				if(item[key]==delData[key]){
					switch(option){
						case 'del'://删除
							data.splice(index,1);
							data=data.length>0?data:undefined;
							if(!data && arrIndex>=0){parentsItem[child].splice(arrIndex,1)}
							if(!data && parentsItem[child] && parentsItem[child].length<=0){
								delete parentsItem[child];
							}
							break;
						case 'add'://新增
							var addItem={id:optionData.id || u.guid(),name:optionData.name || '无名',img:optionData.img || ''};
							item.items=delData.items || [[]];
							if(item.items instanceof Array && item.items.length==0){item.items.push([]);}
							if(item.items.length>=2 || (item.items.length==1 && !u.isArray(item.items[0]))){item.items.push(addItem);}
							if(item.items.length==1){item.items[0].push(addItem);}
							break;
						case 'update'://修改
							
							break;
						case 'replace'://替换
							data.splice(index,1,optionData);
							break;
					}
					if(callback)callback(data);
				}else{
					if(item.items && item.items.length>0){
						self.HandleNodeData(item.items,delData,option,callback,item,null,optionData);
					}
				}
			}
			
		});
	},
	//构建节点树
	BuildTree:function(data,node,path,parentRef,cBranchLineW){
		var self=this,result='',size=self.container,nodeSize=self.NodeSize;
		var nodeInfos=self.NodeInfo,dir=self.Direction,nodeInfo=null;
		var referNode=node; //参照节点
		var Q=new u.Q();
		var chain=Q;
		
		self.Q=self.Q.then(function(){
			Q.ok();
		});
	
		if(!referNode){
			//包含多个根节点(通常是相关联节点)
			if(data.length>1){
				nodeInfo=self.BuildNode(data);
				var nodeData=nodeInfo.data;
				var branchLine=nodeData.branchLine;
				//子节点
				if(nodeData.items && nodeData.items.length>0){
					for(var i=0;i<nodeData.items.length;i++){
						if(nodeData.items[i].blnPlace){continue;}
						chain =(function(Q,nodeInfo,i,item,self){return Q.then(function(){
							var lineDir=self.ensureLineDir(branchLine,i,item);
							if(lineDir==null){return;}
							var lineInfo= self.BuildLine(branchLine,lineDir,'',branchLine.dir=='right'?self.Halign.right:self.Halign.left);
							self.BuildTree(item,lineInfo,[lineInfo,branchLine],nodeInfo,cBranchLineW);
						})})(chain,nodeInfo,i,nodeData.items[i],self);
					}
				}
			}else{
				//起始节点
				nodeInfo=self.BuildNode(data[0]);
				//子节点
				if(data[0].items && data[0].items.length>0){
					for(var i=0;i<data[0].items.length;i++){
						if(data[0].items[i].blnPlace){continue;}
						chain =(function(Q,nodeInfo,i,item,self){return Q.then(function(){
							var lineDir=self.ensureLineDir(nodeInfo,i,item);
							if(lineDir==null){return;}
							var lineInfo= self.BuildLine(nodeInfo,lineDir);
							self.BuildTree(item,lineInfo,[lineInfo],nodeInfo,cBranchLineW);
						})})(chain,nodeInfo,i,data[0].items[i],self);
					}
				}
			}
		}else{
			//判断是否包含分支节点
			if(data instanceof Array){
				//多个分支节点
				self.BuildBranchLine(data,referNode,null,null,path,parentRef,null,null,cBranchLineW);
			}else{
				if(data.blnPlace){return;}
				//单个节点
				nodeInfo=self.BuildNode(data,referNode,path,parentRef);
				parentRef.child.push(nodeInfo);
				nodeInfo.parent.push(parentRef);
				
				//子节点
				if(data.items && data.items.length>0){
					for(var i=0;i<data.items.length;i++){
						if(data.items[i].blnPlace){continue;}
						chain =(function(Q,nodeInfo,i,item,self){return Q.then(function(){						
							var lineDir=self.ensureLineDir(nodeInfo,i,item);
							if(lineDir==null){return;}
							var lineInfo= self.BuildLine(nodeInfo,lineDir);
							self.BuildTree(item,lineInfo,[lineInfo],nodeInfo,cBranchLineW);
							
						})})(chain,nodeInfo,i,data.items[i],self);
					}
				}
			}
		}
	},
	//建立节点
	BuildNode:function(data,referobj,path){
		var self=this,result='',size=self.container,nodeSize=self.NodeSize;
		var nodeInfo={},result='',top=0,left=0;
		var relativeNode=null;
		var id=Fx.getGuidGenerator();
		if(!referobj){
			if(!u.isArray(data)){
				data.img =data.img!=''?self.config.baseImgUrl+data.img:'';
				//单个起始节点
				nodeInfo={
					id:id,
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
					data.img || self.config.baseImgUrl+self.randomImg()
				);
			}else{
				//多个起始节点(目前为2个起始节点)
				var commonNode=null;
				var refNode={obj:null};
				var connectLen=300;//两个节点连接线长度
				var wholeLen=nodeSize.width*2+connectLen;//2个节点连接后的整体长度
				var hasIdentity=false;
				u.each(data,function(node,index){
					node.img =node.img!=''?self.config.baseImgUrl+node.img:'';
					var hasChild=node.items && node.items.length>0;
					if(hasChild || (!hasIdentity && index%2>0)){
						hasIdentity=true;
						commonNode=nodeInfo={
							id:u.guid(),
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
			data.img =data.img!=''?self.config.baseImgUrl+node.img:'';
			//分支节点
			switch(referobj.type){
				case 'V'://竖线
					if(referobj.dir=='top'){
						//向上
						nodeInfo={
							id:id,
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
							name:data.name,
							top:referobj.top-referobj.height/2-nodeSize.height/2,
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
							name:data.name,
							top:referobj.top-referobj.height/2-nodeSize.height/2,
							left:referobj.left+referobj.width,
							width:nodeSize.width,
							height:nodeSize.height,
							parent:[],
							child:[]
						};
					}
					
					break;
			}
			result+=Fx.format(self.Node,
				data.name,
				nodeInfo.top,
				nodeInfo.left,
				nodeInfo.width,
				nodeInfo.height,
				nodeInfo.height,
				id,
				data.img || self.config.baseImgUrl+self.randomImg()
			);
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
	//计算关联节点节点连线的长度(留给子类重写)
	CountRelatedLineLength:function(nodeData,rawLength,nodesize){
		return rawLength;
	},
	//判断是否采用制定线为分支基线(留给子类重写)
	DecideBaseLine:function(nodeData,oriLine,baseLine){
		return oriLine;
	},
	//建立分支节点线(包含其节点以及子节点)
	//dir:(left/right)
	BuildBranchLine:function(data,referobj,dir,length,path,parentRef,blnReverse,preDir,cBranchLineW){
		var self=this,top=0,left=0,result='',lineInfo,linewidth=self.config.linewidth,hlu=self.config.HlineUnit,vlu=self.config.VlineUnit,nodesize=self.NodeSize,nodeInfo;
		var nextDir='';
		var id=Fx.getGuidGenerator();
		var Q=new u.Q();
		var chain=Q;
		var branchLineWidth=self.config.branchLineWidth;//分支线宽度
		var extraWidth=300;//分支线额外的宽度
		var deWidth=(cBranchLineW-100)+extraWidth>=(nodesize.width+50)?(cBranchLineW-100):(nodesize.width+50-extraWidth);//字节点距离递减距离
		var connectLineLength=(branchLineWidth-nodesize.width)/2;//关联节点间的连接线长度
		
		self.Q=self.Q.then(function(){
			Q.ok();
		});
		//设置分支线

		if(!(data.length==1 && data[0].singleNode)){
			var branchLineInfo=self.ProduceBranchLine(referobj,dir,length,blnReverse,preDir,false,data.singleNode);
			lineInfo=branchLineInfo.lineInfo;
			result=branchLineInfo.html;
			nextDir=branchLineInfo.nextDir;
			
			if(data.length>1 && (referobj.dir=='top' || referobj.dir=='bottom')){
				lineInfo=referobj;
			}else{
				self.Me.append(result);
				self.NodeInfo[id]=lineInfo;
				self.LayoutTask.top=lineInfo.top<self.LayoutTask.top?lineInfo.top:self.LayoutTask.top;
				self.LayoutTask.left=lineInfo.left<self.LayoutTask.left?lineInfo.left:self.LayoutTask.left;
				path.push(lineInfo);
			}
		}else{
			lineInfo=referobj;
		}
		var lBaseLine=lineInfo;//左边基线
		var rBaseLine=lineInfo;//右边基线
		var lblnFirst=false;
		var lblnSecond=false;
		var rblnFirst=false;
		var rblnSecond=false;
		var lpreLineLength=branchLineWidth/2;//前面参照线的长度
		var rpreLineLength=branchLineWidth/2;//前面参照线的长度
		
		for(var i=0;i<data.length;i++){
			chain =(function(data,i,self,lineInfo,nextDir,hlu,Q){
				return Q.then(function(){
					if(data.length==1){
						//构造节点
						var nodeData=data[i];
						var refObj= self.BuildBranchLine(data[i],lineInfo,nextDir,hlu/2,path);
						if(self.ensureNode(refObj)){
							refObj= self.BuildBranchLine(data[i],lineInfo,nextDir,hlu/2,path);
						}
						nodeInfo=self.BuildNode(data[i],refObj,path);
						parentRef.child.push(nodeInfo);
						nodeInfo.parent.push(parentRef);
						
						var relateLine;
						if(nodeData.branchDir && nodeData.blnBranch.contain){
							switch(nodeData.branchDir){
								case 'right': //右
									var rConnectLine=self.BuildLine(nodeInfo,self.Direction.right,self.CountRelatedLineLength(nodeData,connectLineLength,self.NodeSize));
									relateLine=nodeData.items && nodeData.items.length>0?rConnectLine:null;
									relateLine=self.DecideBaseLine(nodeData,relateLine,rConnectLine);//判断是否该线为分支基线
									break;
								case 'left': //左
									var lConnectLine=self.BuildLine(nodeInfo,self.Direction.left,self.CountRelatedLineLength(nodeData,connectLineLength,self.NodeSize));
									relateLine=nodeData.items && nodeData.items.length>0?lConnectLine:null;
									relateLine=self.DecideBaseLine(nodeData,relateLine,lConnectLine);//判断是否该线为分支基线
									break;
							}
						}
						
						if(nodeData.items && nodeData.items.length>0){
							for(var j=0;j<nodeData.items.length;j++){
								if(nodeData.items[j].blnPlace){continue;}
								var lineDir=self.ensureLineDir(relateLine || nodeInfo,2);
								if(lineDir==null){return;}
								
								var chirldLineInfo= self.BuildLine(relateLine || nodeInfo,lineDir,'',relateLine && relateLine.dir=='left'?self.Halign.left:relateLine && relateLine.dir=='right'?self.Halign.right:self.Halign.center);
								var selfPath=[chirldLineInfo];
								if(relateLine){selfPath.unshift(relateLine)}
								self.BuildTree(nodeData.items[j],chirldLineInfo,selfPath,nodeInfo,cBranchLineW);
							}
						}
					}else{
						//构造分支
						switch(i){
							case 0:
								var newPath=Fx.Clone(path);
								self.BuildBranchLine([data[i]],lineInfo,null,branchLineWidth/2,newPath,parentRef,false,null,deWidth);
								break;
							case 1:
								var newPath=Fx.Clone(path);
								self.BuildBranchLine([data[i]],lineInfo,'right',branchLineWidth/2,newPath,parentRef,false,null,deWidth);
								break;
						}
						//分支节点超过3个的情况下
						var branLineLenth=deWidth+extraWidth;
						if(data[i].order && data[i].order=='f'){
							//第一个分支节点
							branLineLenth=2*branLineLenth-branchLineWidth;
						}else if(data[i].order && data[i].order=='s'){
							//第二个分支节点
							branLineLenth=branchLineWidth;
						}
						
						if(i>1 && ((i%2==0 && !data[i].stretchDir) || data[i].stretchDir=='left')){
							var hLine=self.ProduceBranchLine(lBaseLine,null,lpreLineLength,lblnFirst,lBaseLine.dir,lblnSecond);
							var refLine=self.ProduceBranchLine(hLine.lineInfo,hLine.nextDir,hlu/2);
							var newPath=Fx.Clone(path);

							self.BuildBranchLine([data[i]],refLine.lineInfo,null,branLineLenth,newPath,parentRef,true,refLine.nextDir,deWidth);
							lBaseLine=refLine.lineInfo;
							lblnFirst=lBaseLine.dir=='top'?false:true;
							lblnSecond=true;
							lpreLineLength=branLineLenth;
							
						}else if(i>1 && ((i%2==1 && !data[i].stretchDir) || data[i].stretchDir=='right')){
							var hLine=self.ProduceBranchLine(rBaseLine,'right',rpreLineLength,rblnFirst,lBaseLine.dir,rblnSecond);
							var refLine=self.ProduceBranchLine(hLine.lineInfo,hLine.nextDir,hlu/2);
							var newPath=Fx.Clone(path);
							self.BuildBranchLine([data[i]],refLine.lineInfo,'right',branLineLenth,newPath,parentRef,true,refLine.nextDir,deWidth);
							rBaseLine=refLine.lineInfo;
							rblnFirst=lBaseLine.dir=='top'?false:true;
							rblnSecond=true;
							rpreLineLength=branLineLenth;
						}
					}
				});
			})(data,i,self,lineInfo,nextDir,hlu,chain);
		}
		
		return lineInfo;
	},
	//额外迭代处理(留给子类接入)
	ExtraIterHandle:function(item){
		return item;
	},
	//调整数据中关联数据位置
	AdjustRelatePos:function(data,outResult,parent){
		var self=this;
		var relateArr=[];//关联数组对象
		var noRelateArr=[];//非关联数组对象
		u.each(data,function(item,index){
			var sortArr=[];
			item=Fx.Clone(item);
			if(item instanceof Array){
				var relateArrGroup=[];
				u.each(item,function(childItem,childIndex){
					if(childItem.related){
						relateArr.push(childItem);
					}
				});
				
				u.each(relateArr,function(relateItem,index){
					var cloneArr=Fx.Clone(item);
					var stretchDir=index%2==0?'left':'right'; //关联节点摆放方向
					relateItem=self.ExtraIterHandle(relateItem,parent);
					var containBranch={contain:relateItem.items && relateItem.items.length>0};//是否包含分支线(判断是否包含子节点)
					relateItem.blnBranch=containBranch;
					var arr = u.find(cloneArr,relateItem.related,function(a,b){
						if(this==a.id){
							//匹配的元素
							a=self.ExtraIterHandle(a,parent);
							a.blnBranch=containBranch;
							a.blnBranch.contain=a.blnBranch.contain || (a.items && a.items.length>0);
						}
						return this==a.id;
					});
					arr.push(relateItem);
					relateArrGroup.push(arr);
					
					u.each(arr,function(arrItem,index){
						Fx.DelItemByArr(item,arrItem,'id');
						arrItem.stretchDir=stretchDir;
						arrItem.branchDir=index%2?stretchDir:stretchDir=='left'?'right':'left';
						arrItem.branchDir=relateArrGroup.length>1?arrItem.branchDir=='left'?'right':'left':arrItem.branchDir;					
						arrItem.order=index==0?'f':'s';//关联节点顺序(f:第一个节点;s:第二个节点)
						
						
						if(arrItem.items && arrItem.items.length){
							var items=Fx.Clone(arrItem.items);
							self.SingleNodeId(items);//设置单个节点标识
							arrItem.items=[];
							self.AdjustRelatePos(items,arrItem.items,arrItem);
						}
						
						arrItem.id=arrItem.id || u.guid();
						sortArr.push(arrItem);
					});			
				});
				
				u.each(item,function(remainItem,index){
					remainItem.id=remainItem.id || u.guid();
					sortArr.push(self.ExtraIterHandle(remainItem,parent));
					if(remainItem.items && remainItem.items.length){
						var remainItems=Fx.Clone(remainItem.items);
						self.SingleNodeId(remainItems);//设置单个节点标识
						remainItem.items=[];
						self.AdjustRelatePos(remainItems,remainItem.items,remainItem);
					}
				});
							
				outResult.push(sortArr);
				
			}else{
				item.id= item.id || u.guid();
				outResult.push(self.ExtraIterHandle(item,parent));
				if(item.items && item.items.length>0){
					var items=Fx.Clone(item.items);
					self.SingleNodeId(items);//设置单个节点标识
					item.items=[];
					self.AdjustRelatePos(items,item.items,item);
				}
			}
		});
	},
	//设置单个节点标识
	SingleNodeId:function(items){
		if(items.length==1 && u.isArray(items[0]) && items[0].length==1 && u.isObject(items[0][0])){
			items[0][0].singleNode=true;
		}else{
			if(u.isArray(items) && items.length==1 && u.isArray(items[0])){items=items[0];}
			u.each(items,function(itemChild,index){
				if(u.isObject(itemChild)){delete itemChild.singleNode;}
			});
		}
	},
	//产生分支节点线信息
	ProduceBranchLine:function(referobj,dir,length,blnReverse,preDir,blnSecond,blnSameDir){
		var self=this,top=0,left=0,result='',lineInfo,linewidth=self.config.linewidth,hlu=self.config.HlineUnit,vlu=self.config.VlineUnit;
		var nextDir=dir!='top'?'bottom':'top';
		var id=Fx.getGuidGenerator();
		if(blnReverse){
			referobj=Fx.Clone(referobj);
			referobj.dir=referobj.dir=='top'?'bottom':'top';
		}
		
		switch(referobj.dir){
			case 'top':
				if(!blnSameDir){	
					nextDir=blnReverse?'bottom':'top';
					left=dir=='right'?referobj.left:referobj.left-(length || hlu);
					top=blnReverse?referobj.top-linewidth:referobj.top;
					if(preDir=='top'){top=referobj.top+(blnReverse?referobj.height:hlu/2)+(blnSecond?0:linewidth);}
					result=self.strHline(top,left,length,id);
					
					lineInfo={
						id:id,
						type:'H',
						dir:dir || 'left',
						left:left,
						top:top,
						height:linewidth,
						width:length || hlu
					};
				}else{
					nextDir='top';
					left=referobj.left;
					top=referobj.top-(length || vlu);
					result=self.strVline(top,left,length,id);
					lineInfo={
						id:id,
						type:'V',
						dir:'top',
						left:left,
						top:top,
						height:length || hlu,
						width:linewidth
					};
				}
				break;
			case 'right':
				top=nextDir=='bottom'?referobj.top+referobj.height:referobj.top-(length || vlu);
				left=referobj.left+referobj.width-linewidth;
				result=self.strVline(top,left,length,id);
				
				lineInfo={
					id:id,
					type:'V',
					dir:nextDir,
					left:left,
					top:top,
					height:length || vlu,
					width:linewidth
				};
				break;
			case 'bottom':
				if(!blnSameDir){
					nextDir=blnReverse?'top':'bottom';
					left=dir=='right'?referobj.left:referobj.left-(length || hlu);
					if(blnSameDir){}
					top=blnReverse?referobj.top-linewidth:referobj.top+referobj.height;
					result=self.strHline(top,left,length,id);
					
					lineInfo={
						id:id,
						type:'H',
						dir:dir || 'left',
						left:left,
						top:top,
						height:linewidth,
						width:length || hlu
					};
				}else{
					left=referobj.left;
					top=referobj.top+referobj.height;
					result=self.strVline(top,left,length,id);
					lineInfo={
						id:id,
						type:'V',
						dir:'bottom',
						left:left,
						top:top,
						height:length || hlu,
						width:linewidth
					};
				}
				break;
			case 'left':
				top=nextDir=='bottom'?referobj.top+referobj.height:referobj.top-(length || vlu);
				left=referobj.left;
				result=self.strVline(top,left,length,id);
				
				lineInfo={
					id:id,
					type:'V',
					dir:nextDir,
					left:left,
					top:top,
					height:length || vlu,
					width:linewidth
				};
				break;
		}
		
		return {
			lineInfo:lineInfo,
			html:result,
			nextDir:nextDir
		};
	},
	//建立线
	//nodeInfo:节点信息
	//dir:方向(上,右,下,左)
	//length:线的长度
	//Halign:水平对齐方式
	BuildLine:function(nodeInfo,dir,length,Halign){
		var self=this;
		var line=self.ProduceLine(nodeInfo,dir,length,Halign);//产生线信息
		var result=line.html;
		var lineInfo=line.info;
		
		self.Me.append(result);
		self.NodeInfo[lineInfo.id]=lineInfo;
		self.LayoutTask.top=lineInfo.top<self.LayoutTask.top?lineInfo.top:self.LayoutTask.top;
		self.LayoutTask.left=lineInfo.left<self.LayoutTask.left?lineInfo.left:self.LayoutTask.left;
		return lineInfo;
	},
	//产生线信息
	//nodeInfo:节点信息
	//dir:方向(上,右,下,左)
	//length:线长度
	//Halign:水平对齐方式
	ProduceLine:function(nodeInfo,dir,length,Halign){
		var self=this,left=0,top=0,linewidth=self.config.linewidth,hlu=self.config.HlineUnit,vlu=self.config.VlineUnit,halign=self.Halign;
		var result='';
		var lineInfo=null;
		var id=Fx.getGuidGenerator();
		Halign=Halign || halign.center;//默认布局方式(水平居中)
		switch(dir){
			case self.Direction.top:
				switch(Halign){
					case halign.center:
						left=nodeInfo.left+nodeInfo.width/2-linewidth/2;
						break;
					case halign.left:
						left=nodeInfo.left;
						break;
					case halign.right:
						left=nodeInfo.left+nodeInfo.width-linewidth;
						break;
				}
				top=nodeInfo.top-vlu;
				result=self.strVline(top,left,length,id);
				
				lineInfo={
					id:id,
					type:'V',
					dir:'top',
					left:left,
					top:top,
					height:vlu,
					width:linewidth
				};
				break;
			case self.Direction.right:
				left=nodeInfo.left+nodeInfo.width;
				top=nodeInfo.top+nodeInfo.height/2-linewidth/2;
				result=self.strHline(top,left,length,id);
				
				lineInfo={
					id:id,
					type:'H',
					dir:'right',
					left:left,
					top:top,
					height:linewidth,
					width:length || hlu
				};
				break;
			case self.Direction.bottom:
				switch(Halign){
					case halign.center:
						left=nodeInfo.left+nodeInfo.width/2-linewidth/2;
						break;
					case halign.left:
						left=nodeInfo.left;
						break;
					case halign.right:
						left=nodeInfo.left+nodeInfo.width-linewidth;
						break;
				}
				
				top=top=nodeInfo.top+nodeInfo.height;
				result=self.strVline(top,left,length,id);
				
				lineInfo={
					id:id,
					type:'V',
					dir:'bottom',
					left:left,
					top:top,
					height:vlu,
					width:linewidth
				};
				break;
			case self.Direction.left:
				left=nodeInfo.left-(length || hlu);
				top=top=nodeInfo.top+nodeInfo.height/2-linewidth/2;
				result=self.strHline(top,left,length,id);
				
				lineInfo={
					id:id,
					type:'H',
					dir:'left',
					left:left,
					top:top,
					height:linewidth,
					width:length || hlu
				};
				break;
		}
		
		return {
			html:result,
			info:lineInfo
		};
	},
	//判断线的方向
	//referObj:参照对象
	//preDir:准备设置的方向
	ensureLineDir:function(referObj,preDir,data){
		var self=this,dir=self.Direction,nodeInfo=self.NodeInfo,
			  preLine=self.ProduceLine(referObj,preDir).info,
			  virLineTop=self.ProduceLine(referObj,dir.top).info,
			  virLineRight=self.ProduceLine(referObj,dir.right).info,
			  virLineBottom=self.ProduceLine(referObj,dir.bottom).info,
			  virLineLeft=self.ProduceLine(referObj,dir.left).info,
			  lines=[preLine,virLineTop,virLineRight,virLineBottom,virLineLeft];
		var dirResult='';
		var cLine=lines.shift();
		var cFunc=function(){
			u.each(nodeInfo,function(item,key){
				if(key!=referObj.id && self.blnInterse(cLine,item) || self.ensureNode(cLine,data)==true){
					 cLine=lines.shift();
					if(!cLine){return false;}
					cFunc();
					return false;
				}
			});
		};
		
		cFunc();
		
		return cLine?dir[cLine.dir]:null;
	},
	//判断节点是否重叠
	ensureNode:function(referobj,flag){
		var self=this,result='',size=self.container,nodeSize=self.NodeSize,nodes=self.NodeInfo;
		var nodeInfo={},result='',top=0,left=0;
		var id=Fx.getGuidGenerator();
		switch(referobj.type){
			case 'V'://竖线
				if(referobj.dir=='top'){
					//向上
					nodeInfo={
						id:id,
						top:referobj.top-nodeSize.height,
						left:referobj.left-nodeSize.width/2+referobj.width/2,
						width:nodeSize.width,
						height:nodeSize.height
					};
				}else{
					//向下
					nodeInfo={
						id:id,
						top:referobj.top+referobj.height,
						left:referobj.left-nodeSize.width/2+referobj.width/2,
						width:nodeSize.width,
						height:nodeSize.height
					};
				}
				break;
			case 'H'://横线
				if(referobj.dir=='left'){
					//向左
					nodeInfo={
						id:id,
						top:referobj.top-referobj.height/2-nodeSize.height/2,
						left:referobj.left-nodeSize.width,
						width:nodeSize.width,
						height:nodeSize.height
					};
				}else{
					//向右
					nodeInfo={
						id:id,
						top:referobj.top-referobj.height/2-nodeSize.height/2,
						left:referobj.left+referobj.width,
						width:nodeSize.width,
						height:nodeSize.height
					};
				}
				break;
		}
		
		//是否重叠
		var blnInterse=false;
		u.each(nodes,function(item,key){
			blnInterse=self.blnInterse(nodeInfo,item,flag);
			if(blnInterse){return false;}
		});
		
		return blnInterse;
	},
	//判断两个对象是否相互交集
	blnInterse:function(c1,c2,data){
		if(!c1){return false;}
		var result=false;
		if((c1.top<=c2.top && (c1.top+c1.height)>c2.top) && (c1.left<=c2.left && (c1.left+c1.width)>c2.left)){
			result=true;
		}
		if((c1.top<=c2.top && (c1.top+c1.height)>c2.top) && (c1.left>c2.left && c1.left<(c2.left+c2.width))){
			result=true;
		}
		if((c1.top>c2.top && c1.top<(c2.top+c2.height)) && (c1.left<=c2.left && (c1.left+c1.width)>c2.left)){
			result=true;
		}
		if((c1.top>c2.top && c1.top<(c2.top+c2.height)) && (c1.left>c2.left && c1.left<(c2.left+c2.width))){
			result=true;
		}
		
		return result;
	},
	//构造横线
	strHline:function(top,left,length,id){
		var self=this,hlu=self.config.HlineUnit,linewidth=self.config.linewidth;
		var result='';
		
		result=Fx.format(self.Hline,length || hlu,linewidth,top,left,id);
		return result;
	},
	//构造竖线
	strVline:function(top,left,length,id){
		var self=this,vlu=self.config.VlineUnit,linewidth=self.config.linewidth;
		var result='';
		
		result=Fx.format(self.Vline,length || vlu,linewidth,top,left,id);
		return result;
	},
	//调整布局
	adjustLayout:function(){
		var layoutTask=this.LayoutTask,nodeInfo=this.NodeInfo;
		for(var key in nodeInfo){
			var item=nodeInfo[key];
			item.top-=layoutTask.top;
			$('#'+item.id).css('top',item.top+'px');
			
			item.left-=layoutTask.left;
			$('#'+item.id).css('left',item.left+'px');
		}
	},
	//生成随机图片
	randomImg:function(){
		var self=this,imgs=self.config.Imgs,imgLen=imgs.length;
		var imgIndex=Math.floor(Math.random()*imgLen);
		
		return imgs[imgIndex];
	},
	Container:'<div id="{0}" class="{1}">{2}</div>',
	Node:'<div id="{6}" class="Node" style="top:{1}px;left:{2}px;width:{3}px;height:{4}px;line-height:{5}px;"><div class="NodeContainer"><div class="img"><img src="{7}" /></div><div class="info">{0}</div><span class="closeBtn" name="closeBtn">X</span><span class="addBtn" name="addBtn">+</span></div></div>',
	//横线
	Hline:'<div id="{4}" class="Hline" style="width:{0}px;height:{1}px;top:{2}px;left:{3}px;"></div>',
	//竖线
	Vline:'<div id="{4}" class="Vline" style="height:{0}px;width:{1}px;top:{2}px;left:{3}px;"></div>',
	//新增亲人
	AddRelative:'<div class="addRelative">'+
							'<div class="left"><img name="personImg" src="images/avatar.png" /></div>'+
							'<div class="right">'+
								'<div class="item"><div class="halfInput"><span>姓名:</span><input name="addRelative_name" type="text" readonly="readonly" /></div><div class="addFriend"><button  type="button" name="addFriendByList" class="btn btn-primary btn-sm"><span class="btnName">+</span></button><span class="desc">从好友中添加</span></div></div>'+
								'<div class="item"><div class="halfInput"><span>生日:</span><input name="addRelative_birthday" type="text" readonly="readonly" /></div><div style="clear:both;"></div></div>'+
								'<div class="item"><div class="fullInput"><span>喜好:</span><input name="addRelative_like" type="text" readonly="readonly" /></div></div>'+
								'<div class="optionBar"><button name="addRelative_confirm" style="margin-right:20px;" type="button" class="btn btn-primary btn-sm">确定</button><button  type="button" class="btn btn-primary btn-sm" style="display:none;">查找</button></div>'+
							'</div>'+
					  '</div>'
});