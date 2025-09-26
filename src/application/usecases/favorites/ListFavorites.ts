import { FavoriteRepository } from '../../../domain/repositories/FavoriteRepository';

export class ListFavorites {
  constructor(private readonly repo: FavoriteRepository) {}

  async execute(input: { userId: string }): Promise<{ productIds: number[] }> {
    const items = await this.repo.list(input.userId);
    return { productIds: items };
  }
}
