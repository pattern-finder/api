import React from 'react';
import './HeroSection.css';
import { Link } from 'react-router-dom';
import picspyLogo from '../assets/PicSpyLogoGrand.png';
//HeroSection
function HeroSection() {
  return (
    <div className="hero-container">
      <h1>Welcome to PicSpy</h1>

      <img
        src={picspyLogo}
        className="max-h-full h-50 object-contain"
        alt="logo"
      />

      <p>Challenge yourself to code to find the patterns in the image !</p>

      <p>This wed site allows you to create and solve pattern </p>
      <p>detection exercises with images in C++ and Python</p>

      <Link to="/serie/idseries=610161ef36c8526a260880a7">
        <p className="linktochallenge">If you want to start click here!</p>
      </Link>
    </div>
  );
}

export default HeroSection;
