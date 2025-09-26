import { UserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { PasswordHasher } from '../ports/PasswordHasher';

export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};

export type CreateUserOutput = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export class CreateUser {
  constructor(private readonly deps: { repo: UserRepository; hasher: PasswordHasher }) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    const exists = await this.deps.repo.findByEmail(input.email.toLowerCase());
    if (exists) {
      const err = new Error('Email already in use') as Error & { status?: number; code?: string };
      err.status = 409;
      err.code = 'EMAIL_TAKEN';
      throw err;
    }

    const passwordHash = await this.deps.hasher.hash(input.password);
    const now = new Date();

    const user: User = {
      id: cryptoRandomId(),
      name: input.name,
      email: input.email.toLowerCase(),
      passwordHash,
      createdAt: now,
    };

    await this.deps.repo.create(user);

    return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt };
  }
}

function cryptoRandomId(): string {
  // Use Web Crypto if available (Node 20+)
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  // Fallback
  const rnd = Math.random().toString(36).slice(2);
  const ts = Date.now().toString(36);
  return `usr_${ts}_${rnd}`;
}
