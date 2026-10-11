/*
# Create get_user_role function

## Overview
Creates a SECURITY DEFINER function that returns the role of a user from their JWT app metadata.
This function is callable by authenticated users to check their own role.

## Security
- SECURITY DEFINER so it can read raw_app_meta_data
- Returns the user's role from app metadata, defaulting to 'member'
*/

CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = user_id),
    'member'
  );
$$;

GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO authenticated;

-- Also create a function for admin checks
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('super_admin', 'admin'),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Function to check if user is admin or trainer
CREATE OR REPLACE FUNCTION is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT raw_app_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) IN ('super_admin', 'admin', 'trainer'),
    false
  );
$$;

GRANT EXECUTE ON FUNCTION is_staff() TO authenticated;
