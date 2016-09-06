var g_JSON_array = null; //一维数组，一个json有2对数据，有可能有多个数据
//逻辑比较复杂
function fnMaingetBindDeviceList() {

	if(monitor_net() == "none") {
		//清理
		document.getElementById("m_main_no_device").innerHTML = "";
		document.getElementById("m_main_add_device").innerHTML = "";
		return false;
	}
	api.showProgress({
		animationType: 'zoom',
		title: '获取设备列表中...'
	});
	var param = {
		"uid": localStorage.getItem(_UID),
		"token": localStorage.getItem(_TOKEN),
		"specialProductKeys": [IOT_GIZWITS_PRODUCT_KEY]
	}

	gizWifiSDK.getBoundDevices(param, function(ret, err) {
		api.hideProgress();
		if(ret) {
			var arr = ret.devices;
			innerHtml2MainList(arr); //获取绑定的设备
			fnsetSubscribe(arr); //订阅设备
			fngetDeviceUploadInfo(arr); //获取设备上行数据
		}
	});
}

function innerHtml2MainList(arr) {
	if(arr == null || arr.length == 0) {
		innerEmptyHtml2MainList();
		msg("无绑定设备");
		return;
	}
	var html = ""; //需要追加页面
	//探测数据
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		if(dict.isBind == false) continue; //如果已经绑定，那么过滤
		html += "append"; //故意造数据
	}
	if(html == "")
		innerEmptyHtml2MainList();
	else
		innerDevicesHtml2MainList(arr);

}

function innerEmptyHtml2MainList() {
	var html = "";

	html += '<img src="../img/backgroud.png" / style="width: 100%;">';
	html += '<div class="inner-content">';
	html += '<div class="btn-plus">';
	html += '<span class="mui-icon iconfont icon-tianjia"></span>';
	html += '</div>';
	html += '<div class="text">';
	html += '添加新设备';
	html += '</div>';
	html += '<div class="btn-try">';
	html += '<span class="mui-icon iconfont icon-xiaolvdashiicon02"></span> 先体验一下？';
	html += '</div>';
	html += '</div>';
	document.getElementById("m_main_no_device").innerHTML = html;
	document.getElementById("m_main_add_device").innerHTML = "";
}
//创建二维数组，包含mac地址和index
function constructJSONArray(arr) {

	var j = 0;
	var jsonArray = new Array();
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		if(dict.isBind == false) continue; //如果没有绑定，那么过滤

		jsonArray.push({
			"mac": dict.mac,
			"index": j
		});
		j++;
	}
	return jsonArray;
}

function fngetindexbyMAC(jsonarray, mac) {
	for(var i in jsonarray) {
		var dict = jsonarray[i];
		if(dict.mac == mac) {
			return dict.index;
			break;
		}
	}
}

function innerDevicesHtml2MainList(arr) {
	var html = "";
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		if(dict.isBind == false) continue; //如果没有绑定，那么过滤

		var pass_id = dict.isOnline == true ? "true" : "false";
		pass_id = pass_id + ',' + dict.mac + ',' + dict.did + ',';

		g_JSON_array = constructJSONArray(arr);

		html += '<div class="showdevice"' + ' id=' + pass_id + ' onclick=\"fnliClicked(this.id)\">';
		html += '<span class="mui-icon iconfont icon-wifi"></span>';

		if(dict.isOnline)
			html += '<span class="mui-icon iconfont icon-chacha-copy online" name = "m_wifistatus" ></span>';
		else
			html += '<span class="mui-icon iconfont icon-chacha-copy" name = "m_wifistatus" ></span>';

		html += '<h5 class="title" name="m_title">我的鱼缸</h5>'; //别名
		//html += '<h5 class="tem">23.<small>5℃</small></h5>';
		html += '<h5 class="tem" name="m_tem">--.--℃</h5>'; //温度
		html += '<div class="detail">';
		html += '<span class="mui-icon iconfont icon-tubiao06 light"></span>';
		html += '<span>今天</span>';
		//html += '<span>主缸已打开<big>4</big>小时</span>';
		//html += '<span>蓝藻灯已打开<big>4</big>小时</span>';
		html += '<span name="m_WLedTimeSum">主缸已打开-小时</span>';
		html += '<span name="m_BLedTimeSum">蓝藻灯已打开-小时</span>';
		html += '</div>';

		html += '<div class="status status1" name="m_status_style">';
		html += '<span class="mui-icon iconfont icon-taiyang"></span>';
		html += '<span name="m_status">设备已经离线</span>';
		html += '</div>';
		html += '</div>';
	}
	document.getElementById("m_main_add_device").innerHTML = html;
	document.getElementById("m_main_no_device").innerHTML = "";
}

