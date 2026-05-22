import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import CodeEditor from "../components/code-editor";
import { ModernButton } from "../components/modern-button";
import { ModernCard } from "../components/modern-card";
import { ModernDropdown } from "../components/modern-dropdown";
import { useTheme } from "@/hooks/use-theme";
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from "@/constants/theme";

const SERVER_URL = "http://192.168.0.144:8000/compile";

const runCode = async (code: string, language: string) => {
  const res = await axios.post(SERVER_URL, {
    code,
    language,
  });

  return res.data;
};

export default function HomeScreen() {
  const theme = useTheme();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);
  const prevLanguage = useRef(language);

  useEffect(() => {
    if (prevLanguage.current !== language) {
      prevLanguage.current = language;
    }
  }, [language]);

  const languages = [
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    { label: "Java", value: "java" },
    { label: "C", value: "c" },
  ];

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("Please enter some code to run");
      return;
    }

    setLoading(true);
    try {
      const result = await runCode(code, language);
      setOutput(
        result.output ||
          result.stdout ||
          result.stderr ||
          JSON.stringify(result)
      );
    } catch (error) {
      setOutput("Error running code. Check your server connection.");
    } finally {
      setLoading(false);
    }
  };

  if (fullscreen) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.fullscreenHeader}>
          <Text style={[styles.fullscreenTitle, { color: theme.text }]}>
            Code Editor
          </Text>
          <ModernButton
            title="Exit Fullscreen"
            variant="outline"
            size="sm"
            onPress={() => setFullscreen(false)}
          />
        </View>
        <View style={styles.editorFull}>
          <CodeEditor code={code} language={language} onChange={setCode} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          Mobile Code
        </Text>
        <Text style={[styles.title, { color: theme.accent }]}>
          Compiler
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Write and execute code on the go
        </Text>
      </View>

      {/* CONTROLS CARD */}
      <ModernCard style={styles.controlsCard}>
        <View style={styles.controlsGrid}>
          <View style={styles.controlItem}>
            <Text style={[styles.controlLabel, { color: theme.textSecondary }]}>
              Language
            </Text>
            <ModernDropdown
              options={languages}
              value={language}
              onChange={setLanguage}
              style={styles.dropdown}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <ModernButton
            title={loading ? "Running..." : "▶ Run Code"}
            variant="primary"
            size="md"
            fullWidth
            disabled={loading || !code.trim()}
            onPress={handleRun}
          />
          <ModernButton
            title="📄 Fullscreen"
            variant="secondary"
            size="md"
            fullWidth
            onPress={() => setFullscreen(true)}
          />
        </View>
      </ModernCard>

      {/* EDITOR CARD */}
      <ModernCard style={styles.editorCard} noPadding elevated>
        <View style={styles.editorContainer}>
          <CodeEditor
            code={code}
            language={language}
            onChange={setCode}
          />
        </View>
      </ModernCard>

      {/* OUTPUT CARD */}
      {output && (
        <ModernCard style={styles.outputCard}>
          <Text style={[styles.outputTitle, { color: theme.accent }]}>
            Output
          </Text>
          <View style={[styles.outputBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.outputText, { color: theme.text }]}>
              {output}
            </Text>
          </View>
        </ModernCard>
      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  header: {
    marginBottom: Spacing.xxxl,
  },
  title: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.normal,
    marginTop: Spacing.sm,
  },
  controlsCard: {
    marginBottom: Spacing.lg,
  },
  controlsGrid: {
    marginBottom: Spacing.lg,
  },
  controlItem: {
    marginBottom: Spacing.md,
  },
  controlLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  dropdown: {
    width: "100%",
  },
  actionButtons: {
    gap: Spacing.md,
  },
  editorCard: {
    marginBottom: Spacing.lg,
    height: 280,
  },
  editorContainer: {
    flex: 1,
  },
  editorFull: {
    flex: 1,
  },
  fullscreenHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
  },
  fullscreenTitle: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
  },
  outputCard: {
    marginBottom: Spacing.xl,
  },
  outputTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  outputBox: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    minHeight: 100,
    maxHeight: 300,
  },
  outputText: {
    fontSize: FontSize.sm,
    fontFamily: "monospace",
    lineHeight: FontSize.sm * 1.5,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: Spacing.xxl,
  },
});