// ============================================================
// NELOY AI - MAIN BACKEND SERVER
// ============================================================

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8765;

// ============================================================
// QUESTION / ANSWER DATABASE
// ============================================================

const DB = {

    // ========================================================
    // IDENTITY
    // ========================================================

    "who are you":
        "I am the artificial intelligent created and presented by Niloy.",

    "what is your identity":
        "I am the artificial intelligent created and presented by Niloy.",

    "who created you":
        "I am the artificial intelligent created and presented by Niloy.",

    "who is your creator":
        "I am the artificial intelligent created and presented by Niloy.",

    "who built you":
        "I am the artificial intelligent created and presented by Niloy.",

    "who made you":
        "I am the artificial intelligent created and presented by Niloy.",

    "who presented you":
        "I am the artificial intelligent created and presented by Niloy.",

    "tell me about yourself":
        "I am the artificial intelligent created and presented by Niloy.",

    "what are you":
        "I am the artificial intelligent created and presented by Niloy.",

    "introduce yourself":
        "I am the artificial intelligent created and presented by Niloy.",

    "can you introduce yourself":
        "I am the artificial intelligent created and presented by Niloy.",

    "who owns you":
        "I am the artificial intelligent created and presented by Niloy.",

    "who developed you":
        "I am the artificial intelligent created and presented by Niloy.",

    "who designed you":
        "I am the artificial intelligent created and presented by Niloy.",

    "what is your name":
        "I am the artificial intelligent created and presented by Niloy.",

    "whose ai are you":
        "I am the artificial intelligent created and presented by Niloy.",

    "who powers you":
        "I am the artificial intelligent created and presented by Niloy.",

    "what is your background":
        "I am the artificial intelligent created and presented by Niloy.",

    "can you tell your identity":
        "I am the artificial intelligent created and presented by Niloy.",

    "give me your introduction":
        "I am the artificial intelligent created and presented by Niloy.",


    // ========================================================
    // BANGLA IDENTITY QUESTIONS
    // ========================================================

    "তুমি কে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার পরিচয় কি":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমাকে কে তৈরি করেছে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার সৃষ্টিকর্তা কে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমাকে কে বানিয়েছে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার মালিক কে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমাকে কে প্রেজেন্ট করেছে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার নিজের সম্পর্কে কিছু বলো":
        "I am the artificial intelligent created and presented by Niloy.",

    "তুমি কি ধরনের এআই":
        "I am an artificial intelligence created and presented by Niloy.",

    "তোমার পরিচয় দাও":
        "I am the artificial intelligent created and presented by Niloy.",

    "তুমি কার তৈরি":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমাকে কে ডেভেলপ করেছে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমাকে কে ডিজাইন করেছে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার নাম কি":
        "I am the artificial intelligent created and presented by Niloy.",

    "তুমি কার এআই":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমাকে কে পরিচালনা করে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার পরিচয় ব্যাকগ্রাউন্ড কি":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার পরিচয় বলতে পারবে":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার সংক্ষিপ্ত পরিচয় দাও":
        "I am the artificial intelligent created and presented by Niloy.",

    "তোমার প্রস্তুতকারক কে":
        "I am the artificial intelligent created and presented by Niloy.",


    // ========================================================
    // GENERAL / CATEGORY 1
    // ========================================================

    "hello":
        "Hello! How can I help you?",

    "hi":
        "Hi! How can I help you?",

    "get started":
        "Please complete your registration or login first, then return to the home page.",

    "হ্যালো":
        "Hello! How can I help you?",

    "হাই":
        "Hi! How can I help you?",

    "শুরু করুন":
        "Please complete your registration or login first, then return to the home page.",

    "how are you":
        "I am fine, thank you! How can I help you?",

    "কেমন আছ":
        "I am fine, thank you! How can I help you?",


    // ========================================================
    // CIVIL ENGINEERING
    // ========================================================

    "what is civil engineering":
        "Civil engineering is a professional engineering discipline dealing with the design, construction, and maintenance of the physical built environment.",

    "সিভিল ইঞ্জিনিয়ারিং কি":
        "Civil engineering is a professional engineering discipline dealing with the design, construction, and maintenance of the physical built environment.",

    "what is concrete":
        "Concrete is a composite material composed of fine and coarse aggregate bonded together with cement.",

    "কনক্রিট কি":
        "Concrete is a composite material composed of fine and coarse aggregate bonded together with cement.",

    "what is beam":
        "A beam is a structural element that primarily resists loads applied laterally to the beam's axis.",

    "বীম কি":
        "A beam is a structural element that primarily resists loads applied laterally to the beam's axis.",

    "what is column":
        "A column is a structural element that primarily carries loads in compression and transfers them to the foundation or other supporting elements.",

    "কলাম কি":
        "A column is a structural element that primarily carries loads in compression and transfers them to the foundation or other supporting elements.",


    // ========================================================
    // DEFAULT
    // ========================================================

    "default":
        "Sorry, I could not find a matching answer in my database."
};


// ============================================================
// NORMALIZE USER QUESTION
// ============================================================

