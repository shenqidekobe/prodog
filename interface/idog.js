function isDefined(x) {
  return typeof x !== 'undefined'
}

async function getDogs(query) {
  let condition = {}
  if (isDefined(query.generation)) condition.generation = query.generation
  if (isDefined(query.address)) condition.address = query.address
  if (isDefined(query.isold)) condition.isold = query.isold
  if (isDefined(query.ispair)) condition.ispair = query.ispair
  if (isDefined(query.israre)) condition.ispair = query.israre
  
  let count = await app.model.Dog.count(condition)
  let dogs = await app.model.Dog.findAll({
    condition: condition,
    limit: query.limit || 50,
    offset: query.offset || 0,
    sort: { id : -1 }
  })
  return { count: count, dogs: dogs }
}
//市场的狗列表查询(可出售且拥有者不为空)
app.route.post('/market/dogs', async (req) => {
  let query = req.query
  let res = await getDogs(query)
  return res
})
//配种的狗列表查询(可交配且非自己的)
app.route.post('/pair/dogs', async (req) => {
  let query = req.query
  let res = await getDogs(query)
  return res
})
//我的小狗
app.route.post('/info/dogs', async (req) => {
  let query = req.query
  let res = await getDogs(query)
  return res
})
//狗的详细信息
app.route.post('/dogs/:id', async (req) => {
  let id = req.params.id
  let dog = await app.model.Dog.findOne({
    condition: { id: id }
  })
  if (!dog) throw new Error('dog not found')
  let result = { dog: dog }
  return result
})
//狗的全部详细信息｛包括父母和子女｝
app.route.post('/fulldogs/:id', async (req) => {
  let id = req.params.id
  let dog = await app.model.Dog.findOne({
    condition: { id: id }
  })
  if (!dog) throw new Error('dog not found')
  if(isDefined(dog.father)){
	  let father = await app.model.Dog.findOne({
	    condition: { id: dog.father}
	  })
	  dog.fatherObj=father
  }if(isDefined(dog.mother)){
	  let mother = await app.model.Dog.findOne({
	    condition: { id: dog.mother}
	  }) 
	  dog.motherObj=mother
  }
  let children=await app.model.Dog.findAll({
	    condition: { father: id}
  }) 
  dog.children=children
  let result = { dog: dog }
  return result
})