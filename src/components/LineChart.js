import React from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart as RNLineChart } from 'react-native-chart-kit';
import { colors, typography } from '../styles/theme';

const screenWidth = Dimensions.get('window').width;

const LineChart = ({ data, labels, color = colors.chartLine, yAxisSuffix = '' }) => {
  const chartConfig = {
    backgroundColor: colors.cardBackground,
    backgroundGradientFrom: colors.cardBackground,
    backgroundGradientTo: colors.cardBackground,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(142, 142, 147, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: color,
    },
    propsForLabels: {
      ...typography.caption1,
    },
  };

  const chartData = {
    labels: labels || [],
    datasets: [
      {
        data: data && data.length > 0 ? data : [0],
        color: (opacity = 1) => color,
        strokeWidth: 2,
      },
    ],
  };

  return (
    <View>
      <RNLineChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
        yAxisSuffix={yAxisSuffix}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
      />
    </View>
  );
};

export default LineChart;
