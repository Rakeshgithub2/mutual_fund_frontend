"use client";

import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";

interface QuickNavProps {
  sections: Array<{
    id: string;
    label: string;
    icon: string;
  }>;
}

export function QuickNav({ sections }: QuickNavProps) {
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="sticky top-20 bg-white dark:bg-gray-900 rounded-lg shadow-xl border-2 border-blue-200 dark:border-blue-800 p-4 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95 z-10">
      <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <span className="text-base">🧭</span>
        Quick Navigation
      </h3>

      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeSection === section.id
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                : "text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <span className="flex items-center gap-2">
              <span>{section.icon}</span>
              {section.label}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          Click on any section to jump directly
        </p>
      </div>
    </div>
  );
}
