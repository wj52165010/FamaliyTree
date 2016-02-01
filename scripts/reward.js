(function(){
	 $("#QQFace").jqfaceedit({txtAreaObj:$("#userInput"),containerObj:$('#showContent'),top:25,left:-27});
	 
	 $('#user_editer_container').pin();
	 
	 $('div[name="scroll"]').slimScroll({
		position: 'right',
		size:'8px'
	});
})();