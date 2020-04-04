import React from "react";
import { useSelector } from "react-redux";

export const CounterComponent = () => {
  const counter = useSelector(state => state.reducer);
  return counter;
};
