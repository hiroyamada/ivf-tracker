import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/styles/theme';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TemperatureScreen from './src/screens/TemperatureScreen';
import CycleScreen from './src/screens/CycleScreen';
import MedicationsScreen from './src/screens/MedicationsScreen';
import TestsScreen from './src/screens/TestsScreen';
import ClinicScreen from './src/screens/ClinicScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.cardBackground,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: colors.secondary,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          headerBackTitleVisible: false,
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Temperature"
          component={TemperatureScreen}
          options={{ title: 'Temperature' }}
        />
        <Stack.Screen
          name="Cycle"
          component={CycleScreen}
          options={{ title: 'Cycle Tracking' }}
        />
        <Stack.Screen
          name="Medications"
          component={MedicationsScreen}
          options={{ title: 'Medications' }}
        />
        <Stack.Screen
          name="Tests"
          component={TestsScreen}
          options={{ title: 'Test Results' }}
        />
        <Stack.Screen
          name="Clinic"
          component={ClinicScreen}
          options={{ title: 'Clinic Procedures' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
