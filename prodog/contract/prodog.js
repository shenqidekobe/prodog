module.exports = {
  insertDog: async function (generation,nickname, amount, picode, picurl,
		  owner,father,mother,constellation) {
    app.validate('string', generation, {number: {onlyInteger: true, greaterThanOrEqualTo:0, lessThanOrEqualTo: 8}})
    app.validate('string', picode, {length: { minimum: 5, maximum: 256 }})
    app.validate('string', picurl, {url: { schemes: ["http", "https"] }})
    
    app.sdb.lock('insertDog@' + picode)
    let exists = await app.model.Dog.exists({ picode: picode })
    if (exists) return
    
    app.sdb.create('Dog', {
      nickname: nickname||'',
      amount: amount || '',
      picode: picode || '',
      picurl: picurl||'',
      id: app.autoID.increment('dog_max_id'),
      owner: owner||'',
      father: father||'',
      mother: mother||'',
      constellation: constellation||'',
      createtime:(new Date()).toLocaleString()
    })
  },
  updateDog: async function (id,nickname,amount,owner,isold,soldtime,
		  ispair,pairamount,paircount,pairtime,culturetime,israre) {
    let obj = await app.model.Dog.findOne({ condition: { id: id } })
    if (!obj) return 'Dog not found';
    
    app.sdb.update('Dog', {
      nickname: nickname||'',
      amount: amount || '',
      owner: owner||'',
      isold: isold||0,
      soldtime: soldtime||'',
      ispair: ispair||0,
      pairamount: pairamount||'',
      paircount: paircount||obj.paircount,
      pairtime: pairtime||'',
      culturetime: culturetime||'',
      israre: israre||0
    },{
      id:id
    })
  }
}