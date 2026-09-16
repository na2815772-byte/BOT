const http = require('http');
const PORT = process.env.PORT || 8765;

// ১. রেজিস্টার্ড ইমেইল সংরক্ষণের স্থান (In-Memory Database)
const registeredEmails = new Set();

// ২. ৩১টি ক্যাটাগরি এবং Identity এর প্রশ্ন-উত্তর ডেটাবেস
const DB = {
    // ==========================================
    // Identity Category
    // ==========================================
    "who are you": "I am the artificial intelligent created and presented by niloy",
    "what is your identity": "I am the artificial intelligent created and presented by niloy",
    "who created you": "I am the artificial intelligent created and presented by niloy",
    "who is your creator": "I am the artificial intelligent created and presented by niloy",
    "who built you": "I am the artificial intelligent created and presented by niloy",
    "who made you": "I am the artificial intelligent created and presented by niloy",
    "who presented you": "I am the artificial intelligent created and presented by niloy",
    "tell me about yourself": "I am the artificial intelligent created and presented by niloy",
    "what are you": "I am the artificial intelligent created and presented by niloy",
    "introduce yourself": "I am the artificial intelligent created and presented by niloy",
    "can you introduce yourself": "I am the artificial intelligent created and presented by niloy",
    "who owns you": "I am the artificial intelligent created and presented by niloy",
    "who developed you": "I am the artificial intelligent created and presented by niloy",
    "who designed you": "I am the artificial intelligent created and presented by niloy",
    "what is your name": "I am the artificial intelligent created and presented by niloy",
    "whose ai are you": "I am the artificial intelligent created and presented by niloy",
    "who powers you": "I am the artificial intelligent created and presented by niloy",
    "what is your background": "I am the artificial intelligent created and presented by niloy",
    "can you tell your identity": "I am the artificial intelligent created and presented by niloy",
    "give me your introduction": "I am the artificial intelligent created and presented by niloy",

    // বাংলা প্রশ্নসমূহ
    "তুমি কে": "I am the artificial intelligent created and presented by niloy",
    "তোমার পরিচয় কি": "I am the artificial intelligent created and presented by niloy",
    "তোমাকে কে তৈরি করেছে": "I am the artificial intelligent created and presented by niloy",
    "তোমার সৃষ্টিকর্তা কে": "I am the artificial intelligent created and presented by niloy",
    "তোমাকে কে বানিয়েছে": "I am the artificial intelligent created and presented by niloy",
    "তোমার মালিক কে": "I am the artificial intelligent created and presented by niloy",
    "তোমাকে কে প্রেজেন্ট করেছে": "I am the artificial intelligent created and presented by niloy",
    "তোমার নিজের সম্পর্কে কিছু বলো": "I am the artificial intelligent created and presented by niloy",
    "তুমি কি ধরনের এআই": "I am the artificial intelligent created and presented by niloy",
    "তোমার পরিচয় দাও": "I am the artificial intelligent created and presented by niloy",
    "তুমি কার তৈরি": "I am the artificial intelligent created and presented by niloy",
    "তোমাকে কে ডেভেলপ করেছে": "I am the artificial intelligent created and presented by niloy",
    "তোমাকে কে ডিজাইন করেছে": "I am the artificial intelligent created and presented by niloy",
    "তোমার নাম কি": "I am the artificial intelligent created and presented by niloy",
    "তুমি কার এআই": "I am the artificial intelligent created and presented by niloy",
    "তোমাকে কে পরিচালনা করে": "I am the artificial intelligent created and presented by niloy",
    "তোমার পরিচয় ব্যাকগ্রাউন্ড কি": "I am the artificial intelligent created and presented by niloy",
    "তোমার পরিচয় বলতে পারবে": "I am the artificial intelligent created and presented by niloy",
    "তোমার সংক্ষিপ্ত পরিচয় দাও": "I am the artificial intelligent created and presented by niloy",
    "তোমার প্রস্তুতকারক কে": "I am the artificial intelligent created and presented by niloy",

    // ==========================================
    // Category 1: General Greetings & Intro
    // ==========================================
    "hello": "Please complete your registration first, then return to the home page.",
    "hi": "Please complete your registration first, then return to the home page.",
    "get started": "Please complete your registration first, then return to the home page.",
    "হ্যালো": "Please complete your registration first, then return to the home page.",
    "হাই": "Please complete your registration first, then return to the home page.",
    "শুরু করুন": "Please complete your registration first, then return to the home page.",
    "how are you": "I am fine, thank you! How can I help you?",
    "কেমন আছ": "I am fine, thank you! How can I help you?",

    // ==========================================
    // Category 2: Civil Engineering Basics
    // ==========================================
    "what is civil engineering": "Civil engineering is a professional engineering discipline dealing with the design, construction, and maintenance of the physical built environment.",
    "সিভিল ইঞ্জিনিয়ারিং কি": "Civil engineering is a professional engineering discipline dealing with the design, construction, and maintenance of the physical built environment.",
    "what is concrete": "Concrete is a composite material composed of fine and coarse aggregate bonded together with fluid cement.",
    "কনক্রিট কি": "Concrete is a composite material composed of fine and coarse aggregate bonded together with fluid cement.",
    "what is beam": "A beam is a structural element that primarily resists loads applied laterally to the beam's axis.",
    "বীম কি": "A beam is a structural element that primarily resists loads applied laterally to the beam's axis.",
    "what is column": "A column is a structural element that transmits, through compression, the weight of the structure above to other structural elements below.",
    "কলাম কি": "A column is a structural element that transmits, through compression, the weight of the structure above to other structural elements below.",

    // System Fallback Default
    "default": "Sorry, I could not find a matching answer in my database."
};

