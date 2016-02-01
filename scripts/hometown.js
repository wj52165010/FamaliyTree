(function(){	 
	 $('#user_editer_container').pin();
	 
	 $('div[name="scroll"]').slimScroll({
		position: 'right',
		size:'8px'
	});
	
	$('select[name="select"]').select2({
		minimumResultsForSearch:'Infinity'
	});
})();