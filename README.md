# 🏭 Smart Factory Maintenance Dashboard (Factory Helpdesk)

ระบบบริหารจัดการการแจ้งซ่อมและติดตามสถานะเครื่องจักรในโรงงานแบบเรียลไทม์ (Real-time Maintenance & Helpdesk Management System) พัฒนาขึ้นเพื่อช่วยให้ทีมช่างและฝ่ายผลิตสามารถแจ้งปัญหา ตรวจสอบสถานะการซ่อม และจัดการเบิกใช้อะไหล่ได้อย่างมีประสิทธิภาพ

---

## 🚀 Key Features (ฟีเจอร์หลัก)

- **📊 Dashboard & Metrics:** สรุปภาพรวมสถานะตั๋วแจ้งซ่อมทั้งหมด (Open, In Progress, Resolved) พร้อมการ์ดสถิติแบบเรียลไทม์
- **🔍 Advanced Search & Filter:** ระบบค้นหาอัจฉริยะ ค้นหาตั๋วได้ทันทีด้วย Error Code, อาการเสีย หรือชื่อ/รหัสเครื่องจักร พร้อมตัวกรองสถานะ
- **📝 Dedicated Ticket Form:** หน้าฟอร์มแยกสำหรับแจ้งซ่อมเครื่องจักร กรอกข้อมูลง่ายและรวดเร็ว
- **🔍 Ticket Details & Spare Parts Modal:** หน้าต่างโมดอลแสดงรายละเอียดเชิงลึกของตั๋ว พร้อมตารางรายการอะไหล่ที่เบิกใช้และการคำนวณราคารวมอัตโนมัติ
- **🔄 Real-time Status Management:** เปลี่ยนสถานะตั๋วแจ้งซ่อมได้ทันทีผ่าน Server Actions
- **⚡ Responsive UI:** ดีไซน์ด้วย Tailwind CSS รองรับการใช้งานทั้งบนคอมพิวเตอร์และมือถือ

---

## 🛠️ Tech Stack (เทคโนโลยีที่ใช้)

- **Frontend & Backend:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Database & Backend Services:** Supabase (PostgreSQL, Row Level Security)
- **Deployment:** Vercel

---

## 📂 Project Structure (โครงสร้างโปรเจกต์)

```text
factory-helpdesk/
├── src/
│   ├── app/                 # Next.js App Router (Pages, Layouts, Server Actions)
│   ├── components/          # Reusable UI Components (Dashboard, Cards, Modals, Form)
│   └── types/               # TypeScript Database Types
├── public/                  # Static Assets
├── .env.local               # Environment Variables (Local)
└── README.md