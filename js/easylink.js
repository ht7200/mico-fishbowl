//机智云增加
var easylink_timer_id = null;

var get_ssid_timer_id = null;
var golobal_wifi_ssid = null;
var easylink_button_timer_id = null;
var is_easylink_flag = false;

//退出easylink页面
function quit_easylink_page() {
	//关闭定时器
	if(easylink_button_timer_id != null) {
		clearTimeout(easylink_button_timer_id);
	}

	//关闭当前窗口,进入到新窗口
	closeWin('easylink');
	//	openWin('index', 'widget://index.html', true,null); 多次打开index页面有问题
}


function fneasylinkPageInit() {
	if(api.systemType === 'ios') {
		easylink_timer_id = setTimeout(function() { //每1000毫秒重新调用此方法
			fnsettime();
		}, 1000);
	}

	api.execScript({
		name: api.winName,
		script: 'fnGetPhoneSSID(' + JSON.stringify({
			winName: api.winName,
			frameName: api.frameName
		}) + ')'
	});
}

//增加机智云代码
function fnJumpSetting() {
	if(api.systemType === 'ios') {
		var param = {
			iosUrl: 'prefs:root=WIFI'
		};
	} else {
		var param = {
			androidPkg: 'android.settings.WIFI_SETTINGS'
		};
	}

	//安卓的api.openApp正确调用是有返回的,iOS的是没有返回的
	api.openApp(param, function(ret, err) {
		api.execScript({
			name: api.winName,
			script: 'fnGetPhoneSSID(' + JSON.stringify({
				winName: api.winName,
				frameName: api.frameName
			}) + ')'
		});
	})
}

//获取手机当前Wifi的SSID
function fnGetPhoneSSID(obj) {
	gizWifiSDK.getPhoneSSID(function(ret, err) {
		api.execScript({
			name: obj.winName,
			frameName: obj.frameName,
			script: 'fnReceive_GetPhoneSSID(' + JSON.stringify(ret) + ',' + JSON.stringify(err) + ')'
		});
	});
}
//获取ssid回调函数
function fnReceive_GetPhoneSSID(ret, err) {
	//alert("fnReceive_GetPhoneSSID");
	if(!ret) {
		$api.dom('.selectWiFi').innerHTML = "unknown ssid";
		return;
	}
	if(ret.SSID !== '<unknown ssid>') {
		$api.dom('.selectWiFi').innerHTML = ret ? ret.SSID : '请选择设备工作 Wi-Fi';
	} else {
		fnNotes(err);
	}
}
//验证获取60秒倒计时
function fnsettime() {
	fnGetPhoneSSID(api.winName);
	register_timer_id = setTimeout(function() { //每1000毫秒重新调用此方法
		fnsettime();
	}, 1000);
}
function fnJumpMdnsPage()
{
	openWin("mdnslist", "widget://html/mdnslist.html", true,null);
}
