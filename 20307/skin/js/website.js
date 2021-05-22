window.moveHeader = function(ScrollTop){
	var Header = $('#header');
	ScrollTop > 200 ? Header.addClass('on') : Header.removeClass('on');
};
window.showTopBtn = function(ScrollTop){
	var toTop = $('#toTop');
	ScrollTop > 200 ? toTop.addClass('on') : toTop.removeClass('on');
};

function toTop(){
	var Top = $('#toTop');
	$('html,body').animate({scrollTop:0},500);
}

function NotCopy(){
	$('body').on('copy',function(){return false;});
}

function ScrollShow(Obj,Repeat,Callbacks){          //对象滚动到浏览器可视区域时执行回调函数
    if(Obj.length){
        Obj.each(function(i,e){
            var Site = $(e).offset(),
                Height = $(e).outerHeight(true),
                WinTop = $(this).scrollTop(),         //滚动条位置
                WinHeight = $(this).height(),      //窗口高度
                WinArea = WinTop+WinHeight,        //浏览器可视区域
                IsRepeat = Repeat === true ? true : false,      //重复执行
                Switch = true;                                  //开关

            $(window).scroll(function(){
                Site = $(e).offset();
                Height = $(e).outerHeight(true);
                WinTop = $(this).scrollTop();
                WinHeight = $(this).height();
                WinArea = WinTop+WinHeight;
                //document.title = parseInt(Site.top)+' '+WinArea+' | '+parseInt(Height+Site.top)+' '+WinTop;
                if(Site.top <= WinArea && (Height+Site.top) >= WinTop && Switch){
                    $.isFunction(Callbacks) && Callbacks();
                    Switch = false;
                }else{
                    if(IsRepeat === true && Switch === false){
                        Switch = true
                    }
                }
            });
        });
    }
    return;
}

function ShowCountUp(Obj){          //元素进入浏览器可视区域后运行数值变化
    var Demos = SetCountUp(Obj);
    ScrollShow(Obj,false,function(){
        for(i = 0; i < Demos.length; i++){
            Demos[i].start();
        }
    });
}

function SetCountUp(Obj){      //设置数值变化     Obj:对象需要拥有ID
    var Demo = [],
        DefauitOptions = {
            useEasing : false,
            useGrouping : true,
            separator : '',
            decimal : '.',
            prefix : '',
            suffix : ''
        };

    Obj.each(function(i,e){
        if(jQuery(e).attr('id') != undefined){
            var Id = jQuery(e).attr('id'),
                Start = jQuery(e).attr('data-start'),
                End = jQuery(e).attr('data-end'),
                Decimals = jQuery(e).attr('data-decimals'),
                Duration = jQuery(e).attr('data-duration'),
                useEasing = jQuery(e).attr('data-useEasing'),
                useGrouping = jQuery(e).attr('data-useGrouping'),
                separator = jQuery(e).attr('data-separator'),
                decimal = jQuery(e).attr('data-decimal'),
                prefix = jQuery(e).attr('data-prefix'),
                suffix = jQuery(e).attr('data-suffix'),
                Options = {
                    useEasing : useEasing != undefined ? useEasing : DefauitOptions.useEasing,
                    useGrouping : useGrouping != undefined ? useGrouping : DefauitOptions.useGrouping,
                    separator : separator != undefined ? separator : DefauitOptions.separator,
                    decimal : decimal != undefined ? decimal : DefauitOptions.decimal,
                    prefix : prefix != undefined ? prefix : DefauitOptions.prefix,
                    suffix : suffix != undefined ? suffix : DefauitOptions.suffix
                };

            Demo[i] = new CountUp(Id, Start, End, Decimals, Duration, Options);
        }
    });

    return Demo;
}

