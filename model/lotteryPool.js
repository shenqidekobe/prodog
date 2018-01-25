module.exports = {
  name: 'lotteryPool',
  fields: [
    {
      name: 'id',
      type: 'Number',
      not_null: true,
      primary_key: true
    },
    {
      name: 'dId',
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
      name: 'level',
      type: 'String',
      not_null: true,
      length:20,
    }
  ]
}
