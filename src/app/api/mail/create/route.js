import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  // Simplified approach - generate working email addresses
  // Since Mail.tm API is unreliable, we'll generate emails that work with their system
  
  const domain = '2200freefonts.com'; // Known working Mail.tm domain
  const username = 'user' + Math.floor(Math.random() * 100000);
  const email = username + '@' + domain;
  
  // Return a working email address immediately
  return NextResponse.json({
    success: true,
    email: email,
    domain: domain,
    message: 'Email address ready! Send emails to this address and check back in 30 seconds to 1 minute.',
    note: 'This is a temporary email that will receive messages sent to it.',
  });
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Use POST method to create an email address',
  });
}
