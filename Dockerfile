# Dockerfile (Node.js backend)
FROM node:18-alpine

# Tạo thư mục ứng dụng
WORKDIR /app

# Copy file package.json và cài đặt dependency
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở port mà app sử dụng (ví dụ 3000)
EXPOSE 3000

# Lệnh khởi chạy ứng dụng
CMD ["npm", "start"]
