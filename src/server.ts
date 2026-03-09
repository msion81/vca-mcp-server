import "dotenv/config";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { config } from "./config.js";
import { handleToolCall, listTools } from "./registry.js";

const PORT = config.port;

function createMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "athlevo-mcp-server",
      version: "1.0.0",
    },
    { capabilities: { tools: {} } }
  );

  for (const tool of listTools()) {
    server.registerTool(tool.name, {
      description: tool.description,
      inputSchema: tool.zodSchema,
    }, async (args) => {
        const result = await handleToolCall(tool.name, args);
        const text =
          result.success === true
            ? JSON.stringify(result.data)
            : JSON.stringify({ success: false, error: result.error });
        return {
          content: [{ type: "text" as const, text }],
        };
      }
    );
  }

  return server;
}

const app = createMcpExpressApp();

// Allow browser/Electron clients (e.g. MCP Inspector) to connect from any origin
app.use(cors({ origin: true, credentials: true }));

const mcpPostHandler = async (
  req: import("express").Request,
  res: import("express").Response
) => {
  const mcpServer = createMcpServer();
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on("close", () => {
      transport.close();
      mcpServer.close();
    });
  } catch (err) {
    console.error("Error handling MCP request:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  }
};

const mcpGetHandler = (
  req: import("express").Request,
  res: import("express").Response
) => {
  const mcpServer = createMcpServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
  });
  mcpServer.connect(transport).then(() => {
    transport.handleRequest(req, res);
    res.on("close", () => {
      transport.close();
      mcpServer.close();
    });
  }).catch((err) => {
    console.error("Error handling MCP GET request:", err);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal server error" },
        id: null,
      });
    }
  });
};

app.post("/mcp", mcpPostHandler);
app.get("/mcp", mcpGetHandler);

// Alias for clients that use /sse (e.g. some MCP UIs)
app.post("/sse", mcpPostHandler);
app.get("/sse", mcpGetHandler);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`MCP HTTP server listening on port ${PORT}`);
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  process.exit(0);
});
