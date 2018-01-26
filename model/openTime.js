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
      name: 'tDay',
      type: 'String',
      length:20
    },
    {
      name: 'BeginDate',
      type: 'String',
      length:20
    },
    {
      name: 'EndDate',
      type: 'String',
      length:20
    }
  ]
}
