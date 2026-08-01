/**
 * Reads the JWT access token payload without verifying the signature.
 * Used only to recover the authenticated user's id after login/register.
 */
export const getUserIdFromToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payloadSegment = token.split('.')[1];
    const payload = JSON.parse(atob(payloadSegment));
    return payload.user_id ?? null;
  } catch {
    return null;
  }
};
