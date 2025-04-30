import React from "react";

type Props = {};

export default function MissionCompleted({}: Props) {
  return (
    <>
      <div className=" h-[50px] bg-white max-w-[600px] w-full flex justify-center items-center rounded-lg relative">
        <div className="w-full relative h-[50px] rounded-lg">
          <div className="block-completed absolute top-0 rounded-lg"></div>
          <div className="absolute top-0 z-10 flex justify-center items-center w-full h-[50px] rounded-lg"
           style={{
            background: `url("/images/bg-predict.png") no-repeat`,
            backgroundSize: `cover`,
            width: "100%"
           }}>
            <p className=" text-xl bold uppercase italic text-white">
              All 3 Missions Completed!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
