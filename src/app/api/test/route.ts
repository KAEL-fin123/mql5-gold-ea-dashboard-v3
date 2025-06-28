import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'API测试成功',
    timestamp: new Date().toISOString(),
    status: 'ok'
  });
}
