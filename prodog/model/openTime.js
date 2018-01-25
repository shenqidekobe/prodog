module.exports = {
  name: 'openTime',
  fields: [
    {
      name: 'id',
      type: 'Number',
      not_null: true,
      primary_key: true
    },
    {
      name: 'BeginDate',
      type: 'Number',
      not_null: true
    },
    {
      name: 'EndDate',
      type: 'Number',
      not_null: true
    }
  ]
}
