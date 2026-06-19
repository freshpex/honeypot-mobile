import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Polyline, UrlTile } from "react-native-maps";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { formatNaira, useCustomerStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet, skeuo } from "@/shared/theme";
import { ordersService } from "../services";
import type { TrackingResponse } from "../types";

export const OrdersScreen = () => {
  const insets = useSafeAreaInsets();
  const tabs = useMemo(() => ["Active", "Delivered", "Cancelled"], []);
  const orders = useCustomerStore((state) => state.orders);
  const loadOrders = useCustomerStore((state) => state.loadOrders);
  const [activeTab, setActiveTab] = useState("Active");
  const [tracking, setTracking] = useState<TrackingResponse>();
  const [trackingError, setTrackingError] = useState<string>();
  const statusQuery = useMemo(() => activeTab.toLowerCase() as "active" | "delivered" | "cancelled", [activeTab]);

  useEffect(() => {
    void loadOrders(statusQuery);
  }, [loadOrders, statusQuery]);

  const visibleOrders = useMemo(
    () =>
      orders.filter((order) => {
        if (activeTab === "Active") {
          return ["Confirmed", "Preparing", "Out for Delivery"].includes(order.status);
        }
        if (activeTab === "Delivered") return order.status === "Delivered";
        return order.status === "Cancelled";
      }),
    [activeTab, orders],
  );
  const orderRows = useMemo(
    () =>
      visibleOrders.map((order) => ({
            date: order.date,
            id: `#${order.reference}`,
            meal: `${order.items[0]?.name ?? "HoneyPot meal"} x${order.items[0]?.quantity ?? 1}`,
            orderId: order.id,
            status: order.status,
            total: formatNaira(order.total),
            type: order.type,
          })),
    [activeTab, visibleOrders],
  );
  const orderPagination = usePagination(orderRows);

  const openTracking = async (orderId: string) => {
    setTrackingError(undefined);
    try {
      setTracking(await ordersService.getTracking(orderId));
    } catch (error) {
      setTrackingError(error instanceof Error ? error.message : "Unable to load tracking.");
    }
  };

  return (
    <SafeAreaView edges={[]} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.segment}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={[styles.segmentItem, isActive && styles.activeSegmentItem]}
              >
                <Text style={[styles.segmentText, isActive && styles.activeSegmentText]}>
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {orderRows.length ? (
          <View style={styles.orderList}>
            {orderPagination.pageItems.map((order) => (
              <Pressable
                key={order.id}
                onPress={() => void openTracking(order.orderId)}
                style={styles.orderCard}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>{order.id}</Text>
                    <Text style={styles.orderDate}>{order.date}</Text>
                  </View>
                  <View style={styles.statusPill}>
                    <Ionicons color={resolveThemeColor("#4E7CFF")} name="checkmark-circle-outline" size={10} />
                    <Text style={styles.statusText}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.orderMeal}>{order.meal}</Text>
                <View style={styles.orderFooter}>
                  <Text style={styles.orderType}>{order.type}</Text>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                </View>
              </Pressable>
            ))}
            <PaginationControls
              canGoNext={orderPagination.canGoNext}
              canGoPrevious={orderPagination.canGoPrevious}
              onNext={orderPagination.goNext}
              onPrevious={orderPagination.goPrevious}
              page={orderPagination.page}
              totalPages={orderPagination.totalPages}
            />
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons color={resolveThemeColor("#C9C5C1")} name="cube-outline" size={32} />
            <Text style={styles.emptyText}>No orders yet</Text>
          </View>
        )}
      </View>
      {trackingError ? (
        <Text style={[styles.errorText, { bottom: Math.max(insets.bottom + 74, 86) }]}>
          {trackingError}
        </Text>
      ) : null}
      <TrackingSheet
        onClose={() => setTracking(undefined)}
        tracking={tracking}
        bottomInset={insets.bottom}
      />
    </SafeAreaView>
  );
};

