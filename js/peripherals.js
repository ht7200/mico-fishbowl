/**
 * Created by gaoyang on 2016/6/29.
 */

/*
<ul id="list" class="mui-table-view mui-table-view-chevron">
	<li class="mui-table-view-cell mui-indexed-list-item list-title">我的客厅<span class="mui-pull-right">解绑设备<span></li>
	<li class="mui-table-view-cell mui-indexed-list-item">MAC地址:<span class="mui-pull-right">AC:CF:28:83:F7:BE<span></li>
	<li class="mui-table-view-cell mui-indexed-list-item">设备型号:<span class="mui-pull-right">OP001<span></li>				
</ul>
*/

function innerHtml2DeviceList(arr) {

	if(arr == null || arr.length == 0) {
		document.getElementById("m_peripherals").innerHTML = "";
		msg("无绑定设备");
		return;
	}
	var html = ""; //需要追加页面
	//{devices：(array)}
	for(var i in arr) {
		var dict = arr[i]; //开始取得第一个字典类型
		//小心书写，注意大小写
		var productName = dict.productName;
		var alias = "我的鱼缸";
		if(dict.alias != "") alias = dict.alias;
		var mac = dict.mac;

		if(dict.isBind == false) continue; //过滤，只显示绑定的

		var formatMAC = fnformatMAC(mac);
		//did 就是product_id
		var pass_id = mac + ',' + dict.did + ',';
		//复杂的拼接过程
		html += '<ul id="list" class="mui-table-view mui-table-view-chevron">'; //row1
		html += '<li class="mui-table-view-cell mui-indexed-list-item list-title">' + '<span class="alias"' + ' id=' + pass_id + ' onclick=\"fnrename(this.id)\">' + alias + '</span>' + '<span class="mui-pull-right"' + ' id=' + pass_id + ' onclick=\"fnunbind(this.id)\">' + '解绑设备' + '</span></li>'; //row2
		//html += '<li class="mui-table-view-cell mui-indexed-list-item list-title">' + alias + '<span class="mui-pull-right"' + ' id=' + pass_id + ' onclick=\"fnunbind(this.id)\">' + '解绑设备' + '<span></li>'; //row2
		html += '<li class="mui-table-view-cell mui-indexed-list-item">MAC地址:<span class="mui-pull-right">' + formatMAC + '<span></li>'; //row3
		html += '<li class="mui-table-view-cell mui-indexed-list-item">设备型号:<span class="mui-pull-right">' + productName + '<span></li>'; //row4
		html += '</ul>'; //row5
	}
	document.getElementById("m_peripherals").innerHTML = html;
}

function fnrename(pass_id) {
	var btnArray = ['重命名', '取消'];
	mui.prompt('给该设备取一个个性名称吧~', '', '绑定设备', btnArray, function(e) {
		if(e.index == 0) {
			//重命名
			fnsetCustomInfo(pass_id, e.value);
		} else {}
	})
}

function fnsetCustomInfo(pass_id, local_name) {
	//var pass_id =  mac + ',' + dict.did + ',';
	var arr = pass_id.split(',');
	var param = {
		"device": {
			"mac": arr[0],
			"did": arr[1]
		},
		"alias": local_name
	};
	gizWifiDevice.setCustomInfo(param, function(ret, err) {
		//alert("ret = " + JSON.stringify(ret) + "err = " + JSON.stringify(err))
		if(ret) {
			fngetBindDeviceList();
		}
	});
}

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
			innerHtml2DeviceList(ret.devices);
		}
	});
}

function quit_peripherals_page() {
	closeWin("peripherals");
}

function fnunbind(pass_id) {

	var arr = pass_id.split(',');
	var param = {
		"uid": localStorage.getItem(_UID),
		"token": localStorage.getItem(_TOKEN),
		"did": arr[1]
	};

	gizWifiSDK.unbindDevice(param, function(ret, err) {
		if(ret) {
			msg("解绑成功");
			fngetBindDeviceList();
		} else {
			msg("解绑失败");
		}
	});
}