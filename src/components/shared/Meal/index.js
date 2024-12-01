
// Change meal 
import React from 'react';
import PropTypes from 'prop-types';
import Tag from '../Tag';
import './Meal.css';

// Set CSS style for button
const Meal = (props) => (
  <div className="Meal" style={{ position: "relative" }}>
    <div className="Meal__replace">
      <button
        className="Meal__replace__button"
        style={{
          backgroundColor: "#87CEEB",
          color: "#fff",
          border: "none",
          padding: "8px 12px",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#B0E2FF";
          e.target.style.color = "#000";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#87CEEB";
          e.target.style.color = "#fff";
          e.target.style.transform = "scale(1)";
        }}
        onClick={() => props.onReplace(props.type)}
      >
        Replace Meal
      </button>
    </div>
    <a href={props.url} target="_blank" rel="noreferrer">
      <div className="Meal__head">{props.type}</div>
      <div className="Meal__content">
        <div className="Meal__content__img">
          <img src={props.imgSrc} alt="Unavailable" />
        </div>
        <div className="Meal__content__desc">
          <h2 className="Meal__content__desc--heading">{props.heading}</h2>
          <h4 className="Meal__content__desc--source">{props.source}</h4>
        </div>
        <div className="Meal__content__labels">
          {props.tags.map((tag, i) => (
            <Tag name={tag} key={`Tag__${i}`} />
          ))}
        </div>
      </div>
    </a>
  </div>
);

Meal.propTypes = {
  url: PropTypes.string,
  type: PropTypes.string,
  imgSrc: PropTypes.string,
  heading: PropTypes.string,
  source: PropTypes.string,
  tags: PropTypes.array,
  onReplace: PropTypes.func,
};

export default Meal;
