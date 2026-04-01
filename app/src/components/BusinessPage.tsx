/**
 * BusinessPage — وثيقة نموذج العمل (Light Theme)
 * رؤية الأعمال، كيفية الربح، خطة الإطلاق، تدفقات النظام
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Connection,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  GraduationCap, BookOpen, Users, Building2,
  Zap, BarChart3, Globe, Smartphone, Monitor,
  CheckCircle2, Database, GitBranch,
  Lock, Key, Mail, RefreshCw, Shield,
  Clock, Rocket, Star, TrendingUp,
  Layers, Target,
  Brain, Trophy, Bell, CreditCard,
  DollarSign, Megaphone, Handshake, PieChart,
  ArrowRight, ArrowUpRight, Lightbulb, Users2,
  LayoutDashboard, Percent, Award, CalendarCheck,
  PhoneCall, Package, ShieldCheck,
} from 'lucide-react';

/* ─── Types ─── */
type SectionId = 'vision' | 'roles' | 'systemflow' | 'modules' | 'authflow' | 'platforms' | 'profit' | 'launch' | 'business';

/* ─── Nav Items ─── */
const NAV_ITEMS: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: 'vision',     label: 'الرؤية والمهمة',      icon: Star },
  { id: 'roles',      label: 'أدوار المستخدمين',     icon: Users },
  { id: 'systemflow', label: 'تدفق النظام',          icon: GitBranch },
  { id: 'modules',    label: 'الموديولات',            icon: Layers },
  { id: 'authflow',   label: 'تدفق المصادقة',        icon: Lock },
  { id: 'platforms',  label: 'المنصات والمنتجات',    icon: LayoutDashboard },
  { id: 'profit',     label: 'كيف نربح؟',            icon: DollarSign },
  { id: 'launch',     label: 'خطة الإطلاق',          icon: Rocket },
  { id: 'business',   label: 'نموذج الأعمال',        icon: TrendingUp },
];

/* ─── Pill Badge ─── */
function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    blue:    'bg-blue-100 text-blue-700 border-blue-200',
    sky:     'bg-sky-100 text-sky-700 border-sky-200',
    green:   'bg-emerald-100 text-emerald-700 border-emerald-200',
    amber:   'bg-amber-100 text-amber-700 border-amber-200',
    red:     'bg-red-100 text-red-700 border-red-200',
    purple:  'bg-purple-100 text-purple-700 border-purple-200',
    indigo:  'bg-indigo-100 text-indigo-700 border-indigo-200',
    rose:    'bg-rose-100 text-rose-700 border-rose-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${colors[color] ?? colors.blue}`}>
      {children}
    </span>
  );
}

