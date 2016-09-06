
//下拉刷新配置
var refresh = {
	visible: true,
	loadingImg: 'widget://icon/wifi.svg',
	bgColor: '#efeff4',
	textColor: '#333333',
	textDown: '下拉刷新...',
	textUp: '松开刷新...',
	showTime: true
}

//分享设备
function device_list_share(element) {
	var id = element.parentNode.parentNode.id;
	var arr = id.split(',');

	device_id = arr[0];
	device_pw = arr[1];
	device_name = arr[2];

	mui.toast("device_id:" + device_id + ",device_pw:" + device_pw + ",devive_name:" + device_name);
}

//删除设备
function device_list_delete(element) {
	var id = element.parentNode.parentNode.id;
	var arr = id.split(',');

	device_id = arr[0];
	device_pw = arr[1];
	device_name = arr[2];

	//	mui.toast("device_id:" + device_id + ",device_pw:" + device_pw + ",devive_name:" + device_name);

	if(monitor_net() == "none") {
		return false;
	}

	var app_token = localStorage.getItem(_TOKEN);

	if(app_token == null) {
		openWin('login', 'widget://html/login.html', true);
		return false;
	}

	var param = {
		deviceid: device_id,
		token: app_token
	};

//	mico2.unBindDevice(param, function(ret, err) {
//		if(ret && ret.meta.code == 0) {
//			mui.toast("解绑成功");
//			element.parentNode.parentNode.parentNode.removeChild(element.parentNode.parentNode);
//		} else {
//			mui.toast("解绑失败");
//		}
//	});

}

//打开设备信息页面
function openDeviceInfo(element) {
	var id = element.parentNode.id;
	var arr = id.split(',');

	device_id = arr[0];
	device_pw = arr[1];
	device_name = arr[2];

	//mui.toast("device_id:" + device_id + ",device_pw:" + device_pw + ",devive_name:" + device_name);

	localStorage.setItem(_DEVICEID, device_id);
	localStorage.setItem(_DEVICE_NAME, device_name);
	openWin("peripherals", "widget://html/peripherals.html");
}

function notice_offline(){
	mui.toast("设备已离线<br/>请检查设备状态或刷新设备列表");
}

//获取设备列表
function getDeviceList() {
	var connectionType = api.connectionType;
	var app_token = localStorage.getItem(_TOKEN);

	if(monitor_net() == "none") {
		return false;
	}

	if(app_token == null) {
		openWin('login', 'widget://html/login.html', true);
		return false;
	}

	var param = {
		token: app_token
	}

//	mico2.getDeviceList(param, function(ret, err) {
//		if(ret && ret.meta.code == 0) {
//			data = ret.data;
//
//			var html_delete_share = "";
//			var html_text = "";
//			var html_online = "";
//			var html_total = "";
//			var device_list_html = "";
//
//			for(var index in data) {
//				var device_name = data[index].device_name;
//				var device_id = data[index].device_id;
//				var device_pw = data[index].device_pw;
//				var device_online = data[index].online;
//
//				var div_id = device_id + ',' + device_pw + ',' + device_name;
//				
//				//1.判断是否在线
//				if(device_online == true){
//					html_online = '<span class="mui-badge mui-badge-green" style="vertical-align: middle; margin-left: 5px;">在线</span>';
//				}else{
//					html_online = '<span class="mui-badge mui-badge-danger" style="vertical-align: middle; margin-left: 5px;">离线</span>';
//				}
//				
//				//2.组合删除和分享按钮div
//				html_delete_share = '<div class="mui-slider-right mui-disabled"><a class="mui-btn mui-btn-green mui-icon device_list_share_romove icon-share" onclick="device_list_share(this)"></a><a class="mui-btn mui-btn-red mui-icon device_list_share_romove icon-delete" onclick="device_list_delete(this)"></a></div>';
//
//				//3.组合图片和文本区域
//				if(device_online == true){
//					html_text = '<div class="mui-slider-handle" onclick="openDeviceInfo(this)"><div style="float: left; color: #007AFF"><span class="mui-icon device_search icon-device2"></span></div><div class="device_list_text"><div><span style="vertical-align: middle;">' + device_name + '</span>'+ html_online +'</div><p><h6>' + device_id + '</h6></p></div></div>';
//				}else{
//					html_text = '<div class="mui-slider-handle" onclick="notice_offline()"><div style="float: left; color: #007AFF"><span class="mui-icon device_search icon-device2"></span></div><div class="device_list_text"><div><span style="vertical-align: middle;">' + device_name + '</span>'+ html_online +'</div><p><h6>' + device_id + '</h6></p></div></div>';
//				}
//				
//				//4.组合整体
//				if(device_online == true){
//					html_total = '<li id=' + '"' + div_id + '"' + 'class="mui-table-view-cell">' + html_delete_share + html_text + '</li>';
//				}else{
//					html_total = '<li id=' + '"' + div_id + '"' + 'class="mui-table-view-cell" style="background: #DFDFDF;">' + html_delete_share + html_text + '</li>';
//				}
//				
//				device_list_html += html_total;
//			}
//
//			//alert(data.length + "    "+ device_list_html);
//			
//			var deviceList = document.getElementById("deviceList");
//			
//			if(device_list_html == ""){
//				deviceList.style.display = "none";
//			}else{
//				deviceList.style.display = "block";
//			}
//			deviceList.innerHTML = device_list_html;
//			
//		} else {
//			alert("获取设备列表失败 " + JSON.stringify(err));
//		}
//	});
}

