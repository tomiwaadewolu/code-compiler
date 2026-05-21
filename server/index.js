//index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// default code per language
const defaultCode = {
    "c": `#include <stdio.h>\nint main() {\n    printf("Hello, C!");\n    return 0;\n}\n`,
    "cpp": `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}\n`,
    "python": `print("Hello, Python!")\n`,
    "java": `public class Main {\n    public static void main(String[] args) {\n       System.out.println("Hello, Java!");\n    }\n}\n`
};

app.post("/compile", async (req, res) => {
    try {
        let code = req.body.code?.trim() || "";
        let language = req.body.language?.toLowerCase();
        let input = req.body.input || "";

        const languageMap = {
            python: 71,
            cpp: 54,
            c: 50,
            java: 62
        };

        if (!languageMap[language]) {
            return res.status(400).send({ error: "Unsupported language" });
        }

        const options = {
            method: "POST",
            url: "http://localhost:2358/submissions?base64_encoded=false&wait=true",
            headers: {
                "Content-Type": "application/json"
            },
            data: {
                source_code: code,
                language_id: languageMap[language],
                stdin: input
            }
        };

        const response = await Axios.request(options);

        const result = response.data;

        res.json({
            output: result.stdout,
            stderr: result.stderr,
            compile_output: result.compile_output,
            status: result.status
        });

    } catch (error) {
        console.log("Judge0 Error:", error.response?.data || error.message);
        res.status(500).json({ error: "Execution failed" });
    }
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${process.env.PORT || 8000}`);
});
