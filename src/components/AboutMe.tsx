import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import sagar1 from "@/assets/sagar1.jpg"
import sagar2 from "@/assets/sagar2.jpg"
import sagar3 from "@/assets/sagar3.jpg"
import sagar4 from "@/assets/sagar4.jpg"
import sagar5 from "@/assets/sagar5.jpg"

export function AboutMe() {
  const testimonials = [
    {
      quote:
        "Started CP before Development, start was hard, But now go on Hitting 1433 on Codeforce to Become Specialist and also on Leetcode hit 1836 mark",
      name: "Sagar Kapoor",
      designation: "Competitive Programmer",
      src:sagar1.src,
    },
    {
      quote:
        "In my Freetime love to play games like Pokemon Go ( Infernape my Favourite Pokemon and Greninja sucks ) , FC 25 , Fifa Mobile, PES etc",
      name: "Sagar Kapoor",
      designation: "Gamer",
      src: sagar2.src,
    },
    {
      quote:
        "My Development Skills Never dissapoints you ,that just i can say, i can assure you.",
      name:"Sagar Kapoor",
      designation: "FullStack Developer",
      src: sagar3.src
    },
    {
      quote: "Football fan of Mohun Bagan Supergiants and Manchester United Club.Supporting Both since 2018. Joy Mohun Bagan! , Glory Glory Man United!",

      name: "Sagar Kapoor",
      designation: "Football Fan",
      src: sagar4.src
    },
    {
      quote:
        "Well, Sagar, as your buddy, he’ll stand by you through every laugh, every challenge, and every milestone—because true friendship is about being the sunshine on your brightest days and the anchor in your stormiest nights.  --ChatGPT ",
      name: "Sagar Kapoor",
      designation: "Buddy",
      src: sagar5.src
    },
  ];
  return (<>
  <div className="container mx-auto px-4 pt-16 ">
        <div className="relative">
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-900/20 rounded-full blur-2xl opacity-60"></div>
          <div className="absolute right-10 top-0 w-16 h-16 bg-purple-900/20 rounded-full blur-xl opacity-60"></div>
          <div className="relative flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            About Meeeee
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-0"></div>
          </div>
        </div>
      </div>
  <AnimatedTestimonials testimonials={testimonials} />
  </>);
}
