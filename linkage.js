+function ( $, window ) {

  /*
  * 作者：闫鹏飞
  * 说明：目前支持0-9级的select级联,json数据要求nodeId,pId,name
  * selObjs:传入的json数据
  * default_value:默认select显示的字符
  * SEL_PREFX:select的id的前缀，要求是13个英文字符的前缀
  *
  */

  if ( $.yanpengfei == undefined ) {
    $.yanpengfei = {}
  }

  $.yanpengfei.linkAge = function ( selObjs, default_value, SEL_PREFX ) {

    // 获取页面上所有select元素
    var _sel_dom = $(document).find("select")
    // 建立一个空数组
    var _sel_dom_array = new Array()
    // 设置select元素的id前缀
    var _SEL_PREFX = SEL_PREFX
    // 获取json数组长度
    var _selObjs_length = selObjs.length
    // select元素的前缀
    var _sel_dom_name_Prefx
     // select元素的后缀
    var _sel_dom_name_Suffix
    // select元素的id
    var _sel_dom_name
    // 循环用
    var i
    // 默认显示字符
    var _default_value = default_value
      
    // 默认参数
    if ( _SEL_PREFX == undefined ) {
      _SEL_PREFX = "yanpengfeiSe_"
    }
    
    // 遍历所有select元素
    for (var i = 0, _sel_dom_length = _sel_dom.length ; i < _sel_dom.length; i++ ) {  

      // 获取select的id
      _sel_dom_name = _sel_dom[i].id; 

      // 如果select的id大于13则符合要求
      if ( _sel_dom_name.length > 13 ) {  

        // 获取前13个字符
        _sel_dom_name_Prefx = _sel_dom_name.substring( 0, 13 ) ;  
        
        //如果dom的id名称的前13个字符为“ycathena_sel_”开头
        if ( _sel_dom_name_Prefx === _SEL_PREFX ) {  

          _sel_dom_name_Suffix = parseInt( _sel_dom_name.substring( 13, _sel_dom_name.length ) );

          if ( typeof _sel_dom_name_Suffix === "number" ) {
            //把符合要求的dom保存到数组里
            _sel_dom_array.push( _sel_dom[i].id ); 
          }

        }

      }
      
    }

    if ( _sel_dom_array.length != _selObjs_length ) {

      alert("级联数据格式不一致")
      return false

    } else {

      // 设置默认文字
      if ( _default_value != "" && typeof _default_value != "undefined") {        
        for ( i = 0 ; i <_sel_dom_array.length; i++ ){

          // 构建jQuery对象
          var _dom = $( "#"+_sel_dom_array[i] )
          str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
          _dom.append( str )

        }

      }

    }

    // 构建下一级, 通过设置pid参数进行下一级
    function next( pid, j ) {

      // 构建jQuery对象
      var _dom = $( "#"+_sel_dom_array[j] )

      // 保存option选项
      var str =""

      // 清空列表
      _dom.empty()

      // 递归调用解除
      if ( j >= _selObjs_length ) {     

        return false

      }
      
      // 默认字符
      if ( _default_value != "" && typeof _default_value != "undefined") {

        str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
        _dom.append( str )

      }

      //添加内容
      for ( i = 0 ; i < selObjs[j].length; i++ ) {

        // 父节点判断
        if ( selObjs[j][i].pId == pid ) {

          str = "<option value='"+ selObjs[j][i].nodeId +"'>"+ selObjs[j][i].name +"</option>"
          _dom.append( str )

        }

      }

      //绑定事件
      _dom.on( "change", function(){

        // 变化后后续级联默认为空
        for ( i = j+1 ; i < _sel_dom_array.length; i++ ) {

          _dom = $( "#"+_sel_dom_array[i] )
          _dom.empty()

          // 默认字符
          if ( _default_value != "" && typeof _default_value != "undefined") {

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

      // 构建jQuery对象
      var _dom = $( "#"+_sel_dom_array[0] )

      // 保存option选项
      var str =""

      //填充第一级内容
      for ( i = 0 ; i < selObjs[0].length; i++ ) {

        str = "<option value='"+ selObjs[0][i].nodeId +"'>"+ selObjs[0][i].name +"</option>"
        _dom.append( str )

      }

      //绑定事件
      _dom.on( "change", function(){

        // 第一级变化时后续全部清空
        for ( i = 1 ; i < _sel_dom_array.length; i++ ) {

          _dom = $( "#"+_sel_dom_array[i] );
          _dom.empty()

          // 默认字符
          if ( _default_value != "" && typeof _default_value != "undefined") { 

            str = "<option value='"+ _default_value +"'>"+ _default_value +"</option>"
              _dom.append( str )

          }

        }

        next( this.value, 1 )

      })

      // 没有默认字符，那么自动事件
      if ( !(_default_value != "" && typeof _default_value != "undefined") ) {

        _dom.trigger("change")

      }

    }

    init()
  }

}(jQuery,window)
