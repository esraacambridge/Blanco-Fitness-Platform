/*
# Create a new administrator login

1. Purpose
- Creates a dedicated administrator account for the dashboard.
- Uses Supabase email/password authentication with a confirmed email.

2. New account
- Email: `admin@blancofitness.com`
- Password: `BlancoAdmin#2026`
- Role: `admin`

3. Modified data
- Adds the account to `auth.users` if it does not already exist.
- Adds its email identity to `auth.identities`.
- Adds the matching row to `public.profiles`.

4. Security
- The account role is stored in `raw_app_meta_data`, which is not user-editable metadata.
- No public access policies are changed.

5. Important notes
- The migration is idempotent and preserves the existing account if it already exists.
- The password is stored only as a bcrypt hash by PostgreSQL.
*/

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'admin@blancofitness.com'
  LIMIT 1;

  IF admin_user_id IS NULL THEN
    admin_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      admin_user_id,
      'authenticated',
      'authenticated',
      'admin@blancofitness.com',
      crypt('BlancoAdmin#2026', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
      '{"full_name":"Blanco Administrator","email_verified":true}'::jsonb
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('BlancoAdmin#2026', gen_salt('bf')),
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || '{"provider":"email","providers":["email"],"role":"admin"}'::jsonb,
        raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"full_name":"Blanco Administrator","email_verified":true}'::jsonb,
        updated_at = now()
    WHERE id = admin_user_id;
  END IF;

  INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, created_at, updated_at)
  SELECT admin_user_id::text,
         admin_user_id,
         jsonb_build_object(
           'sub', admin_user_id::text,
           'email', 'admin@blancofitness.com',
           'email_verified', true,
           'phone_verified', false
         ),
         'email',
         now(),
         now()
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.identities
    WHERE user_id = admin_user_id AND provider = 'email'
  );

  INSERT INTO public.profiles (id, email, full_name)
  VALUES (admin_user_id, 'admin@blancofitness.com', 'Blanco Administrator')
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      updated_at = now();
END $$;