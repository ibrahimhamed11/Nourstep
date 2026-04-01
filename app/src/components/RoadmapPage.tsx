/**
 * RoadmapPage — 2-Month Sprint Roadmap to Launch
 * Route: /roadmap
 * Covers: Website, Backend API, Mobile App — all parallel tracks
 */
import { useState } from 'react';
import {
  CheckCircle2, Circle, Clock, AlertCircle, ChevronDown, ChevronRight,
  Globe, Server, Smartphone, Layers, Lock, CreditCard,
  Brain, Users2, Monitor,
  Rocket, Calendar, Zap, ArrowRight, Flag,
  BarChart3, Code2, ShieldCheck,
  Star,
} from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
type Status = 'done' | 'in-progress' | 'todo' | 'blocked';
type Track = 'website' | 'backend' | 'mobile' | 'devops';
type Week = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

interface Task {
  id: string;
  title: string;
  desc: string;
  status: Status;
  track: Track;
  week: Week;
  parallel?: string[]; // IDs of tasks that CAN run in parallel
  blockedBy?: string[]; // IDs that must finish first
  estimate: string; // e.g. "2d", "4h"
  assignee?: string;
}

/* ─────────────────────────────────────────────────────────────
   TASK DATA  — 8 Weeks · 4 Tracks
   Today = April 1, 2026  →  Launch June 2, 2026
   ⚠ Backend = NOT started yet
   ⚠ Mobile  = NOT started yet (React Native CLI — no Expo)
   ✅ Website = auth pages + landing done
───────────────────────────────────────────────────────────── */
const TASKS: Task[] = [
  /* ══════════ WEEK 1 — April 1–7 ══════════ */
  // Backend — NOT started
  { id: 'b1-1', title: 'Backend project scaffold', desc: 'Node.js 20 + Express 5, TypeScript, src/modules folder structure, ESLint + Prettier, Husky pre-commit hooks, dotenv config', status: 'todo', track: 'backend', week: 1, estimate: '4h' },
  { id: 'b1-2', title: 'MongoDB Atlas + Mongoose setup', desc: 'Atlas M0 cluster provisioning, Mongoose 8 connection with pool, base BaseModel timestamps, environment vars via dotenv', status: 'todo', track: 'backend', week: 1, estimate: '3h', blockedBy: ['b1-1'], parallel: ['b1-3'] },
  { id: 'b1-3', title: 'Auth Module — Register + OTP', desc: 'POST /api/v1/auth/register, 6-digit OTP, bcrypt password hash, SendGrid OTP email, OTPToken model with 15-min TTL, 3 resends/hr limit', status: 'todo', track: 'backend', week: 1, estimate: '1.5d', blockedBy: ['b1-2'] },
  // Website — landing done, auth UI done
  { id: 'w1-1', title: 'Landing page ✅', desc: 'Hero, Navbar, About, Problems, Features, MobileApp, Countdown, Footer — fully built with RTL + dark/light + language toggle', status: 'done', track: 'website', week: 1, estimate: '—' },
  { id: 'w1-2', title: 'Auth UI — all pages ✅', desc: 'LoginPage, RegisterTypePage, RegisterPage (Teacher/Student/Parent), ConfirmAccountPage, ForgotPasswordPage, ResetPasswordPage — fully built', status: 'done', track: 'website', week: 1, estimate: '—' },
  { id: 'w1-3', title: 'Wire auth UI to backend API', desc: 'Connect LoginPage + RegisterPage to POST /auth/login & /auth/register, handle OTP confirm, forgot/reset flows end-to-end with axios + error states', status: 'todo', track: 'website', week: 1, estimate: '1.5d', blockedBy: ['b1-3'], parallel: ['b1-3'] },
  // Mobile — NOT started (React Native CLI)
  { id: 'm1-1', title: 'React Native CLI project init', desc: 'npx react-native init NourstepApp --template react-native-template-typescript, iOS + Android workspace setup, Metro bundler config', status: 'todo', track: 'mobile', week: 1, estimate: '4h', parallel: ['b1-1'] },
  { id: 'm1-2', title: 'React Navigation v6 setup', desc: 'Install @react-navigation/native, @react-navigation/stack, @react-navigation/bottom-tabs, react-native-screens, react-native-safe-area-context, pod install', status: 'todo', track: 'mobile', week: 1, estimate: '3h', blockedBy: ['m1-1'] },

  /* ══════════ WEEK 2 — April 8–14 ══════════ */
  // Backend
  { id: 'b2-1', title: 'Auth Module — Login + JWT + Refresh', desc: 'POST /auth/login, access token 15m, refresh token 7d in httpOnly cookie, POST /auth/refresh, POST /auth/logout (revoke token)', status: 'todo', track: 'backend', week: 2, estimate: '1d', blockedBy: ['b1-3'] },
  { id: 'b2-2', title: 'Auth Module — Forgot / Reset password', desc: 'POST /auth/forgot-password (reset token 1h, SendGrid email), POST /auth/reset-password, invalidate token after use', status: 'todo', track: 'backend', week: 2, estimate: '6h', blockedBy: ['b2-1'] },
  { id: 'b2-3', title: 'User Module — Profile CRUD + RBAC middleware', desc: 'GET /users/me, PUT /users/profile, Teacher/Student/Parent/Center models with role-specific fields, verifyToken + requireRole() middleware', status: 'todo', track: 'backend', week: 2, estimate: '1.5d', blockedBy: ['b2-1'], parallel: ['w2-1'] },
  // Website
  { id: 'w2-1', title: 'Axios API client + auth interceptors', desc: 'Central axios instance, request interceptor to attach JWT, response interceptor for 401 refresh-token retry, logout on final failure', status: 'todo', track: 'website', week: 2, estimate: '6h', blockedBy: ['b2-1'], parallel: ['b2-3'] },
  { id: 'w2-2', title: 'Business docs page ✅', desc: 'ReactFlow diagrams: System arch, Auth flow, Revenue, Module dependency, Data flow — light theme, fully built', status: 'done', track: 'website', week: 2, estimate: '—' },
  { id: 'w2-3', title: 'User profile page (website)', desc: 'Profile view + edit form, avatar upload placeholder, role-specific fields display, wired to PUT /users/profile', status: 'todo', track: 'website', week: 2, estimate: '1d', blockedBy: ['b2-3'] },
  // Mobile
  { id: 'm2-1', title: 'Mobile — Auth stack + Login screen', desc: 'AuthStack navigator, LoginScreen with email/password form, react-hook-form + Zod validation, error messages, loading spinner', status: 'todo', track: 'mobile', week: 2, estimate: '1.5d', blockedBy: ['m1-2'], parallel: ['b2-1'] },
  { id: 'm2-2', title: 'Mobile — Register + Role selection screens', desc: 'RegisterTypeScreen (Teacher/Student/Parent), RegisterScreen with role-specific fields, AsyncStorage token save after success', status: 'todo', track: 'mobile', week: 2, estimate: '1.5d', blockedBy: ['m2-1'] },

  /* ══════════ WEEK 3 — April 15–21 ══════════ */
  // Backend
  { id: 'b3-1', title: 'Media Module — Cloudinary upload/delete', desc: 'POST /media/upload (multer + multipart), Cloudinary SDK, DELETE /media/:id, signed URL generation, MediaAsset model', status: 'todo', track: 'backend', week: 3, estimate: '1d', blockedBy: ['b2-3'], parallel: ['b3-2'] },
  { id: 'b3-2', title: 'Course Module — CRUD + Lessons + Quiz', desc: 'Full course lifecycle: draft→published, section/lesson ordering, quiz with questions & correct answer, MongoDB text search indexes, Teacher ownership guard', status: 'todo', track: 'backend', week: 3, estimate: '2.5d', blockedBy: ['b2-3'], parallel: ['b3-1', 'w3-1'] },
  // Website
  { id: 'w3-1', title: 'Teacher dashboard — Course management UI', desc: 'Create/edit course form, section builder, lesson editor, quiz builder, cover image upload (to Media API), draft/publish toggle', status: 'todo', track: 'website', week: 3, estimate: '3d', blockedBy: ['b3-2', 'b2-3'], parallel: ['b3-2', 'm3-1'] },
  { id: 'w3-2', title: 'Course catalog page (public)', desc: 'Paginated course grid, category + tag filters, search bar, course detail page with syllabus, enroll CTA button', status: 'todo', track: 'website', week: 3, estimate: '2d', blockedBy: ['b3-2'] },
  // Mobile
  { id: 'm3-1', title: 'Mobile — OTP confirm + Forgot/Reset screens', desc: 'OTP input (6 cells, auto-focus next), 15-min countdown, resend button, ResetPasswordScreen with new password form', status: 'todo', track: 'mobile', week: 3, estimate: '1.5d', blockedBy: ['b2-2', 'm2-2'] },
  { id: 'm3-2', title: 'Mobile — Course catalog + detail screens', desc: 'CourseListScreen with FlatList + filters, CourseDetailScreen with syllabus, react-native-video preview, Enroll button', status: 'todo', track: 'mobile', week: 3, estimate: '2d', blockedBy: ['b3-2', 'm2-2'], parallel: ['w3-1'] },

  /* ══════════ WEEK 4 — April 22–28 ══════════ */
  // Backend
  { id: 'b4-1', title: 'Enrollment Module — Enroll + Progress + Grades', desc: 'POST /enrollments, unique enrollment guard, PUT /progress/:lessonId (completionPct), GET /grades, quiz attempt recording', status: 'todo', track: 'backend', week: 4, estimate: '1.5d', blockedBy: ['b3-2', 'b2-3'] },
  { id: 'b4-2', title: 'Payment Module — Paymob integration', desc: 'POST /payments/intent (create order), Paymob iframe URL response, POST /payments/webhook (HMAC verify), Subscription + Invoice + Transaction models', status: 'todo', track: 'backend', week: 4, estimate: '2d', blockedBy: ['b2-3'], parallel: ['b4-1', 'b4-3'] },
  { id: 'b4-3', title: 'Notification Module — FCM + SendGrid + Socket.IO', desc: 'Multi-channel notification dispatcher, NotificationHistory model, Socket.IO server room user:{id}, mark-read, unread count', status: 'todo', track: 'backend', week: 4, estimate: '1.5d', blockedBy: ['b2-3'], parallel: ['b4-2'] },
  // Website
  { id: 'w4-1', title: 'Student dashboard — Enrolled courses + progress', desc: 'My Courses tab, lesson video player (react-player), progress bar, quiz attempt UI with score display, grade card', status: 'todo', track: 'website', week: 4, estimate: '3d', blockedBy: ['b4-1'], parallel: ['m4-1'] },
  { id: 'w4-2', title: 'Payment + subscription flow UI', desc: 'Pricing plans page, Paymob checkout redirect, payment success/fail pages, invoice history list', status: 'todo', track: 'website', week: 4, estimate: '2d', blockedBy: ['b4-2'] },
  // Mobile
  { id: 'm4-1', title: 'Mobile — Enrolled courses + lesson player', desc: 'MyCoursesScreen (tab), LessonListScreen, lesson video player using react-native-video, progress tracking, quiz screen with radio answers', status: 'todo', track: 'mobile', week: 4, estimate: '3d', blockedBy: ['b4-1', 'm3-2'], parallel: ['w4-1'] },
  { id: 'm4-2', title: 'Mobile — Payment flow (Paymob WebView)', desc: 'PaymentScreen opening Paymob iframe in react-native WebView, handle success/fail deep link redirect, show invoice screen', status: 'todo', track: 'mobile', week: 4, estimate: '1.5d', blockedBy: ['b4-2', 'm4-1'] },

  /* ══════════ WEEK 5 — April 29 – May 5 ══════════ */
  // Backend
  { id: 'b5-1', title: 'Gamification Module — XP + Badges + Streaks', desc: 'Award XP on lesson/quiz complete, badge unlock logic (10 badge types), daily streak tracking, GET /gamification/leaderboard', status: 'todo', track: 'backend', week: 5, estimate: '1.5d', blockedBy: ['b4-1'], parallel: ['b5-2', 'b5-3'] },
  { id: 'b5-2', title: 'AI/Analytics Module — Progress insights', desc: 'MongoDB aggregation: completion rates, avg quiz scores, at-risk student detection, simple recommendation by category overlap', status: 'todo', track: 'backend', week: 5, estimate: '2d', blockedBy: ['b4-1'], parallel: ['b5-1'] },
  { id: 'b5-3', title: 'Parent Module — Child link + progress reports', desc: 'Invite-code child link flow, GET /parent/children, /parent/progress/:childId, weekly cron report, ParentAlert model', status: 'todo', track: 'backend', week: 5, estimate: '1d', blockedBy: ['b4-1'], parallel: ['b5-1'] },
  // Website
  { id: 'w5-1', title: 'Notification center UI', desc: 'Bell icon with unread badge, dropdown notification inbox, mark-all-read, Socket.IO live updates, link-to-source on click', status: 'todo', track: 'website', week: 5, estimate: '1.5d', blockedBy: ['b4-3'], parallel: ['w5-2'] },
  { id: 'w5-2', title: 'Gamification UI — XP + Badges + Leaderboard', desc: 'XP progress bar in sidebar, badge showcase grid, weekly leaderboard table, streak flame widget', status: 'todo', track: 'website', week: 5, estimate: '1.5d', blockedBy: ['b5-1'], parallel: ['w5-1'] },
  { id: 'w5-3', title: 'Teacher analytics dashboard', desc: 'Enrollment trend chart (Recharts), revenue by month, student engagement heatmap, at-risk students list with alert', status: 'todo', track: 'website', week: 5, estimate: '2d', blockedBy: ['b5-2'] },
  // Mobile
  { id: 'm5-1', title: 'Mobile — FCM push notifications setup', desc: '@react-native-firebase/app + messaging, request permission, getToken() → send to backend, background/foreground handlers, notification tap deep link', status: 'todo', track: 'mobile', week: 5, estimate: '1.5d', blockedBy: ['b4-3'], parallel: ['m5-2'] },
  { id: 'm5-2', title: 'Mobile — Notifications + Gamification screens', desc: 'NotificationsScreen (FlatList, mark-read), BadgesScreen, LeaderboardScreen, XP bar in HomeScreen header', status: 'todo', track: 'mobile', week: 5, estimate: '1.5d', blockedBy: ['b5-1', 'm5-1'], parallel: ['m5-1'] },

  /* ══════════ WEEK 6 — May 6–12 ══════════ */
  // Backend
  { id: 'b6-1', title: 'Live Session Module — Socket.IO signaling', desc: 'Session CRUD, Socket.IO rooms: join/leave/signal/chat, SessionParticipant model, attendance tracking, teacher end-session broadcast', status: 'todo', track: 'backend', week: 6, estimate: '2d', blockedBy: ['b3-2', 'b4-3'], parallel: ['w6-1'] },
  { id: 'b6-2', title: 'Admin Module — User mgmt + audit log', desc: 'GET/PATCH /admin/users (suspend/activate/delete), GET /admin/audit-log, SystemConfig model, finance summary endpoint', status: 'todo', track: 'backend', week: 6, estimate: '1.5d', blockedBy: ['b2-3'], parallel: ['b6-1', 'b6-3'] },
  { id: 'b6-3', title: 'Redis caching — OTP + sessions + leaderboard', desc: 'ioredis client, move OTP storage to Redis TTL, cache leaderboard (5-min refresh), upgrade rate-limiter to Redis-backed', status: 'todo', track: 'backend', week: 6, estimate: '1d', blockedBy: ['b4-3'], parallel: ['b6-1'] },
  // DevOps
  { id: 'd6-1', title: 'CI/CD — GitHub Actions pipeline', desc: 'Lint + build + test on every PR, auto-deploy backend to staging on merge to dev branch, Slack notify on fail', status: 'todo', track: 'devops', week: 6, estimate: '1d', parallel: ['b6-1'] },
  { id: 'd6-2', title: 'Staging environment — Railway + Atlas', desc: 'Deploy Node.js backend to Railway, env secrets in dashboard, MongoDB Atlas staging cluster (M0), Cloudinary staging bucket', status: 'todo', track: 'devops', week: 6, estimate: '6h', blockedBy: ['d6-1'] },
  // Website
  { id: 'w6-1', title: 'Live session UI — host + join', desc: 'Session scheduler (calendar picker), WebRTC video grid via simple-peer (up to 6 participants), in-session chat panel, raise-hand button', status: 'todo', track: 'website', week: 6, estimate: '3d', blockedBy: ['b6-1'], parallel: ['m6-1'] },
  { id: 'w6-2', title: 'Admin panel UI', desc: 'Users data table with role filter + search, suspend/activate actions, audit log viewer with filters, system config page', status: 'todo', track: 'website', week: 6, estimate: '2d', blockedBy: ['b6-2'] },
  // Mobile
  { id: 'm6-1', title: 'Mobile — Live session viewer (student)', desc: 'JoinSessionScreen, react-native-webrtc RTCPeerConnection setup, remote video stream, in-session text chat (Socket.IO), raise-hand action', status: 'todo', track: 'mobile', week: 6, estimate: '2.5d', blockedBy: ['b6-1'], parallel: ['w6-1'] },

  /* ══════════ WEEK 7 — May 13–19 ══════════ */
  // Backend
  { id: 'b7-1', title: 'Parent Module — Cron reports + message thread', desc: 'node-cron weekly report job (Sunday 00:00 UTC), alert generation from at-risk data, parent↔teacher message thread model', status: 'todo', track: 'backend', week: 7, estimate: '1.5d', blockedBy: ['b5-3', 'b5-2'] },
  { id: 'b7-2', title: 'API hardening — rate limit + validation + errors', desc: 'Global Express error handler, Zod request schema validation, helmet security headers, CORS whitelist, express-rate-limit per route', status: 'todo', track: 'backend', week: 7, estimate: '1d', blockedBy: ['b6-2'], parallel: ['b7-3'] },
  { id: 'b7-3', title: 'Backend integration tests — Supertest + Jest', desc: 'E2E tests: auth flow, course CRUD, enrollment, payment webhook mock, Paymob HMAC verify, 80%+ line coverage target', status: 'todo', track: 'backend', week: 7, estimate: '2d', blockedBy: ['b6-2'], parallel: ['b7-2'] },
  // Website
  { id: 'w7-1', title: 'Parent dashboard UI', desc: 'Children list cards, per-child progress overview, AI weekly report viewer, alert feed, parent↔teacher message thread', status: 'todo', track: 'website', week: 7, estimate: '2d', blockedBy: ['b7-1'], parallel: ['m7-1'] },
  { id: 'w7-2', title: 'Responsive polish + a11y audit', desc: 'Mobile-first breakpoints, keyboard navigation, ARIA labels, skip-to-content, color contrast ratios, Lighthouse ≥90 target', status: 'todo', track: 'website', week: 7, estimate: '1.5d', parallel: ['w7-1'] },
  { id: 'w7-3', title: 'i18n — complete Arabic + English coverage', desc: 'All dashboard + auth strings in i18n keys (react-i18next), RTL/LTR layout swap on toggle, EGP + Arabic numeral formatting', status: 'todo', track: 'website', week: 7, estimate: '1.5d', parallel: ['w7-2'] },
  // Mobile
  { id: 'm7-1', title: 'Mobile — Parent dashboard screens', desc: 'ChildrenListScreen, ChildProgressScreen, WeeklyReportScreen, AlertsScreen, MessageThreadScreen (parent↔teacher)', status: 'todo', track: 'mobile', week: 7, estimate: '2d', blockedBy: ['b7-1', 'm6-1'], parallel: ['w7-1'] },
  { id: 'm7-2', title: 'Mobile — Profile + Settings screens (all roles)', desc: 'ProfileScreen (view + edit, avatar via react-native-image-picker → Media API), SettingsScreen, logout, delete account confirm', status: 'todo', track: 'mobile', week: 7, estimate: '1.5d', parallel: ['m7-1'] },

  /* ══════════ WEEK 8 — May 20–31 ══════════ */
  // Backend
  { id: 'b8-1', title: 'Performance audit + DB query optimisation', desc: 'MongoDB explain() on slow queries, add missing compound indexes, fix N+1 leaks, p95 response time target <200ms', status: 'todo', track: 'backend', week: 8, estimate: '1.5d', blockedBy: ['b7-3'] },
  { id: 'b8-2', title: 'Security hardening + dependency audit', desc: 'npm audit fix, NoSQL injection guards (mongo-sanitize), XSS headers (helmet), Paymob webhook HMAC final verification', status: 'todo', track: 'backend', week: 8, estimate: '1d', blockedBy: ['b7-2'], parallel: ['b8-1'] },
  // DevOps
  { id: 'd8-1', title: 'Production environment setup', desc: 'Railway production service, MongoDB Atlas M10 tier, Cloudinary production account, custom domain + SSL, secrets management', status: 'todo', track: 'devops', week: 8, estimate: '1d', blockedBy: ['d6-2'], parallel: ['b8-1'] },
  { id: 'd8-2', title: 'Monitoring + alerting — Sentry + UptimeRobot', desc: 'Sentry DSN in backend + frontend + mobile, UptimeRobot 5-min ping, Slack webhook on error spike or downtime', status: 'todo', track: 'devops', week: 8, estimate: '6h', blockedBy: ['d8-1'] },
  // Website
  { id: 'w8-1', title: 'Full E2E QA — all user journeys', desc: 'Teacher: register→create course→enroll student→receive payment. Student: enroll→watch lesson→take quiz→earn badge. Parent: link child→view report', status: 'todo', track: 'website', week: 8, estimate: '2d', blockedBy: ['w7-2', 'w7-3'], parallel: ['m8-1'] },
  { id: 'w8-2', title: 'Production build + deploy', desc: 'Vite production build, deploy to Vercel/Netlify, configure env vars, custom domain, Lighthouse final audit ≥90', status: 'todo', track: 'website', week: 8, estimate: '6h', blockedBy: ['w8-1'] },
  // Mobile
  { id: 'm8-1', title: 'Mobile — E2E testing + Detox or manual QA', desc: 'Critical path manual QA on iOS Simulator + Android Emulator: auth, course, payment, live session, notifications — crash-free 99%', status: 'todo', track: 'mobile', week: 8, estimate: '2d', blockedBy: ['m7-2'], parallel: ['w8-1'] },
  { id: 'm8-2', title: 'Mobile — Release build + store submission prep', desc: 'react-native build-android --variant=release, Xcode Archive for iOS, app icons + splash (react-native-bootsplash), Play Store + App Store metadata', status: 'todo', track: 'mobile', week: 8, estimate: '1.5d', blockedBy: ['m8-1'] },
];

