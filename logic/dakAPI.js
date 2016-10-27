var dakAPI = {};
dakAPI.generateRoutes = function(){
  api_router = express.Router();
  handleCommand = function(actuator, cmd, cb){
    db.config.find({type: "actuator", $or: [{api_name: actuator}, {name: actuator}], active: 1})
    .sort({_id: 1}).exec(function(err, docs){
      if(docs.length > 0){
        actuator = docs[0]
        db.config.find({type: "actuator_command", actuator: actuator._id, $or: [{api_name: cmd}, {name: cmd}], active: 1})
        .sort({_id: 1}).exec(function(err, docs){
          if(docs.length > 0){
            cmd = docs[0]
            dakActuators.sendActuatorCommand(cmd, () => {})
            cb()
          }
          else{
            cb("No such command found.  Try using all-lowercase with no spaces.")
          }
        })
      }
      else{
        cb("No actuator found with this name. Try using all-lowercase with no spaces.")
      }
    })
  }
  api_router.get("/:actuator-:cmd", (req, res) => {
    actuator = req.params.actuator.replace(/\W/g, '').toLowerCase()
    cmd = req.params.cmd.replace(/\W/g, '').toLowerCase()
    handleCommand(actuator, cmd, (err) => {
      if(err){
        req.params.err = err
      }
      res.send(JSON.stringify(req.params))
    })
  })
  api_router.get("/sleep", (req, res) => {
    dakSleep.goToSleep((msg) => {
      res.send(msg)
    })
  });
  api_router.get("/wake", (req, res) => {
    dakSleep.wakeUp((msg) => {
      res.send(msg)
    })
  });
  api_router.get("/voice", (req, res) => {
    if(req.query.speech && req.query.speech.split(" ").length>=2){
      words = req.query.speech.split(" ")
      actuator = words[0].replace(/\W/g, '').toLowerCase()
      cmd = words[1].replace(/\W/g, '').toLowerCase()
      handleCommand(actuator, cmd, (err) => {
        req.params = {actuator, cmd}
        if(err){
          req.params.err = err
        }
        res.send(JSON.stringify(req.params))
      })
    }
    else{
      res.send("Failed to parse speech input")
    }
  })
  router.use("/api", api_router);
}
module.exports = dakAPI
