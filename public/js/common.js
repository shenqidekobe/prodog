$(function(){
	let SERVER_URL = 'http://47.97.6.82/dogs/api/';
	let DAPP_DOMAIN = 'http://114.55.75.81:4096';
	let path=window.location.pathname;
	let pathArrs=path.split('/');
	let DAPPID = pathArrs[2];
	let DAPP_URL = DAPP_DOMAIN+'/api/dapps/' + DAPPID;
	
	let typs=path.substring(path.lastIndexOf("/")+1,path.length)
    let store=window.sessionStorage;
	let lstore=window.localStorage;
	var aschJS=window.AschJS;
    
    let ASCH_CURRENCY="XAS";
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
	function getUser(){if(isLogin()){return JSON.parse(store.getItem(UK));}}
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
    			callback(rsp.data);
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
	//asch的DAPP接口调用
	function aschDAPP(api,data,callback){
		jsonAjax.post({url:DAPP_URL + api,data:data,
    		success:function(rsp){
    			if (!rsp.success) {
                    alert(rsp.error);
                    return;
                }
    			callback(rsp);
    		}
		});
	}
	//asch的合约调用
	function aschCONTRACT(type,fee,args,callback){
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
                    if(currency==ASCH_CURRENCY){
                    	userInfo.balance=balance;
                    }
                    var bc=balance+currency;
                    balances=balances==''?bc:balances+','+bc;
                }
    			userInfo.secret = secret;
    			userInfo.publicKey = rsp.account.publicKey;
    			userInfo.address = rsp.account.address;
    			serverHTTP('user/login',{secret:secret,address:userInfo.address,publicKey:userInfo.publicKey,balances:balances},function(isp){
    				userInfo.id=isp.id;
    				store.setItem(UK,JSON.stringify(userInfo));
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
	var interval=null;
	function countDown(y,m,d,h,mu) { 
		var now = new Date(); 
		var endDate = new Date(y,m-1,d);
		endDate.setHours(parseInt(h));
		endDate.setMinutes(mu);
		var leftTime=endDate.getTime()-now.getTime(); 
		var leftsecond = parseInt(leftTime/1000); 
		var hour=Math.floor((leftsecond)/3600); 
		var minute=Math.floor((leftsecond-hour*3600)/60); 
		var second=Math.floor(leftsecond-hour*3600-minute*60); 
		var html='';
		if(hour>0){
			html+='<span class="hours">'+hour+'</span>';
		}if(minute>=0){
			minute=minute.length==1?("0"+minute):minute;
			html+='<span class="minute">'+minute+'</span>';
		}if(second>=0){
			second=second.length==1?("0"+second):second;
			html+='<span class="sceond">'+second+'</span>';
		}
		if(hour<=0&&minute<=0&&second<=0&&interval!=null){
			window.clearInterval(interval);
			$(".time-group").html('<span class="hours">抽奖中</span>');
			$("#goLotteryBtn").show();
		}else{
			$(".time-group").html(html);//抽奖倒计时
		}
	} 
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
				$("#infoBalance").text(getUser().balance+ASCH_CURRENCY);//我的余额
			break;
			case "info_wallet.html":
				$("#infoWallet").val('MY WALLET ADDRESS');//我的钱包地址
				$("#pubWalletBtn").click(function(){
					toast('发布成功');
					location.href='info.html';
				});
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
			case "lottery.html":
				serverHTTP('lottery/next_award',{},function(rsp){
					console.info(rsp);
					if(rsp==null){
						$("#nextLetteryBtn").text('请耐心等待');
						return false;
					}
					var date=new Date();
					var curd=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
					var serd=rsp.lotteryDate;
					var nextTxt=serd.substring(5,10);
					if(curd==serd){nextTxt='今天';}
					$("#nextLetteryBtn").text(serd.substring(5,10)+rsp.beginTime);
					//倒计时的截止时间计算，年月日时分
					var ds=serd.split("-");
					var m=ds[1],d=ds[2];
					m=(m.length==2&&m.substring(0,1))==0?m.substring(1,2):m;
					d=(d.length==2&&d.substring(0,1))==0?d.substring(1,2):d;
					var hs=rsp.beginTime.split(":");
					var h=hs[0],mu=hs[1];
					h=(h.length==2&&h.substring(0,1))==0?h.substring(1,2):h;
					mu=(mu.length==2&&mu.substring(0,1))==0?mu.substring(1,2):mu;
					interval=window.setInterval(function(){countDown(ds[0],m,d,h,mu);}, 1000); 
				});
				$("#goLotteryBtn").click(function(){
					serverHTTP('lottery/all_award',{},function(rsp){
						lstore.setItem('LOTTERY_CUR',123);
						location.href='lottery_ing.html'
					});
				});
			break;
			case "lottery_yes.html":
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
			case "charge.html":
				$("#chargeSaveBtn").click(function(){
					var amount=$.trim($("#chargeAmount").val());
					if(amount==''||Number(amount)<=0)return false;
					console.info(aschJS);
					var transaction = aschJS.transfer.createInTransfer(DAPPID, ASCH_CURRENCY, amount, getUser().secret,'');  
					console.log(JSON.stringify(transaction));
					jsonAjax.headers={magic:'594fe0f3',version:''};
					jsonAjax.post({
						url:DAPP_DOMAIN+'/peer/transactions',
			    		data:{transaction:JSON.stringify(transaction)},
			    		success:function(rsp){
			    			if (!rsp.success) {
			                    alert(rsp.error);
			                    return;
			                }
			    			console.info(rsp.transactionId);
			    		}
					});
					/*var args=[];
					args.push("dappid="+DAPPID);args.push("currency"+ASCH_CURRENCY);
					args.push("amount="+amount);args.push("secret="+getUser().secret);
					console.info( JSON.stringify(args));
					aschCONTRACT(3001,'0', JSON.stringify(args),function(rsp){
						console.info(rsg);
					});*/
				});
			break;
			case "withdraw.html":
                $("#withdrawSaveBtn").click(function(){
                	var amount=$.trim($("#withdrawAmount").val());
					if(amount==''||Number(amount)<=0)return false;
					var fee = String(0.1 * 100000000);  
					var options = {fee: fee, type: 2, args: '["'+ASCH_CURRENCY+'", "'+amount+'"]'};  
					var args=[];
					args.push(ASCH_CURRENCY);args.push(amount);
					aschCONTRACT(2,fee, JSON.stringify(args),function(rsp){
						if(rsp.success){
							toast('提现成功!');
							location.href='info.html';
						}
					});
				});
			break;
		}
	});
});