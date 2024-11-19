'use client'
import { useState } from 'react';

interface ScrapedData {
  storeName: string;
  location: string;
  genres: string[];
  url: string;
}

export default function Home() {
  const [url, setUrl] = useState<string>('')
  const [data, setData] = useState<ScrapedData |null>(null)
  const [error, setError] = useState<string>('')

  const handleScrape = async () => {
    setError("")
    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      //スクレイピング失敗
      if (!res.ok) throw new Error("スクレイピング失敗")
      
      const result = await res.json()
      setData(result)
    }catch(error: unknown){
      if (error instanceof Error) {
        setError(error.message); 
      } else {
        setError("予期しないエラーが発生しました"); 
      }
    }
  }

  const handleAddToNotion = async () => {
    if(!data) return;
    try {
      const res = await fetch("/api/notion", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Notionへの追加失敗")
      alert('Notionに登録されました！')
    }catch(error: unknown){
      if (error instanceof Error) { 
        alert(error.message)
      } else { 
        alert("エラーが発生しました"); 
      }
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">食べログデータを取得</h1>
      <input
        type="text"
        className="border p-2 w-full mt-4 text-black"
        placeholder="食べログのURLを入力"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        onClick={handleScrape}
        className="bg-gray-700 rounded text-white py-2 px-3 mt-4 hover:bg-gray-600"
      >
        データ取得
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {data && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">取得結果</h2>
          <p>店名: {data.storeName}</p>
          <p>場所: {data.location}</p>
          <p>ジャンル: {data.genres.join(", ")}</p>
          <p>URL: <a href={data.url}>{data.url}</a></p>

          <button
            onClick={handleAddToNotion}
            className="bg-gray-700 rounded text-white py-2 px-3 mt-4 hover:bg-gray-600"
          >
            Notion に登録
          </button>
        </div>
      )}
    </div>
  )
}
