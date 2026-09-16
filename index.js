const http = require('http');
const PORT = process.env.PORT || 8765;

// ১. রেজিস্টার্ড ইমেইল সংরক্ষণের স্থান (In-Memory Database)
const registeredEmails = new Set();

// ২. ৩১টি ক্যাটাগরি এবং Identity এর প্রশ্ন-উত্তর ডেটাবেস
const DB = {
    // ==========================================
    // Identity Category (২০টি বাংলা ও ২০টি ইংরেজি প্রশ্ন)
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

    // ==========================================
    // Category 3: Building Materials
    // ==========================================
    "what is brick": "A brick is a block used to build walls, pavements, and other masonry structures.",
    "ইট কি": "A brick is a block used to build walls, pavements, and other masonry structures.",
    "what is cement": "Cement is a binder that sets, hardens, and adheres to other materials to bind them together.",
    "সিমেন্ট কি": "Cement is a binder that sets, hardens, and adheres to other materials to bind them together.",

    // ==========================================
    // Category 4: Thermodynamics & Physics
    // ==========================================
    "what is latent heat": "Latent heat is the energy absorbed or released during a change of physical state without changing temperature.",
    "সুপ্ত তাপ কি": "Latent heat is the energy absorbed or released during a change of physical state without changing temperature.",

    // ==========================================
    // Category 5: Optics
    // ==========================================
    "what is reflection": "Reflection is the change in direction of a wavefront at an interface between two different media.",
    "আলোর প্রতিফলন কি": "Reflection is the change in direction of a wavefront at an interface between two different media.",

    // ==========================================
    // Category 6: Web Development (HTML/CSS)
    // ==========================================
    "what is html": "HTML stands for HyperText Markup Language used for creating web page structures.",
    "এইচটিএমএল কি": "HTML stands for HyperText Markup Language used for creating web page structures.",
    "what is css": "CSS stands for Cascading Style Sheets, used to style web page elements.",
    "সিএসএস কি": "CSS stands for Cascading Style Sheets, used to style web page elements.",

    // ==========================================
    // Category 7: JavaScript & PHP
    // ==========================================
    "what is javascript": "JavaScript is a programming language used to build interactive web applications.",
    "জাভাস্ক্রিপ্ট কি": "JavaScript is a programming language used to build interactive web applications.",
    "what is php": "PHP is a popular server-side scripting language designed for web development.",
    "পিএইচপি কি": "PHP is a popular server-side scripting language designed for web development.",

    // ==========================================
    // Category 8: MySQL & Database
    // ==========================================
    "what is mysql": "MySQL is an open-source relational database management system.",
    "মাইএসকিউএল কি": "MySQL is an open-source relational database management system.",

    // ==========================================
    // Category 9: Node.js & Backend
    // ==========================================
    "what is node js": "Node.js is a JavaScript runtime environment that executes JavaScript code outside a browser.",
    "নোট জেএস কি": "Node.js is a JavaScript runtime environment that executes JavaScript code outside a browser.",

    // ==========================================
    // Category 10: AI & Video Generation
    // ==========================================
    "what is image to video": "Image to video is an AI technology that converts static photos into animated videos.",
    "ইমেজ টু ভিডিও কি": "Image to video is an AI technology that converts static photos into animated videos.",

    // ==========================================
    // Category 11: Health Advice
    // ==========================================
    "how to stay healthy": "Drink sufficient water, eat a balanced diet, exercise daily, and ensure enough sleep.",
    "স্বাস্থ্য ভালো রাখার উপায় কি": "Drink sufficient water, eat a balanced diet, exercise daily, and ensure enough sleep.",

    // ==========================================
    // Category 12: Football & Sports
    // ==========================================
    "who is cristiano ronaldo": "Cristiano Ronaldo is a famous professional football player known for his high performance.",
    "ক্রিস্টিয়ানো রোনালদো কে": "Cristiano Ronaldo is a famous professional football player known for his high performance.",

    // ==========================================
    // Category 13: Drama & Entertainment
    // ==========================================
    "what is radhakrishna": "Radhakrishna is a popular television drama based on the epic story of Radha and Krishna.",
    "রাধাকৃষ্ণ নাটক কি": "Radhakrishna is a popular television drama based on the epic story of Radha and Krishna.",

    // ==========================================
    // Category 14: Mobile Processors
    // ==========================================
    "what is mediatek helio g100": "MediaTek Helio G100 is an octa-core mobile processor designed for mid-range devices.",
    "মিডিয়াটেক হেলিও জি ১০০ কি": "MediaTek Helio G100 is an octa-core mobile processor designed for mid-range devices.",

    // ==========================================
    // Category 15: Display Technologies
    // ==========================================
    "what is amoled": "AMOLED stands for Active-Matrix Organic Light-Emitting Diode providing vibrant colors.",
    "অ্যামোলেড কি": "AMOLED stands for Active-Matrix Organic Light-Emitting Diode providing vibrant colors.",

    // ==========================================
    // Category 16: Security & Authentication
    // ==========================================
    "what is two factor authentication": "Two-factor authentication adds an extra layer of security to online user accounts.",
    "টু ফ্যাক্টর অথেন্টিকেশন কি": "Two-factor authentication adds an extra layer of security to online user accounts.",

    // ==========================================
    // Category 17: GitHub Actions
    // ==========================================
    "what is github actions": "GitHub Actions is an automated workflow framework for CI/CD pipelines.",
    "গিটহাব অ্যাকশন কি": "GitHub Actions is an automated workflow framework for CI/CD pipelines.",

    // ==========================================
    // Category 18: Python Programming
    // ==========================================
    "what is python": "Python is a high-level, easy-to-read programming language used in web and AI development.",
    "পাইথন কি": "Python is a high-level, easy-to-read programming language used in web and AI development.",

    // ==========================================
    // Category 19: Computer Vision (OpenCV)
    // ==========================================
    "what is opencv": "OpenCV is an open-source library built for computer vision and image processing.",
    "ওপেন সিভি কি": "OpenCV is an open-source library built for computer vision and image processing.",

    // ==========================================
    // Category 20: Text to Speech (TTS)
    // ==========================================
    "what is text to speech": "Text to speech is a technology that converts written digital text into vocal output.",
    "টেক্সট টু স্পিচ কি": "Text to speech is a technology that converts written digital text into vocal output.",

    // ==========================================
    // Category 21: Speedometer & Sensors
    // ==========================================
    "what is a speedometer": "A speedometer is an instrument that measures and displays the speed of a vehicle.",
    "স্পিডোমিটার কি": "A speedometer is an instrument that measures and displays the speed of a vehicle.",

    // ==========================================
    // Category 22: TikTok Strategy & AI
    // ==========================================
    "what is tiktok symphony": "TikTok Symphony is an AI suite that helps creators generate and edit videos quickly.",
    "টিকটক সিম্ফনি কি": "TikTok Symphony is an AI suite that helps creators generate and edit videos quickly.",

    // ==========================================
    // Category 23: Game Development
    // ==========================================
    "what is pong game": "Pong is a classic 2D arcade video game simulating table tennis mechanics.",
    "পং গেম কি": "Pong is a classic 2D arcade video game simulating table tennis mechanics.",

    // ==========================================
    // Category 24: Mathematics
    // ==========================================
    "what is a linear equation": "A linear equation is an algebraic equation that creates a straight line when graphed.",
    "রৈখিক সমীকরণ কি": "A linear equation is an algebraic equation that creates a straight line when graphed.",

    // ==========================================
    // Category 25: Specific Heat Capacity
    // ==========================================
    "what is specific heat": "Specific heat capacity is the amount of heat required to raise the temperature of a mass unit.",
    "আপেক্ষিক তাপ কি": "Specific heat capacity is the amount of heat required to raise the temperature of a mass unit.",

    // ==========================================
    // Category 26: Electrical Wiring
    // ==========================================
    "what is electrical wiring": "Electrical wiring is an assembly of cabling designed to distribute power safely.",
    "ইলেকট্রিক্যাল ওয়্যারিং কি": "Electrical wiring is an assembly of cabling designed to distribute power safely.",

    // ==========================================
    // Category 27: Sand & Fine Aggregates
    // ==========================================
    "what is fine aggregate": "Fine aggregate consists of small particles passing through a 4.75mm sieve, commonly sand.",
    "সরু এগ্রিগেট কি": "Fine aggregate consists of small particles passing through a 4.75mm sieve, commonly sand.",

    // ==========================================
    // Category 28: Theory of Relativity
    // ==========================================
    "what is theory of relativity": "The theory of relativity explains physics related to gravity, space, and time.",
    "আপেক্ষিকতার তত্ত্ব কি": "The theory of relativity explains physics related to gravity, space, and time.",

    // ==========================================
    // Category 29: English Syllable & Phonetics
    // ==========================================
    "what is a syllable": "A syllable is a unit of speech sound that forms a word or part of a word.",
    "সিলেবল কি": "A syllable is a unit of speech sound that forms a word or part of a word.",

    // ==========================================
    // Category 30: Passkeys & Account Recovery
    // ==========================================
    "how to secure account": "Use passkeys, enable multi-factor security, and maintain strong credentials.",
    "একাউন্ট সুরক্ষিত রাখার উপায় কি": "Use passkeys, enable multi-factor security, and maintain strong credentials.",

    // ==========================================
    // Category 31: System Fallback Default
    // ==========================================
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
        body { font-family: Arial, sans-serif; background: #f4f6f9; text-align: center; padding: 20px; }
        .container { background: #fff; max-width: 500px; margin: auto; padding: 25px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
        input, button { width: 90%; padding: 12px; margin: 8px 0; border-radius: 6px; border: 1px solid #ccc; font-size: 15px; }
        button { background: #28a745; color: white; font-weight: bold; cursor: pointer; border: none; }
        button.voice-btn { background: #007bff; }
        #output { margin-top: 15px; font-weight: bold; color: #333; min-height: 40px; word-wrap: break-word; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Offline Voice Assistant</h2>
        <div id="authBox">
            <input type="email" id="email" placeholder="Enter email to register">
            <button onclick="registerUser()">Register / Login</button>
        </div>
        <hr>
        <div id="appBox">
            <button class="voice-btn" onclick="startVoiceInput()">🎤 Speak Question (Bangla/English)</button>
            <input type="text" id="queryText" placeholder="Or type question in Bangla or English">
            <button onclick="sendTextQuery()">Submit Text</button>
        </div>
        <div id="output"></div>
    </div>

    <script>
        // ১.৫x স্পিডে ইংরেজি ভয়েসে কথা বলার ফাংশন
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
                displayResponse(data.message, true);
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
                res.end(JSON.stringify({ message: "Sorry, don't know match allowed." }));
            } else {
                registeredEmails.add(email);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: "Please complete your registration first, then return to the home page." }));
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
