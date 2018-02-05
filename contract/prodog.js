let bignum = require('bignumber')

module.exports = {
  //发布新的小狗
  publishDog: async function (generation,dogname,address, genes, picode, picurl,father,mother,constellation,israre) {
    //app.validate('string', generation, {number: {onlyInteger: true, greaterThanOrEqualTo:0, lessThanOrEqualTo: 8}})
    app.validate('string', picode, {length: { minimum: 5, maximum: 256 }})
    //app.validate('string', picurl, {url: { schemes: ["http", "https"] }})
    
    app.sdb.lock('publishDog@' + picode)
    let exists = await app.model.Dog.exists({ picode: picode })
    if (exists) return
    
    app.sdb.create('Dog', {
      id: app.autoID.increment('dog_max_id'),
      dogname: dogname||'',
      address: address||'',
      genes: genes || '',
      picode: picode || '',
      picurl: picurl||'',
      father: father||'',
      mother: mother||'',
      constellation: constellation||'',
      israre:israre||0,
      createtime:(new Date()).toLocaleString()
    })
  },
  //修改小狗的基本信息
  updateDog: async function (id,amount,owner,isold,soldtime,
		  ispair,pairamount,paircount,pairtime,culturetime,israre,status) {
    let obj = await app.model.Dog.findOne({ condition: { id: id } })
    if (!obj) return 'Dog not found';
    
    app.sdb.update('Dog', {
      amount: amount || obj.amount,
      owner: owner||obj.owner,
      isold: isold||obj.isold,
      soldtime: soldtime||obj.soldtime,
      ispair: ispair||obj.ispair,
      pairamount: pairamount||obj.pairamount,
      paircount: paircount||obj.paircount,
      pairtime: pairtime||obj.pairtime,
      culturetime: culturetime||obj.culturetime,
      israre: israre||obj.israre,
      status: status||obj.status
    },{
      id:id
    })
  },
  //修改小狗的昵称
  updateDogNickName: async function (id,nickname) {
	app.validate('string', nickname, {length: { minimum: 2, maximum: 64 }})
    let obj = await app.model.Dog.findOne({ condition: { id: id } })
    if (!obj) return 'Dog not found';
    
    app.sdb.update('Dog', {
      nickname: nickname||obj.nickname
    },{
      id:id
    })
  },
  //address用户购买小狗
  buyDog: async function(id,address,owner,source){
	  app.validate('string', address, {length: { minimum: 1, maximum: 128 }})
	  let obj = await app.model.Dog.findOne({ condition: { id: id } })
	  if (!obj) return 'Dog not found';
	  if (obj.status!=3) return 'Dog Status is not saleing';
	    
	  app.sdb.update('Dog', {
		  address: address,
		  owner: owner||'',
		  amount:null,
		  pairamount:null,
		  status:2,
		  source: '2'
	  },{
	      id:id
	  })
  },
  //address用户转让小狗给toAddress
  assignDog: async function(id,address,toAddress,owner,source){
	  app.validate('string', toAddress, {length: { minimum: 1, maximum: 128 }})
	  let obj = await app.model.Dog.findOne({ condition: { id: id } })
	  if (!obj) return 'Dog not found';
	  if (obj.status!=3) return 'Dog Status is not saleing';
	    
	  app.sdb.update('Dog', {
		  address: toAddress,
		  owner: owner||'',
		  amount:null,
		  pairamount:null,
		  status:2,
		  source:'3'
	  },{
	      id:id
	  })
  },
  //更新我的小狗配对价格信息
  updateDogPair: async function(id,pairamount,ispair,pairtime,culturetime){
	  let obj = await app.model.Dog.findOne({ condition: { id: id } })
	  if (!obj) return 'Dog not found';
	    
	  app.sdb.update('Dog', {
		  pairamount: pairamount||obj.pairamount,
		  ispair: ispair||obj.ispair,
		  pairtime: pairtime||obj.pairtime,
		  culturetime: culturetime||obj.culturetime
	  },{
	      id:id
	  })
  },
  //我的小狗开始配对(只有常规状态下才能配对)
  startPair: async function(id,pid){
	  let myDog = await app.model.Dog.findOne({ condition: { id: id } })
	  if (!myDog) return 'Dog not found';
	  if (myDog.status!=2) return 'Dog Status is not normal';
	  let pairDog = await app.model.Dog.findOne({ condition: { id: pid } })
	  if (!pairDog) return 'PairDog not found';
	  if (pairDog.status!=2) return 'PairDog Status is not normal';
	    
	  app.sdb.update('Dog', {
		  pairstarttime: (new Date()).toLocaleString(),
		  pairprevtime: (new Date()).toLocaleString(),
		  status: 4
	  },{
	      id:id
	  })
	  app.sdb.update('Dog', {
		  pairstarttime: (new Date()).toLocaleString(),
		  pairprevtime : (new Date()).toLocaleString(),
		  status: 4
	  },{
	      id:pid
	  })
  },
  //我的小狗结束配对
  endPair: async function(id,pid){
	  let myDog = await app.model.Dog.findOne({ condition: { id: id } })
	  if (!myDog) return 'Dog not found';
	  let pairDog = await app.model.Dog.findOne({ condition: { id: pid } })
	  if (!pairDog) return 'PairDog not found';
	    
	  app.sdb.update('Dog', {
		  paircount: myDog.paircount+1,
		  status: 2
	  },{
	      id:id
	  })
	  app.sdb.update('Dog', {
		  paircount: myDog.paircount+1,
		  status: 2
	  },{
	      id:pid
	  })
	  //TODO:结束配对后生育出一只小狗。
  },
  //将我的小狗发布到市场销售(设置出售价格)
  updateDogSold: async function (id,amount,isold) {
	app.validate('string', amount, {length: { minimum: 1, maximum: 16 }})
    let obj = await app.model.Dog.findOne({ condition: { id: id } })
    if (!obj) return 'Dog not found';
	if (obj.status!=2) return 'Dog Status is not normal';
    
    app.sdb.update('Dog', {
    	amount: amount||obj.amount,
    	isold: isold||obj.isold,
    },{
      id:id
    })
  }
}