async function getDogs(options) {
  let count = await app.model.Dog.count( {id:{$lt:options.count||5}})
  let dogs = await app.model.Dog.findAll({
    condition: {
      id: { $lt: options.count||5 }
    },
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort:{id:-1}
  })
  return { count: count, dogs: dogs }
}

app.route.get('/dogs', async (req) => {
  let query = req.query
  let key = ['/dogs', query.sortBy, query.limit, query.offset,options.count].join('_')
  let res = null
  if (query.sortBy === 'id') {
    res = await getDogs(query)
  } else {
    throw new Error('Sort field not supported')
  }
  return res
})

app.route.get('/dogs/:id', async (req) => {
  let id = req.params.id
  let dog = await app.model.Dog.findOne({
    condition: { id: id }
  })
  if (!dog) throw new Error('dog not found')
  let result = { dog: dog }
  return result
})