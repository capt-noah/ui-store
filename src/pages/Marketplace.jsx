import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import Skeletons from "../components/Skeletons";

// Helper to stop clicks inside the preview from navigating to the component detail page
const stopCardNavigation = (e) => e.stopPropagation();

const generatePreviewHtml = (code) => {
  if (!code) return "";
  
  // Strip imports and exports to make it run locally without a module bundler
  const cleanCode = code
    .replace(/import\s+.*?['"].*?['"];?/g, '')
    .replace(/export\s+default\s+/g, '')
    .replace(/export\s+/g, '');

  // Find the primary component name
  const match = code.match(/function\s+([A-Z][a-zA-Z0-9_]*)/) || code.match(/const\s+([A-Z][a-zA-Z0-9_]*)\s*=/);
  const compName = match ? match[1] : null;

  if (!compName) return "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <!-- Include Framer Motion for Bouncy Pulse Loader -->
        <script src="https://unpkg.com/framer-motion@11.0.0/dist/framer-motion.js"></script>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden; background: transparent; }
          #root { transform: scale(0.65); transform-origin: center; width: 100%; display: flex; justify-content: center; }
        </style>
      </head>
      <body>
        <div id="root"></div>
        <script type="text/babel">
          const { useState, useEffect, useRef, useMemo, useCallback } = React;
          const { motion, AnimatePresence } = window.Motion || {};
          
          ${cleanCode}

          const root = ReactDOM.createRoot(document.getElementById('root'));
          root.render(React.createElement(${compName}));
        </script>
      </body>
    </html>
  `;
};

const InteractivePreview = ({ component }) => {
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  if (!component.code) return <div className="text-gray-300 font-bold uppercase tracking-widest text-xs">Preview Not Available</div>;
  
  const srcDoc = generatePreviewHtml(component.code);

  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center relative">
      {!isIframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-gray-50 z-10">
          <Skeletons.Card />
        </div>
      )}
      {srcDoc ? (
        <iframe
          srcDoc={srcDoc}
          title={component.name}
          onLoad={() => setIsIframeLoaded(true)}
          className={`w-full h-[150%] border-none bg-transparent pointer-events-auto transition-opacity duration-300 ${isIframeLoaded ? "opacity-100" : "opacity-0"}`}
          sandbox="allow-scripts"
          scrolling="no"
        />
      ) : (
        <div className="text-gray-300 font-bold uppercase tracking-widest text-xs">Static Preview</div>
      )}
    </div>
  );
};

const ComponentCard = ({ component }) => (
  <motion.article
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 18 }}
    className="bg-white border border-gray-200 rounded-[28px] overflow-hidden flex flex-col min-w-0 transition-all duration-250 hover:border-gray-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    <div className="h-64 sm:h-72 bg-gray-50 flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
      <InteractivePreview component={component} />

      <div className="absolute top-5 right-5 z-10">
        <div
          className={`px-4 py-2 rounded-2xl shadow-xl border border-black/5 ${component.isFree ? "bg-green-500 text-white" : "bg-white text-black"}`}
        >
          <span className="text-xs font-black tracking-tight">
            {component.isFree ? "FREE" : `${component.credits} CREDITS`}
          </span>
        </div>
      </div>
    </div>

    <div className="p-6 sm:p-7 flex-1 flex flex-col min-w-0">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-start mb-3">
        <h3
          className="truncate text-xl sm:text-2xl font-black tracking-tight"
          title={component.name}
        >
          {component.name}
        </h3>
        <div className="shrink-0 h-8 px-3 rounded-full bg-yellow-50 text-yellow-700 flex items-center gap-1.5 text-xs font-black tabular-nums">
          <span>★</span>
          <span>{component.rating}</span>
        </div>
      </div>

      <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2 min-h-[44px]">
        {component.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-7">
        {["React", "JavaScript", "Tailwind", "Vite Ready"].map((badge) => (
          <span
            key={badge}
            className="px-2.5 py-1 bg-gray-50 text-gray-500 rounded-lg text-[10px] font-black uppercase tracking-widest border border-gray-100"
          >
            {badge}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pt-5 border-t border-gray-100">
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            {component.category}
          </div>
          <div className="text-xs font-bold text-gray-400 tabular-nums mt-1">
            {component.downloads} downloads
          </div>
        </div>
        <Link
          to={`/component/${component._id || component.id}`}
          className="bg-gray-900 text-white hover:bg-gray-800 rounded-xl shrink-0 px-5 py-3 text-xs font-bold inline-flex items-center gap-2 group transition-all"
        >
          View
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  </motion.article>
);

const EmptyState = ({ search }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    className="min-h-[460px] rounded-[32px] border border-dashed border-gray-200 bg-white flex flex-col items-center justify-center text-center px-8"
  >
    <div className="w-16 h-16 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-6">
      <svg
        className="w-7 h-7 text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>
    </div>
    <h3 className="text-3xl font-black tracking-tight mb-3">
      No results found
    </h3>
    <p className="text-gray-500 font-medium max-w-md">
      {search
        ? `Nothing matches "${search}". Try a broader keyword or reset the filters.`
        : "No components match the selected filters. Try a different category or availability."}
    </p>
  </motion.div>
);

const Marketplace = () => {
  const [components, setComponents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("Popular");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/components`)
      .then((response) => response.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setComponents(data);
        } else {
          setComponents([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch components:", err);
        setComponents([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(components.map((component) => component.category))),
    ],
    [components],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return components
      .filter(
        (component) => category === "All" || component.category === category,
      )
      .filter(
        (component) =>
          availability === "All" ||
          (availability === "Free" ? component.isFree : !component.isFree),
      )
      .filter((component) => {
        if (!query) return true;
        const haystack = [
          component.name,
          component.category,
          component.description,
          ...(component.features || []),
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      })
      .sort((a, b) => {
        if (sort === "Highest Rated") return b.rating - a.rating;
        if (sort === "Credits Low") return a.credits - b.credits;
        if (sort === "Credits High") return b.credits - a.credits;
        return (
          Number.parseFloat(b.downloads || 0) -
          Number.parseFloat(a.downloads || 0)
        );
      });
  }, [availability, category, components, search, sort]);

  const resetFilters = () => {
    setCategory("All");
    setAvailability("All");
    setSort("Popular");
    setSearch("");
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="px-6 sm:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 mb-5">
            Component marketplace
          </div>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.92]">
            Browse, test, unlock.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-500 font-medium max-w-3xl leading-relaxed">
            Interact with production-ready React components before spending
            credits. Free community components stay free.
          </p>
        </div>
      </header>

      <main className="w-full py-10 sm:py-14 px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 lg:gap-8 items-start">
          <aside className="lg:sticky lg:top-28 rounded-[28px] border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest">
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-xs font-black text-gray-400 hover:text-black transition-colors"
              >
                Reset
              </button>
            </div>

            <label className="block mb-7">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">
                Search
              </span>
              <div className="relative">
                <svg
                  className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search components"
                  className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-100 pl-11 pr-4 text-sm font-semibold outline-none focus:border-gray-300 focus:bg-white transition-colors"
                />
              </div>
            </label>

            <div className="space-y-7">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  Category
                </div>
                <div className="space-y-1">
                  {categories.map((item) => (
                    <button
                      key={item}
                      onClick={() => setCategory(item)}
                      className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-bold transition-all ${category === item ? "bg-black text-white" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`}
                    >
                      <span>{item}</span>
                      <span className="text-xs opacity-50">
                        {item === "All"
                          ? components.length
                          : components.filter(
                            (component) => component.category === item,
                          ).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-3">
                  Availability
                </div>
                <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                  {["All", "Free", "Premium"].map((item) => (
                    <button
                      key={item}
                      onClick={() => setAvailability(item)}
                      className={`rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest transition-all ${availability === item ? "bg-gray-100 text-black border border-gray-300" : "bg-gray-50 text-gray-400 border border-transparent hover:text-black"}`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-3">
                  Sort by
                </span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="w-full h-12 rounded-2xl bg-gray-50 border border-gray-100 px-4 text-sm font-bold outline-none focus:border-gray-300"
                >
                  <option>Popular</option>
                  <option>Highest Rated</option>
                  <option>Credits Low</option>
                  <option>Credits High</option>
                </select>
              </label>
            </div>
          </aside>

          <section className="min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-black tracking-tight">
                  {filtered.length} components
                </h2>
                <p className="text-sm font-bold text-gray-400 mt-1">
                  Live previews are clickable where the component supports
                  interaction.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px]">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <div className="col-span-full flex justify-center py-24">
                    <Loader />
                  </div>
                ) : filtered.length > 0 ? (
                  filtered.map((component) => (
                    <ComponentCard key={component._id} component={component} />
                  ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full flex flex-col items-center justify-center py-24 text-center px-4"
                >
                  <div className="w-20 h-20 mb-6 rounded-full bg-gray-50 flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-black mb-3">No results found</h3>
                  <p className="text-gray-500 max-w-sm font-medium">
                    We couldn't find any components matching your criteria. Try
                    adjusting your filters or search terms.
                  </p>
                  {(search || category !== "All" || availability !== "All") && (
                    <button
                      onClick={resetFilters}
                      className="mt-8 px-6 py-2.5 bg-black text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
export default Marketplace;
