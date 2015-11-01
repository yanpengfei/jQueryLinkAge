+function ( $, window ) {

	$.yanpengfei.Linkage = function ( selObjs, default_value) {

		var _sel_dom = $(document).find("select")  	// 获取页面上所有select元素
		 	,_sel_dom_array = new Array()			// 建立一个空数组
		 	,_SEL_PREFX = "yanpengfei_sel_"  		// 设置select元素的id前缀
		 	,_selObjs_length = selObjs.length   	// 获取服务器返回的数组长度
		  	,_sel_dom_name_Prefx					// select元素的前缀
			,_sel_dom_name_Suffix					// select元素的后缀
			,_sel_dom_name 							// select元素的id
			,i 										// 循环用	
			,_default_value = default_value			// 默认显示字符

		// 数据稳定性判断
		for (var i = 0, _sel_dom_length = _sel_dom.length ; i < _sel_dom.length; i++ ) {  // 遍历所有select元素

			_sel_dom_name = _sel_dom[i].id 			// 获取select的id

			if ( _sel_dom_name.length > 13 ) {  	// 如果select的id大于13则符合要求

				_sel_dom_name_Prefx = _sel_dom_name.substring( 0, 13 )   // 获取前13个字符

				if ( _sel_dom_name_Prefx === _SEL_PREFX ) {  //如果dom的id名称的前13个字符为“yanpengfei_sel_”开头

					_sel_dom_name_Suffix = parseInt( _sel_dom_name.substring( 13, _sel_dom_name.length ) )

					if ( typeof _sel_dom_name_Suffix === "number" ) {

						_sel_dom_array.push( _sel_dom[i].id ) //把符合要求的dom保存到数组里

					}
				}

			}
		}

		if ( _sel_dom_array.length != _selObjs_length ) {
			var div = "<div style='position:fixed;padding-top: 300px;top:0px;left:0px;width:100%;height:100%;background-color:#000;opacity:0.8;color:#f0f0f0;text-align:center'><span>级联数据格式不一致</span></div>";
			$("body").append(div)
			return false
		} else {  // 设置默认文字
			if ( _default_value != "" && typeof _default_value != "undefined") {  			// 默认字符
				for ( i = 0 ; i <_sel_dom_array.length; i++ ){
					var _dom = $( "#"+_sel_dom_array[i] )  	// 构建jQuery对象
					str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
					_dom.append( str )
				}

			}
		}


		// 构建下一级, 通过设置pid参数进行下一级 
		function next( pid, j ) {  					

			var _dom = $( "#"+_sel_dom_array[j] )  	// 构建jQuery对象
			var str =""						   	// 保存option选项
				
			_dom.empty(); 							// 清空列表

			if ( j >= _selObjs_length ) {  			// 递归调用解除
				return 0
			}
			
			if ( _default_value != "" && typeof _default_value != "undefined") {  	// 默认字符
				str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
				_dom.append( str )
			}

			//添加内容
			for ( i = 0 ; i < selObjs[j].length; i++ ) {
				if ( selObjs[j][i].pid == pid ) {  // 父节点判断
					str = "<option value='"+ selObjs[j][i].nodeId +"'>"+ selObjs[j][i].menuName +"</option>"
					_dom.append( str )
				}
			}

			//绑定事件
			_dom.on( "change", function(){
				// 变化后后续级联默认为空
				for ( i = j+1 ; i < _sel_dom_array.length; i++ ) {
					_dom = $( "#"+_sel_dom_array[i] )
					_dom.empty(); 
					if ( _default_value != "" && typeof _default_value != "undefined") {  			// 默认字符
						str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
							_dom.append( str )
					}
				}
				next( this.value, j+1 )
			})

		}	

		// 初始化
		function init() {

			// 初始化第一级
			var _dom = $( "#"+_sel_dom_array[0] )  // 构建jQuery对象
			var str =""						   // 保存option选项

			//填充第一级内容
			for ( i = 0 ; i < selObjs[0].length; i++ ) {
				str = "<option value='"+ selObjs[0][i].nodeId +"'>"+ selObjs[0][i].menuName +"</option>"
				_dom.append( str )
			}

			//绑定事件
			_dom.on( "change", function(){

				// 第一级变化时后续全部清空
				for ( i = 1 ; i < _sel_dom_array.length; i++ ) {  
					_dom = $( "#"+_sel_dom_array[i] )
					_dom.empty()
					if ( _default_value != "" && typeof _default_value != "undefined") {  			// 默认字符
						str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
							_dom.append( str )
					}
				}
				next( this.value, 1 )
			});

			// 没有默认字符，那么自动事件
			if ( !(_default_value != "" && typeof _default_value != "undefined") ) {  	
				_dom.trigger("change")
			}

		}
		
		init()
	}

}(jQuery,window)
