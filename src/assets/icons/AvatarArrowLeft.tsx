import Svg, { Path } from "react-native-svg";

/**
 * SVG Icon for the AvatarComponent's left arrow
 * @param SizeAndColor the size and color of the svg
 * @returns a created icon with the specified size and color
 */
export default function AvatarArrowLeft({
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
        d="M34.3748 60.3126L53.4831 79.4209C54.6556 80.5928 56.2456 81.251 57.9033 81.2506C59.561 81.2502 61.1507 80.5913 62.3227 79.4188C63.4946 78.2464 64.1527 76.6564 64.1523 74.9986C64.152 73.3409 63.493 71.7512 62.3206 70.5792L43.2123 51.4751C43.0183 51.2816 42.8643 51.0517 42.7593 50.7986C42.6543 50.5455 42.6002 50.2741 42.6002 50.0001C42.6002 49.7261 42.6543 49.4547 42.7593 49.2016C42.8643 48.9485 43.0183 48.7186 43.2123 48.5251L62.3206 29.4209C63.493 28.249 64.152 26.6593 64.1523 25.0016C64.1527 23.3438 63.4946 21.7538 62.3227 20.5813C61.1507 19.4089 59.561 18.7499 57.9033 18.7496C56.2456 18.7492 54.6556 19.4073 53.4831 20.5792L34.3748 39.6876C31.6447 42.4252 30.1115 46.1338 30.1115 50.0001C30.1115 53.8664 31.6447 57.5749 34.3748 60.3126Z"
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
