# NourStep — User Roles & Permissions

## 📋 Role Overview

NourStep supports **4 primary user roles**. Each role has distinct capabilities, dashboard views, and permissions within the platform.

---

## 👨‍🏫 Teacher (معلم)

**Description:** Educators who create and manage courses, track student performance, and build professional profiles.

### Permissions

| Feature                        | Access |
| ------------------------------ | ------ |
| Create/manage courses          | ✅      |
| View student analytics         | ✅      |
| AI-powered insights            | ✅      |
| Professional profile/portfolio | ✅      |
| Communication with parents     | ✅      |
| Revenue tracking               | ✅      |
| Platform admin                 | ❌      |

### Registration Requirements

- Full name
- Email address
- Password
- Phone number
- Subject specialization
- Degree / graduation level
- Years of experience
- Age
- Teaching mode (online / in-person / both)
- Location / city
- School or institution name (optional)
- WhatsApp number (optional)

---

## 👨‍🎓 Student (طالب)

**Description:** Learners enrolled in courses, accessing study materials, and tracking their academic progress.

### Permissions

| Feature                        | Access |
| ------------------------------ | ------ |
| Enroll in courses              | ✅      |
| View own progress/grades       | ✅      |
| AI study buddy                 | ✅      |
| Gamification & rewards         | ✅      |
| Live session participation     | ✅      |
| Manage other users             | ❌      |
| Create courses                 | ❌      |

### Registration Requirements

- Full name
- Email address
- Password
- Phone number
- Grade/education level
- Parent email (optional, for linking)

---

## 👨‍👩‍👧 Parent (ولي أمر)

**Description:** Parents/guardians who monitor their children's educational progress and communicate with teachers.

### Permissions

| Feature                          | Access |
| -------------------------------- | ------ |
| View child's progress dashboard  | ✅      |
| Receive notifications/alerts     | ✅      |
| Grade reports                    | ✅      |
| Communicate with teachers        | ✅      |
| Link multiple children           | ✅      |
| Create/manage courses            | ❌      |
| Enroll in courses                | ❌      |

### Registration Requirements

- Full name
- Email address
- Password
- Phone number
- Number of children
- Child invite code (optional, for instant linking)

---

## 🏢 Center Owner (صاحب مركز)

> *Note: Center Owner registration is handled separately through a business onboarding flow (not part of the standard auth flow).*

### Permissions

| Feature                          | Access |
| -------------------------------- | ------ |
| Full admin panel                 | ✅      |
| Manage teachers/staff            | ✅      |
| Revenue analytics                | ✅      |
| Manage all courses               | ✅      |
| Student & parent management      | ✅      |
| Platform-wide settings           | ✅      |

---

## 🔐 Role Hierarchy

```
Center Owner (highest privileges)
  └── Teacher
        └── Parent (read-only on student data)
              └── Student (own data only)
```

Each role inherits **no permissions** from other roles. The hierarchy only represents the data access scope.
