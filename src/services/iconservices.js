require("dotenv").config();
const axios = require("axios").default;
// Set config defaults when creating the instance
const { CI, SK } = process.env;

// // Alter defaults after instance has been created
// instance.defaults.headers.common["ID"] = CI;

module.exports = {
  searchicon: async (data) => {
    // console.log(data);
    try {
      const searching = await axios.get("https://api.iconscout.com/v3/search", {
        headers: { "content-type": "application/json", "Client-ID": CI },
        params: {
          query: data.query,
          product_type: data.product_type,
          asset: data.asset,
          per_page: data.per_page,
          page: data.page,
          sort: data.sort,
        },
      });
      const result = searching.data.response.items;
      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
