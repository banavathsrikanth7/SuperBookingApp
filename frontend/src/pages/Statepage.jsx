import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import ExperienceCard from "../components/ExperienceCard";
import LocationCard from "../components/LocationCard";
import { ChevronRightIcon, MapPin } from "lucide-react";

export default function StatePage() {
  const { public_id } = useParams();
  
 
  const [stateData, setStateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8);

  
  useEffect(() => {
    async function loadState() {
      try {
        setLoading(true);
        const response = await api.get(`/api/state/${public_id}`);
        setStateData(response.data);
      } catch (err) {
        setError("Failed to load state data");
      } finally {
        setLoading(false);
      }
    }
    loadState();
  }, [public_id]);

  //SEO 
  useEffect(() => {
    if (!stateData) return;
    
    
    document.title = stateData["SEO-title"] || `Explore ${stateData.name} | ZeQue`;

    
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute("content", stateData["SEO-description"] || "");
    }
  }, [stateData]);

 // Loading 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">Loading...</div>
      </div>
    );
  }

  //erroe
  if (error || !stateData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-red-500 text-lg">
          {error || "State data not found"}
        </div>
      </div>
    );
  }

  
  const categories = [
    "All",
    ...new Set((stateData.experiences || []).flatMap((exp) => exp.category || [])),
  ];

  // Filter 
  const filteredExperiences = selectedCategory === "All"
    ? stateData.experiences || []
    : (stateData.experiences || []).filter((exp) => exp.category?.includes(selectedCategory));

  return (
    <>
      {/* Hero Image */}
      <div className="relative h-[40vh] sm:h-[50vh] lg:h-[65vh] overflow-hidden">
        <img
          src={stateData.image_url}
          alt={stateData.name}
          className="w-full h-full object-cover"
        />
       
        <div className="absolute inset-0 bg-black/50" />

       
        <div className="absolute bottom-10 left-6 right-6 sm:left-10 text-white max-w-7xl mx-auto">
         
          <div className="flex items-center gap-2 text-sm mb-2">
            <Link to="/" className="hover:underline text-slate-200">Home</Link>
            <ChevronRightIcon size={14} />
            <span className="text-white">{stateData.name}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl leading-tight font-black">
            Explore {stateData.name}
          </h1>

          <p className="max-w-2xl mt-4 text-sm sm:text-base lg:text-lg text-slate-200">
            {stateData.description}
          </p>

          
          <div className="mt-4 flex flex-wrap gap-3 items-center">
            {stateData["best-time"] && (
              <span className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur text-sm">
                📅 Best Time: {stateData["best-time"]}
              </span>
            )}
            {stateData.website && (
              <a
                href={stateData.website}
                target="_blank"
                rel="noreferrer"
                className="inline-block px-4 py-2 rounded-full bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600 hover:text-white backdrop-blur text-sm font-medium transition-all"
              >
                Official Tourism Website →
              </a>
            )}
          </div>

          
          <div className="grid gap-4 mt-8 grid-cols-2 max-w-md">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <h3 className="text-3xl font-bold">{stateData.experience_count || 0}</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider mt-1">Experiences</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
              <h3 className="text-3xl font-bold">{stateData.city_count || 0}</h3>
              <p className="text-xs text-slate-300 uppercase tracking-wider mt-1">Cities</p>
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* Category  */}
        <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setVisibleCount(8); 
              }}
              className={`px-5 py-2.5 rounded-full font-medium whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#136b55] text-white shadow-lg"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/*  Experiences */}
        <div className="mt-10">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Top Experiences</h2>
          
          {/*  Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredExperiences.slice(0, visibleCount).map((exp) => (
              <ExperienceCard key={exp.public_id} experience={exp} />
            ))}
          </div>

          
          {visibleCount < filteredExperiences.length && (
            <div className="flex justify-center mt-8">
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
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 mt-6">
              <p className="text-slate-500 font-medium">No experiences found for this category.</p>
            </div>
          )}
        </div>

        {/* Popular Cities  */}
        <div className="mt-20">
          <h2 className="text-3xl font-black text-slate-900 mb-6">Popular Cities</h2>
          
         
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {(stateData.cities || []).map((city) => (
              <LocationCard
                key={city.public_id}
                location={{ ...city, icon_url: city.image_url }}
              />
            ))}
          </div>

          {/* Empty  */}
          {(!stateData.cities || stateData.cities.length === 0) && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500 font-medium">No cities listed for this state yet.</p>
            </div>
          )}
        </div>

        {/*(Newsletter Signup) */}
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