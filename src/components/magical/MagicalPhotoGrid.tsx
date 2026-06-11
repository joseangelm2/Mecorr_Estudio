"use client";

import { useState } from "react";

interface Props {
  photos: string[]
}

const FALLBACK = [
  "/images/magical/11.jpg",
  "/images/magical/12.jpg",
  "/images/magical/21.jpg",
  "/images/magical/22.jpg",
  "/images/magical/31.jpg",
  "/images/magical/32.jpg",
  "/images/magical/41.jpg",
  "/images/magical/42.jpg",
  "/images/magical/43.jpg",
];

export default function MagicalPhotoGrid({ photos }: Props) {
  const gridImages = photos.length >= 6 ? photos : FALLBACK;

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  function openModal(idx: number) {
    setCurrentIdx(idx);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function prev() {
    setCurrentIdx((i) => (i - 1 + gridImages.length) % gridImages.length);
  }

  function next() {
    setCurrentIdx((i) => (i + 1) % gridImages.length);
  }

  return (
    <>
      <section id="grid" className="no-print">
        <div className="container-grid">
          <div className="column">
            <img className="object-grid show-p-y" src={gridImages[0]} alt="" onClick={() => openModal(0)} />
            <img className="object-grid show-p-y" src={gridImages[1] ?? gridImages[0]} alt="" onClick={() => openModal(1)} />
          </div>
          <div className="column">
            <img className="object-grid show-p-y" src={gridImages[2] ?? gridImages[0]} alt="" onClick={() => openModal(2)} />
            <img className="object-grid show-p-y" src={gridImages[3] ?? gridImages[0]} alt="" onClick={() => openModal(3)} />
          </div>
          <div className="column">
            <img className="object-grid show-p-y" src={gridImages[4] ?? gridImages[0]} alt="" onClick={() => openModal(4)} />
            <img className="object-grid show-p-y" src={gridImages[5] ?? gridImages[0]} alt="" onClick={() => openModal(5)} />
          </div>
          {gridImages[6] && (
            <div className="column full-width show-p-y">
              <img className="object-grid" src={gridImages[6]} alt="" onClick={() => openModal(6)} />
            </div>
          )}
          {gridImages[7] && (
            <div className="column full-width show-p-y">
              <img className="object-grid" src={gridImages[7]} alt="" onClick={() => openModal(7)} />
            </div>
          )}
          {gridImages[8] && (
            <div className="column full-width show-p-y">
              <img className="object-grid" src={gridImages[8]} alt="" onClick={() => openModal(8)} />
            </div>
          )}
        </div>
      </section>

      {modalOpen && (
        <div className="modal open" onClick={closeModal}>
          <span className="close-btn" onClick={closeModal}>×</span>
          <span className="prev-btn" onClick={(e) => { e.stopPropagation(); prev(); }}>‹</span>
          <img
            className="modal-img"
            src={gridImages[currentIdx]}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <span className="next-btn" onClick={(e) => { e.stopPropagation(); next(); }}>›</span>
        </div>
      )}
    </>
  );
}
