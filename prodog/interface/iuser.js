function isDefined(x) {
  return typeof x !== 'undefined'
}

async function getUsers(query) {
  let condition = {}
  if (isDefined(query.address)) condition.address = query.address
  if (isDefined(query.secret)) condition.secret = query.secret
  
  let count = await app.model.User.count(condition)
  let users = await app.model.User.findAll({
    condition: condition,
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort: { id : -1 }
  })
  return { count: count, users: users }
}

app.route.get('/users', async (req) => {
  let query = req.query
  let key = ['/users', query.sortBy, query.limit, query.offset,query.count].join('_')
  let res = getUsers(query)
  return res
})

app.route.get('/users/:id', async (req) => {
  let id = req.params.id
  let user = await app.model.User.findOne({
    condition: { id: id }
  })
  if (!user) throw new Error('user not found')
  let result = { user: user }
  return result
})
