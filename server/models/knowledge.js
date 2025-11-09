import mongoose from "mongoose";

const knowledgeSchema = new mongoose.Schema({
  question: String,
  answer: String,
  keywords: [String]
});

export const Knowledge = mongoose.model('Knowledge', knowledgeSchema);
