import { Hono } from "hono";
import { handle } from "hono/aws-lambda";

const app = new Hono();

// https://hono.dev/getting-started/aws-lambda
app.get("/", (c) => {
  return c.text("Hello Hono!!!");
});

export const handler = handle(app);
