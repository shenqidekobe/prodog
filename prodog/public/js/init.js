$(function(){
	let SERVER_URL = 'http://47.97.6.82/dogs/api/';
	let DAPPID = window.location.pathname.split('/')[2];
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
	function userInfo(){return store.getItem(UK);}
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
            secret: userInfo().secret,
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
		serverHTTP('user/bindEmail',{id:userInfo().id,email:email,nickname:nickname},function(rsp){
			
		});
	});
	$("#lotteryBackBtn,#lotteryBackBtn1,#lotteryBackBtn2").click(function(){location.href='lottery.html'});
	$("#goLotteryBtn").click(function(){
		serverHTTP('lottery/start',{userId:userInfo().id},function(rsp){
			
		});
	});
});