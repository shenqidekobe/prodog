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
    let obj = await app.model.Dog.findOne({ id: id })
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
	id = Number(id)
    let obj = await app.model.Dog.findOne({ id: id })
    if (!obj) return 'Dog not found';
    
	app.sdb.update('Dog',{nickname: nickname},{id:id})
  },
  //address用户购买小狗
  buyDog: async function(id,address,owner,source){
	  app.validate('string', address, {length: { minimum: 1, maximum: 128 }})
	  id = Number(id)
	  let obj = await app.model.Dog.findOne({ id: id })
	  if (!obj) return 'Dog not found';
	  if (obj.status!=3) return 'Dog Status is not saleing';
	    
	  app.sdb.update('Dog',{address:address},{id:id})
	  app.sdb.update('Dog',{owner:owner||''},{id:id})
	  app.sdb.update('Dog',{amount:null},{id:id})
	  app.sdb.update('Dog',{pairamount:null},{id:id})
	  app.sdb.update('Dog',{status:2},{id:id})
	  app.sdb.update('Dog',{source:'2'},{id:id})
  },
  //address用户转让小狗给toAddress
  assignDog: async function(id,address,toAddress,owner,source){
	  app.validate('string', toAddress, {length: { minimum: 1, maximum: 128 }})
	  id = Number(id)
	  let obj = await app.model.Dog.findOne({ id: id })
	  if (!obj) return 'Dog not found';
	  if (obj.status!=3||obj.address!=address) return 'Dog Status is not saleing';
	   
	  app.sdb.update('Dog',{address:toAddress},{id:id})
	  app.sdb.update('Dog',{owner:owner||''},{id:id})
	  app.sdb.update('Dog',{amount:null},{id:id})
	  app.sdb.update('Dog',{pairamount:null},{id:id})
	  app.sdb.update('Dog',{status:2},{id:id})
	  app.sdb.update('Dog',{source:'3'},{id:id})
  },
  //更新我的小狗配对价格信息
  updateDogPair: async function(id,pairamount,ispair,pairtime,culturetime){
	  id = Number(id)
	  pairamount = Number(pairamount)
	  let obj =await app.model.Dog.findOne({ id: id })
	  if (!obj) return 'Dog not found';
	  
	  app.sdb.update('Dog',{pairamount: pairamount||''},{id:id})
	  app.sdb.update('Dog',{ispair: ispair||1},{id:id})
	  app.sdb.update('Dog',{pairtime: pairtime||'12'},{id:id})
	  app.sdb.update('Dog',{culturetime: culturetime||'48'},{id:id})
  },
  //我的小狗开始配对(只有常规状态下才能配对)
  startPair: async function(id,pid){
	  id = Number(id)
	  pid = Number(pid)
	  let myDog =await app.model.Dog.findOne({ id: id })
	  if (!myDog) return 'Dog not found';
	  if (myDog.status!=2) return 'Dog Status is not normal';
	  let pairDog = await app.model.Dog.findOne({ id: id })
	  if (!pairDog) return 'PairDog not found';
	  if (pairDog.status!=2) return 'PairDog Status is not normal';
	    
	  app.sdb.update('Dog',{pairstarttime: (new Date()).toLocaleString()},{id:id})
	  app.sdb.update('Dog',{pairprevtime: (new Date()).toLocaleString()},{id:id})
	  app.sdb.update('Dog',{status: 4},{id:id})
	  
	  app.sdb.update('Dog',{status: 4},{id:pid})
  },
  //我的小狗结束配对
  endPair: async function(id,pid){
	  id = Number(id)
	  pid = Number(pid)
	  let myDog = await app.model.Dog.findOne({ id: id })
	  if (!myDog) return 'Dog not found';
	  let pairDog = await app.model.Dog.findOne({ id: id })
	  if (!pairDog) return 'PairDog not found';
	   
	  app.sdb.update('Dog',{paircount: (myDog.paircount+1)},{id:id})
	  app.sdb.update('Dog',{status: 2},{id:id})
	  
	  app.sdb.update('Dog',{paircount: (myDog.paircount+1)},{id:pid})
	  app.sdb.update('Dog',{status: 2},{id:pid})
	  //TODO:结束配对后生育出一只小狗。
  },
  //将我的小狗发布到市场销售(设置出售价格)
  updateDogSold: async function (id,amount,isold) {
	app.validate('string', amount, {length: { minimum: 1, maximum: 16 }})
	id = Number(id)
	amount = Number(amount)
    let obj = await app.model.Dog.findOne({ id: id })
    if (!obj) return 'Dog not found';
	if (obj.status!=2) return 'Dog Status is not normal';
    
	app.sdb.update('Dog',{amount: amount},{id:id})
	app.sdb.update('Dog',{isold: isold||1},{id:id})
  }
}