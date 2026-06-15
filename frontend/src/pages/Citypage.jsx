import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";
import ExperienceCard from "../components/ExperienceCard";
import { ChevronRight, MapPin, Compass } from "lucide-react";

export default function CityPage() {
  const { public_id } = useParams();
  
 
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  
  useEffect(() => {
    async function loadCity() {
      try {
        setLoading(true);
        const response = await api.get(`/api/city/${public_id}`);
        setCityData(response.data);
      } catch (err) {
        setError("Failed to load city.");
      } finally {
        setLoading(false);
      }
    }
    loadCity();
  }, [public_id]);

 
  useEffect(() => {
    if (cityData?.name) {
      document.title = `Explore ${cityData.name} | ZeQue`;
    }
  }, [cityData]);

  useEffect(() => {
    if (!cityData) return;

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", cityData["SEO-description"] || "");
    }
  }, [cityData]);

  //  Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  // Error State
  if (error || !cityData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-lg animate-pulse">{error || "City data not found"}</div>
      </div>
    );
  }

  //  Filtering 
  
  const categories = [
    "All",
    ...new Set((cityData.experiences || []).flatMap((exp) => exp.category || [])),
  ];

  const filteredExperiences = selectedCategory === "All"
    ? (cityData.experiences || [])
    : (cityData.experiences || []).filter((exp) => exp.category?.includes(selectedCategory));

  return (
    <>
      {/* 1. Hero */}
      <div className="relative h-[50vh] overflow-hidden">
        <img
          src={cityData.image_url}
          alt={cityData.name}
          className="w-full h-full object-cover"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        
        <div className="absolute bottom-8 left-4 sm:left-10 text-white">
          
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="hover:underline">Home</Link>
            <ChevronRight size={14} />
            <span>{cityData.name}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight font-black mt-2">
            Explore {cityData.name}
          </h1>

          <p className="mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-slate-200">
            {cityData.description}
          </p>

          {/* date  */}
          <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-10">
            {cityData["best-time"] && (
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm">
                📅 Best Time: {cityData["best-time"]}
              </span>
            )}
            <div>
              <p className="text-3xl font-bold">{cityData.experience_count || 0}</p>
              <p className="text-xs text-slate-300 uppercase tracking-wider">Experiences</p>
            </div>
          </div>
        </div>
      </div>

      {/*  Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header Block */}
        <div className="mb-8">
          <h2 className="text-3xl font-black text-slate-900">Explore Experiences</h2>
          <p className="text-slate-500 mt-2">
            Discover attractions, monuments and experiences in {cityData.name}.
          </p>
        </div>

        {/* Categories  */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(8); 
              }}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 field-blur ${
                selectedCategory === cat
                  ? "bg-[#136b55] text-white shadow-lg"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Experiences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {filteredExperiences.slice(0, visibleCount).map((exp) => (
            <ExperienceCard key={exp.public_id} experience={exp} />
          ))}
        </div>

        {/* Show More Button */}
        {visibleCount < filteredExperiences.length && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-6 py-3 rounded-full bg-[#136b55] text-white font-semibold hover:bg-[#0c4c3b] transition-colors"
            >
              Show More Attractions
            </button>
          </div>
        )}

        {/* Empty */}
        {filteredExperiences.length === 0 && (
          <div className="text-center py-20">
            <Compass className="mx-auto w-16 h-16 text-slate-300 mb-4 animate-spin-slow" />
            <h3 className="text-xl font-bold text-slate-700">We're adding more experiences soon.</h3>
            <p className="text-slate-500 mt-2">Check back later for newly added attractions.</p>
          </div>
        )}

        {/* Newsletter  */}
        <div className="mt-24 rounded-3xl bg-gradient-to-r from-[#136b55] to-[#1f8f72] p-8 sm:p-12 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-black">Stay Updated</h2>
          <p className="mt-3 text-white/80">
            Get notified about new heritage experiences and travel destinations.
          </p>
          
          <form 
            onSubmit={(e) => e.preventDefault()} 
            className="mt-6 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="px-4 py-3 rounded-xl text-black w-full outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white text-[#136b55] font-bold hover:bg-slate-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

