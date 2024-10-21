//...............ooooooooooo000000000000 SettingTypes.tsx 000000000000ooooooooooo...............//

/**
 * This file contains TypeScript type definitions and interfaces.
 * TypeScript types are used to define the shape of data, ensuring that variables, function parameters, and return values
 * adhere to expected structures. This helps in catching type-related errors during development, improving code quality
 * and maintainability.
 */

/**
 * Represents an item in a settings section.
 * 
 * @typedef {Object} SettingsSectionItem
 * 
 * @property {string} title - The title of the settings item.
 * @property {() => void} onPress - The function to call when the item is pressed.
 * @property {boolean} [showChevron] - Optional flag to show a chevron icon.
 */
type SettingsSectionItem = {
    title: string;
    onPress: () => void;
    showChevron?: boolean;
  };
  
  type SettingsSection = {
    header: string;
    items: SettingsSectionItem[];
  };
  //...............ooooooooooo000000000000 End Of File 000000000000ooooooooooo...............//
