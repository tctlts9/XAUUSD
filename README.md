# XAUUSD TRADING

Ứng dụng Dashboard chuyên nghiệp đa nền tảng (**Web App máy tính & Mobile App PWA di động**) gồm 3 tab chức năng: **XAUUSD**, **Prop Firm**, và **Backcom**.

---

## 🚀 Công Nghệ Sử Dụng (Tech Stack)

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **PWA (Progressive Web App)**: `vite-plugin-pwa` với Service Worker tự động cập nhật, hỗ trợ hoạt động ngoại tuyến (Offline) và cài đặt trực tiếp lên iOS / Android / Desktop
- **Icons**: `lucide-react`
- **Deploy Target**: [Vercel](https://vercel.com/) & [GitHub](https://github.com/)

---

## 📱 Cấu Trúc 3 Tab

1. **Tab XAUUSD**: Quản trị và phân tích thị trường Vàng (Spot Gold / USD).
2. **Tab Prop Firm**: Giám sát tài khoản Quỹ cấp vốn (FTMO, Funding Pips, FundedNext...) và quy tắc sụt giảm vốn (*Drawdown*).
3. **Tab Backcom**: Quản lý và đối soát hoàn phí hoa hồng (*Rebate / Cashback Commission*) từ các sàn giao dịch.

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Môi Trường Cục Bộ (Local)

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev Server)
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000`

### 3. Kiểm tra mã nguồn (Type Check / Lint)
```bash
npm run lint
```

### 4. Build phiên bản phát hành (Production Build)
```bash
npm run build
```
Thư mục xuất bản: `/dist`

---

## 🌐 Hướng Dẫn Deploy Lên Vercel Qua GitHub

Dự án đã được cấu hình sẵn tệp `vercel.json` chuẩn dành cho Single Page Application (SPA) và PWA.

### Cách 1: Tự động qua GitHub (Khuyên dùng)
1. Đẩy mã nguồn lên kho lưu trữ GitHub của bạn:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for XAUUSD Trading App"
   git branch -M main
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git
   git push -u origin main
   ```
2. Đăng nhập vào [Vercel](https://vercel.com/) $\rightarrow$ Chọn **Add New Project** $\rightarrow$ Chọn **Import Git Repository**.
3. Chọn kho lưu trữ GitHub vừa tạo:
   - **Framework Preset**: Chọn `Vite` (Vercel tự động nhận diện).
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Nhấn **Deploy**. Vercel sẽ tự động build và cấp tên miền `https://<ten-du-an>.vercel.app` với chứng chỉ SSL miễn phí và tự động deploy lại mỗi khi bạn `git push`.

### Cách 2: Deploy trực tiếp bằng Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 📲 Cài Đặt Ứng Dụng PWA (Mobile App)

- **Trên iPhone / iPad (iOS Safari)**: Nhấn biểu tượng **Chia sẻ (Share)** $\rightarrow$ chọn **Thêm vào MH chính (Add to Home Screen)**.
- **Trên Android / Chrome / Windows / Mac**: Nhấn nút **Cài Đặt App** trực tiếp trên thanh điều hướng hoặc menu trình duyệt.
