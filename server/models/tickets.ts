import mongoose from 'mongoose'
// Define schema
const Schema = mongoose.Schema;

var TicketsSchema = new Schema({
  id: String,
  content: String,
  title: String,
  userEmail: String,
  labels: [String],
  creationTime: Number,
  titleContent: String
});

// Compile model from schema
export const Tickets = mongoose.model('Tickets', TicketsSchema );