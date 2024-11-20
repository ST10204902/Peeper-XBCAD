import "react-native-gesture-handler/jestSetup";

// Mock react-native-reanimated
jest.mock("react-native-reanimated", () => ({
  default: {
    call: () => {},
    createAnimatedComponent: component => component,
    event: () => {},
    timing: () => ({ start: () => {} }),
    Value: () => ({ setValue: () => {} }),
    Node: () => ({}),
  },
  // Create mock components instead of using imported ones
  View: "RNRView",
  Text: "RNRText",
  ScrollView: "RNRScrollView",
  Image: "RNRImage",
  Transitioning: {
    View: "RNRTransitioningView",
  },
  Transition: {
    Together: "Together",
    Out: "Out",
    In: "In",
  },
}));

// Mock NativeAnimatedHelper
jest.mock("react-native/Libraries/Animated/NativeAnimatedHelper");
