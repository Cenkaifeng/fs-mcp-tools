import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "fs-mcp-tools",
    version: "0.1.0",
  });

  server.tool(
    "get_weather",
    "Get weather info for a given city.",
    {
      city: z.string().describe("city name"),
    },
    async ({ city }) => {
      if (!city) {
        throw new Error("city name is required.");
      }

      const weather = {
        city: city,
        temperature: Math.floor(Math.random() * 30),
        condition: "Sunny",
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(weather, null, 2),
          },
        ],
      };
    }
  );
  server.tool("get_time", "获取当前系统时间", {}, async () => {
    return {
      content: [
        {
          type: "text",
          text: new Date().toISOString(),
        },
      ],
    };
  });

  server.tool(
    "change_file",
    "读取本地markdown文件",
    {
      file_path: z.string().describe("项目内的相对或绝对路径"),
    },
    async ({ file_path }) => {
      const fs = require("fs");
      const path = require("path");

      const resolvedPath = path.resolve(process.cwd(), file_path);

      if (!resolvedPath.startsWith(process.cwd())) {
        throw new Error("文件路径超出项目范围");
      }

      if (!fs.existsSync(resolvedPath)) {
        throw new Error("文件不存在");
      }

      const content = fs.readFileSync(resolvedPath, "utf-8");

      return {
        content: [
          {
            type: "text",
            text: content,
          },
        ],
      };
    }
  );

  return server;
}
