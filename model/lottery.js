module.exports = {
  name: 'lottery',
  fields: [
    {
      name: 'id',
      type: 'Number',
      not_null: true,
      primary_key: true
    },
    {
      name: 'uAddress',
      type : 'String',
  		length : 128,
  		unique : true
    },
    {
      name: 'tId',
      type: 'Number',
      not_null: true
    },
    {
      name: 'price',
      type: 'Number',
      default: 5
    },
    {
      name: 'priceType',
      type: 'String',
      length: 10,
      default: 'XAS'
    },
    {
      name: 'total',
      type: 'Number',
      default: 20000
    }
  ]
}
