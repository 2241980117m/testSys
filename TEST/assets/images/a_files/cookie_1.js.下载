
setInterval(function(){
	sgetCookie();
},30*60*1000);

function sgetCookie(){
$.ajax({
	"type":"post",
	"url":$('#p_s_f_website_url').val()+"/pc/userinfo/update_sort",
	success:function(data){		
	}
})
}



$(window).unload(function()
		{
			sgetCookie();
		})














