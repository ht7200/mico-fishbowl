var findkeyback_timer_id = null;

function back_findkeyback_html() {
	if(findkeyback_timer_id != null) {
		clearTimeout(findkeyback_timer_id);
	}

	closeWin("findkeyback");
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

	findkeyback_timer_id = setTimeout(function() { //每1000毫秒重新调用此方法
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
//			if(findkeyback_timer_id != null) {
//				clearTimeout(findkeyback_timer_id);
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
function findkeybackOp() {
	var register_name = document.getElementById('register_phone_num');
	var register_pw1 = document.getElementById('register_passwd1');
	var register_pw2 = document.getElementById('register_passwd2');
	var register_code = document.getElementById('register_vercode');



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
		"verifyCode": register_code.value,
		"newPassword": register_pw1.value,
		"accountType": 1
	}

	api.showProgress({
		animationType: 'zoom',
		title: '正在重置...'
	});
	gizWifiSDK.resetPassword(param, function(ret, err) {
		api.hideProgress();
		if(ret) {
			msg("重置密码成功");
		}
		else{
			msg("重置密码失败")
		}
	});
}