# NourStep — Domain Model

## 📋 Core Entities

### 1. User

The base entity for all authenticated users.

```
User {
  id              UUID        PK
  email           String      UNIQUE, NOT NULL
  password_hash   String      NOT NULL
  full_name       String      NOT NULL
  phone           String      NOT NULL
  role            Enum        ['teacher', 'student', 'parent']
  status          Enum        ['pending', 'active', 'suspended']
  avatar_url      String?
  locale          Enum        ['ar', 'en']
  created_at      Timestamp   DEFAULT NOW()
  updated_at      Timestamp   DEFAULT NOW()
  last_login_at   Timestamp?
}
```

### 2. TeacherProfile

Extended profile for teacher-role users.

```
TeacherProfile {
  id              UUID        PK
  user_id         UUID        FK → User.id, UNIQUE
  subject         String      NOT NULL
  experience      String      NOT NULL   // e.g. '0-1', '1-3', '3-5', '5-10', '10+'
  location        String      NOT NULL
  degree          String      NOT NULL   // e.g. 'bachelor', 'master', 'phd', 'diploma', 'other'
  age             Integer     NOT NULL   // min 18, max 80
  teaching_mode   Enum        ['online', 'offline', 'both']  NOT NULL
  whatsapp        String?                // optional direct contact number
  school_name     String?                // optional affiliated school/institution
  bio             Text?
  rating          Decimal?    DEFAULT 0
  total_students  Integer     DEFAULT 0
  verified        Boolean     DEFAULT false
  created_at      Timestamp   DEFAULT NOW()
}
```

### 3. StudentProfile

Extended profile for student-role users.

```
StudentProfile {
  id              UUID        PK
  user_id         UUID        FK → User.id, UNIQUE
  grade_level     String      NOT NULL
  parent_id       UUID?       FK → User.id (parent)
  points          Integer     DEFAULT 0
  streak_days     Integer     DEFAULT 0
  created_at      Timestamp   DEFAULT NOW()
}
```

### 4. ParentProfile

Extended profile for parent-role users.

```
ParentProfile {
  id              UUID        PK
  user_id         UUID        FK → User.id, UNIQUE
  number_of_children  Integer NOT NULL
  created_at      Timestamp   DEFAULT NOW()
}
```

### 5. ConfirmationCode

For email verification after registration.

```
ConfirmationCode {
  id              UUID        PK
  user_id         UUID        FK → User.id
  code            String      NOT NULL   // 6-digit code
  expires_at      Timestamp   NOT NULL   // created_at + 15 min
  used            Boolean     DEFAULT false
  created_at      Timestamp   DEFAULT NOW()
}
```

### 6. PasswordResetToken

For forgot password functionality.

```
PasswordResetToken {
  id              UUID        PK
  user_id         UUID        FK → User.id
  token           String      NOT NULL, UNIQUE  // UUID or crypto token
  expires_at      Timestamp   NOT NULL           // created_at + 1 hour
  used            Boolean     DEFAULT false
  created_at      Timestamp   DEFAULT NOW()
}
```

---

## 🔗 Relationships

```
User (1) ──── (0..1) TeacherProfile    [role = 'teacher']
User (1) ──── (0..1) StudentProfile    [role = 'student']
User (1) ──── (0..1) ParentProfile     [role = 'parent']

User (1) ──── (0..*) ConfirmationCode
User (1) ──── (0..*) PasswordResetToken

User/Parent (1) ──── (0..*) User/Student   [parent-child link]
```

---

## 📊 Indexes

| Table              | Column(s)           | Type    | Purpose                    |
| ------------------ | ------------------- | ------- | -------------------------- |
| User               | email               | UNIQUE  | Login lookup               |
| User               | role, status        | INDEX   | Filtered queries           |
| TeacherProfile     | user_id             | UNIQUE  | 1:1 with User              |
| TeacherProfile     | teaching_mode       | INDEX   | Filter by mode             |
| TeacherProfile     | subject             | INDEX   | Subject search             |
| StudentProfile     | user_id             | UNIQUE  | 1:1 with User              |
| StudentProfile     | parent_id           | INDEX   | Parent's children lookup   |
| ParentProfile      | user_id             | UNIQUE  | 1:1 with User              |
| ConfirmationCode   | user_id, code       | INDEX   | Code verification          |
| PasswordResetToken | token               | UNIQUE  | Token lookup               |
