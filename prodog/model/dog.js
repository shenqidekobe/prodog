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
        type: 'Number',
        not_null: true
    },
    {
        name: 'age',// 年龄：天数
        type: 'Number'
    },
    {
        name: 'dogname',//狗名
        type: 'String',
        length: 64
    },
    {
      name: 'nickname',//昵称
      type: 'String',
      length: 64
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
        name: 'genes',//基因
        type: 'String',
        length:512
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
        name: 'pairtime',// 配对生育时间
        type: 'String',
        length:64
    },
    {
        name: 'pairstarttime',// 配对开始时间
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