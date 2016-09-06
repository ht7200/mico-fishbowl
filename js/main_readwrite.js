var g_lockStat = false; //儿童锁的状态
var g_pumpStat = false; //水泵开关状态

function quit_main_read_write_page() {
	//至关重要的代码
	localStorage.removeItem(_RECORD_ACTIVE_MAC);
	api.removeEventListener({
		name: 'myEvent'
	});

	closeWin("main_readwrite");
}

function fnfishbowlOp() {
	var pageParam = api.pageParam;
	localStorage.setItem(_RECORD_ACTIVE_MAC,pageParam.mac);
	api.addEventListener({
		name: 'myEvent'
	}, function(ret, err) {
		fnrefreshMainReadWriteDeviceInfo(ret.value);
	});
	//fnsetSubscribe();
}

//刷新数据，App状态与设备同步
function fnrefreshMainReadWriteDeviceInfo(ret) {
	//alert(JSON.stringify( ret.status.data.entity0));
	var gettag;
	//设备信息
	var alias = ret.device.alias == "" ? "我的鱼缸" : ret.device.alias;
	$api.dom('.mui-title').innerHTML = alias;
	//温度
	var dict = ret.status.data.entity0;
	var tem = dict.StatAppTemp; //number
	if((typeof tem) == "number") {
		tem = tem.toFixed(1); //保留一位小数点
		$api.dom('.number').innerHTML = tem;
	}

	//水泵电流值
	var StatAppBumpCur = dict.StatAppBumpCur;
	if((typeof StatAppBumpCur) == "number")
		document.getElementById("StatAppBumpCur").innerHTML = '水泵电流: ' + StatAppBumpCur + ' A';

	//童锁状态
	var SetAppChildLock = dict.SetAppChildLock; //获取锁的状态
	if((typeof SetAppChildLock) == "boolean") {
		gettag = document.getElementById("m_childlock");
		if(SetAppChildLock == false) {
			g_lockStat = false;
			gettag.setAttribute('class', 'mui-icon iconfont icon-unlocked');
		} else {
			g_lockStat = true;
			gettag.setAttribute('class', 'mui-icon iconfont icon-locked');
		}
	}

	//刷新水泵状态,在App中水泵控制和状态无关
	//控制水泵
	var FlgAppBumpOn = dict.FlgAppBumpOn; //获取水泵目前的开关量，可读可写
	gettag = document.getElementById("m_pumplock");
	if((typeof FlgAppBumpOn) == "boolean") {
		if(FlgAppBumpOn) {
			gettag.style.color = "white";
			g_pumpStat = true;
		} else {
			gettag.style.color = "red";
			g_pumpStat = false;
		}
	}

	//获取水泵工作状态
	var StatAppBumpWork = dict.StatAppBumpWork; //获取水泵的工作状态，只读
	gettag = document.getElementById("StatAppBumpWork");
	if((typeof StatAppBumpWork) == "number") {
		switch(StatAppBumpWork) {
			case 0:
				gettag.innerHTML = "工作正常";
				break;
			case 1:
				gettag.innerHTML = "水泵堵转";
				break;
			case 2:
				gettag.innerHTML = "水泵损坏";
				break;
			case 3:
				gettag.innerHTML = "水泵停止";
				break;
			default:
				break;
		}
	}

	//获取两个进度条值
	var SetAppWLedPwmManu = dict.SetAppWLedPwmManu; //获取主缸灯白灯的亮度值
	gettag = document.getElementById("main-light");
	if((typeof SetAppWLedPwmManu) == "number") {
		gettag.value = SetAppWLedPwmManu;
		gettag = document.getElementById("main-light-val");
		gettag.innerHTML = "亮度:" + SetAppWLedPwmManu + '%';
	}

	var SetAppBLedPwmManu = dict.SetAppBLedPwmManu; //获取辅助灯蓝灯的亮度值
	gettag = document.getElementById("sub-light");
	if((typeof SetAppBLedPwmManu) == "number") {
		gettag.value = SetAppBLedPwmManu;
		gettag = document.getElementById("sub-light-val");
		gettag.innerHTML = "亮度:" + SetAppBLedPwmManu + '%';
	}

	//获取主缸灯开关量
	var FlgAppWLedOnManu = dict.FlgAppWLedOnManu; //获取辅助灯蓝灯的亮度值
	gettag = document.getElementById("main-light-switch");
	if((typeof FlgAppWLedOnManu) == "boolean") {

		if(FlgAppWLedOnManu)
			gettag.setAttribute("class", "mui-switch mui-switch-blue mui-active");
		else
			gettag.setAttribute("class", "mui-switch mui-switch-blue");
	}
	//获取蓝藻灯开关量
	var FlgAppBLedOnManu = dict.FlgAppBLedOnManu; //获取辅助灯蓝灯的亮度值
	gettag = document.getElementById("sub-light-switch");
	if((typeof FlgAppBLedOnManu) == "boolean") {
		if(FlgAppBLedOnManu)
			gettag.setAttribute("class", "mui-switch mui-switch-blue mui-active");
		else
			gettag.setAttribute("class", "mui-switch mui-switch-blue");
	}

}

//水泵开关操控逻辑
function fnpumplockOp() {
	if(g_pumpStat) {
		fnSetpumplockOp(false);
	} else {

		fnSetpumplockOp(true);
	}
}
//开始操控水泵开关
function fnSetpumplockOp(pumplock_cmd) {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"FlgAppBumpOn": pumplock_cmd
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

//点击进入第二个页面
function open_timesetting_Page() {
	//此时需要页面传递参数
	openWin("timesetting", "widget://html/timesetting.html", true, null);
}

function fnsetLed(range_id, value) {
	if(range_id == "main-light") {
		fnsetWLed(value);
	} else if(range_id == "sub-light") {
		fnsetBLed(value);
	}
}

function fnsetWLed(value) {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppWLedPwmManu": value
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

function fnsetBLed(value) {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppBLedPwmManu": value
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

function WLedSW_open() {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"FlgAppWLedOnManu": true
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

function WLedSW_close() {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"FlgAppWLedOnManu": false
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

function BLedSW_open() {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"FlgAppBLedOnManu": true
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

function BLedSW_close() {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"FlgAppBLedOnManu": false
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}

function fnchildlockOp() {
	var gettag = document.getElementById("m_childlock");
	if(g_lockStat == false) {
		g_lockStat = true;
		//gettag.setAttribute('class', 'mui-icon iconfont icon-locked');;
		fnSetchildlock(true); //逻辑：没有锁，那我想锁住它
		msg("童锁已锁定");
	} else {
		g_lockStat = false;
		//gettag.setAttribute('class', 'mui-icon iconfont icon-unlocked');
		fnSetchildlock(false); //逻辑：有锁，那我想解锁它
		msg("童锁已解锁");
	}
}

function fnSetchildlock(lock_cmd) {
	var pageParam = api.pageParam;
	gizWifiDevice.write({
		"device": {
			"did": pageParam.did,
			"mac": pageParam.mac
		},
		"sn": 5,
		"data": {
			"SetAppChildLock": lock_cmd
		}
	}, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
	});
}