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
        name: 'status',//状态{1:待领取；2:已领取；3:出售中；4:生育中}
        type: 'String',
        length:16,
        default:'1'
    },
    {
        name: 'generation',// 第几代
        type: 'String',
        length:32,
        not_null: true
    },
    {
      name: 'nickname',//昵称
      type: 'String',
      length: 64,
      unique: true
    },
    {
      name: 'amount',// 出售金额
      type: 'Number'
    },
    {
      name: 'currency ',//价格单位
      type: 'String',
      length: 16,
      default:'XAS'
    },
    {
      name: 'createtime',//创建时间
      length:64,
      type: 'String',
      not_null: true
    },
    {
        name: 'address',// 拥有者address
        type: 'String',
        length: 128
    },
    {
      name: 'owner',// 拥有者名称
      type: 'String',
      length: 64
    },
    {
      name: 'picode',// 图片编码
      type: 'String',
      length: 64
    },
    {
      name: 'picurl',// 图片地址
      type: 'String',
      length: 256,
      not_null: true,
    },
    {
      name: 'father',// 父亲ID
      type: 'Number'
    },
    {
      name: 'mother',// 母亲ID
      type: 'Number'
    },
    {
      name: 'constellation',// 星座
      type: 'String',
      length: 64
    },
    {
        name: 'isold',// 是否可售{0不1可}
        type: 'Number',
        default: 0
    },
    {
        name: 'soldtime',// 可售截止时间
        type: 'String',
        length:64
    },
    {
        name: 'ispair',// 是否可配{0不1可}
        type: 'Number',
        default: 0
    },
    {
        name: 'pairamount',// 配对价格
        type: 'Number'
    },
    {
        name: 'paircount',// 配对次数
        type: 'Number',
        default: 0
    },
    {
        name: 'pairtime',// 配对截止时间
        type: 'String',
        length:64
    },
    {
        name: 'pairprevtime',// 上次配对时间
        type: 'String',
        length:64
    },
    {
        name: 'culturetime',// 修养时间
        type: 'String',
        length:64
    },
    {
        name: 'israre',// 是否稀有
        type: 'Number',
        not_null: true,
        default: 0
    }
  ]
}