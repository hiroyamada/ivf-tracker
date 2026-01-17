import React from 'react';
import { View, Dimensions } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { colors } from '../styles/theme';

const MiniChart = ({ data, width = 120, height = 60, color = colors.chartLine }) => {
  if (!data || data.length === 0) {
    return <View style={{ width, height }} />;
  }

  // Extract values
  const values = data.map(d => parseFloat(d.value) || 0);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue || 1;

  // Calculate points for the polyline
  const points = values.map((value, index) => {
    const x = (index / (values.length - 1 || 1)) * width;
    const y = height - ((value - minValue) / valueRange) * height;
    return `${x},${y}`;
  }).join(' ');

  // Get the last point for highlighting
  const lastIndex = values.length - 1;
  const lastX = (lastIndex / (values.length - 1 || 1)) * width;
  const lastY = height - ((values[lastIndex] - minValue) / valueRange) * height;

  return (
    <Svg width={width} height={height}>
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle
        cx={lastX}
        cy={lastY}
        r="4"
        fill={color}
      />
    </Svg>
  );
};

export default MiniChart;
