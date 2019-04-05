// routes/index.js
const nodeRoutes = require('./node_routes');
module.exports = function(app, db) {
  nodeRoutes(app, db);
  // Other route groups could go here, in the future
};

return;
