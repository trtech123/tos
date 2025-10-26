import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      )
    }

    // Create a chat completion with ChatGPT
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // or 'gpt-4o' for more advanced responses
      messages: [
        {
          role: 'system',
          content: `אתה עוזר טיסות חכם ומועיל לאתר טוס תיירות. אתה עוזר למשתמשים למצוא טיסות, מלונות, וחבילות נופש.
אתה מדבר בעברית, נעים, וידידותי. אתה יכול לעזור עם:
- חיפוש טיסות
- המלצות על יעדים
- טיפים לנסיעות
- מידע על חברות תעופה
- עזרה בהזמנות
השתמש בשפה פשוטה וברורה, והיה תמיד מועיל ומקצועי.

כאשר משתמש מבקש להזמין טיסה או רוצה לעבור לתשלום, צור קישור לדף התשלום בפורמט הבא:
[לחץ כאן להשלמת ההזמנה](/checkout?from=CITY&to=CITY&date=DATE&airline=AIRLINE&price=PRICE)

לדוגמה:
[לחץ כאן להשלמת ההזמנה](/checkout?from=תל%20אביב&to=ניו%20יורק&date=2024-03-15&airline=אל%20על&price=2500)

וודא שהמחיר הוא מספר בלבד (ללא סימנים), והתאריכים בפורמט YYYY-MM-DD.`
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const assistantMessage = completion.choices[0]?.message

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: assistantMessage.content,
      role: assistantMessage.role,
    })
  } catch (error: any) {
    console.error('Error in chat API:', error)

    if (error?.error?.type === 'invalid_request_error') {
      return NextResponse.json(
        { error: 'Invalid API key or request. Please check your OpenAI API key.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to process chat request', details: error.message },
      { status: 500 }
    )
  }
}
