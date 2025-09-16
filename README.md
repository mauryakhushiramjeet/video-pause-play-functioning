This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




<!-- video page -->
"use client";
import React, { useEffect, useRef, useState } from "react";
import { mediaFilesVideoType, mediaFilesSongType } from "../page";
import { LuCirclePause } from "react-icons/lu";
import { FaRegPlayCircle } from "react-icons/fa";
import { SiBoulanger } from "react-icons/si";

const VideoPage = () => {
  const [videos, setVideos] = useState<mediaFilesVideoType | null>(null);
  const [song, setSong] = useState<mediaFilesSongType | null>(null);
  const videosRef = useRef<HTMLVideoElement[]>([]);
  const songRef = useRef<HTMLAudioElement>(null);
  const [isVideoPause, setIsVideoPause] = useState<boolean>(false);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [songDuration, setSongDuration] = useState<number | null>(null);
  useEffect(() => {
    const files = localStorage.getItem("meadiaFiles");
    const medialFilesData = files ? JSON.parse(files) : null;
    console.log(medialFilesData);
    if (medialFilesData) {
      setVideos(medialFilesData?.mediaFilesVideo);
      setSong(medialFilesData?.mediaFilesSong);
    }
  }, []);
  console.log(videos);
  const handleVideo = () => {
    setIsVideoPause((prev) => {
      if (!prev) {
        videosRef.current.forEach((video) => video.pause());
        songRef.current?.pause();
      } else {
        videosRef.current.forEach((video) => video.play());
        songRef.current?.play();
      }
      return !prev;
    });
  };
  const maxVideoDuration = Math.max(...videoDurations);
  console.log(maxVideoDuration);

  return (
    <div className="bg-gray-100 py-5 px-20">
      <div className="flex flex-wrap items-center justify-center gap-[50px] border relative">
        {videos &&
          Object.values(videos).map((videoUrl, index) => (
            <video
              ref={(el) => {
                if (el) videosRef.current[index] = el;
              }}
              src={videoUrl}
              muted
              playsInline
              controls
              autoPlay
              onLoadedMetadata={(e) => {
                const duration = Math.floor(e.currentTarget.duration);
                console.log(`Video ${index} duration: ${duration} seconds`);
                setVideoDurations((prev) => {
                  const newDurations = [...prev];
                  newDurations[index] = duration;
                  return newDurations;
                });
              }}
              key={index}
              className="w-[550px] h-[300px] border border-black object-cover"
            />
          ))}
        <button
          className="absolute cursor-pointer"
          onClick={() => {
            handleVideo();
          }}
        >
          {isVideoPause ? (
            <FaRegPlayCircle size={50} />
          ) : (
            <LuCirclePause size={50} />
          )}
        </button>
      </div>
      {Object.values(song || {}).map((songUrl, index) => (
        <audio
          ref={songRef}
          src={songUrl}
          controls
          autoPlay
          onTimeUpdate={(e) => {
            const currentTimeVideo = e.currentTarget.currentTime;
            if (currentTimeVideo >= maxVideoDuration) {
              e.currentTarget.pause();
              console.log(
                "Song paused because it reached max video duration",
                currentTimeVideo
              );
            }
          }}
          key={index}
          className="w-full my-2"
        />
      ))}
    </div>
  );
};

export default VideoPage;

<!-- page -->
"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
export interface mediaFilesVideoType {
  firstVideo: string | null;
  secondVideo: string | null;
  thirdVideo: string | null;
  forthVideo: string | null;
}
export interface mediaFilesSongType {
  song: string | null;
}
const Page = () => {
  const firstVideoRef = useRef<HTMLInputElement>(null);
  const secondVideoRef = useRef<HTMLInputElement>(null);
  const thirdVideoRef = useRef<HTMLInputElement>(null);
  const fourthVideoRef = useRef<HTMLInputElement>(null);
  const songRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstVideo = firstVideoRef?.current?.files?.[0];
    const secondVideo = secondVideoRef?.current?.files?.[0];
    const thirdVideo = thirdVideoRef?.current?.files?.[0];
    const forthVideo = fourthVideoRef?.current?.files?.[0];
    const song = songRef.current?.files?.[0];

    console.log("first");
    const mediaFilesVideo: mediaFilesVideoType = {
      firstVideo: firstVideo ? URL.createObjectURL(firstVideo) : null,

      secondVideo: secondVideo ? URL.createObjectURL(secondVideo) : null,

      thirdVideo: thirdVideo ? URL.createObjectURL(thirdVideo) : null,
      forthVideo: forthVideo ? URL.createObjectURL(forthVideo) : null,
    };
    const mediaFilesSong: mediaFilesSongType = {
      song: song ? URL.createObjectURL(song) : null,
    };

    const mediaFiles = {
      mediaFilesVideo,
      mediaFilesSong,
    };
    console.log(mediaFiles);
    router.push("/videopage");
    localStorage.setItem("meadiaFiles", JSON.stringify(mediaFiles));
  };


  return (
    <div className="bg-formBg bg-center bg-cover h-screen flex items-center justify-center">
      <div className="flex shadow-2xl shadow-black rounded-xl overflow-hidden">
        <div>
          <Image
            src="/images/flower.jpg"
            alt="flower"
            height={478}
            width={289}
            className="object-conatain h-full opacity-35"
          />
        </div>
        <div className="bg-gray-100 px-6 py-5 shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center text-[#b875df] mb-6">
            Upload video
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[#b875df] text-sm mb-1">
                Fist video{" "}
              </label>
              <input
                ref={firstVideoRef}
                type="file"
                accept="video/*"
                placeholder="Choose first video"
                required
                className="w-full  text-sm text-gray-500 px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none "
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block  text-sm text-[#b875df]  mb-1"
              >
                Second video{" "}
              </label>
              <input
                ref={secondVideoRef}
                type="file"
                accept="video/*"
                placeholder="Choose second video"
                required
                className="w-full text-gray-500 text-sm px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none "
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block   text-[#b875df]  text-sm  mb-1"
              >
                Third video{" "}
              </label>
              <input
                ref={thirdVideoRef}
                type="file"
                accept="video/*"
                placeholder="Choose third video"
                required
                className="w-full text-sm  text-gray-500 px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none "
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-[#b875df] text-sm mb-1"
              >
                Forth video{" "}
              </label>
              <input
                ref={fourthVideoRef}
                type="file"
                accept="video/*"
                placeholder="Choose forth video"
                required
                className="w-full text-sm px-4 py-2 text-gray-500 border-2 border-purple-300 rounded-lg focus:outline-none "
              />
            </div>
            <div>
              <label className="block text-[#b875df] text-sm mb-1">Song</label>
              <input
                ref={songRef}
                type="file"
                placeholder="Enter password"
                accept="audio/mp3"
                required
                className="w-full text-sm px-4 py-2 text-gray-500 border-2 border-purple-300 rounded-lg focus:outline-none "
              />
            </div>

            
            <button
              type="submit"
              className="w-full  py-3 cursor-pointer bg-purple-400 text-white rounded-lg font-semibold hover:bg-purple-800 transition duration-300"
            >
              Processing
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
