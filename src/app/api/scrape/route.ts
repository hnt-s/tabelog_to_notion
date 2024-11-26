import * as cheerio from "cheerio";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    //URLを取得
    const url = new URL(req.url).searchParams.get("url")
    if (!url || typeof url !== 'string'){
        return NextResponse.json({ error: "URLを指定してください" }, { status: 400 });
    }

    const response = await fetch(url)
    //htmlで取得
    const html = await response.text()
    const $ = cheerio.load(html)

    //店名を取得
    const storeName = $("h2.display-name").text().trim()

    //場所を取得
    const location = $("div.linktree__parent").text().split('[')[0].trim()

    //ジャンルを取得
    const genreTags = $("div.rdheader-subinfo dl").eq(1).find("span");
    const genres: string[] = genreTags.map((_, el) => $(el).text().trim()).get();

    //正常に取得できたときの処理
    return NextResponse.json({
        storeName,
        location,
        genres,
        url,
    });
}