function isDefined(x) {
  return typeof x !== 'undefined'
}

async function getTasks(query) {
  let condition = {}
  if (isDefined(query.transactionId)) condition.transactionId = query.transactionId
  if (isDefined(query.status)) condition.status = query.status
  if (isDefined(query.type)) condition.type = query.type
  
  let count = await app.model.Task.count(condition)
  let results = await app.model.Task.findAll({
    condition: condition,
    limit: query.limit || 50,
    offset: query.offset || 0,
    sort: { id : 0 }
  })
  return { count: count, results: results }
}
//待执行的任务列表
app.route.post('/exe/tasks', async (req) => {
  let query = req.query
  let res = await getTasks(query)
  return res
})