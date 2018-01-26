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
      name: 'secret',
      type : 'String',
      length : 128,
      not_null : true
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
