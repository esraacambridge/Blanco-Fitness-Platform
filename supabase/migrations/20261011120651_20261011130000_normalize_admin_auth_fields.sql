/*
# Normalize administrator authentication fields

1. Purpose
- Repairs nullable token fields on administrator accounts that were created manually.
- Matches Supabase's normal email-user record format so password login can be processed reliably.

2. Modified records
- `auth.users` for the administrator accounts: fills email, recovery, and email-change token fields with empty values when absent.
- Ensures the email confirmation timestamp is populated.

3. Security
- Password hashes, user IDs, and roles are preserved.
- No access policies are changed.

4. Important notes
- The generated `confirmed_at` field is not modified directly.
- This migration changes only authentication bookkeeping fields.
- It is idempotent and safe to run again.
*/

UPDATE auth.users
SET confirmation_token = COALESCE(confirmation_token, ''),
    recovery_token = COALESCE(recovery_token, ''),
    email_change_token_new = COALESCE(email_change_token_new, ''),
    email_change_token_current = COALESCE(email_change_token_current, ''),
    email_change_confirm_status = COALESCE(email_change_confirm_status, 0),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email IN ('admin@blancofitness.com', 'adam@gmail.com');