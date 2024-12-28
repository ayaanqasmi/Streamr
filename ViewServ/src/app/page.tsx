'use client'
import Category from '@/components/Category'
import Video from '@/components/Video';
import { FetchApi } from '@/utils/fetchApi';
import React, { useEffect, useState } from 'react'

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Home');
  const [video, setVideo] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const data = await FetchApi(`search?part=snippet&q=${selectedCategory}`);
        const data = await fetch(process.env.NEXT_PUBLIC_STORAGE_API_BASE_URL+"api/storage/get-random")
        const vids = await data.json()
        console.log(vids);
        setVideo(vids);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [selectedCategory]);

  return (
    <main>
      <Category selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
      <Video videos={video} />
    </main>
  )
}

export default Home