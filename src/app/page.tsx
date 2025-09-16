"use client";
import { setSong, setVideo } from "@/utils/store/mediaFileSchema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { useDispatch} from "react-redux";
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
  const dispatch = useDispatch();
  const baseString64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const firstVideo = firstVideoRef?.current?.files?.[0];
    const secondVideo = secondVideoRef?.current?.files?.[0];
    const thirdVideo = thirdVideoRef?.current?.files?.[0];
    const forthVideo = fourthVideoRef?.current?.files?.[0];
    const song = songRef.current?.files?.[0];

    const mediaFilesVideo: mediaFilesVideoType = {
      firstVideo: firstVideo ? await baseString64(firstVideo) : null,

      secondVideo: secondVideo ? await baseString64(secondVideo) : null,

      thirdVideo: thirdVideo ? await baseString64(thirdVideo) : null,
      forthVideo: forthVideo ? await baseString64(forthVideo) : null,
    };
    const mediaFilesSong: mediaFilesSongType = {
      song: song ? await baseString64(song) : null,
    };

    const mediaFiles = {
      mediaFilesVideo,
      mediaFilesSong,
    };
    console.log(mediaFiles)
    dispatch(setVideo(mediaFilesVideo));
    dispatch(setSong(mediaFilesSong));
    router.push("/videopage");
    // localStorage.setItem("meadiaFiles", JSON.stringify(mediaFiles));
    console.log(mediaFilesVideo.firstVideo?.substring(0, 100));

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
