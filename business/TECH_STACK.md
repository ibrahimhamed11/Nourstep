# NourStep — Tech Stack & Architecture

## 🏗️ Overview

منصة خطوة للنور مبنية على بنية **Full-Stack JavaScript** موحدة — نفس اللغة في كل طبقة من الكود.

---

## 🖥️ Frontend — Web App

| التقنية | الإصدار | الغرض |
|---|---|---|
| **React** | 19+ | واجهة المستخدم |
| **TypeScript** | 5+ | نظام الأنواع الصارم |
| **Vite** | 6+ | Build tool وسيرفر التطوير |
| **Tailwind CSS** | v4 | التصميم والـ styling |
| **React Router** | v7 | التنقل بين الصفحات |
| **Formik + Yup** | latest | إدارة النماذج والتحقق |
| **Framer Motion** | latest | الأنيميشن |
| **Lucide React** | latest | الأيقونات |

---

## 📱 Mobile App — React Native

| التقنية | الإصدار | الغرض |
|---|---|---|
| **React Native** | 0.74+ | تطبيق iOS و Android من كود واحد |
| **Expo** | SDK 51+ | أدوات التطوير والبناء |
| **TypeScript** | 5+ | نظام الأنواع |
| **React Navigation** | v6 | التنقل بين الشاشات |
| **Zustand** | latest | إدارة الحالة العامة |
| **React Native Paper** | latest | مكونات UI جاهزة |
| **Expo Notifications** | latest | الإشعارات الفورية (Push) |
| **Expo SecureStore** | latest | حفظ التوكن بأمان |
| **React Native Maps** | latest | عرض الخرائط (للمستقبل) |

---

## ⚙️ Backend — Node.js + Express

| التقنية | الإصدار | الغرض |
|---|---|---|
| **Node.js** | 20 LTS | بيئة تشغيل الـ server |
| **Express.js** | 5+ | إطار الـ API الـ RESTful |
| **TypeScript** | 5+ | نظام الأنواع في الـ backend |
| **JWT (jsonwebtoken)** | latest | المصادقة والتوكن |
| **bcryptjs** | latest | تشفير كلمات المرور |
| **Joi / Zod** | latest | التحقق من البيانات |
| **Nodemailer** | latest | إرسال البريد الإلكتروني |
| **Socket.IO** | 4+ | الاتصال اللحظي (للمستقبل) |
| **cors** | latest | إعدادات CORS |
| **helmet** | latest | أمان الـ HTTP headers |
| **express-rate-limit** | latest | الحماية من الـ DDoS |
| **morgan** | latest | تسجيل الطلبات (logging) |

---

## 🍃 Database — MongoDB

| التقنية | الإصدار | الغرض |
|---|---|---|
| **MongoDB** | 7+ | قاعدة بيانات NoSQL |
| **Mongoose** | 8+ | ODM لنمذجة البيانات |
| **MongoDB Atlas** | Cloud | استضافة قاعدة البيانات |

### Collections (الكولكشنز)

```
users                  — المستخدمون الأساسيون
teacher_profiles       — ملفات المعلمين
student_profiles       — ملفات الطلاب
parent_profiles        — ملفات أولياء الأمور
confirmation_codes     — أكواد تأكيد البريد
password_reset_tokens  — رموز استعادة كلمة المرور
courses                — الكورسات (Phase 1)
enrollments            — تسجيلات الطلاب في الكورسات (Phase 1)
sessions               — الجلسات المباشرة (Phase 2)
notifications          — الإشعارات (Phase 2)
reviews                — تقييمات المعلمين (Phase 2)
```

---

## 🔥 Services — الخدمات الخارجية

| الخدمة | الغرض |
|---|---|
| **Firebase Cloud Messaging (FCM)** | إشعارات Push للتطبيق الجوال |
| **Nodemailer + Gmail SMTP / SendGrid** | إرسال إيميلات التأكيد وإعادة التعيين |
| **Cloudinary / AWS S3** | رفع وتخزين الصور والملفات |
| **MongoDB Atlas** | استضافة قاعدة البيانات على السحابة |

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Web App     │  │ Mobile App   │  │ Admin Dashboard  │  │
│  │ React + Vite │  │ React Native │  │  React + Vite    │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
└─────────┼─────────────────┼───────────────────┼────────────┘
          │                 │                   │
          └─────────────────┴───────────────────┘
                            │ HTTPS / REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js)                        │
