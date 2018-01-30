$(function(){
	let SERVER_URL = 'http://47.97.6.82/dogs/api/';
	let pathArrs=window.location.pathname.split('/');
	let DAPPID = pathArrs[2];
	let typs=pathArrs[3]||'index.html';
    let DAPP_URL = '/api/dapps/' + DAPPID;
    let UK='asch_user_dog_sessionID';
    let store=window.sessionStorage;
    let validClickBtns="goChargeBtn,goWithdrawBtn,goBindEmailBtn,saveBindEmailBtn,goLotteryBtn";
    let userInfo={};
    
	if($('#swiper-container-1').length){
		new Swiper('#swiper-container-1', {
	        scrollbar: '.swiper-scrollbar',
	        direction: 'horizontal',
	        slidesPerView: 'auto',
	        mousewheelControl: true,
	        freeMode: true
	    });
    }
	function isLogin(){return store.getItem(UK)!=null;}
	function getUser(){return store.getItem(UK);}
	function serverHTTP(pathsuffix,args,callback){
		jsonAjax.post({
			url:SERVER_URL+pathsuffix,
    		data:data,
    		success:function(rsp){
    			if (rsp.code!='200') {
                    alert(rsp.msg);
                    return;
                }
    		    let rspJson=rsp.responseJson;
    		    console.info(rspJson);
    			callback(rspJson);
    		}
		});
	}
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
	$("#goLoginBtn").click(function(){location.href='login.html';});
	$("#goChargeBtn").click(function(){location.href='charge.html';});
	$("#goWithdrawBtn").click(function(){location.href='withdraw.html';});
	$("#goBindEmailBtn").click(function(){location.href='email.html';});
	$("#loginBtn").click(function(){
		var secret=$.trim($("#loginSecret").val());
		if(secret)return;
		jsonAjax.post({
			url:DAPP_URL + '/login',
    		data:{secret: secret},
    		success:function(rsp){
    			if (!rsp.success) {
                    alert(rsp.error);
                    return;
                }
    			userInfo.secret = secret;
    			userInfo.publicKey = rsp.account.publicKey;
    			userInfo.address = rsp.account.address;
    			serverHTTP('user/login',{secret:secret,address:userInfo.address,publicKey:userInfo.publicKey},function(rsp){
    				userInfo.id=rsp.id;
    				store.setItem(UK,userInfo);
    			});
    		}
		});
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
	serverHTTP('user/list',{page:1,pageSize:10},function(data){
	  data=JSON.parse(data);
	  data={list:data};
	  var html = $(template("LIST", data));
      $(".dataList").html(html);
	});
	$(window).load(function(){
		switch(typs){
			case "index.html":
			break;
			case "info.html":
				$("#infoBalance").text('666ACT');//我的余额
			break;
			case "info_wallet.html":
				$("#infoWallet").val('MY WALLET ADDRESS');//我的钱包地址
			break;
			case "info_dogs.html":
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
				$("#amount").text('888 ACT');
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