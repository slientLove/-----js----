
function addEvent(element,type,fn){				//添加事件监听
		if(element.addEventListener){
			 element.addEventListener(type,function(ev){
			 	//判断fn()函数的返回值,如果为false则阻止默认事件
			 	if(fn.call(element)==false){
			 		ev.preventDefault();	//实现阻止事件冒泡和默认事件
			 		ev.stopPropagation();	//只有当返回值为false时才阻止
			 	}
			 },false);	//DOM2级事件
		}else if(element.attachEvent){				//兼容IE浏览器
			element.attachEvent('on'+type,function(){	
 // call()此处是消除IE对于this的影响，IE会将this解释为window,而不是元素本身
 // call()的第一个参数将this转换成参数本身	
		 	if(fn.call(element)==false){
		 		event.cancelBubble=true;
			 	return false;
			}	
 		});						
		}else{
			 element['on'+type] = fn;
		}
};
//声明一个构造函数，形成原型基础
function AddVquery(vQuery){
	this.elements = [];				//创建一个数组用来存储获取返回的元素
	switch(typeof vQuery){
		case "function":
			addEvent(window,'load',vQuery);
			break;
		case'string':        				//子符串也要分几种情况，'#'，'.'等	
			switch(vQuery.charAt(0)){
				case'#': 					//id选择器
					var obj = document.getElementById(vQuery.substring(1));
					this.elements.push(obj);
					break;
				case'.':
					this.elements= getClass(document,vQuery.substring(1));	//类选择器
					break;
				default:
					this.elements = document.getElementsByTagName(vQuery);	//标签选择
			}
			break;
		case'object':
			this.elements.push(vQuery);			//传进来的是对象，直接放进数组
			break;
		}
};


function getClass(obj,attr){		//获取元素的class属性
	var Tag = obj.getElementsByTagName('*');
	var result = [];
	var i=0;
	for(i=0;i<Tag.length;i++){
		if(Tag[i].className==attr){
			result.push(Tag[i]);			//将匹配的元素存放在数组中
		}
	}
	return result;
};


function getStyle(obj,attr){					//获取元素非行样式
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	}else{
		return getComputedStyle(obj,false)[attr];
	}
};


//  给每个元素添加一个事件
AddVquery.prototype.click = function(fn){	//在原型上添加一个事件,原型扩展，面向对象
	var i=0;
	for(i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'click',fn);			//绑定事件
	}
	return this;
};

//鼠标移入事件和移出事件
AddVquery.prototype.hover = function(Over,Out){			
	var i=0;
	for(i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',Over);
		addEvent(this.elements[i],'mouseout',Out);
	}
	return this;
};

//添加隐藏样式
AddVquery.prototype.hide = function(){
	var i=0,len;
	for(i=0,len=this.elements.length;i<len;i++){
		this.elements[i].style['display'] = 'none';
	}
}

//添加显示样式
AddVquery.prototype.show = function(){
	var i=0,len;
	for(i=0,len=this.elements.length;i<len;i++){
		this.elements[i].style['display'] = 'block';
	}
	return this;
}

//添加css样式
AddVquery.prototype.css = function(attr,value){			
	if(arguments.length==2){		//可变参数，判断传入的参数个数
		var i=0;
		for(i=0;i<this.elements.length;i++){
			this.elements[i].style[attr] = value;
		}
	}else{
		if(typeof attr =="string"){
			//当有多个元素时，只返回第一个元素的值
			return getStyle(this.elements[0],attr);			
		}else{			//传进来的可能是一个json数据集
			for(var i=0;i<this.elements.length;i++){
				var k='';
				for(k in attr){
					this.elements[i].style[k] = attr[k];
				}
			}
		}
		
	}
	return this;				//返回对象本身,可以连接其他运动样式
};

//添加动态的判断点击次数方法
AddVquery.prototype.toggle = function(){
	var i=0;
	var _arguments = arguments;					//将动态参数数组存储起来
	for(i=0;i<this.elements.length;i++){
		addToggle(this.elements[i]);			
	}
		//为每一个按钮添加一个点击事件，使count都从零开始算起
	function addToggle(obj){					
		var count=0;
		addEvent(obj,'click',function(){
			//这里用了计数的方法
			_arguments[count++%_arguments.length].call(obj);	//让this指向当前这个对象
		})
	}
	return this;
}

//attr为属性，value为设置的值
AddVquery.prototype.attr = function(attr,value){	
	var i=0,len;
	if(arguments.length==2){
		for(i=0,len=this.elements.length;i<len;i++){
			this.elements[i][attr] = value;		//给属性设置值
		}
	}else{
		return this.elements[0][attr];		//返回第一个对象的属性
	}
}

//传入一个参数，选择要改变的序号
AddVquery.prototype.eq = function(n){			
	//用$符号将对象包装成VQuery对象，否则直接返回的对象没有直接的方法可以使用
	var arr = this.elements[n];				
	return $(arr);
};

function pushElement(arr1,arr2){
	var i =0;
	for(i=0;i<arr2.length;i++){
		arr1.push(arr2[i]);
	}
}
//添加一个查找方法find()
AddVquery.prototype.find = function(str){
	var i=0,len;
	var result = [];			//用来存放处理后的字符串
	for(i=0,len=this.elements.length;i<len;i++){
		switch(str.charAt(0)){
			case '.': 			//class
				var aEle = getClass(this.elements[i],str.substring(1))		//截取第一位至后面的字符串
				result = result.concat(aEle);
				break;
			default: 	//标签名
				var aEle = this.elements[i].getElementsByTagName(str);
				//由于aEle是一个元素集合，并不是一个真正的数组，他不能使用数组的concat方法
				//result = result.concat(aEle);
				pushElement(result,aEle);
				break;
		}
	}
	var Vquery = $();		//定义一个空的vQuery对象
	Vquery.elements = result;	//将result设置为他的elements属性(elements应该代表元素)
	return Vquery;
}

function getIndex(obj){
	var aBrother = obj.parentNode.children;		//取得父元素的所有子集,与他同极的都是兄弟节点
	var i =0;
	for(i=0;i<aBrother.length;i++){
		if(aBrother[i]==obj){
			return i;
		}
	}
	return this;
}
//添加index方法
AddVquery.prototype.index = function(){
	 return getIndex(this.elements[0]);				//传入第一个子元素
}

//添加阻止默认事件和冒泡事件
AddVquery.prototype.bind = function(sEv,fn){		//sEv为事件名,fn为操做函数
	for(var i =0;i<this.elements.length;i++){
		addEvent(this.elements[i],sEv,fn);		//为每一个元素添加一个事件
	}
}


//添加插件机制,实现方法的扩展
AddVquery.prototype.extend = function(name,fn){		//name函数的名字，fn函数操作
	//在AddVquery的原型上添加一个名为name的操作
	AddVquery.prototype[name] = fn;		
}
	// $().extend('show',function(){		//为原型添加一个show的方法
	// 	alert('1');
	// });

	// $().show();				//现在这个show()方法就添加到原型上了


//构造一个$函数，这样使用更方便，模仿jQuery
function $(vArg){					
	return new AddVquery(vArg);
}