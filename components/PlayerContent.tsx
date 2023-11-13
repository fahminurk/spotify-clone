"use client";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import { motion } from "framer-motion";

import { Song } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./ui/LikeButton";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";

interface PlayerContentProps {
  songUrl: string;
  song: Song;
}
const PlayerContent: React.FC<PlayerContentProps> = ({ song, songUrl }) => {
  const player = usePlayer();
  const [volume, setVolume] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  const onPlayNext = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const nextSong = player.ids[currentIndex + 1];

    if (!nextSong) return player.setId(player.ids[0]);

    player.setId(nextSong);
  };
  const onPlayPrevious = () => {
    if (player.ids.length === 0) return;

    const currentIndex = player.ids.findIndex((id) => id === player.activeId);
    const previousSong = player.ids[currentIndex - 1];

    if (!previousSong) return player.setId(player.ids[player.ids.length - 1]);

    player.setId(previousSong);
  };

  const [play, { pause, sound }] = useSound(songUrl, {
    volume: volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      onPlayNext();
    },
    onpause: () => setIsPlaying(false),
    format: ["mp3"],
  });

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  const handlePlay = () => {
    if (!isPlaying) {
      play();
    } else {
      pause();
    }
  };

  const toggleMute = () => (volume === 0 ? setVolume(1) : setVolume(0));

  return (
    <div className="flex flex-col">
      <div className="flex md:hidden overflow-hidden">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100vw" }}
          transition={{ duration: 7, ease: "linear", repeat: Infinity }}
          className="flex items-center"
        >
          <p className="font-bold">{song.title}</p>
          <p className="px-2">•</p>
          <p className="text-neutral-400 text-xs">{song.author}</p>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 h-full">
        <div className="flex w-full">
          <div className="flex items-center gap-x-4">
            <MediaItem data={song} className="hidden" />
            <LikeButton songId={song.id} />
          </div>
        </div>
        <div className="flex gap-1 md:hidden col-auto w-full justify-end items-center">
          <div
            onClick={onPlayPrevious}
            className="h-9 w-9 flex items-center justify-center bg-white p-1 cursor-pointer rounded-full"
          >
            <AiFillStepBackward size={30} className="text-black" />
          </div>
          <div
            onClick={onPlayNext}
            className="h-9 w-9 flex items-center justify-center bg-white p-1 cursor-pointer rounded-full"
          >
            <AiFillStepForward size={30} className="text-black" />
          </div>
          <div
            onClick={handlePlay}
            className="h-10 w-10 flex items-center justify-center bg-green-400 p-1 cursor-pointer rounded-full"
          >
            <Icon size={30} className="text-black" />
          </div>
        </div>
        <div className="hidden h-full md:flex justify-center items-center w-full max-w-[722px] gap-x-6">
          <AiFillStepBackward
            onClick={onPlayPrevious}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
          <div
            onClick={handlePlay}
            className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-1 cursor-pointer"
          >
            <Icon size={30} className="text-black" />
          </div>
          <AiFillStepForward
            onClick={onPlayNext}
            size={30}
            className="text-neutral-400 cursor-pointer hover:text-white transition"
          />
        </div>
        <div className="hidden md:flex w-full justify-end pr-2">
          <div className="flex items-center gap-x-2 w-[120px]">
            <VolumeIcon
              onClick={toggleMute}
              size={30}
              className="cursor-pointer"
            />
            <Slider value={volume} onChange={(value) => setVolume(value)} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerContent;
