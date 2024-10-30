import { StyleSheet, Text, View } from 'react-native';
import Sport24News from './Sport24News';
import SdnaNews from './SdnaNews'
import GazzettaNews from './GazzettaNews'

export default function App() {
  return (
    <View style={styles.container}>
      <Sport24News></Sport24News>
      <SdnaNews></SdnaNews>
      <GazzettaNews></GazzettaNews>
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
