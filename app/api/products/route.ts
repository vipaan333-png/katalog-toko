import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const result = await getProducts(category, search);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, discount, category, imageId } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: name, price, category' },
        { status: 400 }
      );
    }

    const result = await createProduct({
      name,
      price,
      discount,
      category,
      imageId,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Product created successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, price, discount, category, imageId } = body;

    if (!id || !name || !price || !category) {
      return NextResponse.json(
        { error: 'Missing required fields: id, name, price, category' },
        { status: 400 }
      );
    }

    const result = await updateProduct(id, {
      name,
      price,
      discount,
      category,
      imageId,
    });

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Product updated successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing product id' },
        { status: 400 }
      );
    }

    const result = await deleteProduct(id);

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
