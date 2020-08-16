'use strict';
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    price: { type: Number, default: 0, min: 0 },
    currency: { type: String },
    availability: { type: String },
    user: { type: Number, required: true },
    lastCheck: { type: Number, default: 0 },
    preferences: {
      targetPrice: { type: Number, default: 0, min: 0 },
      availabilityAlerts: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
