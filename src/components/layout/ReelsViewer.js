import {
  useEffect,
  useRef,
} from "react";

import {
  X,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

import "../../css/reelsviewer.css";

export default function ReelsViewer({
  reels,
  selectedIndex,
  closeViewer,
}) {

  const containerRef =
    useRef(null);

  const videoRefs =
    useRef([]);

  // AUTO SCROLL

  useEffect(() => {

    if (containerRef.current) {

      containerRef.current.scrollTo({
        top:
          selectedIndex *
          window.innerHeight,
        behavior: "smooth",
      });

    }

  }, [selectedIndex]);

  // AUTO PLAY CURRENT VIDEO

  useEffect(() => {

    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach((entry) => {

            const video =
              entry.target;

          if (entry.isIntersecting) {

  const playPromise =
    video.play();

  if (playPromise !== undefined) {

    playPromise.catch(() => {});

  }

} else {

  video.pause();

}

          });

        },

        {
          threshold: 0.7,
        }
      );

    videoRefs.current.forEach(
      (video) => {

        if (video) {

          observer.observe(video);

        }

      }
    );

    return () => {

      videoRefs.current.forEach(
        (video) => {

          if (video) {

            observer.unobserve(
              video
            );

          }

        }
      );
    };

  }, []);

  // SCROLL UP

  function scrollUp() {

    if (containerRef.current) {

      containerRef.current.scrollBy({
        top: -window.innerHeight,
        behavior: "smooth",
      });

    }
  }

  // SCROLL DOWN

  function scrollDown() {

    if (containerRef.current) {

      containerRef.current.scrollBy({
        top: window.innerHeight,
        behavior: "smooth",
      });

    }
  }

  return (
    <div className="reels-viewer">

      {/* CLOSE */}

      <button
        className="reels-close"
        onClick={closeViewer}
      >

        <X size={28} />

      </button>

      {/* DESKTOP BUTTONS */}

      <div className="reels-scroll-buttons">

        <button onClick={scrollUp}>

          <ChevronUp size={26} />

        </button>

        <button onClick={scrollDown}>

          <ChevronDown size={26} />

        </button>

      </div>

      {/* REELS */}

      <div
        className="reels-container"
        ref={containerRef}
      >

        {reels.map((reel, index) => (

          <div
            key={index}
            className="reel-slide"
          >

            {reel.video ? (

              <video
                ref={(el) =>
                  (videoRefs.current[
                    index
                  ] = el)
                }
                src={reel.video}
                muted
                loop
                playsInline
                preload="metadata"
              />

            ) : (

              <div className="reel-placeholder">

                Reel Coming Soon

              </div>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}