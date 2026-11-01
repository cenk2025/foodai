import { NextResponse } from 'next/server'
import { getAdminUserId } from '@/lib/admin-auth'
import { isAiConfigured, probeModels } from '@/lib/ai/nvidia'
import { buildIntentPrompt } from '@/lib/ai/search-intent'

export const maxDuration = 60

const CANDIDATES = [
    'google/gemma-4-31b-it',
    'google/gemma-3-12b-it',
    'mistralai/mistral-large-2-instruct',
    'mistralai/mistral-large-4-1t-a52b',
    'mistralai/mistral-7b-instruct-v0.3',
    'nv-mistralai/mistral-nemo-12b-instruct',
    'nvidia/nemotron-3-super-120b-a12b',
    'nvidia/nemotron-3.5-lightning-30b-a3b',
    'nvidia/nemotron-nano-3-30b-a3b',
    'nvidia/llama-3.1-nemotron-70b-instruct',
    'nvidia/llama-3.1-nemotron-51b-instruct',
    'deepseek-ai/deepseek-v4.1-flash',
    'openai/gpt-oss-20b',
    'z-ai/glm-5.3-flash',
    'minimaxai/minimax-m3.1-flash',
    'moonshotai/kimi-k2.6',
    'ibm/granite-3.0-8b-instruct',
]

// GET /api/admin/ai-models (admin session required): tests which models the
// configured NVIDIA key can use, with latency and a sample answer.
export async function GET() {
    if (!(await getAdminUserId())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!isAiConfigured()) return NextResponse.json({ error: 'NVIDIA_API_KEY is not set' }, { status: 503 })

    const results = await probeModels(CANDIDATES, [
        { role: 'system', content: buildIntentPrompt(['Helsinki', 'Espoo', 'Tampere']) },
        { role: 'user', content: 'halpa vegaaninen pizza alle 10 € Kampissa ilmaisella kotiinkuljetuksella' },
    ])
    return NextResponse.json({ configuredModel: process.env.AI_MODEL ?? null, results })
}
