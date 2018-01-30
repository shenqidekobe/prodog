$(function(){
	let SERVER_URL = 'http://47.97.6.82/dogs/api/';
	let DAPP_DOMAIN = '';
	let pathArrs=window.location.pathname.split('/');
	let DAPPID = pathArrs[2];
	let typs=pathArrs[3]||'index.html';
    let DAPP_URL = DAPP_DOMAIN+'/api/dapps/' + DAPPID;
    let store=window.sessionStorage;
    
    let ASCH_CURRENCY="ACT";
    let UK='ASCH_USER_DOG_SESSIONID';
    let validClickBtns="goChargeBtn,goWithdrawBtn,goBindEmailBtn,saveBindEmailBtn,goLotteryBtn";
    let userInfo={};
    
    console.info('to page:'+typs);
	if($('#swiper-container-1').length){
		new Swiper('#swiper-container-1', {
	        scrollbar: '.swiper-scrollbar',
	        direction: 'horizontal',
	        slidesPerView: 'auto',
	        mousewheelControl: true,
	        freeMode: true
	    });
    }
	 function toast(tips){
    	var div="<div class='toast'><span class='default'>";
    	div+=tips;
        div+="</span></div>";
        if($(".toast").length==0){
    	   $(document.body).append(div);
        }else{
           $(".default").text(tips);
        }
        $(".toast").show();
    	setTimeout(function(){
    		$(".toast").hide();
    	},2000);
    }
	function isLogin(){return store.getItem(UK)!=null;}
	function getUser(){return store.getItem(UK);}
	//远程API接口服务调用
	function serverHTTP(pathsuffix,data,callback){
		jsonAjax.post({
			url:SERVER_URL+pathsuffix,
    		data:data,
    		success:function(rsp){
    			if (rsp.code!='200') {
                    alert(rsp.msg);
                    return;
                }
    		    let rspJson=rsp.data;
    		    console.info(rspJson);
    			callback(rspJson);
    		}
		});
	}
	//ASCH的HTTP接口调用
	function aschHTTP(method,api,data,callback){
		switch(method){
		    case "get":
		    	jsonAjax.get({url:DAPP_DOMAIN+api,data:data,success:function(rsp){
	    			if (!rsp.success) {alert(rsp.error);return;}
	    			callback(rsp);
		    		}
				});
			break;
		    case "post":
		    	jsonAjax.post({url:DAPP_DOMAIN+api,data:data,success:function(rsp){
		    		if (!rsp.success) {alert(rsp.error);return;}
	    			callback(rsp);
		    		}
				});
				break;
		    case "put":
		    	jsonAjax.put({url:DAPP_DOMAIN+api,data:data,success:function(rsp){
		    		if (!rsp.success) {alert(rsp.error);return;}
	    			callback(rsp);
		    		}
				});
				break;
		}
	}
	//本地asch业务逻辑接口调用
	function interfaceASCH(api,data,callback){
		jsonAjax.post({
			url:DAPP_URL+api,
    		data:data,
    		success:function(rsp){
    			if (!rsp.success) {
                    alert(rsp.error);
                    return;
                }
    			callback(rsp);
    		}
		});
	}
	//本地的asch智能合约接口服务端签名调用
	function invokeASCH(type,fee,args,callback){
        let data = {
            secret: getUser().secret,
            fee: fee||'10000000',
            type: type,
            args: args
        }
		jsonAjax.put({
			url:DAPP_URL + '/transactions/unsigned',
    		data:data,
    		success:function(rsp){
    			if (!rsp.success) {
                    alert(rsp.error);
                    return;
                }
    			callback(rsp);
    		}
		});
	}
	function login(secret){
		jsonAjax.post({
			url:DAPP_URL + '/login',
    		data:{secret: secret},
    		success:function(rsp){
    			if (!rsp.success) {
                    alert(rsp.error);
                    return;
                }
    			var bls=rsp.account.balances;
    			var balances="";
    			for (var i in balances) {
                    var balanceInfo = bls[i];
                    var balance = Number(balanceInfo.balance) / 100000000;
                    var currency = balanceInfo.currency;
                    var bc=balance+currency;
                    balances=balances==''?bc:balances+','+bc;
                }
    			userInfo.secret = secret;
    			userInfo.publicKey = rsp.account.publicKey;
    			userInfo.address = rsp.account.address;
    			serverHTTP('user/login',{secret:secret,address:userInfo.address,publicKey:userInfo.publicKey,balances:balances},function(isp){
    				userInfo.id=isp.id;
    				store.setItem(UK,userInfo);
    				location.href='index.html';
    			});
    		}
		});
	}
	$("#goLoginBtn").click(function(){location.href='login.html';});
	$("#goChargeBtn").click(function(){location.href='charge.html';});
	$("#goWithdrawBtn").click(function(){location.href='withdraw.html';});
	$("#goBindEmailBtn").click(function(){location.href='email.html';});
    $("#goRegBtn").click(function(){location.href='register.html';});
	$("#loginBtn").click(function(){
		var secret=$.trim($("#loginSecret").val());
		if(secret=='')return false;
		login(secret);
	});
	$("#goLogoutBtn").click(function(){
		store.setItem(UK,null);
		location.href='login.html';
	});
	$("#saveBindEmailBtn").click(function(){
		var email=$.trim($("#bindEmail").val());
		var nickname=$.trim($("#bindNickname").val());
		if(email)return;
		serverHTTP('user/bindEmail',{id:getUser().id,email:email,nickname:nickname},function(rsp){
			
		});
	});
	$("#lotteryBackBtn,#lotteryBackBtn1,#lotteryBackBtn2").click(function(){location.href='lottery.html'});
	$("#goLotteryBtn").click(function(){
		serverHTTP('lottery/start',{userId:getUser().id},function(rsp){
			
		});
	});
	$(window).load(function(){
		switch(typs){
		    case "register.html"://用户注册生成新帐号
		    	aschHTTP('get','/api/accounts/new',{},function(rsp){
		    		$("#regAccout").val(rsp.secret);
		    	})
		    	$("#regNextBtn").click(function(){
		    		login($("#regAccout").val());
		    	});
			break;
			case "index.html":
			break;
			case "info.html":
				$("#infoBalance").text('666'+ASCH_CURRENCY);//我的余额
			break;
			case "info_wallet.html":
				$("#infoWallet").val('MY WALLET ADDRESS');//我的钱包地址
			break;
			case "info_dogs.html":
				data=JSON.parse(data);
			    data={list:data};
			    var html = $(template("DOGLIST", data));//我的小狗列表
		        $("#infoDogsList").html(html);
			break;
			case "info_dog_detail.html":
			    var html = $(template("DOGDETAIL", data));//我的小狗详情
			    $(".content").html(html);
			break;
			case "lettory.html":
				var html='<span class="hours">16</span><span class="minute">38</span><span class="sceond">24</span>';
				$(".time-group").html(html);//抽奖倒计时
			break;
			case "lettory_yes.html":
				var html = $(template("LOTTERYDOG", data));//中奖的狗
				$("#lotteryDogUl").html(html);
			break;
			case "market_list.html":
				data={list:data};
				var html = $(template("MARKETDOGS", data));//市场列表的狗
			    $("#marketDogsFotter").before(html);
			break;
			case "market_detail.html":
				var html = $(template("DOGDETAIL", data));//市场小狗的详情
			    $(".content").html(html);
			break;
			case "market_order.html":
				var html = $(template("MARKETORDER", data));//市场下订单
			    $(".imgTitPriTime-ul").html(html);
			break;
			case "market_order_pay.html":
				$("#amount").text('999 CAT');
				$("#fee").text('1 CAT');
				$("#total").text('1000 CAT');
				var html = $(template("MARKETORDERPAY", data));//市场订单支付
			    $("#orderPayDog").html(html);
			break;
			case "pair.html":
				$(".tit-fs18").text('HelloKimi');//配对小狗
				$("#amount").text('888 '+ASCH_CURRENCY);
			break;
			case "pair_dogs.html":
				data={list:data};
				var html = $(template("PAIRDOGS", data));//配对的小狗
			    $("#pairDogsUl").before(html);
			break;
			case "bind_email.html":
				$("#bindEmail").val();
				$("#bindNickname").val();//绑定邮箱
			break;
			case "bind_wallet.html":
				$("#bindWallet").val();//绑定钱包地址
			break;
			case "buy_list.html":
				data={list:data};
				var html = $(template("BUYDOGS", data));//购买列表的小狗
			    $("#buyListUl").before(html);
			break;
			case "buy_detail.html":
			    var html = $(template("DOGDETAIL", data));//购买小狗的详情
			    $(".content").html(html);
			break;
		}
	});
});