// ৩. ফ্রন্টএন্ড UI (HTML/JS)
const HTML_PAGE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Voice Assistant</title>
    <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: white; text-align: center; padding: 20px; }
        .container { background: #1e293b; max-width: 500px; margin: auto; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
        input, button { width: 90%; padding: 12px; margin: 8px 0; border-radius: 6px; border: 1px solid #334155; font-size: 15px; }
        input { background: #0f172a; color: white; }
        button { background: #0284c7; color: white; font-weight: bold; cursor: pointer; border: none; }
        button.voice-btn { background: #059669; }
        #output { margin-top: 15px; font-weight: bold; color: #38bdf8; min-height: 40px; word-wrap: break-word; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Voice Assistant Platform</h2>
        
        <div id="authBox">
            <input type="email" id="email" placeholder="Enter email to register">
            <button onclick="registerUser()">Register / Login</button>
        </div>
        
        <hr style="border-color: #334155; margin: 20px 0;">

        <div id="appBox">
            <button id="getStartedBtn" onclick="triggerGetStarted()">Get Started</button>
            <button class="voice-btn" onclick="startVoiceInput()">🎤 Speak Question (Bangla/English)</button>
            <input type="text" id="queryText" placeholder="Or type question in Bangla or English">
            <button onclick="sendTextQuery()">Submit Text</button>
        </div>
        
        <div id="output"></div>
    </div>

    <script>
        let isRegistered = false;

        function speak(text) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1.5;
            window.speechSynthesis.speak(utterance);
        }

        function displayResponse(text, isVoice = false) {
            document.getElementById('output').innerText = text;
            if (isVoice) {
                speak(text);
            }
        }

        // Get Started ক্লিক ইভেন্ট হ্যান্ডলার
        function triggerGetStarted() {
            if (!isRegistered) {
                sendQuery("get started", true);
            } else {
                displayResponse("Welcome back to the page", true);
            }
        }

        function registerUser() {
            const email = document.getElementById('email').value.trim();
            if (!email) return alert('Please enter an email address.');

            fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    isRegistered = true;
                    displayResponse(data.message, true);
                } else {
                    displayResponse(data.message, true);
                }
            });
        }

        function sendQuery(query, isVoice) {
            fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })
            .then(res => res.json())
            .then(data => {
                displayResponse(data.answer, isVoice);
            });
        }

        function sendTextQuery() {
            const query = document.getElementById('queryText').value.trim();
            if (query) sendQuery(query, false);
        }

        function startVoiceInput() {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) return alert("Browser speech recognition not supported.");
            
            const recognition = new SpeechRecognition();
            recognition.lang = 'bn-BD';
            recognition.onresult = (e) => {
                const speechResult = e.results[0][0].transcript;
                sendQuery(speechResult, true);
            };
            recognition.start();
        }
    </script>
</body>
</html>
`;

// ৪. পিওর Node.js সার্ভার
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(HTML_PAGE);
    } 
    else if (req.method === 'POST' && req.url === '/api/register') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { email } = JSON.parse(body || '{}');
            
            if (registeredEmails.has(email)) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false, 
                    message: "Sorry, don't know match allowed." 
                }));
            } else {
                registeredEmails.add(email);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: true, 
                    message: "Welcome back to the page" 
                }));
            }
        });
    }
    else if (req.method === 'POST' && req.url === '/api/ask') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const { query } = JSON.parse(body || '{}');
            const userQuery = (query || '').toLowerCase().trim();
            
            const responseAnswer = DB[userQuery] || DB["default"];
            
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ answer: responseAnswer }));
        });
    } 
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
