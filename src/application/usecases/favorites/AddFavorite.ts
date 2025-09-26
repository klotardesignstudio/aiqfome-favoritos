import { FavoriteRepository } from '../../../domain/repositories/FavoriteRepository';

export class AddFavorite {
  constructor(private readonly repo: FavoriteRepository) {}

  async execute(input: { userId: string; productId: number }): Promise<void> {
    if (!Number.isFinite(input.productId) || input.productId <= 0) {
      const err = new Error('Invalid productId') as Error & { status?: number; code?: string };
      err.status = 400;
      err.code = 'INVALID_PRODUCT_ID';
      throw err;
    }
    await this.repo.add(input.userId, input.productId);
  }
}
