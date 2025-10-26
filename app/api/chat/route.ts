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

כל הטיסות יוצאות מנמל התעופה בן גוריון בתל אביב (TLV).

כאשר משתמש מבקש להזמין טיסה או רוצה לעבור לתשלום, צור קישור לדף התשלום בפורמט הבא:
[לחץ כאן להשלמת ההזמנה](/checkout?from=תל%20אביב&to=CITY&date=DATE&airline=AIRLINE&price=PRICE)

חשוב מאוד: אתה צריך לחשב ולהעריך את מחיר הטיסה בעצמך בהתאם ליעד. אל תשאל את המשתמש על המחיר!

הנחיות למחירים משוערים (בשקלים):
- יעדים קרובים (קפריסין, יון, טורקיה): 750-1,200 ₪
- אירופה (איטליה, ספרד, צרפת, בריטניה): 1,200-2,000 ₪
- אירופה המזרחית (פולין, רומניה, בולגריה): 800-1,400 ₪
- ארה״ב מזרחית (ניו יורק, בוסטון, מיאמי): 2,500-3,500 ₪
- ארה״ב מערבית (לוס אנג׳לס, סן פרנסיסקו): 3,000-4,200 ₪
- דרום אמריקה: 4,000-5,500 ₪
- דרום מזרח אסיה (תאילנד, וייטנאם): 2,800-3,800 ₪
- מזרח הרחוק (יפן, סין): 3,500-4,500 ₪
- אוסטרליה/ניו זילנד: 4,500-6,000 ₪
- אפריקה: 2,000-4,000 ₪ (תלוי במדינה)

התאם את המחיר בהתאם לעונה ולחברת התעופה. טיסות ישירות יקרות יותר מטיסות עם עצירות.

לדוגמה:
[לחץ כאן להשלמת ההזמנה](/checkout?from=תל%20אביב&to=ניו%20יורק&date=2025-03-15&airline=אל%20על&price=2900)

וודא שהמחיר הוא מספר בלבד (ללא סימנים), והתאריכים בפורמט YYYY-MM-DD.
אם המשתמש לא ציין תאריך, השתמש בתאריך סביר בעתיד הקרוב (2-4 שבועות מהיום).`
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
