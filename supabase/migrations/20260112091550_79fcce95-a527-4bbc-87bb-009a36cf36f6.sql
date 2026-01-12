-- Allow anyone to read invitation codes for validation during signup
CREATE POLICY "Anyone can validate invitation codes"
  ON public.invitation_codes
  FOR SELECT
  USING (is_active = true);