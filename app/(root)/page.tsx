"use client";
import React from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MainPageHeader from '@/components/MainPageHeader';

const Home = () => {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts);

  return (
    <div className='mt-9 flex flex-col gap-9 md:overflow-hidden'>
      <section>
        <MainPageHeader />
      </section>
    </div>
  )
}

export default Home