function fnsetSubscribe(arr) {
	if(arr == null || arr.length == 0) {
		//DO Nothing
		return;
	}

	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		//设备不在线，或者设备已经订阅了，不需要调用订阅
		if(dict.isOnline == false || dict.isSubscribed == true) {
			continue; //如果已经绑定，那么过滤
		}
		gizWifiDevice.setSubscribe({
			"subscribed": true,
			"device": {
				"mac": dict.mac,
				"did": dict.did
			}
		}, function(ret, err) {
			//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
		});
	}
}

//获取设备上报的数据
function fngetDeviceUploadInfo(arr) {
	if(arr == null || arr.length == 0) {
		//DO Nothing
		return;
	}

	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		if(dict.isSubscribed == true) {
			gizWifiDevice.registerNotifications({
				"device": {
					"did": dict.did,
					"mac": dict.mac
				}
			}, function(ret, err) {
				if(ret && ret.status && ret.status.data) {
					//复杂的JSON格式					
					api.execScript({
						name: api.winName,
						frameName: api.frameName,
						script: 'fnrefreshMainListDeviceInfo(' + JSON.stringify(ret) + ')'
					});

					// 特别注意，当数据mac与打开的mac地址一致的时候才发通知
					if(ret.device.mac == localStorage.getItem(_RECORD_ACTIVE_MAC)) {
						//获取数据
						api.sendEvent({
							name: 'myEvent',
							extra: ret
						});
					}

				} else {
					fnMaingetBindDeviceList(); //重刷整个界面
				}
			});
		}
	} //for
}

/*
function fnRegisterNotifications(obj) {
	gizWifiSDK.registerNotifications(function(ret, err) {
		api.execScript({
			name: 'win_deviceList',
			frameName: 'frm_deviceList',
			script: 'receive_fnRegisterNotifications(' + JSON.stringify(ret) + ',' + JSON.stringify(err) + ')'
		});
	});
}
*/

//特别注意的是，在监听的时候发现设备不在线，应该刷新整个列表，保持数据与云端同步
function fnrefreshMainListDeviceInfo(ret) {
	//var ret = JSON.parse(jsontext); //字符串转对象
	var getobject = null;
	var dict = null;
	var index = fngetindexbyMAC(g_JSON_array, ret.device.mac);
	//设备信息
	var alias = ret.device.alias == "" ? "我的鱼缸" : ret.device.alias;

	getobject = document.getElementsByName("m_title");
	getobject[index].innerHTML = alias;

	//设备数据
	dict = ret.status.data.entity0;
	var tem = dict.StatAppTemp;
	getobject = document.getElementsByName("m_tem");
	if((typeof tem) == "number") {
		tem = tem.toFixed(1); //保留一位小数点
		getobject[index].innerHTML = tem + '℃';
	}

	var WLedTimeSum = dict.StatAppWLedTimeSum;
	var BLedTimeSum = dict.StatAppBLedTimeSum;

	getobject = document.getElementsByName("m_WLedTimeSum");
	if(getobject)
		getobject[index].innerHTML = "主缸已打开" + WLedTimeSum + '分钟';

	getobject = document.getElementsByName("m_BLedTimeSum");
	if(getobject)
		getobject[index].innerHTML = "蓝藻灯已打开" + BLedTimeSum + '分钟';

	//刷新设备状态数据
	getobject = document.getElementsByName("m_status_style");
	if(getobject) {
		if(dict.isOnline)
			getobject[index].setAttribute("class", "status status2");
		else
			getobject[index].setAttribute("class", "status status1");
	}

	//刷新状态文字
	getobject = document.getElementsByName("m_status");
	if(getobject) {
		if(dict.isOnline)
			getobject[index].innerHTML = "设备已经离线";
		else
			getobject[index].innerHTML = "日出日落模式";
	}
}

//点击进入下一个页面
function fnliClicked(pass_id) {
	var arr = pass_id.split(',');
	var isOnline = arr[0];
	if(isOnline == "false") {
		msg("设备不在线");
		return;
	}
	var json_param = {
		"mac": arr[1],
		"did": arr[2]
	};
	//alert('点中了:' + pass_id);
	//此时需要页面传递参数
	openWin("main_readwrite", "widget://html/main_readwrite.html", true, json_param);
}
//打开找回配网页面
function open_easylinkPage()
{
	openWin("easylink", "widget://html/easylink.html", true,null);
}

//打开体验页面
function fnExperience(){
	openWin("fakeMain", "widget://html/fake_main.html");
}

