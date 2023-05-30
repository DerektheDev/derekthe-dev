import { useState } from "react";
import ReactCardFlip from "react-card-flip";
import Slider from "react-slick";

import { data as greekData } from "../../data/greek-data";

export default function GreekCards() {
  const [isFlipped, setIsFlipped] = useState(false);

  const cardStyles = {
    className: "flex flex-col px-6 py-4 max-w-sm rounded overflow-hidden shadow-lg items-center border-gray-600 border-px h-screen justify-center",
  };

  var sliderSettings = {
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <main className="max-w-screen-lg mx-auto my-12 px-6 md:px-12">
      {/* <Slider {...sliderSettings}> */}
        {
          greekData.map((letter) => (
            <ReactCardFlip isFlipped={isFlipped} key={letter.name}>
              <div {...cardStyles} onClick={() => setIsFlipped(true)}>
                <p className="text-4xl">{letter.lower}</p>
              </div>
              <div {...cardStyles} onClick={() => setIsFlipped(false)}>
                <p className="text-4xl">{letter.name}</p>
              </div>
            </ReactCardFlip>
          ))
        }
      {/* </Slider> */}
    </main>
  );
}