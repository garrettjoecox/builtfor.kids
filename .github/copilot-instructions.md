# Built for Kids - React Native Expo App

Built for Kids is a React Native application built with Expo, TypeScript, NativeWind (Tailwind CSS), and Gluestack UI components. It provides educational apps for children with profile-based configurations for parents to customize their kids' experience.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Environment Setup and Dependencies
- Node.js v20.19.4 and npm v10.8.2 are pre-installed and working
- Install dependencies: `npm install` -- takes 3 minutes. NEVER CANCEL. Set timeout to 5+ minutes.
- All Expo and React Native dependencies are managed through package.json

### Build and Development Commands
- Start development server: `npm run start` -- starts Expo development server on port 8081. Takes 30-60 seconds to start. NEVER CANCEL. Set timeout to 3+ minutes.
- Start web development: `npm run web` -- starts web version with DARK_MODE=media environment variable. Takes 30-60 seconds. NEVER CANCEL. Set timeout to 3+ minutes.
- Start Android development: `npm run android` -- launches Android emulator version
- Start iOS development: `npm run ios` -- launches iOS simulator version
- Run linter: `npm run lint` -- uses Biome for code formatting and linting. Takes 2-3 seconds. Currently shows warnings that need fixing.
- Run tests: `npm test` -- uses Jest with watch mode. Currently no test files exist in the project.

### Validation Requirements
**CRITICAL**: After making any changes, ALWAYS run through this complete validation scenario:

1. **Install and Start**: Run `npm install && npm run web` and wait for server to start completely
2. **Manual Testing Scenario**: Navigate to http://localhost:8081 and verify:
   - Main Kids page loads with existing profiles (should see "Garrett" profile with 👨‍💻 emoji)
   - Click the play button next to a profile to navigate to profile page
   - Verify profile page shows greeting and available apps
   - Click "🪙 Coins Math" app to test app navigation
   - Verify app loads (even if showing placeholder content)
3. **Code Quality**: Always run `npm run lint` before committing changes
4. **NEVER CANCEL** any build or development server startup - they may take 3+ minutes initially

## Application Architecture

### Project Structure
```
/app                    - File-based routing (Expo Router)
  /_layout.tsx         - Root layout with navigation setup
  /index.tsx           - Main Kids profiles page
  /kids/[profileName]  - Dynamic profile routes
  /parents/(tabs)      - Parent interface with tabs
/components             - Reusable UI components
  /ui/                 - Gluestack UI component library
/types                 - TypeScript type definitions
  /app.ts              - App configuration types
  /profile.ts          - Profile data types
/constants             - App definitions and defaults
  /Apps.ts             - Available educational apps config
/hooks                 - Custom React hooks
  /useProfiles.ts      - Profile data management
/assets                - Images, icons, and static files
```

### Key Technologies
- **Expo SDK v52.x**: React Native framework with file-based routing
- **TypeScript**: Strict type checking enabled
- **NativeWind v4.x**: Tailwind CSS for React Native styling
- **Gluestack UI**: Component library for consistent UI
- **Biome**: Fast linting and formatting tool
- **Jest**: Testing framework (no tests currently exist)

### Educational Apps System
- Apps are defined in `/constants/Apps.ts` with configurations
- Each app has configurable settings per child profile
- Currently active: "Coins Math" app (others commented out)
- App configurations include difficulty settings, visual options, and parental controls

## Development Workflow

### Making Changes
1. **Setup**: Always run `npm install` first if dependencies changed
2. **Development**: Use `npm run web` for fastest iteration on web
3. **Linting**: Run `npm run lint` frequently - it auto-fixes many issues
4. **Testing**: Manually test by running through the validation scenario above
5. **Type Checking**: TypeScript is strictly configured - fix all type errors

### Common Tasks and File Locations
- **Adding new educational apps**: Modify `/constants/Apps.ts` and create app route in `/app/kids/[profileName]/apps/`
- **UI component changes**: Components are in `/components/ui/` using Gluestack UI patterns
- **Profile system changes**: Update types in `/types/profile.ts` and logic in `/hooks/useProfiles.ts`
- **Styling changes**: Uses NativeWind classes (Tailwind CSS syntax)
- **Navigation changes**: File-based routing in `/app/` directory structure

### Configuration Files
- `package.json`: Dependencies and npm scripts
- `app.json`: Expo app configuration
- `babel.config.js`: Babel configuration with NativeWind and module resolver
- `metro.config.js`: Metro bundler with NativeWind integration
- `tsconfig.json`: TypeScript configuration with strict mode
- `biome.json`: Linting and formatting rules
- `tailwind.config.js`: Tailwind CSS configuration for NativeWind

## Troubleshooting

### Common Issues
- **Linting errors**: Run `npm run lint` to auto-fix most formatting issues. Currently has unused imports/variables that need manual fixing.
- **Development server won't start**: Ensure port 8081 is available. Kill any existing processes and restart.
- **TypeScript errors**: Check imports and type definitions. All types are defined in `/types/` directory.
- **Build failures**: Ensure all dependencies are installed with `npm install`

### Performance Notes
- **npm install**: Takes ~3 minutes on first run
- **Development server startup**: Takes 30-60 seconds, shows dependency warnings (normal)
- **Web builds**: Start quickly but may show dependency version warnings (safe to ignore in development)
- **Linting**: Very fast (~2-3 seconds) but currently shows many warnings needing fixes

### Known Limitations
- No test suite currently exists (Jest configured but no test files)
- Some dependency version mismatches noted by Expo (non-critical for development)
- Several linting warnings exist in current codebase that should be fixed
- Coins Math app shows placeholder content (development in progress)

## Manual Validation Checklist
After making any changes, verify:
- [ ] `npm install` completes successfully (3+ minutes)
- [ ] `npm run web` starts development server (1-2 minutes)
- [ ] Navigate to http://localhost:8081 and main page loads
- [ ] Profile navigation works (click play button on profile)
- [ ] App navigation works (click Coins Math app)
- [ ] `npm run lint` runs without fatal errors
- [ ] TypeScript compilation succeeds (no red errors in editor)