│                                                             │
│  ┌────────────────┐   ┌────────────────┐                   │
│  │  Express REST  │   │  Socket.IO     │  (Phase 2+)       │
│  │  API           │   │  Real-time     │                   │
│  └───────┬────────┘   └───────┬────────┘                   │
│          │                   │                             │
│  ┌───────▼───────────────────▼────────────────────────┐   │
│  │              Middleware Layer                        │   │
│  │  Auth (JWT) · Validation · Rate Limit · CORS        │   │
│  └───────────────────────┬────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
┌─────────────────┐ ┌─────────────┐ ┌──────────────────┐
│   MongoDB Atlas  │ │  Cloudinary │ │  Firebase / SMTP │
│   (Database)     │ │  (Media)    │ │  (Notifs/Email)  │
└─────────────────┘ └─────────────┘ └──────────────────┘
```

---

## 📁 Project Structure

### Backend (Node.js + Express + MongoDB)
```
backend/
├── src/
│   ├── config/
│   │   ├── db.ts          # MongoDB connection
│   │   ├── env.ts         # Environment variables
│   │   └── constants.ts   # App constants
│   ├── models/
│   │   ├── User.ts
│   │   ├── TeacherProfile.ts
│   │   ├── StudentProfile.ts
│   │   ├── ParentProfile.ts
│   │   ├── ConfirmationCode.ts
│   │   └── PasswordResetToken.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── teacher.routes.ts
│   │   ├── student.routes.ts
│   │   └── parent.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── teacher.controller.ts
│   │   └── ...
│   ├── middleware/
│   │   ├── auth.middleware.ts    # JWT verification
│   │   ├── validate.middleware.ts
│   │   ├── rateLimit.middleware.ts
│   │   └── upload.middleware.ts
│   ├── services/
│   │   ├── email.service.ts      # Nodemailer
│   │   ├── token.service.ts      # JWT helpers
│   │   └── notification.service.ts
│   ├── utils/
│   │   ├── response.ts           # Unified API response
│   │   ├── errors.ts
│   │   └── validators.ts
│   └── app.ts                    # Express app entry
├── package.json
├── tsconfig.json
└── .env
```

### Mobile App (React Native + Expo)
```
mobile/
├── app/
│   ├── (auth)/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   └── confirm.tsx
│   ├── (teacher)/
│   │   ├── dashboard.tsx
│   │   └── courses.tsx
│   ├── (student)/
│   │   ├── dashboard.tsx
│   │   └── courses.tsx
│   └── (parent)/
│       └── dashboard.tsx
├── components/
├── hooks/
├── store/          # Zustand stores
├── services/       # API calls
├── utils/
└── app.json
```

---

## 🔐 Authentication Flow (JWT)

```
Client                    Backend                   MongoDB
  │                          │                          │
  │── POST /auth/register ──►│                          │
  │                          │── Save User (pending) ──►│
  │                          │── Save ConfirmCode ──────►│
  │                          │── Send Email (Nodemailer) │
  │◄── 201 {pending} ────────│                          │
  │                          │                          │
  │── POST /auth/confirm ───►│                          │
  │                          │── Verify Code ──────────►│
  │                          │── Update status=active ──►│
  │◄── 200 {active} ─────────│                          │
  │                          │                          │
  │── POST /auth/login ─────►│                          │
  │                          │── Find User + bcrypt ───►│
  │                          │── Generate JWT           │
  │◄── 200 {token, user} ────│                          │
