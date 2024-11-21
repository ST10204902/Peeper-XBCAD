# PEEPER - Student Community Service Tracking System

[![CI](https://github.com/ST10204902/Peeper-XBCAD/actions/workflows/main.yml/badge.svg)](https://github.com/ST10204902/Peeper-XBCAD/actions/workflows/main.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ST10204902_Peeper-XBCAD&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ST10204902_Peeper-XBCAD)

## Overview

PEEPER is a comprehensive mobile application designed to monitor and verify community service hours completed by Bachelor of Education students. The system provides real-time location tracking, organization management, and reporting capabilities while ensuring data security and user privacy.

## Features

- **Real-time Location Tracking**: GPS monitoring of student locations during service sessions
- **Organization Management**: Curated list of approved community service organizations
- **Session History**: Interactive maps showing past service locations and durations
- **PDF Report Generation**: Detailed service hour reports and verifications
- **Dark/Light Theme**: Customizable UI appearance
- **Emergency Contacts**: Quick access to important safety information
- **Cross-Platform**: Supports both iOS and Android devices

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and deployment:

- **Automated Testing**: Jest unit tests run on every push
- **Code Quality**: SonarCloud analysis for code quality and security
- **Security Scanning**: Dependency vulnerability checks
- **Build Verification**: Expo build verification for iOS and Android

## Prerequisites

- Node.js (v20 or later)
- npm (included with Node.js)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on mobile device
- iOS/Android development environment for native builds
- Firebase account for backend services
- Clerk account for authentication

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ST10204902/Peeper-XBCAD.git
cd Peeper-XBCAD
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Configure environment variables:
```bash
cp .env.example .env
```
Edit 

.env

 with your API keys and configuration

## Running the App

### Development Mode

Start the Expo development server:
```bash
npx expo start
```

### iOS Device (Sideloading)

1. Install development certificates:
```bash
npx expo run:ios
```

2. Open Xcode project:
```bash
open ios/PeeperXBCAD.xcworkspace
```

3. Connect iOS device and select as build target
4. Build and run using Xcode

### Android Device (Sideloading)

1. Enable Developer Mode on device
2. Enable USB Debugging
3. Connect device via USB
4. Build and install:
```bash 
npx expo run:android
```

## Development Setup

1. Install IDE extensions:
- ESLint
- Prettier
- React Native Tools

2. Configure Firebase:
- Create new Firebase project
- Add iOS/Android apps
- Download configuration files

3. Configure Clerk:
- Create Clerk application
- Set up OAuth providers
- Add API keys to environment

## Environment Configuration

Required environment variables:
```
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key 
```

## Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## Team

- **Anneme Holzhausen (PM)** - ST10144453
- **Jasper Van Niekerk** - ST10071737
- **Joshua Harvey** - ST10180919
- **Michael French** - ST10195824
- **Nicholas Meyer** - ST10204902
- **David Mellors** - ST10241466

## Related Links

- [Web Portal](https://peeper-portal.vercel.app/)
- [GitHub Repository](https://github.com/ST10204902/Peeper-XBCAD)

## License

This project is licensed under the [MIT License](LICENSE).