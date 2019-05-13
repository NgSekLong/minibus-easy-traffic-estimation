
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DriverLastKnownLatLng = new Schema({
  id: ObjectId,
  mac_address: String,
  route_id: Number,
  route_num_counter: Number,
  bus_stop_num_counter: Number,
  location: {
    lat: Number,
    lng: Number,
    time : { type : Date, default: Date.now },
  },
});

module.exports = DriverLastKnownLatLng
