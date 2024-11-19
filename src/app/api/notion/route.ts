import { NextRequest, NextResponse } from "next/server"

const NOTION_API_URL = "https://api.notion.com/v1/pages"
const NOTION_VERSION = "2022-06-28"
const NOTION_TOKEN = process.env.NOTION_TOKEN
const DATABASE_ID = process.env.DATABASE_ID

export async function POST(req: NextRequest) {

    const { storeName, location, genres, url } = await req.json()
    
    if (!storeName || !location || !url) {
        return NextResponse.json(
            { error: "読み込めないフィールドがあります" },
            { status: 400 }
        );
    }

    const response = await fetch(NOTION_API_URL, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${NOTION_TOKEN}`,
            "Content-Type": "application/json",
            "Notion-Version": NOTION_VERSION,
        },
        body: JSON.stringify({
            parent: { database_id: DATABASE_ID },
            properties: {
                店名: { title: [{ text: { content: storeName } }] },
                場所: { select: { name: location } },
                ジャンル: { multi_select: genres.map((genre: string) => ({ name: genre })) },
                URL: { url },
            },
        }),
    })

    if(!response.ok) {
        throw new Error(`${response.status}`)
    }

    return NextResponse.json({ message: 'データを登録しました' }, { status: 200 });
}