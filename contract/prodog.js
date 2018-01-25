module.exports = {
  postDog: async function (nickname, amount, piccode, picurl,owner) {
    if (!piccode) {
      return '9996  Should not isnull piccode and piccode'
    }

    if (piccode) {
      app.sdb.lock('postDog@' + piccode)
      let exists = await app.model.Dog.exists({ piccode: piccode })
      if (exists) {
        return 'piccode already exists'
      }
    }
    app.logger.info('insert dogs :'+piccode);
    app.sdb.create('Dog', {
      nickname: nickname||'',
      amount: amount || '',
      piccode: piccode || '',
      picurl: picurl||'',
      id: app.autoID.increment('dog_max_id'),
      owner: owner||'',
     createtime:'2017-19-19 88:88:88'
    })
  }
}