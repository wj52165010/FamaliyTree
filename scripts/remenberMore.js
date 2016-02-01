(function(){
	 $('#user_editer_container').pin();
	 
	 $('div[name="scroll"]').slimScroll({
		position: 'right',
		size:'8px'
	});
	
	var navs=$('span[name="NavBarItem"]');//导航项
	navs.click(function(){
		var page=$(this).attr('page');
		var items=$('div[class*="itemContent"]');
		items.hide();
		$(Fx.format('div[name="{0}"]',page)).show();
		navs.removeClass('navActive');
		$(this).addClass('navActive');
	});
	
	navs.eq(0).click();
	
	//初始化下拉框
	$('select[name="select"]').select2({
		minimumResultsForSearch:'Infinity'
	});
	
	//注册"来自相同出生地的人"头像单击事件
	$('#sameBorthAddress').off('off','div[name="borthAddress"]');
	$('#sameBorthAddress').on('click','div[name="borthAddress"]',function(){
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
	
	//初始化全选框
	  $('input[id="sameAddressCheck"]').iCheck({
		checkboxClass: 'icheckbox_square-green',
		radioClass: 'iradio_square-green'
	  });
	  
	  //注册"来自相同出生地的人"全选按钮单击事件
	$('#sameAddressCheck').off('ifChanged');
	$('#sameAddressCheck').on('ifChanged', function(event){
		var blnSel=$(this).is(':checked');
		var checkBoxs=$('#sameBorthAddress').find('div[name="checkBox"]');
		if(blnSel){
			checkBoxs.removeClass('checked');
			checkBoxs.attr('blnSel',0);
			checkBoxs.click();
		}else{
			checkBoxs.removeClass('checked');
			checkBoxs.attr('blnSel',0);
		}
	});
	
	//注册查询按钮单击事件
	$('#searchBtn').click(function(){
		var commContainer=$('div[name="person_container"]');
		var searchContainer=$('div[name="person_search_container"');
		commContainer.hide();
		searchContainer.show();
	});
	
	//注册返回按钮单击事件
	$('#goBackSearch').click(function(){
		var commContainer=$('div[name="person_container"]');
		var searchContainer=$('div[name="person_search_container"');
		commContainer.show();
		searchContainer.hide();
	});
})();