try {
    const environment = process.env.ENVIRONMENT || "development";
    const config = require("./knexfile.js")[environment];
    module.exports = require("knex")(config);
    console.log('connected');
  } catch (error) {
    console.log(` ✘ Could not connect - ${error}`);
    process.exit(1);
  }
  