import { AppText } from "@/design-system/components";
import { Party } from "@/types/party";
import React from "react";
import { StyleSheet, View } from "react-native";

const AVATAR_COLORS = [
  "#DBEAFE", // Blue
  "#DCFCE7", // Green
  "#F3E8FF", // Purple
  "#FFEDD5", // Orange
  "#FCE7F3", // Pink
  "#E0F2FE", // Light Blue
];

const AVATAR_TEXT_COLORS = [
  "#1E40AF", // Blue
  "#15803D", // Green
  "#7E22CE", // Purple
  "#C2410C", // Orange
  "#BE185D", // Pink
  "#0369A1", // Light Blue
];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return {
    bg: AVATAR_COLORS[index],
    text: AVATAR_TEXT_COLORS[index],
  };
}

const PartyAvatar = ({ party, size = 48 }: { party: Party; size?: number }) => {
  const avatarColors = getAvatarColor(party.full_name);
  const initial = party.full_name.charAt(0).toUpperCase();

  return (
    <View
      style={[
        styles.avatar,
        { backgroundColor: avatarColors.bg, width: size, height: size },
      ]}
    >
      <AppText
        style={{
          color: avatarColors.text,
          fontSize: size / 2,
          fontWeight: "600",
        }}
      >
        {initial}
      </AppText>
    </View>
  );
};

export default PartyAvatar;

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
});
