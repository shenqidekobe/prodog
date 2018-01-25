module.exports = {
	name : 'users',
	fields : [ {
		name : 'id',
		type : 'Number',
		length : 128,
		not_null : true,
		primary_key : true
	}, {
		name : 'address',
		type : 'String',
		length : 128,
		unique : true
	}, {
		name : 'publicKey',
		type : 'String',
		length : 128
	}, {
		name : 'secret',
		type : 'String',
		length : 128,
		index : true
	}, {
		name : 'balance',
		type : 'Number',
	    default: 0
	}, {
		name : 'createtime',
		type : 'DATETIME'
	}, {
		name : 'logintime',
		type : 'DATETIME'
	} ]
}