/* ─── Section Wrapper ─── */
function Section({ id, title, subtitle, icon: Icon, children }: {
  id: SectionId; title: string; subtitle?: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-20 scroll-mt-24">
      <div className="flex items-start gap-4 mb-8">
        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 font-arabic">{title}</h2>
          {subtitle && <p className="text-gray-500 text-sm leading-relaxed font-arabic">{subtitle}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

/* ─── Card ─── */
function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-2xl p-5 shadow-sm ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ─── Flow Step ─── */
function FlowStep({ step, title, desc, icon: Icon, color = '#2563EB', last = false }: {
  step: number; title: string; desc: string; icon: React.ElementType; color?: string; last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md"
          style={{ backgroundColor: color }}>
          {step}
        </div>
        {!last && <div className="w-px flex-1 mt-2" style={{ backgroundColor: color + '30' }} />}
      </div>
      <div className={`${last ? 'pb-0' : 'pb-6'}`}>
        <div className="flex items-center gap-2 mb-1">
          <Icon size={15} style={{ color }} />
          <h4 className="text-gray-800 font-bold text-sm font-arabic">{title}</h4>
        </div>
        <p className="text-gray-500 text-sm leading-relaxed font-arabic">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Permission Row ─── */
function PermRow({ label, access }: { label: string; access: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <span className="text-gray-600 text-sm font-arabic">{label}</span>
      {access
        ? <CheckCircle2 size={15} className="text-emerald-500" />
        : <span className="text-gray-200 text-xs">✕</span>}
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, value, label, sub, color }: {
  icon: React.ElementType; value: string; label: string; sub: string; color: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
      <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
      <div className="text-gray-800 font-bold text-sm font-arabic">{label}</div>
      <div className="text-gray-400 text-xs font-arabic mt-0.5">{sub}</div>
    </div>
  );
}

/* ─── ReactFlow: System Architecture Diagram ─── */
const SYSTEM_NODES: Node[] = [
  /* ══ CLIENT LAYER ══ */
  { id: 'web',       type: 'default', position: { x: 60,   y: 0   }, data: { label: '🌐 Web App\nReact 19 + Vite 6\nTailwind v4 + RTL' },             style: { background: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 10, width: 148, textAlign: 'center', lineHeight: 1.5 } },
  { id: 'mobile',    type: 'default', position: { x: 248,  y: 0   }, data: { label: '📱 Mobile App\nReact Native + Expo\nPush Notifications' },         style: { background: '#F0F9FF', border: '2px solid #0EA5E9', borderRadius: 12, color: '#0369A1', fontWeight: 700, fontSize: 10, width: 148, textAlign: 'center', lineHeight: 1.5 } },
  { id: 'adminapp',  type: 'default', position: { x: 436,  y: 0   }, data: { label: '🖥️ Admin Panel\nReact + Vite\nRole-based Access' },                style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#7E22CE', fontWeight: 700, fontSize: 10, width: 148, textAlign: 'center', lineHeight: 1.5 } },

  /* ══ CDN / EDGE ══ */
  { id: 'cdn_edge',  type: 'default', position: { x: 270,  y: 105 }, data: { label: '🔒 HTTPS / TLS\nCORS · Helmet · Rate Limiter' },                   style: { background: '#F8FAFC', border: '2px dashed #94A3B8', borderRadius: 12, color: '#475569', fontWeight: 700, fontSize: 10, width: 220, textAlign: 'center' } },

  /* ══ API GATEWAY ══ */
  { id: 'gateway',   type: 'default', position: { x: 210,  y: 195 }, data: { label: '⚡ API Gateway\nNode.js 20 LTS + Express 5\nJWT Middleware · Socket.IO' }, style: { background: '#F0FDF4', border: '3px solid #22C55E', borderRadius: 14, color: '#15803D', fontWeight: 800, fontSize: 11, width: 330, textAlign: 'center', padding: '10px', boxShadow: '0 4px 16px rgba(34,197,94,0.15)' } },

  /* ══ SERVICE LAYER ══ */
  { id: 'auth_svc',  type: 'default', position: { x: 0,    y: 320 }, data: { label: '🔐 Auth Service\nJWT · bcrypt · OTP\nAccess + Refresh Tokens' },    style: { background: '#FFFBEB', border: '2px solid #F59E0B', borderRadius: 12, color: '#92400E', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'user_svc',  type: 'default', position: { x: 175,  y: 320 }, data: { label: '👤 User Service\n4 Roles: Teacher / Student\nParent / Center' },    style: { background: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'course_svc',type: 'default', position: { x: 350,  y: 320 }, data: { label: '📚 Course Service\nCRUD · Lessons · Quizzes\nLive Session Links' }, style: { background: '#F0F9FF', border: '2px solid #0EA5E9', borderRadius: 12, color: '#0369A1', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'pay_svc',   type: 'default', position: { x: 525,  y: 320 }, data: { label: '💳 Payment Service\nPaymob · Subscriptions\nInvoices · Webhooks' }, style: { background: '#EDE9FE', border: '2px solid #8B5CF6', borderRadius: 12, color: '#5B21B6', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },

  /* ══ DATA LAYER ══ */
  { id: 'mongodb',   type: 'default', position: { x: 0,    y: 460 }, data: { label: '🍃 MongoDB Atlas\nMongoose 8 ODM\nIndexes · Aggregation' },         style: { background: '#ECFDF5', border: '2px solid #10B981', borderRadius: 12, color: '#065F46', fontWeight: 700, fontSize: 10, width: 150, textAlign: 'center' } },
  { id: 'redis',     type: 'default', position: { x: 175,  y: 460 }, data: { label: '⚡ Redis Cache\nSession Store\nRate Limit · OTP TTL' },              style: { background: '#FFF7ED', border: '2px dashed #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 700, fontSize: 10, width: 150, textAlign: 'center' } },
  { id: 'cloudinary',type: 'default', position: { x: 350,  y: 460 }, data: { label: '☁️ Cloudinary CDN\nImage + Video Storage\nTransform · Optimize' }, style: { background: '#FEF3C7', border: '2px solid #FBBF24', borderRadius: 12, color: '#78350F', fontWeight: 700, fontSize: 10, width: 150, textAlign: 'center' } },
  { id: 'paymob_gw', type: 'default', position: { x: 525,  y: 460 }, data: { label: '🏦 Paymob\nEgypt Payment Gateway\nCards · Wallets · Fawry' },       style: { background: '#FDF4FF', border: '2px solid #D946EF', borderRadius: 12, color: '#86198F', fontWeight: 700, fontSize: 10, width: 150, textAlign: 'center' } },

  /* ══ NOTIFICATION LAYER ══ */
  { id: 'fcm',       type: 'default', position: { x: 75,   y: 580 }, data: { label: '🔔 Firebase FCM\nPush Notifications\niOS · Android · Web' },        style: { background: '#FFF7ED', border: '2px solid #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 700, fontSize: 10, width: 148, textAlign: 'center' } },
  { id: 'sendgrid',  type: 'default', position: { x: 263,  y: 580 }, data: { label: '📧 SendGrid\nTransactional Email\nOTP · Welcome · Alerts' },         style: { background: '#FDF2F8', border: '2px solid #EC4899', borderRadius: 12, color: '#831843', fontWeight: 700, fontSize: 10, width: 148, textAlign: 'center' } },
  { id: 'socket',    type: 'default', position: { x: 451,  y: 580 }, data: { label: '🔁 Socket.IO\nReal-time Events\nLive Chat · Notifications' },        style: { background: '#F0FDF4', border: '2px solid #22C55E', borderRadius: 12, color: '#15803D', fontWeight: 700, fontSize: 10, width: 148, textAlign: 'center' } },

  /* ══ AI LAYER ══ */
  { id: 'ai_engine', type: 'default', position: { x: 680,  y: 450 }, data: { label: '🤖 AI/Analytics Engine\nProgress Insights\nSmart Recommendations' },style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#7E22CE', fontWeight: 700, fontSize: 10, width: 160, textAlign: 'center' } },
];

const SYSTEM_EDGES: Edge[] = [
  /* Client → CDN Edge */
  { id: 'se1',  source: 'web',       target: 'cdn_edge',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'se2',  source: 'mobile',    target: 'cdn_edge',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0EA5E9', strokeWidth: 1.5 } },
  { id: 'se3',  source: 'adminapp',  target: 'cdn_edge',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 1.5 } },

  /* CDN → Gateway */
  { id: 'se4',  source: 'cdn_edge',  target: 'gateway',    animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 2.5 }, label: 'HTTP/WS' },

  /* Gateway → Services */
  { id: 'se5',  source: 'gateway',   target: 'auth_svc',   animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 2 } },
  { id: 'se6',  source: 'gateway',   target: 'user_svc',   animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'se7',  source: 'gateway',   target: 'course_svc', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0EA5E9', strokeWidth: 2 } },
  { id: 'se8',  source: 'gateway',   target: 'pay_svc',    animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#8B5CF6', strokeWidth: 2 } },

  /* Services → Data Layer */
  { id: 'se9',  source: 'auth_svc',  target: 'mongodb',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'se10', source: 'auth_svc',  target: 'redis',      markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 1.5, strokeDasharray: '4 3' } },
  { id: 'se11', source: 'user_svc',  target: 'mongodb',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'se12', source: 'user_svc',  target: 'cloudinary', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#FBBF24', strokeWidth: 1.5 } },
  { id: 'se13', source: 'course_svc',target: 'mongodb',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'se14', source: 'course_svc',target: 'cloudinary', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#FBBF24', strokeWidth: 1.5 } },
  { id: 'se15', source: 'pay_svc',   target: 'mongodb',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'se16', source: 'pay_svc',   target: 'paymob_gw',  animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#D946EF', strokeWidth: 2 }, label: 'webhook' },

  /* Gateway → Notification Layer */
  { id: 'se17', source: 'gateway',   target: 'fcm',        markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 1.5 } },
  { id: 'se18', source: 'gateway',   target: 'sendgrid',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 1.5 } },
  { id: 'se19', source: 'gateway',   target: 'socket',     animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 2 }, label: 'WS' },

  /* MongoDB → AI Engine */
  { id: 'se20', source: 'mongodb',   target: 'ai_engine',  animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 2 }, label: 'analytics' },
  { id: 'se21', source: 'ai_engine', target: 'gateway',    animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 1.5, strokeDasharray: '5 3' }, label: 'insights' },
];

function SystemArchitectureFlow() {
  const [nodes, , onNodesChange] = useNodesState(SYSTEM_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(SYSTEM_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 700 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnDrag={true}
        panOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E5E7EB" gap={24} />
        <Controls showInteractive={false} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable style={{ background: '#F9FAFB' }} />
      </ReactFlow>
    </div>
  );
}

/* ─── ReactFlow: Auth Flow ─── */
const AUTH_NODES: Node[] = [
  { id: 'client',    type: 'default', position: { x: 0,   y: 0   }, data: { label: '👤 Client\n(Web / Mobile)' },               style: { background: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 11, width: 140, textAlign: 'center' } },
  { id: 'register',  type: 'default', position: { x: 200, y: 0   }, data: { label: '📝 POST /auth/register\nSave + OTP Code' },  style: { background: '#F0FDF4', border: '2px solid #22C55E', borderRadius: 12, color: '#15803D', fontWeight: 600, fontSize: 10, width: 160, textAlign: 'center' } },
  { id: 'email_send',type: 'default', position: { x: 420, y: 0   }, data: { label: '📧 SendGrid / Nodemailer\n6-Digit OTP' },    style: { background: '#FDF2F8', border: '2px solid #EC4899', borderRadius: 12, color: '#831843', fontWeight: 600, fontSize: 10, width: 140, textAlign: 'center' } },
  { id: 'confirm',   type: 'default', position: { x: 200, y: 100 }, data: { label: '✅ POST /auth/confirm\nActivate Account' },  style: { background: '#ECFDF5', border: '2px solid #10B981', borderRadius: 12, color: '#065F46', fontWeight: 600, fontSize: 10, width: 160, textAlign: 'center' } },
  { id: 'login',     type: 'default', position: { x: 200, y: 200 }, data: { label: '🔑 POST /auth/login\nEmail + Password' },    style: { background: '#FFFBEB', border: '2px solid #F59E0B', borderRadius: 12, color: '#92400E', fontWeight: 600, fontSize: 10, width: 160, textAlign: 'center' } },
  { id: 'jwt_token', type: 'default', position: { x: 420, y: 200 }, data: { label: '🔐 JWT Token\n7-Day Expiry' },               style: { background: '#FEF3C7', border: '2px solid #FBBF24', borderRadius: 12, color: '#78350F', fontWeight: 600, fontSize: 10, width: 140, textAlign: 'center' } },
  { id: 'dashboard', type: 'default', position: { x: 0,   y: 200 }, data: { label: '🏠 Dashboard\nRole-based View' },            style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#7E22CE', fontWeight: 700, fontSize: 11, width: 130, textAlign: 'center' } },
  { id: 'forgot',    type: 'default', position: { x: 200, y: 300 }, data: { label: '🔄 POST /auth/forgot\nSend Reset Link' },    style: { background: '#FFF7ED', border: '2px solid #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 600, fontSize: 10, width: 160, textAlign: 'center' } },
  { id: 'reset',     type: 'default', position: { x: 420, y: 300 }, data: { label: '🆕 POST /auth/reset\nNew Password' },        style: { background: '#FFF7ED', border: '2px solid #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 600, fontSize: 10, width: 160, textAlign: 'center' } },
];
const AUTH_EDGES: Edge[] = [
  { id: 'a1', source: 'client',    target: 'register',   animated: true,  label: 'register',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'a2', source: 'register',  target: 'email_send', animated: true,  label: 'send email', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 2 } },
  { id: 'a3', source: 'client',    target: 'confirm',    animated: false, label: 'OTP code',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'a4', source: 'client',    target: 'login',      animated: false, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 2 } },
  { id: 'a5', source: 'login',     target: 'jwt_token',  animated: true,  label: 'success',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#FBBF24', strokeWidth: 2 } },
  { id: 'a6', source: 'jwt_token', target: 'dashboard',  animated: true,  label: 'redirect',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 2 } },
  { id: 'a7', source: 'client',    target: 'forgot',     animated: false, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 2 } },
  { id: 'a8', source: 'forgot',    target: 'reset',      animated: false, label: '1h token',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 2 } },
];
function AuthFlowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(AUTH_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(AUTH_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 460 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#E5E7EB" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

/* ─── ReactFlow: Revenue Flow ─── */
const REVENUE_NODES: Node[] = [
  { id: 'platform',   type: 'default', position: { x: 200, y: 0   }, data: { label: '🏢 Nourstep Platform' },                               style: { background: '#EFF6FF', border: '3px solid #2563EB', borderRadius: 14, color: '#1E40AF', fontWeight: 800, fontSize: 13, width: 180, textAlign: 'center', padding: '12px' } },
  { id: 't_sub',      type: 'default', position: { x: 0,   y: 130 }, data: { label: '👩‍🏫 Teacher Subscription\n99 EGP/month' },              style: { background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 11, width: 160, textAlign: 'center' } },
  { id: 'c_sub',      type: 'default', position: { x: 200, y: 130 }, data: { label: '🏫 Center Subscription\n499 EGP/month' },               style: { background: '#EDE9FE', border: '2px solid #8B5CF6', borderRadius: 12, color: '#5B21B6', fontWeight: 700, fontSize: 11, width: 160, textAlign: 'center' } },
  { id: 's_sub',      type: 'default', position: { x: 400, y: 130 }, data: { label: '📚 Student Subscription\n49 EGP/month' },               style: { background: '#E0F2FE', border: '2px solid #0EA5E9', borderRadius: 12, color: '#0369A1', fontWeight: 700, fontSize: 11, width: 160, textAlign: 'center' } },
  { id: 'p_sub',      type: 'default', position: { x: 0,   y: 240 }, data: { label: '👨‍👩‍👧 Parent Subscription\n29 EGP/month' },               style: { background: '#DCFCE7', border: '2px solid #22C55E', borderRadius: 12, color: '#15803D', fontWeight: 700, fontSize: 11, width: 160, textAlign: 'center' } },
  { id: 'commission', type: 'default', position: { x: 200, y: 240 }, data: { label: '💰 Course Commission\n10% per sale' },                  style: { background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 12, color: '#92400E', fontWeight: 700, fontSize: 11, width: 160, textAlign: 'center' } },
  { id: 'ads',        type: 'default', position: { x: 400, y: 240 }, data: { label: '📣 Paid Promotions\nSponsored Teacher Listings' },      style: { background: '#FFE4E6', border: '2px solid #F43F5E', borderRadius: 12, color: '#9F1239', fontWeight: 700, fontSize: 11, width: 160, textAlign: 'center' } },
  { id: 'revenue',    type: 'default', position: { x: 180, y: 350 }, data: { label: '💎 Total Revenue\nRecurring ARR' },                     style: { background: '#2563EB', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 13, width: 200, textAlign: 'center', padding: '12px', boxShadow: '0 4px 20px rgba(37,99,235,0.3)' } },
];
const REVENUE_EDGES: Edge[] = [
  { id: 'r1', source: 'platform',   target: 't_sub',      markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'r2', source: 'platform',   target: 'c_sub',      markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#8B5CF6', strokeWidth: 2 } },
  { id: 'r3', source: 'platform',   target: 's_sub',      markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0EA5E9', strokeWidth: 2 } },
  { id: 'r4', source: 't_sub',      target: 'p_sub',      animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 1.5 } },
  { id: 'r5', source: 'c_sub',      target: 'commission', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 1.5 } },
  { id: 'r6', source: 's_sub',      target: 'ads',        animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F43F5E', strokeWidth: 1.5 } },
  { id: 'r7', source: 'p_sub',      target: 'revenue',    animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
  { id: 'r8', source: 'commission', target: 'revenue',    animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
  { id: 'r9', source: 'ads',        target: 'revenue',    animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
];
function RevenueFlowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(REVENUE_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(REVENUE_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 480 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#F3F4F6" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

/* ─── ReactFlow: Launch Plan ─── */
const LAUNCH_NODES: Node[] = [
  { id: 'l0', type: 'default', position: { x: 250, y: 0   }, data: { label: '🚀 Now — April 2026\nProduct Build' },                   style: { background: '#F0FDF4', border: '2px solid #22C55E', borderRadius: 12, color: '#15803D', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
  { id: 'l1', type: 'default', position: { x: 0,   y: 110 }, data: { label: '🧪 May 2026\nPrivate Beta — 100 Teachers' },            style: { background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
  { id: 'l2', type: 'default', position: { x: 220, y: 110 }, data: { label: '📢 May 2026\nDigital Marketing Campaign' },             style: { background: '#FDF2F8', border: '2px solid #EC4899', borderRadius: 12, color: '#831843', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
  { id: 'l3', type: 'default', position: { x: 440, y: 110 }, data: { label: '🤝 May 2026\nPartnerships with Learning Centers' },     style: { background: '#ECFDF5', border: '2px solid #10B981', borderRadius: 12, color: '#065F46', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
  { id: 'l4', type: 'default', position: { x: 250, y: 220 }, data: { label: '🎉 June 12, 2026\nOfficial Launch — MVP' },             style: { background: '#EFF6FF', border: '3px solid #2563EB', borderRadius: 14, color: '#1E40AF', fontWeight: 800, fontSize: 12, width: 180, textAlign: 'center', boxShadow: '0 4px 20px rgba(37,99,235,0.2)' } },
  { id: 'l5', type: 'default', position: { x: 0,   y: 340 }, data: { label: '📊 Q3 2026\nAI Engine + Parent Dashboard' },            style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#7E22CE', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
  { id: 'l6', type: 'default', position: { x: 220, y: 340 }, data: { label: '🏢 Q4 2026\nLearning Center Dashboard' },               style: { background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 12, color: '#92400E', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
  { id: 'l7', type: 'default', position: { x: 440, y: 340 }, data: { label: '📱 2027\niOS & Android App' },                          style: { background: '#FFF7ED', border: '2px solid #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },
];
const LAUNCH_EDGES: Edge[] = [
  { id: 'll1', source: 'l0', target: 'l1', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'll2', source: 'l0', target: 'l2', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 2 } },
  { id: 'll3', source: 'l0', target: 'l3', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'll4', source: 'l1', target: 'l4', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
  { id: 'll5', source: 'l2', target: 'l4', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
  { id: 'll6', source: 'l3', target: 'l4', animated: true,  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
  { id: 'll7', source: 'l4', target: 'l5', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 2 } },
  { id: 'll8', source: 'l4', target: 'l6', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 2 } },
  { id: 'll9', source: 'l4', target: 'l7', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 2 } },
];
function LaunchPlanDiagram() {
  const [nodes, , onNodesChange] = useNodesState(LAUNCH_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(LAUNCH_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 490 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#F3F4F6" gap={20} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable style={{ background: '#F9FAFB' }} />
      </ReactFlow>
    </div>
  );
}

/* ─── ReactFlow: Monthly Revenue Growth ─── */
const MONTHLY_NODES: Node[] = [
  { id: 'm1',  type: 'default', position: { x: 0,    y: 0   }, data: { label: '🗓️ June 2026\nMVP Launch\n0 EGP' },                        style: { background: '#F9FAFB', border: '2px solid #D1D5DB', borderRadius: 12, color: '#374151', fontWeight: 700, fontSize: 10, width: 130, textAlign: 'center' } },
  { id: 'm2',  type: 'default', position: { x: 160,  y: 0   }, data: { label: '📈 July 2026\n50 Pro Teachers\n4,950 EGP' },                style: { background: '#EFF6FF', border: '2px solid #93C5FD', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 10, width: 130, textAlign: 'center' } },
  { id: 'm3',  type: 'default', position: { x: 320,  y: 0   }, data: { label: '📈 August 2026\n120 Teachers + 5 Centers\n14,380 EGP' },    style: { background: '#EFF6FF', border: '2px solid #60A5FA', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 10, width: 145, textAlign: 'center' } },
  { id: 'm4',  type: 'default', position: { x: 490,  y: 0   }, data: { label: '🚀 September 2026\n250 Teachers + 10 Centers\n29,650 EGP' },style: { background: '#DBEAFE', border: '2px solid #3B82F6', borderRadius: 12, color: '#1E40AF', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'm5',  type: 'default', position: { x: 0,    y: 115 }, data: { label: '💡 October 2026\nQ3 AI Engine\n45,200 EGP' },               style: { background: '#F0FDF4', border: '2px solid #86EFAC', borderRadius: 12, color: '#15803D', fontWeight: 700, fontSize: 10, width: 140, textAlign: 'center' } },
  { id: 'm6',  type: 'default', position: { x: 170,  y: 115 }, data: { label: '📊 November 2026\n500 Teachers + 25 Centers\n62,975 EGP' }, style: { background: '#DCFCE7', border: '2px solid #4ADE80', borderRadius: 12, color: '#166534', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'm7',  type: 'default', position: { x: 355,  y: 115 }, data: { label: '🏆 December 2026\n750 Teachers + 40 Centers\n94,250 EGP' }, style: { background: '#BBF7D0', border: '2px solid #22C55E', borderRadius: 12, color: '#14532D', fontWeight: 800, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'm8',  type: 'default', position: { x: 535,  y: 115 }, data: { label: '⭐ January 2027\n1,000 Teachers + 60 Centers\n129,900 EGP' },style: { background: '#FEF9C3', border: '2px solid #EAB308', borderRadius: 12, color: '#713F12', fontWeight: 800, fontSize: 10, width: 160, textAlign: 'center' } },
  { id: 'mrr', type: 'default', position: { x: 220,  y: 230 }, data: { label: '💰 MRR Target\nJanuary 2027\n+129,900 EGP/month' },         style: { background: '#2563EB', border: 'none', borderRadius: 14, color: '#fff', fontWeight: 800, fontSize: 12, width: 200, textAlign: 'center', padding: '12px', boxShadow: '0 6px 24px rgba(37,99,235,0.35)' } },
];
const MONTHLY_EDGES: Edge[] = [
  { id: 'mg1', source: 'm1', target: 'm2', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#93C5FD', strokeWidth: 2 } },
  { id: 'mg2', source: 'm2', target: 'm3', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#60A5FA', strokeWidth: 2 } },
  { id: 'mg3', source: 'm3', target: 'm4', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 2 } },
  { id: 'mg4', source: 'm4', target: 'm5', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 2 } },
  { id: 'mg5', source: 'm5', target: 'm6', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 2 } },
  { id: 'mg6', source: 'm6', target: 'm7', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#16A34A', strokeWidth: 2.5 } },
  { id: 'mg7', source: 'm7', target: 'm8', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EAB308', strokeWidth: 2.5 } },
  { id: 'mg8', source: 'm7', target: 'mrr', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 3 } },
  { id: 'mg9', source: 'm8', target: 'mrr', animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 3 } },
];
function MonthlyGrowthDiagram() {
  const [nodes, , onNodesChange] = useNodesState(MONTHLY_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MONTHLY_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 400 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#F3F4F6" gap={20} />
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable style={{ background: '#F9FAFB' }} />
      </ReactFlow>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/*           MODULE DEPENDENCY DIAGRAM                   */
/* ══════════════════════════════════════════════════════ */

/* ─── ReactFlow: Module Dependency Graph ─── */
const MOD_NODES: Node[] = [
  /* ── Core / Shared ── */
  { id: 'db',      type: 'default', position: { x: 340, y: 0   }, data: { label: '🗄️ Database Layer\nMongoose + MongoDB Atlas' },        style: { background: '#ECFDF5', border: '3px solid #10B981', borderRadius: 14, color: '#065F46', fontWeight: 800, fontSize: 11, width: 200, textAlign: 'center', padding: '10px' } },
  { id: 'config',  type: 'default', position: { x: 590, y: 0   }, data: { label: '⚙️ Config / Environment\ndotenv + validation' },        style: { background: '#F9FAFB', border: '2px solid #D1D5DB', borderRadius: 12, color: '#374151', fontWeight: 700, fontSize: 11, width: 170, textAlign: 'center' } },

  /* ── Auth Module ── */
  { id: 'auth',    type: 'default', position: { x: 0,   y: 120 }, data: { label: '🔐 Auth Module\nJWT · bcrypt · OTP' },                 style: { background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 12, color: '#92400E', fontWeight: 700, fontSize: 11, width: 175, textAlign: 'center' } },

  /* ── User Management ── */
  { id: 'user',    type: 'default', position: { x: 215, y: 120 }, data: { label: '👤 User Module\nTeacher · Student · Parent · Center' }, style: { background: '#EFF6FF', border: '2px solid #3B82F6', borderRadius: 12, color: '#1D4ED8', fontWeight: 700, fontSize: 11, width: 210, textAlign: 'center' } },

  /* ── Course Module ── */
  { id: 'course',  type: 'default', position: { x: 470, y: 120 }, data: { label: '📚 Course Module\nCreate · Lessons · Quizzes' },        style: { background: '#F0F9FF', border: '2px solid #0EA5E9', borderRadius: 12, color: '#0369A1', fontWeight: 700, fontSize: 11, width: 185, textAlign: 'center' } },

  /* ── Media Module ── */
  { id: 'media',   type: 'default', position: { x: 700, y: 120 }, data: { label: '🖼️ Media Module\nCloudinary Upload / Delete' },         style: { background: '#FFF7ED', border: '2px solid #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 700, fontSize: 11, width: 180, textAlign: 'center' } },

  /* ── Enrollment ── */
  { id: 'enroll',  type: 'default', position: { x: 0,   y: 240 }, data: { label: '🎓 Enrollment Module\nEnroll · Progress · Grades' },    style: { background: '#F0FDF4', border: '2px solid #22C55E', borderRadius: 12, color: '#15803D', fontWeight: 700, fontSize: 11, width: 185, textAlign: 'center' } },

  /* ── Payment Module ── */
  { id: 'payment', type: 'default', position: { x: 225, y: 240 }, data: { label: '💳 Payment Module\nPaymob · Subscriptions · Invoices' },style: { background: '#EDE9FE', border: '2px solid #8B5CF6', borderRadius: 12, color: '#5B21B6', fontWeight: 700, fontSize: 11, width: 205, textAlign: 'center' } },

  /* ── Notification ── */
  { id: 'notif',   type: 'default', position: { x: 475, y: 240 }, data: { label: '🔔 Notification Module\nFCM · SendGrid · Socket.IO' },  style: { background: '#FDF2F8', border: '2px solid #EC4899', borderRadius: 12, color: '#831843', fontWeight: 700, fontSize: 11, width: 205, textAlign: 'center' } },

  /* ── Live Session ── */
  { id: 'live',    type: 'default', position: { x: 725, y: 240 }, data: { label: '🎥 Live Sessions\nSocket.IO · WebRTC' },                style: { background: '#FFF7ED', border: '2px solid #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 700, fontSize: 11, width: 175, textAlign: 'center' } },

  /* ── AI/Analytics ── */
  { id: 'ai',      type: 'default', position: { x: 0,   y: 360 }, data: { label: '🤖 AI / Analytics\nInsights · Recommendations' },       style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#7E22CE', fontWeight: 700, fontSize: 11, width: 185, textAlign: 'center' } },

  /* ── Gamification ── */
  { id: 'gamif',   type: 'default', position: { x: 230, y: 360 }, data: { label: '🏆 Gamification\nPoints · Badges · Leaderboard' },      style: { background: '#FFFBEB', border: '2px solid #EAB308', borderRadius: 12, color: '#713F12', fontWeight: 700, fontSize: 11, width: 200, textAlign: 'center' } },

  /* ── Parent Dashboard ── */
  { id: 'parent',  type: 'default', position: { x: 475, y: 360 }, data: { label: '👨‍👩‍👧 Parent Dashboard\nMonitor · Reports · Alerts' },    style: { background: '#DCFCE7', border: '2px solid #4ADE80', borderRadius: 12, color: '#14532D', fontWeight: 700, fontSize: 11, width: 205, textAlign: 'center' } },

  /* ── Admin Module ── */
  { id: 'admin',   type: 'default', position: { x: 728, y: 360 }, data: { label: '🖥️ Admin Module\nUsers · Centers · Reports' },          style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#6D28D9', fontWeight: 700, fontSize: 11, width: 195, textAlign: 'center' } },

  /* ── API Gateway ── */
  { id: 'api',     type: 'default', position: { x: 295, y: 480 }, data: { label: '🌐 API Gateway / Express Router\nMiddleware · Rate Limiting · CORS · Helmet' }, style: { background: '#EFF6FF', border: '3px solid #2563EB', borderRadius: 14, color: '#1E40AF', fontWeight: 800, fontSize: 11, width: 300, textAlign: 'center', padding: '10px', boxShadow: '0 4px 16px rgba(37,99,235,0.15)' } },
];

const MOD_EDGES: Edge[] = [
  /* DB → all data modules */
  { id: 'md1',  source: 'db',      target: 'auth',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'md2',  source: 'db',      target: 'user',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'md3',  source: 'db',      target: 'course',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'md4',  source: 'db',      target: 'enroll',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },
  { id: 'md5',  source: 'db',      target: 'payment', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 1.5 } },

  /* Config → all */
  { id: 'mc1',  source: 'config',  target: 'auth',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 3' } },
  { id: 'mc2',  source: 'config',  target: 'media',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 3' } },
  { id: 'mc3',  source: 'config',  target: 'notif',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '4 3' } },

  /* Auth → User */
  { id: 'me1',  source: 'auth',    target: 'user',    animated: true, label: 'user identity', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 2 } },

  /* User → Course, Enroll, Parent */
  { id: 'me2',  source: 'user',    target: 'course',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'me3',  source: 'user',    target: 'enroll',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#3B82F6', strokeWidth: 1.5 } },
  { id: 'me4',  source: 'user',    target: 'parent',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 1.5 } },
  { id: 'me5',  source: 'user',    target: 'payment', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#8B5CF6', strokeWidth: 1.5 } },

  /* Course → Enroll, Media, Live */
  { id: 'me6',  source: 'course',  target: 'enroll',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#0EA5E9', strokeWidth: 1.5 } },
  { id: 'me7',  source: 'course',  target: 'media',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 1.5 } },
  { id: 'me8',  source: 'course',  target: 'live',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 1.5 } },

  /* Enroll → AI, Gamif, Notif, Parent */
  { id: 'me9',  source: 'enroll',  target: 'ai',      animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 2 } },
  { id: 'me10', source: 'enroll',  target: 'gamif',   animated: true, markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EAB308', strokeWidth: 2 } },
  { id: 'me11', source: 'enroll',  target: 'parent',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#4ADE80', strokeWidth: 1.5 } },
  { id: 'me12', source: 'enroll',  target: 'notif',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 1.5 } },

  /* Payment → Notif, Admin */
  { id: 'me13', source: 'payment', target: 'notif',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 1.5 } },
  { id: 'me14', source: 'payment', target: 'admin',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#7C3AED', strokeWidth: 1.5 } },

  /* Notif → (sends to all) */
  { id: 'me15', source: 'notif',   target: 'parent',  markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 1, strokeDasharray: '4 3' } },
  { id: 'me16', source: 'notif',   target: 'live',    markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 1, strokeDasharray: '4 3' } },

  /* AI → Notif (smart recommendations) */
  { id: 'me17', source: 'ai',      target: 'notif',   animated: true, label: 'smart alerts', markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 1.5 } },

  /* Gamif → Notif */
  { id: 'me18', source: 'gamif',   target: 'notif',   markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EAB308', strokeWidth: 1, strokeDasharray: '4 3' } },

  /* All modules → API Gateway */
  { id: 'ma1',  source: 'auth',    target: 'api',     markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#6B7280', strokeWidth: 1.5 } },
  { id: 'ma2',  source: 'course',  target: 'api',     markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#6B7280', strokeWidth: 1.5 } },
  { id: 'ma3',  source: 'payment', target: 'api',     markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#6B7280', strokeWidth: 1.5 } },
  { id: 'ma4',  source: 'ai',      target: 'api',     markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#6B7280', strokeWidth: 1.5 } },
  { id: 'ma5',  source: 'admin',   target: 'api',     markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#6B7280', strokeWidth: 1.5 } },
];

function ModuleDependencyDiagram() {
  const [nodes, , onNodesChange] = useNodesState(MOD_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOD_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 620 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnDrag={true}
        panOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E5E7EB" gap={24} />
        <Controls showInteractive={false} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable style={{ background: '#F9FAFB' }} />
      </ReactFlow>
    </div>
  );
}

/* ─── ReactFlow: Data Flow Between Modules ─── */
const DATAFLOW_NODES: Node[] = [
  { id: 'df_client', type: 'default', position: { x: 300, y: 0   }, data: { label: '📱 Client\n(Web / Mobile / Admin)' },                  style: { background: '#EFF6FF', border: '3px solid #2563EB', borderRadius: 14, color: '#1E40AF', fontWeight: 800, fontSize: 12, width: 200, textAlign: 'center', padding: '10px' } },
  { id: 'df_gw',     type: 'default', position: { x: 300, y: 110  }, data: { label: '🌐 API Gateway\nExpress + Middleware' },               style: { background: '#F0F9FF', border: '2px solid #0EA5E9', borderRadius: 12, color: '#0369A1', fontWeight: 700, fontSize: 11, width: 185, textAlign: 'center' } },
  { id: 'df_auth',   type: 'default', position: { x: 0,   y: 230  }, data: { label: '🔐 Auth Check\nJWT Validate' },                       style: { background: '#FEF3C7', border: '2px solid #F59E0B', borderRadius: 12, color: '#92400E', fontWeight: 700, fontSize: 10, width: 145, textAlign: 'center' } },
  { id: 'df_biz',    type: 'default', position: { x: 175, y: 230  }, data: { label: '⚡ Business Logic\nCourses / Enrollment / Payments' }, style: { background: '#F0FDF4', border: '2px solid #22C55E', borderRadius: 12, color: '#15803D', fontWeight: 700, fontSize: 10, width: 175, textAlign: 'center' } },
  { id: 'df_ai',     type: 'default', position: { x: 385, y: 230  }, data: { label: '🤖 AI Engine\nAnalytics + Recommendations' },          style: { background: '#FAF5FF', border: '2px solid #A855F7', borderRadius: 12, color: '#7E22CE', fontWeight: 700, fontSize: 10, width: 165, textAlign: 'center' } },
  { id: 'df_notif',  type: 'default', position: { x: 585, y: 230  }, data: { label: '🔔 Notification Engine\nFCM + Email + Socket' },       style: { background: '#FDF2F8', border: '2px solid #EC4899', borderRadius: 12, color: '#831843', fontWeight: 700, fontSize: 10, width: 165, textAlign: 'center' } },
  { id: 'df_db',     type: 'default', position: { x: 130, y: 360  }, data: { label: '🗄️ MongoDB Atlas\nRead / Write' },                    style: { background: '#ECFDF5', border: '2px solid #10B981', borderRadius: 12, color: '#065F46', fontWeight: 700, fontSize: 11, width: 155, textAlign: 'center' } },
  { id: 'df_cdn',    type: 'default', position: { x: 320, y: 360  }, data: { label: '☁️ Cloudinary CDN\nImages / Videos' },                 style: { background: '#FEF9C3', border: '2px solid #EAB308', borderRadius: 12, color: '#713F12', fontWeight: 700, fontSize: 10, width: 155, textAlign: 'center' } },
  { id: 'df_cache',  type: 'default', position: { x: 510, y: 360  }, data: { label: '⚡ Redis Cache\n(Phase 2 — Optional)' },               style: { background: '#FFF7ED', border: '2px dashed #F97316', borderRadius: 12, color: '#9A3412', fontWeight: 600, fontSize: 10, width: 160, textAlign: 'center' } },
  { id: 'df_resp',   type: 'default', position: { x: 300, y: 470  }, data: { label: '✅ Response\nJSON → Client' },                         style: { background: '#EFF6FF', border: '3px solid #2563EB', borderRadius: 14, color: '#1E40AF', fontWeight: 800, fontSize: 12, width: 185, textAlign: 'center', padding: '10px' } },
];
const DATAFLOW_EDGES: Edge[] = [
  { id: 'df1',  source: 'df_client', target: 'df_gw',    animated: true,  label: 'HTTP Request',      markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
  { id: 'df2',  source: 'df_gw',    target: 'df_auth',   animated: true,  label: 'JWT Validate',      markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F59E0B', strokeWidth: 2 } },
  { id: 'df3',  source: 'df_gw',    target: 'df_biz',    animated: true,  label: 'route',             markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#22C55E', strokeWidth: 2 } },
  { id: 'df4',  source: 'df_biz',   target: 'df_ai',     animated: true,  label: 'data',              markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 1.5 } },
  { id: 'df5',  source: 'df_biz',   target: 'df_notif',  animated: false,                             markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EC4899', strokeWidth: 1.5 } },
  { id: 'df6',  source: 'df_biz',   target: 'df_db',     animated: true,  label: 'CRUD',              markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'df7',  source: 'df_biz',   target: 'df_cdn',    animated: false,                             markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#EAB308', strokeWidth: 1.5 } },
  { id: 'df8',  source: 'df_ai',    target: 'df_db',     animated: false, label: 'read',              markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 1, strokeDasharray: '4 3' } },
  { id: 'df9',  source: 'df_db',    target: 'df_cache',  animated: false, label: 'cache',             markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#F97316', strokeWidth: 1, strokeDasharray: '4 3' } },
  { id: 'df10', source: 'df_db',    target: 'df_resp',   animated: true,                              markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#10B981', strokeWidth: 2 } },
  { id: 'df11', source: 'df_ai',    target: 'df_resp',   animated: true,  label: 'insights',          markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#A855F7', strokeWidth: 2 } },
  { id: 'df12', source: 'df_resp',  target: 'df_client', animated: true,  label: 'response',          markerEnd: { type: MarkerType.ArrowClosed }, style: { stroke: '#2563EB', strokeWidth: 2.5 } },
];
function DataFlowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(DATAFLOW_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(DATAFLOW_EDGES);
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);
  return (
    <div style={{ height: 560 }} className="rounded-2xl overflow-hidden border border-gray-100">
      <ReactFlow
        nodes={nodes} edges={edges}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect}
        fitView
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        panOnDrag={true}
        panOnScroll={false}
        preventScrolling={false}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E5E7EB" gap={24} />
        <Controls showInteractive={false} />
        <MiniMap nodeStrokeWidth={3} zoomable pannable style={{ background: '#F9FAFB' }} />
      </ReactFlow>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/*                   MODULE CARD                          */
/* ══════════════════════════════════════════════════════ */
interface ModuleCardProps {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  name: string;
  nameAr: string;
  deps: string[];
  exposes: string[];
  models: string[];
  phase: string;
  moduleId: string;
}
function ModuleCard({ icon: Icon, color, bg, border, name, nameAr, deps, exposes, models, phase, moduleId }: ModuleCardProps) {
  const navigate = useNavigate();
  return (
    <div className={`rounded-2xl border p-4 ${bg} ${border} flex flex-col`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white shadow-sm border border-gray-100">
            <Icon size={16} style={{ color }} />
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm leading-tight">{name}</div>
            <div className="text-gray-400 text-[10px] font-arabic">{nameAr}</div>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold text-white shadow-sm" style={{ backgroundColor: color }}>{phase}</span>
      </div>
      <div className="space-y-2.5 flex-1">
        <div>
          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">Dependencies</div>
          <div className="flex flex-wrap gap-1">
            {deps.map(d => <span key={d} className="px-1.5 py-0.5 bg-white border border-gray-200 text-gray-600 rounded-md text-[9px]">{d}</span>)}
          </div>
        </div>
        <div>
          <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color }}>Exposes (API Routes)</div>
          <div className="flex flex-col gap-0.5">
            {exposes.slice(0, 3).map(e => (
              <span key={e} className="text-[9px] font-mono px-1.5 py-0.5 rounded-md border" style={{ backgroundColor: color + '10', color: color, borderColor: color + '25' }}>{e}</span>
            ))}
            {exposes.length > 3 && <span className="text-[9px] text-gray-400">+{exposes.length - 3} more routes</span>}
          </div>
        </div>
        <div>
          <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-1">DB Models</div>
          <div className="flex flex-wrap gap-1">
            {models.map(m => <span key={m} className="px-1.5 py-0.5 bg-white border border-gray-200 text-gray-500 rounded-md text-[9px] font-mono">{m}</span>)}
          </div>
        </div>
      </div>
      {/* Open detail page */}
      <button
        onClick={() => navigate(`/business/modules/${moduleId}`)}
        className="mt-4 w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border text-[11px] font-bold transition-all hover:shadow-sm cursor-pointer"
        style={{ borderColor: color + '40', color, backgroundColor: color + '10' }}
      >
        View Full Details <ArrowRight size={11} />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════ */
/*                     MAIN PAGE                         */
/* ══════════════════════════════════════════════════════ */
export default function BusinessPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('vision');

  const scrollTo = (id: SectionId) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 text-gray-900 font-arabic">

      {/* ── Top Header ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-200">
              <Zap size={17} className="text-white" />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-sm">خطوة للنور</div>
              <div className="text-gray-400 text-[10px]">وثيقة نموذج العمل</div>
            </div>
          </div>
          <Badge color="green">نسخة أبريل ٢٠٢٦</Badge>
        </div>
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                activeSection === id
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 py-12">

        {/* ════════ VISION ════════ */}
        <Section id="vision" title="الرؤية والمهمة" icon={Star}
          subtitle="الأساس الاستراتيجي لمنصة خطوة للنور">

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
              <div className="flex items-center gap-2 mb-3">
                <Star size={18} className="text-amber-500" />
                <h3 className="text-gray-900 font-bold font-arabic">الرؤية</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                أن نكون المنصة التعليمية الذكية الرائدة في الوطن العربي — تجمع المعلمين والطلاب وأولياء الأمور ومراكز التعليم في منظومة واحدة متكاملة.
              </p>
            </Card>
            <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-emerald-600" />
                <h3 className="text-gray-900 font-bold font-arabic">المهمة</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                تمكين كل طرف في رحلة التعليم بأدوات ذكية وتتبع فوري ورؤى مبنية على البيانات، تُحوّل طريقة التعلم والتعليم.
              </p>
            </Card>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard icon={GraduationCap} value="١,٠٠٠+" label="معلم مستهدف"    sub="Phase 1"  color="#2563EB" />
            <StatCard icon={BookOpen}      value="١٠,٠٠٠+" label="طالب نشط"     sub="Phase 2"  color="#0EA5E9" />
            <StatCard icon={Building2}     value="١٠٠+"    label="مركز تعليمي"  sub="Phase 3"  color="#8B5CF6" />
            <StatCard icon={TrendingUp}    value="٧٠%+"    label="معدل الاحتفاظ" sub="مستمر"   color="#22C55E" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: GraduationCap, color: '#2563EB', bg: 'bg-blue-50',    role: 'المعلم',       items: ['ملف مهني احترافي', 'إدارة الكورسات', 'تحليلات ذكاء اصطناعي', 'تتبع الإيرادات', 'أدوات محتوى ذكية'] },
              { icon: BookOpen,      color: '#0EA5E9', bg: 'bg-sky-50',     role: 'الطالب',       items: ['الوصول لجميع الكورسات', 'مساعد دراسة ذكي', 'تتبع التقدم بالتلعيب', 'جلسات مباشرة', 'مكافآت وإنجازات'] },
              { icon: Users,         color: '#22C55E', bg: 'bg-emerald-50', role: 'ولي الأمر',    items: ['لوحة تقدم الأبناء', 'تقارير الدرجات', 'إشعارات فورية', 'التواصل مع المعلمين', 'ربط أكثر من طفل'] },
              { icon: Building2,     color: '#8B5CF6', bg: 'bg-purple-50',  role: 'صاحب المركز', items: ['لوحة إدارة كاملة', 'تحليلات الإيرادات', 'إدارة الموظفين', 'الإشراف التشغيلي', 'إعدادات المنصة'] },
            ].map(({ icon: Icon, color, bg, role, items }) => (
              <Card key={role} className={`border-0 ${bg}`}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-gray-800 font-bold text-sm font-arabic">{role}</span>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-gray-600 text-xs">
                      <ArrowRight size={10} style={{ color }} className="flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { icon: Globe,    color: '#2563EB', title: 'منظومة موحدة',  desc: 'منصة واحدة لجميع الأطراف' },
              { icon: Brain,    color: '#8B5CF6', title: 'ذكاء اصطناعي', desc: 'تحليلات ذكية وتعلم شخصي' },
              { icon: BarChart3,color: '#0EA5E9', title: 'تتبع فوري',    desc: 'رصد التقدم لحظة بلحظة' },
              { icon: Trophy,   color: '#F59E0B', title: 'التلعيب',      desc: 'مكافآت ومراحل تحفيزية' },
              { icon: Globe,    color: '#22C55E', title: 'ثنائي اللغة',  desc: 'عربي وإنجليزي بالكامل' },
            ].map(({ icon: Icon, color, title, desc }) => (
              <Card key={title} className="text-center">
                <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <div className="text-gray-800 font-bold text-sm font-arabic mb-1">{title}</div>
                <div className="text-gray-500 text-xs">{desc}</div>
              </Card>
            ))}
          </div>
        </Section>

        {/* ════════ ROLES ════════ */}
        <Section id="roles" title="أدوار المستخدمين" icon={Users}
          subtitle="٤ أدوار أساسية، كل دور بصلاحيات ولوحة تحكم مخصصة">

          <Card className="mb-6">
            <h3 className="text-gray-800 font-bold mb-5 text-sm font-arabic flex items-center gap-2">
              <Users2 size={15} className="text-blue-500" /> هرمية الصلاحيات
            </h3>
            <div className="flex flex-col items-center gap-0">
              {[
                { label: 'صاحب المركز', sub: 'Center Owner',  bg: 'bg-purple-50',  border: 'border-purple-300',  text: 'text-purple-700', w: 'w-52' },
                { label: 'المعلم',       sub: 'Teacher',       bg: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-700',   w: 'w-44' },
                { label: 'ولي الأمر',   sub: 'Parent',        bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700',w: 'w-36' },
                { label: 'الطالب',       sub: 'Student',       bg: 'bg-sky-50',     border: 'border-sky-300',     text: 'text-sky-700',    w: 'w-32' },
              ].map(({ label, sub, bg, border, text, w }, i, arr) => (
                <div key={label} className="flex flex-col items-center">
                  <div className={`${w} py-2.5 px-4 rounded-xl border-2 text-center ${bg} ${border}`}>
                    <div className={`font-bold font-arabic text-sm ${text}`}>{label}</div>
                    <div className="text-gray-400 text-[10px]">{sub}</div>
                  </div>
                  {i < arr.length - 1 && <div className="w-px h-5 bg-gray-200" />}
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-5">
            <Card className="border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><GraduationCap size={20} className="text-blue-600" /></div>
                <div><div className="text-gray-800 font-bold font-arabic">المعلم</div><div className="text-gray-400 text-xs">Teacher</div></div>
                <Badge color="blue">معلم</Badge>
              </div>
              <PermRow label="إنشاء وإدارة الكورسات" access={true} />
              <PermRow label="عرض تحليلات الطلاب" access={true} />
              <PermRow label="رؤى بالذكاء الاصطناعي" access={true} />
              <PermRow label="ملف مهني واحترافي" access={true} />
              <PermRow label="التواصل مع الأهل" access={true} />
              <PermRow label="تتبع الإيرادات" access={true} />
              <PermRow label="إدارة المنصة" access={false} />
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-gray-400 text-xs font-bold mb-2">بيانات التسجيل:</div>
                <div className="flex flex-wrap gap-1.5">
                  {['الاسم','البريد','الهاتف','التخصص','المؤهل','الخبرة','السن','طريقة التدريس','الموقع'].map(f => (
                    <span key={f} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] rounded-md border border-blue-100">{f}</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-sky-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center"><BookOpen size={20} className="text-sky-600" /></div>
                <div><div className="text-gray-800 font-bold font-arabic">الطالب</div><div className="text-gray-400 text-xs">Student</div></div>
                <Badge color="sky">طالب</Badge>
              </div>
              <PermRow label="التسجيل في الكورسات" access={true} />
              <PermRow label="عرض التقدم والدرجات" access={true} />
              <PermRow label="مساعد الدراسة الذكي" access={true} />
              <PermRow label="مكافآت وإنجازات" access={true} />
              <PermRow label="الجلسات المباشرة" access={true} />
              <PermRow label="إدارة المستخدمين" access={false} />
              <PermRow label="إنشاء الكورسات" access={false} />
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="text-gray-400 text-xs font-bold mb-2">بيانات التسجيل:</div>
                <div className="flex flex-wrap gap-1.5">
                  {['الاسم','البريد','الهاتف','المرحلة الدراسية'].map(f => (
                    <span key={f} className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] rounded-md border border-sky-100">{f}</span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-emerald-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center"><Users size={20} className="text-emerald-600" /></div>
                <div><div className="text-gray-800 font-bold font-arabic">ولي الأمر</div><div className="text-gray-400 text-xs">Parent</div></div>
                <Badge color="green">ولي أمر</Badge>
              </div>
              <PermRow label="لوحة متابعة أبنائه" access={true} />
              <PermRow label="استقبال الإشعارات" access={true} />
              <PermRow label="تقارير الدرجات" access={true} />
              <PermRow label="التواصل مع المعلمين" access={true} />
              <PermRow label="ربط أكثر من طفل" access={true} />
              <PermRow label="إنشاء/إدارة الكورسات" access={false} />
            </Card>

            <Card className="border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center"><Building2 size={20} className="text-purple-600" /></div>
                <div><div className="text-gray-800 font-bold font-arabic">صاحب المركز</div><div className="text-gray-400 text-xs">Center Owner</div></div>
                <Badge color="purple">مركز</Badge>
              </div>
              <PermRow label="لوحة إدارة كاملة" access={true} />
              <PermRow label="إدارة المعلمين والموظفين" access={true} />
              <PermRow label="تحليلات الإيرادات" access={true} />
              <PermRow label="إدارة جميع الكورسات" access={true} />
              <PermRow label="إعدادات المنصة الكاملة" access={true} />
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-amber-700 text-xs bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  ⚠️ تسجيل صاحب المركز عبر تدفق إعداد تجاري منفصل
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* ════════ SYSTEM FLOW ════════ */}
        <Section id="systemflow" title="System Flow — Platform Architecture" icon={GitBranch}
          subtitle="Full system layers: Client → API Gateway → Services → Data → Notifications → AI">

          {/* ── Architecture Diagram ── */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3 bg-gray-50/60">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Layers size={15} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm">Full System Architecture</div>
                <div className="text-gray-400 text-[11px]">Drag nodes to move · Use +/− buttons to zoom · Animated edges = live data flow</div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-3 text-[10px] text-gray-500">
                  <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-emerald-500 inline-block" />animated = live</span>
                  <span className="flex items-center gap-1"><span className="w-4 border-t border-dashed border-gray-400 inline-block" />optional</span>
                  <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-violet-500 inline-block" />AI feedback</span>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('sys-arch-diagram');
                    if (el) { if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen(); }
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer bg-white"
                >
                  <Monitor size={11} /> Fullscreen
                </button>
              </div>
            </div>

            {/* Layer Labels */}
            <div className="px-5 pt-4 pb-1 flex flex-wrap gap-2">
              {[
                { label: 'Client Layer',       color: 'bg-blue-100 text-blue-700 border-blue-200' },
                { label: 'Security / CDN',     color: 'bg-slate-100 text-slate-600 border-slate-200' },
                { label: 'API Gateway',        color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                { label: 'Service Layer',      color: 'bg-sky-100 text-sky-700 border-sky-200' },
                { label: 'Data Layer',         color: 'bg-amber-100 text-amber-700 border-amber-200' },
                { label: 'Notifications',      color: 'bg-pink-100 text-pink-700 border-pink-200' },
                { label: 'AI Engine',          color: 'bg-purple-100 text-purple-700 border-purple-200' },
              ].map(({ label, color }) => (
                <span key={label} className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${color}`}>{label}</span>
              ))}
            </div>

            {/* Diagram */}
            <div id="sys-arch-diagram" className="p-4 bg-white">
              <SystemArchitectureFlow />
            </div>

            <div className="px-5 py-2.5 border-t border-gray-50 bg-gray-50/40">
              <span className="text-[10px] text-gray-400">💡 All 3 clients connect through HTTPS/TLS security layer → API Gateway → 4 core services → MongoDB + Redis + Cloudinary + Paymob → Firebase / SendGrid / Socket.IO notifications → AI feedback loop</span>
            </div>
          </div>

          {/* ── Layer Summary Cards ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Monitor, color: '#2563EB', bg: 'bg-blue-50', border: 'border-blue-200',
                title: 'Client Layer', subtitle: '3 clients',
                stack: ['Web — React 19 + Vite 6', 'Mobile — React Native + Expo', 'Admin Panel — React + Vite', 'TypeScript everywhere', 'Tailwind v4 + RTL support'],
              },
              {
                icon: Globe, color: '#22C55E', bg: 'bg-emerald-50', border: 'border-emerald-200',
                title: 'API Gateway', subtitle: 'Node.js 20 LTS',
                stack: ['Express.js 5 (REST)', 'Socket.IO (Real-time)', 'JWT Middleware', 'Rate Limiting', 'Helmet + CORS'],
              },
              {
                icon: Database, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200',
                title: 'Data Layer', subtitle: '4 storage solutions',
                stack: ['MongoDB Atlas (primary DB)', 'Mongoose 8 ODM', 'Redis Cache (Phase 2)', 'Cloudinary CDN (media)', 'Paymob (Egypt payments)'],
              },
              {
                icon: Bell, color: '#EC4899', bg: 'bg-pink-50', border: 'border-pink-200',
                title: 'External Services', subtitle: 'notifications + AI',
                stack: ['Firebase FCM (push)', 'SendGrid (email)', 'Socket.IO (real-time)', 'AI/Analytics Engine', 'WebRTC (live sessions)'],
              },
            ].map(({ icon: Icon, color, bg, border, title, subtitle, stack }) => (
              <div key={title} className={`rounded-2xl border p-4 ${bg} ${border}`}>
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-sm border border-gray-100 flex-shrink-0">
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm leading-tight">{title}</div>
                    <div className="text-gray-400 text-[10px]">{subtitle}</div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {stack.map(s => (
                    <div key={s} className="flex items-center gap-2 text-[11px] text-gray-600 bg-white/70 rounded-lg px-2.5 py-1.5 border border-white shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Request Lifecycle ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8">
            <h3 className="font-bold text-gray-800 text-sm mb-5 flex items-center gap-2">
              <ArrowRight size={14} className="text-blue-500" /> Request Lifecycle — How a single API call flows through the system
            </h3>
            <div className="flex flex-wrap gap-2 items-center">
              {[
                { step: '1', label: 'Client Request',    sub: 'HTTPS', color: '#3B82F6', bg: '#EFF6FF' },
                { step: '2', label: 'TLS + Rate Limit',  sub: 'Security', color: '#64748B', bg: '#F8FAFC' },
                { step: '3', label: 'JWT Verify',        sub: 'Auth MW', color: '#F59E0B', bg: '#FFFBEB' },
                { step: '4', label: 'Route Handler',     sub: 'Express', color: '#22C55E', bg: '#F0FDF4' },
                { step: '5', label: 'Service Logic',     sub: 'Business', color: '#0EA5E9', bg: '#F0F9FF' },
                { step: '6', label: 'DB Query',          sub: 'MongoDB', color: '#10B981', bg: '#ECFDF5' },
                { step: '7', label: 'Cache Check',       sub: 'Redis', color: '#F97316', bg: '#FFF7ED' },
                { step: '8', label: 'AI Processing',     sub: 'Analytics', color: '#A855F7', bg: '#FAF5FF' },
                { step: '9', label: 'JSON Response',     sub: 'Client', color: '#2563EB', bg: '#EFF6FF' },
              ].map(({ step, label, sub, color, bg }, i, arr) => (
                <div key={step} className="flex items-center gap-2">
                  <div className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2 border" style={{ backgroundColor: bg, borderColor: color + '40' }}>
                    <span className="text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center text-white" style={{ backgroundColor: color }}>{step}</span>
                    <span className="text-[10px] font-bold text-gray-700 whitespace-nowrap">{label}</span>
                    <span className="text-[9px] text-gray-400">{sub}</span>
                  </div>
                  {i < arr.length - 1 && <ArrowRight size={12} className="text-gray-300 flex-shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* ── Tech Stack Breakdown ── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Monitor,    color: '#2563EB', title: 'Web Frontend',  stack: ['React 19 + TypeScript', 'Vite 6 + Tailwind v4', 'React Router v7', 'Formik + Yup', 'Framer Motion'] },
              { icon: Smartphone, color: '#0EA5E9', title: 'Mobile',        stack: ['React Native + Expo', 'TypeScript', 'React Navigation', 'Zustand', 'Expo Push Notifications'] },
              { icon: Globe,      color: '#22C55E', title: 'Backend API',   stack: ['Node.js 20 LTS', 'Express.js 5', 'TypeScript', 'JWT + bcryptjs', 'Socket.IO 4'] },
              { icon: Database,   color: '#F59E0B', title: 'Data & Cloud',  stack: ['MongoDB Atlas', 'Mongoose 8', 'Firebase FCM', 'Cloudinary', 'SendGrid + Paymob'] },
            ].map(({ icon: Icon, color, title, stack }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <span className="text-gray-800 font-bold text-sm">{title}</span>
                </div>
                <div className="space-y-1.5">
                  {stack.map(s => (
                    <div key={s} className="flex items-center gap-2 text-[11px] text-gray-500 bg-gray-50 rounded-lg px-2 py-1.5 border border-gray-100">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />{s}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════════ MODULES & DEPENDENCIES ════════ */}
        <Section id="modules" title="Module Design & Dependencies" icon={Layers}
          subtitle="Internal code architecture — how modules communicate and how data flows between layers">

          {/* ── Module Dependency Graph ── */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3 bg-gray-50/60">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <GitBranch size={15} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm">Module Dependency Diagram</div>
                <div className="text-gray-400 text-[11px]">Drag nodes to move · Use +/− buttons to zoom</div>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-5 border-t-2 border-emerald-500 inline-block" />reads from DB</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-5 border-t-2 border-amber-400 inline-block" />Auth flow</span>
                  <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className="w-5 border-t border-dashed border-gray-400 inline-block" />optional</span>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('mod-dep-diagram');
                    if (el) { if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen(); }
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer bg-white"
                >
                  <Monitor size={11} /> Fullscreen
                </button>
              </div>
            </div>
            {/* Diagram */}
            <div id="mod-dep-diagram" className="p-4 bg-white">
              <ModuleDependencyDiagram />
            </div>
            {/* Footer hint */}
            <div className="px-5 py-2.5 border-t border-gray-50 bg-gray-50/40 flex items-center gap-2">
              <span className="text-[10px] text-gray-400">💡 Animated arrows = critical dependency · Dashed lines = optional · Drag to move nodes · +/− to zoom</span>
            </div>
          </div>

          {/* ── Module Cards Grid ── */}
          <div className="mb-2">
            <h3 className="text-gray-700 font-bold text-sm mb-4 flex items-center gap-2">
              <Package size={14} className="text-blue-500" />
              Module Details — Dependencies, API Routes & DB Models
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {[
              {
                id: 'auth-mod', icon: Lock, color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200',
                name: 'Auth Module', nameAr: 'Authentication',
                deps: ['Database Layer', 'Config/Env', 'Email (SendGrid)'],
                exposes: ['POST /auth/register', 'POST /auth/confirm', 'POST /auth/login', 'POST /auth/logout', 'POST /auth/forgot', 'POST /auth/reset'],
                models: ['User (base)', 'OTP Token'],
                phase: 'Phase 1',
              },
              {
                id: 'user-mod', icon: Users, color: '#2563EB', bg: 'bg-blue-50', border: 'border-blue-200',
                name: 'User Module', nameAr: 'User Management',
                deps: ['Auth Module', 'Database Layer', 'Media Module'],
                exposes: ['GET /users/me', 'PUT /users/profile', 'GET /teachers', 'GET /students', 'GET /centers'],
                models: ['Teacher', 'Student', 'Parent', 'CenterOwner'],
                phase: 'Phase 1',
              },
              {
                id: 'course-mod', icon: BookOpen, color: '#0EA5E9', bg: 'bg-sky-50', border: 'border-sky-200',
                name: 'Course Module', nameAr: 'Courses & Content',
                deps: ['User Module', 'Database Layer', 'Media Module'],
                exposes: ['GET /courses', 'POST /courses', 'PUT /courses/:id', 'GET /courses/:id/lessons', 'POST /courses/:id/quiz'],
                models: ['Course', 'Lesson', 'Quiz', 'Question'],
                phase: 'Phase 1',
              },
              {
                id: 'enroll-mod', icon: GraduationCap, color: '#22C55E', bg: 'bg-emerald-50', border: 'border-emerald-200',
                name: 'Enrollment Module', nameAr: 'Enrollment & Progress',
                deps: ['User Module', 'Course Module', 'Payment Module', 'Database Layer'],
                exposes: ['POST /enrollments', 'GET /enrollments/my', 'PUT /progress/:lessonId', 'GET /grades'],
                models: ['Enrollment', 'Progress', 'Grade'],
                phase: 'Phase 1',
              },
              {
                id: 'payment-mod', icon: CreditCard, color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200',
                name: 'Payment Module', nameAr: 'Payments & Billing',
                deps: ['User Module', 'Database Layer', 'Paymob API', 'Notification Module'],
                exposes: ['POST /payments/subscribe', 'GET /payments/history', 'POST /payments/webhook', 'GET /invoices'],
                models: ['Subscription', 'Invoice', 'PaymentTransaction'],
                phase: 'Phase 1',
              },
              {
                id: 'notif-mod', icon: Bell, color: '#EC4899', bg: 'bg-pink-50', border: 'border-pink-200',
                name: 'Notification Module', nameAr: 'Notifications',
                deps: ['Firebase FCM', 'SendGrid', 'Socket.IO', 'Database Layer'],
                exposes: ['POST /notifications/send', 'GET /notifications/my', 'PUT /notifications/read/:id', 'WebSocket events'],
                models: ['Notification', 'NotificationTemplate'],
                phase: 'Phase 1',
              },
              {
                id: 'media-mod', icon: Database, color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-200',
                name: 'Media Module', nameAr: 'Media & Storage',
                deps: ['Cloudinary API', 'Config/Env'],
                exposes: ['POST /media/upload', 'DELETE /media/:publicId', 'GET /media/signed-url'],
                models: ['MediaAsset'],
                phase: 'Phase 1',
              },
              {
                id: 'gamif-mod', icon: Trophy, color: '#EAB308', bg: 'bg-yellow-50', border: 'border-yellow-200',
                name: 'Gamification Module', nameAr: 'Points & Badges',
                deps: ['Enrollment Module', 'Database Layer', 'Notification Module'],
                exposes: ['GET /gamification/points', 'GET /gamification/badges', 'GET /leaderboard'],
                models: ['Points', 'Badge', 'Achievement'],
                phase: 'Phase 2',
              },
              {
                id: 'ai-mod', icon: Brain, color: '#A855F7', bg: 'bg-purple-50', border: 'border-purple-200',
                name: 'AI/Analytics Module', nameAr: 'AI & Insights',
                deps: ['Enrollment Module', 'Database Layer', 'Notification Module'],
                exposes: ['GET /ai/insights/:studentId', 'GET /ai/recommendations', 'GET /analytics/teacher', 'GET /analytics/center'],
                models: ['Insight', 'Recommendation', 'AnalyticsSnapshot'],
                phase: 'Phase 2',
              },
              {
                id: 'parent-mod', icon: Users2, color: '#4ADE80', bg: 'bg-emerald-50', border: 'border-emerald-200',
                name: 'Parent Module', nameAr: 'Parent Dashboard',
                deps: ['User Module', 'Enrollment Module', 'AI Module', 'Notification Module'],
                exposes: ['GET /parent/children', 'POST /parent/link-child', 'GET /parent/reports/:childId', 'GET /parent/alerts'],
                models: ['ParentChild (relation)', 'ParentAlert'],
                phase: 'Phase 2',
              },
              {
                id: 'live-mod', icon: Monitor, color: '#F97316', bg: 'bg-orange-50', border: 'border-orange-200',
                name: 'Live Session Module', nameAr: 'Live Classes',
                deps: ['Course Module', 'User Module', 'Socket.IO', 'Notification Module'],
                exposes: ['POST /sessions/start', 'GET /sessions/:id', 'WebSocket: join/leave/signal', 'GET /sessions/history'],
                models: ['LiveSession', 'SessionParticipant'],
                phase: 'Phase 2',
              },
              {
                id: 'admin-mod', icon: LayoutDashboard, color: '#7C3AED', bg: 'bg-violet-50', border: 'border-violet-200',
                name: 'Admin Module', nameAr: 'Admin Panel',
                deps: ['All Modules', 'Database Layer', 'Payment Module'],
                exposes: ['GET /admin/users', 'PUT /admin/users/:id/status', 'GET /admin/analytics', 'GET /admin/finance', 'DELETE /admin/content/:id'],
                models: ['AdminLog', 'SystemConfig'],
                phase: 'Phase 1',
              },
            ].map(({ id: modId, icon: Icon, color, bg, border, name, nameAr, deps, exposes, models, phase }) => (
              <ModuleCard key={modId} moduleId={modId} icon={Icon} color={color} bg={bg} border={border}
                name={name} nameAr={nameAr} deps={deps} exposes={exposes} models={models} phase={phase} />
            ))}
          </div>

          {/* ── Data Flow Diagram ── */}
          <div className="mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3 bg-gray-50/60">
              <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <ArrowRight size={15} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-800 text-sm">Data Flow — HTTP Request Lifecycle</div>
                <div className="text-gray-400 text-[11px]">From client request to database and back</div>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('dataflow-diagram');
                  if (el) { if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen(); }
                }}
                className="flex items-center gap-1.5 text-[11px] text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-100 transition-colors cursor-pointer bg-white"
              >
                <Monitor size={11} /> Fullscreen
              </button>
            </div>
            {/* Diagram */}
            <div id="dataflow-diagram" className="p-4 bg-white">
              <DataFlowDiagram />
            </div>
            <div className="px-5 py-2.5 border-t border-gray-50 bg-gray-50/40">
              <span className="text-[10px] text-gray-400">💡 Animated arrows = primary path · Dashed lines = optional path (Redis Cache — Phase 2)</span>
            </div>
          </div>

          {/* ── Dependency Legend ── */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-gray-800 font-bold mb-5 text-sm flex items-center gap-2">
              <Layers size={14} className="text-blue-500" /> Critical & Optional Dependencies Between Modules
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { from: 'Auth',       to: 'User',         reason: 'Identifies the user and resolves their role across all modules',     critical: true  },
                { from: 'Enrollment', to: 'AI',           reason: 'Progress data feeds AI recommendation and analytics models',          critical: true  },
                { from: 'Payment',    to: 'Notification', reason: 'Payment confirmation triggers instant email + push notification',     critical: true  },
                { from: 'Course',     to: 'Enrollment',   reason: 'A course must exist before a student can enroll',                    critical: true  },
                { from: 'Media',      to: 'Course',       reason: 'Videos and images are uploaded before being linked to course content',critical: true  },
                { from: 'Enrollment', to: 'Gamification', reason: 'Completing a lesson automatically awards points and badges',          critical: false },
                { from: 'AI',        to: 'Notification', reason: 'Smart insights generate personalized alerts for parents and students', critical: false },
                { from: 'Parent',     to: 'Enrollment',   reason: "Displays children's real-time progress and grade reports",           critical: false },
                { from: 'Admin',      to: 'Payment',      reason: 'Revenue reports and financial oversight of all transactions',         critical: false },
              ].map(({ from, to, reason, critical }) => (
                <div key={`${from}-${to}`} className="flex flex-col gap-2 p-3.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-0.5 shadow-sm">{from}</span>
                    <ArrowRight size={10} className={critical ? 'text-red-400' : 'text-amber-400'} />
                    <span className="text-[10px] font-bold text-gray-700 bg-white border border-gray-200 rounded-md px-2 py-0.5 shadow-sm">{to}</span>
                    <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${critical ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                      {critical ? 'Critical' : 'Optional'}
                    </span>
                  </div>
                  <p className="text-gray-500 text-[10px] leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ════════ AUTH FLOW ════════ */}
        <Section id="authflow" title="تدفق المصادقة" icon={Lock}
          subtitle="تسجيل، تأكيد بريد، دخول JWT، واستعادة كلمة المرور">
          <Card className="mb-5 p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <Shield size={15} className="text-blue-500" />
              <span className="font-bold text-gray-800 text-sm font-arabic">مسار المصادقة الكامل</span>
              <Badge color="green">JWT + bcrypt + Email OTP</Badge>
            </div>
            <div className="p-3"><AuthFlowDiagram /></div>
          </Card>
          <div className="grid lg:grid-cols-2 gap-5">
            <Card>
              <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
                <Key size={14} className="text-blue-500" /> تدفق التسجيل
              </h3>
              <FlowStep step={1} icon={Users}        color="#2563EB" title="اختيار نوع الحساب"     desc="معلم / طالب / ولي أمر — نموذج مخصص لكل دور" />
              <FlowStep step={2} icon={Mail}         color="#0EA5E9" title="ملء نموذج التسجيل"    desc="تحقق فوري من المدخلات بـ Formik + Yup" />
              <FlowStep step={3} icon={Shield}       color="#8B5CF6" title="إرسال كود التأكيد"    desc="حساب بحالة pending — كود ٦ أرقام صالح ١٥ دقيقة" />
              <FlowStep step={4} icon={CheckCircle2} color="#22C55E" title="تفعيل الحساب"          desc="status → active — توجيه للوحة التحكم" last />
            </Card>
            <div className="flex flex-col gap-5">
              <Card>
                <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
                  <Lock size={14} className="text-emerald-500" /> تسجيل الدخول + JWT
                </h3>
                <FlowStep step={1} icon={Mail}         color="#22C55E" title="بريد + كلمة مرور"       desc="التحقق بـ bcryptjs salt rounds 12" />
                <FlowStep step={2} icon={CheckCircle2} color="#22C55E" title="JWT Token (٧ أيام)"      desc="توجيه للوحة المناسبة حسب الدور" last />
              </Card>
              <Card>
                <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
                  <RefreshCw size={14} className="text-amber-500" /> استعادة كلمة المرور
                </h3>
                <FlowStep step={1} icon={Mail} color="#F59E0B" title="طلب إعادة التعيين" desc="رابط صالح ساعة يُرسل للبريد" />
                <FlowStep step={2} icon={Key}  color="#F59E0B" title="تعيين كلمة جديدة"  desc="الرمز لمرة واحدة — تسجيل خروج من كل الجلسات" last />
              </Card>
            </div>
          </div>
          <Card className="mt-5">
            <h3 className="text-gray-800 font-bold mb-3 text-sm font-arabic flex items-center gap-2">
              <ShieldCheck size={14} className="text-red-500" /> الأمان والحماية
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { label: 'Rate Limiting',       msg: '٥ محاولات / ١٥ دقيقة', color: 'amber' },
                { label: 'bcryptjs Hash',       msg: 'salt rounds 12 — لا تُخزن كلمة المرور', color: 'blue' },
                { label: 'JWT (7 أيام)',        msg: 'تجديد تلقائي عند النشاط', color: 'green' },
                { label: 'CORS محدود',          msg: 'مسموح لنطاقات المنصة فقط', color: 'purple' },
                { label: 'Helmet.js',           msg: 'حماية HTTP headers كاملة', color: 'sky' },
                { label: 'OTP ١٥ دقيقة',        msg: 'كود التأكيد ينتهي تلقائياً', color: 'amber' },
              ].map(({ label, msg, color }) => (
                <div key={label} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <Badge color={color as any}>{label}</Badge>
                  <div className="text-gray-500 text-xs mt-1.5 font-arabic">{msg}</div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* ════════ PLATFORMS ════════ */}
        <Section id="platforms" title="المنصات والمنتجات" icon={Layers}
          subtitle="تطبيق الويب، التطبيق الجوال، لوحة تحكم المركز">
          <div className="grid md:grid-cols-3 gap-5 mb-5">
            {[
              { icon: Monitor,       color: '#2563EB', bg: 'bg-blue-600',   title: 'تطبيق الويب',   sub: 'Web Application', phase: 'Phase 1 — يونيو ٢٠٢٦', phaseColor: 'blue',   features: ['صفحة هبوط احترافية','نظام مصادقة كامل','لوحة تحكم المعلم','لوحة تحكم الطالب','لوحة ولي الأمر','إدارة الكورسات'] },
              { icon: Smartphone,    color: '#0EA5E9', bg: 'bg-sky-500',    title: 'التطبيق الجوال', sub: 'iOS & Android',   phase: 'Phase 4 — ٢٠٢٧',       phaseColor: 'sky',    features: ['iOS و Android','إشعارات فورية','متابعة التقدم','محتوى أوفلاين','مساعد ذكي متنقل','واجهة عربية أولاً'] },
              { icon: LayoutDashboard,color:'#8B5CF6', bg: 'bg-purple-600', title: 'لوحة المراكز',  sub: 'Admin Dashboard', phase: 'Phase 3 — Q4 ٢٠٢٦',    phaseColor: 'purple', features: ['إدارة المعلمين والطلاب','تحليلات الإيرادات','تقارير الأداء','إدارة الجداول','نظام المدفوعات','إعدادات المركز'] },
            ].map(({ icon: Icon, color, bg, title, sub, phase, phaseColor, features }) => (
              <Card key={title} className="overflow-hidden p-0">
                <div className={`${bg} p-4`}>
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2"><Icon size={20} className="text-white" /></div>
                  <div className="text-white font-bold text-base font-arabic">{title}</div>
                  <div className="text-white/70 text-xs">{sub}</div>
                </div>
                <div className="p-4">
                  <ul className="space-y-1.5 mb-3">
                    {features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-gray-600 text-xs">
                        <CheckCircle2 size={11} style={{ color }} className="flex-shrink-0" />
                        <span className="font-arabic">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Badge color={phaseColor as any}>{phase}</Badge>
                </div>
              </Card>
            ))}
          </div>
          <Card className="overflow-x-auto">
            <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
              <Layers size={14} className="text-blue-500" /> مصفوفة الميزات
            </h3>
            <table className="w-full text-xs min-w-[420px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-right pb-2 font-semibold">الميزة</th>
                  <th className="text-center pb-2 font-semibold text-blue-600">ويب</th>
                  <th className="text-center pb-2 font-semibold text-sky-600">جوال</th>
                  <th className="text-center pb-2 font-semibold text-purple-600">مركز</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: 'تسجيل وإدارة الحساب',    web: true, mob: true,  dash: true  },
                  { feat: 'إدارة الكورسات',          web: true, mob: false, dash: true  },
                  { feat: 'الجلسات المباشرة',        web: true, mob: true,  dash: false },
                  { feat: 'مساعد الذكاء الاصطناعي', web: true, mob: true,  dash: false },
                  { feat: 'تقارير التقدم',            web: true, mob: true,  dash: true  },
                  { feat: 'الإشعارات الفورية',        web: false,mob: true,  dash: true  },
                  { feat: 'تحليلات الإيرادات',       web: false,mob: false, dash: true  },
                  { feat: 'التلعيب والمكافآت',        web: true, mob: true,  dash: false },
                ].map(({ feat, web, mob, dash }) => (
                  <tr key={feat} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 text-gray-600 font-arabic">{feat}</td>
                    <td className="py-2 text-center">{web  ? '✅' : <span className="text-gray-200">—</span>}</td>
                    <td className="py-2 text-center">{mob  ? '✅' : <span className="text-gray-200">—</span>}</td>
                    <td className="py-2 text-center">{dash ? '✅' : <span className="text-gray-200">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Section>

        {/* ════════ PROFIT ════════ */}
        <Section id="profit" title="كيف نربح؟ — نموذج الإيرادات" icon={DollarSign}
          subtitle="مصادر الدخل المتعددة وكيف تتدفق الأموال داخل المنصة">

          <Card className="mb-6 p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <PieChart size={15} className="text-blue-500" />
              <span className="font-bold text-gray-800 text-sm font-arabic">تدفق الإيرادات — من أين تأتي الأموال؟</span>
              <Badge color="amber">مخطط تفاعلي</Badge>
            </div>
            <div className="p-3"><RevenueFlowDiagram /></div>
          </Card>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            {[
              { icon: GraduationCap, color: '#2563EB', bg: 'bg-blue-600',   pct: 40, title: 'اشتراكات المعلمين',
                plans: [
                  { name: 'مجاني Forever', price: '٠ جنيه',       features: ['ملف مهني أساسي', 'حتى ٣ كورسات', 'تحليلات أساسية'], highlight: false },
                  { name: 'برو شهري',      price: '٩٩ جنيه/شهر', features: ['كورسات غير محدودة', 'تحليلات ذكاء اصطناعي', 'أدوات محتوى ذكية', 'دعم أولوية'], highlight: true },
                ] },
              { icon: Building2, color: '#8B5CF6', bg: 'bg-purple-600', pct: 35, title: 'اشتراكات المراكز',
                plans: [
                  { name: 'شهري',  price: '٤٩٩ جنيه/شهر',  features: ['حتى ١٠ معلمين', 'تقارير أساسية', 'دعم فني'], highlight: false },
                  { name: 'سنوي',  price: '٤٤٩٩ جنيه/سنة', features: ['معلمون غير محدودون', 'تقارير متقدمة', 'مدير حساب مخصص'], highlight: true },
                ] },
              { icon: BookOpen, color: '#0EA5E9', bg: 'bg-sky-500',    pct: 15, title: 'اشتراكات الطلاب',
                plans: [
                  { name: 'مجاني',  price: '٠ جنيه',        features: ['كورسات مجانية فقط', 'ذكاء اصطناعي محدود'], highlight: false },
                  { name: 'بريميم', price: '٤٩ جنيه/شهر',  features: ['جميع الكورسات', 'ذكاء اصطناعي كامل', 'تلعيب متقدم'], highlight: true },
                ] },
              { icon: Users, color: '#22C55E', bg: 'bg-emerald-600', pct: 10, title: 'اشتراكات الأهل',
                plans: [
                  { name: 'مجاني', price: '٠ جنيه',        features: ['متابعة طفل واحد', 'تقارير أسبوعية'], highlight: false },
                  { name: 'عائلي', price: '٢٩ جنيه/شهر',  features: ['متابعة متعدد', 'تقارير يومية', 'إشعارات فورية'], highlight: true },
                ] },
            ].map(({ icon: Icon, color, bg, pct, title, plans }) => (
              <Card key={title} className="overflow-hidden p-0">
                <div className={`${bg} p-4 flex items-center justify-between`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center"><Icon size={18} className="text-white" /></div>
                    <div className="text-white font-bold font-arabic">{title}</div>
                  </div>
                  <div className="bg-white/20 rounded-xl px-3 py-1 text-center">
                    <span className="text-white font-black text-lg">{pct}%</span>
                    <div className="text-white/70 text-[10px]">من الإيرادات</div>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  {plans.map(({ name, price, features, highlight }) => (
                    <div key={name} className={`p-3 rounded-xl border ${highlight ? 'border-gray-200 bg-gray-50' : 'border-gray-100'}`}>
                      <div className="text-gray-800 font-bold text-sm font-arabic mb-0.5">{name}</div>
                      <div className="font-bold text-sm mb-2" style={{ color }}>{price}</div>
                      <ul className="space-y-1">
                        {features.map(f => (
                          <li key={f} className="text-gray-500 text-[10px] flex items-center gap-1 font-arabic">
                            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <Card className="border-amber-100 bg-amber-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center"><Percent size={18} className="text-amber-600" /></div>
                <div>
                  <div className="text-gray-800 font-bold font-arabic">عمولة الكورسات المدفوعة</div>
                  <Badge color="amber">مصدر إضافي</Badge>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-arabic mb-3">
                عندما يبيع معلم كورساً مدفوعاً، تأخذ المنصة <strong>١٠٪ عمولة</strong> — يحتفظ المعلم بـ ٩٠٪.
              </p>
              <div className="bg-white rounded-xl p-3 border border-amber-100 flex justify-around">
                <div className="text-center">
                  <div className="font-bold text-emerald-600 text-lg">١٨٠ ج</div>
                  <div className="text-[10px] text-gray-400">للمعلم (٩٠٪)</div>
                </div>
                <div className="text-gray-200 text-2xl self-center">|</div>
                <div className="text-center">
                  <div className="font-bold text-amber-600 text-lg">٢٠ ج</div>
                  <div className="text-[10px] text-gray-400">للمنصة (١٠٪)</div>
                </div>
              </div>
            </Card>
            <Card className="border-rose-100 bg-rose-50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center"><Megaphone size={18} className="text-rose-600" /></div>
                <div>
                  <div className="text-gray-800 font-bold font-arabic">الإعلانات والترويج المدفوع</div>
                  <Badge color="rose">مصدر إضافي</Badge>
                </div>
              </div>
              <p className="text-gray-600 text-sm font-arabic mb-3">معلمون يدفعون لتعزيز ظهورهم في نتائج البحث وتوصيات الطلاب.</p>
              <div className="space-y-2">
                {[
                  { pkg: 'أساسي', price: '٤٩ ج/شهر',  benefit: 'ظهور في المقدمة أسبوع' },
                  { pkg: 'برو',   price: '١٩٩ ج/شهر', benefit: 'ظهور دائم + شارة موصى به' },
                ].map(({ pkg, price, benefit }) => (
                  <div key={pkg} className="bg-white rounded-xl p-2.5 border border-rose-100 flex justify-between items-center">
                    <div>
                      <div className="text-gray-800 font-bold text-sm font-arabic">{pkg}</div>
                      <div className="text-gray-400 text-[10px] font-arabic">{benefit}</div>
                    </div>
                    <div className="text-rose-600 font-bold">{price}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
              <BarChart3 size={14} className="text-blue-500" /> توزيع الإيرادات المتوقعة
            </h3>
            <div className="space-y-3 mb-5">
              {[
                { src: 'اشتراكات المعلمين البرو',     pct: 40, color: '#2563EB' },
                { src: 'اشتراكات المراكز التعليمية',  pct: 35, color: '#8B5CF6' },
                { src: 'اشتراكات الطلاب البريميم',    pct: 15, color: '#0EA5E9' },
                { src: 'عمولة الكورسات المدفوعة',     pct: 7,  color: '#F59E0B' },
                { src: 'الإعلانات والترويج المدفوع',  pct: 3,  color: '#F43F5E' },
              ].map(({ src, pct, color }) => (
                <div key={src}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600 font-arabic">{src}</span>
                    <span className="font-bold text-gray-800">{pct}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center pt-4 border-t border-gray-100">
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="text-blue-700 font-black text-xl">٩٩ ج</div>
                <div className="text-gray-500 text-xs font-arabic">معلم برو/شهر</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl">
                <div className="text-purple-700 font-black text-xl">٤٩٩ ج</div>
                <div className="text-gray-500 text-xs font-arabic">مركز/شهر</div>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <div className="text-emerald-700 font-black text-xl">ARR</div>
                <div className="text-gray-500 text-xs font-arabic">إيرادات سنوية متكررة</div>
              </div>
            </div>
          </Card>

          {/* ── Monthly Revenue Projection ── */}
          <Card className="mt-6 p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <TrendingUp size={15} className="text-emerald-500" />
              <span className="font-bold text-gray-800 text-sm font-arabic">تدفق نمو الإيرادات الشهرية — بالجنيه المصري</span>
              <Badge color="green">مخطط تفاعلي</Badge>
            </div>
            <div className="p-3"><MonthlyGrowthDiagram /></div>
          </Card>

          {/* ── Monthly Detailed Table ── */}
          <Card className="mt-6 overflow-x-auto">
            <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
              <BarChart3 size={14} className="text-blue-500" /> جدول الإيرادات الشهرية التفصيلي (جنيه مصري)
            </h3>
            <table className="w-full text-xs min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500">
                  <th className="text-right py-2.5 px-3 font-bold">الشهر</th>
                  <th className="text-center py-2.5 px-2 font-bold text-blue-600">معلمين برو</th>
                  <th className="text-center py-2.5 px-2 font-bold text-purple-600">مراكز</th>
                  <th className="text-center py-2.5 px-2 font-bold text-sky-600">طلاب بريميم</th>
                  <th className="text-center py-2.5 px-2 font-bold text-emerald-600">أهل عائلي</th>
                  <th className="text-center py-2.5 px-2 font-bold text-amber-600">عمولات</th>
                  <th className="text-center py-2.5 px-2 font-bold text-rose-600">إعلانات</th>
                  <th className="text-center py-2.5 px-3 font-bold text-red-600">التكاليف</th>
                  <th className="text-center py-2.5 px-3 font-bold text-gray-700">إجمالي الإيراد</th>
                  <th className="text-center py-2.5 px-3 font-bold text-green-700">صافي الربح</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { month: 'يونيو ٢٠٢٦ (إطلاق)',   t:  0,  c:  0,  s:   0,  p:   0, com:    0, ads:   0, cost:  8000, revenue:      0, profit:  -8000 },
                  { month: 'يوليو ٢٠٢٦',            t: 50,  c:  0,  s:  30,  p:  20, com:  500, ads:  200, cost:  9000, revenue:   5150+500+200+580+200, profit: null },
                  { month: 'أغسطس ٢٠٢٦',            t:120,  c:  5,  s:  80,  p:  50, com: 1200, ads:  600, cost: 10000, revenue: 11880+2495+3920+1450+1200+600, profit: null },
                  { month: 'سبتمبر ٢٠٢٦',           t:250,  c: 10,  s: 180,  p: 120, com: 2500, ads: 1200, cost: 12000, revenue: 24750+4990+8820+3480+2500+1200, profit: null },
                  { month: 'أكتوبر ٢٠٢٦ (AI+أهل)',  t:380,  c: 18,  s: 320,  p: 250, com: 3800, ads: 2000, cost: 14000, revenue: 37620+8982+15680+7250+3800+2000, profit: null },
                  { month: 'نوفمبر ٢٠٢٦',           t:500,  c: 25,  s: 500,  p: 400, com: 5000, ads: 3200, cost: 16000, revenue: 49500+12475+24500+11600+5000+3200, profit: null },
                  { month: 'ديسمبر ٢٠٢٦',           t:750,  c: 40,  s: 800,  p: 650, com: 7500, ads: 5000, cost: 19000, revenue: 74250+19960+39200+18850+7500+5000, profit: null },
                  { month: 'يناير ٢٠٢٧',            t:1000, c: 60,  s:1200,  p:900,  com:10000, ads: 7500, cost: 23000, revenue: 99000+29940+58800+26100+10000+7500, profit: null },
                ].map((row, i) => {
                  const tRev   = row.t   * 99;
                  const cRev   = row.c   * 499;
                  const sRev   = row.s   * 49;
                  const pRev   = row.p   * 29;
                  const total  = tRev + cRev + sRev + pRev + row.com + row.ads;
                  const net    = row.profit !== null ? row.profit : total - row.cost;
                  const isPos  = net >= 0;
                  return (
                    <tr key={row.month} className={`border-b border-gray-50 hover:bg-gray-50 ${i % 2 === 0 ? '' : 'bg-gray-50/40'}`}>
                      <td className="py-2.5 px-3 font-bold text-gray-700 font-arabic whitespace-nowrap">{row.month}</td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="text-blue-700 font-bold">{row.t > 0 ? tRev.toLocaleString('ar-EG') : '—'}</div>
                        {row.t > 0 && <div className="text-[9px] text-gray-400">{row.t} معلم</div>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="text-purple-700 font-bold">{row.c > 0 ? cRev.toLocaleString('ar-EG') : '—'}</div>
                        {row.c > 0 && <div className="text-[9px] text-gray-400">{row.c} مركز</div>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="text-sky-700 font-bold">{row.s > 0 ? sRev.toLocaleString('ar-EG') : '—'}</div>
                        {row.s > 0 && <div className="text-[9px] text-gray-400">{row.s} طالب</div>}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="text-emerald-700 font-bold">{row.p > 0 ? pRev.toLocaleString('ar-EG') : '—'}</div>
                        {row.p > 0 && <div className="text-[9px] text-gray-400">{row.p} أسرة</div>}
                      </td>
                      <td className="py-2.5 px-2 text-center text-amber-700 font-bold">{row.com > 0 ? row.com.toLocaleString('ar-EG') : '—'}</td>
                      <td className="py-2.5 px-2 text-center text-rose-700 font-bold">{row.ads > 0 ? row.ads.toLocaleString('ar-EG') : '—'}</td>
                      <td className="py-2.5 px-3 text-center text-red-600 font-bold">{row.cost.toLocaleString('ar-EG')}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="font-black text-gray-800">{total.toLocaleString('ar-EG')}</span>
                        <div className="text-[9px] text-gray-400">ج.م</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`font-black text-base ${isPos ? 'text-emerald-600' : 'text-red-500'}`}>
                          {isPos ? '+' : ''}{net.toLocaleString('ar-EG')}
                        </span>
                        <div className="text-[9px] text-gray-400">ج.م</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-blue-600 text-white">
                  <td className="py-3 px-3 font-black font-arabic">الهدف السنوي</td>
                  <td className="text-center py-3 px-2 text-blue-200 text-[10px]">٩٩ ج/شهر</td>
                  <td className="text-center py-3 px-2 text-blue-200 text-[10px]">٤٩٩ ج/شهر</td>
                  <td className="text-center py-3 px-2 text-blue-200 text-[10px]">٤٩ ج/شهر</td>
                  <td className="text-center py-3 px-2 text-blue-200 text-[10px]">٢٩ ج/شهر</td>
                  <td className="text-center py-3 px-2 text-blue-200 text-[10px]">١٠٪</td>
                  <td className="text-center py-3 px-2 text-blue-200 text-[10px]">٤٩–١٩٩ ج</td>
                  <td className="text-center py-3 px-3 font-bold">~١١١,٠٠٠ ج</td>
                  <td className="text-center py-3 px-3 font-black text-yellow-300 text-base">~٢٣١,٢٤٠ ج</td>
                  <td className="text-center py-3 px-3 font-black text-green-300 text-base">+١٢٠,٢٤٠ ج</td>
                </tr>
              </tfoot>
            </table>
            <p className="text-gray-400 text-[10px] mt-2 px-1 font-arabic">
              * التكاليف تشمل: استضافة (Railway/Render) + SendGrid + Cloudinary + Firebase + تسويق + دعم. الأرقام تقديرية.
            </p>
          </Card>

          {/* ── Monthly bar chart visual ── */}
          <Card className="mt-6">
            <h3 className="text-gray-800 font-bold mb-5 text-sm font-arabic flex items-center gap-2">
              <TrendingUp size={14} className="text-emerald-500" /> نمو صافي الربح الشهري بالجنيه المصري
            </h3>
            <div className="flex items-end justify-between gap-2 h-40">
              {[
                { month: 'يونيو', net: -8000,   color: '#EF4444' },
                { month: 'يوليو', net: -2474,   color: '#F97316' },
                { month: 'أغسطس',net:  11545,   color: '#EAB308' },
                { month: 'سبتمبر',net: 33740,   color: '#22C55E' },
                { month: 'أكتوبر',net: 61332,   color: '#10B981' },
                { month: 'نوفمبر',net: 90275,   color: '#0EA5E9' },
                { month: 'ديسمبر',net: 144760,  color: '#2563EB' },
                { month: 'يناير ٢٧',net: 208240, color: '#7C3AED' },
              ].map(({ month, net, color }) => {
                const maxVal = 208240;
                const pct = Math.max(0, (net / maxVal) * 100);
                const negPct = net < 0 ? Math.abs(net / maxVal) * 100 : 0;
                return (
                  <div key={month} className="flex flex-col items-center flex-1 gap-1">
                    <div className="text-[10px] font-bold" style={{ color }}>{net >= 0 ? '+' : ''}{(net/1000).toFixed(0)}k</div>
                    <div className="w-full flex flex-col justify-end" style={{ height: '100px' }}>
                      {net >= 0 ? (
                        <div className="w-full rounded-t-lg transition-all" style={{ height: `${pct}%`, backgroundColor: color, minHeight: '4px' }} />
                      ) : (
                        <div className="w-full rounded-t-lg" style={{ height: `${negPct}%`, backgroundColor: color, minHeight: '4px' }} />
                      )}
                    </div>
                    <div className="text-[9px] text-gray-500 font-arabic text-center leading-tight">{month}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-red-500" /><span className="text-[11px] text-gray-500 font-arabic">خسارة</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-500" /><span className="text-[11px] text-gray-500 font-arabic">ربح إيجابي</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-violet-600" /><span className="text-[11px] text-gray-500 font-arabic">هدف يناير ٢٠٢٧</span></div>
            </div>
          </Card>

          {/* ── Cost Breakdown ── */}
          <Card className="mt-6">
            <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
              <Package size={14} className="text-red-500" /> تفصيل التكاليف التشغيلية الشهرية (ج.م)
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {[
                { item: 'استضافة Railway / Render',   phase1: '٠',       phase2: '٣٠٠',    phase3: '٨٠٠',    color: '#2563EB' },
                { item: 'MongoDB Atlas (M10)',         phase1: '٠',       phase2: '١,٢٠٠', phase3: '٢,٤٠٠', color: '#22C55E' },
                { item: 'Cloudinary (مساحة ميديا)',    phase1: '٠',       phase2: '٤٠٠',    phase3: '١,٢٠٠', color: '#F59E0B' },
                { item: 'Firebase FCM (إشعارات)',      phase1: '٠',       phase2: '٢٠٠',    phase3: '٦٠٠',    color: '#F97316' },
                { item: 'SendGrid (إيميل)',             phase1: '٢٠٠',    phase2: '٥٠٠',    phase3: '١,٢٠٠', color: '#EC4899' },
                { item: 'تسويق رقمي',                  phase1: '٢,٠٠٠', phase2: '٥,٠٠٠', phase3: '١٠,٠٠٠',color: '#8B5CF6' },
                { item: 'نطاق + شهادة SSL',            phase1: '١٠٠',    phase2: '١٠٠',    phase3: '١٠٠',    color: '#0EA5E9' },
                { item: 'Paymob (بوابة دفع ٢.٢٪)',    phase1: '٠',       phase2: '٤٠٠',    phase3: '٢,٠٠٠', color: '#10B981' },
                { item: 'دعم فني + تطوير',             phase1: '٥,٠٠٠', phase2: '٥,٠٠٠', phase3: '٨,٠٠٠', color: '#6366F1' },
              ].map(({ item, phase1, phase2, phase3, color }) => (
                <div key={item} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-gray-700 font-bold text-xs font-arabic">{item}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="bg-white rounded-lg py-1 border border-gray-100">
                      <div className="text-gray-700 font-bold text-[11px]">{phase1}</div>
                      <div className="text-[9px] text-gray-400">P1</div>
                    </div>
                    <div className="bg-white rounded-lg py-1 border border-gray-100">
                      <div className="text-gray-700 font-bold text-[11px]">{phase2}</div>
                      <div className="text-[9px] text-gray-400">P2</div>
                    </div>
                    <div className="bg-white rounded-lg py-1 border border-gray-100">
                      <div className="text-gray-700 font-bold text-[11px]">{phase3}</div>
                      <div className="text-[9px] text-gray-400">P3</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-center p-3 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <div className="text-red-600 font-black text-lg">~٨,٠٠٠ ج</div>
                <div className="text-[10px] text-gray-500 font-arabic">إجمالي شهر الإطلاق</div>
              </div>
              <div>
                <div className="text-orange-600 font-black text-lg">~١٣,١٠٠ ج</div>
                <div className="text-[10px] text-gray-500 font-arabic">إجمالي Phase 2 (سبتمبر)</div>
              </div>
              <div>
                <div className="text-blue-700 font-black text-lg">~٢٦,٣٠٠ ج</div>
                <div className="text-[10px] text-gray-500 font-arabic">إجمالي Phase 3 (ديسمبر)</div>
              </div>
            </div>
          </Card>

          {/* ── Breakeven Analysis ── */}
          <Card className="mt-6 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
            <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
              <Award size={14} className="text-emerald-600" /> نقطة التعادل (Break-even) — بالجنيه المصري
            </h3>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-2xl p-4 border border-emerald-100 text-center">
                <div className="text-3xl font-black text-emerald-600 mb-1">أغسطس<br/>٢٠٢٦</div>
                <div className="text-gray-600 text-xs font-arabic">الشهر الثالث من الإطلاق</div>
                <div className="text-emerald-700 font-bold text-sm mt-2">أول شهر ربحي ✅</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-emerald-100 text-center">
                <div className="text-3xl font-black text-blue-600 mb-1">١٢٠<br/>معلم</div>
                <div className="text-gray-600 text-xs font-arabic">يكفي للتعادل مع التكاليف</div>
                <div className="text-blue-700 font-bold text-sm mt-2">أو ٢٠ مركز تعليمي</div>
              </div>
              <div className="bg-white rounded-2xl p-4 border border-emerald-100 text-center">
                <div className="text-3xl font-black text-amber-600 mb-1">~١٠,٠٠٠<br/>ج</div>
                <div className="text-gray-600 text-xs font-arabic">التكلفة الشهرية عند الإطلاق</div>
                <div className="text-amber-700 font-bold text-sm mt-2">= ١٠٢ معلم برو فقط</div>
              </div>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl border border-emerald-200">
              <p className="text-emerald-800 text-sm font-arabic leading-relaxed">
                🎯 <strong>الهدف الاستراتيجي:</strong> الوصول إلى <strong>٢٠٨,٢٤٠ ج صافي ربح شهري</strong> بحلول يناير ٢٠٢٧ —
                أي <strong>١,٠٠٠ معلم برو + ٦٠ مركز + ١,٢٠٠ طالب بريميم</strong>. 
                الإيراد السنوي المتوقع لأول عام كامل <strong>~٢.٣ مليون جنيه مصري</strong>.
              </p>
            </div>
          </Card>

        </Section>

        {/* ════════ LAUNCH PLAN ════════ */}
        <Section id="launch" title="خطة الإطلاق والنمو" icon={Rocket}
          subtitle="من الآن حتى الإطلاق الرسمي وما بعده — خطوة بخطوة">

          <Card className="mb-6 p-0 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <CalendarCheck size={15} className="text-emerald-500" />
              <span className="font-bold text-gray-800 text-sm font-arabic">خارطة طريق الإطلاق</span>
              <Badge color="green">مخطط تفاعلي</Badge>
            </div>
            <div className="p-3"><LaunchPlanDiagram /></div>
          </Card>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <Card>
              <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
                <Package size={14} className="text-blue-500" /> ما يجب إنجازه قبل الإطلاق
              </h3>
              <div className="space-y-2">
                {[
                  { task: 'إنهاء نظام المصادقة الكامل',     done: true },
                  { task: 'ملفات المعلمين والطلاب',          done: true },
                  { task: 'صفحة الهبوط الاحترافية',         done: true },
                  { task: 'نظام الكورسات وإدارتها',          done: false },
                  { task: 'نظام المدفوعات (Paymob/Stripe)',  done: false },
                  { task: 'لوحة تحكم المعلم الكاملة',        done: false },
                  { task: 'اختبار بيتا مع ١٠٠ معلم',         done: false },
                  { task: 'إطلاق حملة تسويقية رقمية',        done: false },
                ].map(({ task, done }) => (
                  <div key={task} className={`flex items-center gap-3 p-2.5 rounded-xl border ${done ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                      {done && <span className="text-white text-[10px]">✓</span>}
                    </div>
                    <span className={`text-sm font-arabic ${done ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>{task}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="text-gray-800 font-bold mb-4 text-sm font-arabic flex items-center gap-2">
                <Megaphone size={14} className="text-rose-500" /> استراتيجية التسويق
              </h3>
              <div className="space-y-2.5">
                {[
                  { channel: 'وسائل التواصل الاجتماعي', detail: 'فيسبوك + إنستغرام للمعلمين المصريين', icon: Globe,      color: '#2563EB' },
                  { channel: 'مجتمعات واتساب وتلغرام',  detail: 'مجموعات المعلمين والطلاب — ٠ تكلفة', icon: Bell,       color: '#22C55E' },
                  { channel: 'مؤثرون تعليميون',         detail: 'شراكات يوتيوب + عمولة ٢٠٪ إحالة',  icon: Award,      color: '#F59E0B' },
                  { channel: 'مراكز التقوية',            detail: 'عروض مباشرة — تجربة مجانية ٣ أشهر', icon: Building2,  color: '#8B5CF6' },
                  { channel: 'محتوى SEO عربي',           detail: 'مقالات ودروس تعليمية مجانية',        icon: Lightbulb,  color: '#0EA5E9' },
                  { channel: 'إعلانات Google/Facebook',  detail: 'مستهدفة للمعلمين والأهل في مصر',    icon: Target,     color: '#F43F5E' },
                ].map(({ channel, detail, icon: Icon, color }) => (
                  <div key={channel} className="flex items-start gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
                      <Icon size={13} style={{ color }} />
                    </div>
                    <div>
                      <div className="text-gray-800 font-bold text-xs font-arabic">{channel}</div>
                      <div className="text-gray-500 text-[11px] font-arabic">{detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {[
              { phase: 1, date: 'يونيو ١٢، ٢٠٢٦', label: 'MVP — الإطلاق الأول',             color: '#2563EB', bg: 'bg-blue-50',   border: 'border-blue-200',   status: 'قيد التطوير', goal: 'هدف: ٥٠٠ معلم + ٢٠٠ مدفوع في الشهر الأول', items: ['صفحة هبوط + مصادقة','ملفات المعلمين','إدارة الكورسات','تسجيل الطلاب','نظام المدفوعات'] },
              { phase: 2, date: 'Q3 ٢٠٢٦',        label: 'النمو — ذكاء اصطناعي + أهل',     color: '#0EA5E9', bg: 'bg-sky-50',    border: 'border-sky-200',    status: 'مخطط',        goal: 'هدف: ٢,٠٠٠ معلم + ١٥,٠٠٠ طالب نشط',        items: ['لوحة ولي الأمر','تحليلات ذكاء اصطناعي','نظام التلعيب','جلسات مباشرة','إشعارات فورية'] },
              { phase: 3, date: 'Q4 ٢٠٢٦',        label: 'التوسع — المراكز التعليمية',      color: '#8B5CF6', bg: 'bg-purple-50', border: 'border-purple-200', status: 'مخطط',        goal: 'هدف: ١٠٠ مركز + إيرادات شهرية ٢٠٠,٠٠٠ ج',  items: ['لوحة إدارة المراكز','تحليلات الإيرادات','إدارة الموظفين','سوق المحتوى','مدفوعات متقدمة'] },
              { phase: 4, date: '٢٠٢٧',            label: 'التوسع الكبير — جوال + MENA',    color: '#22C55E', bg: 'bg-emerald-50',border: 'border-emerald-200',status: 'مستقبلي',     goal: 'هدف: دول خليجية + ٥٠,٠٠٠ مستخدم',           items: ['تطبيق iOS & Android','ذكاء اصطناعي متقدم','تعلم تكيفي','توسع خليجي','محتوى أوفلاين'] },
            ].map(({ phase, date, label, color, bg, border, status, goal, items }) => (
              <div key={phase} className={`p-5 rounded-2xl border-2 ${bg} ${border}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl border-2 flex items-center justify-center font-black text-sm bg-white" style={{ borderColor: color, color }}>{phase}</div>
                    <div>
                      <div className="text-gray-900 font-bold font-arabic">{label}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Clock size={11} style={{ color }} />
                        <span className="text-xs font-arabic" style={{ color }}>{date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge color={status === 'قيد التطوير' ? 'blue' : status === 'مخطط' ? 'amber' : 'green'}>{status}</Badge>
                    <div className="text-gray-500 text-[11px] font-arabic">{goal}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {items.map(item => (
                    <span key={item} className="flex items-center gap-1.5 text-xs text-gray-600 bg-white border border-gray-200 rounded-lg px-2.5 py-1 font-arabic shadow-sm">
                      <ArrowRight size={9} style={{ color }} />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════════ BUSINESS MODEL ════════ */}
        <Section id="business" title="نموذج الأعمال الكامل" icon={TrendingUp}
          subtitle="السوق المستهدف، التحديات، الميزة التنافسية، واقتصاديات الوحدة">

          {/* ── Egypt Market Header ── */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🇪🇬</span>
              <div>
                <h3 className="text-gray-800 font-black text-base font-arabic leading-tight">السوق المصري — التعليم الإلكتروني والدروس الخصوصية</h3>
                <p className="text-gray-400 text-xs font-arabic mt-0.5">جميع الأرقام بالجنيه المصري (ج.م.) — بيانات ٢٠٢٥</p>
              </div>
            </div>
            <button
              onClick={() => {
                const el = document.getElementById('tam-section');
                if (el) { if (document.fullscreenElement) document.exitFullscreen(); else el.requestFullscreen(); }
              }}
              className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer font-arabic"
            >
              <Monitor size={12} />
              عرض ملء الشاشة
            </button>
          </div>

          {/* ── TAM / SAM / SOM Cards ── */}
          <div id="tam-section" className="grid md:grid-cols-3 gap-5 mb-8 bg-white">

            {/* TAM */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-blue-100/60 p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-blue-600 font-bold text-sm font-arabic">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Globe size={15} className="text-blue-600" />
                  </div>
                  السوق الكلي
                </span>
                <span className="text-[10px] font-black tracking-widest text-blue-400 bg-blue-100 rounded-full px-2.5 py-1 uppercase">TAM</span>
              </div>
              <div>
                <div className="text-4xl font-black text-blue-700 leading-none mb-1">٩٠ مليار</div>
                <div className="text-blue-500 text-sm font-bold font-arabic">ج.م. سنوياً</div>
              </div>
              <p className="text-gray-600 text-xs font-arabic leading-relaxed border-t border-blue-100 pt-3">
                إجمالي سوق التعليم الإلكتروني والدروس الخصوصية في <strong>مصر</strong> — يضم ١٠+ مليون طالب ومليون معلم خصوصي
              </p>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-blue-200/30 blur-2xl" />
            </div>

            {/* SAM */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-purple-100/60 p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-purple-600 font-bold text-sm font-arabic">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Target size={15} className="text-purple-600" />
                  </div>
                  السوق المخدوم
                </span>
                <span className="text-[10px] font-black tracking-widest text-purple-400 bg-purple-100 rounded-full px-2.5 py-1 uppercase">SAM</span>
              </div>
              <div>
                <div className="text-4xl font-black text-purple-700 leading-none mb-1">١٢ مليار</div>
                <div className="text-purple-500 text-sm font-bold font-arabic">ج.م. سنوياً</div>
              </div>
              <p className="text-gray-600 text-xs font-arabic leading-relaxed border-t border-purple-100 pt-3">
                المنصات الرقمية للدروس الخصوصية والتعليم المنظم في مصر — الجزء القابل للتحويل رقمياً من السوق
              </p>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-purple-200/30 blur-2xl" />
            </div>

            {/* SOM */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-100 bg-gradient-to-br from-emerald-50 to-emerald-100/60 p-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-emerald-600 font-bold text-sm font-arabic">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <ArrowUpRight size={15} className="text-emerald-600" />
                  </div>
                  الهدف الأول
                </span>
                <span className="text-[10px] font-black tracking-widest text-emerald-400 bg-emerald-100 rounded-full px-2.5 py-1 uppercase">SOM</span>
              </div>
              <div>
                <div className="text-4xl font-black text-emerald-700 leading-none mb-1">١٥٠ مليون</div>
                <div className="text-emerald-500 text-sm font-bold font-arabic">ج.م. سنوياً</div>
              </div>
              <p className="text-gray-600 text-xs font-arabic leading-relaxed border-t border-emerald-100 pt-3">
                ٥,٠٠٠ معلم برو + ١٠٠ مركز تعليمي في أول ٢ سنة — ١.٢٥٪ من SAM
              </p>
              <div className="absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-emerald-200/30 blur-2xl" />
            </div>
          </div>

          {/* ── Funnel Visual ── */}
          <div className="mb-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
            <h4 className="text-gray-700 font-bold text-sm font-arabic mb-5 flex items-center gap-2">
              <PieChart size={14} className="text-blue-500" /> مخروط السوق — كيف نقتطع حصتنا
            </h4>
            <div className="flex flex-col items-center gap-2">
              {[
                { label: 'TAM — السوق الكلي في مصر', value: '٩٠ مليار ج.م.', pct: 100, bg: 'bg-blue-500', w: 'w-full' },
                { label: 'SAM — المنصات الرقمية القابلة للاستهداف', value: '١٢ مليار ج.م.', pct: 13, bg: 'bg-purple-500', w: 'w-3/4' },
                { label: 'SOM — هدفنا خلال ٢ سنة', value: '١٥٠ مليون ج.م.', pct: 1.25, bg: 'bg-emerald-500', w: 'w-2/5' },
              ].map(({ label, value, pct, bg, w }) => (
                <div key={label} className={`${w} max-w-2xl`}>
                  <div className={`${bg} rounded-xl px-5 py-3 flex items-center justify-between gap-4 shadow-sm`}>
                    <span className="text-white font-arabic text-xs font-semibold leading-tight">{label}</span>
                    <div className="text-right flex-shrink-0">
                      <div className="text-white font-black text-sm leading-tight">{value}</div>
                      <div className="text-white/70 text-[10px]">{pct}٪ من TAM</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-400 text-[11px] font-arabic mt-4">
              🎯 التركيز الكامل على مصر في المرحلة الأولى — التوسع لـ MENA في المرحلة الثالثة
            </p>
          </div>

          <Card className="mb-6">
            <h3 className="text-gray-800 font-bold mb-4 font-arabic flex items-center gap-2">
              <Trophy size={14} className="text-amber-500" /> الميزة التنافسية
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { icon: Brain,     color: '#8B5CF6', title: 'ذكاء اصطناعي عربي',     desc: 'تحليلات وتوصيات بالعربية — منافسونا لا يقدمون ذلك' },
                { icon: Users2,    color: '#2563EB', title: 'منظومة متكاملة',         desc: '٤ أطراف في منصة واحدة: معلم، طالب، أهل، مركز' },
                { icon: Globe,     color: '#22C55E', title: 'عربي أولاً',             desc: 'تصميم RTL أصيل — ليس ترجمة لمنصة غربية' },
                { icon: Trophy,    color: '#F59E0B', title: 'تلعيب تعليمي',           desc: 'نقاط ومكافآت تُحفّز الطلاب على الاستمرار' },
                { icon: Shield,    color: '#F43F5E', title: 'شفافية لأولياء الأمور', desc: 'تقارير فورية للأهل — ميزة يطلبها السوق المصري' },
                { icon: Handshake, color: '#0EA5E9', title: 'نموذج Freemium',         desc: 'المعلم يبدأ مجاناً — يحول عند إدراك القيمة' },
              ].map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '15' }}><Icon size={15} style={{ color }} /></div>
                    <div className="text-gray-800 font-bold text-sm font-arabic">{title}</div>
                  </div>
                  <div className="text-gray-500 text-xs font-arabic leading-relaxed">{desc}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-6 overflow-x-auto">
            <h3 className="text-gray-800 font-bold mb-4 font-arabic flex items-center gap-2">
              <BarChart3 size={14} className="text-blue-500" /> المقارنة بالمنافسين
            </h3>
            <table className="w-full text-xs min-w-[480px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-right pb-2 text-gray-500">الميزة</th>
                  <th className="text-center pb-2 text-blue-600 font-bold">خطوة للنور ✦</th>
                  <th className="text-center pb-2 text-gray-400">نفهم</th>
                  <th className="text-center pb-2 text-gray-400">Udemy عربي</th>
                  <th className="text-center pb-2 text-gray-400">واتساب/فيس</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feat: 'منظومة متكاملة ٤ أطراف', us: true, n: false, u: false, w: false },
                  { feat: 'تتبع الطالب للأهل',       us: true, n: false, u: false, w: false },
                  { feat: 'تحليلات ذكاء اصطناعي',   us: true, n: false, u: false, w: false },
                  { feat: 'نموذج Freemium',          us: true, n: true,  u: true,  w: true  },
                  { feat: 'إدارة المراكز التعليمية', us: true, n: false, u: false, w: false },
                  { feat: 'تلعيب تعليمي',            us: true, n: false, u: false, w: false },
                  { feat: 'دعم RTL أصيل',            us: true, n: true,  u: false, w: true  },
                ].map(({ feat, us, n, u, w }) => (
                  <tr key={feat} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 text-gray-600 font-arabic">{feat}</td>
                    <td className="py-2 text-center">{us ? <span className="text-emerald-600 font-bold">✅</span> : '❌'}</td>
                    <td className="py-2 text-center">{n  ? '✅' : <span className="text-gray-300">—</span>}</td>
                    <td className="py-2 text-center">{u  ? '✅' : <span className="text-gray-300">—</span>}</td>
                    <td className="py-2 text-center">{w  ? '✅' : <span className="text-gray-300">—</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <Card className="mb-6">
            <h3 className="text-gray-800 font-bold mb-4 font-arabic flex items-center gap-2">
              <CreditCard size={14} className="text-emerald-500" /> اقتصاديات الوحدة (Unit Economics)
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'CAC المعلم',    value: '٥٠ ج',     sub: 'تكلفة اكتساب معلم واحد',             color: '#2563EB', icon: GraduationCap },
                { label: 'LTV المعلم',    value: '٢,٣٧٦ ج',  sub: 'قيمة المعلم على سنتين (٩٩×٢٤)',     color: '#22C55E', icon: TrendingUp },
                { label: 'LTV:CAC',       value: '٤٧:١',     sub: 'كل جنيه استثمار يرجع ٤٧ جنيه',      color: '#F59E0B', icon: ArrowUpRight },
                { label: 'Payback Period',value: '١ شهر',    sub: 'المعلم يُعيد تكلفته في الشهر الأول', color: '#8B5CF6', icon: Clock },
              ].map(({ label, value, sub, color, icon: Icon }) => (
                <div key={label} className="p-4 rounded-2xl border text-center" style={{ backgroundColor: color + '08', borderColor: color + '25' }}>
                  <div className="w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div className="font-black text-xl" style={{ color }}>{value}</div>
                  <div className="text-gray-700 font-bold text-sm font-arabic mb-0.5">{label}</div>
                  <div className="text-gray-400 text-[10px] font-arabic">{sub}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="mb-6">
            <h3 className="text-gray-800 font-bold mb-4 font-arabic flex items-center gap-2">
              <Shield size={14} className="text-red-500" /> المخاطر والحلول
            </h3>
            <div className="space-y-3">
              {[
                { risk: 'صعوبة اكتساب المعلمين في البداية', solution: 'فريميم مغري + دعم فني مباشر + شراكات مراكز', color: '#F43F5E' },
                { risk: 'المنافسة من منصات عالمية (Udemy)',  solution: 'التركيز على السوق المحلي والأهل وادارة المراكز', color: '#F97316' },
                { risk: 'ضعف الثقة في الدفع الإلكتروني',   solution: 'دعم Paymob + تحويل بنكي + دفع نقدي عبر المراكز', color: '#F59E0B' },
                { risk: 'انخفاض معدل الاحتفاظ',             solution: 'تلعيب + إشعارات ذكية + تقارير فورية للأهل', color: '#8B5CF6' },
                { risk: 'التكلفة التقنية مرتفعة',           solution: 'MongoDB Atlas Free + Railway/Render Free Tier', color: '#2563EB' },
              ].map(({ risk, solution, color }) => (
                <div key={risk} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: color }} />
                  <div>
                    <div className="text-gray-800 font-bold text-sm font-arabic mb-0.5">{risk}</div>
                    <div className="flex items-center gap-1.5">
                      <ArrowRight size={11} className="text-emerald-500 flex-shrink-0" />
                      <div className="text-emerald-700 text-xs font-arabic">{solution}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 className="text-gray-800 font-bold mb-4 font-arabic flex items-center gap-2">
              <Handshake size={14} className="text-blue-500" /> الشراكات الاستراتيجية
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { type: 'مراكز التقوية',   desc: 'تجربة مجانية ٣ أشهر لأول ٢٠ مركز',   icon: Building2,   color: '#8B5CF6' },
                { type: 'مؤثرون تعليميون', desc: 'عمولة ٢٠٪ على كل معلم يحيلونه',      icon: PhoneCall,   color: '#F59E0B' },
                { type: 'مدارس خاصة',      desc: 'تكامل مع أنظمة إدارة المدارس',       icon: GraduationCap,color: '#22C55E' },
                { type: 'برامج Startups',  desc: 'AWS Activate + Google for Startups', icon: Zap,         color: '#2563EB' },
              ].map(({ type, desc, icon: Icon, color }) => (
                <div key={type} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="w-9 h-9 rounded-xl mb-2 flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
                    <Icon size={16} style={{ color }} />
                  </div>
                  <div className="text-gray-800 font-bold text-sm font-arabic mb-1">{type}</div>
                  <div className="text-gray-500 text-xs font-arabic">{desc}</div>
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-200">
            <Zap size={18} className="text-white" />
          </div>
          <div className="text-gray-800 font-bold font-arabic">خطوة للنور — NourStep</div>
          <div className="text-gray-400 text-sm font-arabic mt-1">
            وثيقة نموذج العمل · آخر تحديث: أبريل ٢٠٢٦ · سري وخاص بالفريق
          </div>
        </div>
      </main>
    </div>
  );
}