```

---

## 🌿 MongoDB Schemas (Mongoose)

### User Schema
```typescript
const UserSchema = new Schema({
  email:        { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  fullName:     { type: String, required: true },
  phone:        { type: String, required: true },
  role:         { type: String, enum: ['teacher', 'student', 'parent'], required: true },
  status:       { type: String, enum: ['pending', 'active', 'suspended'], default: 'pending' },
  avatarUrl:    { type: String },
  locale:       { type: String, enum: ['ar', 'en'], default: 'ar' },
}, { timestamps: true });
```

### TeacherProfile Schema
```typescript
const TeacherProfileSchema = new Schema({
  userId:       { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  subject:      { type: String, required: true },
  experience:   { type: String, required: true },
  location:     { type: String, required: true },
  degree:       { type: String, required: true, enum: ['diploma','bachelor','master','phd','other'] },
  age:          { type: Number, required: true, min: 18, max: 80 },
  teachingMode: { type: String, required: true, enum: ['online','offline','both'] },
  whatsapp:     { type: String },
  schoolName:   { type: String },
  bio:          { type: String },
  rating:       { type: Number, default: 0 },
  totalStudents:{ type: Number, default: 0 },
  verified:     { type: Boolean, default: false },
}, { timestamps: true });
```

---

## 🔑 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nourstep

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@nourstep.com
SMTP_PASS=app_password

# Frontend URLs
CLIENT_URL=https://nourstep.com
ADMIN_URL=https://admin.nourstep.com

# Cloudinary (media)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Firebase (push notifications — Phase 2)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
```

---

## 📡 API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | تسجيل مستخدم جديد |
| POST | `/api/v1/auth/login` | تسجيل الدخول |
| POST | `/api/v1/auth/confirm` | تأكيد الحساب بالكود |
| POST | `/api/v1/auth/resend-code` | إعادة إرسال كود التأكيد |
| POST | `/api/v1/auth/forgot-password` | طلب استعادة كلمة المرور |
| POST | `/api/v1/auth/reset-password` | تعيين كلمة مرور جديدة |
| POST | `/api/v1/auth/refresh-token` | تجديد الـ JWT |
| POST | `/api/v1/auth/logout` | تسجيل الخروج |

### Teacher
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/teachers/me` | بروفايل المعلم الحالي |
| PUT | `/api/v1/teachers/me` | تحديث البروفايل |
| GET | `/api/v1/teachers/:id` | بروفايل معلم معين |
| GET | `/api/v1/teachers` | قائمة المعلمين (بحث/فلترة) |

### Student
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/students/me` | بروفايل الطالب الحالي |
| PUT | `/api/v1/students/me` | تحديث البروفايل |

### Parent
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/parents/me` | بروفايل ولي الأمر |
| GET | `/api/v1/parents/children` | قائمة الأبناء المرتبطين |

### Courses (Phase 1)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/courses` | إنشاء كورس جديد |
| GET | `/api/v1/courses` | قائمة الكورسات |
| GET | `/api/v1/courses/:id` | تفاصيل كورس |
| PUT | `/api/v1/courses/:id` | تعديل كورس |
| DELETE | `/api/v1/courses/:id` | حذف كورس |
| POST | `/api/v1/courses/:id/enroll` | تسجيل طالب في كورس |

---

## 🚀 Deployment

| الطبقة | الخدمة المقترحة |
|---|---|
| **Backend API** | Railway / Render / VPS (DigitalOcean) |
| **Database** | MongoDB Atlas (Free → M10) |
| **Web Frontend** | Vercel / Netlify |
| **Mobile App** | Expo EAS Build → App Store + Google Play |
| **Media Storage** | Cloudinary (Free tier → Pro) |
| **Email** | SendGrid / Gmail SMTP |
| **Push Notifications** | Firebase Cloud Messaging (free) |

---

## 🔄 Development Phases

### Phase 1 — MVP (يونيو ٢٠٢٦)
- [x] Web Frontend (React + Vite)
- [ ] Backend API (Node.js + Express + MongoDB)
- [ ] Auth system (register/login/confirm/reset)
- [ ] Teacher profile
- [ ] Course management (CRUD)
- [ ] Student enrollment

### Phase 2 — Q3 2026
- [ ] React Native mobile app
- [ ] Parent dashboard
- [ ] Push notifications (Firebase)
- [ ] AI analytics integration
- [ ] Gamification (points/badges)

### Phase 3 — Q4 2026
- [ ] Center admin dashboard
- [ ] Revenue analytics
- [ ] Socket.IO real-time features
- [ ] Payment integration

### Phase 4 — 2027
- [ ] App Store + Google Play launch
- [ ] Advanced AI features
- [ ] Offline content access
- [ ] External API integrations
