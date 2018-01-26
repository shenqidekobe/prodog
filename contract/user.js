module.exports = {
  insertUser: async function (secret, publicKey, address, balance,nickname) {
	  app.validate('string', secret, {length: { minimum: 5, maximum: 256 }})
	  app.validate('string', publicKey, {length: { minimum: 5, maximum: 256 }})
	  app.validate('string', address, {length: { minimum: 5, maximum: 256 }})

      app.sdb.lock('insertUser@' + address)
      let exists = await app.model.User.exists({address: address})
      if (exists)return
	
    app.sdb.create('User', {
    	secret: secret||'',
    	publicKey: publicKey || '',
    	address: address || '',
    	balance: balance||'',
    	nickname:nickname||'',
        id: app.autoID.increment('user_max_id'),
        createtime:(new Date()).toLocaleString()
    })
  },
  updateUser: async function (id,nickname,balance) {
    let obj = await app.model.User.findOne({ condition: { id: id } })
    if (!obj) return 'User not found';
    
    app.sdb.update('User', {
      nickname: nickname||'',
      balance: balance || ''
    },{
      id:id
    })
  }
}