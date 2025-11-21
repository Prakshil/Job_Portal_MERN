import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GridBackgroundDemo } from "../ui/background";
import FeaturesSectionDemo from "../ui/features-section-demo-1";
import { BentoGrid, BentoGridItem } from "../ui/bento-grid";
import { IconClipboardCopy, IconFileBroken, IconSignature, IconTableColumn, IconCode, IconDeviceDesktopAnalytics, IconServer } from "@tabler/icons-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("role");
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);

  useEffect(() => {
    // Hero section fade in
    gsap.fromTo(heroRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );

    // Features section scroll animation
    if (featuresRef.current) {
      gsap.fromTo(featuresRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Categories section scroll animation
    if (categoriesRef.current) {
      gsap.fromTo(categoriesRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: categoriesRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  return (
    <div className="bg-black min-h-screen w-full text-white">
      {/* Hero Section with Background */}
      <GridBackgroundDemo>
         <div ref={heroRef} className="flex flex-col items-center justify-center px-4">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              DevConnect Jobs
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
              The Premier Tech Job Platform. Discover & Apply to Your Ideal Tech Careers.
              Connect with the best tech companies and find opportunities that match your skills.
            </p>
            {!isLoggedIn && (
                <button 
                  onClick={() => navigate("/login")} 
                  className="mt-8 px-8 py-3 rounded-full bg-white text-black font-bold hover:bg-neutral-200 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "power2.out" })}
                  onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" })}
                >
                    Get Started
                </button>
            )}
         </div>
      </GridBackgroundDemo>

      {/* Features Section */}
      <div ref={featuresRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">Why Choose Us?</h2>
        <FeaturesSectionDemo />
      </div>

      {/* Bento Grid for Categories */}
      <div ref={categoriesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <h2 className="text-3xl md:text-5xl font-bold text-center mb-12 text-white">Explore Categories</h2>
        <BentoGrid className="max-w-4xl mx-auto">
          {items.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </div>
    </div>
  );
};

const items = [
  {
    title: "Frontend Developer",
    description: "Build beautiful user interfaces with React, Vue, or Angular. \n\n• 150+ Open Positions\n• Avg Salary: $95k\n• Remote Options Available",
    icon: <IconCode className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Backend Developer",
    description: "Power the web with robust APIs using Node.js, Python, or Go. \n\n• 120+ Open Positions\n• Avg Salary: $105k\n• High Demand",
    icon: <IconServer className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Full Stack",
    description: "Master both ends of the spectrum. \n\n• 200+ Open Positions\n• Avg Salary: $110k\n• Versatile Roles",
    icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "Data Science",
    description: "Unlock insights from data with ML and AI. \n\n• 80+ Open Positions\n• Avg Salary: $120k\n• Rapidly Growing Field",
    icon: <IconDeviceDesktopAnalytics className="h-4 w-4 text-neutral-500" />,
  },
  {
    title: "DevOps Engineer",
    description: "Streamline deployment and operations. \n\n• 90+ Open Positions\n• Avg Salary: $115k\n• Critical Infrastructure Role",
    icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
  },
];

export default Home;
