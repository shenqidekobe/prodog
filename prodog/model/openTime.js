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
      name: 'day',
      type: 'String',
      not_null: true
    },
    {
      name: 'BeginDate',
      type: 'String',
      not_null: true
    },
    {
      name: 'EndDate',
      type: 'String',
      not_null: true
    }
  ]
}
