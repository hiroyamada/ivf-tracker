# IVF Tracker

A beautiful, Apple Health-inspired mobile app for tracking your IVF journey. Track basal body temperature, menstrual cycles, medications, test results, and clinic procedures all in one place.

## Features

- **Basal Body Temperature Tracking**: Record and visualize your daily temperature with interactive charts
- **Cycle Tracking**: Monitor your menstrual cycle with predictions for next period and ovulation
- **Medication Log**: Track IVF medications with dosage and type
- **Test Results**: Log ovulation and pregnancy test results
- **Clinic Procedures**: Record procedures and appointments with notes
- **Smart Dashboard**: See the most relevant metric at a glance
- **Beautiful Design**: Clean, Apple Health-inspired interface

## Tech Stack

- React Native with Expo
- React Navigation for screen navigation
- AsyncStorage for local data persistence
- React Native Chart Kit for data visualization
- React Native SVG for custom graphics

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ivf-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the app:
   ```bash
   npm start
   ```

4. Run on your device:
   - **iOS**: Press `i` in the terminal or scan the QR code with the Expo Go app
   - **Android**: Press `a` in the terminal or scan the QR code with the Expo Go app
   - **Web**: Press `w` in the terminal

## Usage

### Adding Data

1. Tap the "+ Add Data" button on the home screen
2. Select the type of data you want to track
3. Fill in the required information
4. Tap "Done" to save

### Viewing Details

Tap on any metric card on the home screen to view detailed information and charts for that metric.

### Data Tracked

- **Temperature**: Basal body temperature in °C
- **Period**: Start and end dates of menstruation
- **Intercourse**: Log dates for fertility tracking
- **Medications**: Name, type, dosage, and unit
- **Ovulation Tests**: Results (negative, positive, peak)
- **Pregnancy Tests**: Results (negative, positive)
- **Clinic Procedures**: Procedure name and notes

## Project Structure

```
ivf-tracker/
├── App.js                      # Main app entry point with navigation
├── app.json                    # Expo configuration
├── package.json                # Dependencies
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── AddDataModal.js     # Modal for adding new data
│   │   ├── LineChart.js        # Full-size chart component
│   │   ├── MetricCard.js       # Card component for metrics
│   │   └── MiniChart.js        # Mini chart for cards
│   ├── screens/                # App screens
│   │   ├── HomeScreen.js       # Main dashboard
│   │   ├── TemperatureScreen.js
│   │   ├── CycleScreen.js
│   │   ├── MedicationsScreen.js
│   │   ├── TestsScreen.js
│   │   └── ClinicScreen.js
│   ├── styles/                 # Styling and theming
│   │   └── theme.js            # Colors, typography, spacing
│   └── utils/                  # Utility functions
│       ├── storage.js          # AsyncStorage operations
│       └── helpers.js          # Helper functions
└── assets/                     # Images and icons
```

## Data Privacy

All data is stored locally on your device using AsyncStorage. No data is transmitted to external servers. Your IVF journey data remains private and secure on your device.

## License

ISC
