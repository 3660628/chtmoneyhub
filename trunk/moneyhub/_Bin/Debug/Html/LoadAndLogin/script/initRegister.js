﻿function initRegisterEffect(){
    var inputDom = [{"name"         : Hub.dom.getById("register-mail"), 
					 "color"        : "#C3C3C3", 
					 "over"         : "images/input2.png", 
					 "out"          : "images/input.png",
					 "deflautValue" : "请输入您常用的邮箱地址"},
	                {"name"         : Hub.dom.getById("register-password-name"), 
			         "color"        : "#C3C3C3", 
				     "over"         : "images/input2.png", 
				     "out"          : "images/input.png",
					 "deflautValue" : "6-20字符（数字、字母、符号）"},
					{"name"         : Hub.dom.getById("register-password"), 
			         "color"        : "#C3C3C3", 
				     "over"         : "images/input2.png", 
				     "out"          : "images/input.png",
					 "deflautValue" : ""},
					{"name"         : Hub.dom.getById("register-password-agname"), 
			         "color"        : "#C3C3C3", 
				     "over"         : "images/input2.png", 
				     "out"          : "images/input.png",
					 "deflautValue" : "再输入一次密码以确认无误"},
					{"name"         : Hub.dom.getById("register-password-again"), 
			         "color"        : "#C3C3C3", 
				     "over"         : "images/input2.png", 
				     "out"          : "images/input.png",
					 "deflautValue" : ""}],
	    bgX = 3,
		bgY = 3;
		
	Hub.effect.loginCheck("register-checkbox");
	
	for (var i in inputDom){//input
	    Hub.effect.init(inputDom[i], bgX, bgY);
		Hub.effect.inputEffect(inputDom[i].name);
	}
	
	Hub.register.addRegisterEvent();
}

function initLoginEffect(){
    var inputDom = [{"name"         : Hub.dom.getById("login-mail"), 
					 "color"        : "#C3C3C3", 
					 "over"         : "images/input2.png", 
					 "out"          : "images/input.png",
					 "deflautValue" : "请输入邮箱地址"},
	                {"name"         : Hub.dom.getById("login-password-name"), 
			         "color"        : "#C3C3C3", 
				     "over"         : "images/input2.png", 
				     "out"          : "images/input.png",
					 "deflautValue" : "请输入密码"},
					{"name"         : Hub.dom.getById("login-password"), 
			         "color"        : "#C3C3C3", 
				     "over"         : "images/input2.png", 
				     "out"          : "images/input.png",
					 "deflautValue" : ""}],
		iconDom = Hub.dom.getById("registered-icon"),
	    bgX = 3,
		bgY = 3;
	for (var i in inputDom){//input
	    Hub.effect.init(inputDom[i], bgX, bgY);
		Hub.effect.inputEffect(inputDom[i].name);
	}
	
	Hub.effect.loginCheck("login-checkbox");
	Hub.effect.iconInputEffect(iconDom);	
	
	Hub.login.addLoginEvent();
}

/*取得本地用户信息*/
function getAccountMsg(){
    var result = [];
    try{
	    result = eval("(" + window.external.QuerySQL("select userid as id, mail as name from datUserInfo", "DataDB") + ")");
		if (!result instanceof Array) return false;
	}catch(e){
	    //TODO
	}
	return result;
}


function init(){
    var wrapEL = {
	    "register-wrap"        : Hub.dom.getById("register-wrap"),
	    "login-wrap"           : Hub.dom.getById("login-wrap"),
	    "register-success"     : Hub.dom.getById("register-success"),
        "login-to-register"    : Hub.dom.getById("login-to-register"),	
		"visitors"             : Hub.dom.getById("visitors"),
		"ask-visitors"         : Hub.dom.getById("ask-visitors"),
		"login-mail-immediate" : Hub.dom.getById("login-mail-immediate")
	}

    wrapEL["ask-visitors"].onclick = function(){
        wrapEL["register-wrap"].style.display = "none";
	    wrapEL["login-wrap"].style.display = "block";
	    var id = Hub.selectOption.initOption(getAccountMsg(), Hub.dom.getById("login-mail"));
	    Hub.selectOption.eventOption(Hub.dom.getById("registered-icon"), "click", id, "show");
        initLoginEffect();
		Hub.register.changeTitle("登录财金汇");
    }
	wrapEL["login-mail-immediate"].onclick = function(){
	    wrapEL["register-success"].style.display = "none";
		wrapEL["login-wrap"].style.display = "block";
		var id = Hub.selectOption.initOption(getAccountMsg(), Hub.dom.getById("login-mail"));
	    Hub.selectOption.eventOption(Hub.dom.getById("registered-icon"), "click", id, "show");
		initLoginEffect();
		Hub.register.changeTitle("登录财金汇");
	}
	wrapEL["login-to-register"].onclick = function(){
        wrapEL["login-wrap"].style.display = "none";
	    wrapEL["register-wrap"].style.display = "block";
		Hub.register.changeTitle("注册财金汇");
		window.location.reload();
    }
	wrapEL["visitors"].onclick = function(){//使用访客身份登录
	    try{
		   window.external.AutoDialog("load", "false");
		}catch(e){
		  //TODO
		}
	}
    initRegisterEffect();
}

window.onload = init;

