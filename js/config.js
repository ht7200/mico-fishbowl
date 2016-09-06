const _ID = "A6925593150107"; //apicloud项目Id

const _CLINET_ID = "client_id"; //用户登录token对应的clinetid

const _DEVICEID = "device_id"; //记录点击的绑定设备的设备id
const _DEVICE_NAME = "device_name"; //记录点击的绑定设备的设备name

const _RECORD_ACTIVE_MAC = "active_mac";

var mico2 = null; //fog模块对象初始值

/**************************机智云配置参数***********************/
var gizWifiSDK = null;
var gizWifiDevice = null;
//临时使用的ios版本appid
//const IOT_GIZWITS_APPID_IOS = "f8eb0e7650b84df88feff6aa40a9cf5d";
//iOS正式版
const IOT_GIZWITS_APPID_IOS = "d35773f67574450f8d05bbe0ea696a0a";
const IOT_GIZWITS_APPSECRET_IOS = "3db700723fe94d5389b6fb1b35c8be81";
//Ad正式版
const IOT_GIZWITS_APPID_AD = "4659f3b2c3be4b158249d5145b680dd8";
const IOT_GIZWITS_APPSECRET_AD = "c803cafcbe134a05ac63a0abc0d553cb";

//产品型号
const IOT_GIZWITS_PRODUCT_KEY = "3117ae542fd0499abf32d31003654ff2";
const IOT_GIZWITS_PRODUCT_SECRET = "586dbd1b0bbc47eb85e21a8dd9326240";
const _USERNAME = "username";
const _PASSWORD = "password";
const _TOKEN = "token"; //用户登录token对应的key
const _UID = "uid";

//下拉刷新配置
var refresh = {
		visible: true,
		loadingImg: 'widget://icon/wifi.svg',
		bgColor: '#efeff4',
		textColor: '#333333',
		textDown: '下拉刷新...',
		textUp: '松开刷新...',
		showTime: true
};
function startGizWitsSDK() {
	localStorage.setItem('appID', api.systemType === 'ios' ? IOT_GIZWITS_APPID_IOS : IOT_GIZWITS_APPID_AD);
	localStorage.setItem('appSecret', api.systemType === 'ios' ? IOT_GIZWITS_APPSECRET_IOS : IOT_GIZWITS_APPSECRET_AD);
	//初始化机制云模块
	var param = {
		appID: localStorage.getItem('appID')
	};
	if(monitor_net() == "none") {
		return false;
	}
	gizWifiSDK.startWithAppID(param, function(ret, err) {
		if(ret && ret.errorCode == 8316) {
			msg("SDK初始化成功");
			//跳出登录页面
			open_loginPage();
		} else {
			msg("SDK初始化失败");
		}
	});
}
//打开登录页面
function open_loginPage() {
	openWin("login", "widget://html/login.html", true,null);
}

//toast消息提醒
function msg(content) {
	api.toast({
		msg: content,
		duration: 2000,
		location: 'bottom'
	});
}

//设置手机状态栏字体颜色//light:白色；dark:黑色 style: style
function setStatusBar(style) {
	api.setStatusBarStyle({
		style: style
	});
}

//设置页面顶部标题
var title = ["首页", "商城", "社区", "我的"];

//设置子页面数组
//var frames = [{
//	name: 'guide',
//	url: 'widget://html/guide.html'
//}, {
//	name: 'device_list',
//	url: 'widget://html/devicelist.html'
//}, {
//	name: 'user',
//	url: 'widget://html/personal.html'
//}];

var frames = [{
	name: 'main_read',
	url: 'widget://html/main_read.html'
}, {
	name: 'Shop',
	url: 'widget://html/shop.html'
}, {
	name: 'Community',
	url: 'widget://html/community.html'
}, {
	name: 'mysetting',
	url: 'widget://html/mysetting.html'
}];

//创建子页面组，并初始化打开指定子页面
function openFrameGroup() {
	api.openFrameGroup({
		name: 'group',
		background: '#efeff4',
		scrollEnabled: false,
		rect: {
			x: 0,
			y: 65,
			w: 'auto',
			h: 'auto',
			marginBottom: 50
		},
		index: 0,
		frames: frames
	}, function(ret, err) {
		var index = ret.index;
	});
}

//关闭子页面组
function closeFrameGroup(name) {
	api.closeFrameGroup({
		name: name
	});
}

//设置子页面组要显示的子页面
function setFrameGroupIndex(index) {
	api.setFrameGroupIndex({
		name: 'group',
		index: index,
		scroll: false,
		reload: false
	});
}

