import { NextResponse } from 'next/server';
import { queryOlowoOperator } from '@/lib/ai/operator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body.query;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query text required' }, { status: 400 });
    }

    const response = await queryOlowoOperator(query);
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process operator query' },
      { status: 500 }
    );
  }
}
