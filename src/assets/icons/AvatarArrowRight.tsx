import Svg, { Path } from "react-native-svg";

/**
 * SVG Icon for the AvatarComponent' right arrow
 * @param SizeAndColor the size and color of the svg
 * @returns a created icon with the specified size and color
 */
export default function AvatarArrowRight({
  size, // Size in px
  color, // Color
}: {
  size: number;
  color: string;
}) {
  const viewBoxValue = `0 0 ${100} ${100}`;

  return (
    <Svg height={size} width={size} viewBox={viewBoxValue}>
      <Path
        d="M65.6252 39.6874L46.5169 20.5791C45.3444 19.4072 43.7544 18.749 42.0967 18.7494C40.439 18.7498 38.8493 19.4087 37.6773 20.5812C36.5054 21.7536 35.8473 23.3436 35.8477 25.0014C35.848 26.6591 36.507 28.2488 37.6794 29.4208L56.7877 48.5249C56.9817 48.7184 57.1357 48.9483 57.2407 49.2014C57.3457 49.4545 57.3998 49.7259 57.3998 49.9999C57.3998 50.2739 57.3457 50.5453 57.2407 50.7984C57.1357 51.0515 56.9817 51.2814 56.7877 51.4749L37.6794 70.5791C36.507 71.751 35.848 73.3407 35.8477 74.9984C35.8473 76.6562 36.5054 78.2462 37.6773 79.4187C38.8493 80.5911 40.439 81.2501 42.0967 81.2504C43.7544 81.2508 45.3444 80.5927 46.5169 79.4208L65.6252 60.3124C68.3553 57.5748 69.8885 53.8662 69.8885 49.9999C69.8885 46.1336 68.3553 42.4251 65.6252 39.6874Z"
        stroke={color}
        fill={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
// End of file
