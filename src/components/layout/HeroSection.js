import { useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import "../../css/herosection.css";

// TEMP IMAGES

import banner1 from "../../assets/images/banner1.webp";
import banner2 from "../../assets/images/banner2.webp";
import banner3 from "../../assets/images/banner3.webp";

export default function HeroSection() {

  const slides = [
    banner1,
    banner2,
    banner3,
  ];

  const [currentSlide, setCurrentSlide] =
    useState(0);

  // AUTO SLIDE

  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentSlide((prev) =>
        prev === slides.length - 1
          ? 0
          : prev + 1
      );

    }, 4000);

    return () =>
      clearInterval(interval);

  }, [slides.length]);

  // NEXT

  function nextSlide() {

    setCurrentSlide((prev) =>
      prev === slides.length - 1
        ? 0
        : prev + 1
    );
  }

  // PREV

  function prevSlide() {

    setCurrentSlide((prev) =>
      prev === 0
        ? slides.length - 1
        : prev - 1
    );
  }

  return (
    <section className="hero">

      {/* SLIDES */}

      <div
        className="hero-slider"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >

        {slides.map((slide, index) => (

          <div
            key={index}
            className="hero-slide"
          >

            <img
              src={slide}
              alt="banner"
            />

          </div>

        ))}

      </div>

      {/* LEFT */}

      <button
        className="hero-arrow hero-left"
        onClick={prevSlide}
      >

        <ChevronLeft size={34} />

      </button>

      {/* RIGHT */}

      <button
        className="hero-arrow hero-right"
        onClick={nextSlide}
      >

        <ChevronRight size={34} />

      </button>

      {/* DOTS */}

      <div className="hero-dots">

        {slides.map((_, index) => (

          <button
            key={index}
            className={`hero-dot ${
              currentSlide === index
                ? "active-dot"
                : ""
            }`}
            onClick={() =>
              setCurrentSlide(index)
            }
          />

        ))}

      </div>

    </section>
  );
}