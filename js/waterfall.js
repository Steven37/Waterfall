window.onload = function() {
	// 1、设置整个容器的宽度
	// 2、记录每列的高度，第一排的图片摆放后直接存入数组里面，
	// 从下一排摆放图片的时候寻找列高数组中最低的那一列开始摆放
	// 并且在相应列上摆放了图片之后，改变相应列高。
	// 3、考虑动态加载——当前容器中的最后一个元素露出一半高度之后，动态向容器中添加元素
	var dataInt={'data':[{'src':'70.jpg'},{'src':'71.jpg'},{'src':'72.jpg'},{'src':'73.jpg'}]};//从后端取数据
	waterfall("main","box");

	window.onscroll = function(){
		if(checkHeight){//当最后一个元素露出一半时 开始加载其他元素
			var oParent = document.getElementById("main");
			for(var i = 0;i<dataInt.data.length;i++){
				var oDiv = document.createElement("div");
				oDiv.className = "box";
				oParent.appendChild(oDiv);
				var oImg = document.createElement("img");
				oImg.src = "images/"+dataInt.data[i].src;
				oDiv.appendChild(oImg);
			}
			waterfall("main","box"); //调整格式
		}
	}
}

function waterfall(parent,clsName){
	//找到所有的图片子集
	var oParent = document.getElementById(parent);
	var oKids = getKidsByClassName(parent,clsName);
	var okW = oKids[0].offsetWidth+15; //每一个子元素所占的宽度
	var num = Math.floor(document.documentElement.clientWidth/okW);//屏幕最多能放多少列
	var mainW = okW*num;
	oParent.style.cssText = "width:"+mainW+"px;margin:0 auto"; //让整个容器居中

	var hArr = [];
	for(var i = 0; i<oKids.length;i++){
		if(i<num){
			hArr.push(oKids[i].offsetHeight+15); //把第一排的列高放进去
		}else{
			var minH = Math.min.apply(null,hArr); //找出一列中列高最小的 下一个元素就放在这一列
			var minIndex = hArr.indexOf(minH);
			var left = (oKids[i].offsetWidth+15)*minIndex;
			oKids[i].style.cssText = "position:absolute;top:"+minH+"px;left:"+left+"px;"; //将元素设置成绝对定位，设置top left值
			hArr.splice(minIndex,1,minH+oKids[i].offsetHeight+15); //修改列高
		}
	}
}

// 获得所有的图片
function getKidsByClassName(parent,clsName){
	var oParent = document.getElementById(parent);
	var oAllKids = oParent.getElementsByTagName("*");
	var oKids = [];
	for(var i = 0;i < oAllKids.length;i++){
		if(oAllKids[i].className == clsName){
			oKids.push(oAllKids[i]);
		}
	}

	return oKids;
}

function checkHeight(){
	var oParent = document.getElementById("main");
	var oKids = getKidsByClassName("main","box");
	var lastKid = oKids[oKids.length-1];
	var lastH = lastKid.offsetTop+Math.floor(lastKid.offsetHeight/2);//最后一个元素漏出一半高度
	var scrollH =document.documentElement.scrollTop||document.body.scrollTop;//注意解决兼容性 滚动的高度
	var screeH = document.body.clientHeight || document.documentElement.clientHeight;//页面高度
	return lastKid < scrollH+screeH; //当最后一个元素露出一半时 开始加载其他元素

}