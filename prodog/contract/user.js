module.exports = {
  createUser: async function (secret, publicKey, address, balance) {
    if (!secret) {
      return 'users Should not isnull secret'
    }

    if (secret) {
      app.sdb.lock('createUser@' + secret)
      let exists = await app.model.User.exists({ secret: secret })
      if (exists) {
        return 'users secret already exists'
      }
    }
    app.logger.info('insert user :'+secret);
    app.sdb.create('User', {
    	secret: secret||'',
    	publicKey: publicKey || '',
    	address: address || '',
    	balance: balance||'',
        id: app.autoID.increment('user_max_id'),
        createtime: (datetime( 'now', 'localtime')),
        logintime:(datetime( 'now', 'localtime'))
    })
  }
}