const TrackingSheet = ({
  bottomInset,
  onClose,
  tracking,
}: {
  bottomInset: number;
  onClose: () => void;
  tracking?: TrackingResponse;
}) => {
  const route = useMemo(
    () =>
      (tracking?.map?.route ?? []).filter(
        (point) => Number.isFinite(point.latitude) && Number.isFinite(point.longitude),
      ),
    [tracking?.map?.route],
  );
  const firstPoint = route[0] ?? { latitude: 6.5244, longitude: 3.3792 };
  const riderLocation =
    tracking?.rider?.currentLocation &&
    Number.isFinite(tracking.rider.currentLocation.latitude) &&
    Number.isFinite(tracking.rider.currentLocation.longitude)
      ? tracking.rider.currentLocation
      : undefined;
  const tileUrlTemplate = tracking?.map?.tileUrlTemplate;
  const canRenderMap = Boolean(route.length && tileUrlTemplate);

  return (
    <Modal animationType="slide" transparent visible={Boolean(tracking)} onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        {tracking ? (
          <View style={[styles.trackingSheet, { paddingBottom: Math.max(bottomInset + 14, 26) }]}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <View>
                <Text style={styles.sheetTitle}>#{tracking.order.reference}</Text>
                <Text style={styles.sheetSubtitle}>{tracking.order.status}</Text>
              </View>
              <Pressable onPress={onClose} hitSlop={10}>
                <Ionicons color={resolveThemeColor("#817B75")} name="close" size={18} />
              </Pressable>
            </View>
            {canRenderMap ? (
              <MapView
                initialRegion={{
                  latitude: firstPoint.latitude,
                  latitudeDelta: 0.12,
                  longitude: firstPoint.longitude,
                  longitudeDelta: 0.12,
                }}
                mapType="none"
                style={styles.map}
              >
                <UrlTile maximumZ={19} tileSize={256} urlTemplate={tileUrlTemplate ?? ""} />
                <Polyline coordinates={route} strokeColor={resolveThemeColor("#FF4A17")} strokeWidth={4} />
                <Marker coordinate={route[0]} title="Kitchen" />
                <Marker coordinate={route[route.length - 1]} title="Delivery address" />
                {riderLocation ? (
                  <Marker
                    coordinate={riderLocation}
                    description={tracking.rider?.phone}
                    title={tracking.rider?.name ?? "Rider"}
                  />
                ) : null}
              </MapView>
            ) : (
              <View style={styles.mapFallback}>
                <Ionicons color={resolveThemeColor("#C9C5C1")} name="map-outline" size={30} />
                <Text style={styles.mapFallbackText}>Map tracking is not available for this order yet.</Text>
              </View>
            )}
            {tracking.rider ? (
              <View style={styles.riderCard}>
                <Ionicons color={resolveThemeColor("#FF4A17")} name="bicycle-outline" size={17} />
                <View style={styles.riderTextWrap}>
                  <Text style={styles.riderName}>{tracking.rider.name}</Text>
                  <Text style={styles.riderMeta}>Current location is shown on the map</Text>
                </View>
              </View>
            ) : null}
            <ScrollView contentContainerStyle={styles.timeline}>
              {tracking.events.map((event) => (
                <View key={event.id} style={styles.timelineRow}>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineText}>
                    <Text style={styles.timelineTitle}>{event.title}</Text>
                    <Text style={styles.timelineDescription}>{event.description}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = createThemedStyleSheet({
  activeSegmentItem: {
    backgroundColor: "#FFFFFF",
    elevation: 3,
    ...skeuo.pressed,
  },
  activeSegmentText: {
    color: "#171513",
    fontWeight: "700",
  },
  content: {
    flex: 1,
    paddingHorizontal: 27,
    paddingTop: 10,
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingBottom: 120,
  },
  emptyText: {
    color: "#8B8580",
    fontSize: 13,
    marginTop: 9,
  },
  errorText: {
    alignSelf: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFB9A4",
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    color: "#C8320D",
    elevation: 5,
    fontSize: 11,
    fontWeight: "800",
    left: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    position: "absolute",
    right: 20,
    textAlign: "center",
    ...skeuo.card,
  },
  map: {
    borderRadius: 10,
    height: 170,
    marginTop: 12,
    overflow: "hidden",
    width: "100%",
  },
  mapFallback: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderTopWidth: 1,
    elevation: 3,
    height: 150,
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 18,
    ...skeuo.card,
  },
  mapFallbackText: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 8,
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 4,
    padding: 13,
    ...skeuo.card,
  },
  orderDate: {
    color: "#8B8580",
    fontSize: 9,
    marginTop: 3,
  },
  orderFooter: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  orderHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderId: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  orderList: {
    marginTop: 18,
  },
  orderMeal: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 12,
  },
  orderTotal: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
  },
  orderType: {
    color: "#817B75",
    fontSize: 10,
  },
  safeArea: {
    backgroundColor: "#FAF9F8",
    flex: 1,
  },
  riderCard: {
    alignItems: "center",
    backgroundColor: "#FFF3EE",
    borderColor: "#FFD1C1",
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    gap: 9,
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    ...skeuo.card,
  },
  riderMeta: {
    color: "#817B75",
    fontSize: 10,
    marginTop: 2,
  },
  riderName: {
    color: "#171513",
    fontSize: 12,
    fontWeight: "900",
  },
  riderTextWrap: {
    flex: 1,
  },
  sheetHandle: {
    alignSelf: "center",
    backgroundColor: "#D8D3CE",
    borderRadius: 2,
    height: 4,
    marginBottom: 12,
    width: 44,
  },
  sheetHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  sheetOverlay: {
    backgroundColor: "rgba(0,0,0,0.72)",
    flex: 1,
    justifyContent: "flex-end",
  },
  sheetSubtitle: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 3,
  },
  sheetTitle: {
    color: "#171513",
    fontSize: 16,
    fontWeight: "900",
  },
  segment: {
    backgroundColor: "#F1EFED",
    borderRadius: 8,
    borderColor: "#FFFFFF",
    borderTopWidth: 1,
    elevation: 2,
    flexDirection: "row",
    height: 22,
    marginTop: 18,
    padding: 1,
    ...skeuo.pressed,
  },
  segmentItem: {
    alignItems: "center",
    borderRadius: 7,
    flex: 1,
    justifyContent: "center",
  },
  segmentText: {
    color: "#77716B",
    fontSize: 10,
    fontWeight: "600",
  },
  statusPill: {
    alignItems: "center",
    backgroundColor: "#EDF1FF",
    borderRadius: 10,
    flexDirection: "row",
    gap: 3,
    height: 18,
    paddingHorizontal: 8,
  },
  statusText: {
    color: "#4E7CFF",
    fontSize: 8,
    fontWeight: "900",
  },
  timeline: {
    gap: 10,
    paddingTop: 13,
  },
  timelineDescription: {
    color: "#817B75",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  timelineDot: {
    backgroundColor: "#FF4A17",
    borderColor: "#FFD4C7",
    borderRadius: 7,
    borderWidth: 3,
    height: 14,
    marginTop: 2,
    width: 14,
  },
  timelineRow: {
    flexDirection: "row",
    gap: 9,
  },
  timelineText: {
    flex: 1,
  },
  timelineTitle: {
    color: "#171513",
    fontSize: 11,
    fontWeight: "900",
  },
  trackingSheet: {
    backgroundColor: "#FAF9F8",
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 16,
    maxHeight: "78%",
    paddingHorizontal: 16,
    paddingTop: 12,
    ...skeuo.floating,
  },
  subtitle: {
    color: "#817B75",
    fontSize: 12,
    marginTop: 3,
  },
  title: {
    color: "#171513",
    fontSize: 20,
    fontWeight: "800",
  },
});
