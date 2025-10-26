import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Transcribe the audio using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'he', // Hebrew language
      response_format: 'json',
    })

    return NextResponse.json({
      text: transcription.text,
    })
  } catch (error: any) {
    console.error('Error in transcription API:', error)

    if (error?.error?.type === 'invalid_request_error') {
      return NextResponse.json(
        { error: 'Invalid API key or audio file. Please check your OpenAI API key.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to transcribe audio', details: error.message },
      { status: 500 }
    )
  }
}
