router.get("/ifttt", (req, res) => {
  res.render("ifttt.hbs", res.page_data)
})
router.post("/config/add_actuator", (req, res) => {
  res.json(res.body)
})
