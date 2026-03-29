# UI/UX Improvement Plan

## Summary
The goal of this task is to review and improve the UI/UX design of the Rice Milling Mobile Application to align with modern mobile app standards. Based on user preferences, the focus will be on **Feedback & Polish** (haptics, skeletons, animations), **Consistency & Usability** (design tokens, form UX, tap targets), and standardized **Text-based Empty States**.

## Current State Analysis
- **Feedback**: The app currently lacks tactile feedback (haptics) for interactions. Loading states rely entirely on generic `ActivityIndicator` spinners, which can feel jarring compared to modern skeleton loaders. Interactive elements lack subtle animations (e.g., scale on press).
- **Consistency**: While the app uses a design system (`tokens.ts`, `components.tsx`), some elements like "Chips" (used for filtering and selection) are duplicated across files (`parties/index.tsx` and `parties/create.tsx`). Tap targets for some smaller elements may fall below the recommended 44x44 points.
- **Empty States**: Empty states are handled inline with simple text (e.g., `<AppText>No parties found</AppText>`), lacking visual hierarchy and consistency across different screens.

## Proposed Changes

### 1. Feedback & Polish
- **Haptic Feedback**: 
  - Integrate `expo-haptics` into core interactive components.
  - Add `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)` to `PrimaryButton`, `SecondaryButton`, `DangerButton`, `IconButton`, and list items (`PartyItem`, `ActionButton`).
- **Skeleton Loaders**:
  - Create a reusable `Skeleton` component in `components/ui/skeleton.tsx` using `react-native-reanimated` for a subtle pulse animation.
  - Replace `ActivityIndicator` with skeleton layouts in list screens: `Home`, `PartiesPage`, `ProductionBatchesPage`, `DispatchesPage`, and `ActivityLogList`.
- **Button Animations**:
  - Update `PrimaryButton`, `SecondaryButton`, and `IconButton` to use a slight scale-down animation on press (using `Pressable` styles or reanimated) to make them feel more tactile.

### 2. Consistency & Usability
- **Tap Targets**:
  - Ensure all `Pressable` and `TouchableOpacity` elements (including icons and chips) have a minimum height and width of 44px to meet mobile accessibility standards.
- **Unified Components**:
  - Extract the inline "Chip" component from `parties/index.tsx` and `parties/create.tsx` into a reusable `Chip` component in `components/ui/chip.tsx`.
- **Form UX**:
  - Ensure consistent `KeyboardAvoidingView` configurations across all create/edit screens.

### 3. Standardized Empty States
- **EmptyState Component**:
  - Create `components/ui/empty-state.tsx`.
  - Design it to accept an `icon` (optional, from `@expo/vector-icons`), `title`, and `description`.
  - Replace inline empty state text in all lists (`FlatList`'s `ListEmptyComponent`) with this new component to ensure consistent spacing, typography, and color.

## Assumptions & Decisions
- We will use `react-native-reanimated` (already in `package.json`) to implement the Skeleton pulse animation, as it provides the best performance for React Native.
- Haptics will be triggered on `onPressIn` or `onPress` depending on the component type to ensure immediate feedback.
- Empty states will remain primarily text-based as requested, but structured with proper typography hierarchy (Title + optional subtitle) and unified margins.

## Verification Steps
1. Verify that pressing buttons and list items triggers a light haptic response on physical devices.
2. Verify that refreshing or initially loading lists displays the new skeleton animations instead of the standard spinner.
3. Verify that empty states across different tabs (Parties, Dispatches, etc.) look visually identical in structure.
4. Verify that all interactive elements are easily tappable (min 44x44 area).
5. Ensure the app builds successfully (`npx expo export -p web` or local run) without TypeScript or linting errors.