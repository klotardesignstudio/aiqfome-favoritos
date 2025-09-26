export interface ProductSummary {
  id: number;
  title: string;
  price: number;
  category: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  image: string;
}

export interface ProductCatalog {
  listAll(): Promise<ProductSummary[]>;
  getById(id: number): Promise<ProductDetail | null>;
}
