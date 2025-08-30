import mongoose from "mongoose";

const contactFeedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  feedback: { type: String, default: "General Feedback" },  
  issue: { type: String, default: "" },  
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("ContactFeedback", contactFeedbackSchema);
