"use client";
import React, { useEffect, useRef, useState } from "react";
import { LuCirclePause } from "react-icons/lu";
import { FaRegPlayCircle } from "react-icons/fa";
import { useSelector } from "react-redux";
import { BiLoader } from "react-icons/bi";

const VideoPage = () => {
  interface mediaFilesVideoType {
    firstVideo: string | null;
    secondVideo: string | null;
    thirdVideo: string | null;
    forthVideo: string | null;
  }
  interface mediaFilesSongType {
    song: string | null;
  }

  const [videos, setVideos] = useState<mediaFilesVideoType | null>(null);
  const [song, setSong] = useState<mediaFilesSongType | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isVideoPause, setIsVideoPause] = useState<boolean>(false);
  const [videoDurations, setVideoDurations] = useState<number[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const videosRef = useRef<HTMLVideoElement[]>([]);
  const songRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunks = useRef<Blob[]>([]);

  const selctoreVideoData = useSelector((store: any) => store?.mediaFile);

  useEffect(() => {
    if (selctoreVideoData) {
      setVideos(selctoreVideoData?.videos);
      setSong(selctoreVideoData?.song);
    }
  }, [selctoreVideoData]);

  const handleVideo = () => {
    if (isCompleted) {
      videosRef.current.forEach((video) => {
        video.currentTime = 0;
        video.play();
      });
      if (songRef.current) {
        songRef.current.currentTime = 0;
        songRef.current.play();
      }
      setIsCompleted(false);
      setIsVideoPause(false);
    } else {
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
    }
  };

  const maxVideoDuration = Math.max(...videoDurations);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !songRef.current) return;

    setIsLoading(true);
    videosRef.current.forEach((video) => {
      video.currentTime = 0;
      video.play();
    });
    songRef.current.currentTime = 0;
    songRef.current.play();

    const stream = canvas.captureStream(15);
    const audioContext = new AudioContext();
    const dest = audioContext.createMediaStreamDestination();

    const source = audioContext.createMediaElementSource(songRef.current);
    source.connect(dest);
    source.connect(audioContext.destination);

    const combinedStream = new MediaStream([
      ...stream.getTracks(),
      ...dest.stream.getTracks(),
    ]);

    recorderRef.current = new MediaRecorder(combinedStream, {
      mimeType: "video/webm;codecs=vp9,opus",
    });

    recordedChunks.current = [];
    recorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.current.push(e.data);
    };

    recorderRef.current.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsLoading(false);
    };

    recorderRef.current.start();

    const stopRecording = () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
    };

    setTimeout(stopRecording, maxVideoDuration * 1000);

    songRef.current.onended = stopRecording;
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      videosRef.current.forEach((video, i) => {
        if (video) {
          const row = Math.floor(i / 2);
          const col = i % 2;

          ctx.drawImage(
            video,
            (col * canvas.width) / 2,
            (row * canvas.height) / 2,
            canvas.width / 2,
            canvas.height / 2
          );
        }
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, [videos]);
  useEffect(() => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "final_video.webm";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadUrl(null);
    }
  }, [downloadUrl]);

  return (
    <div className="bg-gray-100 py-5 px-[10px] sm:px-5 xl:px-[60px] 2xl:px-[100px]">
      <canvas ref={canvasRef} width={480} height={360} className="hidden" />

      <div className="grid grid-cols-2 relative">
        {videos &&
          Object.values(videos).map((videoUrl, index) => (
            <video
              ref={(el) => {
                if (el) videosRef.current[index] = el;
              }}
              src={videoUrl || ""}
              autoPlay
              muted
              onLoadedMetadata={(e) => {
                const duration = Math.floor(e.currentTarget.duration);
                setVideoDurations((prev) => {
                  const newDurations = [...prev];
                  newDurations[index] = duration;
                  return newDurations;
                });
              }}
              onEnded={() => {
                const allEnded = videosRef.current.every(
                  (v) => v.ended || v.currentTime >= v.duration
                );

                if (allEnded) {
                  if (songRef.current) {
                    songRef.current.pause();
                    songRef.current.currentTime = 0;
                  }

                  if (recorderRef.current?.state === "recording") {
                    recorderRef.current.stop();
                  }

                  setIsVideoPause(true);
                  setIsCompleted(true);
                }
              }}
              key={index}
              className="w-full h-[260px] sm:h-[283px] object-cover"
            />
          ))}
        <button
          className="absolute text-white hover:block left-[44%] 481sm:left-[47%] lg:left-[48%] top-[45%] cursor-pointer"
          onClick={handleVideo}
        >
          {isVideoPause ? (
            <FaRegPlayCircle size={50} />
          ) : (
            <LuCirclePause size={50} />
          )}
        </button>
      </div>

      {Object.values(song || {}).map((songUrl, index) => (
        <audio ref={songRef} src={songUrl || ""} autoPlay key={index} />
      ))}

      <div className="mt-4  flex  flex-wrap items-center max-481sm:justify-center 481sm:items-start">
        <button
          disabled={isLoading}
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded flex gap-1 items-center justify-center"
        >
          <p className=" text-sm sm:text-base 2xl:text-lg">
            Start Recording & Download{" "}
          </p>
          {isLoading && (
            <p className="animate-spin w-fit">
              <BiLoader size={20} />
            </p>
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPage;
