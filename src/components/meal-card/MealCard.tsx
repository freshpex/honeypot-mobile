import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { skeuo } from "@/shared/theme";

export type MealCardProps = {
  imageUri?: string;
  name?: string;
  onPress?: () => void;
  price?: string;
  protein?: string;
  tags?: string[];
  testID?: string;
};

export const MealCard = ({
  imageUri,
  name = "Avocado Toast & Eggs",
  onPress,
  price = "N2,800",
  protein = "18g protein",
  tags = ["Vegetarian"],
  testID,
}: MealCardProps) => (
  <Pressable onPress={onPress} style={styles.card} testID={testID}>
    <View style={styles.imageWrap}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons color="#FF4A17" name="restaurant-outline" size={30} />
        </View>
      )}
      <View style={styles.tags}>
        {tags.slice(0, 2).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
    <View style={styles.body}>
      <Text numberOfLines={1} style={styles.name}>
        {name}
      </Text>
      <Text numberOfLines={2} style={styles.description}>
        Freshly prepared and portioned for a balanced day.
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{protein}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  </Pressable>
);

const styles = StyleSheet.create({
  body: {
    padding: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 13,
    borderTopWidth: 1,
    elevation: 5,
    overflow: "hidden",
    ...skeuo.card,
  },
  description: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  image: {
    height: "100%",
    width: "100%",
  },
  imageWrap: {
    aspectRatio: 1.13,
    backgroundColor: "#F2EFED",
    overflow: "hidden",
  },
  meta: {
    color: "#8B8580",
    fontSize: 10,
    fontWeight: "700",
  },
  name: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  placeholderImage: {
    alignItems: "center",
    backgroundColor: "#FFF0E9",
    flex: 1,
    justifyContent: "center",
  },
  price: {
    color: "#FF4A17",
    fontSize: 12,
    fontWeight: "900",
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.92)",
    borderColor: "#FFFFFF",
    borderRadius: 8,
    borderTopWidth: 1,
    elevation: 2,
    paddingHorizontal: 7,
    paddingVertical: 4,
    ...skeuo.pressed,
  },
  tagText: {
    color: "#4F4640",
    fontSize: 8,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  tags: {
    flexDirection: "row",
    gap: 5,
    left: 7,
    position: "absolute",
    top: 7,
  },
});

