import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data';

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  const active = TESTIMONIALS[currentIndex];

  return (
    <div className="relative py-8" id="testimonials-carousel-container">
      {/* Visual background accents */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-100/30 blur-3xl pointer-events-none"></div>

      <div className="mx-auto max-w-4xl px-4">
        <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900/80 sm:p-10 md:p-14">
          
          <div className="absolute top-6 left-8 text-slate-100 dark:text-slate-800">
            <Quote className="h-16 w-16 rotate-180 opacity-40" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 font-sans"
            >
              {/* Star Rating Icons */}
              <div className="flex gap-1 text-amber-500">
                {[...Array(active.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-500" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="mt-6 text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-100 sm:text-xl md:text-2xl">
                &quot;{active.text}&quot;
              </blockquote>

              {/* Author Info */}
              <div className="mt-8 flex items-center gap-4">
                <img
                  src={active.avatar}
                  alt={active.name}
                  referrerPolicy="no-referrer"
                  className="h-14 w-14 rounded-full border-2 border-blue-500 object-cover shadow-sm"
                />
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {active.name}
                  </h4>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {active.role} • <span className="text-slate-500 dark:text-slate-400 font-medium">{active.business}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Arrows */}
          <div className="absolute bottom-6 right-8 flex gap-2">
            <button
              onClick={prevSlide}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              id="carousel-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              id="carousel-next"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

        </div>

        {/* Bullet Dot Indicators */}
        <div className="mt-6 flex justify-center gap-1.5">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 dark:bg-slate-700'
              }`}
              id={`carousel-dot-${idx}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
