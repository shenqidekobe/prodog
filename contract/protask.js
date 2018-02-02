module.exports = {
  //发布新的任务
  publishTask: async function (transactionId,address,type) {
    app.validate('string', transactionId, {length: { minimum: 5, maximum: 256 }})
    
    app.sdb.lock('publishTask@' + transactionId)
    let exists = await app.model.Task.exists({ transactionId: transactionId })
    if (exists) return
    
    app.sdb.create('Task', {
      id: app.autoID.increment('task_max_id'),
      transactionId: transactionId,
      address: address||'',
      type: type || '',
      createtime:(new Date()).toLocaleString()
    })
  },
  //修改任务状态
  publishTask: async function (id,status) {
    let obj = await app.model.Task.findOne({ condition: { id: id } })
    if (!obj) return 'Task not found';
    
    app.sdb.update('Task', {
    	status: status||obj.status,
    	exetime:(new Date()).toLocaleString()
    },{
      id:id
    })
  }
}