router.use((req, res, next) => {
  res.page_data.actuator_list = actuator_list;
  next();
})
router.get("/ifttt", (req, res) => {
  res.page_data.no_outlets = process.env.MAX_OUTLETS <= actuator_list.length;
  res.render("ifttt.hbs", res.page_data)
})
router.post("/config/add_actuator", (req, res) => {
  console.log(req.body)
  if(req.body.name){
    dakActuators.addActuator(req.body.name, req.body.outlet, function(){
      res.redirect("/ifttt")
    })
  }
  else{
    res.redirect("/ifttt")
  }
})
