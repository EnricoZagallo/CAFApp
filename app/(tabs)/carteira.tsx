import { StyleSheet, Text, View } from "react-native";

export default function CarteiraScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Carteira — em breve</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1628",
    justifyContent: "center",
    alignItems: "center",
  },
  text: { color: "#aabbcc", fontSize: 16 },
});
