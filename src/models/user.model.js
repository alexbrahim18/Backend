import mongoose from "mongoose";
const userCollection = "users";

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
mongoose.set("strictQuery", false);
/* const userModel = mongoose.model(userCollection, userSchema);
export default userModel */

export default {userCollection, userSchema};