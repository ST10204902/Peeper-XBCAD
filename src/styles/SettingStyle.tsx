//...............ooooooooooo000000000000 SettingStyle.tsx 000000000000ooooooooooo...............//
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    
    container: {
      flex: 1,
      backgroundColor: '#F9F9F9',
    },
    content: {
      padding: 16,
    },
    sectionContainer: {
      marginBottom: 24,
    },
    title: {
        fontSize: 30,
        color: '#161616',
        marginBottom: 8,
        fontFamily: "Quittance",
        padding: 16,
        paddingTop: 32,
      },
    sectionHeader: {
      fontSize: 26,
      color: '#161616',
      marginBottom: 8,
      fontFamily: "Quittance"
    },
    sectionContent: {
      backgroundColor: 'transparent',
      borderRadius: 12,
      overflow: 'hidden',
    },
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 5,
    },
    itemText: {
      fontFamily: 'Rany-Medium',
      fontSize: 16,
      color: '#5A5A5A',
    },
    chevron: {
      fontSize: 20,
      color: '#5A5A5A',
    },
    borderBottom: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#eee',
    },
    buttonContainer: {
      gap: 12,
    },
  });

  export default styles;
  //...............ooooooooooo000000000000 End Of File 000000000000ooooooooooo...............//
