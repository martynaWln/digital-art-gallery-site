import React, { useState, useEffect, useContext } from "react";
import "./MyRatings.css";
import { FaStar } from "react-icons/fa";
import { IoFilterOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function MyRatings() {
  const { user } = useContext(AuthContext);
  const [myRatedArtworks, setMyRatedArtworks] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRatings = async () => {
      if (!user) return;

      try {
        const res = await axios.get(`https://dag-backend-production.up.railway.app/ratings/${user.id}`);
        setMyRatedArtworks(res.data);
      } catch (err) {
        console.error("❌ Error fetching ratings:", err);
      }
    };

    fetchRatings();
  }, [user]);

  const handleRatingChange = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const handleArtworkClick = (artworkId) => {
    navigate(`/artworks1?artworkId=${artworkId}`);
  };

  const filteredArtworks = selectedRatings.length
    ? myRatedArtworks.filter((art) => selectedRatings.includes(art.rating))
    : myRatedArtworks;

  return (
    <div className="general">
      <div className="feed-container-rat">
        <div className="top-container">
          <div className="feed-title">My Ratings</div>

          <div className="filter-container">
            <button className="filters-rat" onClick={() => setShowFilters(!showFilters)}>
              <IoFilterOutline /> Filters
            </button>

            {showFilters && (
              <div className="filter-dropdown-box">
                <h4>Filter by rating:</h4>
                <div className="rating-options">
                  {[5, 4, 3, 2, 1].map((num) => (
                    <label key={num} className="rating-option">
                      <input
                        type="checkbox"
                        value={num}
                        checked={selectedRatings.includes(num)}
                        onChange={() => handleRatingChange(num)}
                      />
                      <span className="rating-number">{num}</span>
                      <span className="rating-stars">
                        {[...Array(num)].map((_, i) => (
                          <FaStar key={i} color="#ffcc00" size={12} />
                        ))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 🔥 Lista ocenionych dzieł */}
        <div className="ratings-scroll-wrapper">
          <div className="ratings-list">
            {filteredArtworks.length === 0 ? (
              <p className="no-ratings">You haven't rated any artworks yet.</p>
            ) : (
              filteredArtworks.map((artwork) => (
                <div key={artwork.ratingId} className="rating-item" onClick={() => handleArtworkClick(artwork.artworkId)}>
                  <img src={artwork.artworkImage } alt="No image available" className="rating-img" />
                  <div className="rating-text">
                    <div className="rating-info">
                      <h3 className="rating-title">{artwork.artworkTitle}</h3>
                      <p className="rating-category">{artwork.artworkAuthor || "Unknown Author"}</p>
                    </div>
                    <div className="rating-stars">
                      {[...Array(artwork.rating)].map((_, i) => (
                        <FaStar key={i} size={20} color="#ffcc00" />
                      ))}
                    </div>
                    <div className="rating-comment">“{artwork.comment}”</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default MyRatings;
