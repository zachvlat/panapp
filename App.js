import { StyleSheet, Text, View } from 'react-native';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews'

export default function App() {
  return (
    <View style={styles.container}>
      <Sport24News></Sport24News>
      <SdnaNews></SdnaNews>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
