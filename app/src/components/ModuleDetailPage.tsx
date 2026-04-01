/**
 * ModuleDetailPage — Full-page view for a single system module
 * Route: /business/modules/:moduleId
 */
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Lock, Users, BookOpen, GraduationCap, CreditCard,
  Bell, Database, Trophy, Brain, Users2, Monitor, LayoutDashboard,
  GitBranch, Package, Layers, Code2, Server, ShieldCheck,
  CheckCircle2, AlertCircle, Clock,
} from 'lucide-react';

/* ──────────────────────────────────────────────
   MODULE DATA
────────────────────────────────────────────── */
interface ModuleData {
  id: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  headerBg: string;
  name: string;
  nameAr: string;
  phase: 'Phase 1' | 'Phase 2';
  description: string;
  responsibility: string[];
  deps: string[];
  exposes: { method: string; path: string; desc: string }[];
  models: { name: string; fields: string[] }[];
  notes: string[];
}

const MODULES: ModuleData[] = [
  {
    id: 'auth-mod',
    icon: Lock, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', headerBg: 'from-amber-50 to-white',
    name: 'Auth Module', nameAr: 'Authentication', phase: 'Phase 1',
    description: 'Handles all authentication and authorization logic: registration, email OTP confirmation, login, JWT issuance, token refresh, and password reset.',
    responsibility: [
      'User registration with email OTP flow',
      'Account confirmation via 6-digit code',
      'Login with Access Token + Refresh Token pair',
      'Stateless JWT validation middleware',
      'Forgot password with time-limited reset token',
      'bcrypt password hashing',
    ],
    deps: ['MongoDB Atlas (User / OTP collections)', 'Config/Env (secrets, TTLs)', 'SendGrid (OTP email delivery)'],
    exposes: [
      { method: 'POST', path: '/auth/register',     desc: 'Create new user account, send OTP' },
      { method: 'POST', path: '/auth/confirm',      desc: 'Verify OTP and activate account' },
      { method: 'POST', path: '/auth/login',        desc: 'Authenticate and receive JWT tokens' },
      { method: 'POST', path: '/auth/logout',       desc: 'Invalidate refresh token' },
      { method: 'POST', path: '/auth/forgot',       desc: 'Send password reset link via email' },
      { method: 'POST', path: '/auth/reset',        desc: 'Set new password using reset token' },
      { method: 'POST', path: '/auth/refresh',      desc: 'Exchange refresh token for new access token' },
    ],
    models: [
      { name: 'User', fields: ['_id', 'email', 'passwordHash', 'role', 'isConfirmed', 'createdAt'] },
      { name: 'OTPToken', fields: ['_id', 'userId', 'code', 'expiresAt', 'type'] },
      { name: 'ResetToken', fields: ['_id', 'userId', 'token', 'expiresAt'] },
    ],
    notes: [
      'Access token expires in 15 minutes; refresh token in 7 days',
      'OTP codes are hashed before storage',
      'Rate limiting: 5 attempts per 15 min on /login',
      'Role-based route guards are middleware injected by this module',
    ],
  },
  {
    id: 'user-mod',
    icon: Users, color: '#2563EB', bg: 'bg-blue-50', border: 'border-blue-200', headerBg: 'from-blue-50 to-white',
    name: 'User Module', nameAr: 'User Management', phase: 'Phase 1',
    description: 'Manages the four user role profiles — Teacher, Student, Parent, and Center Owner — including profile CRUD, avatar uploads, and role-specific data.',
    responsibility: [
      'Profile creation and updates for all 4 roles',
      'Avatar upload via Media Module',
      'Teacher public listing and search',
      'Student enrollment history overview',
      'Center owner sub-account management',
    ],
    deps: ['Auth Module (JWT middleware)', 'MongoDB Atlas', 'Media Module (avatar upload)'],
    exposes: [
      { method: 'GET',  path: '/users/me',          desc: 'Get current authenticated user profile' },
      { method: 'PUT',  path: '/users/profile',     desc: 'Update profile fields and avatar' },
      { method: 'GET',  path: '/teachers',          desc: 'Public list of teachers with filters' },
      { method: 'GET',  path: '/teachers/:id',      desc: 'Single teacher public profile' },
      { method: 'GET',  path: '/students',          desc: 'Admin / center: list students' },
      { method: 'GET',  path: '/centers',           desc: 'Public list of learning centers' },
      { method: 'DELETE', path: '/users/me',        desc: 'Soft-delete own account' },
    ],
    models: [
      { name: 'Teacher',     fields: ['userId', 'subject', 'bio', 'avatar', 'rating', 'certifications'] },
      { name: 'Student',     fields: ['userId', 'grade', 'avatar', 'parentId', 'enrollments[]'] },
      { name: 'Parent',      fields: ['userId', 'children[]', 'avatar'] },
      { name: 'CenterOwner', fields: ['userId', 'centerName', 'logo', 'address', 'teachers[]'] },
    ],
    notes: [
      'User base record lives in Auth Module; role-profile is a separate document linked by userId',
      'Avatar is stored in Cloudinary, URL saved in profile',
      'Teacher ratings are aggregated from student reviews',
    ],
  },
  {
    id: 'course-mod',
    icon: BookOpen, color: '#0EA5E9', bg: 'bg-sky-50', border: 'border-sky-200', headerBg: 'from-sky-50 to-white',
    name: 'Course Module', nameAr: 'Courses & Content', phase: 'Phase 1',
    description: 'Full course lifecycle management: creation, lessons, quizzes, live session links, and student-facing course catalog with search and filtering.',
    responsibility: [
      'Course CRUD with visibility controls (draft / published)',
      'Lesson ordering and content management',
      'Quiz creation with multiple-choice questions',
      'Course catalog with pagination and tag filtering',
      'Link courses to live sessions (Live Session Module)',
    ],
    deps: ['User Module (teacher ownership)', 'MongoDB Atlas', 'Media Module (video / image upload)'],
    exposes: [
      { method: 'GET',    path: '/courses',               desc: 'Paginated public course catalog' },
      { method: 'POST',   path: '/courses',               desc: 'Teacher creates a new course' },
      { method: 'GET',    path: '/courses/:id',           desc: 'Full course detail with lessons' },
      { method: 'PUT',    path: '/courses/:id',           desc: 'Update course metadata' },
      { method: 'DELETE', path: '/courses/:id',           desc: 'Soft-delete course' },
      { method: 'POST',   path: '/courses/:id/lessons',   desc: 'Add a lesson to a course' },
      { method: 'PUT',    path: '/courses/:id/lessons/:lessonId', desc: 'Update lesson content' },
      { method: 'POST',   path: '/courses/:id/quiz',      desc: 'Attach a quiz to a lesson' },
    ],
    models: [
      { name: 'Course', fields: ['_id', 'title', 'teacherId', 'price', 'tags[]', 'status', 'coverImage'] },
      { name: 'Lesson', fields: ['_id', 'courseId', 'title', 'videoUrl', 'order', 'duration'] },
      { name: 'Quiz',   fields: ['_id', 'lessonId', 'questions[]', 'passMark'] },
      { name: 'Question', fields: ['_id', 'quizId', 'text', 'options[]', 'correctIndex'] },
    ],
    notes: [
      'Course status: draft → review → published → archived',
      'Video URLs point to Cloudinary signed URLs with expiry',
      'Search uses MongoDB text indexes on title + tags',
    ],
  },
  {
    id: 'enroll-mod',
    icon: GraduationCap, color: '#22C55E', bg: 'bg-emerald-50', border: 'border-emerald-200', headerBg: 'from-emerald-50 to-white',
    name: 'Enrollment Module', nameAr: 'Enrollment & Progress', phase: 'Phase 1',
    description: 'Manages student enrollment into courses and tracks lesson-level progress, quiz grades, and overall completion percentage.',
    responsibility: [
      'Enroll student after successful payment verification',
      'Track lesson completion per student',
      'Calculate and store quiz grades',
      'Emit progress events to AI and Gamification modules',
      'Parent-facing progress summary queries',
    ],
    deps: ['User Module', 'Course Module', 'Payment Module (verify subscription)', 'MongoDB Atlas'],
    exposes: [
      { method: 'POST', path: '/enrollments',              desc: 'Enroll current student in a course' },
      { method: 'GET',  path: '/enrollments/my',          desc: 'List all courses the student is enrolled in' },
      { method: 'GET',  path: '/enrollments/:id',         desc: 'Detailed enrollment with progress breakdown' },
      { method: 'PUT',  path: '/progress/:lessonId',      desc: 'Mark lesson as complete, update % progress' },
      { method: 'POST', path: '/grades',                  desc: 'Submit quiz attempt and receive grade' },
      { method: 'GET',  path: '/grades/:enrollmentId',    desc: 'All grades for an enrollment' },
    ],
    models: [
      { name: 'Enrollment', fields: ['_id', 'studentId', 'courseId', 'enrolledAt', 'progressPct', 'status'] },
      { name: 'Progress',   fields: ['_id', 'enrollmentId', 'lessonId', 'completedAt'] },
      { name: 'Grade',      fields: ['_id', 'enrollmentId', 'quizId', 'score', 'attemptAt'] },
    ],
    notes: [
      'Progress percentage is computed in real-time: completedLessons / totalLessons × 100',
      'Completion event triggers Gamification Module to award points',
      'Duplicate enrollment guard: unique index on (studentId, courseId)',
    ],
  },
  {
    id: 'payment-mod',
    icon: CreditCard, color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200', headerBg: 'from-purple-50 to-white',
    name: 'Payment Module', nameAr: 'Payments & Billing', phase: 'Phase 1',
    description: 'Handles all subscription billing and one-time payments via Paymob (Egypt). Manages subscription lifecycle, invoice generation, and webhook processing.',
    responsibility: [
      'Initiate Paymob payment intent for subscriptions',
      'Process Paymob webhook events (paid, failed, refund)',
      'Subscription plan management (Teacher, Student, Center)',
      'Invoice generation and storage',
      'Notify user on payment success / failure via Notification Module',
    ],
    deps: ['User Module', 'MongoDB Atlas', 'Paymob API (external)', 'Notification Module'],
    exposes: [
      { method: 'POST', path: '/payments/subscribe',    desc: 'Create payment intent, return Paymob checkout URL' },
      { method: 'POST', path: '/payments/webhook',      desc: 'Receive and process Paymob webhook callback' },
      { method: 'GET',  path: '/payments/history',      desc: 'Paginated payment history for current user' },
      { method: 'GET',  path: '/invoices',              desc: 'List downloadable invoices' },
      { method: 'GET',  path: '/invoices/:id',          desc: 'Single invoice detail (PDF link)' },
      { method: 'GET',  path: '/payments/plans',        desc: 'List available subscription plans and pricing' },
    ],
    models: [
      { name: 'Subscription',       fields: ['_id', 'userId', 'plan', 'status', 'startDate', 'endDate'] },
      { name: 'Invoice',            fields: ['_id', 'userId', 'amount', 'currency', 'pdfUrl', 'paidAt'] },
      { name: 'PaymentTransaction', fields: ['_id', 'userId', 'paymobOrderId', 'amount', 'status', 'createdAt'] },
    ],
    notes: [
      'Webhook endpoint is secured with Paymob HMAC signature verification',
      'Subscription auto-expires and blocks access after end date',
      'Plans: Teacher 99 EGP/mo · Center 499 EGP/mo · Student 49 EGP/mo · Parent 29 EGP/mo',
    ],
  },
  {
    id: 'notif-mod',
    icon: Bell, color: '#EC4899', bg: 'bg-pink-50', border: 'border-pink-200', headerBg: 'from-pink-50 to-white',
    name: 'Notification Module', nameAr: 'Notifications', phase: 'Phase 1',
    description: 'Multi-channel notification delivery: push (Firebase FCM), transactional email (SendGrid), and real-time in-app via Socket.IO. Supports templated messages.',
    responsibility: [
      'Send push notifications via Firebase FCM',
      'Send transactional emails via SendGrid templates',
      'Broadcast real-time events over Socket.IO',
      'Store notification history per user',
      'Mark notifications as read',
    ],
    deps: ['Firebase FCM (external)', 'SendGrid (external)', 'Socket.IO (gateway layer)', 'MongoDB Atlas'],
    exposes: [
      { method: 'POST', path: '/notifications/send',        desc: 'Internal: trigger a notification (used by other modules)' },
      { method: 'GET',  path: '/notifications/my',          desc: 'Paginated notification inbox for current user' },
      { method: 'PUT',  path: '/notifications/read/:id',    desc: 'Mark single notification as read' },
      { method: 'PUT',  path: '/notifications/read-all',    desc: 'Mark all notifications as read' },
      { method: 'GET',  path: '/notifications/unread-count',desc: 'Badge count for UI' },
    ],
    models: [
      { name: 'Notification',         fields: ['_id', 'userId', 'type', 'title', 'body', 'read', 'createdAt'] },
      { name: 'NotificationTemplate', fields: ['_id', 'type', 'subject', 'htmlTemplate', 'pushTitle'] },
    ],
    notes: [
      'Notification types: payment_success, lesson_complete, new_message, live_starting, badge_earned',
      'FCM device tokens are stored in the User document',
      'Socket.IO emits to room user:{userId} for real-time delivery',
    ],
  },
  {
    id: 'media-mod',
    icon: Database, color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-200', headerBg: 'from-orange-50 to-white',
    name: 'Media Module', nameAr: 'Media & Storage', phase: 'Phase 1',
    description: 'Centralized media handling via Cloudinary. All file uploads (images, videos, documents) go through this module to ensure consistent transformation, optimization, and CDN delivery.',
    responsibility: [
      'Upload image and video files to Cloudinary',
      'Apply automatic transformations (resize, compress, format)',
      'Generate signed secure URLs for private content',
      'Delete assets by public_id when content is removed',
      'Store asset metadata (public_id, URL, type) in DB',
    ],
    deps: ['Cloudinary API (external)', 'Config/Env (Cloudinary credentials)'],
    exposes: [
      { method: 'POST',   path: '/media/upload',          desc: 'Upload file, returns CDN URL and public_id' },
      { method: 'DELETE', path: '/media/:publicId',       desc: 'Delete asset from Cloudinary and DB' },
      { method: 'GET',    path: '/media/signed-url',      desc: 'Generate a short-lived signed URL for private video' },
    ],
    models: [
      { name: 'MediaAsset', fields: ['_id', 'publicId', 'url', 'type', 'uploadedBy', 'createdAt'] },
    ],
    notes: [
      'Videos are uploaded with eager transformation: HLS streaming format',
      'Max upload size: 100 MB images, 2 GB videos',
      'Signed URLs expire after 2 hours to protect paid content',
    ],
  },
  {
    id: 'gamif-mod',
    icon: Trophy, color: '#EAB308', bg: 'bg-yellow-50', border: 'border-yellow-200', headerBg: 'from-yellow-50 to-white',
    name: 'Gamification Module', nameAr: 'Points & Badges', phase: 'Phase 2',
    description: 'Drives engagement through points, badges, streaks, and leaderboards. Automatically triggered by Enrollment Module events when students complete lessons or quizzes.',
    responsibility: [
      'Award XP points on lesson / quiz completion',
      'Unlock badges based on achievement thresholds',
      'Maintain daily/weekly streak tracking',
      'Compute and serve leaderboard rankings',
      'Notify student via Notification Module on badge unlock',
    ],
    deps: ['Enrollment Module (completion events)', 'MongoDB Atlas', 'Notification Module'],
    exposes: [
      { method: 'GET', path: '/gamification/points',      desc: 'Current XP points and level for student' },
      { method: 'GET', path: '/gamification/badges',      desc: 'All earned and locked badges for student' },
      { method: 'GET', path: '/gamification/streak',      desc: 'Current learning streak (days)' },
      { method: 'GET', path: '/leaderboard',              desc: 'Top students by XP (global / course-scoped)' },
      { method: 'GET', path: '/leaderboard/my-rank',      desc: 'Current student rank in leaderboard' },
    ],
    models: [
      { name: 'Points',      fields: ['_id', 'studentId', 'total', 'history[]'] },
      { name: 'Badge',       fields: ['_id', 'name', 'icon', 'criteria', 'xpRequired'] },
      { name: 'Achievement', fields: ['_id', 'studentId', 'badgeId', 'earnedAt'] },
    ],
    notes: [
      'Points system: 10 XP per lesson, 25 XP per quiz pass, 50 XP per course completion',
      'Badges include: First Login, 7-Day Streak, Course Graduate, Top 10',
      'Leaderboard is cached (Redis in Phase 2) and refreshed every 5 minutes',
    ],
  },
  {
    id: 'ai-mod',
    icon: Brain, color: '#A855F7', bg: 'bg-purple-50', border: 'border-purple-200', headerBg: 'from-purple-50 to-white',
    name: 'AI/Analytics Module', nameAr: 'AI & Insights', phase: 'Phase 2',
    description: 'Processes learning progress data to generate personalized insights, course recommendations, and performance reports for students, teachers, and parents.',
    responsibility: [
      'Analyze lesson completion patterns per student',
      'Generate personalized course recommendations',
      'Identify at-risk students (low progress, no login)',
      'Produce teacher performance analytics dashboards',
      'Produce center-level revenue and engagement reports',
    ],
    deps: ['Enrollment Module (progress data)', 'MongoDB Atlas (aggregation pipelines)', 'Notification Module'],
    exposes: [
      { method: 'GET', path: '/ai/insights/:studentId',      desc: 'Learning pattern insights for a student' },
      { method: 'GET', path: '/ai/recommendations',          desc: 'Personalized course recommendations' },
      { method: 'GET', path: '/ai/at-risk',                  desc: 'Admin/teacher: list at-risk students' },
      { method: 'GET', path: '/analytics/teacher',           desc: 'Teacher engagement and revenue analytics' },
      { method: 'GET', path: '/analytics/center',            desc: 'Center-wide enrollment and revenue analytics' },
      { method: 'GET', path: '/analytics/platform',          desc: 'Admin: platform-level KPI dashboard' },
    ],
    models: [
      { name: 'Insight',             fields: ['_id', 'studentId', 'type', 'data', 'generatedAt'] },
      { name: 'Recommendation',      fields: ['_id', 'studentId', 'courseId', 'score', 'reason'] },
      { name: 'AnalyticsSnapshot',   fields: ['_id', 'scope', 'scopeId', 'period', 'metrics{}'] },
    ],
    notes: [
      'Phase 2: ML model (Python microservice) replaces MongoDB aggregation rules',
      'At-risk detection: student with <30% progress and no login in 7 days',
      'Recommendations use collaborative filtering on enrollment patterns',
    ],
  },
  {
    id: 'parent-mod',
    icon: Users2, color: '#4ADE80', bg: 'bg-emerald-50', border: 'border-emerald-200', headerBg: 'from-emerald-50 to-white',
    name: 'Parent Module', nameAr: 'Parent Dashboard', phase: 'Phase 2',
    description: 'Gives parents real-time visibility into their children\'s learning activity, progress, grades, AI-generated reports, and automated alerts.',
    responsibility: [
      'Link parent account to one or more student accounts',
      'Display real-time progress per child',
      'Deliver AI-generated weekly learning reports',
      'Send automated alerts (missed lesson, quiz fail, badge earned)',
      'Allow parents to message teachers',
    ],
    deps: ['User Module', 'Enrollment Module (progress)', 'AI Module (reports)', 'Notification Module'],
    exposes: [
      { method: 'GET',  path: '/parent/children',              desc: 'List all linked child accounts' },
      { method: 'POST', path: '/parent/link-child',            desc: 'Link parent to a student via invite code' },
      { method: 'GET',  path: '/parent/reports/:childId',      desc: 'AI-generated weekly progress report' },
      { method: 'GET',  path: '/parent/progress/:childId',     desc: 'Real-time lesson progress breakdown' },
      { method: 'GET',  path: '/parent/alerts',                desc: 'Parent notification feed (alerts only)' },
    ],
    models: [
      { name: 'ParentChild', fields: ['_id', 'parentId', 'studentId', 'linkedAt', 'inviteCode'] },
      { name: 'ParentAlert', fields: ['_id', 'parentId', 'studentId', 'type', 'message', 'read', 'createdAt'] },
    ],
    notes: [
      'Link flow: student generates invite code → parent enters it to establish link',
      'Weekly reports are generated every Sunday 00:00 UTC by a cron job',
      'Parent has read-only access to student progress — cannot modify enrollments',
    ],
  },
  {
    id: 'live-mod',
    icon: Monitor, color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-200', headerBg: 'from-orange-50 to-white',
    name: 'Live Session Module', nameAr: 'Live Classes', phase: 'Phase 2',
    description: 'Enables teachers to host scheduled live classes with real-time video (WebRTC), chat (Socket.IO), attendance tracking, and session recordings.',
    responsibility: [
      'Create and schedule live sessions linked to courses',
      'WebRTC signaling via Socket.IO for video/audio',
      'Real-time text chat during session',
      'Attendance tracking per participant',
      'Session recording upload to Cloudinary',
      'Notify enrolled students before session starts',
    ],
    deps: ['Course Module', 'User Module', 'Socket.IO (gateway)', 'Notification Module'],
    exposes: [
      { method: 'POST', path: '/sessions/start',              desc: 'Teacher starts a live session' },
      { method: 'GET',  path: '/sessions/:id',                desc: 'Session detail and participant list' },
      { method: 'PUT',  path: '/sessions/:id/end',            desc: 'End session and trigger recording upload' },
      { method: 'GET',  path: '/sessions/history',            desc: 'Past sessions for a course' },
      { method: 'WS',   path: 'join / leave / signal / chat', desc: 'Real-time WebRTC and chat Socket.IO events' },
    ],
    models: [
      { name: 'LiveSession',        fields: ['_id', 'courseId', 'teacherId', 'scheduledAt', 'status', 'recordingUrl'] },
      { name: 'SessionParticipant', fields: ['_id', 'sessionId', 'userId', 'joinedAt', 'leftAt'] },
    ],
    notes: [
      'WebRTC uses mesh topology for ≤6 participants; SFU (mediasoup) for larger groups in Phase 2',
      'Recordings are processed async after session ends (Cloudinary upload + transcoding)',
      'Students receive push notification 15 minutes before scheduled start',
    ],
  },
  {
    id: 'admin-mod',
    icon: LayoutDashboard, color: '#7C3AED', bg: 'bg-violet-50', border: 'border-violet-200', headerBg: 'from-violet-50 to-white',
    name: 'Admin Module', nameAr: 'Admin Panel', phase: 'Phase 1',
    description: 'Super-admin control panel for platform oversight: user management, content moderation, financial reporting, system configuration, and audit logs.',
    responsibility: [
      'List, search, filter and manage all user accounts',
      'Suspend or activate any user account',
      'Review and moderate course content',
      'Access platform-wide financial reports',
      'View and export audit logs',
      'Manage platform configuration (plans, feature flags)',
    ],
    deps: ['All Modules (read access)', 'MongoDB Atlas', 'Payment Module (reports)'],
    exposes: [
      { method: 'GET',    path: '/admin/users',                desc: 'Paginated user list with role filters' },
      { method: 'PUT',    path: '/admin/users/:id/status',     desc: 'Activate / suspend a user account' },
      { method: 'GET',    path: '/admin/analytics',           desc: 'Platform KPI dashboard data' },
      { method: 'GET',    path: '/admin/finance',             desc: 'Revenue and subscription reports' },
      { method: 'DELETE', path: '/admin/content/:id',         desc: 'Remove flagged course or lesson' },
      { method: 'GET',    path: '/admin/audit-logs',          desc: 'Paginated audit log with action filters' },
      { method: 'PUT',    path: '/admin/config',              desc: 'Update platform-level config values' },
    ],
    models: [
      { name: 'AdminLog',    fields: ['_id', 'adminId', 'action', 'target', 'meta{}', 'createdAt'] },
      { name: 'SystemConfig', fields: ['_id', 'key', 'value', 'updatedBy', 'updatedAt'] },
    ],
    notes: [
      'All admin actions are written to AdminLog for full audit trail',
      'Admin role is set directly in the User document (role: "admin")',
      'Super admin can promote any user to admin via /admin/users/:id/status',
    ],
  },
];

