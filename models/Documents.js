const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  aadharCardFront: {
    type: String,
    required: true,
  },
  aadharCardBack: {
    type: String,
    required: true,
  },
  drivingLicense: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Document", documentSchema);
