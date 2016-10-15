var dakAPI = {};
dakAPI.generateRoutes = function(){
  api_router = express.Router();
  console.log(actuator_list)
  for(actuator_id in actuator_list){
    actuator = actuator_list[actuator_id]
    console.log(actuator_id)
    api_router.get("/"+actuator_id, (req, res) => {
      res.json(req.query)
    })
  }
  router.use("/api", api_router);
}
module.exports = dakAPI
