# NourStep — Authentication Flows

## 📋 Overview

NourStep implements a complete authentication system supporting:

1. **Role-based Registration** — Teacher, Student, Parent
2. **Email Login** — Standard email/password authentication
3. **Account Confirmation** — Email verification after registration
4. **Password Reset** — Secure forgot/reset password flow

All flows support **bilingual (Arabic/English)** interfaces.

---

## 1️⃣ Registration Flow

### Step 1: Choose Account Type

User selects their role:
- 👨‍🏫 **Teacher (معلم)** — "I want to teach and manage courses"
- 👨‍🎓 **Student (طالب)** — "I want to learn and grow"
- 👨‍👩‍👧 **Parent (ولي أمر)** — "I want to follow my child's progress"

### Step 2: Fill Registration Form

Each role has a tailored form:

#### Teacher Form Fields
| Field              | Type     | Required | Validation                     |
| ------------------ | -------- | -------- | ------------------------------ |
| `fullName`         | string   | ✅        | 3-100 chars                    |
| `email`            | string   | ✅        | Valid email, unique             |
| `password`         | string   | ✅        | Min 8 chars, mixed case + digit |
| `confirmPassword`  | string   | ✅        | Must match password             |
| `phone`            | string   | ✅        | Valid phone format              |
| `subject`          | string   | ✅        | Subject specialization          |
| `experience`       | select   | ✅        | Years of experience range       |
| `location`         | string   | ✅        | City/area                       |

#### Student Form Fields
| Field              | Type     | Required | Validation                     |
| ------------------ | -------- | -------- | ------------------------------ |
| `fullName`         | string   | ✅        | 3-100 chars                    |
| `email`            | string   | ✅        | Valid email, unique             |
| `password`         | string   | ✅        | Min 8 chars, mixed case + digit |
| `confirmPassword`  | string   | ✅        | Must match password             |
| `phone`            | string   | ✅        | Valid phone format              |
| `gradeLevel`       | select   | ✅        | Education level                 |
| `parentEmail`      | string   | ❌        | Valid email (for linking)        |

#### Parent Form Fields
| Field              | Type     | Required | Validation                     |
| ------------------ | -------- | -------- | ------------------------------ |
| `fullName`         | string   | ✅        | 3-100 chars                    |
| `email`            | string   | ✅        | Valid email, unique             |
| `password`         | string   | ✅        | Min 8 chars, mixed case + digit |
| `confirmPassword`  | string   | ✅        | Must match password             |
| `phone`            | string   | ✅        | Valid phone format              |
| `numberOfChildren` | number   | ✅        | 1-10                            |
| `childInviteCode`  | string   | ❌        | Alphanumeric code               |

### Step 3: Submit & Confirmation Email

- Upon successful validation, account is created with `status: "pending"`
- A **6-digit confirmation code** is sent to the registered email
- User is redirected to the **Confirm Account** page

### Step 4: Account Confirmation

- User enters the 6-digit code
- Code expires after **15 minutes**
- User can request a **resend** (max 3 times per hour)
- On success: account `status` changes to `"active"` → redirect to login

---

## 2️⃣ Login Flow

### Standard Login
- Email + Password
- On success: JWT token stored, redirect to role-based dashboard
- On failure: Show error (invalid credentials / account not confirmed)

### Validation
| Field      | Validation                              |
| ---------- | --------------------------------------- |
| `email`    | Required, valid email format            |
| `password` | Required, min 6 chars                   |

### Error States
- **Invalid credentials** → "البريد الإلكتروني أو كلمة المرور غير صحيحة"
- **Account not confirmed** → Show "Confirm your account" link
- **Account suspended** → Contact support message
- **Too many attempts** → Rate limit (5 attempts per 15 min)

---

## 3️⃣ Forgot / Reset Password Flow

### Step 1: Request Reset
- User enters their registered **email address**
- System sends a **password reset link** (valid for 1 hour)
- Success message shown regardless of whether email exists (security)

### Step 2: Reset Password
- User clicks link → opens reset password page with token
- User enters **new password** + **confirm password**
- Validation: min 8 chars, mixed case, digit required
- On success: password updated → redirect to login

### Security Measures
- Reset tokens are single-use
- Tokens expire after 1 hour
- Old password is not required (forgot password flow)
- User is logged out of all sessions on password change

---

## 4️⃣ API Endpoints

### Auth Endpoints

| Method | Endpoint                         | Description                    |
| ------ | -------------------------------- | ------------------------------ |
| POST   | `/api/v1/auth/register`          | Register new user (with role)  |
| POST   | `/api/v1/auth/login`             | Login with email/password      |
| POST   | `/api/v1/auth/confirm`           | Confirm account with code      |
| POST   | `/api/v1/auth/resend-code`       | Resend confirmation code       |
| POST   | `/api/v1/auth/forgot-password`   | Request password reset email   |
| POST   | `/api/v1/auth/reset-password`    | Reset password with token      |
| POST   | `/api/v1/auth/logout`            | Logout (invalidate token)      |
| GET    | `/api/v1/auth/me`                | Get current user profile       |
