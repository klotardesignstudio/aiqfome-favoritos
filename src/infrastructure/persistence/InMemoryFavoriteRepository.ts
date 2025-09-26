import { FavoriteRepository } from '../../domain/repositories/FavoriteRepository';

export class InMemoryFavoriteRepository implements FavoriteRepository {
  private readonly map = new Map<string, Set<number>>();

  async add(userId: string, productId: number): Promise<void> {
    const set = this.map.get(userId) ?? new Set<number>();
    set.add(productId);
    this.map.set(userId, set);
  }

  async remove(userId: string, productId: number): Promise<void> {
    const set = this.map.get(userId);
    if (!set) return;
    set.delete(productId);
  }

  async list(userId: string): Promise<number[]> {
    const set = this.map.get(userId);
    return set ? Array.from(set.values()) : [];
  }
}
