import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { PaginationControls } from "@/components";
import { usePagination } from "@/shared/hooks";
import { useAdminStore } from "@/shared/state";
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
  const [csvPreview, setCsvPreview] = useState("");
  const pagination = usePagination(logs);

  return (
    <AdminScreen>
      <AdminSectionTitle subtitle="Audit operational events and prepare local exports." title="Logs" />
      <AdminCard>
        <View style={styles.exportRow}>
          <View style={styles.exportIcon}>
            <Ionicons color="#FF4A17" name="download-outline" size={22} />
          </View>
          <View style={styles.exportTextWrap}>
            <Text style={styles.exportTitle}>Download all logs</Text>
            <Text style={styles.exportSubtitle}>Prepares CSV locally until backend storage is connected.</Text>
          </View>
        </View>
        <AdminActionButton
          onPress={() => {
            const csv = downloadLogs();
            setCsvPreview(csv.split("\n").slice(0, 3).join("\n"));
          }}
        >
          Download Logs
        </AdminActionButton>
        {exportMessage ? <Text style={styles.exportMessage}>{exportMessage}</Text> : null}
        {csvPreview ? <Text style={styles.csvPreview}>{csvPreview}</Text> : null}
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

const styles = StyleSheet.create({
  actor: {
    color: "#817B75",
    fontSize: 11,
    marginTop: 4,
  },
  csvPreview: {
    backgroundColor: "#F8F6F4",
    borderRadius: 8,
    color: "#4F4640",
    fontSize: 10,
    lineHeight: 15,
    marginTop: 10,
    padding: 10,
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
