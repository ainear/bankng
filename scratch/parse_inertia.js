const fs = require('fs');
const path = require('path');

const filePath = '/Users/gray/.gemini/antigravity/brain/688b491b-2d69-45a8-93fa-7b2d26e217c0/.system_generated/steps/1906/content.md';

try {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Trích xuất data-page
  const match = content.match(/data-page="([^"]*)"/);
  if (!match) {
    console.error("Không tìm thấy data-page!");
    process.exit(1);
  }
  
  // Decode HTML entities
  const decoded = match[1]
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#039;/g, "'")
    .replace(/&#x2F;/g, '/');
    
  const data = JSON.parse(decoded);
  
  console.log("=== COMPONENT ===");
  console.log(data.component);
  console.log("\n=== PROPS KEYS ===");
  console.log(Object.keys(data.props));
  
  // Ghi props ra file json để xem chi tiết
  fs.writeFileSync(
    path.join(__dirname, 'inertia_props.json'),
    JSON.stringify(data.props, null, 2)
  );
  console.log("\n✅ Đã ghi props ra file scratch/inertia_props.json");
  
  // In ra một số thông tin quan trọng nếu có
  if (data.props.latestRates) {
    console.log(`\nFound latestRates: ${data.props.latestRates.length} items`);
  }
  if (data.props.featuredBanks) {
    console.log(`Found featuredBanks: ${data.props.featuredBanks.length} items`);
  }
  if (data.props.bankersCount) {
    console.log(`bankersCount: ${data.props.bankersCount}`);
  }
} catch (err) {
  console.error("Lỗi:", err);
}
