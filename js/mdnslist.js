//机智云增加
var mdns_timer_id = null;

//获取绑定设备列表
function fnGetLocalDevices() {
	if(monitor_net() == "none") {
		return false;
	}

	api.showProgress({
		animationType: 'zoom',
		title: '正在搜索局域网...'
	});
	var param = {
		uid: localStorage.getItem(_UID),
		token: localStorage.getItem(_TOKEN),
		//specialProductKeys:
	};
	gizWifiSDK.getBoundDevices(param, function(ret, err) {
		api.hideProgress();
		//alert(JSON.stringify(ret));
		if(ret) {
			innerHtml2mdnsList(ret.devices);
		} else {}
	});
}

function innerHtml2mdnsList(arr) {
	if(arr == null || arr.length == 0) {
		document.getElementById("m_mdnslist").innerHTML = "";
		msg("无绑定设备");
		return;
	}
	var html = ""; //需要追加页面
	//{devices：(array)}
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		//小心书写，注意大小写
		var Name = dict.productName;
		if(dict.alias != "") Name = dict.alias; //取个别名吧
		var mac = dict.mac;
		var formatMAC = "MAC地址  "; //格式化
		formatMAC = formatMAC + fnformatMAC(mac);

		if(dict.isBind == true) continue; //如果已经绑定，那么过滤

		var isLAN = dict.isLAN == true ? "局域网" : "远程";
		var isOnline = dict.isOnline == true ? "在线" : "离线";
		isLAN = isLAN + isOnline; //局域网在线/远程在线/远程离线

		//打包传参,传了很多参数，方便后面使用,注意，非常主要
		var pack_id = dict.isOnline + ',' + dict.isBind + ',' + mac + ',' + dict.did + ',';

		//复杂的拼接过程
		html += '<li class="mui-table-view-cell"' + 'id=' + pack_id + ' onclick=\"fnBindDevice(this.id)\"' + '>'; //row1
		//html += '<li class="mui-table-view-cell">'; //row1
		html += '<div class="mui-table">'; //row2 
		html += '<div class="mui-table-cell mui-col-xs-10">'; //row3
		html += '<h4 class="mui-ellipsis">' + Name + '</h4>'; //row4
		html += '<p class="mui-h6 mui-ellipsis">' + formatMAC + '</p>'; //row5
		html += '</div>'; //row6
		html += '<div class="mui-table-cell mui-col-xs-3 mui-text-right">'; //row7
		html += '<span class="mui-h5">' + isLAN + '</span>'; //row8
		html += '</div>'; //row9
		html += '</div>'; //row10
		html += '<span class="mui-icon mui-icon-arrowright"></span>'; //row11
		html += '</li>'; //row12
	}
	document.getElementById("m_mdnslist").innerHTML = html;
}

function quit_mdnslist_page() {
	closeWin("mdnslist");
}

/*是否在线，是否绑定，mac地址，绑定设备*/
function fnBindDevice(pass_id) {
	var arr = pass_id.split(',');
	if(arr[0] != "true") {
		msg("设备不在线");
		return;
	}

	if(arr[1] == "true") {
		msg("设备已经绑定");
		return;
	}
	var btnArray = ['开始绑定', '取消绑定'];
	mui.prompt('给该设备取一个个性名称吧~', '例如：客厅水族箱', '绑定设备', btnArray, function(e) {
		if(e.index == 0) {
			//info.innerText = '谢谢你的评语：' + e.value;
			//alert('设备名称:' + e.value);
			fnbindRemoteDevice(pass_id, e.value);
		} else {
			//info.innerText = '你点了取消按钮';
			//alert('你点了取消按钮');
		}
	})
}

function fnbindRemoteDevice(pass_id, local_name) {
	var arr = pass_id.split(',');
	var param = {
		"uid": localStorage.getItem(_UID),
		"token": localStorage.getItem(_TOKEN),
		"mac": arr[2],
		"productKey": IOT_GIZWITS_PRODUCT_KEY,
		"productSecret": IOT_GIZWITS_PRODUCT_SECRET
	}
	gizWifiSDK.bindRemoteDevice(param, function(ret, err) {
		if(ret) {
			msg("绑定成功");
			setCustomInfo(pass_id, local_name);
		} else {
			msg("绑定失败");
		}
	});
}

function setCustomInfo(pass_id, local_name) {
	//var pack_id = dict.isOnline + ',' + dict.isBind + ',' + mac + ',' + dict.did + ',';
	alert("pass_id:" + pass_id);
	var arr = pass_id.split(',');
	var param = {
		"device": {
			"mac": arr[2],
			"did": arr[3]
		},
		"alias": local_name
	};
	gizWifiDevice.setCustomInfo(param, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
		if(ret) {
			fnGetLocalDevices();
		}
	});
}