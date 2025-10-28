import React from 'react';

export const Text = ({ children, className = "", variant = "body" }) => {
  const variants = {
    h1: "text-xl font-bold",
    h2: "text-base font-semibold",
    body: "text-sm",
    caption: "text-xs"
  };
  return <p className={`${variants[variant]} ${className}`}>{children}</p>;
};