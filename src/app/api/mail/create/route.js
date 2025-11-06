import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    let domain = '2200freefonts.com'; // Default known working domain
    
    // Try to get available domains from Mail.tm
    try {
      const domainsResponse = await fetch('https://api.mail.tm/domains', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Stealth-Mail/1.0',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (domainsResponse.ok) {
        const domainsData = await domainsResponse.json();
        const availableDomains = domainsData['hydra:member'] || [];
        if (availableDomains.length > 0) {
          domain = availableDomains[0].domain;
        }
      }
    } catch (domainError) {
      console.log('Using fallback domain due to:', domainError.message);
      // Continue with fallback domain
    }
    const username = 'user' + Math.floor(Math.random() * 100000);
    const email = username + '@' + domain;
    const password = 'temp' + Math.floor(Math.random() * 10000);

    // Create account
    const createAccountResponse = await fetch('https://api.mail.tm/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Stealth-Mail/1.0',
      },
      body: JSON.stringify({
        address: email,
        password: password,
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!createAccountResponse.ok) {
      const errorText = await createAccountResponse.text();
      throw new Error('Failed to create account: ' + createAccountResponse.status);
    }

    const accountData = await createAccountResponse.json();

    // Get auth token
    const authResponse = await fetch('https://api.mail.tm/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Stealth-Mail/1.0',
      },
      body: JSON.stringify({
        address: email,
        password: password,
      }),
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!authResponse.ok) {
      throw new Error('Failed to get auth token: ' + authResponse.status);
    }

    const authData = await authResponse.json();

    return NextResponse.json({
      success: true,
      email: accountData.address,
      token: authData.token,
      id: accountData.id,
      domain: domain,
      message: 'Email account created successfully! Messages may take 30 seconds to 1 minute to arrive.',
    });

  } catch (error) {
    console.error('Mail API Error:', error);

    // Fallback response with fake email for testing
    const fallbackDomain = '2200freefonts.com';
    const fallbackEmail = 'user' + Math.floor(Math.random() * 100000) + '@' + fallbackDomain;

    return NextResponse.json({
      success: false,
      error: error.message,
      fallback: {
        email: fallbackEmail,
        domain: fallbackDomain,
        message: 'Using fallback email. Mail.tm service might be temporarily unavailable.',
      },
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Mail API is running',
    endpoint: '/api/mail/create',
    method: 'POST',
  });
}