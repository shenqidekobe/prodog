const IntervalCache = require('./lib/interval-cache')
let dateUtils = require('./lib/date-utils.min')

module.exports = async function () {
  app.logger.info('enter dapp init')

  app.registerContract(1001, 'prodog.publishDog')
  app.registerContract(1002, 'prodog.updateDog')
  app.registerContract(1003, 'prodog.updateDogNickName')
  app.registerContract(1004, 'prodog.updateDogSold')
  app.registerContract(1005, 'prodog.updateDogToOwner')
  app.registerContract(1006, 'prodog.updateDogPair')
  app.registerContract(1007, 'prodog.updateDogStartPair')
  app.registerContract(1008, 'prodog.updateDogEndPair')
  
  app.registerContract(2001, 'protask.publishTask')
  app.registerContract(2002, 'protask.updateTaskStatus')
  
  app.registerFee(1001, '0', 'XAS')
  app.registerFee(1002, '0', 'XAS')
  app.registerFee(1003, '0', 'XAS')
  app.registerFee(1004, '0', 'XAS')
  app.registerFee(1005, '0', 'XAS')
  app.registerFee(1006, '0', 'XAS')
  app.registerFee(1007, '0', 'XAS')
  app.registerFee(1008, '0', 'XAS')
  
  app.registerFee(2001, '0', 'XAS')
  app.registerFee(2002, '0', 'XAS')
  
  app.custom.cache = new IntervalCache(10 * 1000)
}