/* ─────────────────────────────────────────────────────────────
   WEEK LABELS
───────────────────────────────────────────────────────────── */
const WEEKS: { week: Week; label: string; dates: string }[] = [
  { week: 1, label: 'Week 1', dates: 'Apr 1–7' },
  { week: 2, label: 'Week 2', dates: 'Apr 8–14' },
  { week: 3, label: 'Week 3', dates: 'Apr 15–21' },
  { week: 4, label: 'Week 4', dates: 'Apr 22–28' },
  { week: 5, label: 'Week 5', dates: 'Apr 29–May 5' },
  { week: 6, label: 'Week 6', dates: 'May 6–12' },
  { week: 7, label: 'Week 7', dates: 'May 13–19' },
  { week: 8, label: 'Week 8', dates: 'May 20–31' },
];

/* ─────────────────────────────────────────────────────────────
   TRACK CONFIG
───────────────────────────────────────────────────────────── */
const TRACK_CONFIG: Record<Track, { label: string; icon: React.ElementType; color: string; bg: string; border: string; dot: string }> = {
  website:  { label: 'Website / Frontend', icon: Globe,      color: '#2563EB', bg: 'bg-blue-50',   border: 'border-blue-200',   dot: 'bg-blue-500' },
  backend:  { label: 'Backend / API',      icon: Server,     color: '#10B981', bg: 'bg-emerald-50',border: 'border-emerald-200', dot: 'bg-emerald-500' },
  mobile:   { label: 'Mobile App',         icon: Smartphone, color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200',  dot: 'bg-purple-500' },
  devops:   { label: 'DevOps / Infra',     icon: Layers,     color: '#F59E0B', bg: 'bg-amber-50',  border: 'border-amber-200',   dot: 'bg-amber-500' },
};

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ElementType; cls: string; badge: string }> = {
  done:        { label: 'Done',        icon: CheckCircle2, cls: 'text-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  'in-progress':{ label: 'In Progress', icon: Clock,        cls: 'text-blue-500',   badge: 'bg-blue-100 text-blue-700 border-blue-200' },
  todo:        { label: 'To Do',       icon: Circle,       cls: 'text-gray-300',   badge: 'bg-gray-100 text-gray-500 border-gray-200' },
  blocked:     { label: 'Blocked',     icon: AlertCircle,  cls: 'text-red-400',    badge: 'bg-red-100 text-red-600 border-red-200' },
};

/* ─────────────────────────────────────────────────────────────
   HELPER — compute stats
───────────────────────────────────────────────────────────── */
function getStats(tasks: Task[]) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const blocked = tasks.filter(t => t.status === 'blocked').length;
  const pct = Math.round((done / total) * 100);
  return { total, done, inProgress, blocked, todo: total - done - inProgress - blocked, pct };
}

