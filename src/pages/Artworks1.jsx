import React, { useState, useEffect, useCallback } from "react";
import "./Artworks.css";
import SortButton from "../components/SortingButton";
import { IoFilterOutline } from "react-icons/io5";
import { FaSort } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";
import { FaRegStar } from "react-icons/fa6"; 
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; 
import axios from "axios";
import { FaStar } from 'react-icons/fa';
import artworksBack from '../assets/artworks-back.jpg'

function Artworks1() {
  const [artworks, setArtworks] = useState([]);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [nextPageUrl, setNextPageUrl] = useState("");
  const [prevUrls, setPrevUrls] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [filteredArtworks, setFilteredArtworks] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [filterType, setFilterType] = useState("city"); // Default: filter by city
  const [showFilters, setShowFilters] = useState(false);
  const [sortedArtworks, setSortedArtworks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [useDatabase, setUseDatabase] = useState(true); // 🔹 Decides data source
  const [dbArtworks, setDbArtworks] = useState([]); // 🔹 Stores artworks from MongoDB
  const [dbPage, setDbPage] = useState(1); // 🔹 Track MongoDB pagination
  const [totalPages, setTotalPages] = useState(null); // 🔹 Total available pages
  const [userRating, setUserRating] = useState(null); // stores user’s existing rating
  const [isEditing, setIsEditing] = useState(false);  // toggles edit mode
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1050);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  
  const { user } = useContext(AuthContext);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');

  // Holds the details of the selected artwork
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  // State for city/country location info
  const [city, setCity] = useState("Unknown");
  const [country, setCountry] = useState("Unknown");

  const navigate = useNavigate();

  
 
  useEffect(() => {
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1050);
    };
  
    window.addEventListener("resize", handleResize);
  
    
    handleResize();
  
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 2. Fetch the first page (or specific page) of artworks
  const fetchArtworks = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching artworks from MongoDB (page 1)...");
      const response = await axios.get(`https://dag-backend-production.up.railway.app/artworks`, {
        params: { page: 1, limit: 10 }, // ZAWSZE page: 1
      });
  
      setDbArtworks(response.data.artworks);
      setTotalPages(response.data.totalPages);
      setDbPage(2); // przygotuj od razu na kolejną (page 2)
    } catch (error) {
      console.error("❌ Error fetching artworks:", error);
      setDbArtworks([]);
    }
    setLoading(false);
  };
  
  

  

  // 3. Fetch more artworks (for infinite scrolling)
  const fetchMoreArtworks = useCallback(async () => {
    if (isFetchingMore || (totalPages && dbPage > totalPages)) return;
    setIsFetchingMore(true);
  
    try {
      let params = { page: dbPage, limit: 10 };
  
      if (locationFilter.trim()) {
        params.filterType = filterType;
        params.filterValue = locationFilter.trim();
      }
  
      if (sortedArtworks.length > 0) {
        params.sortOption = sortedArtworks;
      }
  
      const response = await axios.get(`https://dag-backend-production.up.railway.app/artworks`, {
        params,
      });
  
      setDbArtworks((prev) => [...prev, ...response.data.artworks]);
      setTotalPages(response.data.totalPages);
      setDbPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("❌ Error fetching more artworks:", error);
    }
  
    setIsFetchingMore(false);
  }, [dbPage, totalPages, locationFilter, filterType, sortedArtworks]);
  

  useEffect(() => {
    fetchArtworks();
  }, []);
  
 
  // 5. Infinite scroll for the left panel
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      if (!isFetchingMore) {
        fetchMoreArtworks();
      }
      
    }
  };

  // Function to fetch country based on city
  const fetchCountry = async (capitalCity) => {
    // If city is unknown or empty, do nothing
    if (!capitalCity || capitalCity === "Unknown") {
      setCountry("Unknown");
      return;
    }
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/capital/${capitalCity}`
      );
      if (response.data?.length > 0) {
        setCountry(response.data[0].name.common);
      } else {
        setCountry("Unknown");
      }
    } catch (error) {
      console.error("Error fetching country:", error);
      setCountry("Unknown");
      setDbArtworks([]);
    }
  };

  // 7. Fetch detailed info for clicked artwork
  const handleArtworkClick = async (artwork) => {
    setLoading(true);
    if (isMobile) {
      setMobileDetailOpen(true);
    }
  
    // ✅ Populate everything from MongoDB
    setSelectedArtwork({
      title: artwork.title,
      author: artwork.author,
      category: artwork.category,
      medium: artwork.medium,
      date: artwork.date,
      dimensions: artwork.dimensions,
      collecting_institution: artwork.collectingInstitution,
      imageUrl: artwork.imageUrl,
      city: artwork.city || "Unknown",
      country: artwork.country || "Unknown",
      artworkId: artwork.artworkId
    });
  
    // Reset rating state
    setUserRating(null);
    setRating(0);
    setComment('');
    setIsEditing(false);
    setRatingMessage('');
  
    // ✅ Fetch rating from MongoDB
    if (user) {
      try {
        const ratingRes = await axios.get(
          `https://dag-backend-production.up.railway.app/ratings/${user.id}/${artwork.artworkId}`
        );
        if (ratingRes.data) {
          setUserRating(ratingRes.data);
          setRating(ratingRes.data.rating);
          setComment(ratingRes.data.comment);
        }
      } catch (err) {
        setUserRating(null);
        setRating(0);
        setComment('');
      }
    }
  
    setCity(artwork.city || "Unknown");
    setCountry(artwork.country || "Unknown");
    setLoading(false);
  };
  
  

  const handleFilterChange = async (e) => {
    const value = e.target.value.trim();
    setLocationFilter(value);
  
    if (!value) return; // Stop if empty
    setUseDatabase(true); // ✅ Always use MongoDB
  
    try {
      console.log(`📡 Fetching artworks filtered by ${filterType}: ${value}`);
      const response = await axios.get(`https://dag-backend-production.up.railway.app/artworks`, {
        params: {
          filterType,
          filterValue: value,
          page: 1,
          limit: 10,
          sortOption: sortedArtworks // Optional: preserve current sort
        },
      });
  
      setDbArtworks(response.data.artworks);
      setTotalPages(response.data.totalPages);
      setDbPage(2);
    } catch (error) {
      console.error("❌ Error filtering artworks:", error);
      setDbArtworks([]);
    }
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
    setRating(userRating?.rating || 0);
    setComment(userRating?.comment || '');
  };
  

  const handleSort = async (option) => {
    setUseDatabase(true); // ✅ Switch to MongoDB
    setSortedArtworks(option);
  
    try {
      console.log(`📡 Fetching artworks sorted by: ${option}`);
      const response = await axios.get(
        `https://dag-backend-production.up.railway.app/artworks?sortOption=${encodeURIComponent(option)}&page=1&limit=10`
      );
  
      setDbArtworks(response.data.artworks);
      setTotalPages(response.data.totalPages);
      setDbPage(2); // ✅ Start from page 2 for next fetch
    } catch (error) {
      console.error("❌ Error sorting artworks:", error);
    }
  };

  const clearSort = () => {
    setSortedArtworks("");        
    setDbArtworks([]);            
    setDbPage(1);                 
    setTotalPages(null);
    fetchArtworks(); 
  };
  
  
  
  const searchArtworks = async () => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;
  
    setUseDatabase(true); // ✅ Use MongoDB
    setLoading(true);
    setDbPage(2); // Reset pagination
  
    try {
      console.log("🔍 Searching MongoDB for:", trimmedQuery);
      const response = await axios.get("https://dag-backend-production.up.railway.app/artworks/search", {
        params: {
          query: trimmedQuery,
          page: 1,
          limit: 10,
        },
      });
  
      setDbArtworks(response.data.artworks);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("❌ MongoDB search failed:", error);
      setDbArtworks([]);
    } finally {
      setLoading(false);
    }
  };
  

  const handleSubmitRating = async () => {
    if (!user || !selectedArtwork) return;
  
    try {
      const newRating = {
        ratingId: `${user.id}_${selectedArtwork.id}`,
        artworkId: selectedArtwork.id,
        artworkTitle: selectedArtwork.title,
        artworkAuthor: selectedArtwork.artistName || "Unknown",
        artworkImage: selectedArtwork._links?.image?.href?.replace("{image_version}", "large") || "",
        rating,
        comment,
        userId: user.id
      };
      
  
      const response = await axios.post("https://dag-backend-production.up.railway.app/ratings", newRating);
  
      // ✅ Update state properly
      const saved = response.data.rating;
  
      setUserRating(saved);             
      setRating(saved.rating);          
      setComment(saved.comment);        
      setIsEditing(false);              
      setRatingMessage("✅ Rating saved!");
  
      // ✅ Auto-hide message after a few seconds
      setTimeout(() => {
        setRatingMessage("");
      }, 3000);
    } catch (err) {
      console.error("❌ Failed to submit rating", err);
      setRatingMessage("❌ Failed to submit rating");
  
      setTimeout(() => {
        setRatingMessage("");
      }, 3000);
    }
  };
  
  
  const handleDeleteRating = async () => {
    if (!user || !selectedArtwork) return;
  
    try {
      await axios.delete(`https://dag-backend-production.up.railway.app/ratings/${user.id}/${selectedArtwork.id}`);
      setUserRating(null);
      setRating(0);
      setComment('');
      setIsEditing(false);
      setRatingMessage("✅ Rating deleted.");

      setTimeout(() => {
        setRatingMessage("");
      }, 3000);

    } catch (err) {
      console.error(err);
      setRatingMessage("❌ Failed to delete rating.");
    }
  };

  const clearFilters = () => {
    setLocationFilter("");
    setDbArtworks([]);
    setDbPage(1);
    setTotalPages(null);
    fetchArtworks();
  };
  
  const clearSearch = () => {
    setSearchQuery("");
    setDbArtworks([]);
    setDbPage(1);
    setTotalPages(null);
    fetchArtworks();
  };
  
  
  
  
  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat flex fixed"
      style={{ backgroundImage: `url(${artworksBack})` }}
    >

      {/* Top Bar */}
      <div className="w-full fixed bg-white h-[60px] z-40 shadow-md">

        <div className="conteiner-1">
          <SortButton onSort={handleSort} onClearSort={clearSort} />
          <button className="filters" onClick={() => setShowFilters(!showFilters)}>
            <IoFilterOutline />
            Filters
          </button>
  
          {showFilters && (
            <div className="filter-options">
              <h3>Filter by:</h3>
              <label>
                <input type="radio" name="filterType" value="city" checked={filterType === "city"} onChange={() => setFilterType("city")} />
                City
              </label>
              <label>
                <input type="radio" name="filterType" value="country" checked={filterType === "country"} onChange={() => setFilterType("country")} />
                Country
              </label>
              <label>
                <input type="radio" name="filterType" value="institution" checked={filterType === "institution"} onChange={() => setFilterType("institution")} />
                Collecting Institution
              </label>
              <input
                type="text"
                className="search-location"
                placeholder={`Enter ${filterType}...`}
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleFilterChange(e)}
              />
              <div className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-black" onClick={clearFilters}>
                Clear Filters
              </div>
            </div>
          )}
  
          <input
            type="text"
            className="search-artist"
            placeholder="Search the artwork"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchArtworks()}
          />
          <button className="search" onClick={searchArtworks}>
            <CiSearch />
          </button>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="h-[38px] ml-2 px-3 text-lg text-gray-500 border border-gray-300 hover:bg-gray-200 transition"
              style={{ fontWeight: "bold" }}
            >
              ×
            </button>
          )}
        </div>
      </div>
  
      {/* MAIN PANEL */}
      {isMobile ? (
        mobileDetailOpen && selectedArtwork ? (
          // 📱 MOBILE — DETAIL VIEW
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto p-4 pt-[250px]">

            <button
              onClick={() => setMobileDetailOpen(false)}
              className="mb-4 text-lg text-black font-medium flex items-center"
            >
              <span className="mr-2">←</span> Back to list
            </button>
  
            <h2 className="text-2xl font-bold mb-4">{selectedArtwork.title}</h2>
            <img
              src={
                selectedArtwork.imageUrl ||
                selectedArtwork._links?.image?.href?.replace("{image_version}", "large")
              }
              alt={selectedArtwork.title}
              className="w-full rounded-md mb-4"
            />
            <p className="mb-2"><strong>Author:</strong> {selectedArtwork.artistName}</p>
            <p className="mb-2"><strong>Category:</strong> {selectedArtwork.category}</p>
            <p className="mb-2"><strong>Medium:</strong> {selectedArtwork.medium}</p>
            <p className="mb-2"><strong>Date:</strong> {selectedArtwork.date}</p>
            <p className="mb-2"><strong>City:</strong> {city}</p>
            <p className="mb-2"><strong>Country:</strong> {country}</p>
  
            {selectedArtwork.collecting_institution && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Location:</h3>
                <iframe
                  width="100%"
                  height="200"
                  className="rounded"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBHPqrSQOIM_ckEIydaWG4UnGL9iKQQUOM&q=${encodeURIComponent(
                    selectedArtwork.collecting_institution
                  )}`}
                />
              </div>
            )}
          </div>
        ) : (
          // 📱 MOBILE — LIST VIEW
          <div
            className="w-full h-[92%] mt-[8%] px-3 overflow-y-auto"
            onScroll={handleScroll}
          >
            <div>
              {loading && artworks.length === 0 && dbArtworks.length === 0 ? (
                <p>Loading...</p>
              ) : (
                (useDatabase ? dbArtworks : artworks)?.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="group flex items-center relative w-[97.5%] h-[150px] overflow-auto scrollbar-hide mb-2 hover:rounded-lg bg-white opacity-100 transition-transform duration-300 ease-in-out hover:scale-105  hover:border-[#a55d2a]"
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    {artwork._links?.image ? (
                      <img
                        className="h-[150px] w-[135px] group-hover:rounded-lg object-cover mr-[10px]"
                        src={artwork._links.image.href.replace("{image_version}", "large")}
                        alt={artwork.title}
                      />
                    ) : (
                      <img
                        className="h-[150px] w-[135px] group-hover:rounded-lg object-cover mr-[10px]"
                        src={artwork.imageUrl}
                        alt={artwork.title}
                      />
                    )}
                    <div className="textual-descrp">
                      <h1><strong>{artwork.title}</strong></h1>
                      <p><strong>Author:</strong> {artwork.artistName || artwork.author}</p>
                      <p><strong>Category:</strong> {artwork.category}</p>
                    </div>
                  </div>
                ))
              )}
              {isFetchingMore && <p className="ml-5">Loading more...</p>}
            </div>
          </div>
        )
      ) : (
        // 💻 DESKTOP — LIST + DETAILS
        <>
          {/* LEFT — LIST */}
          <div
            className="w-1/3 h-[69%] mt-[4.7%] ml-3 mr-5 overflow-auto scrollbar-hide rounded-lg overflow-y-auto"
            onScroll={handleScroll}
          >
            <div>
              {loading && artworks.length === 0 && dbArtworks.length === 0 ? (
                <p>Loading...</p>
              ) : (
                (useDatabase ? dbArtworks : artworks)?.map((artwork) => (
                  <div
                    key={artwork.id}
                    className="group flex items-center relative w-[97.5%] h-[150px] overflow-auto scrollbar-hide mb-2 hover:rounded-lg bg-white opacity-100 transition-transform duration-300 ease-in-out hover:scale-105  hover:border-[#a55d2a]"
                    onClick={() => handleArtworkClick(artwork)}
                  >
                    {artwork._links?.image ? (
                      <img
                        className="h-[150px] w-[135px] group-hover:rounded-lg object-cover mr-[10px]"
                        src={artwork._links.image.href.replace("{image_version}", "large")}
                        alt={artwork.title}
                      />
                    ) : (
                      <img
                        className="h-[150px] w-[135px] group-hover:rounded-lg object-cover mr-[10px]"
                        src={artwork.imageUrl}
                        alt={artwork.title}
                      />
                    )}
                    <div className="textual-descrp">
                      <h1><strong>{artwork.title}</strong></h1>
                      <p><strong>Author:</strong> {artwork.artistName || artwork.author}</p>
                      <p><strong>Category:</strong> {artwork.category}</p>
                    </div>
                  </div>
                ))
              )}
              {isFetchingMore && <p className="ml-5">Loading more...</p>}
            </div>
          </div>
  
          {/* RIGHT — DETAIL PANEL */}
          <div
            className={`w-2/3 h-[69%] z-20 mt-[4.7%] mr-4 p-4 rounded-lg overflow-auto text-xl 
              ${!selectedArtwork ? "bg-gray-200 bg-opacity-70" : "bg-white"}`}
          >
            {!selectedArtwork ? (
              <div className="flex items-center text-4xl justify-center h-full text-black opacity-70 font-serif italic">
                <p>Select an artwork to explore its details.</p>
              </div>
            ) : (
              <div className="text-black text-xl">
                <div className="flex flex-row gap-6 mb-6">
  {/* Left column (Image) */}
  <div className="flex-1 flex justify-center items-start">
    <img
      src={
        selectedArtwork.imageUrl ||
        selectedArtwork._links?.image?.href?.replace("{image_version}", "large")
      }
      alt={selectedArtwork.title}
    />
  </div>

  {/* Right column (Details) */}
  <div className="flex-1">
    <h2 className="text-2xl font-bold mb-4">{selectedArtwork.title}</h2>

    <p><strong>Author:</strong> {selectedArtwork.artistName}</p>
    <p><strong>Category:</strong> {selectedArtwork.category}</p>
    <p><strong>Medium:</strong> {selectedArtwork.medium}</p>
    <p><strong>Date:</strong> {selectedArtwork.date}</p>
    <p><strong>Dimensions (cm):</strong> {selectedArtwork.dimensions?.cm?.text || "Not available"}</p>
    <p><strong>Collecting Institution:</strong> {selectedArtwork.collecting_institution || "Not available"}</p>

    {/* Rating */}
    {user && (
      <div className="mt-8">
        {!userRating || isEditing ? (
          <>
            <h3 className="text-lg font-semibold">
              {isEditing ? "Edit your rating" : "Rate this artwork"}
            </h3>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((num) =>
                num <= (hoverRating || rating) ? (
                  <FaStar
                    key={num}
                    size={25}
                    color="#facc15"
                    onClick={() => setRating(num)}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer"
                  />
                ) : (
                  <FaRegStar
                    key={num}
                    size={25}
                    onClick={() => setRating(num)}
                    onMouseEnter={() => setHoverRating(num)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="cursor-pointer"
                  />
                )
              )}
            </div>
            <textarea
              className="w-full mt-4 p-2 text-sm text-black rounded border border-gray-300 placeholder:text-sm placeholder:italic"
              placeholder="Leave a comment..."
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <div className="flex flex-wrap items-center space-x-3 mt-2">
              <button
                className="px-3 py-1 text-sm font-medium text-white bg-[#2e2e2e] border-[#2e2e2e] rounded-md hover:bg-[#1f1f1f] transition"
                onClick={handleSubmitRating}
                disabled={rating === 0}
              >
                {userRating ? "Update Rating" : "Submit Rating"}
              </button>
              {userRating && isEditing && (
                <>
                  <button
                    className="px-3 py-1 text-sm text-red-600 border border-red-400 rounded-md hover:bg-red-100 transition"
                    onClick={handleDeleteRating}
                  >
                    Delete Rating
                  </button>
                  <button
                    className="px-3 py-1 text-sm text-gray-600 border border-gray-400 rounded-md hover:bg-gray-100 transition"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold">Your rating of this artwork</h3>
            <div className="flex space-x-2 mt-2">
              {[1, 2, 3, 4, 5].map((num) =>
                num <= userRating.rating ? (
                  <FaStar key={num} size={25} color="#facc15" />
                ) : (
                  <FaRegStar key={num} size={25} />
                )
              )}
            </div>
            <p className="mt-2 text-sm text-gray-700 italic">“{userRating.comment}”</p>
            <button
              className="mt-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-400 rounded-md hover:bg-gray-100 transition"
              onClick={() => setIsEditing(true)}
            >
              Edit Rating
            </button>
          </>
        )}

        {ratingMessage && (
          <p className="mt-2 text-sm text-green-600">{ratingMessage}</p>
        )}
      </div>
    )}
  </div>
</div>

{/* Location */}
<div className="mt-6">
  <h3 className="text-2xl font-semibold">Location</h3>
  <p><strong>City:</strong> {city}</p>
  <p><strong>Country:</strong> {country}</p>

  {selectedArtwork.collecting_institution && (
    <div className="mt-3">
      <iframe
        width="100%"
        height="250"
        style={{ border: "0", borderRadius: "10px" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBHPqrSQOIM_ckEIydaWG4UnGL9iKQQUOM&q=${encodeURIComponent(
          selectedArtwork.collecting_institution
        )}`}
      />
      <a
        href={`https://www.google.com/maps/search/${encodeURIComponent(selectedArtwork.collecting_institution)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline mt-2 inline-block"
      >
        📍 View on Google Maps
      </a>
    </div>
  )}
</div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
  
}

export default Artworks1;
