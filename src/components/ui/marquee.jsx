import { cn } from "@/lib/utils"
import { useEffect, useMemo, useState } from "react";
import api from "@/services/axios/axiosClient";

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  onLike,
  ...props
}) {
  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}>
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "animate-marquee flex-row": !vertical,
              "animate-marquee-vertical flex-col": vertical,
              "group-hover:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}>
            {children}
          </div>
        ))}
    </div>
  );
}

// Lightweight card used to render each review/comment inside the marquee
function ReviewCard({ id, name, username, body, img, likes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(likes);

  const toggleLike = async () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikesCount((c) => Math.max(0, c + (nextLiked ? 1 : -1)));
    try {
      if (nextLiked) await api.post(`/comments/${id}/like`);
      else await api.post(`/comments/${id}/unlike`);
    } catch (e) {
      // revert on failure
      setLiked(!nextLiked);
      setLikesCount((c) => Math.max(0, c + (nextLiked ? -1 : 1)));
    }
  };

  return (
    <figure className="relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 border-gray-200 bg-white shadow-sm">
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt={name} src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium text-gray-900">{name}</figcaption>
          <p className="text-xs font-medium text-gray-500">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm text-gray-800">{body}</blockquote>
      <div className="mt-3 flex items-center gap-2">
        <button className="btn btn-circle" onClick={toggleLike} aria-label="Like comment">
          <svg xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-[1.2em]"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
        </button>
        <span className="text-xs text-gray-600">{likesCount}</span>
      </div>
    </figure>
  );
}

// Fetches comments from the API (with auth) and displays them using Marquee
export function MarqueeComments({ initialReviews = [], className }) {
  const [reviews, setReviews] = useState(initialReviews);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.get("/comments");
        const payload = response?.data;
        const arr = Array.isArray(payload) ? payload : payload?.data;
        if (mounted && Array.isArray(arr)) {
          const commentReviews = arr.map((comment) => ({
            id: comment?._id,
            name: comment?.user_id?.name || "User",
            username: `@${String(comment?.user_id?.name || "user").split(" ")[0].toLowerCase()}`,
            body: comment?.content || "",
            img: comment?.user_id?.avatar || "https://avatar.vercel.sh/user",
            likes: typeof comment?.likes === "number" ? comment.likes : 0,
          }));
          setReviews((prev) => {
            // Avoid duplicating initialReviews if already present
            if (prev && prev.length > 0 && prev !== initialReviews) return prev;
            return [...commentReviews, ...initialReviews];
          });
        }     
      } catch (error) {
        console.error("Failed to fetch comments for marquee:", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialReviews]);

  const firstRow = useMemo(() => reviews.slice(0, Math.ceil(reviews.length / 2)), [reviews]);
  const secondRow = useMemo(() => reviews.slice(Math.ceil(reviews.length / 2)), [reviews]);

  return (
    <div className={cn("relative flex w-full flex-col items-center justify-center overflow-hidden py-10", className)}>
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
        Explore Our customers reviews
      </h2>
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review, idx) => (
          <ReviewCard key={`${review.id || review.username || review.name}-${idx}`} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review, idx) => (
          <ReviewCard key={`${review.id || review.username || review.name}-b-${idx}`} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
