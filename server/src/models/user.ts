import * as mongoose from 'mongoose';

const userSchema: mongoose.Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

export default mongoose.model('User', userSchema);