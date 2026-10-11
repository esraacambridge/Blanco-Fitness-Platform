/*
# Repair admin authentication identity

1. Purpose
- Repairs the existing administrator account so Supabase email/password authentication can resolve it correctly.
- Adds the missing email identity for `adam@gmail.com` without deleting or replacing the existing user.

2. Modified records
- `auth.users` for `adam@gmail.com`: ensures email-provider metadata is present.
- `auth.identities`: adds one email identity linked to the existing administrator user.

3. Security
- No new public tables or access policies are created.
- The identity is linked only to the already-existing administrator UUID.

4. Important notes
- This migration is idempotent and safe to run again.
- Existing password, user ID, role, and profile data are preserved.
*/

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'adam@gmail.com'
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    UPDATE auth.users
    SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"provider":"email","providers":["email"]}'::jsonb,
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"email_verified":true}'::jsonb,
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
    WHERE id = admin_user_id;

    INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
    SELECT admin_user_id::text,
           admin_user_id,
           jsonb_build_object(
             'sub', admin_user_id::text,
             'email', 'adam@gmail.com',
             'email_verified', true,
             'phone_verified', false
           ),
           'email',
           now(),
           now()
    WHERE NOT EXISTS (
      SELECT 1
      FROM auth.identities
      WHERE user_id = admin_user_id
        AND provider = 'email'
    );
  END IF;
END $$;