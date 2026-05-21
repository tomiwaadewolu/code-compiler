import React, { useState, useRef, useEffect } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import CodeEditor from "../components/code-editor";

const SERVER_URL = "http://192.168.0.144:8000/compile";

const runCode = async (code: string, language: string) => {
  const res = await axios.post(SERVER_URL, {
    code,
    language,
  });

  return res.data;
};

export default function HomeScreen() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 🔥 ADDED: prevent unnecessary language re-sync loops
  const prevLanguage = useRef(language);

  useEffect(() => {
    if (prevLanguage.current !== language) {
      prevLanguage.current = language;
    }
  }, [language]);

  const handleRun = async () => {
    try {
      const result = await runCode(code, language);

      setOutput(
        result.output ||
          result.stdout ||
          result.stderr ||
          JSON.stringify(result)
      );
    } catch (error) {
      console.log(error);
      setOutput("Error running code");
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Mobile Code Compiler</Text>

      {/* 🔥 DROPDOWN */}
      {dropdownVisible && (
        <View style={styles.dropdownOverlay}>

          <View style={styles.dropdownBox}>

            <Text
              style={styles.dropdownItem}
              onPress={() => {
                setLanguage("python");
                setDropdownVisible(false);
              }}
            >
              Python
            </Text>

            <Text
              style={styles.dropdownItem}
              onPress={() => {
                setLanguage("cpp");
                setDropdownVisible(false);
              }}
            >
              C++
            </Text>

            <Text
              style={styles.dropdownItem}
              onPress={() => {
                setLanguage("java");
                setDropdownVisible(false);
              }}
            >
              Java
            </Text>

            <Text
              style={styles.dropdownItem}
              onPress={() => {
                setLanguage("c");
                setDropdownVisible(false);
              }}
            >
              C
            </Text>

          </View>

          {/* backdrop */}
          <View
            style={styles.dropdownBackdrop}
            onTouchStart={() => setDropdownVisible(false)}
          />

        </View>
      )}

      {/* 🔥 TOOLBAR */}
      <View style={styles.editorHeader}>

        {/* LANGUAGE BUTTON */}
        <View style={styles.languageWrapper}>
          <Button
            title={language.toUpperCase()}
            onPress={() => setDropdownVisible(true)}
          />
        </View>

        {/* RUN */}
        <View style={styles.buttonWrapper}>
          <Button title="Run" onPress={handleRun} />
        </View>

        {/* FULLSCREEN */}
        <View style={styles.buttonWrapper}>
          <Button
            title={fullscreen ? "Exit" : "Full"}
            onPress={() => setFullscreen(!fullscreen)}
          />
        </View>

      </View>

      {/* 🔥 EDITOR */}
      <View style={fullscreen ? styles.editorFull : styles.editorBox}>
        <CodeEditor
          code={code}
          language={language}
          onChange={setCode}
        />
      </View>

      {/* OUTPUT */}
      {!fullscreen && (
        <>
          <Text style={styles.outputTitle}>Output:</Text>
          <Text style={styles.output}>{output}</Text>
        </>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingTop: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  /* 🔥 TOOLBAR */
  editorHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 6,
    borderRadius: 8,
    marginBottom: 10,
    height: 50,
    overflow: "hidden",
  },

  /* 🔥 LANGUAGE BUTTON */
  languageWrapper: {
    width: 110,
    justifyContent: "center",
  },

  buttonWrapper: {
    marginLeft: 6,
    justifyContent: "center",
  },

  /* 🔥 DROPDOWN */
  dropdownOverlay: {
    position: "absolute",
    top: 110,
    left: 12,
    right: 12,
    zIndex: 9999,
  },

  dropdownBox: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#333",
  },

  dropdownItem: {
    color: "#fff",
    padding: 12,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },

  dropdownBackdrop: {
    position: "absolute",
    top: -200,
    left: 0,
    right: 0,
    bottom: -1000,
  },

  /* 🔥 EDITOR */
  editorBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },

  editorFull: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
  },

  /* OUTPUT */
  outputTitle: {
    fontWeight: "bold",
    marginTop: 10,
  },

  output: {
    color: "green",
  },
});