/* ──────────────────────────────────────────────
   METHOD BADGE
────────────────────────────────────────────── */
const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  POST: 'bg-blue-100 text-blue-700 border-blue-200',
  PUT: 'bg-amber-100 text-amber-700 border-amber-200',
  DELETE: 'bg-red-100 text-red-700 border-red-200',
  WS: 'bg-purple-100 text-purple-700 border-purple-200',
};

function MethodBadge({ method }: { method: string }) {
  const cls = METHOD_COLORS[method] ?? 'bg-gray-100 text-gray-600 border-gray-200';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-bold font-mono ${cls}`}>
      {method}
    </span>
  );
}

/* ──────────────────────────────────────────────
   PAGE COMPONENT
────────────────────────────────────────────── */
export default function ModuleDetailPage() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const mod = MODULES.find(m => m.id === moduleId);

  if (!mod) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-bold text-sm">Module not found</p>
          <button onClick={() => navigate('/business#modules')}
            className="mt-4 text-blue-500 text-sm hover:underline flex items-center gap-1 mx-auto">
            <ArrowLeft size={14} /> Back to Business Page
          </button>
        </div>
      </div>
    );
  }

  const Icon = mod.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Bar ── */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate('/business')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Business Page</span>
          </button>
          <span className="text-gray-200">/</span>
          <span className="text-gray-400 text-sm hidden sm:inline">Modules</span>
          <span className="text-gray-200 hidden sm:inline">/</span>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: mod.color + '20' }}>
              <Icon size={13} style={{ color: mod.color }} />
            </div>
            <span className="text-gray-800 font-bold text-sm">{mod.name}</span>
          </div>
          <span
            className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white"
            style={{ backgroundColor: mod.color }}
          >
            {mod.phase}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">

        {/* ── Hero Card ── */}
        <div className={`rounded-2xl border p-8 bg-gradient-to-br ${mod.headerBg} ${mod.border}`}>
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
              style={{ backgroundColor: mod.color + '18', border: `2px solid ${mod.color}30` }}>
              <Icon size={26} style={{ color: mod.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-gray-900 font-bold text-2xl leading-tight">{mod.name}</h1>
                <span className="text-gray-400 text-sm font-medium">{mod.nameAr}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-2 max-w-2xl">{mod.description}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* ── Left Column: Responsibilities + Notes ── */}
          <div className="lg:col-span-1 space-y-6">

            {/* Responsibilities */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                <ShieldCheck size={14} style={{ color: mod.color }} /> Responsibilities
              </h2>
              <ul className="space-y-2.5">
                {mod.responsibility.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: mod.color }} />
                    <span className="text-gray-600 text-xs leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dependencies */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                <GitBranch size={14} className="text-gray-500" /> Dependencies
              </h2>
              <div className="flex flex-col gap-2">
                {mod.deps.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                    <Package size={11} className="text-gray-400 flex-shrink-0" />
                    <span className="text-gray-700 text-xs">{d}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
              <h2 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
                <Clock size={14} className="text-gray-500" /> Implementation Notes
              </h2>
              <ul className="space-y-2.5">
                {mod.notes.map((n, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gray-400 text-[10px] font-bold mt-0.5 flex-shrink-0">#{i + 1}</span>
                    <span className="text-gray-500 text-[11px] leading-relaxed">{n}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ── Right Column: API Routes + DB Models ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* API Routes */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
                <Server size={14} style={{ color: mod.color }} />
                <h2 className="text-gray-800 font-bold text-sm">API Routes ({mod.exposes.length})</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {mod.exposes.map((ep, i) => (
                  <div key={i} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gray-50/50 transition-colors">
                    <MethodBadge method={ep.method} />
                    <div className="flex-1 min-w-0">
                      <code className="text-gray-800 text-xs font-mono font-bold">{ep.path}</code>
                      <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">{ep.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DB Models */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 bg-gray-50/60">
                <Layers size={14} style={{ color: mod.color }} />
                <h2 className="text-gray-800 font-bold text-sm">DB Models ({mod.models.length})</h2>
              </div>
              <div className="p-5 grid sm:grid-cols-2 gap-4">
                {mod.models.map((m, i) => (
                  <div key={i} className={`rounded-xl border p-4 ${mod.bg} ${mod.border}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 size={12} style={{ color: mod.color }} />
                      <span className="text-gray-800 font-bold text-xs font-mono">{m.name}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {m.fields.map((f, fi) => (
                        <div key={fi} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: mod.color }} />
                          <code className="text-gray-600 text-[10px] font-mono">{f}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── Other Modules ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <h2 className="text-gray-800 font-bold text-sm mb-4 flex items-center gap-2">
            <Layers size={14} className="text-blue-500" /> Other Modules
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {MODULES.filter(m => m.id !== mod.id).map(m => {
              const MIcon = m.icon;
              return (
                <button
                  key={m.id}
                  onClick={() => navigate(`/business/modules/${m.id}`)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:shadow-md hover:scale-105 cursor-pointer ${m.bg} ${m.border}`}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white shadow-sm">
                    <MIcon size={14} style={{ color: m.color }} />
                  </div>
                  <span className="text-gray-700 font-bold text-[10px] text-center leading-tight">{m.name.replace(' Module', '')}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: m.color }}>
                    {m.phase === 'Phase 1' ? 'P1' : 'P2'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
