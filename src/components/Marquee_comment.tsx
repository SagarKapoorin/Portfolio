import { cn } from "@/lib/utils";
import Marquee from "./ui/marquee";

const reviews = [
    {
        name: "Amit Sharma",
        username: "@amitsharma",
        body: "The frontend design is sleek and user-friendly. Great job!",
        img: "https://avatar.vercel.sh/amit",
    },
    {
        name: "Priya Singh",
        username: "@priyasingh",
        body: "The backend is robust and handles requests efficiently. Impressive work!",
        img: "https://avatar.vercel.sh/priya",
    },
    {
        name: "Ravi Kumar",
        username: "@ravikumar",
        body: "Full stack development is top-notch. Everything works seamlessly together.",
        img: "https://avatar.vercel.sh/ravi",
    },
    {
        name: "Anjali Mehta",
        username: "@anjalimehta",
        body: "The optimization techniques used have significantly improved performance. Excellent!",
        img: "https://avatar.vercel.sh/anjali",
    },
    {
        name: "Vikram Patel",
        username: "@vikrampatel",
        body: "The web app's performance measures are outstanding. It's fast and reliable.",
        img: "https://avatar.vercel.sh/vikram",
    },
    {
        name: "Neha Gupta",
        username: "@nehagupta",
        body: "The attention to detail in both frontend and backend is remarkable. Great job!",
        img: "https://avatar.vercel.sh/neha",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 bg-white dark:bg-gray-800 dark:border-gray-700",
      )}
    >
      <div className="flex flex-row items-center gap-2 overflow-hidden">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[500px] w-screen flex-col overflow-hidden items-center justify-center overflow-hidden rounded-lg border bg-transparent border-none md:shadow-xl">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      
    </div>
  );
}
