// screens/PrivacyPolicyScreen.tsx
import { View, ScrollView, StyleSheet, Text, SafeAreaView } from 'react-native';
import { PolicySectionComponent } from '../../components/PolicySectionComponent';
import styles from '../../styles/PolicyStyle';

export default function PrivacyPolicyScreen() {
  const policySections: PolicySection[] = [
    {
      heading: "Information We Collect",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id metus quam. In imperdiet lacinia libero vitae egestas. Phasellus scelerisque neque id congue bibendum. Interdum et malesuada fames ac ante ipsum primis in faucibus."
    },
    {
      heading: "How We Use Your Information",
      content: "Nunc placerat lorem libero, quis accumsan erat feugiat ac. Fusce nec tristique massa. Ut rutrum, arcu sed lobortis venenatis, elit metus fringilla velit, at facilisis orci est sit amet turpis. Vestibulum dignissim magna non eros facilisis, eu sagittis purus dapibus."
    },
    {
      heading: "Data Security",
      content: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit."
    },
    {
      heading: "Your Rights",
      content: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium."
    },
    {
      heading: "Contact Us",
      content: "Si vous avez des questions concernant cette politique de confidentialité, veuillez nous contacter à privacy@example.com ou par téléphone au +1 234 567 890. Notre équipe sera ravie de vous aider."
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>PRIVACY POLICY</Text>
        
        <Text style={styles.lastUpdated}>Last Updated: October 21, 2024</Text>
        
        {policySections.map((section) => (
        <PolicySectionComponent
          key={section.heading}
          heading={section.heading}
          content={section.content}
        />
        ))}
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}