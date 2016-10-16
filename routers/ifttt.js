router.use((req, res, next) => {
  next();
})
router.get("/ifttt", (req, res) => {
  res.page_data.actuator_list = actuator_list;
  res.page_data.sensor_list = sensor_list;
  res.page_data.rule_list = rule_list;
  res.render("ifttt.hbs", res.page_data)
})
router.get("/actuators", (req, res) => {
  res.page_data.actuator_types = Object.keys(actuator_types);
  res.page_data.actuator_list = actuator_list;
  res.render("actuators.hbs", res.page_data)
})
router.post("/setActuator", (req, res) => {
  if(req.body.id){
    dakActuators.sendActuatorCommand(req.body.id, function(){
      res.redirect("/ifttt")
    })
  }
  else{
    res.redirect("/ifttt")
  }
})
router.post("/addActuator", (req, res) => {
  if(req.body.name && req.body.signal_type){
    dakActuators.addActuator(req.body.name, req.body.signal_type, function(){
      res.redirect("/ifttt")
    })
  }
  else{
    res.redirect("/ifttt")
  }
})
router.post("/addActuatorCommand", (req, res) => {
  if(req.body.name && req.body.actuator && req.body.signal){
    dakActuators.addActuatorCommand(req.body.name, req.body.actuator, req.body.signal, function(){
      res.redirect("/actuators")
    })
  }
  else{
    res.redirect("/actuators")
  }
})
router.get("/deleteActuatorCommand", (req, res) => {
  console.log(req.query.actid)
  if(req.query.actid){
    dakActuators.deleteActuatorCommand(req.query.actid, function(){
      console.log("deleted")
      res.redirect("/actuators")
    })
  }
  else{
    res.redirect("/actuators")
  }
})
