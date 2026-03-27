import { useEffect, useState } from "react";
import api from "../api/api";
import ExperienceCard from "../components/ExperienceCard";
import LocationCard from "../components/LocationCard";
import CategoryCard from "../components/CategoryCard";

function Home() {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchHomeData();
  }, [currentPage]);

  const fetchHomeData = () => {
    setLoading(true);
    api
      .get(`/api/home/?${currentPage}`)
      .then((res) => {
        setHomeData(res.data);
        setError(null);
        // console.log("Home data:", res.data);
      })
      .catch((err) => {
        setError(err.message);
        console.error("Error fetching home data:", err);
      })
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!homeData) return <div className="error">No data available</div>;

  return (
    <div className="body">
      {homeData.continue_booking &&
        Object.keys(homeData.continue_booking).length > 0 && (
          <section className="continue-booking-section">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">
              Continue Booking
            </h2>
            <div className="bookings-list">
              {Array.isArray(homeData.continue_booking) ? (
                homeData.continue_booking.map((booking) => (
                  <div key={booking.id} className="booking-card">
                    <h3>{booking.experience_name}</h3>
                    <p>Reference: {booking.booking_reference}</p>
                    <p>Date: {booking.booking_date}</p>
                    <p>Tickets: {booking.total_tickets}</p>
                    <p>Total: ${booking.total_amount}</p>
                    <p className="status">Status: {booking.status}</p>
                  </div>
                ))
              ) : (
                <p>No pending bookings</p>
              )}
            </div>
          </section>
        )}

      {homeData.explore_locations && (
        <section className="explore-locations-section">
          <h2 className="text-3xl font-bold text-brand-dark mb-6">
            {homeData.explore_locations.label}
          </h2>
          <div className="location-grid">
            {/* <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6"> */}
            {homeData.explore_locations.data.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        </section>
      )}

      {homeData.featured_categories &&
        homeData.featured_categories.map((category) => (
          <section
            className="museum-section"
            key={category.category + category.pagination.current_page}
          >
            <div className="section-header flex">
              <h2 className="text-3xl font-bold text-brand-dark mb-6">
                {category.category}
              </h2>
              {category.pagination && (
                <div className="pagination flex space-x-2 position-right">
                  {/* <p>
                  Page {homeData.museum_category.pagination.current_page} of{" "}
                  {Math.ceil(
                    homeData.museum_category.pagination.count /
                    homeData.museum_category.pagination.page_size,
                    )}
                    </p> */}
                  <button
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!category.pagination.previous}
                  >
                    <span className="material-symbols-outlined text-gray-600">
                      &lt;
                    </span>
                  </button>
                  <button
                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!category.pagination.next}
                  >
                    <span className="material-symbols-outlined text-gray-600">
                      &gt;
                    </span>
                  </button>
                </div>
              )}
            </div>
            <div className="experience-grid">
              {/* <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6"> */}
              {category.experiences.map((exp) => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))}
            </div>
          </section>
        ))}

      {homeData.all_categories && (
        <section className="all-categories-section">
          <h2 className="text-3xl font-bold text-brand-dark mb-6">
            Browse by Categories
          </h2>
          <div className="relative mb-8">
            <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto overflow-y-hidden scrollbar-hide">
              {homeData.all_categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
