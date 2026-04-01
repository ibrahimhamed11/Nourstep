/**
 * Roadmap Tasks — MongoDB Seed Script
 *
 * Inserts all ~55 initial roadmap tasks into the `roadmapTasks` collection.
 *
 * Usage:
 *   npx ts-node scripts/seed-roadmap.ts
 *
 * Or with environment variable:
 *   MONGODB_URI=mongodb+srv://... npx ts-node scripts/seed-roadmap.ts
 *
 * This script:
 *   1. Connects to MongoDB
 *   2. Drops the existing `roadmapTasks` collection
 *   3. Inserts all seed data
 *   4. Resets the `roadmapTaskNumber` counter to 55
 *   5. Disconnects
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/* ─────────────────────────────────────────────────────────────
   SCHEMAS
───────────────────────────────────────────────────────────── */
const VALID_TAGS = [
  'frontend', 'backend', 'mobile', 'devops', 'firebase', 'aws',
  'auth', 'payment', 'ui', 'api', 'database', 'testing',
  'deploy', 'security', 'performance',
] as const;

const roadmapTaskSchema = new mongoose.Schema({
  taskId:      { type: String, required: true, unique: true, trim: true },
  taskNumber:  { type: Number, required: true, unique: true, index: true },
  taskType:    { type: String, enum: ['task', 'bug', 'feature', 'improvement'], default: 'task' },
  title:       { type: String, required: true, maxlength: 300, trim: true },
  desc:        { type: String, required: true, maxlength: 5000, trim: true },
  status:      { type: String, enum: ['todo', 'in-progress', 'done', 'blocked'], default: 'todo' },
  track:       { type: String, enum: ['website', 'backend', 'mobile', 'devops'], required: true },
  week:        { type: Number, min: 1, max: 8, required: true },
  estimate:    { type: String, default: '—', maxlength: 20 },
  assignee:    { type: String, default: 'Dev Ibrahim Hamed', maxlength: 100, trim: true },
  tags:        [{ type: String, enum: VALID_TAGS }],
  parallel:    [{ type: String, trim: true }],
  blockedBy:   [{ type: String, trim: true }],
  completedAt: { type: Date, default: null },
}, { timestamps: true });

roadmapTaskSchema.index({ track: 1, week: 1 });
roadmapTaskSchema.index({ status: 1 });
roadmapTaskSchema.index({ tags: 1 });
roadmapTaskSchema.index({ assignee: 1 });
roadmapTaskSchema.index({ title: 'text', desc: 'text' });

const RoadmapTask = mongoose.model('RoadmapTask', roadmapTaskSchema);

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: { type: Number, default: 0 },
});
const Counter = mongoose.model('Counter', counterSchema);

/* ─────────────────────────────────────────────────────────────
   SEED DATA — ALL 55 ROADMAP TASKS
───────────────────────────────────────────────────────────── */
const A = 'Dev Ibrahim Hamed';

let _counter = 0;
function n(): number { return ++_counter; }

