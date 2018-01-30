let dateUtils = require('./lib/date-utils.min')

module.exports = async function () {
  app.logger.info('enter dapp init')

  app.registerContract(1001, 'prodog.insertDog')
  app.registerContract(1002, 'prodog.updateDog')

  app.registerFee(1001, '0', 'XAS')
  app.registerFee(1002, '0', 'XAS')
}
