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
    let LOTTERY_FEE=5;//抽奖手续费
    let MARKET_FEE=1;//市场购买的手续费
    let UK='ASCH_USER_DOG_SESSIONID',BK='ASCH_USER_BALANCE_SESSION';
    let validClickBtns="goChargeBtn,goWithdrawBtn,goBindEmailBtn,saveBindEmailBtn,goLotteryBtn";
    let userInfo={};
    let userBalance=0;
    
    console.info('to page:'+typs);
	if($('#swiper-container-1').length){
		new Swiper('#swiper-container-1', {scrollbar: '.swiper-scrollbar',
	        direction: 'horizontal',slidesPerView: 'auto',
	        mousewheelControl: true,freeMode: true
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
	function getUrlParams(paramName) {
		var url = window.location.href;
		var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
		var r = url.substring(url.indexOf('?')).substr(1).match(reg);
		if (r != null)
			return r[2];
		return '';
	}
	function isLogin(){return store.getItem(UK)!=null;}
	function getUser(){if(isLogin()){return JSON.parse(store.getItem(UK));}}
	function getUserBalance(){if(isLogin()){return Number(store.getItem(BK));}}
	function updateUserBalance(isAdd,m){
		if(!isLogin())return;
		var s=Number(store.getItem(BK));
		if(isAdd){
			console.info("add balance ="+(s+m));
			store.setItem(BK,(s+m));
		}else{
			if(m>s)return;
			console.info("sub balance ="+(s-m));
			store.setItem(BK,(s-m));
		}
	}
	//远程API接口服务调用
	function serverHTTP(pathsuffix,data,callback){
		jsonAjax.post({url:SERVER_URL+pathsuffix,data:data,
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
		jsonAjax.post({url:DAPP_URL+api,data:data,
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
        let data = {secret: getUser().secret,fee: fee||'10000000',type: type,args: args}
		jsonAjax.put({url:DAPP_URL + '/transactions/unsigned',data:data,
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
		if(secret==''){toast('请填写您的账户助记词！');return false;}
		jsonAjax.post({url:DAPP_URL + '/login',data:{secret: secret},
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
                    	userBalance=balance;
                    }
                    var bc=balance+currency;
                    balances=balances==''?bc:balances+','+bc;
                }
    			userInfo.balance=userBalance;
    			userInfo.secret = secret;
    			userInfo.publicKey = rsp.account.publicKey;
    			userInfo.address = rsp.account.address;
    			serverHTTP('user/login',{secret:secret,address:userInfo.address,publicKey:userInfo.publicKey,balances:balances},function(isp){
    				userInfo.id=isp.id;
    				store.setItem(UK,JSON.stringify(userInfo));
    				store.setItem(BK,userBalance);
    				
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
		login(secret);
	});
	$("#goLogoutBtn").click(function(){
		store.setItem(UK,null);
		location.href='login.html';
	});
	$("#lotteryBackBtn,#lotteryBackBtn1,#lotteryBackBtn2").click(function(){location.href='lottery.html'});
	
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
	$("body").on('click', "a[login=y],button[login=y]", function(e){
		if(!isLogin()){
			location.href='login.html';
			e.preventDefault();
		}
	})
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
			case "index.html"://首页数据显示
				
			break;
			case "info.html"://我的个人信息
				if(!isLogin()){location.href='login.html';}
				$("#infoBalance").text(getUserBalance()+ASCH_CURRENCY);//我的余额
			break;
			case "info_wallet.html":
				if(!isLogin()){location.href='login.html';}
				$("#infoWallet").val('MY WALLET ADDRESS');//我的钱包地址
				$("#pubWalletBtn").click(function(){
					toast('发布成功');
					location.href='info.html';
				});
			break;
			case "info_dogs.html"://我的小狗列表
				if(!isLogin()){location.href='login.html';}
				interfaceASCH('/info/dogs',{ispair:1},function(rsp){
					var data={list:rsp.dogs};
					var html = $(template("DOGLIST", data));
				    $("#infoDogsList").html(html);
				});
			break;
			case "info_dog_detail.html"://我的小狗详情
				if(!isLogin()){location.href='login.html';}
				interfaceASCH('/fulldogs/'+id,{},function(rsp){
					var html = $(template("DOGDETAIL", rsp.dog));
				    $(".content").html(html);
				});
			break;
			case "lottery.html":
				if(!isLogin()){location.href='login.html';}
				$(".fs12").text("(消耗"+LOTTERY_FEE+ASCH_CURRENCY+")");
				
				serverHTTP('lottery/next_award',{},function(rsp){
					console.info(rsp);
					if(rsp==null){
						$("#nextLetteryBtn").text('请耐心等待');
						return false;
					}
					if(rsp.isWin){
						$("#lotteryYesTips").show();//已中奖提示
					}
					var date=new Date();
					var curd=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
					var serd=rsp.lotteryDate;
					var nextTxt=serd.substring(5,10);
					if(curd==serd){nextTxt='今天';}
					$("#nextLetteryBtn").text(serd.substring(5,10)+" "+rsp.beginTime);
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
					//先购买奖卷再抽奖
					serverHTTP('lottery/buy',{},function(rsp){
						lstore.setItem('LOTTERY_CUR',123);
						location.href='lottery_ing.html'
					});
				});
			break;
			case "lottery_yes.html"://我中奖的狗
				if(!isLogin()){location.href='login.html';}
				serverHTTP('lottery/win_list',{address:getUser().address,page:1,size:50},function(rsp){
					console.info(rsp);
					var records={list:rsp.records};
					var html = $(template("LOTTERYDOG", records));
					$("#lotteryDogUl").html(html);
				});
			break;
			case "market_list.html"://市场列表的狗
				interfaceASCH('/market/dogs',{isold:1},function(rsp){
					var data={list:rsp.dogs};
					template.helper("getGenerationStr", function(ds) {
						if(ds.generation == 0) {return "一";}
						if(ds.generation == 1) {return "二";}
						if(ds.generation == 2) {return "三";}
						if(ds.generation == 3) {return "四";}
						if(ds.generation == 4) {return "五";}
						if(ds.generation == 5) {return "六";}
					});
					var html = $(template("MARKETDOGS", data));
					$("#marketDogsFotter").before(html);
				});
			break;
			case "market_detail.html"://市场小狗的详情
				var id=getUrlParams("id");
				interfaceASCH('/fulldogs/'+id,{},function(rsp){
					var html = $(template("DOGDETAIL", rsp.dog));
				    $(".content").html(html);
				    $(document).on('mousedown','.f-click',function(event){
				    	$(this).parents($(this).attr('data-par')).find('.label').removeClass('on');
						$(this).addClass('on');
				    });
				    $("#marketBuyBtn").click(function(){
				    	location.href='market_order.html?id='+id;
				    });
				});
			break;
			case "market_order.html"://市场下订单
				if(!isLogin()){location.href='login.html';}
				var id=getUrlParams("id");
				interfaceASCH('/dogs/'+id,{},function(rsp){
					var html = $(template("MARKETORDER", rsp.dog));
				    $(".imgTitPriTime-ul").html(html);
				    
				    $("#orderBuyBtn").click(function(){
				    	location.href='market_order_pay.html?id='+id;
				    });
				});
			break;
			case "market_order_pay.html"://市场订单支付
				if(!isLogin()){location.href='login.html';}
				var id=getUrlParams("id");
				interfaceASCH('/fulldogs/'+id,{},function(rsp){
					var data=rsp.dog;
					var amount=data.amount;
					$("#amount").text(amount+' '+data.currency);
					$("#fee").text(MARKET_FEE+' '+data.currency);
					$("#total").text((MARKET_FEE+amount)+' '+data.currency);
					var html = $(template("MARKETORDERPAY", data));
				    $("#orderPayDog").html(html);
				    
				    $("#buyConfirmBtn").click(function(){
				    	var fee = String(0.1 * 100000000);  
						var args=[];
						args.push(ASCH_CURRENCY);
						args.push(amount);
						aschCONTRACT(3,fee, JSON.stringify(args),function(rsp){
							if(rsp.success){
								//等待交易结果
								toast('购买成功!');
								location.href='info.html';
							}
						});
				    });
				});
			break;
			case "pair.html"://去配对小狗
				if(!isLogin()){location.href='login.html';}
				var did=getUrlParams("did");
				if(did!=''&&did!=null){
					$(".bgc-fff").remove();
					interfaceASCH('/dogs/'+did,{},function(rsp){
						var dog=rsp.dog;
						var html = $(template("PAIRMYDOG", dog));
					    $("#peiduiDog").before(html);
					});
				}
				//配对的小狗
				$(".tit-fs18").text('HelloKimi');
				$("#amount").text('888 '+ASCH_CURRENCY);
				$("#selectDogs").click(function(){
					location.href='pair_dogs.html';
				});
				$("#pairConfirmBtn").click(function(){
					toast('开始配对!');
				});
			break;
			case "pair_dogs.html"://选择我的小狗进行配对
				if(!isLogin()){location.href='login.html';}
				interfaceASCH('/info/dogs',{ispair:1},function(rsp){
					var data={list:rsp.dogs};
					var html = $(template("PAIRDOGS", data));
				    $("#pairDogsUl").before(html);
				});
			break;
			case "bind_email.html"://绑定邮箱
				if(!isLogin()){location.href='login.html';}
				serverHTTP('user/get/'+getUser().address,{},function(rsp){
					$("#bindEmail").val(rsp.mail);
					$("#bindNickname").val(rsp.nickName);
				});
				$("#saveBindEmailBtn").click(function(){
					var email=$.trim($("#bindEmail").val());
					var nickname=$.trim($("#bindNickname").val());
					if(email=='')return;
					serverHTTP('user/bindEmail',{id:getUser().id,email:email,nickname:nickname},function(rsp){
						toast('绑定成功!');
						location.href='info.html';
					});
				});
			break;
			case "bind_wallet.html"://绑定钱包地址
				if(!isLogin()){locatiosn.href='login.html';}
				serverHTTP('user/get/'+getUser().address,{},function(rsp){
					$("#bindWallet").val(rsp.wallet);
				});
				$("#saveBindWalletBtn").click(function(){
					var wallet=$.trim($("#bindWallet").val());
					if(wallet=='')return;
					serverHTTP('user/bindWallet',{id:getUser().id,wallet:wallet},function(rsp){
						toast('绑定成功!');
						location.href='info.html';
					});
				});
			break;
			case "buy_list.html"://购买列表的小狗
				interfaceASCH('/market/dogs',{isold:1},function(rsp){
					var data={list:rsp.dogs};
					var html = $(template("BUYDOGS", data));
				    $("#buyListUl").before(html);
				});
			break;
			case "buy_detail.html"://购买小狗的详情
				var id=getUrlParams("id");
				interfaceASCH('/fulldogs/'+id,{},function(rsp){
					var html = $(template("DOGDETAIL", rsp.dog));
				    $(".content").html(html);
				});
			    $("#buyBackBtn").click(function(){
			    	location.href=window.history.go(-1);
			    });
			break;
			case "charge.html"://充值页面
				if(!isLogin()){location.href='login.html';}
				$("#currencyText").text(ASCH_CURRENCY);
				$("#chargeSaveBtn").click(function(){
					var amount=$.trim($("#chargeAmount").val());
					if(amount==''||Number(amount)<=0)return false;
					console.info(aschJS);
					var transaction = aschJS.transfer.createInTransfer(DAPPID, ASCH_CURRENCY, amount, getUser().secret,'');  
					console.log(transaction);
					jsonAjax.headers={magic:'594fe0f3',version:'',"Content-Type":"application/json;charset=utf-8"};
					var data={transaction:transaction};
					jsonAjax.post({
						url:DAPP_DOMAIN+'/peer/transactions',
			    		data: JSON.stringify(transaction),
			    		success:function(rsp){
			    			if (!rsp.success) {
			                    alert(rsp.error);
			                    return;
			                }
			    			updateUserBalance(true,(Number(amount)));
			    			console.info(rsp);
			    		}
					});
				});
			break;
			case "withdraw.html"://提现页面
				if(!isLogin()){location.href='login.html';}
				$("#currencyText").text(ASCH_CURRENCY);
                $("#withdrawSaveBtn").click(function(){
                	var amount=$.trim($("#withdrawAmount").val());
					if(amount==''||Number(amount)<=0)return false;
					var fee = String(0.1 * 100000000);  
					var options = {fee: fee, type: 2, args: '["'+ASCH_CURRENCY+'", "'+amount+'"]'};  
					var args=[];
					args.push(ASCH_CURRENCY);
					args.push(amount);
					aschCONTRACT(2,fee, JSON.stringify(args),function(rsp){
						if(rsp.success){
							toast('提现成功!');
							updateUserBalance(false,(Number(amount)+Number(fee)));
							location.href='info.html';
						}
					});
				});
			break;
			case "success_pair.html"://配对成功提示页面
				$("#pairBackBtn").click(function(){location.href="info.html";});
			break;
			case "success_give.html"://赠送成功提示页面
				$("#successBackBtn").click(function(){location.href="info.html";});
			break;
			case "success_pay.html"://支付成功提示页面
				$("#successPayBtn").click(function(){location.href="info.html";});
			break;
		}
	});
});