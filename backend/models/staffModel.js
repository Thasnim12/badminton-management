const mongoose = require("mongoose");

const staffSchema = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    phoneno: {
      type: String,
    },
    designation: {
      type: String,
    },
    employee_id: {
      type: String,
      unique: true,
    },
    joining_date: {
      type: Date,
    },
    staff_image: {
      type: String,
    },
    create_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const staff = mongoose.model("staff", staffSchema);
module.exports = staff;
