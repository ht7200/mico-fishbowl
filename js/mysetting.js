//打开找回密码页面
function open_personPage()
{
	openWin("person", "widget://html/person.html", true,null);
}

//打开找回配网页面
function open_easylinkPage()
{
	openWin("easylink", "widget://html/easylink.html", true,null);
}
//打开找回已绑定设备页面
function open_bindlistreadPage()
{
	openWin("peripherals", "widget://html/peripherals.html", true,null);
}

//打开帮助中心页面
function open_helpcenterPage()
{
	openWin("peripherals", "widget://html/helpcenter.html", true,null);
}

//打开关于我们页面
function open_aboutusPage()
{
	openWin("peripherals", "widget://html/aboutus.html", true,null);
}

function loginoutOp()
{
	localStorage.removeItem(_UID);
	localStorage.removeItem(_TOKEN);
	openWin("login", "widget://html/login.html", true);

}
