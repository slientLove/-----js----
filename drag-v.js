$().extend('drag',function(){
	var i=0;
	for(i=0;i<this.elements.length;i++){
		drag(this.elements[i]);
	}
	function drag(oDiv){
		oDiv.onmousedown = function(ev){
			var oEvent = ev||event;
			var disX = oEvent.clientX-oDiv.offsetLeft;
			var disY = oEvent.clientY-oDiv.offsetTop;
		document.onmousemove = function(ev){
			var oEvent = ev||event;
			var l = oEvent.clientX-disX;
			var t = oEvent.clientY-disY;
			oDiv.style.left = l+'px';
			oDiv.style.top = t+'px';	//拖拽由一个个点组成，方向由两个点决定
		}
		document.onmouseup = function(){
			document.onmousemove=document.onmouseup=null;
		}
		};
	}
});