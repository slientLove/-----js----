$().extend('animate',function(json){		//实现框架运动
	var i= 0;
	for(i=0;i<this.elements.length;i++){
		setMove(this.elements[i],json);
	}

	function getStyle(obj,arr){				//两个参数，第一个是获取谁的，第二个时什么样式
			if(obj.currentStyle){
				return obj.currentStyle[arr];				//返回对象的样式
			}else{
				return getComputedStyle(obj,false)[arr];		
			}
		}
	function setMove(obj,json,fun)
	{		
		var timer = null;
		clearInterval(obj.timer);			
		obj.timer = setInterval(function()
		{		
			//设置 oBstop 这个的目的主要是判断各个目标值到达指定值没有，只有都到达时才会关闭定时器
			var oBstop = true;				
			var iCurr=0;
			for(arr in json)
			{					//循环json只能用for in循环
				if(arr=='opacity')
				{				//arr表示对象的属性
					var iCurr = parseInt(parseFloat(getStyle(obj,arr))*100);	//透明度单独处理，将小数转换成整数
				}else{
					var iCurr = parseInt(getStyle(obj,arr));        //这里就是获取的当前div的宽度或属性值
				}
				var iSpeed = (json[arr]-iCurr)/8;
				iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);	//将当前的速度转化成整型值
				//Math.ceil向上取整，Math.floor向下取整
				if(iCurr!=json[arr])
				{
					oBstop=false;
				};	

					if(arr=='opacity')
					{
						obj.style.fliter = 'alpha(:'+(iCurr+iSpeed)+')';			//这里是用整数表示
						obj.style.opacity = (iCurr+iSpeed)/100;				//这里使用小数表示
					}else if(arr=='background')
					{
						obj.style.background = json[arr];			//当是颜色时，单独设置
					}else
					{
						obj.style[arr]= iCurr+iSpeed+'px';    //将div的宽以一定速度增加
					};
				
			}	
				//在整个循环之外去检测oBstop的值，只有当都到达时，才会关闭定时器
				if(oBstop)
					{
						clearInterval(obj.timer);	//清除当前div的定时器
						if(fun){
							fun();
						}
					}
		},30);
	}

});