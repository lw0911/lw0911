/*
Powered by ly200.com		http://www.ly200.com
广州联雅网络科技有限公司		020-83226791

定义格式：提示语~格式|格式提示语*

其中*为可选，如果不定义，则允许为空
格式同样为可选项，格式列表如下：
1、数字f		数字后加f，如：3f，表示长度必须为3位
2、数字m		数字后加:，如：3m，表示长度必须为3位或3位以上
3、date		日期检测
4、=表单名称	检测当前表单的值是否为“表单名称”的值，通常用于确认密码检测
5、email		Email检测
6、mobile	大陆手机号码检测，不包含国际区码86，检测范围：130-139，150-153，155-159，180，185-189
7、tel		大陆电话号码检测，不包含国际区码86，格式如：020-83226791或02083226791

注：格式提示语可使用表单值，用{value}表示，如：请正确填写邮件地址！~email|您输入的值：{value}，这不是一个合法的邮件地址*
*/

var first_error_input=null;

function checkForm(fm){
	if($_('lib_div_mask') || $_('lib_pop_info_tips')){
		return false;
	}
	
	var error_info=new Array;
	var submit_button=null;
	first_error_input=null;
	
	for(var i=0; i<fm.length; i++){
		fm[i].type.toLowerCase()=='submit' && (submit_button=fm[i]);
		fm[i].className=fm[i].className.replace(' form_focus', '');
		
		var check=fm[i].getAttribute('check');
		if(check==null || check=='undefined'){
			continue;	//忽略未定义check的元素
		}
		
		var format_pos=check.lastIndexOf('~');
		if(format_pos<0){
			continue;
		}
		
		var tips=check.substring(0, format_pos);	//提示信息
		var format_str=check.substring(format_pos+1, check.length);	//格式要求
		
		if(format_str.charAt(format_str.length-1)=='*'){	//不允许为空
			var notNull=true;	//不允许为空
			var format=format_str.substring(0, format_str.length-1);	//格式
		}else{
			var notNull=false;	//允许为空
			var format=format_str.substring(0, format_str.length);	//格式
		}
		
		if(notNull==false && format==''){	//允许为空并且不需要格式检查
			continue;
		}
		
		var value=fm[i].value=trim(fm[i].value);	//内容去除空格
		if(value=='' && notNull){
			error_info[error_info.length]=tips;
			fm[i].className=fm[i].className+' form_focus';
			first_error_input==null && fm[i].type.toLowerCase()!='hidden' && (first_error_input=fm[i]);
			continue;
		}else if(format=='' || value==''){
			continue;
		}
		
		var format_need=format.substring(0, format.lastIndexOf('|'));
		var format_need_first_char=format_need.charAt(0);
		var format_need_last_char=format_need.charAt(format_need.length-1);
		var format_tips=format.substring(format.lastIndexOf('|')+1, format.length).replace('{value}', '<font class="fc_red">'+value+'</font>');
		(format_tips=='') && (format_tips=tips);
		
		if(format_need_last_char=='f' || format_need_last_char=='m'){	//以f或m结尾，可能是需要进行长度检查的
			var fromat_need_length=format_need.substring(0, format_need.length-1);
			if(!isNaN(fromat_need_length) && (format_need_last_char=='f' && value.length!=fromat_need_length) || (format_need_last_char=='m' && value.length<fromat_need_length)){
				error_info[error_info.length]=format_tips;
				fm[i].className=fm[i].className+' form_focus';
				first_error_input==null && fm[i].type.toLowerCase()!='hidden' && (first_error_input=fm[i]);
			}
		}else if(format_need=='date'){	//日期格式检查
			var found=value.match(/(\d{1,5})-(\d{1,2})-(\d{1,2})/);
			if(found!=null){
				var year=trim_0(found[1]);
				var month=trim_0(found[2])-1;
				var date=trim_0(found[3]);
				var d=new Date(year, month, date);
			}
			if(found==null || found[0]!=value || found[2]>12 || found[3]>31 || d.getFullYear()!=year || d.getMonth()!=month || d.getDate()!=date){
				error_info[error_info.length]=format_tips;
				fm[i].className=fm[i].className+' form_focus';
				first_error_input==null && fm[i].type.toLowerCase()!='hidden' && (first_error_input=fm[i]);
			}
		}else if((format_need_first_char=='=' && trim(fm[format_need.substring(1, format_need.length)].value)!=value) || (format_need=='email' && !/([\w][\w-\.]*@[\w][\w-_]*\.[\w][\w\.]+)/g.test(value)) || (format_need=='mobile' && !(/^13\d{9}$/g.test(value) || /^15[0-35-9]\d{8}$/g.test(value) || /^18[05-9]\d{8}$/g.test(value))) || (format_need=='tel' && !(/^\d{3,4}-{0,1}\d{7,8}$/g.test(value)))){	//检测是否与某字段的值相等，邮件格式检查，手机号码检测，电话号码检测
			error_info[error_info.length]=format_tips;
			fm[i].className=fm[i].className+' form_focus';
			first_error_input==null && fm[i].type.toLowerCase()!='hidden' && (first_error_input=fm[i]);
		}
	}
	
	if(error_info.length){
		pop_info_tips(error_info);
		return false;
	}else{
		submit_button!=null && (submit_button.disabled=true);
		return true;
	}
}

function trim(str){	//除去字符串变量两端的空格
	return str.replace(/^ */, '').replace(/ *$/, '');
}

function trim_0(str){	//除去字符串表示的数值变量开头的所有的0
	if(str.length==0){
		return str;
	}
	str=str.replace(/^0*/, '');
	str.length==0 && (str='0');
	return str;
}