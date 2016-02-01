(function(){
	var doms={
		'幻灯左键':$('div[name="left_btn"]'),
		'幻灯右键':$('div[name="right_btn"]'),
		'登陆':$('div[name="loginBtn"]')
	};
	
	//注册登陆单击事件
	doms.登陆.click(function(){
		var pageContent='<div style="height:100%;background-color:#D6F6AA;border-radius: 2px;padding:40px;">'+
										'<form class="form-horizontal">'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;">'+
											'	<div class="col-sm-8" style="float:none;margin:0px auto;">'+
											'	  <input type="text" class="form-control" style="height:44px;font-size:16px;border:1px solid #5B7438;line-height:34px;" placeholder="请输入邮箱账号或电话号码!">'+
											'	</div>'+
											'</div>'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;">'+
											'	<div class="col-sm-8" style="float:none;margin:0px auto;">'+
											'	  <input type="password" class="form-control" style="height:44px;font-size:16px;border:1px solid #5B7438;line-height:34px;" placeholder="输入密码!">'+
											'	  <input type="text" class="form-control" style="display:none;height:44px;font-size:16px;border:1px solid #5B7438;line-height:34px;" placeholder="输入密码!">'+
											'	</div>'+
											'</div>'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;">'+
												'<div class="col-sm-8" style="float:none;margin:0px auto;">'+
													'<input id="rememberPassword" type="radio" name="iCheck" /><span style="color:#4D6E28;margin-left:5px;">记住密码</span>'+
													'<div id="findPassword" style="float:right;color:#4D6E28;cursor:pointer;">找回密码</div>'+
												'</div>'+
											'</div>'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;text-align:center;">'+
												'<div class="col-sm-8" style="float:none;margin:0px auto;">'+
													'<div  class="loginBtn">登录</div>'+
												'</div>'+
											'</div>'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;text-align:center;border:1px solid #95AD73;"></div>'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;text-align:center;">'+
												'<div class="col-sm-8" style="float:none;margin:0px auto;">'+
												'<span id="register" style="color:#4D6E28;margin-left:5px;cursor:pointer;">去注册</span>'+
												'</div>'+
											'</div>'
										'</form>'+
								   '</div>';
		
		layer.open({
			type: 1,
			title: false,
			skin: 'layui-layer-demo', //样式类名
			area: ['500px', '400px'],
			closeBtn: 0, //不显示关闭按钮
			shift: 3,
			shadeClose: true, //开启遮罩关闭
			content:pageContent,
			success:function(layero, index){
				Fx.placeholder($(layero));//兼容IE(placeholder)
				//初始化单选框
				  $(layero).find('input[name="iCheck"]').iCheck({
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green'
				  });
				 //注册"去注册"按钮单击事件
				  $(layero).find('#register').click(function(){
					  layer.close(index);
					  registerPage();//打开注册页面
				  });
			}
		});
	});
	
	//注册页面
	var registerPage=function(){
		var pageContent='<div style="height:100%;background-color:#D6F6AA;border-radius: 2px;padding:40px;font-size:14px;">'+
										'<form class="form-horizontal">'+
											//手机号注册
											'<div style="float:left;width:40%;">'+
												'<span style="font-weight:600;">手机号注册</span>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="text" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="电话号码">'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'		<input type="text" class="form-control" style="width:60%;display:inline-block;height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="短信验证码">'+
												'		<span style="background-color: rgb(88, 127, 52);display: inline-block;float: right;padding: 7px 10px;color: white;border-radius: 2px;">点击获取</span>'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="text" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="昵称  建议使用真实姓名">'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="password" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="输入密码">'+
												'	  <input type="text" class="form-control" style="display:none;height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="输入密码">'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="password" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="确认密码">'+
												'	  <input type="text" class="form-control" style="display:none;height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="确认密码">'+
												'	</div>'+
												'</div>'+
											'</div>'+
											//邮箱注册
											'<div style="margin-left:60%;">'+
												'<span style="font-weight:600;">邮箱注册</span>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;max-height:54px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="text" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="邮箱注册">'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;max-height:54px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'		<input type="text" class="form-control" style="width:60%;display:inline-block;height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="短信验证码">'+
												'		<span style="background-color: rgb(88, 127, 52);display: inline-block;float: right;padding: 7px 10px;color: white;border-radius: 2px;">点击获取</span>'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;max-height:54px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="text" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="昵称  建议使用真实姓名">'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;max-height:54px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="password" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="输入密码">'+
												'	  <input type="text" class="form-control" style="display:none;height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="输入密码">'+
												'	</div>'+
												'</div>'+
												'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;max-height:54px;">'+
												'	<div class="col-sm-12" style="float:none;margin:0px auto;margin-top:20px;padding:0px;">'+
												'	  <input type="password" class="form-control" style="height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="确认密码">'+
												'	  <input type="text" class="form-control" style="display:none;height:34px;font-size:14px;border:1px solid #5B7438;line-height:20px;" placeholder="确认密码">'+
												'	</div>'+
												'</div>'+
											'</div>'+
											'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;text-align:center;">'+
													'<div class="col-sm-8" style="float:none;margin:0px auto;">'+
														'<div  id="addressPage" class="loginBtn" style="padding:5px 20px;">下一步</div>'+
													'</div>'+
											'</div>'+
										'</form>'+
									'</div>';
		
		layer.open({
			type: 1,
			title: false,
			skin: 'layui-layer-demo', //样式类名
			area: ['700px', '420px'],
			closeBtn: 0, //不显示关闭按钮
			shift: 3,
			shadeClose: true, //开启遮罩关闭
			content:pageContent,
			success:function(layero, index){
				Fx.placeholder($(layero));//兼容IE(placeholder)
				
				//注册"下一步"按钮单击事件
				$(layero).find('#addressPage').click(function(){
					layer.close(index);
					addressPage();//打开地址页面
				});
			}
		});
	};
	
	//地址页面
	var addressPage=function(){
		var pageContent='<div style="height:100%;background-color:#D6F6AA;border-radius: 2px;padding:40px;font-size:14px;color:#719145;">'+
										'<div style="float:left;width:70%;">'+
										'<form class="form-horizontal">'+
										'<div style="font-weight:600;">昵称:</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
										'	<div class="col-sm-12" style="margin:0px auto;margin-top:5px;padding:0px;">'+
										'	  <input type="text" class="form-control" style="width:100px;height:30px;font-size:14px;border:1px solid #5B7438;line-height:14px;" placeholder="昵称">'+
										'	</div>'+
										'</div>'+
										'<div style="font-weight:600;margin-top:5px;">性别:</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;">'+
										'	<div class="col-sm-12" style="margin:0px auto;margin-top:5px;padding:0px;">'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">男</option>'+
										'  			<option value="0" >女</option>'+
										'		</select>'+
										'	</div>'+
										'</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;margin-top:10px;">'+
										'	<label class="col-sm-2 control-label" style="padding-top:10px;text-align:left;padding-left:0px;">出&nbsp;生&nbsp;年&nbsp;月&nbsp;:</label>'+
										'	<div class="col-sm-10" style="display:inline-block;margin:0px auto;margin-top:5px;padding:0px;">'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'	</div>'+
										'</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;margin-top:10px;padding-left:0px;">'+
										'	<label class="col-sm-2 control-label" style="padding-top:10px;text-align:left;padding-left:0px;">出&nbsp;&nbsp;&nbsp;生&nbsp;&nbsp;&nbsp;地&nbsp;:</label>'+
										'	<div class="col-sm-10" style="display:inline-block;margin:0px auto;margin-top:5px;padding:0px;">'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'	</div>'+
										'</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;margin-top:10px;">'+
										'	<label class="col-sm-2 control-label" style="padding-top:10px;min-width:90px;"></label>'+
										'	<div class="col-sm-10" style="display:inline-block;margin:0px auto;margin-top:5px;padding:0px;">'+
										'	或在&nbsp;&nbsp;<span style="color:white;padding:3px 5px;background-color:#6E924B;">地图</span>&nbsp;&nbsp;上定位'+
										'	</div>'+
										'</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;margin-top:10px;">'+
										'	<label class="col-sm-2 control-label" style="padding-top:10px;text-align:left;padding-left:0px;">现&nbsp;&nbsp;&nbsp;居&nbsp;&nbsp;&nbsp;地&nbsp;:</label>'+
										'	<div class="col-sm-10" style="display:inline-block;margin:0px auto;margin-top:5px;padding:0px;">'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'		<select  name="select" style="width:100px;">'+
										' 			<option value="1">1986</option>'+
										'  			<option value="0" >1987</option>'+
										'		</select>'+
										'	</div>'+
										'</div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-bottom:0px;margin-top:10px;">'+
										'	<label class="col-sm-2 control-label" style="padding-top:10px;min-width:90px;"></label>'+
										'	<div class="col-sm-10" style="display:inline-block;margin:0px auto;margin-top:5px;padding:0px;">'+
										'	或在&nbsp;&nbsp;<span style="color:white;padding:3px 5px;background-color:#6E924B;">地图</span>&nbsp;&nbsp;上定位'+
										'	</div>'+
										'</div>'+
										'</form>'+
										'</div>'+
										'<div style="margin-left"70%;>'+
										'</div>'+
										'<div style="clear:both;"></div>'+
										'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;text-align:center;">'+
												'<div class="col-sm-12" style="margin:0px auto;">'+
													'<div  id="relevantPage" class="loginBtn" style="padding:5px 20px;">下一步</div>'+
												'</div>'+
										'</div>'+
									'</div>';
		
		layer.open({
			type: 1,
			title: false,
			skin: 'layui-layer-demo', //样式类名
			area: ['860px', '450px'],
			closeBtn: 0, //不显示关闭按钮
			shift: 4,
			zIndex:100,
			shadeClose: true, //开启遮罩关闭
			content:pageContent,
			success:function(layero, index){
				Fx.placeholder($(layero));//兼容IE(placeholder)
				
				//初始化下拉框
				$('select[name="select"]').select2({
					minimumResultsForSearch:'Infinity'
				});
				
				//注册"下一步"单击事件
				$(layero).find('#relevantPage').click(function(){
					layer.close(index);
					relevantPage();//打开相关人员页面
				});
			}
		});
	};
	
	//相关人员页面
	var relevantPage=function(){
		var pageContent='<div style="height:100%;background-color:#D6F6AA;border-radius: 2px;padding:40px;font-size:14px;color:#719145;">'+
									'	<div><span>来自相同出生地的人</span><div style="margin:0px 10px;display:inline-block;width:370px;border-bottom:1px solid #90AA70;"></div><input id="borthAddressAll" type="checkbox" name="iCheck" /><span style="margin-left:5px;">全选</span><span id="borthAddressChange" style="margin-left:5px;cursor:pointer;">换一换</span></div>'+
									'	<div id="sameBorthAddress" style="min-height:160px;">'+
									'	</div>'+
									'	<div><span>来自相同现居地的人</span><div style="margin:0px 10px;display:inline-block;width:370px;border-bottom:1px solid #90AA70;"></div><input id="sameAddressAll" type="checkbox" name="iCheck" /><span style="margin-left:5px;">全选</span><span id="sameAddressChange" style="margin-left:5px;cursor:pointer;">换一换</span></div>'+
									'	<div id="sameAddress" style="min-height:80px;">'+
									'	</div>'+
									'<div class="form-group" style="margin-left:0px;margin-right:0px;margin-top:30px;text-align:center;">'+
												'<div class="col-sm-12" style="margin:0px auto;">'+
													'<div  id="save" class="loginBtn" style="padding:5px 20px;">保存进站</div>'+
												'</div>'+
									'</div>'+
									'</div>';
		
		layer.open({
			type: 1,
			title: false,
			skin: 'layui-layer-demo', //样式类名
			area: ['700px', '420px'],
			closeBtn: 0, //不显示关闭按钮
			shift: 2,
			zIndex:100,
			shadeClose: true, //开启遮罩关闭
			content:pageContent,
			success:function(layero, index){
				Fx.placeholder($(layero));//兼容IE(placeholder)
				//初始化复选框
				  $(layero).find('input[name="iCheck"]').iCheck({
					checkboxClass: 'icheckbox_square-green',
					radioClass: 'iradio_square-green'
				  });
				
				//注册"保存进站"单击事件
				$(layero).find('#save').click(function(){
					
				});
				
				//注册"来自相同出生地的人"全选按钮单击事件
				$(layero).find('#borthAddressAll').off('ifChanged');
				$(layero).find('#borthAddressAll').on('ifChanged', function(event){
					var blnSel=$(this).is(':checked');
					var checkBoxs=$(layero).find('div[name="checkBox"]');
					if(blnSel){
						checkBoxs.removeClass('checked');
						checkBoxs.attr('blnSel',0);
						checkBoxs.click();
					}else{
						checkBoxs.removeClass('checked');
						checkBoxs.attr('blnSel',0);
					}
				});
				
				//注册"来自相同出生地的人"换一换按钮单击事件
				$(layero).find('#borthAddressChange').off('click');
				$(layero).find('#borthAddressChange').on('click',function(){
					InitSameBorthAddress($(layero).find('div[id="sameBorthAddress"]'));
				});
				
				//注册"来自相同出生地的人"头像单击事件
				$(layero).off('off','div[name="borthAddress"]');
				$(layero).on('click','div[name="borthAddress"]',function(){
					var checkBox=$(this).find('div[name*="checkBox"]');//复选框
					var blnSel=parseInt(checkBox.attr('blnSel') || 0);
					if(blnSel==1){
						checkBox.attr('blnSel',0);
						checkBox.removeClass('checked');
					}else{
						checkBox.attr('blnSel',1);
						checkBox.addClass('checked');
					}
				});
				
				//注册"来自相同出生地的人"全选按钮单击事件
				$(layero).find('#sameAddressAll').off('ifChanged');
				$(layero).find('#sameAddressAll').on('ifChanged', function(event){
					var blnSel=$(this).is(':checked');
					var checkBoxs=$(layero).find('div[name="samecheckBox"]');
					if(blnSel){
						checkBoxs.removeClass('checked');
						checkBoxs.attr('blnSel',0);
						checkBoxs.click();
					}else{
						checkBoxs.removeClass('checked');
						checkBoxs.attr('blnSel',0);
					}
				});
				
				//注册"来自相同出生地的人"换一换按钮单击事件
				$(layero).find('#sameAddressChange').off('click');
				$(layero).find('#sameAddressChange').on('click',function(){
					InitSameAddress($(layero).find('div[id="sameAddress"]'));
				});
				
				//注册"来自相同出生地的人"头像单击事件
				$(layero).off('off','div[name="sameAddress"]');
				$(layero).on('click','div[name="sameAddress"]',function(){
					var checkBox=$(this).find('div[name*="samecheckBox"]');//复选框
					var blnSel=parseInt(checkBox.attr('blnSel') || 0);
					if(blnSel==1){
						checkBox.attr('blnSel',0);
						checkBox.removeClass('checked');
					}else{
						checkBox.attr('blnSel',1);
						checkBox.addClass('checked');
					}
				});
		
				
				//初始化“来自相同出生地的人”数据
				InitSameBorthAddress($(layero).find('div[id="sameBorthAddress"]'));
				//初始化“来自相同现居地的人”数据
				InitSameAddress($(layero).find('div[id="sameAddress"]'));
			}
		});
	};
	
	//初始化“来自相同出生地的人”数据
	var InitSameBorthAddress=function(container){
		var item='<div name="borthAddress" class="Persion_Avatar" style="display:none;">'+
					   '	<div class="avaterContainer">'+
					   '		<img class="avater" src="images/{0}" />'+
					   '		<div class="checkBox" name="checkBox"></div>'+
					   '	</div>'+
					   '	<div class="name">{1}</div>'+
					   '</div>';
		var jsondata=[
			{name:'昵称',icon:'avatar.png'},
			{name:'昵称',icon:'avatar.png'}
		];
		var result='';
		for(var i=0;i<jsondata.length;i++){
			result+=Fx.format(item,jsondata[i].icon,jsondata[i].name);
		}
		
		container.html('');
		container.html(result);
		
		//设置显示动画
		container.find('div[name="borthAddress"]').fadeIn();
	};
	
	//初始化“来自相同现居地的人”数据
	var InitSameAddress=function(container){
		var item='<div name="sameAddress" class="Persion_Avatar" style="display:none;">'+
					   '	<div class="avaterContainer">'+
					   '		<img class="avater" src="images/{0}" />'+
					   '		<div class="checkBox" name="samecheckBox"></div>'+
					   '	</div>'+
					   '	<div class="name">{1}</div>'+
					   '</div>';
		var jsondata=[
			{name:'昵称',icon:'avatar.png'},
			{name:'昵称',icon:'avatar.png'}
		];
		var result='';
		for(var i=0;i<jsondata.length;i++){
			result+=Fx.format(item,jsondata[i].icon,jsondata[i].name);
		}
		
		container.html('');
		container.html(result);
		
		//设置显示动画
		container.find('div[name="sameAddress"]').fadeIn();
	};
	
	
	//幻灯片动画函数
	var slider={
		curImgIndex:0,
		curImg:null,
		imgs:null,
		Init:function(imgs,leftBtn,rightBtn){
			var self=this;
			//默认显示第一张图片
			this.curImg=$(imgs[0]);
			this.curImg.fadeIn();
			this.imgs=imgs;
			this.curImgIndex=0;
			
			leftBtn.click(function(){
				if(self.curImgIndex==0){return;}
				//slider.animation($('.pluins_three')[0],'right',710);
				self.curImgIndex--;
				self.curImg.fadeOut();
				self.curImg=$(self.imgs[self.curImgIndex]);
				self.curImg.fadeIn();
				
			});
			
			rightBtn.click(function(){
				if(self.imgs.length==(self.curImgIndex+1)){return;}
				self.curImgIndex++;
				self.curImg.fadeOut();
				self.curImg=$(self.imgs[self.curImgIndex]);
				self.curImg.fadeIn();
			
			});
		},
		animation:function(dom,dire,distance){
			var self=this;
			this.Pos=dom;
			var wrapperTran= this.getWrapperTranslate();
			//this.SetWrapperTransition(0);
			switch(dire){
				case 'left':
					self.setWrapperTranslate(distance + wrapperTran.x, 0 + wrapperTran.y);
					break;
				case 'right':
					self.setWrapperTranslate(-distance, 0 + wrapperTran.y);
					break;
			}
		},
		Pos:null,//动画元素(非Juqery对象)
		/*
		 * 获取控件动画过度值
		 */
		getWrapperTranslate : function () {
			var el = this.Pos, matrix, curTransform, curStyle, transformMatrix, result = {x:0,y:0};
			 result.x = parseFloat(el.style.left, 10) || 0;
			 result.y = parseFloat(el.style.top, 10) || 0;

			result.x = result.x || 100;
			result.y = result.y || 100;

			return result;
		},
		/*
		 * 设置动画属性
		 */
		setWrapperTranslate : function (x, y, z) {
			var es = this.Pos.style,
				coords = { x: x, y: y, z: 0 },
				translate;

			if (arguments.length === 3) {
				coords.x = x;
				coords.y = y;
				coords.z = z;
			}

			this.esin(es,coords.x,this.Pos);
		},
		/*
		 * 设置动画转换率
		 */
		SetWrapperTransition: function (duration) {
			var self = this;
			var es = self.Pos.style;
			es.webkitTransitionDuration = es.MsTransitionDuration = es.msTransitionDuration = es.MozTransitionDuration = es.OTransitionDuration = es.transitionDuration = (duration / 1000) + 's';
		},
		esin:function(es,x,el){
		   var space=100;
		   var left=Fx.PxToInt(es.left || 100)
		   var blnAdd=x>0;
		   
		   var func=function(speed){
			   if(blnAdd){
				   x=(x-space)<0?0:(x-space);
			   }else{
				   x=(space+x)>0?0:(space+x);
			   }
			   setTimeout(function(){
					left=left+(blnAdd?space:-space);
					es.left = left + 'px';
					if(x!=0){
						func(speed+15);
					}else{
						es.left=100+'px';
						$(el).css('z-index');
					}
			   },speed);
		   };
		   
		   func(1);
		}
	};
	//初始化幻灯片
	slider.Init($('.pluins_three').find('img'),doms.幻灯左键,doms.幻灯右键);
})();