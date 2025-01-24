import React from "react";
import * as Slider from "@radix-ui/react-slider";

interface ProgressSliderProps {
  progressRate: number;
  setProgressRate: (value: number) => void;
}

const ProgressSlider: React.FC<ProgressSliderProps> = ({ progressRate, setProgressRate }) => {
  return (
    <div>
      <label htmlFor="progress-slider" className=" text-white block mb-2">
        進捗率: {progressRate}%
      </label>
      <Slider.Root
        className="relative flex items-center w-full h-6"
        value={[progressRate]}
        onValueChange={(value) => setProgressRate(value[0])}
        max={100}
        step={1}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-4">
          <Slider.Range className="absolute bg-accent rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-6 h-6 bg-accent rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        />
      </Slider.Root>
    </div>
  );
};

export default ProgressSlider;
