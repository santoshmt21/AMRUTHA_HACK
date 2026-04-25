import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/mongoose';
import User from '@/app/models/User.js';
import Profile from '@/app/models/Profile.js';
import { verifyToken } from '@/app/lib/auth.js';

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
    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profile = await Profile.findOne({ userId: user._id });

    return NextResponse.json({
      user: {
        ...user.toSafeObject(),
        ...(profile?.toObject?.() || {}),
      },
    }, { status: 200 });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
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
    await connectDB();

    const user = await User.findById(payload.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const profileFields = ['phone', 'dob', 'age', 'bloodType', 'allergies', 'sex', 'height', 'weight', 'bloodPressure', 'heartRate', 'bloodSugar'];
    const profileUpdate = {};
    for (const field of profileFields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        profileUpdate[field] = body[field];
      }
    }

    let profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      profile = await Profile.create({ userId: user._id, ...profileUpdate });
    } else {
      Object.assign(profile, profileUpdate);
      await profile.save();
    }

    return NextResponse.json({
      user: {
        ...user.toSafeObject(),
        ...profile.toObject(),
      },
    }, { status: 200 });
  } catch (error) {
    if (error?.code === 11000) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }
    console.error('Auth me update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
