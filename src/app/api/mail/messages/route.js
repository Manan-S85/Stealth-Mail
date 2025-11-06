import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({
        success: false,
        error: 'Token is required',
      }, { status: 400 });
    }

    // Fetch messages from Mail.tm
    const messagesResponse = await fetch('https://api.mail.tm/messages', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Accept': 'application/json',
      },
    });

    if (!messagesResponse.ok) {
      throw new Error('Failed to fetch messages: ' + messagesResponse.status);
    }

    const messagesData = await messagesResponse.json();
    const messages = messagesData['hydra:member'] || [];

    // Format messages for frontend
    const formattedMessages = messages.map(message => ({
      id: message.id,
      from: message.from,
      to: message.to,
      subject: message.subject,
      createdAt: message.createdAt,
      hasAttachments: message.hasAttachments,
      isUnread: !message.seen,
    }));

    return NextResponse.json({
      success: true,
      messages: formattedMessages,
      count: formattedMessages.length,
    });

  } catch (error) {
    console.error('Messages API Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      messages: [],
    }, { status: 500 });
  }
}