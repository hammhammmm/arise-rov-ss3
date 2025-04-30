import React, { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  voted: number;
};

export default function Predicted({ voted }: Props) {
  const [array, setArray] = useState<number[]>([1, 2, 3, 4]);

  // States for first, second, and third picks
  const [first, setFirst] = useState<number | null>(null);
  const [second, setSecond] = useState<number | null>(null);
  const [third, setThird] = useState<number | null>(null);

  useEffect(() => {
    let array = [1, 2, 3, 4];

    // Step 1: Pick 4
    const firstPick = voted;
    setFirst(firstPick);
    array = array.filter((num) => num !== firstPick);

    // Step 2: Random pick from remaining elements
    const secondPick = getRandomElement(array);
    setSecond(secondPick);
    array = array.filter((num) => num !== secondPick);

    // Step 3: Random pick from remaining elements
    const thirdPick = getRandomElement(array);
    setThird(thirdPick);
    array = array.filter((num) => num !== thirdPick);

    // Since there will be only one element left, we don't need to store it
  }, []);

  // Function to get a random element from an array
  const getRandomElement = (arr: number[]): number => {
    const randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  };
  return (
    <div className="relative">
      <div className="absolute -left-[50px] top-5 z-0 opacity-70">
        <div className="relative w-[200px] h-[200px]">
          <div className="not-voted-overlay"></div>
          <Image
            src={`/images/team/${second}.png`}
            alt=""
            width={200}
            height={200}
            className=" rounded-xl "
          />
        </div>
      </div>
      <div className="rounded-xl shadow-xl voted absolute z-10">
        <div className="voted-overlay flex justify-center items-center">
          <p className="text-3xl glow italic bold">VOTED</p>
        </div>
        <Image
          src={`/images/team/${first}.png`}
          alt=""
          width={250}
          height={250}
          className=" rounded-xl "
        />
      </div>
      <div className="absolute -right-[50px] top-5 z-0 opacity-70">
        <div className="relative w-[200px] h-[200px]">
          <div className="not-voted-overlay"></div>
          <Image
            src={`/images/team/${third}.png`}
            alt=""
            width={200}
            height={200}
            className=" rounded-xl "
          />
        </div>
      </div>
    </div>
  );
}
