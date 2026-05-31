import { PrismaClient } from "@prisma/client";

async function main() {
  const url = "postgresql://postgres.livjpwqtmhbsvhoeowgk:D%40vidtinh710%21%40%23@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres?sslmode=require";
  console.log("Testing connection with URL:", url);
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: url
      }
    }
  });

  try {
    const bankCount = await prisma.bank.count();
    console.log("Connection successful! Total banks:", bankCount);
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
