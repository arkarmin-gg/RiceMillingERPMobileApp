import { AppText, Screen } from "@/design-system/components";
import { View } from "react-native";

export default function Home() {
  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <AppText variant="h1">Rice Milling ERP</AppText>
      </View>
    </Screen>
  );
}
