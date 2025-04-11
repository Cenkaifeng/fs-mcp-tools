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
    "读写本地文件",
    {
      operation: z
        .enum(["read", "write"])
        .default("read")
        .describe("操作类型：read/写"),
      file_path: z.string().describe("项目内的相对或绝对路径"),
      content: z.string().optional().describe("写入内容（仅写操作需要）"),
    },
    async ({ operation, file_path, content }) => {
      const fs = require("fs");
      const path = require("path");

      const resolvedPath = path.resolve(process.cwd(), file_path);

      if (!resolvedPath.startsWith(process.cwd())) {
        throw new Error("文件路径超出项目范围");
      }

      if (!fs.existsSync(resolvedPath)) {
        throw new Error("文件不存在");
      }

      if (operation === "read") {
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

      // 写操作逻辑
      const dir = path.dirname(resolvedPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(resolvedPath, content || "");
      return {
        content: [
          {
            type: "text",
            text: `文件已成功写入：${resolvedPath}`,
          },
        ],
      };
    }
  );

  return server;
}
