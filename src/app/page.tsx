"use client";
import { setSong, setVideo } from "@/utils/store/mediaFileSchema";
import { IoCloudUploadOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { FaPhotoVideo } from "react-icons/fa";

import { LuMusic4 } from "react-icons/lu";

const Page = () => {
  const [files, setFiles] = useState({
    firstVideo: null as File | null,
    secondVideo: null as File | null,
    thirdVideo: null as File | null,
    forthVideo: null as File | null,
    song: null as File | null,
  });
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const baseString64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof files
  ) => {
    const file = e.target.files?.[0] || null;
    setFiles((prev) => ({ ...prev, [key]: file }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    const isMissingFile = Object.entries(files).some(([key, file]) => !file);
    if (isMissingFile) {
      return;
    }
    const mediaFilesVideo = {
      firstVideo: files.firstVideo
        ? await baseString64(files.firstVideo)
        : null,
      secondVideo: files.secondVideo
        ? await baseString64(files.secondVideo)
        : null,
      thirdVideo: files.thirdVideo
        ? await baseString64(files.thirdVideo)
        : null,
      forthVideo: files.forthVideo
        ? await baseString64(files.forthVideo)
        : null,
    };

    const mediaFilesSong = {
      song: files.song ? await baseString64(files.song) : null,
    };
    dispatch(setVideo(mediaFilesVideo));
    dispatch(setSong(mediaFilesSong));

    router.push("/videopage");
    setIsSubmit(false);
  };

  const inputs = [
    { key: "firstVideo", label: "First Video", accept: "video/*" },
    { key: "secondVideo", label: "Second Video", accept: "video/*" },
    { key: "thirdVideo", label: "Third Video", accept: "video/*" },
    { key: "forthVideo", label: "Forth Video", accept: "video/*" },
    { key: "song", label: "Choose Song", accept: "audio/*" },
  ] as const;

  return (
    <div className="bg-formBg bg-center bg-cover py-5 min-h-screen flex items-center justify-center">
      <div className="shadow-2xl shadow-black rounded-xl overflow-hidden w-full max-w-[280px] 481sm:max-w-[450px] sm:max-w-[550px] lg:max-w-[660px] xl:max-w-[700px] 2xl:max-w-[800px]">
        <div className="bg-gray-100 px-6 py-5 2xl:px-[50px]  shadow-lg w-full">
          <h2 className="text-2xl 2xl:text-3xl font-bold text-center text-[#b875df] mb-6">
            Upload video
          </h2>

          <form
            className="space-y-1 sm:space-y-4 flex  gap-5 w-full  flex-wrap items-center justify-center"
            onSubmit={handleSubmit}
          >
            {inputs.map(({ key, label, accept }) => (
              <div key={key}>
                <label className="block  text-gray-600  text-sm 2xl:text-lg mb-1 font-medium">
                  {label} <span className="text-red-700">*</span>
                </label>
                <input
                  type="file"
                  accept={accept}
                  id={key}
                  onChange={(e) => handleChange(e, key)}
                  className="hidden"
                />
                <div className="border w-full max-w-[185px] border-dashed flex px-10 py-3 rounded-lg flex-col items-center border-purple-300 text-purple-300 bg-gradient-to-bl from-pink-200/40 to-purple-100">
                  {!files[key] ? (
                    <label htmlFor={key} className="cursor-pointer">
                      <IoCloudUploadOutline size={50} />
                    </label>
                  ) : (
                    <div className="flex flex-col text-center items-center">
                      {key != "song" ? (
                        <FaPhotoVideo size={50} />
                      ) : (
                        <LuMusic4 size={50} />
                      )}
                      <p className="text-purple-500 px-2 text-base 2xl:text-lg text-center break-all line-clamp-1">
                        {files[key]?.name}
                      </p>
                    </div>
                  )}
                 {!files[key]&&(
                   <span className="text-purple-500 text-sm sm:text-base 2xl:text-lg text-center text-nowrap">
                    {(key!="song")?"Upload video":"Upload song"}
                  </span>
                 )}
                </div>
                {!files[key] && isSubmit && (
                  <p className="text-red-600 text-sm 2xl:text-xl text-center">
                    {" "}
                    Please select file
                  </p>
                )}
              </div>
            ))}

            <button
            role="button"
              type="submit"
              className="w-[220px]  481sm:w-[300px] sm:w-[400px] py-3 cursor-pointer bg-gradient-to-bl from-pink-300 to-purple-500 text-white rounded-lg font-semibold hover:bg-purple-800 transition duration-300"
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
