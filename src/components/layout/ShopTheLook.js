import { useState } from "react";

import { Play } from "lucide-react";

import ReelsViewer from "./ReelsViewer";

import "../../css/shopthelook.css";

// TEMP VIDEOS

import video1 from "../../assets/videos/video1.mp4";
import video2 from "../../assets/videos/video2.mp4";
import video3 from "../../assets/videos/video3.mp4";
import video4 from "../../assets/videos/video4.mp4";

export default function ShopTheLook() {

  const reels = [
    {
      video: video1,
    },
    {
      video: video2,
    },
    {
      video: video3,
    },
    {
      video: video4,
    },
    {
      video: "",
    },
  ];

  // VIEWER STATE

  const [viewerOpen, setViewerOpen] =
    useState(false);

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  // OPEN VIEWER

  function openViewer(index) {

    setSelectedIndex(index);

    setViewerOpen(true);
  }

  // CLOSE VIEWER

  function closeViewer() {

    setViewerOpen(false);
  }

  return (
    <>
      <section className="shop-look">

        {/* TITLE */}

        <h2>
          SHOP THE LOOK
        </h2>

        {/* SLIDER */}

        <div className="shop-look-slider">

          {reels.map((reel, index) => (

            <div
              key={index}
              className="shop-look-card"
              onClick={() =>
                openViewer(index)
              }
            >

              {/* VIDEO */}

              {reel.video ? (

                <video
                  src={reel.video}
                  muted
                  loop
                  autoPlay
                  playsInline
                  preload="metadata"
                />

              ) : (

                <div className="shop-look-placeholder">

                  <span>
                    Reel Coming Soon
                  </span>

                </div>

              )}

              {/* PLAY */}

              <div className="shop-look-play">

                <Play
                  size={28}
                  fill="white"
                />

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* VIEWER */}

      {viewerOpen && (

        <ReelsViewer
          reels={reels}
          selectedIndex={selectedIndex}
          closeViewer={closeViewer}
        />

      )}
    </>
  );
}