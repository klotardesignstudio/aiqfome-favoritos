import crypto from 'crypto';
import { PasswordHasher } from '../../application/ports/PasswordHasher';

export class ScryptPasswordHasher implements PasswordHasher {
  private readonly keylen = 64;
  private readonly saltBytes = 16;
  private readonly N = 16384; // cost
  private readonly r = 8;
  private readonly p = 1;

  async hash(plain: string): Promise<string> {
    const salt = crypto.randomBytes(this.saltBytes).toString('hex');
    const derived = await scryptAsync(plain, salt, this.keylen, {
      N: this.N,
      r: this.r,
      p: this.p,
    });
    return `scrypt:${salt}:${derived.toString('hex')}`;
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const [algo, salt, hex] = hash.split(':');
    if (algo !== 'scrypt' || !salt || !hex) return false;
    const derived = await scryptAsync(plain, salt, this.keylen, {
      N: this.N,
      r: this.r,
      p: this.p,
    });
    try {
      return crypto.timingSafeEqual(Buffer.from(hex, 'hex'), Buffer.from(derived));
    } catch {
      return false;
    }
  }
}

function scryptAsync(
  password: string,
  salt: string,
  keylen: number,
  options: crypto.ScryptOptions
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, options, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey as Buffer);
    });
  });
}
