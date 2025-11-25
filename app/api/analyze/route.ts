import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { filename, size, type, duration } = body || {};

    const comments: { id: string, text: string }[] = [];
    const secs = typeof duration === 'number' && isFinite(duration) ? duration : null;

    // comments.push({ id: 'c1', text: `File: ${filename || 'unknown'} (${type || 'n/a'}, ${(size ?? 0)} bytes)` });

    if (secs != null) {
      // comments.push({ id: 'c2', text: `Detected video length: ${secs.toFixed(2)}s.` });
      if (secs < 1.0) {
        // comments.push({ id: 'c3', text: 'Clip is very short. Consider a longer clip capturing your full approach, takeoff, flight, and landing.' });
      } else if (secs < 3.0) {
        comments.push({ id: 'c3', text: 'Tip: Bend your dominant leg more on the penultimate step.' });
      } else {
        // comments.push({ id: 'c3', text: 'Good length for analysis. A side view at hip height often yields the best takeoff/landing timing.' });
      }
    } else {
      comments.push({ id: 'c2', text: 'Excellent improvement. Long strides and good execution on the final step.' });
    }

    if (filename && /\bslow\b|\b120fps\b|\b240fps\b/i.test(filename)) {
      comments.push({ id: 'c4', text: 'Slow-motion source detected — ideal for frame-accurate hang time.' });
    }

    // comments.push({ id: 'c5', text: 'Tip: Bend your knees more before jumping to generate more force under you.' });
    comments.push({ id: 'c5', text: 'Good jump!' });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
