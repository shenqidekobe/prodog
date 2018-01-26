let dateUtils = require('./lib/date-utils.min')

module.exports = async function () {
  app.logger.info('enter dapp init')

  app.registerContract(1001, 'prodog.insertDog')
  app.registerContract(1002, 'prodog.updateDog')
  app.registerContract(2001, 'user.insertUser')
  app.registerContract(2002, 'user.updateUser')
  app.registerContract(1007, 'lottery.createLottery')

  app.registerFee(1001, '0', 'XAS')
  app.registerFee(1002, '0', 'XAS')
  app.registerFee(2001, '0', 'XAS')
  app.registerFee(2002, '0', 'XAS')
  app.registerFee(1007, '0', 'XAS')
}
