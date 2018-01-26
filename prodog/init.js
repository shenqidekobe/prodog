let dateUtils = require('./lib/date-utils.min')

module.exports = async function () {
  app.logger.info('enter dapp init')

  app.registerContract(1005, 'prodog.postDog')
  app.registerContract(1006, 'user.createUser')
  
  app.registerFee(1005, '0', 'XAS')
  app.registerFee(1006, '0', 'XAS')
}