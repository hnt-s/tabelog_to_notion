import { NextRequest, NextResponse } from "next/server"

const NOTION_API_URL = "https://api.notion.com/v1/pages"
const NOTION_VERSION = "2022-06-28"
const NOTION_TOKEN = process.env.NOTION_TOKEN
const DATABASE_DATE = process.env.DATABASE_DATE
const DATABASE_WITH_FRIENDS = process.env.DATABASE_WITH_FRIENDS

export async function POST(req: NextRequest) {
  const { storeName, location, genres, url, memo, database_id } = await req.json()

  //ジャンルなしは許容
  if (!storeName || !location || !url) {
    return NextResponse.json(
      { error: "読み込めないフィールドがあります" },
      { status: 400 }
    )
  }

  // 選択されたデータベースIDに応じて、対応するデータベースIDを設定
  let selectedDatabaseId = ''
  if (database_id === 'DATABASE_DATE') {
    selectedDatabaseId = DATABASE_DATE!
  } else if (database_id === 'DATABASE_WITH_FRIENDS') {
    selectedDatabaseId = DATABASE_WITH_FRIENDS!
  } else {
    return NextResponse.json(
      { error: "無効なデータベースIDです" },
      { status: 400 }
    )
  }

  // Notion APIにリクエストを送信
  const response = await fetch(NOTION_API_URL, {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: selectedDatabaseId }, // 選択されたデータベースIDを使用
      properties: {
        店名: { title: [{ text: { content: storeName } }] },
        場所: { select: { name: location } },
        ジャンル: { multi_select: genres.map((genre: string) => ({ name: genre })) },
        URL: { url },
        メモ: { rich_text: [{ text: { content: memo } }] },
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`${response.status}`)
  }

  return NextResponse.json({ message: "データを登録しました" }, { status: 200 })
}
