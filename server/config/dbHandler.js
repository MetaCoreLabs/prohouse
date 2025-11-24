const mongoose = require('mongoose');
const timestamps = require('mongoose-stamps');
const req = require('request');
const path = require('path');
const connectDB = require('./db.js');
const utils = require('./utils.js');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const dbHandler = {
    connect: async () => {
        if (!process.env.MONGO_URI) {
            console.log("MONGO_URI not set — skipping DB connection");
            return;
        }
        if (mongoose.connection.readyState === 1) {
            console.log("Already connected to MongoDB");
            return;
        }
        await connectDB();
    },

    disconnect: async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
            console.log("MongoDB disconnected");
        }
    },

    isConnected: () => mongoose.connection.readyState === 1,

    // getPlugin by name
    getPlugin: async (pluginName) => {
        if (!mongoose.connection.readyState) await connectDB();
        return await Plugin.findOne({ name: pluginName });
    },
    // addPlugin
    addPlugin: async (pluginData) => {
        if (!mongoose.connection.readyState) await connectDB();
        const plugin = new Plugin(pluginData);
        return await plugin.save();
    },
    // timePlugin
    timePlugin: async (schema) => {
        schema.plugin(timestamps);
    },
    // Example: list all plugins
    listPlugins: async () => {
        if (!mongoose.connection.readyState) await connectDB();
        return await Plugin.find({});
    },
};

const pluginSchema = new mongoose.Schema({
    name: { type: String, required: true },
    version: { type: String },
    enabled: { type: Boolean, default: true },
}, { timestamps: true });

const Plugin = (mongoose.models.Plugin || mongoose.model("Plugin", pluginSchema));

module.exports = dbHandler;
