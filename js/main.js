function fngetBindDeviceList() {
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
			innerHtml2MainList(arr);
		}
	});
}

function innerHtml2MainList(arr) {
	if(arr == null || arr.length == 0) {
		innerEmptyHtml2MainList();
		mui.toast("无绑定设备");
		return;
	}
	var html = ""; //需要追加页面
	//探测数据
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		if(dict.isBind == false) continue; //如果已经绑定，那么过滤

		html += "test";
	}
	if(html == "") {
		alert("no data");
		innerEmptyHtml2MainList();
	} else {
		alert("has data");
		innerDevicesHtml2MainList(arr);
	}
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

function innerDevicesHtml2MainList(arr) {
	var html = "";
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		if(dict.isBind == false) continue; //如果已经绑定，那么过滤

		html += '<div class="showdevice online">';
		html += '<span class="mui-icon iconfont icon-wifi"></span>';
		html += '<span class="mui-icon iconfont icon-chacha-copy"></span>';
		html += '<h5 class="title">客厅水族箱</h5>';
		html += '<h5 class="tem">23.<small>5℃</small></h5>';
		html += '<div class="detail">';
		html += '<span class="mui-icon iconfont icon-tubiao06 light"></span>';
		html += '<span>今天</span>';
		html += '<span>主缸已打开<big>4</big>小时</span>';
		html += '<span>蓝藻灯已打开<big>4</big>小时</span>';
		html += '</div>';
		html += '<div class="status status1">';
		html += '<span class="mui-icon iconfont icon-taiyang"></span>';
		html += '<span>日出日落模式</span>';
		html += '</div>';
		html += '</div>';
	}
	document.getElementById("m_main_add_device").innerHTML = html;
	document.getElementById("m_main_no_device").innerHTML = "";
}