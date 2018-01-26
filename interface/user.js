async function getUsers(options) {
  let count = await app.model.User.count( {id:{$lt:options.count||5}})
  let users = await app.model.User.findAll({
    condition: {
      id: { $lt: options.count||5 }
    },
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort:{id:-1}
  })
  return { count: count, users: users }
}

app.route.get('/users', async (req) => {
  let query = req.query
  let key = ['/users', query.sortBy, query.limit, query.offset,query.count].join('_')
  let res = null
  if (query.sortBy === 'id') {
    res = await getUsers(query)
  } else {
    throw new Error('Sort field not supported')
  }
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
