import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, name, referralCode } = await req.json();

    // Generate a unique referral code for the new user
    const newUserReferralCode = generateUniqueReferralCode(name);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: await hash(password, 12),
        referralCode: newUserReferralCode,
        referredBy: referralCode || null,
      },
    });

    // If user was referred, create initial referral stats
    if (referralCode) {
      await prisma.referralStats.create({
        data: {
          userId: user.id,
          totalReferrals: 0,
          activeReferrals: 0,
        },
      });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        referralCode: user.referralCode,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateUniqueReferralCode(name: string): string {
  const prefix = name.slice(0, 3).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${random}`;
} 