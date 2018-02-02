var Ajax = {
	ajax : function(ajaxOptions){
		$.ajax({
			url : ajaxOptions.url,
			type : ajaxOptions.type,
			data : ajaxOptions.data,
			global : ajaxOptions.global == null ? true : ajaxOptions.global,
			beforeSend : function(xhr) {
				var headers = ajaxOptions.headers;
				if(headers){
					for(var name in headers){       
						xhr.setRequestHeader(name,headers[name]);
					};
				};
			},
			success : function(data,textStatus,request) {
				var flag=request.getResponseHeader('flag');
				if(data.result=="NOLOGIN"||flag=='login'){
					window.location.href='login.html';
				}else{
					ajaxOptions.success(data);
				}
			},
			error : function(XMLHttpRequest, textStatus, errorThrown){
				if(ajaxOptions.error){
					ajaxOptions.error(XMLHttpRequest, textStatus, errorThrown);
				}
			}
		});
	},
	hiddenHttpMethod : function(url, type){
		if(-1<url.indexOf("?")){
			url += "&_method="+type;
		}else{
			url += "?_method="+type;
		}
		return url;
	},
	get : function(ajaxOptions){
		ajaxOptions.type = "get";
		this.ajax(ajaxOptions);
	},
	post : function(ajaxOptions){
		ajaxOptions.type = "post";
		this.ajax(ajaxOptions);
	},
	del : function(ajaxOptions){
		ajaxOptions.url = this.hiddenHttpMethod(ajaxOptions.url, "delete");
		ajaxOptions.type = "get";
		this.ajax(ajaxOptions);
	},
	put : function(ajaxOptions){
		ajaxOptions.url = this.hiddenHttpMethod(ajaxOptions.url, "put");
		ajaxOptions.type = "put";
		this.ajax(ajaxOptions);
	}
};
var jsonAjax = {
	headers : {
		"Accept" : "application/json, text/javascript, */*",
		// "Content-Type" : "application/json;charset=UTF-8",
	},
	dataToJson : function(data){
		// return JSON3.stringify(data);
		return data;
	},
	setData : function(ajaxOptions){
		ajaxOptions.headers = this.headers;
		ajaxOptions.headers=$.extend({},ajaxOptions.headers,{ssoToken : ''});
		ajaxOptions.data = this.dataToJson(ajaxOptions.data);
		var key="8SJ2KSDNS%KSAL1AK29ZXNVMQ@Q1";
        ajaxOptions.data=jsonAjax.objKeySort(ajaxOptions.data);
        var req="";
        for(var p in ajaxOptions.data){
        	 if(req==""){
        	    req=p+"="+ajaxOptions.data[p];
        	 }else{
        		req=req+"&"+p+"="+ajaxOptions.data[p];
        	 }
        }
        if(req==""){req=key;
     	 }else{req=req+'&'+key}
         var sign=$.md5(req);
         ajaxOptions.data.verifySign=sign;
	},
	get : function(ajaxOptions){
		this.setData(ajaxOptions);
		Ajax.get(ajaxOptions);
	},
	post : function(ajaxOptions){
		this.setData(ajaxOptions);
		Ajax.post(ajaxOptions);
	},
	del : function(ajaxOptions){
		this.setData(ajaxOptions);
		Ajax.del(ajaxOptions);
	},
	put : function(ajaxOptions){
		this.setData(ajaxOptions);
		Ajax.put(ajaxOptions);
	},
	random:function(len){
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		var maxPos = $chars.length;
		var tmp = '';
		var timestamp = new Date().getTime();
		for (var i = 0; i < len; i++) {
			tmp += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return  timestamp+tmp;
	},
	objKeySort:function(arys) { 
		var newkey = Object.keys(arys).sort();　　 
        var newObj = {}; 
        for(var i = 0; i < newkey.length; i++) {
            newObj[newkey[i]] = arys[newkey[i]]; 
        }
        return newObj;
    }
};
