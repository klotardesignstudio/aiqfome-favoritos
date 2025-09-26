import { ProductCatalog, ProductDetail, ProductSummary } from '../../application/ports/ProductCatalog';

const BASE = 'https://fakestoreapi.com';

export class FakeStoreProductCatalog implements ProductCatalog {
  async listAll(): Promise<ProductSummary[]> {
    const res = await fetch(`${BASE}/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = (await res.json()) as any[];
    return data.map((p) => ({ id: p.id, title: p.title, price: p.price, category: p.category }));
  }

  async getById(id: number): Promise<ProductDetail | null> {
    const res = await fetch(`${BASE}/products/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch product');
    const p = (await res.json()) as any;
    return { id: p.id, title: p.title, price: p.price, category: p.category, description: p.description, image: p.image };
  }
}
