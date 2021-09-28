const application = require("../services/iconservices");
module.exports = {
  // icon scout //
  search: async (req, res) => {
    const { query, product_type, asset, per_page, page, sort } = req.query;
    const data = { query, product_type, asset, per_page, page, sort };
    try {
      const search = await application.searchicon(data);
      console.log(search);

      res.status(200).send({ data: search });
    } catch (error) {
      console.log(error);
    }
  },
};
