import { SignJWT } from 'jose'

const ACCOUNT_SID = import.meta.env.VITE_TWILIO_ACCOUNT_SID
const API_KEY_SID = import.meta.env.VITE_TWILIO_API_KEY_SID
const API_SECRET = import.meta.env.VITE_TWILIO_API_SECRET

export async function generateTwilioToken(identity: string, roomName: string): Promise<string> {
  const secret = new TextEncoder().encode(API_SECRET)
  const now = Math.floor(Date.now() / 1000)

  const token = await new SignJWT({
    jti: `${API_KEY_SID}-${now}`,
    iss: API_KEY_SID,
    sub: ACCOUNT_SID,
    grants: {
      identity,
      video: { room: roomName },
    },
  })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT', cty: 'twilio-fpa;v=1' })
    .setExpirationTime(now + 3600)
    .sign(secret)

  return token
}
