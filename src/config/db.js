import mongoose from "mongoose";
import pkg from 'pg';
import dotenv from 'dotenv';

const { Client } = pkg;
dotenv.config();

const connectDBMongo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: process.env.MONGO_DB
        })
        console.log("MongoDB Connected")
    } catch (err) {
        console.error(err.message)
        process.exit(1)
    }
}

const connectDBPostgre = async () => {
    try {
        const client = new Client({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DB,
            password: process.env.POSTGRES_PASSWORD,
            port: process.env.POSTGRES_PORT
        });
        await client.connect();
        console.log("PostgreSQL Connected");
        return client;
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

export {connectDBMongo, connectDBPostgre};