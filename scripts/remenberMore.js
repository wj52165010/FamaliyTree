(function(){
	 $('#user_editer_container').pin();
	 
	 $('div[name="scroll"]').slimScroll({
		position: 'right',
		size:'8px'
	});
	
	var navs=$('span[name="NavBarItem"]');//������
	navs.click(function(){
		var page=$(this).attr('page');
		var items=$('div[class*="itemContent"]');
		items.hide();
		$(Fx.format('div[name="{0}"]',page)).show();
		navs.removeClass('navActive');
		$(this).addClass('navActive');
	});
	
	navs.eq(0).click();
	
	//��ʼ��������
	$('select[name="select"]').select2({
		minimumResultsForSearch:'Infinity'
	});
	
	//ע��"������ͬ�����ص���"ͷ�񵥻��¼�
	$('#sameBorthAddress').off('off','div[name="borthAddress"]');
	$('#sameBorthAddress').on('click','div[name="borthAddress"]',function(){
		var checkBox=$(this).find('div[name*="checkBox"]');//��ѡ��
		var blnSel=parseInt(checkBox.attr('blnSel') || 0);
		if(blnSel==1){
			checkBox.attr('blnSel',0);
			checkBox.removeClass('checked');
		}else{
			checkBox.attr('blnSel',1);
			checkBox.addClass('checked');
		}
	});
	
	//��ʼ��ȫѡ��
	  $('input[id="sameAddressCheck"]').iCheck({
		checkboxClass: 'icheckbox_square-green',
		radioClass: 'iradio_square-green'
	  });
	  
	  //ע��"������ͬ�����ص���"ȫѡ��ť�����¼�
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
	
	//ע���ѯ��ť�����¼�
	$('#searchBtn').click(function(){
		var commContainer=$('div[name="person_container"]');
		var searchContainer=$('div[name="person_search_container"');
		commContainer.hide();
		searchContainer.show();
	});
	
	//ע�᷵�ذ�ť�����¼�
	$('#goBackSearch').click(function(){
		var commContainer=$('div[name="person_container"]');
		var searchContainer=$('div[name="person_search_container"');
		commContainer.show();
		searchContainer.hide();
	});
})();