function normalizeQuery(value) {

    return String(value || "")
        .normalize("NFC")
        .toLowerCase()
        .trim()

        // Remove common punctuation
        .replace(/[?!.,;:'"`“”‘’()[\]{}]/g, " ")

        // Remove extra spaces
        .replace(/\s+/g, " ")

        .trim();
}


// ============================================================
// GET ANSWER
// ============================================================

function getAnswer(question) {

    const normalizedQuestion = normalizeQuery(question);

    if (!normalizedQuestion) {
        return {
            answer: "Please enter or say a question first.",
            found: false
        };
    }

    // Create normalized database lookup
    for (const key of Object.keys(DB)) {

        if (key === "default") {
            continue;
        }

        if (normalizeQuery(key) === normalizedQuestion) {

            return {
                answer: DB[key],
                found: true
            };
        }
    }

    return {
        answer: DB["default"],
        found: false
    };
}


// ============================================================
// JSON RESPONSE
// ============================================================

function sendJSON(res, statusCode, data) {

    const body = JSON.stringify(data);

    res.writeHead(statusCode, {
        "Content-Type": "application/json; charset=utf-8",

        // Allow frontend requests
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    res.end(body);
}


// ============================================================
// READ REQUEST BODY
// ============================================================

function readBody(req) {

    return new Promise((resolve, reject) => {

        let body = "";

        req.on("data", chunk => {

            body += chunk;

            // Prevent excessively large requests
            if (body.length > 1024 * 1024) {

                req.destroy();

                reject(new Error("Request body is too large."));
            }
        });

        req.on("end", () => {
            resolve(body);
        });

        req.on("error", error => {
            reject(error);
        });
    });
}


// ============================================================
// STATIC FILE SERVER
// ============================================================

const MIME_TYPES = {

    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",

    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",

    ".ico": "image/x-icon",

    ".txt": "text/plain; charset=utf-8"
};


function serveStaticFile(req, res) {

    let requestedPath = decodeURIComponent(
        req.url.split("?")[0]
    );

    // Home page
    if (requestedPath === "/") {
        requestedPath = "/index.html";
    }

    // Prevent path traversal
    const safePath = path.normalize(requestedPath)
        .replace(/^(\.\.[\/\\])+/, "");

    const filePath = path.join(
        __dirname,
        safePath
    );

    // Make sure file stays inside project directory
    if (!filePath.startsWith(__dirname)) {

        sendJSON(res, 403, {
            error: "Forbidden"
        });

        return;
    }

    fs.stat(filePath, (error, stats) => {

        if (error || !stats.isFile()) {

            sendJSON(res, 404, {
                error: "File not found."
            });

            return;
        }

        const extension = path.extname(filePath).toLowerCase();

        const contentType =
            MIME_TYPES[extension] ||
            "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType
        });

        fs.createReadStream(filePath).pipe(res);
    });
}


// ============================================================
// HTTP SERVER
// ============================================================

const server = http.createServer(async (req, res) => {

    // --------------------------------------------------------
    // CORS preflight
    // --------------------------------------------------------

    if (req.method === "OPTIONS") {

        res.writeHead(204, {

            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"

        });

        res.end();

        return;
    }


    // --------------------------------------------------------
    // API: ASK
    // --------------------------------------------------------

    if (
        req.method === "POST" &&
        req.url.split("?")[0] === "/api/ask"
    ) {

        try {

            const rawBody = await readBody(req);

            let data;

            try {

                data = JSON.parse(rawBody);

            } catch (error) {

                sendJSON(res, 400, {
                    success: false,
                    error: "Invalid JSON request."
                });

                return;
            }


            const userQuestion =
                data.question ??
                data.query ??
                data.text ??
                "";


            const result = getAnswer(userQuestion);


            sendJSON(res, 200, {

                success: true,

                question: String(userQuestion),

                answer: result.answer,

                found: result.found

            });


        } catch (error) {

            console.error("API Error:", error);

            sendJSON(res, 500, {

                success: false,

                error: "Server error. Please try again."

            });
        }

        return;
    }


    // --------------------------------------------------------
    // API STATUS
    // --------------------------------------------------------

    if (
        req.method === "GET" &&
        req.url.split("?")[0] === "/api/status"
    ) {

        sendJSON(res, 200, {

            success: true,

            server: "NELOY AI",

            status: "online",

            voiceSpeed: 1.5,

            languageMode: "English by default",

            message:
                "NELOY AI backend is running successfully."

        });

        return;
    }


    // --------------------------------------------------------
    // STATIC FILES
    // --------------------------------------------------------

    if (req.method === "GET") {

        serveStaticFile(req, res);

        return;
    }


    // --------------------------------------------------------
    // UNKNOWN REQUEST
    // --------------------------------------------------------

    sendJSON(res, 404, {

        success: false,

        error: "Route not found."

    });

});


// ============================================================
// START SERVER
// ============================================================

server.listen(PORT, () => {

    console.log("============================================");
    console.log("        NELOY AI SERVER STARTED");
    console.log("============================================");

    console.log(`Server running on port: ${PORT}`);

    console.log("");
    console.log("API:");
    console.log(`POST /api/ask`);

    console.log("");
    console.log("Status:");
    console.log(`GET /api/status`);

    console.log("");
    console.log("Voice speed:");
    console.log("1.5x");

    console.log("");
    console.log("Default answer language:");
    console.log("English");

    console.log("============================================");
});
