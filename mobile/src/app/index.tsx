import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import axios from "axios";
import CodeEditor from "../components/code-editor";
import { ModernButton } from "../components/modern-button";
import { ModernCard } from "../components/modern-card";
import { ModernDropdown } from "../components/modern-dropdown";
import { useTheme } from "@/hooks/use-theme";
import { BorderRadius, FontSize, FontWeight, Spacing } from "@/constants/theme";

const SERVER_URL = "http://192.168.0.144:8000/compile";

const defaultCode = {
  c: `#include <stdio.h>\nint main() {\n    printf("Hello, C!");\n    return 0;\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}\n`,
  python: `print("Hello, Python!")\n`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}\n`,
};

const runCode = async (code: string, language: string) => {
  const res = await axios.post(SERVER_URL, {
    code,
    language,
  });

  return res.data;
};

export default function HomeScreen() {
  const theme = useTheme();
  const [code, setCode] = useState(defaultCode.python);
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("Your compiled output will appear here.");
  const [fullscreen, setFullscreen] = useState(false);
  const [loading, setLoading] = useState(false);

  const languages = [
    { label: "Python", value: "python" },
    { label: "C++", value: "cpp" },
    { label: "Java", value: "java" },
    { label: "C", value: "c" },
  ];

  const handleLanguageChange = (nextLanguage: string) => {
    setLanguage(nextLanguage);
    setCode(defaultCode[nextLanguage as keyof typeof defaultCode]);
    setOutput("Your compiled output will appear here.");
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput("Please enter some code to run");
      return;
    }

    setLoading(true);
    try {
      const result = await runCode(code, language);
      setOutput(result.output || result.stdout || result.stderr || JSON.stringify(result));
    } catch (error) {
      setOutput("Error running code: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setLoading(false);
    }
  };

  if (fullscreen) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.fullscreenHeader, { borderBottomColor: theme.border }]}>
          <Text style={[styles.fullscreenTitle, { color: theme.text }]}>Code Editor</Text>
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
      <View style={[styles.heroCard, { backgroundColor: theme.accent }]}>
        <Text style={styles.heroEyebrow}>Code Compiler</Text>
        <Text style={[styles.heroTitle, { color: "#FFFFFF" }]}>Modern coding, built for mobile.</Text>
        <Text style={[styles.heroSubtitle, { color: "rgba(255,255,255,0.92)" }]}>A cleaner layout and the features used on the web.</Text>
      </View>

      <ModernCard style={styles.controlsCard}>
        <View style={styles.controlItem}>
          <Text style={[styles.controlLabel, { color: theme.textSecondary }]}>Language</Text>
          <ModernDropdown
            options={languages}
            value={language}
            onChange={handleLanguageChange}
            style={styles.dropdown}
          />
        </View>

        <View style={styles.actionButtons}>
          <ModernButton
            title={loading ? "Running..." : "Run Code"}
            variant="primary"
            size="md"
            fullWidth
            disabled={loading || !code.trim()}
            onPress={handleRun}
          />
          <ModernButton
            title="Fullscreen"
            variant="secondary"
            size="md"
            fullWidth
            onPress={() => setFullscreen(true)}
          />
        </View>
      </ModernCard>

      <ModernCard style={styles.editorCard} noPadding elevated>
        <View style={styles.editorContainer}>
          <CodeEditor code={code} language={language} onChange={setCode} />
        </View>
      </ModernCard>

      <ModernCard style={styles.outputCard}>
        <Text style={[styles.outputTitle, { color: theme.accent }]}>Output</Text>
        <View style={[styles.outputBox, { backgroundColor: theme.background }]}>
          <Text style={[styles.outputText, { color: theme.text }]}>{output}</Text>
        </View>
      </ModernCard>

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
    paddingBottom: Spacing.xxxl,
  },
  heroCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.88)",
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: FontSize.hero,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.sm,
  },
  heroSubtitle: {
    fontSize: FontSize.base,
    lineHeight: FontSize.base * 1.55,
  },
  controlsCard: {
    marginBottom: Spacing.lg,
  },
  controlItem: {
    marginBottom: Spacing.lg,
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
    height: 360,
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
    maxHeight: 320,
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
