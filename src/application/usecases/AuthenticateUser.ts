import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordHasher } from '../ports/PasswordHasher';
import { TokenService } from '../ports/TokenService';

export type AuthenticateInput = { email: string; password: string };
export type AuthenticateOutput = { token: string };

export class AuthenticateUser {
  constructor(
    private readonly deps: { repo: UserRepository; hasher: PasswordHasher; tokens: TokenService }
  ) {}

  async execute(input: AuthenticateInput): Promise<AuthenticateOutput> {
    const user = await this.deps.repo.findByEmail(input.email.toLowerCase());
    if (!user) {
      const err = new Error('Invalid credentials') as Error & { status?: number; code?: string };
      err.status = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const ok = await this.deps.hasher.compare(input.password, user.passwordHash);
    if (!ok) {
      const err = new Error('Invalid credentials') as Error & { status?: number; code?: string };
      err.status = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    const token = this.deps.tokens.issue(user.id, 60 * 60 * 2); // 2h
    return { token };
  }
}
