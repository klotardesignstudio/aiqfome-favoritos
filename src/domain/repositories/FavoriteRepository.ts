export interface FavoriteRepository {
  add(userId: string, productId: number): Promise<void>;
  remove(userId: string, productId: number): Promise<void>;
  list(userId: string): Promise<number[]>;
}
