function quit_timesetting_page() {
	//至关重要的代码
	localStorage.removeItem(_RECORD_ACTIVE_MAC);
	api.removeEventListener({
		name: 'myEvent'
	});
	closeWin("timesetting");
}

function fnfishbowlOp() {
	api.addEventListener({
		name: 'myEvent'
	}, function(ret, err) {
		fnrefreshTimeSettingDeviceInfo(ret.value);
	});
	//fnsetSubscribe();
}

//刷新数据，App状态与设备同步
function fnrefreshTimeSettingDeviceInfo(ret) {
	//获取数据点对象
	var dict = ret.status.data.entity0;
	//白灯定时开始时间
	var WLedStart = dict.SetAppWLedStartTimeAuto;
	//白灯定时结束时间
	var WLedStop = dict.SetAppWLedStopTimeAuto;
	//定时期间白灯PWM百分比	
	var WLedPwm = dict.SetAppWLedPwmAuto;
	//蓝灯定时开始时间
	var BLedStart = dict.SetAppBLedStartTimeAuto;
	//蓝灯定时结束时
	var BLedStop = dict.SetAppBLedStopTimeAuto;
	//定时期间蓝灯PWM百分比	
	var BLedPwm = dict.SetAppBLedPwmAuto;   
	
	//格式转换
	WLedStart = toMinute(WLedStart);
	WLedStop = toMinute(WLedStop);
	BLedStart = toMinute(BLedStart);
	BLedStop = toMinute(BLedStop);

	//渲染当前定时状态
	var mainLightStatuts = document.getElementById('main-light-satuts');
	var mainName = mainLightStatuts.getElementsByTagName('span');
	mainName[1].innerHTML = WLedStart;
	mainName[3].innerHTML = WLedStop;
	mainName[5].innerHTML = WLedPwm;

	var subLightStatuts = document.getElementById('sub-light-satuts');
	var subName = subLightStatuts.getElementsByTagName('span');
	subName[1].innerHTML = BLedStart;
	subName[3].innerHTML = BLedStop;
	subName[5].innerHTML = BLedPwm;
}

function sendTimer() { //发送定时信息
	//定时时间获取
	var startTimeMain = document.getElementById('main-light-start-time').innerText;
	var endTimeMain = document.getElementById('main-light-end-time').innerText;
	var startTimeSub = document.getElementById('sub-light-start-time').innerText;
	var endTimeSub = document.getElementById('sub-light-end-time').innerText;
	var mainPWM = document.getElementById('main-light').value;
	var subPWM = document.getElementById('sub-light').value;

	//格式转换
	startTimeMain = toNumber(startTimeMain);
	endTimeMain = toNumber(endTimeMain);
	startTimeSub = toNumber(startTimeSub);
	endTimeSub = toNumber(endTimeSub);
	mainPWM = parseInt(mainPWM);
	subPWM = parseInt(subPWM);
	//开始操控水泵开关

	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppWLedStartTimeAuto": startTimeMain,
			"SetAppWLedStopTimeAuto": endTimeMain,
			"SetAppWLedPwmAuto": mainPWM,
			"SetAppBLedStartTimeAuto": startTimeSub,
			"SetAppBLedStopTimeAuto": endTimeSub,
			"SetAppBLedPwmAuto": subPWM,
			"SetAppLedMode":true
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});

}

function timerStop(){
var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppLedMode":false
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}
function timerStart(){
var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppLedMode":true
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}
function timerStop(){
var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppLedMode":false
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}
 
//时间转换为数字
function toNumber(da) {
	var min = da.split(":");
	return parseInt(min[0] * 60) + parseInt(min[1]);
}

//数字转换为时间
function toMinute(da){
	var huors = parseInt(da/60);
	if (huors<10) huors = '0'+huors;
	var min = da%60;
	if (min<10) min = '0' + min;
	return huors + ':' + min;
}
