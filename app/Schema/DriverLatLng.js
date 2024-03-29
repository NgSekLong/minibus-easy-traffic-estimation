
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DriverLatLng = new Schema({
  id: ObjectId,
  mac_address: String,
  route_id: Number,
  locations : [{
    lat: Number,
    lng: Number,
    time : { type : Date, default: Date.now },
  }],
});

module.exports = DriverLatLng
