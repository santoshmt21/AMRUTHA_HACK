import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import BioTrend from '@/app/models/BioTrend.js';
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
    const bioAge = Number(body?.bioAge);
    if (!Number.isFinite(bioAge)) {
      return NextResponse.json({ error: 'bioAge is required' }, { status: 400 });
    }

    await connectDB();
    const saved = await BioTrend.create({
      userId: payload.userId,
      bioAge,
      chronologicalAge: Number.isFinite(Number(body?.chronologicalAge)) ? Number(body.chronologicalAge) : undefined,
      ageDifference: Number.isFinite(Number(body?.ageDifference)) ? Number(body.ageDifference) : undefined,
      date: normalizeDate(body?.date),
    });

    return NextResponse.json({
      success: true,
      id: saved._id,
    }, { status: 201 });
  } catch (error) {
    console.error('BioTrend save error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
