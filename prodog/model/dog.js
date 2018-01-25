module.exports = {
  name: 'dogs',
  fields: [
    {
      name: 'id',
      type: 'Number',
      length:50,
      not_null: true,
      primary_key: true
    },
    {
      name: 'nickname',
      type: 'String',
      length: 64,
      unique: true
    },
    {
      name: 'amount',
      type: 'String',
      length: 50,
      not_null: true
    },
    {
      name: 'createtime',
      length:64,
      type: 'String',
      not_null: true
    },
    {
      name: 'owner',
      type: 'String',
      length: 64,
      not_null: true
    },
    {
      name: 'piccode',
      type: 'String',
      length: 64
    },
    {
      name: 'picurl',
      type: 'String',
      length: 256,
      not_null: true,
    },
    {
      name: 'father',
      type: 'String',
      length: 64
    },
    {
      name: 'mother',
      type: 'String',
      length: 64
    },
    {
      name: 'constellation',
      type: 'String',
      length: 64
    },
    {
      name: 'rare',
      length:64,
      type: 'Number',
      not_null: true,
      default: 0
    }
  ]
}