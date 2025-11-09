# 🐳 PostgreSQL Docker Setup - Local Development

## ✅ Setup Hoàn Tất!

PostgreSQL đã được setup thành công ở local với Docker.

## 📋 Thông tin hệ thống

### PostgreSQL Database
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `one_billion`
- **Username**: `onebillion`
- **Password**: `onebillion123`

### pgAdmin (Web UI)
- **URL**: http://localhost:5050
- **Email**: admin@onebillion.com
- **Password**: admin123

### Backend API
- **URL**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs

## 🚀 Lệnh Docker

### Khởi động containers
```bash
docker compose up -d
```

### Dừng containers
```bash
docker compose down
```

### Dừng và xóa volumes (xóa hết data)
```bash
docker compose down -v
```

### Xem logs
```bash
# PostgreSQL logs
docker logs -f onebillion-postgres

# pgAdmin logs
docker logs -f onebillion-pgadmin
```

### Kiểm tra trạng thái
```bash
docker ps
```

## 🔧 Khởi động Backend

```bash
cd backend
npm run start:dev
```

Backend sẽ:
- Tự động connect đến PostgreSQL local
- Tự động tạo tables (synchronize: true trong dev mode)
- Connection pool: max 20, min 5
- Không cần SSL (chỉ dùng SSL cho Aiven production)

## 📊 Truy cập pgAdmin

1. Mở http://localhost:5050
2. Login với:
   - Email: `admin@onebillion.com`
   - Password: `admin123`
3. Add New Server:
   - General > Name: `OneBillion Local`
   - Connection > Host: `postgres` (tên service trong docker-compose)
   - Connection > Port: `5432`
   - Connection > Username: `onebillion`
   - Connection > Password: `onebillion123`
   - Connection > Database: `one_billion`

## 🔄 Chuyển đổi giữa Local và Production

### Sử dụng Local PostgreSQL (hiện tại)
File `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=onebillion
DB_PASSWORD=onebillion123
DB_NAME=one_billion
```

### Sử dụng Aiven PostgreSQL (Production)
Uncomment và sử dụng:
```env
# DB_HOST=pg-2d3f6ce9-locdo-e453.i.aivencloud.com
# DB_PORT=15819
# DB_USERNAME=avnadmin
# DB_PASSWORD=AVNS_kInjDRLI8DZlx4cn24C
# DB_NAME=one_billion
```

## ⚠️ Lưu ý

1. **Connection Pool**: Đã tăng từ 3 lên 20 connections để tránh "too many clients" error
2. **SSL**: Chỉ bật SSL khi connect đến Aiven (production)
3. **Synchronize**: Tự động tạo/update schema trong development mode
4. **Data Persistence**: Data được lưu trong Docker volume `one-billion_postgres_data`

## 🐛 Troubleshooting

### Port 5432 đã được sử dụng
```bash
# Tìm process đang dùng port
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Reset database
```bash
docker compose down -v
docker compose up -d
```

### Kiểm tra backend connection
```bash
curl http://localhost:3001/api
```

### Test sites API (cần auth token)
```bash
curl http://localhost:3001/api/sites \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ✨ Ưu điểm của setup này

1. **Không bị giới hạn connections** như Aiven free tier
2. **Tốc độ nhanh hơn** (local network)
3. **Không phụ thuộc internet**
4. **Dễ dàng reset/test** với Docker
5. **Có pgAdmin UI** để quản lý database
6. **Tự động tạo schema** với TypeORM synchronize

## 🎉 Sẵn sàng phát triển!

Backend đang chạy và sẵn sàng nhận requests. Frontend có thể connect đến `http://localhost:3001/api`
