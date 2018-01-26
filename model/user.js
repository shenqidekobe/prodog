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
		not_null : true,
		length : 128,
		index:true,
		unique : true
	}, {
		name : 'publicKey',
		type : 'String',
		not_null : true,
		length : 128
	}, {
		name : 'secret',
		type : 'String',
		not_null : true,
		length : 128,
		index : true
	}, {
		name : 'balance',
		type : 'Number',
	    default: 0
	}, {
		name : 'createtime',
		type : 'String',
		length : 128
	}, {
		name : 'nickname',
		type : 'String',
		length : 64
	} ]
}