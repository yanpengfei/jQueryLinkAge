+function ( $, window ) {

		$.yanpengfei.input.text.autoPrompt = function( url, selectid, domid, autolist ) {
			var _url = url  //ajax地址
				,_domid = "#"+domid  // domid
				,_autolist = "#"+autolist    // 课程名dom id
				,_selectid = "#" + selectid   // 能力项dom select
				,_dom
				,_ajax
				,_oldtime
				,_okajax = true;	// true表示可以ajax，false标识不可，由时间控制，1秒内不重复请求


				var _oldDate = new Date();
				_oldtime = _oldDate.getSeconds();  //获取秒

				_dom = $( _domid );

				_dom.on( "keyup", function(){
					var _newDate = new Date();
					var _newtime = _newDate.getSeconds();  //获取秒
					var _diffSecond;
					_diffSecond = _newtime - _oldtime; // 1秒间隙
					
					// console.log( _diffSecond );
					if ( _diffSecond !== 0 ) {
						_okajax = true;
						// console.log( "可以" );
					}else {
						_okajax = false;
						// console.log( "不可以" );
					}
					_oldtime = _newtime;  //保存新秒数

					if ( _okajax ) {
						setTimeout(function(){
							stopAjax();  // 首先停掉上一个ajax
							getList();  //开始新的
						},500);
					}
					if( $("#"+domid).val() =="" ) {
						$(_autolist).css("display","none")
					}


				});

				function getList() {
					var _txt = _dom.val();  // 获取课程名称内容
					var _sel = $(_selectid).val();  // 获取能力项选项
					var _data = "";
					// 空值判断
					if ( $.trim(_txt) == "") {
						// console.log("不会开始ajax");
						removelist();
						return false ;
					}
					if ( isNaN( parseInt( _sel ) ) ) {  // 如果不是数字
						_sel="";
						// removelist();
						// return false;
					}
					console.log( "开始ajax", _txt, _sel );

					_data = "nodeId="+_sel+"&curriculumName=" + _txt;
					// _data = decodeURIComponent(escape(_data));
					_ajax = $.ajax({
		           		type:"get",    
		           		url:_url,  
		           		contentType: "application/json; charset=utf-8", 
		           		data:_data,  
		           		dataType:"JSON",  
		           		error:function(){console.log( "error" )},  
		           		success:function(data){
		           			if ( data.code == 200 ) {
		           				removelist();
		           				showlist( data );
		           			}
		           		}
	    			});  
				}

				function stopAjax(){  
			    	//如若上一次AJAX请求未完成，则中止请求  
			    	if( _ajax ) {
			    		_ajax.abort();
			    	}  
				} 

				// 显示列表
				function showlist( obj ) {
					var _left
						,_right
						,_obj = obj.data
						,_div = $(_autolist)  // 显示提示的div
						,_listlength = _obj.length
						,_str
						;
					// alert(typeof obj.length);
					console.dir(obj.data);
					if ( obj.data.length == 0 ) {
						$(_autolist).css("display","none");
					}else
					{
						$(_autolist).css("display","block");
					}
					// 注释掉的是准备自动定位用的
					// _dom = document.getElementById(autolist);
					// console.log(_dom.getBoundingClientRect().top);
					// console.log(_dom.getBoundingClientRect().left);
					// console.dir(_dom);

					// _div.html( _listlength);
					// console.log(_obj[1].curriculumName, _listlength);
					for (var i =0 ;i < _listlength; i++ ) {
						_str = "<p style=\"height:25px;line-height:25px;\" onclick='YCATHENA_SET(this.innerHTML)' onmouseover=\"this.style.backgroundColor='#18bc9c'\" onmouseout=\"this.style.backgroundColor='#fff'\">"+  _obj[i].curriculumName +"</p>";
						_div.html( _div.html() + _str);
					}
					// 通知一下
					// console.dir( _obj );
				}

				//移除列表内容
				function removelist() {
					$(_autolist).find("p").remove();
				}

				// 注册到window的函数,p的click事件
				window.YCATHENA_SET = function(txt) {
					_dom.val(txt);
					removelist();
					$(_autolist).css("display","none");
					_dom.trigger("blur");

				}
				$(document).on("click",function(){
					removelist();
					$(_autolist).css("display","none");
				});

		}

}(jQuery,window)
