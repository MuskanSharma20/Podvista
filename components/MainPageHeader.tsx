import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const MainPageHeader = () => {
  return (
    <section className='flex flex-col items-center text-center gap-4 px-4 md:px-8 pt-4 mt-7'>
      <div className="w-full max-w-3xl mx-auto rounded-2xl overflow-hidden border-4 border-orange-400 shadow-[0_0_40px_10px_rgba(255,255,255,0.39)]">

        <video
          src="/videos/podcastIntro.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full max-h-72 object-cover"
        />
      </div>

      <h1 className='mt-6 text-5xl md:text-6xl font-bold text-white-1'>
        Welcome to <span className="text-orange-1">PodVista</span>
      </h1>
      <p className='text-lg md:text-xl text-white-2 max-w-xl'>
        Bring your podcast to life with AI voice tools, stunning thumbnails, and a platform to listen, explore, and share.
      </p>

      {/* Buttons */}
      <div className="flex gap-4 mt-4">
        <Link href="/discover" className="flex items-center gap-2 px-6 py-3 bg-orange-1 text-white-1 font-semibold rounded-xl shadow hover:bg-orange-400 hover:text-white-1 transition">
          Get Started
          <Image
            src="/icons/discover.svg"
            alt="Arrow Icon"
            width={18}
            height={18}
          />
        </Link>
        <Link href="/create-podcast" className="flex items-center gap-2 px-6 py-3 bg-orange-1 text-white-1 font-semibold rounded-xl shadow hover:bg-orange-400 hover:text-white-1 transition">
          Create Podcast
          <Image
            src="/icons/microphone.svg"
            alt="Arrow Icon"
            width={18}
            height={18}
          />
        </Link>
      </div>

    </section>
  );
};

export default MainPageHeader;
