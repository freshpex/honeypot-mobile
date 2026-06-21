import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EmptyState, PaginationControls, Screen } from "@/components";
import { usePagination } from "@/shared/hooks";
import { createThemedStyleSheet, resolveThemeColor, skeuo } from "@/shared/theme";
import {
  notificationsService,
  type NotificationItem,
  type NotificationPreference,
} from "../services";

export const NotificationsScreen = () => {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string>();
  const notificationPages = usePagination(items);

  const load = useCallback(async () => {
    try {
      const response = await notificationsService.getNotifications(1, 100);
      setItems(response.items);
      setPreferences(response.preferences);
      setUnreadCount(response.unreadCount);
      setError(undefined);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load notifications.");
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load]);

  const preferenceRows = useMemo(() => preferences, [preferences]);

  const markRead = async (notificationId: string) => {
    const updated = await notificationsService.markRead(notificationId);
    setItems((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const markAll = async () => {
    await notificationsService.markAllRead();
    setItems((current) => current.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  };

  const togglePreference = async (
    preference: NotificationPreference,
    channel: "email" | "push" | "whatsapp",
  ) => {
    if (preference.locked) return;
    const updated = await notificationsService.updatePreference(preference.category, {
      [channel]: !preference[channel],
    });
    setPreferences((current) =>
      current.map((item) => (item.category === updated.category ? updated : item)),
    );
  };

  return (
    <Screen>
      <View style={styles.summaryCard}>
        <View style={styles.summaryIcon}>
          <Ionicons color={resolveThemeColor("#FF4A17")} name="notifications-outline" size={22} />
        </View>
        <View style={styles.flex}>
          <Text style={styles.summaryTitle}>{unreadCount} unread</Text>
          <Text style={styles.summarySubtitle}>Meal, delivery, subscription, and reward alerts.</Text>
        </View>
        <Pressable onPress={() => void markAll()} style={styles.markAllButton}>
          <Text style={styles.markAllText}>Read all</Text>
        </Pressable>
      </View>

      {error ? (
        <Pressable onPress={() => void load()} style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retryText}>Tap to retry</Text>
        </Pressable>
      ) : null}

      <Text style={styles.sectionTitle}>Inbox</Text>
      <View style={styles.stack}>
        {notificationPages.pageItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={() => {
              if (!item.read) void markRead(item.id);
            }}
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
          >
            <View style={styles.notificationHeader}>
              <View style={styles.categoryPill}>
                <Text style={styles.categoryText}>{item.category}</Text>
              </View>
              <Text style={styles.dateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.notificationTitle}>{item.title}</Text>
            <Text style={styles.notificationBody}>{item.body}</Text>
          </Pressable>
        ))}
        {!items.length ? (
          <EmptyState
            icon="notifications-outline"
            message="Subscription, meal, delivery, wallet, and referral updates will appear here."
            title="No notifications yet"
          />
        ) : null}
        <PaginationControls
          canGoNext={notificationPages.canGoNext}
          canGoPrevious={notificationPages.canGoPrevious}
          onNext={notificationPages.goNext}
          onPrevious={notificationPages.goPrevious}
          page={notificationPages.page}
          totalPages={notificationPages.totalPages}
        />
      </View>

      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.stack}>
        {preferenceRows.map((preference) => (
          <View key={preference.category} style={styles.preferenceCard}>
            <View style={styles.preferenceHeader}>
              <Text style={styles.preferenceTitle}>{preference.category}</Text>
              {preference.locked ? <Text style={styles.lockedText}>Required</Text> : null}
            </View>
            <View style={styles.toggleRow}>
              {(["push", "email", "whatsapp"] as const).map((channel) => {
                const active = preference[channel];
                return (
                  <Pressable
                    disabled={preference.locked}
                    key={channel}
                    onPress={() => void togglePreference(preference, channel)}
                    style={[
                      styles.togglePill,
                      active && styles.togglePillActive,
                      preference.locked && styles.togglePillLocked,
                    ]}
                  >
                    <Text style={[styles.toggleText, active && styles.toggleTextActive]}>{channel}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </Screen>
  );
};

const styles = createThemedStyleSheet({
  categoryPill: {
    backgroundColor: "#FFF3EE",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    color: "#C8320D",
    fontSize: 9,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  dateText: {
    color: "#817B75",
    fontSize: 10,
    fontWeight: "700",
  },
  errorCard: {
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 14,
    padding: 12,
    ...skeuo.card,
  },
  errorText: {
    color: "#C8320D",
    fontSize: 12,
    fontWeight: "800",
  },
  flex: {
    flex: 1,
  },
  lockedText: {
    color: "#817B75",
    fontSize: 10,
    fontWeight: "800",
  },
  markAllButton: {
    backgroundColor: "#FF4A17",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...skeuo.action,
  },
  markAllText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "900",
  },
  notificationBody: {
    color: "#706A65",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 7,
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 13,
    ...skeuo.card,
  },
  notificationHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 10,
  },
  preferenceCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 13,
    ...skeuo.card,
  },
  preferenceHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  preferenceTitle: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  retryText: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  sectionTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
    marginTop: 4,
  },
  stack: {
    gap: 10,
    marginBottom: 18,
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
    padding: 15,
    ...skeuo.deepCard,
  },
  summaryIcon: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    height: 44,
    justifyContent: "center",
    width: 44,
    ...skeuo.pressed,
  },
  summarySubtitle: {
    color: "#817B75",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  summaryTitle: {
    color: "#171513",
    fontSize: 18,
    fontWeight: "900",
  },
  togglePill: {
    alignItems: "center",
    backgroundColor: "#FAF9F8",
    borderColor: "#E8E2DD",
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    paddingVertical: 8,
  },
  togglePillActive: {
    backgroundColor: "#FFE8DF",
    borderColor: "#FF4A17",
  },
  togglePillLocked: {
    opacity: 0.74,
  },
  toggleRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  toggleText: {
    color: "#706A65",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "capitalize",
  },
  toggleTextActive: {
    color: "#FF4A17",
  },
  unreadCard: {
    borderColor: "#FF4A17",
  },
});
