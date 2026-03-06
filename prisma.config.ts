import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // DIRECT_URL is used for CLI operations (migrations, db pull)
    // because Supabase's connection pooler doesn't support these operations
    url: env("DIRECT_URL"),
  },
});
