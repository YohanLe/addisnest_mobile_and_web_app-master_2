import React from "react";
import { SvgCloseIcon, SvgArrowLeftIcon, SvgArrowRightIcon } from "../../assets/svg-files/SvgFiles.jsx";

const PhotoPopup = ({ isOpen, images, selectedIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(selectedIndex || 0);

  React.useEffect(() => {
    if (isOpen) setCurrentIndex(selectedIndex);
  }, [selectedIndex, isOpen]);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300"
      >
        <SvgCloseIcon />
      </button>

      <div className="relative max-w-5xl w-full px-4">
        <img
          src={images[currentIndex]}
          alt={`Photo ${currentIndex + 1}`}
          className="max-h-[80vh] w-full object-contain rounded-lg shadow-lg"
        />

        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
        >
          <SvgArrowLeftIcon />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
        >
          <SvgArrowRightIcon />
        </button>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default PhotoPopup;
