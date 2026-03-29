# خطوة للنور — Backend API Requirements

## Overview

The landing page includes a **Teacher Early Access Registration Form** in the Countdown section. Currently the form submission is handled client-side only (Formik + Yup). A backend endpoint is needed to persist registrations and enable admin management.

---

## 1. Registration Endpoint

### `POST /api/v1/early-access/register`

Receives teacher registration data from the landing page form.

### Request Headers

| Header         | Value              | Required |
| -------------- | ------------------ | -------- |
| `Content-Type` | `application/json` | ✅       |
| `Accept`       | `application/json` | ✅       |

### Request Body

```json
{
  "name": "أحمد محمد",
  "phone": "+201234567890",
  "whatsapp_same": true,
  "whatsapp": "",
  "location": "القاهرة، مصر"
}
```

### Field Specifications

| Field          | Type      | Required | Validation                                                         | Description                                         |
| -------------- | --------- | -------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `name`         | `string`  | ✅       | Min 3 characters, max 100 characters, trimmed                      | Full name of the teacher                             |
| `phone`        | `string`  | ✅       | Regex: `/^[+]?[\d\s\-()]{8,20}$/`, unique in database             | Primary phone number (stored in E.164 format ideally)|
| `whatsapp_same`| `boolean` | ✅       | Must be `true` or `false`                                          | Whether WhatsApp number is the same as phone         |
| `whatsapp`     | `string`  | ⚠️      | Required if `whatsapp_same` is `false`. Same regex as phone        | Separate WhatsApp number (empty string if same)      |
| `location`     | `string`  | ✅       | Min 1 character, max 200 characters, trimmed                       | City / area of the teacher                           |

### Success Response — `201 Created`

```json
{
  "success": true,
  "message": "Registration successful",
  "message_ar": "تم التسجيل بنجاح",
  "data": {
    "id": "uuid-here",
    "name": "أحمد محمد",
    "phone": "+201234567890",
    "whatsapp": "+201234567890",
    "location": "القاهرة، مصر",
    "registered_at": "2026-03-29T10:30:00Z"
  }
}
```

### Error Responses

#### `400 Bad Request` — Validation Error

```json
{
  "success": false,
  "message": "Validation failed",
  "message_ar": "فشل التحقق من البيانات",
  "errors": {
    "name": ["Name is required"],
    "phone": ["Enter a valid phone number"]
  }
}
```

#### `409 Conflict` — Duplicate Phone

```json
{
  "success": false,
  "message": "This phone number is already registered",
  "message_ar": "رقم الهاتف مسجّل بالفعل"
}
```

#### `429 Too Many Requests` — Rate Limited

```json
{
  "success": false,
  "message": "Too many requests. Please try again later",
  "message_ar": "طلبات كثيرة جدًا. حاول مرة أخرى لاحقًا"
}
```

#### `500 Internal Server Error`

```json
{
  "success": false,
  "message": "An unexpected error occurred",
  "message_ar": "حدث خطأ غير متوقع"
}
```

---

## 2. Admin: List Registrations

### `GET /api/v1/early-access/registrations`

Returns all early access registrations (paginated).

### Query Parameters

| Parameter | Type     | Default | Description                          |
| --------- | -------- | ------- | ------------------------------------ |
| `page`    | `number` | `1`     | Page number                          |
| `limit`   | `number` | `20`    | Items per page (max 100)             |
| `search`  | `string` | —       | Search by name, phone, or location   |
| `sort_by` | `string` | `registered_at` | Sort field                    |
| `order`   | `string` | `desc`  | `asc` or `desc`                      |