function AjaxLoadList(){
    var PageData = $('.page-data');
    PageData.each(function(i,e){
        var Name = $(e).attr('name'),
            Page = $(e).attr('page'),
            Max = $(e).attr('max'),
            Where = $(e).attr('where'),
            List = $('#'+Name),
            Switch = true,
            Path = $(e).attr('path');

        ScrollShow($(e),true,function(){
            if(Page && Path && Switch && Max && Where && List.length && Max>Page){
                Switch = false;
                $(e).addClass('loading');
                setTimeout(function(){
                    Page++;
                    $.get(Path,{page:Page,where:Where},function(Data){
                        if(Data){
                        	if(List.hasClass('masonry')){
                        		var $L = $(Data);
                                $L.imagesLoaded(function(){
                                    List.append($L).masonry('appended', $L);
                                });
                        	}else{
                        		List.append(Data);
                        	}
                            Switch = true;
                        }
                        $(e).removeClass('loading');
                    });
                },500);
            }
        });
    });

    return false;
}

var PhoneMenu = {
	Menu : $('#menu'),
	Btn : $('#menu-btn'),
	Item : $('.nav-item',this.Menu),
	SubNav : $('.sub-nav',this.Item),
	SubTitle : $('.sub-title',this.SubNav),
	Close : $('.menu-close',this.Menu),
	TriggerWidth : 992,
	OpenClass : 'open-menu',
	checkWidth : function(){
		return window.innerWidth < this.TriggerWidth;
	},
	slideMenu : function(Action){
		if(Action){
			this.Menu.addClass(this.OpenClass);
			$('html,body,#header,#website').addClass(this.OpenClass);
		}else{
			this.Item.removeClass('on');
			this.SubNav.removeClass('open');
			this.Menu.removeClass(this.OpenClass);
			$('html,body,#header,#website').removeClass(this.OpenClass);
		}
	},
	slideSub : function(Action,Sub){
		if(Action){
			Sub.addClass('open');
			Sub.parents('.nav-item').addClass('on');
			this.Menu.animate({scrollTop:0},300);
		}else{
			Sub.removeClass('open')
			Sub.parents('.nav-item').removeClass('on');
		}
	},
	Running : function(){
		var thisObj = this;
		thisObj.Btn.click(function(){ if(thisObj.checkWidth()){ thisObj.slideMenu(true) } });
		thisObj.Close.click(function(){ if(thisObj.checkWidth()){ thisObj.slideMenu(false) } });
		thisObj.Item.find('.item-a').click(function(){
			if(thisObj.checkWidth()){
				var Sub = $(this).next(thisObj.SubNav);
				if(Sub.length){	//有二级导航
					thisObj.slideSub(true,Sub);
					return false;	//阻止链接跳转页面
				}
			}
		});
		thisObj.SubTitle.click(function(){ if(thisObj.checkWidth()){ thisObj.slideSub(false,$(this).parent()); } });
	}
}

$(window).scroll(function(){
	var ScrollTop = $(this).scrollTop();
	window.moveHeader(ScrollTop);
	window.showTopBtn(ScrollTop);
});

$(function(){
	ShowCountUp($('.CountUp'));
	AjaxLoadList();
	PhoneMenu.Running();

	var banner_swiper = new Swiper('.banner', {
		touchEventsTarget: 'wrapper',
		spaceBetween: 0,
		prevButton: '.banner .prev',
		nextButton: '.banner .next',
		onInit:function(swiper){
			var active = swiper.slides[swiper.activeIndex],
				color = $(active).attr('color');
			$('#header').attr('color',color);
		},
		onSlideChangeStart: function(swiper){
			var active = swiper.slides[swiper.activeIndex],
				color = $(active).attr('color');
			$('#header').attr('color',color);
		}
	});

	var team_swiper = new Swiper('.index-item .box', {
		touchEventsTarget: 'wrapper',
		spaceBetween: 80,
		prevButton: '.index-item .prev',
		nextButton: '.index-item .next'
	});

	var links_swiper = new Swiper('.links .box', {
		touchEventsTarget: 'wrapper',
		slidesPerView: 8,
		spaceBetween: 0,
		prevButton: '.links .prev',
		nextButton: '.links .next',
		breakpoints: {
			992: {
				slidesPerView: 4
			},
			640: {
				slidesPerView: 3
			},
			480: {
				slidesPerView: 2
			}
		}
	});

	$('.products-list').imagesLoaded(function(){
		$('.products-list.masonry').masonry({
			gutter: 20,
			itemSelector: '.item'
		});

		$('.similar-list.masonry').masonry({
			gutter: 10,
			itemSelector: '.item'
		});
	});
});