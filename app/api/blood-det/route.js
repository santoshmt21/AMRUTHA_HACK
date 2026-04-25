import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import BloodDet from '@/app/models/BloodDet.js';
import { verifyToken } from '@/app/lib/auth.js';

function normalizeDate(dateInput) {
  if (!dateInput) return new Date();
  const parsed = new Date(dateInput);
  if (Number.isNaN(parsed.getTime())) return new Date();
  return parsed;
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const parameters = Array.isArray(body?.parameters) ? body.parameters : [];
    if (parameters.length === 0) {
      return NextResponse.json({ error: 'No parameters to store' }, { status: 400 });
    }

    const fallbackDate = normalizeDate(body?.date);
    const rows = parameters
      .map((item) => ({
        userId: payload.userId,
        name: String(item?.name || '').trim(),
        value: String(item?.value ?? '').trim(),
        date: normalizeDate(item?.date || fallbackDate),
      }))
      .filter((item) => item.name && item.value);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'No valid parameter rows to store' }, { status: 400 });
    }

    await connectDB();
    const inserted = await BloodDet.insertMany(rows);

    return NextResponse.json({
      success: true,
      stored: inserted.length,
    }, { status: 201 });
  } catch (error) {
    console.error('BloodDet save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    await connectDB();
    const rows = await BloodDet.find({ userId: payload.userId })
      .sort({ date: -1, createdAt: -1 })
      .lean();

    return NextResponse.json({ rows }, { status: 200 });
  } catch (error) {
    console.error('BloodDet fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
