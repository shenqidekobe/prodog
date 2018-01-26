app.route.get('/lottery/openTime', async (req) => {
  let time =new Date()
  let day = time.getDay()　

  let openTimes = await app.model.openTime.findAll({
    condition: { tDay: day }
  })

  if (!openTIme) throw new Error('openTime not found')

  for (let openTime in openTimes) {
    let start= new Date(openTime.BeginDate)
    let end= new Date(openTime.EndDate)
    if (day >= start && day<= end) {
       return openTime
    }
  }

})

app.route.get('/lottery/winning', async (req) => {
  let secret = req.params.secret

  let winnings = await app.model.Winning.findAll({
    condition: { secret: secret }
  })

  return winnings

})
