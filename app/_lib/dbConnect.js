// app/_lib/db.js

import mongoose from 'mongoose';

const MONGODB_URI = process.env.DB_URI;

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local',
    )
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: true,
        }
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
            console.log('Successfully connected with the DB');
            return mongoose;
        }).catch(err => {
            console.error('Error connecting to the database:', err.message || err);
            throw new Error('Database connection failed');
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default dbConnect;