import express from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import axios from "axios";

const app = express();
const server = new McpServer({
  name: "example-server",
  version: "1.0.0",
});
// Helper function for consistent response formatting
function generateContentResponse(text, type ="text") {
    return {
      content: [{
        type: "text",
        text: text,
        // Optional: Add metadata for styling based on type
        metadata: { responseType: type }
      }]
    };
  }
server.tool(
  "findUserWithName",
  "returns the user id with name",
  {
    name: z.string(),
  },
  async (arg) => {
    const { name } =await  arg;
    const fetchData = async () => {
        const response = await axios.get("http://localhost:3000/user/get_user", {
          name: name,
        });
        if (response.data.sucess == false) 
          return null
    
        return response.data.message;
        
      };
     const id = await fetchData();
     console.log(id)
    return {
      content: [
        {
          type: "text",
          text: `id of user ${name} is ${id}`,
        },
      ],
    };
  }
);
server.tool(
  "addUser",
  "adding a new user to database with name and password",
  {
    name: z.string(),
    password: z.string(),
  },
  async (arg) => {
    const { name, password } = arg;
    const fetchData = async () => {
        const response = await axios.post("http://localhost:3000/user/users", {
          name: name,
          phone: password,
        });
        const id = response.data._id;
        return id;
      };
      const id = await fetchData();
    return {
      content: [
        {
          type: "text",
          text: `The user ${name} was saved with id ${id}`,
        },
      ],
    };
  }
);
server.tool(
    "addSlotForUser",
    "Adds a new slot for a user with validation and error handling",
    {
      name: z.string().min(1, "Name is required"),
      center: z.string().min(1, "Center ID is required"),
      counter: z.string().min(1, "Counter ID is required"),
    },
    async ({ name, center, counter }) => {
      return {
        content:[
            {
                type:"text",
                text:`Sucessfully creae=ted slot for ${name}`
            }
        ]
      }
    }
  );
server.tool(
  "bestTimeSlot",
  "find the best slot for particular day",
  {
    day: z.string(),
  },
  async (arg) => {
    const { day } = arg;
    const response = await axios.post(
      "https://queue-5.onrender.com/recommend",
      {
        day_name: day,
      }
    );

    console.log("Response:", response.data);
    const data = response.data;
    const best = data.best_slot;
    const alternatives = data.alternative_slots;

    let result = `✅ Your best slot is at **${best.hour}:00** with an expected wait time of **${best.predicted_wait_minutes} minutes**.\n`;
    result += `🔄 Alternatively, you can choose:\n`;

    alternatives.forEach((slot) => {
      result += `- **${slot.hour}:00** (predicted wait time: **${slot.predicted_wait_minutes} minutes**)\n`;
    });

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  }
);
server.tool(
  "GiveAllSlot",
  "Find all the slots for a particular user",
  {
    name: z.string().describe("Name of the user to find slots for"),
  },
  async (arg) => {
    const { name } = arg;

    if (!name || name.trim() === "") {
      throw new Error("Name cannot be empty");
    }

    const fetchData = async () => {
      // Make API request
      try {
        const response = await axios.post(
          "http://localhost:3000/user/get_details",
          {
            name: name,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        // console.log('Response:', response.data);
        return response;
      } catch (error) {
        console.error("Error posting data:", error);
        throw error;
      }
    };
    const response = await fetchData();
    // Check if response is valid
    if (!response || !response.data) {
      throw new Error("Invalid response from server");
    }

    // console.log("API Response:", response.data);

    const responseData = response.data;
    const message = responseData.message;
    const displayString = `
Current Queue Status:
----------------------------
Center ID: ${message[0].center_id} \n
Counter: ${message[0].counter_id} \n
Your Number: ${message[0].waiting_number} \n
Estimated Wait Time: ${message[0].estimated_wait_time} minutes \n
Status: ${message[0].status.toUpperCase()} \n
----------------------------
`;
    console.log("Display String:", displayString);
    return {
      content: [
        {
          type: "text",
          text: displayString,
        },
      ],
    };
  }
);

const transports = {};
app.get("/sse", async (req, res) => {
  const transport = new SSEServerTransport("/messages", res);
  transports[transport.sessionId] = transport;
  res.on("close", () => {
    delete transports[transport.sessionId];
  });
  await server.connect(transport);
});

app.post("/messages", async (req, res) => {
  const sessionId = req.query.sessionId;
  const transport = transports[sessionId];
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(400).send("No transport found for sessionId");
  }
});

app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});
