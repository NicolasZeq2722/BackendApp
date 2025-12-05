import { StyleSheet } from "react-native";
import { Colors, Typography } from "./GlobalStyles";

export const citacionesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: Typography.fontSize["2xl"],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.black,
    marginBottom: 16,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  citacionItem: {
    backgroundColor: Colors.white,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  citacionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.black,
    marginBottom: 8,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  addButton: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  emptyText: {
    textAlign: "center",
    fontSize: Typography.fontSize.base,
    color: Colors.gray[500],
    marginTop: 20,
  },
});
