/*
Powered by ly200.com		http://www.ly200.com
广州联雅网络科技有限公司		020-83226791
*/

var doc=document.documentElement || document.body;
var isIe=(document.all)?true:false;
var ie_version;
if(isIe){
	var version=navigator.appVersion.split(';');
	var trim_version=version[1].replace(/[ ]/g, '');
	if(trim_version=='MSIE7.0'){
		ie_version=7;
	}else if(trim_version=='MSIE6.0'){
		ie_version=6;
	}
}

try{document.execCommand('BackgroundImageCache', false, true);}catch(e){};

function $_(obj){
	return document.getElementById(obj)?document.getElementById(obj):'';
}

function set_number(obj, float){
	p=float==1?/[^\d-.]/g:/[^\d]/g;
	obj.value=obj.value.replace(p, '');
}

function product_review_show_star(v){
	for(i=1; i<=5; i++){
		$_('rating_'+i).src='/images/lib/product/x1.jpg';
	}
	for(i=1; i<=v; i++){
		$_('rating_'+i).src='/images/lib/product/x0.jpg';
	}
}

function div_mask(){
	var div_mask=document.createElement('div');
	div_mask.setAttribute('id', 'div_mask');
	div_mask.style.cssText='width:100%; height:100%; z-index:10000; background-color:#000; filter:alpha(opacity=40); opacity:0.4; -moz-opacity:0.4; left:0px; top:0px; position:fixed;';
	/*div_mask.style.height=(doc.scrollHeight>doc.clientHeight?doc.scrollHeight:doc.clientHeight)+'px';
	div_mask.style.width=doc.scrollWidth+'px';*/
	document.body.appendChild(div_mask);
}

function pop_info_tips(tips){	//弹出信息
	if(!is_array(tips)){
		if(tips!='' && tips!=undefined){
			tips=tips.split('|');	//如果提交过来的数据不是数组，则用|分割
		}else{
			return;
		}
	}else if(tips.length==0){
		return;
	}
	div_mask();
	var info='';
	var e=clear_repeat(tips);
	for(var i=0; i<e.length; i++){
		info+='&#8226; '+e[i]+'<br />';
	}
	var pop_info_tips=document.createElement('div');
	pop_info_tips.setAttribute('id', 'pop_info_tips');
	pop_info_tips.style.cssText='position:absolute; z-index:10001; border:4px solid #333; background:#fff; left:0px; top:0px; max-width:550px; width:90%;';
	pop_info_tips.innerHTML='\
		<div style="height:25px; line-height:25px; background:#f1f1f1; font-size:14px; font-weight:bold; text-indent:8px; color:#FF6600;">'+Ly200JsLang._windows._tips+'</div>\
		<div style="padding:8px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td style="font-size:14px; line-height:150%; height:50px;" valign="top">'+info+'</td></tr></table></div>\
		<div style="height:34px; padding-right:6px; background:#ccc; text-align:right;"><a href="javascript:void(0);" onclick="close_pop_info_tips();" style="display:block; float:right; border:1px solid #000; width:72px; height:20px; line-height:21px; text-align:center; background:#eee; font-weight:bold; color:#333; margin-top:6px; text-decoration:none;">'+Ly200JsLang._windows._close+'</a></div>';
	document.body.appendChild(pop_info_tips);
	scroll_pop_info_tips();	//先马上执行一次，要不看起来会在左上角飞到中间来
	scroll_pop_info_tips_timer=setInterval('scroll_pop_info_tips()', 50);
	$_('pop_info_tips').focus();
	$_('pop_info_tips').blur();
	
	document.onkeyup=function(evt){
		evt=evt||event;
		key=evt.keyCode||evt.which||evt.charCode;
		key==27 && close_pop_info_tips();
	}
}

function scroll_pop_info_tips(){	//弹出框跟随滚动
	$_('pop_info_tips').style.left=(document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft)+doc.clientWidth/2-$_('pop_info_tips').offsetWidth/2+'px';
	$_('pop_info_tips').style.top=(document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)+doc.clientHeight/2-$_('pop_info_tips').offsetHeight/2+'px';
}

function close_pop_info_tips(){	//关闭弹出窗口
	(typeof first_error_input!='undefined' && first_error_input!=null) && first_error_input.focus();
	document.body.removeChild($_('div_mask'));
	document.body.removeChild($_('pop_info_tips'));
	document.onkeyup=null;
	clearInterval(scroll_pop_info_tips_timer);
}

function clear_repeat(array){   	//清除数组重复项
	for(var i=0; i<array.length; i++){
		for(var j=i+1; j<array.length; j++){
			if(array[j]===array[i]){
				array.splice(j, 1);
				j--;
			}
		}
	}
	return array;
}

function is_array(data){
	if(typeof data=='object' && typeof data.sort=='function' && typeof data.length=='number'){
		return true;
	}else{
		return false;
	}
}

function data_posting(display){
	if(display){
		var data_posting=document.createElement('div');
		data_posting.setAttribute('id', 'data_posting');
		data_posting.style.cssText='position:absolute; z-index:10000; height:24px; line-height:24px; padding:0 8px; background:#ddd; border:1px solid #bbb; width:170px; left:0; top:0;';
		data_posting.innerHTML='<img src="/images/lib/global/data_posting.gif" width="16" height="16" align="absmiddle" />&nbsp;&nbsp;Processing, please wait...';
		
		document.body.appendChild(data_posting);
		data_posting.style.left=(document.documentElement.scrollLeft || window.pageXOffset || document.body.scrollLeft)+document.documentElement.clientWidth/2-data_posting.offsetWidth/2+'px';
		data_posting.style.top=(document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop)+document.documentElement.clientHeight/2-data_posting.offsetHeight/2-80+'px';
	}else{
		setTimeout('if($_("data_posting")){document.body.removeChild($_("data_posting"));};', 300);
	}
}

function request_data(){
	var axc=false;
	if(window.XMLHttpRequest){	//Mozilla浏览器
		axc=new XMLHttpRequest();
		(axc.overrideMimeType) && (axc.overrideMimeType('text/xml'));	//设置MiME类别
	}else if(window.ActiveXObject){	//IE浏览器
		try{
			axc=new ActiveXObject('Msxml3.XMLHTTP');
		}catch(e){ 
			try{ 
				axc=new ActiveXObject('Msxml2.XMLHTTP'); 
			}catch(e){
				try{
					axc=new ActiveXObject('Microsoft.XMLHTTP');
				}catch(e){}
			}
		}
	}
	return axc;
}