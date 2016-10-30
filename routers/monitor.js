router.get("/", (req, res) => {
  db.activity.find({type: "sensorlog"}).sort({time: 1}).limit(5000).exec((err, docs) => {
    res.page_data.roomdata = JSON.stringify(docs)
    //console.log(res.page_data)
    res.render("home.hbs", res.page_data)
  })
})
