'use client'
import { useState } from 'react';

//実行時に環境変数を取得
const DATABASE_DATE = process.env.DATABASE_DATE ?? 'default_database_date'
const DATABASE_WITH_FRIENDS = process.env.DATABASE_WITH_FRIENDS ?? 'default_database_with_friends'

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
  const [selectedDatabase, setSelectedDatabase] = useState<string>(DATABASE_DATE || "")

  //データベース選択
  const handleDatabase = () => {
    const newDatabase =
      selectedDatabase === DATABASE_DATE
        ? DATABASE_WITH_FRIENDS ?? ''
        : DATABASE_DATE ?? '';
    
    setSelectedDatabase(newDatabase);
    console.log('Selected Database:', newDatabase);  // Debugging: check if state is changing
  }
  

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
        body: JSON.stringify({ ...data, database_id: selectedDatabase }),
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
    <div className="px-4 pt-8">
      <div>
        <h1 className="text-2xl font-bold text-center">食べログデータ取得</h1>
        <div className='pt-4 pb-10 text-center text-gray-500'>食べログのURLからスクレイピングして、Notionのデータベースに登録する</div>
      </div>

      <div className="pl-4">
        <button
          onClick={handleDatabase}
          className={`px-4 py-2 rounded ${
            selectedDatabase === DATABASE_DATE
              ? 'bg-gray-700 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          デートにおすすめ
        </button>
        <button
          onClick={handleDatabase}
          className={`px-4 py-2 rounded ${
            selectedDatabase === DATABASE_WITH_FRIENDS
              ? 'bg-gray-700 text-white'
              : 'bg-gray-300 text-gray-700'
          }`}
        >
          みんなで行きたい！
        </button>
      </div>


      <div>
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
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {data && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">取得結果</h2>
          <p>店名: {data.storeName}</p>
          <p>場所: {data.location}</p>
          <p>ジャンル: {data.genres.join(", ")}</p>
          <p>URL: <a href={data.url}>{data.url}</a></p>
          <p className='hidden'>{DATABASE_DATE}</p>

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