const SEED_TASKS = [
  /* ══════════ WEEK 1 — April 1–7 ══════════ */
  // Backend — NOT started
  { taskId: 'b1-1', taskNumber: n(), taskType: 'task', title: 'Backend project scaffold', desc: 'Node.js 20 + Express 5, TypeScript, src/modules folder structure, ESLint + Prettier, Husky pre-commit hooks, dotenv config', status: 'todo', track: 'backend', week: 1, estimate: '4h', assignee: A, tags: ['backend', 'api'] },
  { taskId: 'b1-2', taskNumber: n(), taskType: 'task', title: 'MongoDB Atlas + Mongoose setup', desc: 'Atlas M0 cluster provisioning, Mongoose 8 connection with pool, base BaseModel timestamps, environment vars via dotenv', status: 'todo', track: 'backend', week: 1, estimate: '3h', blockedBy: ['b1-1'], parallel: ['b1-3'], assignee: A, tags: ['backend', 'database'] },
  { taskId: 'b1-3', taskNumber: n(), taskType: 'feature', title: 'Auth Module — Register + OTP', desc: 'POST /api/v1/auth/register, 6-digit OTP, bcrypt password hash, SendGrid OTP email, OTPToken model with 15-min TTL, 3 resends/hr limit', status: 'todo', track: 'backend', week: 1, estimate: '1.5d', blockedBy: ['b1-2'], assignee: A, tags: ['backend', 'auth', 'api'] },
  // Website — landing done, auth UI done (ONLY frontend, not wired)
  { taskId: 'w1-1', taskNumber: n(), taskType: 'task', title: 'Landing page', desc: 'Hero, Navbar, About, Problems, Features, MobileApp, Countdown, Footer — fully built with RTL + dark/light + language toggle', status: 'done', track: 'website', week: 1, estimate: '—', assignee: A, tags: ['frontend', 'ui'], completedAt: new Date('2026-03-25T00:00:00Z') },
  { taskId: 'w1-2', taskNumber: n(), taskType: 'task', title: 'Auth UI — all pages', desc: 'LoginPage, RegisterTypePage, RegisterPage (Teacher/Student/Parent), ConfirmAccountPage, ForgotPasswordPage, ResetPasswordPage — fully built', status: 'done', track: 'website', week: 1, estimate: '—', assignee: A, tags: ['frontend', 'ui', 'auth'], completedAt: new Date('2026-03-28T00:00:00Z') },
  { taskId: 'w1-3', taskNumber: n(), taskType: 'task', title: 'Wire auth UI to backend API', desc: 'Connect LoginPage + RegisterPage to POST /auth/login & /auth/register, handle OTP confirm, forgot/reset flows end-to-end with axios + error states', status: 'todo', track: 'website', week: 1, estimate: '1.5d', blockedBy: ['b1-3'], parallel: ['b1-3'], assignee: A, tags: ['frontend', 'auth', 'api'] },
  // Mobile — NOT started (React Native CLI)
  { taskId: 'm1-1', taskNumber: n(), taskType: 'task', title: 'React Native CLI project init', desc: 'npx react-native init NourstepApp --template react-native-template-typescript, iOS + Android workspace setup, Metro bundler config — NO Expo', status: 'todo', track: 'mobile', week: 1, estimate: '4h', parallel: ['b1-1'], assignee: A, tags: ['mobile'] },
  { taskId: 'm1-2', taskNumber: n(), taskType: 'task', title: 'React Navigation v6 setup', desc: 'Install @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs, react-native-screens, react-native-safe-area-context, pod install', status: 'todo', track: 'mobile', week: 1, estimate: '3h', blockedBy: ['m1-1'], assignee: A, tags: ['mobile', 'ui'] },

  /* ══════════ WEEK 2 — April 8–14 ══════════ */
  // Backend
  { taskId: 'b2-1', taskNumber: n(), taskType: 'feature', title: 'Auth Module — Login + JWT + Refresh', desc: 'POST /auth/login, access token 15m, refresh token 7d in httpOnly cookie, POST /auth/refresh, POST /auth/logout (revoke token)', status: 'todo', track: 'backend', week: 2, estimate: '1d', blockedBy: ['b1-3'], assignee: A, tags: ['backend', 'auth', 'api', 'security'] },
  { taskId: 'b2-2', taskNumber: n(), taskType: 'feature', title: 'Auth Module — Forgot / Reset password', desc: 'POST /auth/forgot-password (reset token 1h, SendGrid email), POST /auth/reset-password, invalidate token after use', status: 'todo', track: 'backend', week: 2, estimate: '6h', blockedBy: ['b2-1'], assignee: A, tags: ['backend', 'auth', 'api'] },
  { taskId: 'b2-3', taskNumber: n(), taskType: 'feature', title: 'User Module — Profile CRUD + RBAC middleware', desc: 'GET /users/me, PUT /users/profile, Teacher/Student/Parent/Center models with role-specific fields, verifyToken + requireRole() middleware', status: 'todo', track: 'backend', week: 2, estimate: '1.5d', blockedBy: ['b2-1'], parallel: ['w2-1'], assignee: A, tags: ['backend', 'api', 'auth'] },
  // Website
  { taskId: 'w2-1', taskNumber: n(), taskType: 'task', title: 'Axios API client + auth interceptors', desc: 'Central axios instance, request interceptor to attach JWT, response interceptor for 401 refresh-token retry, logout on final failure', status: 'todo', track: 'website', week: 2, estimate: '6h', blockedBy: ['b2-1'], parallel: ['b2-3'], assignee: A, tags: ['frontend', 'auth', 'api'] },
  { taskId: 'w2-2', taskNumber: n(), taskType: 'task', title: 'Business docs page', desc: 'ReactFlow diagrams: System arch, Auth flow, Revenue, Module dependency, Data flow — light theme, fully built', status: 'done', track: 'website', week: 2, estimate: '—', assignee: A, tags: ['frontend', 'ui'], completedAt: new Date('2026-04-02T00:00:00Z') },
  { taskId: 'w2-3', taskNumber: n(), taskType: 'task', title: 'User profile page (website)', desc: 'Profile view + edit form, avatar upload placeholder, role-specific fields display, wired to PUT /users/profile', status: 'todo', track: 'website', week: 2, estimate: '1d', blockedBy: ['b2-3'], assignee: A, tags: ['frontend', 'ui', 'api'] },
  // Mobile
  { taskId: 'm2-1', taskNumber: n(), taskType: 'task', title: 'Mobile — Auth stack + Login screen', desc: 'AuthStack navigator, LoginScreen with email/password form, react-hook-form + Zod validation, error messages, loading spinner', status: 'todo', track: 'mobile', week: 2, estimate: '1.5d', blockedBy: ['m1-2'], parallel: ['b2-1'], assignee: A, tags: ['mobile', 'auth', 'ui'] },
  { taskId: 'm2-2', taskNumber: n(), taskType: 'task', title: 'Mobile — Register + Role selection screens', desc: 'RegisterTypeScreen (Teacher/Student/Parent), RegisterScreen with role-specific fields, AsyncStorage token save after success', status: 'todo', track: 'mobile', week: 2, estimate: '1.5d', blockedBy: ['m2-1'], assignee: A, tags: ['mobile', 'auth', 'ui'] },

  /* ══════════ WEEK 3 — April 15–21 ══════════ */
  // Backend
  { taskId: 'b3-1', taskNumber: n(), taskType: 'feature', title: 'AWS S3 — Video/Media upload service', desc: 'AWS SDK v3, S3 bucket setup with CORS, presigned URL generation for upload/download, multer-s3 middleware, MediaAsset model with S3 key + URL + size + duration', status: 'todo', track: 'backend', week: 3, estimate: '1.5d', blockedBy: ['b2-3'], parallel: ['b3-2'], assignee: A, tags: ['backend', 'aws', 'api'] },
  { taskId: 'b3-2', taskNumber: n(), taskType: 'feature', title: 'Course Module — CRUD + Lessons + Quiz', desc: 'Full course lifecycle: draft->published, section/lesson ordering, quiz with questions & correct answer, MongoDB text search indexes, Teacher ownership guard. Lesson videos stored on AWS S3', status: 'todo', track: 'backend', week: 3, estimate: '2.5d', blockedBy: ['b2-3'], parallel: ['b3-1', 'w3-1'], assignee: A, tags: ['backend', 'api', 'aws', 'database'] },
  // Website
  { taskId: 'w3-1', taskNumber: n(), taskType: 'task', title: 'Teacher dashboard — Course management UI', desc: 'Create/edit course form, section builder, lesson editor, quiz builder, cover image upload (to S3), draft/publish toggle, video upload with S3 presigned URL', status: 'todo', track: 'website', week: 3, estimate: '3d', blockedBy: ['b3-2', 'b2-3'], parallel: ['b3-2', 'm3-1'], assignee: A, tags: ['frontend', 'ui', 'aws'] },
  { taskId: 'w3-2', taskNumber: n(), taskType: 'task', title: 'Course catalog page (public)', desc: 'Paginated course grid, category + tag filters, search bar, course detail page with syllabus, enroll CTA button', status: 'todo', track: 'website', week: 3, estimate: '2d', blockedBy: ['b3-2'], assignee: A, tags: ['frontend', 'ui'] },
  // Mobile
  { taskId: 'm3-1', taskNumber: n(), taskType: 'task', title: 'Mobile — OTP confirm + Forgot/Reset screens', desc: 'OTP input (6 cells, auto-focus next), 15-min countdown, resend button, ResetPasswordScreen with new password form', status: 'todo', track: 'mobile', week: 3, estimate: '1.5d', blockedBy: ['b2-2', 'm2-2'], assignee: A, tags: ['mobile', 'auth', 'ui'] },
  { taskId: 'm3-2', taskNumber: n(), taskType: 'task', title: 'Mobile — Course catalog + detail screens', desc: 'CourseListScreen with FlatList + filters, CourseDetailScreen with syllabus, react-native-video preview from S3, Enroll button', status: 'todo', track: 'mobile', week: 3, estimate: '2d', blockedBy: ['b3-2', 'm2-2'], parallel: ['w3-1'], assignee: A, tags: ['mobile', 'ui', 'aws'] },

  /* ══════════ WEEK 4 — April 22–28 ══════════ */
  // Backend
  { taskId: 'b4-1', taskNumber: n(), taskType: 'feature', title: 'Enrollment Module — Enroll + Progress + Grades', desc: 'POST /enrollments, unique enrollment guard, PUT /progress/:lessonId (completionPct), GET /grades, quiz attempt recording', status: 'todo', track: 'backend', week: 4, estimate: '1.5d', blockedBy: ['b3-2', 'b2-3'], assignee: A, tags: ['backend', 'api', 'database'] },
  { taskId: 'b4-2', taskNumber: n(), taskType: 'feature', title: 'Payment Module — Paymob integration', desc: 'POST /payments/intent (create order), Paymob iframe URL response, POST /payments/webhook (HMAC verify), Subscription + Invoice + Transaction models', status: 'todo', track: 'backend', week: 4, estimate: '2d', blockedBy: ['b2-3'], parallel: ['b4-1', 'b4-3'], assignee: A, tags: ['backend', 'payment', 'api', 'security'] },
  { taskId: 'b4-3', taskNumber: n(), taskType: 'feature', title: 'Notification Module — Backend service', desc: 'Multi-channel notification dispatcher (FCM + SendGrid + Socket.IO), NotificationHistory model, POST /notifications/send, GET /notifications, mark-read, unread count, Socket.IO room per user', status: 'todo', track: 'backend', week: 4, estimate: '1.5d', blockedBy: ['b2-3'], parallel: ['b4-2'], assignee: A, tags: ['backend', 'firebase', 'api'] },
  { taskId: 'b4-4', taskNumber: n(), taskType: 'feature', title: 'Firebase Admin SDK — FCM push setup', desc: 'firebase-admin SDK init, FCM token registration endpoint POST /users/fcm-token, send push via admin.messaging().send(), topic subscription for broadcast, notification templates', status: 'todo', track: 'backend', week: 4, estimate: '1d', blockedBy: ['b4-3'], assignee: A, tags: ['backend', 'firebase', 'api'] },
  // Website
  { taskId: 'w4-1', taskNumber: n(), taskType: 'task', title: 'Student dashboard — Enrolled courses + progress', desc: 'My Courses tab, lesson video player (react-player with S3 URLs), progress bar, quiz attempt UI with score display, grade card', status: 'todo', track: 'website', week: 4, estimate: '3d', blockedBy: ['b4-1'], parallel: ['m4-1'], assignee: A, tags: ['frontend', 'ui', 'aws'] },
  { taskId: 'w4-2', taskNumber: n(), taskType: 'task', title: 'Payment + subscription flow UI', desc: 'Pricing plans page, Paymob checkout redirect, payment success/fail pages, invoice history list', status: 'todo', track: 'website', week: 4, estimate: '2d', blockedBy: ['b4-2'], assignee: A, tags: ['frontend', 'payment', 'ui'] },
  // Mobile
  { taskId: 'm4-1', taskNumber: n(), taskType: 'task', title: 'Mobile — Enrolled courses + lesson player', desc: 'MyCoursesScreen (tab), LessonListScreen, lesson video player using react-native-video with S3 streaming URLs, progress tracking, quiz screen', status: 'todo', track: 'mobile', week: 4, estimate: '3d', blockedBy: ['b4-1', 'm3-2'], parallel: ['w4-1'], assignee: A, tags: ['mobile', 'ui', 'aws'] },
  { taskId: 'm4-2', taskNumber: n(), taskType: 'task', title: 'Mobile — Payment flow (Paymob WebView)', desc: 'PaymentScreen opening Paymob iframe in react-native WebView, handle success/fail deep link redirect, show invoice screen', status: 'todo', track: 'mobile', week: 4, estimate: '1.5d', blockedBy: ['b4-2', 'm4-1'], assignee: A, tags: ['mobile', 'payment', 'ui'] },

  /* ══════════ WEEK 5 — April 29 – May 5 ══════════ */
  // Backend
  { taskId: 'b5-1', taskNumber: n(), taskType: 'feature', title: 'Gamification Module — XP + Badges + Streaks', desc: 'Award XP on lesson/quiz complete, badge unlock logic (10 badge types), daily streak tracking, GET /gamification/leaderboard', status: 'todo', track: 'backend', week: 5, estimate: '1.5d', blockedBy: ['b4-1'], parallel: ['b5-2', 'b5-3'], assignee: A, tags: ['backend', 'api', 'database'] },
  { taskId: 'b5-2', taskNumber: n(), taskType: 'feature', title: 'AI/Analytics Module — Progress insights', desc: 'MongoDB aggregation: completion rates, avg quiz scores, at-risk student detection, simple recommendation by category overlap', status: 'todo', track: 'backend', week: 5, estimate: '2d', blockedBy: ['b4-1'], parallel: ['b5-1'], assignee: A, tags: ['backend', 'api', 'database'] },
  { taskId: 'b5-3', taskNumber: n(), taskType: 'feature', title: 'Parent Module — Child link + progress reports', desc: 'Invite-code child link flow, GET /parent/children, /parent/progress/:childId, weekly cron report, ParentAlert model', status: 'todo', track: 'backend', week: 5, estimate: '1d', blockedBy: ['b4-1'], parallel: ['b5-1'], assignee: A, tags: ['backend', 'api'] },
  // Website
  { taskId: 'w5-1', taskNumber: n(), taskType: 'task', title: 'Notification center UI', desc: 'Bell icon with unread badge, dropdown notification inbox, mark-all-read, Socket.IO live updates, link-to-source on click', status: 'todo', track: 'website', week: 5, estimate: '1.5d', blockedBy: ['b4-3'], parallel: ['w5-2'], assignee: A, tags: ['frontend', 'ui', 'firebase'] },
  { taskId: 'w5-2', taskNumber: n(), taskType: 'task', title: 'Gamification UI — XP + Badges + Leaderboard', desc: 'XP progress bar in sidebar, badge showcase grid, weekly leaderboard table, streak flame widget', status: 'todo', track: 'website', week: 5, estimate: '1.5d', blockedBy: ['b5-1'], parallel: ['w5-1'], assignee: A, tags: ['frontend', 'ui'] },
  { taskId: 'w5-3', taskNumber: n(), taskType: 'task', title: 'Teacher analytics dashboard', desc: 'Enrollment trend chart (Recharts), revenue by month, student engagement heatmap, at-risk students list with alert', status: 'todo', track: 'website', week: 5, estimate: '2d', blockedBy: ['b5-2'], assignee: A, tags: ['frontend', 'ui'] },
  // Mobile
  { taskId: 'm5-1', taskNumber: n(), taskType: 'task', title: 'Mobile — Firebase Cloud Messaging setup', desc: '@react-native-firebase/app + @react-native-firebase/messaging (React Native CLI), request permission, getToken() -> send to backend, background/foreground handlers, notification tap deep link', status: 'todo', track: 'mobile', week: 5, estimate: '1.5d', blockedBy: ['b4-4'], parallel: ['m5-2'], assignee: A, tags: ['mobile', 'firebase'] },
  { taskId: 'm5-2', taskNumber: n(), taskType: 'task', title: 'Mobile — Notifications + Gamification screens', desc: 'NotificationsScreen (FlatList, mark-read), BadgesScreen, LeaderboardScreen, XP bar in HomeScreen header', status: 'todo', track: 'mobile', week: 5, estimate: '1.5d', blockedBy: ['b5-1', 'm5-1'], parallel: ['m5-1'], assignee: A, tags: ['mobile', 'ui', 'firebase'] },

  /* ══════════ WEEK 6 — May 6–12 ══════════ */
  // Backend
  { taskId: 'b6-1', taskNumber: n(), taskType: 'feature', title: 'Live Session Module — Socket.IO signaling', desc: 'Session CRUD, Socket.IO rooms: join/leave/signal/chat, SessionParticipant model, attendance tracking, teacher end-session broadcast', status: 'todo', track: 'backend', week: 6, estimate: '2d', blockedBy: ['b3-2', 'b4-3'], parallel: ['w6-1'], assignee: A, tags: ['backend', 'api'] },
  { taskId: 'b6-2', taskNumber: n(), taskType: 'feature', title: 'Admin Module — User mgmt + audit log', desc: 'GET/PATCH /admin/users (suspend/activate/delete), GET /admin/audit-log, SystemConfig model, finance summary endpoint', status: 'todo', track: 'backend', week: 6, estimate: '1.5d', blockedBy: ['b2-3'], parallel: ['b6-1', 'b6-3'], assignee: A, tags: ['backend', 'api', 'security'] },
  { taskId: 'b6-3', taskNumber: n(), taskType: 'improvement', title: 'Redis caching — OTP + sessions + leaderboard', desc: 'ioredis client, move OTP storage to Redis TTL, cache leaderboard (5-min refresh), upgrade rate-limiter to Redis-backed', status: 'todo', track: 'backend', week: 6, estimate: '1d', blockedBy: ['b4-3'], parallel: ['b6-1'], assignee: A, tags: ['backend', 'performance', 'database'] },
  { taskId: 'b6-4', taskNumber: n(), taskType: 'feature', title: 'AWS S3 — Video transcoding + CloudFront CDN', desc: 'Lambda trigger on S3 upload for HLS transcoding via MediaConvert, CloudFront distribution for video streaming, signed URL for protected content', status: 'todo', track: 'backend', week: 6, estimate: '1.5d', blockedBy: ['b3-1'], assignee: A, tags: ['backend', 'aws', 'performance'] },
  // DevOps
  { taskId: 'd6-1', taskNumber: n(), taskType: 'task', title: 'CI/CD — GitHub Actions pipeline', desc: 'Lint + build + test on every PR, auto-deploy backend to staging on merge to dev branch, Slack notify on fail', status: 'todo', track: 'devops', week: 6, estimate: '1d', parallel: ['b6-1'], assignee: A, tags: ['devops', 'deploy'] },
  { taskId: 'd6-2', taskNumber: n(), taskType: 'task', title: 'Staging environment — Railway + Atlas', desc: 'Deploy Node.js backend to Railway, env secrets in dashboard, MongoDB Atlas staging cluster (M0), S3 staging bucket, Firebase project staging', status: 'todo', track: 'devops', week: 6, estimate: '6h', blockedBy: ['d6-1'], assignee: A, tags: ['devops', 'deploy', 'aws'] },
  // Website
  { taskId: 'w6-1', taskNumber: n(), taskType: 'task', title: 'Live session UI — host + join', desc: 'Session scheduler (calendar picker), WebRTC video grid via simple-peer (up to 6 participants), in-session chat panel, raise-hand button', status: 'todo', track: 'website', week: 6, estimate: '3d', blockedBy: ['b6-1'], parallel: ['m6-1'], assignee: A, tags: ['frontend', 'ui'] },
  { taskId: 'w6-2', taskNumber: n(), taskType: 'task', title: 'Admin panel UI', desc: 'Users data table with role filter + search, suspend/activate actions, audit log viewer with filters, system config page', status: 'todo', track: 'website', week: 6, estimate: '2d', blockedBy: ['b6-2'], assignee: A, tags: ['frontend', 'ui', 'security'] },
  // Mobile
  { taskId: 'm6-1', taskNumber: n(), taskType: 'task', title: 'Mobile — Live session viewer (student)', desc: 'JoinSessionScreen, react-native-webrtc RTCPeerConnection setup, remote video stream, in-session text chat (Socket.IO), raise-hand action', status: 'todo', track: 'mobile', week: 6, estimate: '2.5d', blockedBy: ['b6-1'], parallel: ['w6-1'], assignee: A, tags: ['mobile', 'ui'] },

  /* ══════════ WEEK 7 — May 13–19 ══════════ */
  // Backend
  { taskId: 'b7-1', taskNumber: n(), taskType: 'feature', title: 'Parent Module — Cron reports + message thread', desc: 'node-cron weekly report job (Sunday 00:00 UTC), alert generation from at-risk data, parent<->teacher message thread model, FCM push on new report', status: 'todo', track: 'backend', week: 7, estimate: '1.5d', blockedBy: ['b5-3', 'b5-2'], assignee: A, tags: ['backend', 'api', 'firebase'] },
  { taskId: 'b7-2', taskNumber: n(), taskType: 'improvement', title: 'API hardening — rate limit + validation + errors', desc: 'Global Express error handler, Zod request schema validation, helmet security headers, CORS whitelist, express-rate-limit per route', status: 'todo', track: 'backend', week: 7, estimate: '1d', blockedBy: ['b6-2'], parallel: ['b7-3'], assignee: A, tags: ['backend', 'security', 'api'] },
  { taskId: 'b7-3', taskNumber: n(), taskType: 'task', title: 'Backend integration tests — Supertest + Jest', desc: 'E2E tests: auth flow, course CRUD, enrollment, payment webhook mock, Paymob HMAC verify, S3 upload mock, FCM mock, 80%+ line coverage', status: 'todo', track: 'backend', week: 7, estimate: '2d', blockedBy: ['b6-2'], parallel: ['b7-2'], assignee: A, tags: ['backend', 'testing'] },
  // Website
  { taskId: 'w7-1', taskNumber: n(), taskType: 'task', title: 'Parent dashboard UI', desc: 'Children list cards, per-child progress overview, AI weekly report viewer, alert feed, parent<->teacher message thread', status: 'todo', track: 'website', week: 7, estimate: '2d', blockedBy: ['b7-1'], parallel: ['m7-1'], assignee: A, tags: ['frontend', 'ui'] },
  { taskId: 'w7-2', taskNumber: n(), taskType: 'improvement', title: 'Responsive polish + a11y audit', desc: 'Mobile-first breakpoints, keyboard navigation, ARIA labels, skip-to-content, color contrast ratios, Lighthouse >=90 target', status: 'todo', track: 'website', week: 7, estimate: '1.5d', parallel: ['w7-1'], assignee: A, tags: ['frontend', 'ui', 'performance'] },
  { taskId: 'w7-3', taskNumber: n(), taskType: 'task', title: 'i18n — complete Arabic + English coverage', desc: 'All dashboard + auth strings in i18n keys (react-i18next), RTL/LTR layout swap on toggle, EGP + Arabic numeral formatting', status: 'todo', track: 'website', week: 7, estimate: '1.5d', parallel: ['w7-2'], assignee: A, tags: ['frontend', 'ui'] },
  { taskId: 'w7-4', taskNumber: n(), taskType: 'task', title: 'Firebase web push notifications', desc: 'firebase/messaging SDK in React, service worker for background push, request permission, register FCM token with backend, show browser notification popup', status: 'todo', track: 'website', week: 7, estimate: '1d', blockedBy: ['b4-4'], assignee: A, tags: ['frontend', 'firebase'] },
  // Mobile
  { taskId: 'm7-1', taskNumber: n(), taskType: 'task', title: 'Mobile — Parent dashboard screens', desc: 'ChildrenListScreen, ChildProgressScreen, WeeklyReportScreen, AlertsScreen, MessageThreadScreen (parent<->teacher)', status: 'todo', track: 'mobile', week: 7, estimate: '2d', blockedBy: ['b7-1', 'm6-1'], parallel: ['w7-1'], assignee: A, tags: ['mobile', 'ui'] },
  { taskId: 'm7-2', taskNumber: n(), taskType: 'task', title: 'Mobile — Profile + Settings screens (all roles)', desc: 'ProfileScreen (view + edit, avatar via react-native-image-picker -> S3), SettingsScreen, logout, delete account confirm', status: 'todo', track: 'mobile', week: 7, estimate: '1.5d', parallel: ['m7-1'], assignee: A, tags: ['mobile', 'ui', 'aws'] },

  /* ══════════ WEEK 8 — May 20–31 ══════════ */
  // Backend
  { taskId: 'b8-1', taskNumber: n(), taskType: 'improvement', title: 'Performance audit + DB query optimisation', desc: 'MongoDB explain() on slow queries, add missing compound indexes, fix N+1 leaks, p95 response time target <200ms, S3 CloudFront cache-hit ratio check', status: 'todo', track: 'backend', week: 8, estimate: '1.5d', blockedBy: ['b7-3'], assignee: A, tags: ['backend', 'performance', 'database', 'aws'] },
  { taskId: 'b8-2', taskNumber: n(), taskType: 'improvement', title: 'Security hardening + dependency audit', desc: 'npm audit fix, NoSQL injection guards (mongo-sanitize), XSS headers (helmet), Paymob webhook HMAC final verification, S3 bucket policy review', status: 'todo', track: 'backend', week: 8, estimate: '1d', blockedBy: ['b7-2'], parallel: ['b8-1'], assignee: A, tags: ['backend', 'security', 'aws'] },
  // DevOps
  { taskId: 'd8-1', taskNumber: n(), taskType: 'task', title: 'Production environment setup', desc: 'Railway production service, MongoDB Atlas M10 tier, AWS S3 production bucket + CloudFront, Firebase production project, custom domain + SSL, secrets management', status: 'todo', track: 'devops', week: 8, estimate: '1d', blockedBy: ['d6-2'], parallel: ['b8-1'], assignee: A, tags: ['devops', 'deploy', 'aws', 'firebase'] },
  { taskId: 'd8-2', taskNumber: n(), taskType: 'task', title: 'Monitoring + alerting — Sentry + UptimeRobot', desc: 'Sentry DSN in backend + frontend + mobile, UptimeRobot 5-min ping, Slack webhook on error spike or downtime, Firebase Crashlytics for mobile', status: 'todo', track: 'devops', week: 8, estimate: '6h', blockedBy: ['d8-1'], assignee: A, tags: ['devops', 'deploy', 'firebase'] },
  // Website
  { taskId: 'w8-1', taskNumber: n(), taskType: 'task', title: 'Full E2E QA — all user journeys', desc: 'Teacher: register->create course->upload video to S3->enroll student->receive payment. Student: enroll->watch lesson->take quiz->earn badge. Parent: link child->view report', status: 'todo', track: 'website', week: 8, estimate: '2d', blockedBy: ['w7-2', 'w7-3'], parallel: ['m8-1'], assignee: A, tags: ['frontend', 'testing'] },
  { taskId: 'w8-2', taskNumber: n(), taskType: 'task', title: 'Production build + deploy', desc: 'Vite production build, deploy to Vercel/Netlify, configure env vars, custom domain, Lighthouse final audit >=90', status: 'todo', track: 'website', week: 8, estimate: '6h', blockedBy: ['w8-1'], assignee: A, tags: ['frontend', 'deploy'] },
  // Mobile
  { taskId: 'm8-1', taskNumber: n(), taskType: 'task', title: 'Mobile — E2E testing + manual QA', desc: 'Critical path manual QA on iOS Simulator + Android Emulator: auth, course, payment, live session, FCM notifications, S3 video playback — crash-free 99%', status: 'todo', track: 'mobile', week: 8, estimate: '2d', blockedBy: ['m7-2'], parallel: ['w8-1'], assignee: A, tags: ['mobile', 'testing', 'firebase', 'aws'] },
  { taskId: 'm8-2', taskNumber: n(), taskType: 'task', title: 'Mobile — Release build + store submission prep', desc: 'react-native build-android --variant=release, Xcode Archive for iOS, app icons + splash (react-native-bootsplash), Play Store + App Store metadata, Firebase Crashlytics enabled', status: 'todo', track: 'mobile', week: 8, estimate: '1.5d', blockedBy: ['m8-1'], assignee: A, tags: ['mobile', 'deploy', 'firebase'] },
];

