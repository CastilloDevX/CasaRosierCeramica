"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { BlogPost } from "@/data/types";
import { assetPath } from "@/lib/assets";
import { formatDate } from "@/lib/utils";

export function FeaturedCarousel({ posts }: { posts: readonly BlogPost[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (
      paused ||
      posts.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % posts.length),
      6000
    );
    return () => window.clearInterval(timer);
  }, [paused, posts.length]);

  if (!posts.length) return null;

  return (
    <div
      className="featured-carousel"
      aria-roledescription="carousel"
      aria-label="Articulos destacados del blog"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          setIndex((index - 1 + posts.length) % posts.length);
        }
        if (event.key === "ArrowRight") {
          setIndex((index + 1) % posts.length);
        }
      }}
    >
      <button
        className="featured-carousel__arrow featured-carousel__arrow--prev"
        type="button"
        aria-label="Articulo destacado anterior"
        onClick={() => setIndex((index - 1 + posts.length) % posts.length)}
      >
        &lsaquo;
      </button>
      <div className="featured-carousel__viewport">
        <div
          className="featured-carousel__track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {posts.map((post) => (
            <article className="featured-slide" key={post.id}>
              <div className="featured-slide__peek featured-slide__peek--media">
                <img
                  src={assetPath(post.featuredImage ?? post.coverImage)}
                  alt={post.title}
                />
              </div>
              <Link
                className="featured-slide__main"
                href={`/blog/${post.slug}`}
              >
                <img
                  className="featured-slide__main-image"
                  src={assetPath(post.featuredImage ?? post.coverImage)}
                  alt={post.title}
                />
                <span className="featured-slide__main-overlay">
                  <span className="featured-slide__main-title">
                    {post.title}
                  </span>
                </span>
              </Link>
              <article className="featured-slide__peek featured-slide__peek--content">
                <p className="featured-slide__category">{post.category}</p>
                <h3>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="featured-slide__excerpt">
                  {post.featuredExcerpt ?? post.excerpt}
                </p>
                <div className="featured-slide__meta">
                  <span className="featured-slide__author-initial">
                    {post.authorInitial || post.author.charAt(0)}
                  </span>
                  <div>
                    <strong>{post.author}</strong>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                </div>
              </article>
            </article>
          ))}
        </div>
      </div>
      <button
        className="featured-carousel__arrow featured-carousel__arrow--next"
        type="button"
        aria-label="Articulo destacado siguiente"
        onClick={() => setIndex((index + 1) % posts.length)}
      >
        &rsaquo;
      </button>
      <div className="featured-carousel__dots">
        {posts.map((post, dotIndex) => (
          <button
            type="button"
            className={`featured-carousel__dot ${
              dotIndex === index ? "is-active" : ""
            }`}
            aria-label={`Ir al destacado ${dotIndex + 1}`}
            onClick={() => setIndex(dotIndex)}
            key={post.id}
          />
        ))}
      </div>
    </div>
  );
}
