router.get("/", (req, res) => {
  res.redirect("/ifttt")
  res.page_data.roomdataout = {}
  console.log(res.page_data)
  res.render("home.hbs", res.page_data)
})
