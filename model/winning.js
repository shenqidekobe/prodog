module.exports = {
  name: 'winning',
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
      name: 'dId',
      type: 'Number'
    },
    {
      name: 'level',
      type: 'String',
      not_null: true,
      length:20
    }
  ]
}
