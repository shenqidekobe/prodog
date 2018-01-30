function isDefined(x) {
  return typeof x !== 'undefined'
}

async function getDogs(query) {
  let condition = {}
  if (isDefined(query.generation)) condition.generation = query.generation
  if (isDefined(query.owner)) condition.owner = query.owner
  if (isDefined(query.isold)) condition.isold = query.isold
  if (isDefined(query.ispair)) condition.ispair = query.ispair
  if (isDefined(query.israre)) condition.ispair = query.israre
  
  let count = await app.model.Dog.count(condition)
  let dogs = await app.model.Dog.findAll({
    condition: condition,
    limit: options.limit || 50,
    offset: options.offset || 0,
    sort: { id : -1 }
  })
  return { count: count, dogs: dogs }
}

app.route.post('/dogs', async (req) => {
  let query = req.query
  let res = await getDogs(query)
  return res
})

app.route.post('/dogs/:id', async (req) => {
  let id = req.params.id
  let dog = await app.model.Dog.findOne({
    condition: { id: id }
  })
  if (!dog) throw new Error('dog not found')
  let result = { dog: dog }
  return result
})