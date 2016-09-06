//add the colorpicker to the canvas
//亮度和饱和度
var bsliderMask;
var ssliderMask;
var width = 0.69 * document.body.clientWidth;
//图片像素是80px，一半为40px
var switchbttop = width / 2;
var switchbleft = (document.body.clientWidth / 2) - 40;
//上次的color指数
var lastrgbcode;

const RGBLED_ON_SRC = "widget://img/switchon.svg";
const RGBLED_OFF_SRC = "widget://img/switchoff.svg";

//确定拾色器的大小
$('#canvas_colorPicker').attr('width', width).attr('height', width);
//确定开关的位置
$('#rgb_Switch').css('top', switchbttop).css('left', switchbleft);

//实例化
var colorPicker = new colorPicker(document.getElementById('canvas_colorPicker'), {
	onFinishClick: function() { //完成点击后发送控制命令
		var rgb;
		var color = this.getColorHSL();
		var color_angle = parseInt(color.h * 360); //只获取角度

		rgb = hslToRgb(color.h, 0.5, 0.5);

		alert(JSON.stringify(color) + rgb[0] + "  " + rgb[1] + "  " + rgb[2]);

		//可以控制设备了
		//document.getElementById("m_show_data").innerHTML = JSON.stringify(color);
	}
});

////rgb开关控制
//$("#rgb_Switch").click(function() {
//	var btnsrc = $("#rgb_Switch").attr("src");
//	if("../img/switchon.svg" == btnsrc) {
//		$("#rgb_Switch").attr("src", "../img/switchoff.svg");
//		colorPicker.setColorHSV(0.3,0,0);
//		
//		//window.clearInterval(rgbctrlinterval);
//		//dealwithrgbbtn(false);
//	} else {
//		$("#rgb_Switch").attr("src", "../img/switchon.svg");
//		//dealwithrgbbtn(true);
//		//ctrlrgb();
//	}
//});


function toggle_rgbled_switch(switch_obj){
	if(switch_obj.src == RGBLED_ON_SRC){
		switch_obj.src == RGBLED_OFF_SRC;
	}else{
		switch_obj.src == RGBLED_ON_SRC;
	}
}

//亮度范围：0-100
function brightness_slider_onChanged(self) {
	var my = self;
	mui.toast("brightness_slider_onChanged:value=" + my.value);
}

//饱和度范围：0-100
function saturation_slider_onChanged(self) {
	var my = self;
	mui.toast("saturation_slider_onChanged:value=" + my.value);
}


//关闭当前页面
function quit_rgbled_html(){
	closeWin();
}

