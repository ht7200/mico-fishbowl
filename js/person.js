//打开找回密码页面
function quit_person_page() {
	closeWin('person');
}

gizWifiSDK = api.require('gizWifiSDK')

function fngetUserInfo() {
	var token = localStorage.getItem('_TOKEN');
	gizWifiSDK.getUserInfo({
		"token": token
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
	//渲染部分 未完待续。。。。。
}

function fnchangeUserInfo() {
	var token = localStorage.getItem('_TOKEN');
	var name = document.getElementById('nicname');
	var gender = '';
	var email = document.getElementById('email');
	var address = document.getElementById('address');
	var radioList = document.querySelectorAll('input[type="radio"]');
	for(var i = 0, len = radioList.length; i < len; i++) {
		if(radioList[i].checked) {
			gender = radioList[i].value
		};
	}
	gender = gender=='男'?0:1;

	gizWifiSDK.changeUserInfo({
		"token": token,
		"name": name,
		"gender": gender,
		"email": email,
		"address": address,
		"accountType": 0
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}