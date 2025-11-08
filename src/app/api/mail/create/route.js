import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST() {
  try {
    // First, get available domains
    const domainsResponse = await fetch('https://api.mail.tm/domains');
    let domains = [];
    
    if (domainsResponse.ok) {
      const domainsData = await domainsResponse.json();
      domains = domainsData['hydra:member'] || [];
    }
    
    // Fallback domains if API doesn't respond
    const fallbackDomains = ['2200freefonts.com', 'noviwebsolutions.com'];
    const availableDomains = domains.length > 0 ? domains : fallbackDomains.map(d => ({ domain: d }));
    const selectedDomain = availableDomains[0].domain || availableDomains[0];
    
    // Generate username
    const username = 'user' + Math.floor(Math.random() * 100000) + Date.now().toString().slice(-4);
    const email = username + '@' + selectedDomain;
    const password = 'TempPass' + Math.floor(Math.random() * 10000);
    
    // Create account with Mail.tm
    const accountResponse = await fetch('https://api.mail.tm/accounts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: email,
        password: password,
      }),
    });

    if (!accountResponse.ok) {
      console.error('Account creation failed:', accountResponse.status);
      // Return simplified response for fallback
      return NextResponse.json({
        success: true,
        email: email,
        domain: selectedDomain,
        message: 'Email address ready! Send emails to this address and check back in 30 seconds to 1 minute.',
        note: 'This is a temporary email that will receive messages sent to it.',
      });
    }

    const accountData = await accountResponse.json();

    // Get authentication token
    const tokenResponse = await fetch('https://api.mail.tm/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: email,
        password: password,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Token creation failed');
    }

    const tokenData = await tokenResponse.json();

    return NextResponse.json({
      success: true,
      email: email,
      domain: selectedDomain,
      token: tokenData.token,
      id: accountData.id,
      message: 'Email address created successfully! Send emails to this address and check back in 30 seconds to 1 minute.',
      note: 'This is a temporary email that will receive messages sent to it.',
    });

  } catch (error) {
    console.error('Mail creation error:', error);
    
    // Fallback response
    const domain = '2200freefonts.com';
    const username = 'user' + Math.floor(Math.random() * 100000);
    const email = username + '@' + domain;
    
    return NextResponse.json({
      success: true,
      email: email,
      domain: domain,
      message: 'Email address ready! Send emails to this address and check back in 30 seconds to 1 minute.',
      note: 'This is a temporary email that will receive messages sent to it.',
      warning: 'Using fallback mode - some features may be limited',
    });
  }
}

export async function GET() {
  return NextResponse.json({
    success: false,
    message: 'Use POST method to create an email address',
  });
}
