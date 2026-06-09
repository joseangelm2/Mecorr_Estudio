"use client";

import { useState } from "react";

const gridImages = [
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

export default function MagicalPhotoGrid() {
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
            <img className="object-grid show-p-y" src="/images/magical/11.jpg" alt="" onClick={() => openModal(0)} />
            <img className="object-grid show-p-y" src="/images/magical/12.jpg" alt="" onClick={() => openModal(1)} />
          </div>
          <div className="column">
            <img className="object-grid show-p-y" src="/images/magical/21.jpg" alt="" onClick={() => openModal(2)} />
            <img className="object-grid show-p-y" src="/images/magical/22.jpg" alt="" onClick={() => openModal(3)} />
          </div>
          <div className="column">
            <img className="object-grid show-p-y" src="/images/magical/31.jpg" alt="" onClick={() => openModal(4)} />
            <img className="object-grid show-p-y" src="/images/magical/32.jpg" alt="" onClick={() => openModal(5)} />
          </div>
          <div className="column full-width show-p-y">
            <img className="object-grid" src="/images/magical/41.jpg" alt="" onClick={() => openModal(6)} />
          </div>
          <div className="column full-width show-p-y">
            <img className="object-grid" src="/images/magical/42.jpg" alt="" onClick={() => openModal(7)} />
          </div>
          <div className="column full-width show-p-y">
            <img className="object-grid" src="/images/magical/43.jpg" alt="" onClick={() => openModal(8)} />
          </div>
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