/* ─────────────────────────────────────────────────────────────
   TASK CARD
───────────────────────────────────────────────────────────── */
function TaskCard({ task, allTasks }: { task: Task; allTasks: Task[] }) {
  const [open, setOpen] = useState(false);
  const track = TRACK_CONFIG[task.track];
  const status = STATUS_CONFIG[task.status];
  const StatusIcon = status.icon;

  const blockingTasks = (task.blockedBy ?? []).map(id => allTasks.find(t => t.id === id)?.title ?? id);
  const parallelTasks = (task.parallel ?? []).map(id => allTasks.find(t => t.id === id)?.title ?? id);

  return (
    <div className={`rounded-xl border bg-white shadow-sm transition-all ${open ? 'shadow-md' : ''}`}
      style={{ borderLeftWidth: 3, borderLeftColor: track.color }}>
      <button
        className="w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <StatusIcon size={15} className={`flex-shrink-0 mt-0.5 ${status.cls}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-800 font-semibold text-xs leading-snug">{task.title}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${status.badge}`}>{status.label}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-gray-400">⏱ {task.estimate}</span>
            {task.parallel && task.parallel.length > 0 && (
              <span className="text-[10px] text-purple-500 font-medium">⚡ parallel</span>
            )}
            {task.blockedBy && task.blockedBy.length > 0 && (
              <span className="text-[10px] text-amber-500 font-medium">🔗 depends on {task.blockedBy.length}</span>
            )}
          </div>
        </div>
        {open ? <ChevronDown size={13} className="text-gray-400 flex-shrink-0 mt-0.5" /> : <ChevronRight size={13} className="text-gray-400 flex-shrink-0 mt-0.5" />}
      </button>

      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-3">
          <p className="text-gray-500 text-[11px] leading-relaxed">{task.desc}</p>

          {parallelTasks.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-purple-500 uppercase tracking-widest mb-1">⚡ Can run in parallel with</div>
              <div className="flex flex-wrap gap-1">
                {parallelTasks.map((t, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700">{t}</span>
                ))}
              </div>
            </div>
          )}

          {blockingTasks.length > 0 && (
            <div>
              <div className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1">🔗 Blocked by</div>
              <div className="flex flex-wrap gap-1">
                {blockingTasks.map((t, i) => (
                  <span key={i} className="text-[9px] px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-700">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   WEEK COLUMN
───────────────────────────────────────────────────────────── */
function WeekColumn({ week, tasks, allTasks, activeTrack }: {
  week: typeof WEEKS[number]; tasks: Task[]; allTasks: Task[]; activeTrack: Track | 'all'
}) {
  const filtered = activeTrack === 'all' ? tasks : tasks.filter(t => t.track === activeTrack);
  const stats = getStats(filtered);
  const isCurrentWeek = week.week === 1; // April 1–7 = current week (today = Apr 1, 2026)
  return (
    <div className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isCurrentWeek ? 'ring-2 ring-blue-400 ring-offset-1' : ''}`}>
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${isCurrentWeek ? 'bg-blue-600' : 'bg-gray-50 border-b border-gray-100'}`}>
        <div>
          <div className={`font-bold text-sm ${isCurrentWeek ? 'text-white' : 'text-gray-800'}`}>{week.label}</div>
          <div className={`text-[10px] ${isCurrentWeek ? 'text-blue-200' : 'text-gray-400'}`}>{week.dates}</div>
        </div>
        <div className="text-right">
          {isCurrentWeek && <div className="text-[9px] font-bold text-blue-200 mb-0.5">NOW</div>}
          <div className={`text-xs font-bold ${isCurrentWeek ? 'text-white' : 'text-gray-600'}`}>{stats.done}/{stats.total}</div>
          <div className={`text-[9px] ${isCurrentWeek ? 'text-blue-200' : 'text-gray-400'}`}>{stats.pct}% done</div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div className="h-1 bg-emerald-400 transition-all" style={{ width: `${stats.pct}%` }} />
      </div>
      {/* Tasks */}
      <div className="p-3 space-y-2 min-h-[80px]">
        {filtered.length === 0 ? (
          <p className="text-gray-300 text-[10px] text-center py-4">No tasks for this track</p>
        ) : (
          filtered.map(t => <TaskCard key={t.id} task={t} allTasks={allTasks} />)
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function RoadmapPage() {
  const [activeTrack, setActiveTrack] = useState<Track | 'all'>('all');
  const [view, setView] = useState<'board' | 'table' | 'parallel'>('board');

  const stats = getStats(TASKS);
  const trackStats = (Object.keys(TRACK_CONFIG) as Track[]).map(track => ({
    track,
    ...getStats(TASKS.filter(t => t.track === track)),
    ...TRACK_CONFIG[track],
  }));

  // Parallel groups — tasks in same week across different tracks that can run simultaneously
  const parallelGroups: { week: Week; tasks: Task[] }[] = WEEKS.map(w => ({
    week: w.week,
    tasks: TASKS.filter(t => t.week === w.week && (t.parallel ?? []).length > 0),
  })).filter(g => g.tasks.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-md">
              <Rocket size={17} className="text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-sm">2-Month Sprint Roadmap</div>
              <div className="text-gray-400 text-[10px]">April 1 → June 2, 2026 · Website + Backend + Mobile</div>
            </div>
          </div>

          {/* Overall progress */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right hidden sm:block">
              <div className="text-gray-800 font-bold text-sm">{stats.pct}% complete</div>
              <div className="text-gray-400 text-[10px]">{stats.done}/{stats.total} tasks done</div>
            </div>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all" style={{ width: `${stats.pct}%` }} />
            </div>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(['board', 'table', 'parallel'] as const).map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold capitalize transition-all ${view === v ? 'bg-white shadow-sm text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
                {v === 'board' ? '📋 Board' : v === 'table' ? '📊 Table' : '⚡ Parallel'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-screen-2xl mx-auto px-4 py-8 space-y-8">

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {trackStats.map(t => {
            const TrackIcon = t.icon;
            return (
              <button key={t.track} onClick={() => setActiveTrack(activeTrack === t.track ? 'all' : t.track)}
                className={`rounded-2xl border p-4 text-left transition-all cursor-pointer hover:shadow-md ${activeTrack === t.track ? `${t.bg} ${t.border} shadow-md` : 'bg-white border-gray-200'}`}>
                <div className="flex items-center gap-2 mb-3">
                  <TrackIcon size={14} style={{ color: t.color }} />
                  <span className="text-gray-700 font-bold text-xs">{t.label}</span>
                </div>
                <div className="text-2xl font-black mb-1" style={{ color: t.color }}>{t.pct}%</div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div className="h-1.5 rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                </div>
                <div className="flex gap-2 text-[10px] text-gray-400">
                  <span className="text-emerald-600 font-bold">✓ {t.done}</span>
                  <span className="text-blue-500 font-bold">▶ {t.inProgress}</span>
                  <span>○ {t.todo}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Milestone Strip ── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <h2 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
            <Flag size={14} className="text-blue-500" /> Key Milestones
          </h2>
          <div className="flex items-start gap-0 overflow-x-auto pb-2">
            {[
              { date: 'Apr 1',  label: 'Sprint Start',         icon: Rocket,       color: '#2563EB', done: true },
              { date: 'Apr 14', label: 'Auth + User APIs live', icon: Lock,         color: '#10B981', done: true },
              { date: 'Apr 28', label: 'Courses + Payments',    icon: CreditCard,   color: '#8B5CF6', done: false },
              { date: 'May 5',  label: 'AI + Gamification',     icon: Brain,        color: '#A855F7', done: false },
              { date: 'May 12', label: 'Live Sessions + Admin',  icon: Monitor,      color: '#F97316', done: false },
              { date: 'May 19', label: 'Parent + i18n + QA',    icon: Users2,       color: '#22C55E', done: false },
              { date: 'May 26', label: 'Staging Deploy + Perf', icon: BarChart3,    color: '#F59E0B', done: false },
              { date: 'Jun 2',  label: '🎉 LAUNCH — MVP',       icon: Star,         color: '#EF4444', done: false },
            ].map((m, i, arr) => {
              const MIcon = m.icon;
              return (
                <div key={i} className="flex items-center gap-0 flex-shrink-0">
                  <div className="flex flex-col items-center gap-1.5 w-28">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${m.done ? 'opacity-100' : 'opacity-60'}`}
                      style={{ backgroundColor: m.color + '18', border: `2px solid ${m.color}40` }}>
                      <MIcon size={15} style={{ color: m.color }} />
                    </div>
                    <div className="text-center">
                      <div className="text-gray-800 font-bold text-[10px]">{m.label}</div>
                      <div className="text-gray-400 text-[9px]">{m.date}</div>
                    </div>
                    {m.done && <CheckCircle2 size={11} className="text-emerald-500" />}
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight size={14} className="text-gray-200 mb-6 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Track filter pills ── */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setActiveTrack('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeTrack === 'all' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
            All tracks
          </button>
          {(Object.keys(TRACK_CONFIG) as Track[]).map(track => {
            const tc = TRACK_CONFIG[track];
            const TIcon = tc.icon;
            return (
              <button key={track} onClick={() => setActiveTrack(activeTrack === track ? 'all' : track)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${activeTrack === track ? `${tc.bg} ${tc.border}` : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
                style={activeTrack === track ? { color: tc.color } : {}}>
                <TIcon size={12} /> {tc.label}
              </button>
            );
          })}
        </div>

        {/* ── BOARD VIEW ── */}
        {view === 'board' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">
            {WEEKS.map(w => (
              <WeekColumn key={w.week} week={w}
                tasks={TASKS.filter(t => t.week === w.week)}
                allTasks={TASKS}
                activeTrack={activeTrack}
              />
            ))}
          </div>
        )}

        {/* ── TABLE VIEW ── */}
        {view === 'table' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest w-8">#</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Task</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Track</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Week</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Estimate</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Parallel?</th>
                    <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Blocked By</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeTrack === 'all' ? TASKS : TASKS.filter(t => t.track === activeTrack)).map((task, i) => {
                    const track = TRACK_CONFIG[task.track];
                    const status = STATUS_CONFIG[task.status];
                    const StatusIcon = status.icon;
                    const TrackIcon = track.icon;
                    return (
                      <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3 text-[10px] text-gray-300 font-mono">{i + 1}</td>
                        <td className="px-4 py-3 max-w-xs">
                          <div className="text-gray-800 font-semibold text-xs">{task.title}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5 line-clamp-1">{task.desc}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${track.bg} ${track.border} border w-fit`}>
                            <TrackIcon size={11} style={{ color: track.color }} />
                            <span className="text-[10px] font-bold" style={{ color: track.color }}>{track.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold text-gray-600">W{task.week}</span>
                          <div className="text-[9px] text-gray-400">{WEEKS.find(w => w.week === task.week)?.dates}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{task.estimate}</td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${status.badge} w-fit`}>
                            <StatusIcon size={10} />
                            <span className="text-[10px] font-bold">{status.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {task.parallel && task.parallel.length > 0
                            ? <span className="text-[10px] font-bold text-purple-500">⚡ {task.parallel.length} task{task.parallel.length > 1 ? 's' : ''}</span>
                            : <span className="text-[9px] text-gray-200">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          {task.blockedBy && task.blockedBy.length > 0
                            ? <span className="text-[10px] font-bold text-amber-500">🔗 {task.blockedBy.length} dep{task.blockedBy.length > 1 ? 's' : ''}</span>
                            : <span className="text-[9px] text-gray-200">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── PARALLEL VIEW ── */}
        {view === 'parallel' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
              <Zap size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-blue-800 font-bold text-sm">How to move fastest — run these in parallel</div>
                <p className="text-blue-600 text-xs mt-1 leading-relaxed">
                  These task groups can be executed simultaneously across tracks. Assign separate people or time-box your day: morning = backend, afternoon = frontend/mobile.
                  Tasks marked <strong>⚡ parallel</strong> have no blocking dependency on each other within the same week.
                </p>
              </div>
            </div>

            {parallelGroups.map(({ week, tasks: ptasks }) => {
              const weekInfo = WEEKS.find(w => w.week === week)!;
              // Group by parallel connections
              const groups: Task[][] = [];
              const visited = new Set<string>();
              ptasks.forEach(task => {
                if (visited.has(task.id)) return;
                const group = [task, ...((task.parallel ?? []).map(id => ptasks.find(t => t.id === id)).filter(Boolean) as Task[])];
                group.forEach(t => visited.add(t.id));
                if (group.length > 1) groups.push(group);
              });

              if (groups.length === 0) return null;

              return (
                <div key={week} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center gap-3">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="font-bold text-gray-800 text-sm">{weekInfo.label} — {weekInfo.dates}</span>
                    <span className="text-[10px] text-purple-500 font-bold ml-auto">⚡ {groups.length} parallel group{groups.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="p-5 space-y-5">
                    {groups.map((group, gi) => (
                      <div key={gi} className="rounded-xl border border-purple-100 bg-purple-50/30 p-4">
                        <div className="text-[10px] font-bold text-purple-500 uppercase tracking-widest mb-3">
                          ⚡ Parallel Group {gi + 1} — run simultaneously
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {group.map(task => {
                            const track = TRACK_CONFIG[task.track];
                            const status = STATUS_CONFIG[task.status];
                            const StatusIcon = status.icon;
                            const TrackIcon = track.icon;
                            return (
                              <div key={task.id} className={`rounded-xl border p-3 bg-white shadow-sm`}
                                style={{ borderLeftWidth: 3, borderLeftColor: track.color }}>
                                <div className="flex items-center gap-2 mb-2">
                                  <TrackIcon size={12} style={{ color: track.color }} />
                                  <span className="text-[10px] font-bold" style={{ color: track.color }}>{track.label}</span>
                                  <StatusIcon size={11} className={`ml-auto ${status.cls}`} />
                                </div>
                                <div className="text-gray-800 font-semibold text-xs mb-1">{task.title}</div>
                                <div className="text-gray-400 text-[10px] leading-relaxed mb-2">{task.desc}</div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[9px] text-gray-400">⏱ {task.estimate}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${status.badge}`}>{status.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom summary ── */}
        <div className="grid sm:grid-cols-3 gap-5">
          {/* Total effort */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
              <Code2 size={14} className="text-blue-500" /> Effort by Track
            </h3>
            {(Object.keys(TRACK_CONFIG) as Track[]).map(track => {
              const tc = TRACK_CONFIG[track];
              const trackTasks = TASKS.filter(t => t.track === track);
              const TIcon = tc.icon;
              return (
                <div key={track} className="flex items-center gap-3 mb-3 last:mb-0">
                  <TIcon size={13} style={{ color: tc.color }} />
                  <span className="text-gray-600 text-xs flex-1">{tc.label}</span>
                  <span className="text-xs font-bold text-gray-700">{trackTasks.length} tasks</span>
                </div>
              );
            })}
          </div>

          {/* Rules */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Sprint Rules
            </h3>
            <ul className="space-y-2">
              {[
                'Mark task Done only when tested end-to-end',
                'Blocked task → escalate same day, don\'t wait',
                'Parallel tasks → split your day or pair-program',
                'Week review every Sunday — update statuses',
                'No new features after Week 7 — only QA fixes',
              ].map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
                  <CheckCircle2 size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Launch checklist */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
              <Flag size={14} className="text-red-500" /> Launch Checklist
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'All Phase 1 backend routes live', done: false },
                { label: 'Auth flow E2E tested', done: true },
                { label: 'Paymob webhook verified in staging', done: false },
                { label: 'Mobile build on TestFlight / Play Internal', done: false },
                { label: 'Sentry + monitoring active', done: false },
                { label: 'Lighthouse score ≥ 90', done: false },
                { label: 'SSL + custom domain configured', done: false },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-[11px]">
                  {item.done
                    ? <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
                    : <Circle size={11} className="text-gray-200 flex-shrink-0" />}
                  <span className={item.done ? 'text-emerald-600 font-medium' : 'text-gray-500'}>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </main>
    </div>
  );
}
