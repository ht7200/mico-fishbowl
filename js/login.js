//打开注册页面
function open_registerPage() {
	openWin("register", "widget://html/register.html", true,null);
}
//打开找回密码页面
function open_findkeybackPage() {
	openWin("findkeyback", "widget://html/findkeyback.html", true,null);
}

//用户登录
function loginOp() {

	//从页面获取登录账号密码
	var login_name = document.getElementById('input_account');
	var login_pwd = document.getElementById('input_password');

	//检测手机号码和密码的合法性
	//	if(check_phone_number(login_name.value) == false)
	//			return false;

	if(login_name.value.length == 0 ||
		login_pwd.value.length == 0) {
		msg("账号/密码不能为空");
		return false;
	}

	if(monitor_net() == "none") {
		return false;
	}
	
	api.showProgress({
		animationType: 'zoom',
		title: '正在登录...'
	});
	gizWifiSDK.userLogin({
		userName: login_name.value,
		password: login_pwd.value
	}, function(ret, err) {
		api.hideProgress();
		if(ret) {
			localStorage.setItem(_USERNAME, login_name.value);
			localStorage.setItem(_PASSWORD, login_pwd.value);
			localStorage.setItem(_UID, ret.uid);
			localStorage.setItem(_TOKEN, ret.token);
			msg("登录成功");
			closeWin('login');
		} else {
			localStorage.removeItem(_USERNAME);
			localStorage.removeItem(_PASSWORD);
			localStorage.removeItem(_UID);
			localStorage.removeItem(_TOKEN);
			login_pwd.value = '';
			msg("登录失败");
		}
	})
}


//读取存储在本地的用户名和密码,填充到输入框中
function get_storage_data() {
	var phone_num = localStorage.getItem(_USERNAME);
	var passwd = localStorage.getItem(_PASSWORD);

	if(phone_num != null)
		document.getElementById('input_account').value = phone_num;

	if(passwd != null)
		document.getElementById('input_password').value = passwd;
}

//退出登录
function quit_login() {
	mui.confirm("确定要退出当前账号吗？", "退出提示", ["确定", "取消"], function(ret) {
		if(ret.index == 0) {
			localStorage.removeItem(_TOKEN);
			openWin("login", "widget://html/login.html", true,null);
		}
	});
}