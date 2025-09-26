export interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

export interface TokenService {
  issue(subject: string, ttlSeconds: number): string;
  verify(token: string): TokenPayload | null;
}
