router.use((req, res, next) => {
  res.page_data = {layout: "layouts/base"};
  res.page_data.BASE_URL = process.env.BASE_URL;
  next();
})
require("./monitor")
require("./ifttt")
