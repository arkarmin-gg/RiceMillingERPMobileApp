import {
  AppText,
  PrimaryButton,
  Screen,
  TextField,
} from "@/design-system/components";
import { colors, spacing } from "@/design-system/tokens";
import { useAuth } from "@/hooks/use-auth";
import { useToastActions } from "@/hooks/use-toast";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { z } from "zod";

const profileSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export default function EditProfile() {
  const { user, updateProfile, isLoading } = useAuth();
  const { show } = useToastActions();
  const router = useRouter();

  const [fullName, setFullName] = React.useState(user?.full_name || "");
  const [phone, setPhone] = React.useState(user?.phone || "");
  const [profileImage, setProfileImage] = React.useState<string | undefined>(
    user?.profile_image_url as string | undefined,
  );

  const [errors, setErrors] = React.useState<{
    full_name?: string;
    phone?: string;
  }>({});

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setErrors({});
    const result = profileSchema.safeParse({ full_name: fullName, phone });

    if (!result.success) {
      const formattedErrors = result.error.format();
      setErrors({
        full_name: formattedErrors.full_name?._errors[0],
        phone: formattedErrors.phone?._errors[0],
      });
      return;
    }

    try {
      const imageToUpdate =
        profileImage !== user?.profile_image_url ? profileImage : undefined;

      await updateProfile({
        full_name: fullName,
        phone,
        profile_image: imageToUpdate,
      });

      show({
        type: "success",
        title: "Profile Updated",
        message: "Your profile has been updated successfully.",
      });
      router.back();
    } catch (error) {
      // Error handled in updateProfile
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>
            <AppText variant="h2">Edit Profile</AppText>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.avatarSection}>
            <Pressable
              onPress={pickImage}
              style={[styles.avatarContainer, isLoading && { opacity: 0.5 }]}
              disabled={isLoading}
            >
              <Image
                source={
                  profileImage
                    ? { uri: profileImage }
                    : require("../../../assets/images/react-logo.png")
                }
                style={styles.avatar}
                contentFit="cover"
              />
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={20} color="#FFFFFF" />
              </View>
            </Pressable>
            <AppText variant="bodySecondary" style={{ marginTop: spacing.s }}>
              Tap to change photo
            </AppText>
          </View>

          <View style={styles.form}>
            <TextField
              label="Full Name"
              value={fullName}
              onChangeText={setFullName}
              error={errors.full_name}
              placeholder="Enter your full name"
              editable={!isLoading}
            />
            <TextField
              label="Phone Number"
              value={phone}
              onChangeText={setPhone}
              error={errors.phone}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <View style={styles.footer}>
            <PrimaryButton
              label={isLoading ? "Saving..." : "Save Changes"}
              onPress={handleSave}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.l,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.surface,
    backgroundColor: "#E0E0E0",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.background,
  },
  form: {
    marginBottom: spacing.xl,
  },
  footer: {
    marginTop: "auto",
  },
});
