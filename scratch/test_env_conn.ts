import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
import * as path from "path";

// Load .env.local
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

async function main() {
  const url = process.env.DATABASE_URL;
  console.log("Testing connection with URL from .env.local:", url);
  
  if (!url) {
    console.error("DATABASE_URL is not set in .env.local");
    return;
  }

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    const bankCount = await prisma.bank.count();
    console.log("✅ Connection successful! Total banks in Database:", bankCount);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
