module.exports = {
  postDog: async function (nickname, amount, picode, picurl,owner) {
    if (!picode) {
      return ' Should not isnull picode'
    }

    if (picode) {
      app.sdb.lock('postDog@' + picode)
      let exists = await app.model.Dog.exists({ picode: picode })
      if (exists) {
        return 'piccode already exists'
      }
    }
    app.logger.info('insert dogs :'+piccode);
    app.sdb.create('Dog', {
      nickname: nickname||'',
      amount: amount || '',
      picode: picode || '',
      picurl: picurl||'',
      id: app.autoID.increment('dog_max_id'),
      owner: owner||'',
      createtime:(new Date()).toLocaleString()
    })
  }
}