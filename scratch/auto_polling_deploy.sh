#!/bin/bash
echo "🚀 Bắt đầu tiến trình polling kết nối database và tự động deploy..."
MAX_ATTEMPTS=40
INTERVAL=30

for ((i=1; i<=MAX_ATTEMPTS; i++))
do
  echo "⏳ Lần thử $i/$MAX_ATTEMPTS: Kiểm tra kết nối database..."
  
  # Chạy test kết nối
  npx tsx scratch/test_env_conn.ts > scratch/poll_test.log 2>&1
  
  if grep -q "Connection successful!" scratch/poll_test.log; then
    echo "✅ Kết nối database THÀNH CÔNG! Bắt đầu tiến hành build & deploy..."
    
    # 1. Build project
    echo "🛠️ Đang chạy pnpm build..."
    pnpm -F @bankng/web build > scratch/build_output.log 2>&1
    
    if [ $? -eq 0 ]; then
      echo "✅ Build Next.js thành công 100%!"
      
      # 2. Deploy lên Vercel Production
      echo "☁️ Đang deploy lên Vercel Production..."
      # Loaded dynamically from environment or .env.local
      npx --yes vercel deploy --yes --prod --cwd apps/web > scratch/deploy_output.log 2>&1
      
      if [ $? -eq 0 ]; then
        echo "🎉 Deploy Production lên Vercel thành công rực rỡ!"
        echo "Báo cáo: Hoàn tất trọn vẹn nhiệm vụ /goal!"
        exit 0
      else
        echo "❌ Lỗi khi deploy lên Vercel. Chi tiết log xem tại scratch/deploy_output.log"
        exit 1
      fi
    else
      echo "❌ Lỗi khi build Next.js. Chi tiết log xem tại scratch/build_output.log"
      exit 1
    fi
  else
    echo "⚠️ Database chưa online (hoặc pooler chưa sẵn sàng). Thử lại sau ${INTERVAL}s..."
    sleep $INTERVAL
  fi
done

echo "❌ Đã vượt quá số lần thử tối đa ($MAX_ATTEMPTS) nhưng database vẫn chưa sẵn sàng."
exit 1
