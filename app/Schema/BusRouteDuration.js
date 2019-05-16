
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const BusRouteDuration = new Schema({
  id: ObjectId,
  route_id: String,
  bus_routes : [{
    bus_stops: [{
      duration_sec: Number,
      duration_text: String,
    }],
  }],
  last_update_at: { type : Date, default: Date.now },
});



module.exports = BusRouteDuration
