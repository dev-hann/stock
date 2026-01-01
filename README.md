# stock

A cross-platform application built with gyo.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- For Android: Android Studio and Android SDK
- For iOS: Xcode (macOS only)

### Installation

```bash
cd lib
npm install
```

## Development

```bash
gyo run android
gyo run ios
```

## Build

```bash
gyo build android
gyo build ios
```

## Clean

```bash
gyo clean android
gyo clean all
```

## Project Structure

```
stock/
├── lib/                # React application
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
├── android/            # Android native shell
├── ios/                # iOS native shell
└── gyo.config.json
```
