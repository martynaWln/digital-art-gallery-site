import React from 'react';
import './Button_nav.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];
const SIZES = ['btn--medium', 'btn--large'];

export const Button = ({ children, type, onClick, buttonStyle, buttonSize, to }) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];
  const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0];
  const className = `btn ${checkButtonStyle} ${checkButtonSize}`;

  // 🔁 If `to` is passed, render as a <Link>
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  // 🔁 Otherwise, render a standard button
  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  );
};
