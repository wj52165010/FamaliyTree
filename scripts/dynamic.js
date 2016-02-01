(function(){
	 $('span[name="QQFace"]').jqfaceedit({txtAreaObj:$("#userInput"),containerObj:$('#showContent'),top:25,left:-27});
	 
	 $('#user_editer_container').pin();
	 
	 Fx.placeholder($('body'));//兼容IE(placeholder)
	 
	 $('div[name="scroll"]').slimScroll({
		position: 'right',
		size:'8px'
	});
	
	//公开按钮单击事件
	$('#publicOpen').click(function(){
		
	});
	
	$('#c_title').mouseover(function(){
		$('#c_comber').show();
	});
	$('#c_comber').mouseleave(function(){
		$(this).hide();
	});
	
	//视频单击事件
	$('#video_btn').click(function(){
		$('#video_pop').show();
	});
	
	//视频弹出成关闭按钮单击事件
	$('#video_closeBtn').click(function(){
		$('#video_pop').hide();
	});
	
	//本地视频单击事件
	$('#LocalVideo').click(function(){
		$('#video_address').show();
		$('#video_closeBtn').click();
	});
	
	//视频地址关闭按钮单击事件
	$('#videoAddress_closeBtn').click(function(){
		$('#video_address').hide();
	});
	
	$('select[name="select"]').select2({
		minimumResultsForSearch:'Infinity'
	});
	
	//注册评论按钮单击事件
	$('span[name="commentBtn"]').click(function(){
		var container=$(this).parents('div[class="message"]');
		var showLogo=container.find('span[class="showLogo"]');
		var commentsBar=container.find('div[class="commentsBar"]');
		
		commentsBar.show();
		showLogo.show();
	});
	
	//收起按钮单击事件
	$('span[name="packupbtn"]').click(function(){
		var container=$(this).parents('div[class="message"]');
		var showLogo=container.find('span[class="showLogo"]');
		var commentsBar=container.find('div[class="commentsBar"]');
		
		commentsBar.hide();
		showLogo.hide();
	});
	
	//转发按钮单击事件
	$('div[name="transmitBtn"]').click(function(){
		var pageContent='<div id="transmitPop" style="background:#f3fbf0;width:100%;height:100%;border-radius: 5px;">'+
								   '	<div style="padding:10px;border-bottom:1px solid #a0a0a0;color:#4f6f2e;"><span>转发</span><div style="text-align:right;float: right;cursor:pointer;"><span id="transmitCloseBtn">X</span></div></div>'+
								   '	<div style="padding:10px;">'+
								   '		<div style="color:gray;">@被转发昵称</div>'+
								   '		<div style="border:1px solid #4c6f2f;height:100px;background:white;">'+
								   '		<textarea id="transmitTextArea" style="width: 100%;height:80px;border:none;resize:none;">随便说说</textarea>'+
								   '		<div style="text-align:right;color:gray;">0/200</div>'+
								   '		</div>'+
								   '	</div>'+
								   '	<div style="padding:0px 10px;"><span id="transmitQQFace" style="cursor:pointer;"><img src="../images/bq_03.png"></span><div style="float:right;"><div style="display:inline-block;margin-right:10px;cursor:pointer;" id="transmitPublic">公开<span class="caret"></span>'+
								   '	</div><div style="display:inline-block;"><div class="smallbtn"><img src="../images/an_03.png"><span>转发</span></div></div></div></div>'+
								   '</div>';
		
		layer.open({
			type: 1,
			zIndex:100,
			title: false,
			skin: 'layui-layer-demo', //样式类名
			area: ['500px', '220px'],
			closeBtn: 0, //不显示关闭按钮
			shift: 3,
			shadeClose: false, //开启遮罩关闭
			content:pageContent,
			success:function(layero, index){
				Fx.placeholder($(layero));//兼容IE(placeholder)
				//初始化QQ表情
				$('#transmitQQFace').jqfaceedit({txtAreaObj:$("#transmitTextArea"),containerObj:$('body'),top:25,left:-27});
				//关闭按钮单击事件
				$('#transmitCloseBtn').click(function(){
					layer.close(index);
				});
				
				//公开栏信息
				var publicHtml='<ul class="ulPop_comber" id="transmitUl" style="position: absolute;z-index:120;height: auto;display:block;top:{0}px;left:{1}px;">'+
									   '	<li>公开</li>'+
									   '	<li>好友及家族可见</li>'+
									   '	<li>仅自己可见</li>'+
									   '</ul>';
				//注册公开按钮单击事件
				$('#transmitPublic').click(function(){
					var offset=Fx.getOffset(this);
					var height=Fx.getHeight(this,true);
					$('body').append(Fx.format(publicHtml,offset.top+height,offset.left));
				});
				
				//注册弹出公开栏鼠标离开事件
				$('body').on('mouseleave','ul[class="ulPop_comber"]',function(){
					$(this).remove();
				});
			}
		});
		
	});
	
})();