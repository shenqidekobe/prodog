module.exports = {
	name : 'tasks',
	fields : [ {
		name : 'id',
		type : 'Number',
		length : 128,
		not_null : true,
		primary_key : true
	}, {
		name : 'transactionId',//交易记录ID
		type : 'String',
		length : 128
	}, {
		name : 'address',//用户记录
		type : 'String',
		length : 128
	}, {
		name : 'status',//状态{1:待执行；2:已执行(交易成功)；3:已执行(交易失败)}
		type : 'String',
		length : 16,
    	default: '1'
	}, {
		name : 'type',//任务类型{1:购买小狗；2:配对；3:充值；4:提现；}
		type : 'String',
		length : 16
	}, {
		name : 'createtime',//创建时间
		type : 'String',
		length : 64
	}, {
		name : 'exetime',//执行时间
		type : 'String',
		length : 64
	}]
}