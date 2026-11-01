import { ImageResponse } from 'next/og'

export const alt = 'FoodAi'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 96, background: '#d92d20', color: 'white' }}>
                <div style={{ fontSize: 112, fontWeight: 800 }}>FoodAi</div>
                <div style={{ fontSize: 48, marginTop: 24 }}>Vertaile alennettuja ruokatarjouksia</div>
            </div>
        ),
        size,
    )
}
