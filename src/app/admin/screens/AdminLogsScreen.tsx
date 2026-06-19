import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { ADMIN_PAGE_SIZE, useAdminStore } from "@/shared/state";
import { resolveThemeColor, createThemedStyleSheet } from "@/shared/theme";
import {
  AdminActionButton,
  AdminCard,
  AdminPill,
  AdminScreen,
  AdminSectionTitle,
} from "./AdminShared";

export const AdminLogsScreen = () => {
  const logs = useAdminStore((state) => state.logs);
  const downloadLogs = useAdminStore((state) => state.downloadLogs);
  const exportMessage = useAdminStore((state) => state.exportMessage);
  const loadLogs = useAdminStore((state) => state.loadLogs);
  const [isExporting, setIsExporting] = useState(false);
  const pagination = usePagination(logs, ADMIN_PAGE_SIZE);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Audit backend operational events and prepare exports." title="Logs" />
      <AdminCard>
        <View style={styles.exportRow}>
          <View style={styles.exportIcon}>
            <Ionicons color={resolveThemeColor("#FF4A17")} name="download-outline" size={22} />
          </View>
          <View style={styles.exportTextWrap}>
            <Text style={styles.exportTitle}>Download all logs</Text>
            <Text style={styles.exportSubtitle}>Prepares CSV from backend audit records.</Text>
          </View>
        </View>
        <AdminActionButton
          disabled={isExporting}
          onPress={() => void (async () => {
            setIsExporting(true);
            const csv = downloadLogs();
            const fileUri = `${FileSystem.cacheDirectory ?? ""}honeypot-admin-logs-${Date.now()}.csv`;
            try {
              await FileSystem.writeAsStringAsync(fileUri, csv, {
                encoding: FileSystem.EncodingType.UTF8,
              });
              if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(fileUri, {
                  mimeType: "text/csv",
                  UTI: "public.comma-separated-values-text",
                });
              } else {
                Alert.alert("Export ready", fileUri);
              }
            } catch (error) {
              Alert.alert(
                "Export failed",
                error instanceof Error ? error.message : "Unable to export logs.",
              );
            } finally {
              setIsExporting(false);
            }
          })()}
        >
          {isExporting ? "Preparing..." : "Download Logs"}
        </AdminActionButton>
        {exportMessage ? <Text style={styles.exportMessage}>{exportMessage}</Text> : null}
      </AdminCard>

      {pagination.pageItems.map((log) => (
        <AdminCard key={log.id}>
          <View style={styles.logTop}>
            <View>
              <Text style={styles.event}>{log.event}</Text>
              <Text style={styles.actor}>{log.actor} · {log.time}</Text>
            </View>
            <AdminPill
              label={log.level}
              tone={log.level === "Error" ? "red" : log.level === "Warning" ? "yellow" : "green"}
            />
          </View>
        </AdminCard>
      ))}

      <PaginationControls
        canGoNext={pagination.canGoNext}
        canGoPrevious={pagination.canGoPrevious}
        onNext={pagination.goNext}
        onPrevious={pagination.goPrevious}
        page={pagination.page}
        totalPages={pagination.totalPages}
      />
    </AdminScreen>
  );
};

const styles = createThemedStyleSheet({
  actor: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 4,
  },
  event: {
    color: "#171513",
    fontSize: 13,
    fontWeight: "900",
    maxWidth: 215,
  },
  exportIcon: {
    alignItems: "center",
    backgroundColor: "#FFE8DF",
    borderRadius: 12,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
  exportMessage: {
    color: "#08A46B",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 10,
  },
  exportRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 11,
    marginBottom: 12,
  },
  exportSubtitle: {
    color: "#817B75",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  exportTextWrap: {
    flex: 1,
  },
  exportTitle: {
    color: "#171513",
    fontSize: 14,
    fontWeight: "900",
  },
  logTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
