import mongoose from mongoose;

const Schema = mongoose.Schema;

const carSchema = Schema({
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  numberOfSeats: {
    type: Number,
    required: true,
  },
  numberOfDoors: {
    type: Number,
    required: true,
  },
  fuelType: {
    type: String,
    required: true,
  },
  // Other car-related fields
});

 export default mongoose.model("Car",carSchema);
