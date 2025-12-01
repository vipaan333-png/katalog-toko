// Type definitions for the application

export interface Product {
  $id: string;
  name: string;
  price: number;
  discount?: number;
  imageId?: string;
  category: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  $id: string;
  name: string;
  description?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface ProductFormData {
  name: string;
  price: number;
  discount?: number;
  category: string;
  imageFile?: File;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  total?: number;
}
