import crypto from 'crypto';
import { TokenPayload, TokenService } from '../../application/ports/TokenService';
import { env } from '../../config/env';

function base64url(input: Buffer | string): string {
  const b64 = (input instanceof Buffer ? input : Buffer.from(input))
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return b64;
}

function hmac(data: string, secret: string): string {
  return base64url(crypto.createHmac('sha256', secret).update(data).digest());
}

export class HmacTokenService implements TokenService {
  issue(subject: string, ttlSeconds: number): string {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + ttlSeconds;
    const payload: TokenPayload = { sub: subject, iat, exp };
    const payloadJson = JSON.stringify(payload);
    const sig = hmac(payloadJson, env.HMAC_SECRET);
    return `${base64url(payloadJson)}.${sig}`;
  }

  verify(token: string): TokenPayload | null {
    const [payloadB64, sig] = token.split('.');
    if (!payloadB64 || !sig) return null;
    try {
      const payloadJson = Buffer.from(payloadB64.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
      const expectedSig = hmac(payloadJson, env.HMAC_SECRET);
      const valid = crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig));
      if (!valid) return null;
      const payload = JSON.parse(payloadJson) as TokenPayload;
      if (payload.exp < Math.floor(Date.now() / 1000)) return null;
      return payload;
    } catch {
      return null;
    }
  }
}