### Response — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "name": "أحمد محمد",
      "phone": "+201234567890",
      "whatsapp": "+201234567890",
      "location": "القاهرة، مصر",
      "registered_at": "2026-03-29T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "total_pages": 8
  }
}
```

---

## 3. Admin: Export Registrations

### `GET /api/v1/early-access/registrations/export`

Downloads all registrations as CSV or Excel.

### Query Parameters

| Parameter | Type     | Default | Description            |
| --------- | -------- | ------- | ---------------------- |
| `format`  | `string` | `csv`   | `csv` or `xlsx`        |

### Response

Returns file download with appropriate `Content-Type` header.

---

## 4. Admin: Delete Registration

### `DELETE /api/v1/early-access/registrations/:id`

### Response — `200 OK`

```json
{
  "success": true,
  "message": "Registration deleted"
}
```

---

## 5. Database Schema

### Table: `early_access_registrations`

| Column          | Type        | Constraints                    |
| --------------- | ----------- | ------------------------------ |
| `id`            | `UUID`      | Primary Key, auto-generated    |
| `name`          | `VARCHAR(100)` | NOT NULL                    |
| `phone`         | `VARCHAR(20)`  | NOT NULL, UNIQUE             |
| `whatsapp_same` | `BOOLEAN`   | NOT NULL, DEFAULT `true`       |
| `whatsapp`      | `VARCHAR(20)`  | NULLABLE                    |
| `location`      | `VARCHAR(200)` | NOT NULL                    |
| `ip_address`    | `VARCHAR(45)`  | NULLABLE (for rate limiting) |
| `user_agent`    | `TEXT`       | NULLABLE                       |
| `registered_at` | `TIMESTAMP` | NOT NULL, DEFAULT `NOW()`      |
| `created_at`    | `TIMESTAMP` | NOT NULL, DEFAULT `NOW()`      |
| `updated_at`    | `TIMESTAMP` | NOT NULL, DEFAULT `NOW()`      |

### Indexes

- `UNIQUE INDEX` on `phone`
- `INDEX` on `registered_at`
- `INDEX` on `location`

---

## 6. Security & Rate Limiting

| Rule                        | Value                                    |
| --------------------------- | ---------------------------------------- |
| Rate limit per IP           | 5 requests per 15 minutes                |
| Rate limit per phone        | 1 registration per phone (unique)        |
| Input sanitization          | Strip HTML tags, trim whitespace          |
| Phone normalization         | Store in E.164 format (e.g. `+201234567890`) |
| CORS                        | Allow only `https://nourstep.com` and `https://www.nourstep.com` |
| HTTPS                       | Required                                 |

---

## 7. Frontend Integration Example

Once the backend is ready, update `Countdown.tsx` `onSubmit`:

```typescript
onSubmit: async (values, { setSubmitting, setStatus }) => {
  try {
    const payload = {
      name: values.name.trim(),
      phone: values.phone.trim(),
      whatsapp_same: values.whatsappSame,
      whatsapp: values.whatsappSame ? '' : values.whatsapp.trim(),
      location: values.location.trim(),
    };

    const res = await fetch('/api/v1/early-access/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus({ error: data.message_ar || data.message });
      return;
    }

    setSubmitted(true);
  } catch {
    setStatus({ error: 'حدث خطأ في الاتصال. حاول مرة أخرى.' });
  } finally {
    setSubmitting(false);
  }
},
```

---

## 8. Optional: Email/SMS Notification

When a new registration is received, optionally:

1. **Send confirmation SMS** to the teacher's phone/WhatsApp
2. **Send email notification** to admin (`hello@nourstep.com`)
3. **Send WhatsApp message** via WhatsApp Business API with registration confirmation

---

## 9. Environment Variables Needed

```env
DATABASE_URL=postgresql://user:pass@host:5432/nourstep
CORS_ORIGIN=https://nourstep.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=5
ADMIN_API_KEY=your-secure-admin-key
```

---

## Summary

| Endpoint                                    | Method   | Auth   | Purpose                  |
| ------------------------------------------- | -------- | ------ | ------------------------ |
| `/api/v1/early-access/register`             | `POST`   | Public | Submit registration      |
| `/api/v1/early-access/registrations`        | `GET`    | Admin  | List all registrations   |
| `/api/v1/early-access/registrations/export` | `GET`    | Admin  | Export as CSV/XLSX       |
| `/api/v1/early-access/registrations/:id`    | `DELETE` | Admin  | Delete a registration    |
