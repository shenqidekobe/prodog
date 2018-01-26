module.exports = {
  createLottery: async function (secret, tId) {
    if (!secret) {
      return 'user is not login'
    }

    let openTime = await app.model.openTime.findOne({
      condition: { id: tId }
    })

    if (!openTime) {
      return 'Wrong opening time'
    }

    let lCount = await app.model.Lottery.count({tId : tId })

    if(lCount <= 19999){
      app.sdb.create('Lottery', {
        id: app.autoID.increment('lottery_id'),
        secret: secret || '',
        tId: tId || '',
      })
    } else {
      return 'The awards are sold out'
    }

  }

}
