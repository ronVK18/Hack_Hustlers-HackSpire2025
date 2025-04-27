import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import mongoose from "mongoose";
import admin from "firebase-admin";
import axios from "axios";
import { WaitingTimeRouter } from "./routes/waitingTime.js";
import bodyParser from "body-parser";
import AddCenter from "./routes/addCenter.js";
import AddUser from "./routes/addUser.js";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const connectToDB = async () => {
    try {
      await mongoose.connect("mongodb://localhost:27017/mcp-adani", {});
      // console.log("Connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
};
app.use("/time",WaitingTimeRouter)
app.use("/center",AddCenter)
app.use("/user",AddUser)
connectToDB();

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