//打开新页面/窗口
function openWin(name, url, isReload, args) {
	api.openWin({
		name: name, //要打开的新页面去掉后面的.html
		url: url, //子页面路径
		reload: isReload, //打开新页面是否重新加载/刷新页面
		slidBackEnabled: false, //只对IOS有效//禁止滑动关闭
		delay: 0,
		bounces: false,
		vScrollBarEnabled: false,
		hScrollBarEnabled: false,
		bgColor: 'white',
		pageParam: args
	});
}

//关闭页面/窗口
function closeWin(name) {
	api.closeWin({
		name: name
	});
}

//监听底部菜单点击事件，执行子页面切换
function Register_event_and_switchBar() {

	//监听底部菜单点击事件，执行子页面切换
	mui(".mui-bar-tab").on('tap', 'a', function() {
		//获取被点击节点的父节点
		var parent = this.parentNode;
		//获取所有兄弟节点
		var brothers = parent.children;
		//循环判断被点击节点的位置，决定切换的子页面，index为兄弟节点的数组中对应的索引，对应子节点id
		for(var index in brothers) {
			if(brothers[index] == this) {
				document.getElementById('title').innerText = title[index];
				//调用页面切换方法
				setFrameGroupIndex(index);

				//iframe左右两边隐藏/显示的按钮 
				//				var add_device = document.getElementById('add_device');
				//				var QR_code = document.getElementById('QR_code');
				//				if(index == 1) {
				//					add_device.style.display = "block";
				//					QR_code.style.display = "block";
				//				} else {
				//					add_device.style.display = "none";
				//					QR_code.style.display = "none";
				//				}
			}
		}
	});
}

function refesh_token(token) {
	var param = {
		token: token
	};

//	mico2.refreshToken(param, function(ret, err) {
//		if(ret && ret.token) {
//			msg("刷新token成功");
//			localStorage.setItem(_TOKEN, ret.token);
//			localStorage.setItem(_CLINET_ID, ret.clientid);
//			return true;
//		} else {
//			msg("刷新token失败");
//			openWin('login', 'widget://html/login.html', true,null);
//			return false;
//		}
//	});
}

//判断用户是否已登录
function checkToken() {
	var token = localStorage.getItem(_TOKEN);
	if(!token) {
		openWin('login', 'widget://html/login.html', true,null);
	} else {
		refesh_token(token);
	}
}

//关闭APP
function closeWidget() {
	api.closeWidget({
		id: _ID,
		silent: true
	});
}

//监听安卓手机返回键
function Android_ListenKeyBack() {
	api.addEventListener({
		name: 'keyback'
	}, function(ret, err) {
		var url = location.href;
		var name = url.substr(url.length - 10, url.length);
		if(name == "login.html" || name == "index.html") {
			msg("再按一次退出应用");
			api.addEventListener({
				name: 'keyback'
			}, function(ret, err) {
				closeWidget();
			});
		}
	});
	setTimeout(function() {
		Android_ListenKeyBack();
	}, 3000);
}

//监控网络变化
function monitor_net() {
	var connectionType = api.connectionType;
	if(connectionType == "none")
		msg("网络不给力,请检查网络连接~");

	return connectionType;
}
/*校验手机号是否合法*/
function check_phone_number(phone_num) {
	//手机号码正则表达式验证，标准写法
	if((!/^1[34578]\d{9}$/.test(phone_num))) {
		msg("手机号码有误，请重填");
		return false;
	}
	return true;
}

/*校验密码是否合法*/
function check_password(passwd) {
	//密码正则表达式验证，标准写法
	if(!/^[a-zA-Z]\w{5,17}$/.test(passwd)) {
		msg("密码以字母开头，长度在6-18之间，只能包含字符、数字和下划线");
		return false;
	}

	return true;
}

function hslToRgb(h, s, l) {
	var r, g, b;

	if(s == 0) {
		r = g = b = l; // achromatic
	} else {
		function hue2rgb(p, q, t) {
			if(t < 0) t += 1;
			if(t > 1) t -= 1;
			if(t < 1 / 6) return p + (q - p) * 6 * t;
			if(t < 1 / 2) return q;
			if(t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		}

		var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		var p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function fnformatMAC(mac) {
	var formatMAC = ""; //格式化
	for(var j in mac) {
		formatMAC = formatMAC + mac[j];
		if(j > 0 && j % 2 != 0 && j != 11) {
			formatMAC = formatMAC + ':';
		}
	}
	return formatMAC;
}
