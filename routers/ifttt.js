router.use((req, res, next) => {
  next();
})
router.get("/ifttt", (req, res) => {
  res.page_data.actuator_types = actuator_types;
  res.page_data.actuator_list = actuator_list;
  res.page_data.no_outlets = process.env.MAX_OUTLETS <= actuator_list.length;
  console.log(res.page_data)
  res.render("ifttt.hbs", res.page_data)
})
router.get("/config/actuators", (req, res) => {
  res.page_data.actuator_commands = actuator_commands;
  res.render("actuators.hbs", res.page_data)
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
