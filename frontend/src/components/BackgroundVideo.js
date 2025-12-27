import React from "react";

export default function BackgroundVideo({ src = "/green-paint-video.mp4", useGif = false, overlayOpacity = 0.48 }) {
  // If useGif is true, render an img with pointer-events: none so it behaves like background
  return (
    <>
      {useGif ? (
        <img
          alt="background"
          src={src}
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -20, pointerEvents: "none" }}
        />
      ) : (
        <video
          style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: -20, pointerEvents: "none" }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      <div
        style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})`, position: "fixed", inset: 0, zIndex: -10, pointerEvents: "none" }}
      />
    </>
  );
}
