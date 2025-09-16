"use client";
import React, { useEffect, useRef, useState } from "react";
import { mediaFilesVideoType, mediaFilesSongType } from "../page";
import { LuCirclePause } from "react-icons/lu";
import { FaRegPlayCircle } from "react-icons/fa";
import { SiBoulanger } from "react-icons/si";
import { useSelector } from "react-redux";

const VideoPage = () => {
  const [videos, setVideos] = useState<mediaFilesVideoType | null>(null);
  const [song, setSong] = useState<mediaFilesSongType | null>(null);
  const videosRef = useRef<HTMLVideoElement[]>([]);
  const songRef = useRef<HTMLAudioElement>(null);
  const selctoreVideoData = useSelector((store) => store?.mediaFile);

  const [isVideoPause, setIsVideoPause] = useState<boolean>(false);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [songDuration, setSongDuration] = useState<number | null>(null);
  useEffect(() => {

    if (selctoreVideoData) {
      setVideos(selctoreVideoData?.videos);
      setSong(selctoreVideoData?.song);
    }
  }, [selctoreVideoData]);
  if (selctoreVideoData) {
    console.log(selctoreVideoData);
  }
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
console.log(videos)
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
