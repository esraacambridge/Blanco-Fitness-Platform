/*
# Repair null authentication fields

1. Purpose
- Fixes the manual administrator records that contain NULL values in text fields required by the Supabase Auth service.
- Prevents the Auth API from returning `Database error querying schema` during password login.

2. Modified records
- `auth.users` for the administrator accounts: fills nullable text fields with empty strings where Auth expects a string.
- Sets the optional super-admin flag to false when it was not initialized.

3. Security
- Existing passwords, user IDs, email addresses, confirmation state, and admin roles are preserved.
- No public tables or access policies are changed.

4. Important notes
- Nullable timestamps, phone values, and deletion fields remain untouched because NULL is valid for those fields.
- This migration is idempotent and safe to run again.
*/

UPDATE auth.users
SET email_change = COALESCE(email_change, ''),
    phone_change = COALESCE(phone_change, ''),
    phone_change_token = COALESCE(phone_change_token, ''),
    reauthentication_token = COALESCE(reauthentication_token, ''),
    is_super_admin = COALESCE(is_super_admin, false),
    updated_at = now()
WHERE email IN ('admin@blancofitness.com', 'adam@gmail.com');