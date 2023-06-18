import mongoose from "mongoose";

const categoryVSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        lowercase: true,
    },
});

export default mongoose.model("CategoryV", categoryVSchema);