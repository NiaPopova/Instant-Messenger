import * as mongoose from 'mongoose';

const connectDb = () => {
    return mongoose.connect(`${process.env.LOCAL_DB_URL}/${process.env.DATABASE_NAME}`);
};

export default connectDb;