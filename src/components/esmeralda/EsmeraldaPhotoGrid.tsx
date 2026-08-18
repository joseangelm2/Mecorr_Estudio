"use client";

import { useState } from "react";

interface Props {
  photos: string[];
}

export default function EsmeraldaPhotoGrid({ photos }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  if (!photos.length) return null;

  // Primeras 6 fotos en 3 columnas de 2 apiladas; el resto, a ancho completo.
  const columns: string[][] = [];
  for (let i = 0; i < Math.min(photos.length, 6); i += 2) {
    columns.push(photos.slice(i, i + 2));
  }
  const fullWidthPhotos = photos.slice(6);

  function openModal(idx: number) {
    setCurrentIdx(idx);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function prev() {
    setCurrentIdx((i) => (i - 1 + photos.length) % photos.length);
  }

  function next() {
    setCurrentIdx((i) => (i + 1) % photos.length);
  }

  return (
    <>
      <section id="grid" className="no-print">
        <div className="container-grid">
          {columns.map((col, ci) => (
            <div key={ci} className="column">
              {col.map((src, i) => {
                const idx = ci * 2 + i;
                return (
                  <img
                    key={idx}
                    className="object-grid show-p-y"
                    src={src}
                    alt=""
                    onClick={() => openModal(idx)}
                  />
                );
              })}
            </div>
          ))}
          {fullWidthPhotos.map((src, i) => {
            const idx = 6 + i;
            return (
              <div key={idx} className="column full-width show-p-y">
                <img className="object-grid" src={src} alt="" onClick={() => openModal(idx)} />
              </div>
            );
          })}
        </div>
      </section>

      {/* Lightbox modal */}
      {modalOpen && (
        <div className="modal open" onClick={closeModal}>
          <span className="close-btn" onClick={closeModal}>×</span>
          <span
            className="prev-btn"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            ‹
          </span>
          <img
            className="modal-img"
            src={photos[currentIdx]}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
          <span
            className="next-btn"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            ›
          </span>
        </div>
      )}
    </>
  );
}
