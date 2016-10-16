var dakAPI = {};
dakAPI.generateRoutes = function(){
  api_router = express.Router();
  for(actuator_id in actuator_list){
    actuator = actuator_list[actuator_id]
    api_router.get("/"+actuator_id, (req, res) => {
      res.json(req.query)
    })
  }
  router.use("/api", api_router);
}
module.exports = dakAPI
