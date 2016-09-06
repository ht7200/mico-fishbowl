var register_timer_id = null;

function back_login_html() {
	if(register_timer_id != null) {
		clearTimeout(register_timer_id);
	}

	closeWin("register");
}

//验证获取60秒倒计时
function settime(timer, button_id) {
	//获取验证码按钮对象节点
	var get_vercode_button = document.getElementById(button_id);

	if(timer > 0) {
		get_vercode_button.innerHTML = timer + "秒";
		timer--;
	} else {
		get_vercode_button.innerHTML = "获取验证码";
		//		get_vercode_button.disabled = false; //设置按钮有效
		document.getElementById(button_id).setAttribute("onclick", "getVerifyCode(30, this.id)");
		return true;
	}

	register_timer_id = setTimeout(function() { //每1000毫秒重新调用此方法
		settime(timer, button_id);
	}, 1000);
}

//获取验证码
function getVerifyCode(timer, button_id) {
	var register_name = document.getElementById("register_phone_num");
	var register_pw1 = document.getElementById('register_passwd1');
	var register_pw2 = document.getElementById('register_passwd2');
	
	if(register_name.value.length == 0) {
		msg("手机号码不能为空");
	}
	if(check_phone_number(register_name.value) == false) {
		register_name.value = "";
		register_pw1.value = "";
		register_pw2.value = "";
		return false;
	}

	var param = {
		"appSecret": localStorage.getItem("appSecret"),
		"phone": register_name.value
	};

	if(monitor_net() == "none") {
		return false;
	}

	gizWifiSDK.requestSendVerifyCode(param, function(ret, err) {
		//什么都不做
		var get_vercode_button = document.getElementById(button_id);
		get_vercode_button.removeAttribute("onclick");

		settime(timer, button_id); //验证码获取成功，60秒倒计时
		msg("发送短信");
	});
}

//设置密码
function setPassword(password, token, register_name, register_pwd, client_id) {
	var param = {
		password: password,
		token: token
	};

	if(monitor_net() == "none") {
		return false;
	}

//	mico2.setPassword(param, function(ret, err) {
//		if(ret.meta.code == 0) {
//			if(register_timer_id != null) {
//				clearTimeout(register_timer_id);
//			}
//
//			localStorage.setItem(_USERNAME, register_name);
//			localStorage.setItem(_PASSWORD, register_pwd);
//			localStorage.setItem(_TOKEN, token);
//			localStorage.setItem(_CLINET_ID, client_id);
//			openWin('index', 'widget://index.html', true,null);
//		} else {
//			msg("注册失败");
//		}
//	});
}

//用户注册
function registerOp() {
	var register_name = document.getElementById('register_phone_num');
	var register_pw1 = document.getElementById('register_passwd1');
	var register_pw2 = document.getElementById('register_passwd2');
	var register_code = document.getElementById('register_vercode');

    var confirm_checkbox = document.getElementById('confirm_checkbox');
    if(confirm_checkbox.checked == false)
    {
    	msg("请阅读并同意协议");
    	return false;
    }


	if(check_phone_number(register_name.value) == false)
		return false;
		
	if(register_pw1.value.length==0 || register_pw2.value.length==0)
	{
		msg("密码不能为空");
		return false;
	}

	if(register_pw1.value != register_pw2.value)
	{
		msg("密码不一致")
		return false;
	}
	if(monitor_net() == "none") {
		return false;
	}

	var param = {
		"userName": register_name.value,
		"password": register_pw1.value,
		"verifyCode": register_code.value,
		"accountType": 1
	}

	//	mico2.checkVerifyCode(param, function(ret, err) {
	//		if(ret.token) {
	//			setPassword(register_pwd, ret.token, register_name, register_pwd, ret.clientid);
	//		} else {
	//			msg("验证码错误或已过期");
	//		}
	//	});
	gizWifiSDK.registerUser(param, function(ret, err) {
		if(ret) {
			msg("注册成功");
			localStorage.setItem(_TOKEN,ret.token);
			localStorage.setItem(_TOKEN,ret.uid);
			closeWin("register");
		}
		else{
			msg("注册失败")
		}
	});

}