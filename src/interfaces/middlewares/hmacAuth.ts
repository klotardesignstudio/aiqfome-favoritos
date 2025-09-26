import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';

const SIGNATURE_HEADER = 'x-hmac-signature';
const TIMESTAMP_HEADER = 'x-hmac-timestamp';

function computeSignature(secret: string, timestamp: string, rawBody: string): string {
  const payload = `${timestamp}:${rawBody ?? ''}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  return hmac.digest('hex');
}

export function hmacAuth(req: Request, res: Response, next: NextFunction): void {
  const providedSig = (req.header(SIGNATURE_HEADER) || '').toLowerCase();
  const timestamp = req.header(TIMESTAMP_HEADER) || '';

  if (!timestamp || !providedSig) {
    res.status(401).json({ error: { message: 'Missing HMAC headers', code: 'MISSING_HMAC' } });
    return;
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const tsNum = Number(timestamp);
  if (!Number.isFinite(tsNum) || Math.abs(nowSec - tsNum) > env.HMAC_TOLERANCE_SECONDS) {
    res.status(401).json({ error: { message: 'Timestamp out of tolerance', code: 'STALE_REQUEST' } });
    return;
  }

  const rawBody: string = (req as unknown as { rawBody?: string }).rawBody || '';
  const expectedSig = computeSignature(env.HMAC_SECRET, timestamp, rawBody);

  try {
    const isValid = crypto.timingSafeEqual(
      Buffer.from(providedSig, 'hex'),
      Buffer.from(expectedSig, 'hex')
    );
    if (!isValid) {
      res.status(401).json({ error: { message: 'Invalid signature', code: 'INVALID_SIGNATURE' } });
      return;
    }
  } catch {
    res.status(401).json({ error: { message: 'Invalid signature format', code: 'INVALID_SIGNATURE' } });
    return;
  }

  next();
}

export function signBody(body: string, secret: string, timestamp: string): string {
  return computeSignature(secret, timestamp, body);
}
