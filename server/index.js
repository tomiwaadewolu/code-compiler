//index.js

const express = require("express");
const cors = require("cors");
const Axios = require("axios");
const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// default code per language
const defaultCode = {
    "c": `#include <stdio.h>\nint main() {\n    printf("Hello, C!");\n    return 0;\n}\n`,
    "cpp": `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}\n`,
    "python": `print("Hello, Python!")\n`,
    "java": `public class Main {\n    public static void main(String[] args) {\n       System.out.println("Hello, Java!");\n    }\n}\n`
};

app.post("/compile", (req, res) => {
    // getting the required data from the request
    let code = req.body.code?.trim() || "";
    let language = req.body.language?.toLowerCase();
    let input = req.body.input || "";

    let languageMap = {
        "c": { language: "c", version: "10.2.0" },
        "cpp": { language: "c++", version: "10.2.0" },
        "python": { language: "python", version: "3.10.0" },
        "java": { language: "java", version: "15.0.2" }
    };

    if (!languageMap[language]) {
        return res.status(400).send({ error: "Unsupported language" });
    }

    const finalCode = code.length > 0 ? code : defaultCode[language];

    const data = {
        "language": languageMap[language].language,
        "version": languageMap[language].version,
        "files": [
            {
                "name": "main",
                "content": finalCode
            }
        ],
        "stdin": input
    };

    const config = {
        method: 'post',
        url: 'https://emkc.org/api/v2/piston/execute',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };

    // calling the code compilation API
    Axios(config)
        .then((response) => {
            res.json(response.data.run);  // Send the run object directly
            console.log(response.data);
        }).catch((error) => {
            console.log(error);
            res.status(500).send({ error: "Something went wrong" });
        });
});

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
