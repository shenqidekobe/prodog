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
      name: 'uId',
      type: 'Number',
      not_null: true
    },
    {
      name: 'tId',
      type: 'Number',
      not_null: true
    },
    {
      name: 'status',
      type: 'String',
      not_null: true
      length:"10"
      default:"unsold"
    },
    {
      name: 'dId',
      type: 'Number',
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