/* ─────────────────────────────────────────────────────────────
   SEED FUNCTION
───────────────────────────────────────────────────────────── */
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set.');
    console.error('   Set it in .env or pass it: MONGODB_URI=mongodb+srv://... npx ts-node scripts/seed-roadmap.ts');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected.');

  // Drop existing roadmap tasks
  console.log('🗑️  Dropping existing roadmapTasks collection...');
  try {
    await mongoose.connection.db!.dropCollection('roadmaptasks');
    console.log('   Dropped.');
  } catch {
    console.log('   Collection did not exist — skipping.');
  }

  // Insert all seed tasks
  console.log(`📦 Inserting ${SEED_TASKS.length} roadmap tasks...`);
  const result = await RoadmapTask.insertMany(SEED_TASKS);
  console.log(`✅ Inserted ${result.length} tasks.`);

  // Reset counter
  console.log('🔢 Resetting roadmapTaskNumber counter...');
  await Counter.findByIdAndUpdate(
    'roadmapTaskNumber',
    { seq: SEED_TASKS.length },
    { upsert: true }
  );
  console.log(`   Counter set to ${SEED_TASKS.length}.`);

  // Print summary
  const byTrack: Record<string, number> = {};
  const byWeek: Record<number, number> = {};
  const byStatus: Record<string, number> = {};
  for (const t of SEED_TASKS) {
    byTrack[t.track] = (byTrack[t.track] || 0) + 1;
    byWeek[t.week] = (byWeek[t.week] || 0) + 1;
    byStatus[t.status] = (byStatus[t.status] || 0) + 1;
  }

  console.log('\n📊 Seed Summary:');
  console.log(`   Total tasks: ${SEED_TASKS.length}`);
  console.log('   By track:', byTrack);
  console.log('   By week:', byWeek);
  console.log('   By status:', byStatus);

  await mongoose.disconnect();
  console.log('\n🔌 Disconnected. Seed complete! ✅');
}

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
