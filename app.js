const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Speak Function
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

// Greeting on Load
function wishMe() {
    let hour = new Date().getHours();
    if (hour < 12) {
        speak("Good Morning Boss");
    } else if (hour < 17) {
        speak("Good Afternoon Master");
    } else {
        speak("Good Evening Sir");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

// Speech Recognition Setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

// When Voice Input is Detected
recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

// Start Listening on Button Click
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Command Handling Function
function takeCommand(message) {
    if (message.includes('hello') || message.includes('hi')) {
        speak("Hello Sir, how may I assist you?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("what time")) {
        const time = new Date().toLocaleTimeString();
        speak("The current time is " + time);
    } else if (message.includes("what date")) {
        const date = new Date().toDateString();
        speak("Today's date is " + date);
    } else {
        // If it's a question or unknown command → Ask DeepSeek
        askDeepSeek(message);
    }
}

// DeepSeek AI Integration
async function askDeepSeek(question) {
    try {
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer sk-48403d100832495ba8c2693dfe68d698"
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    {
                        role: "user",
                        content: question
                    }
                ]
            })
        });

        const data = await response.json();
        const reply = data.choices[0].message.content;

        content.textContent = reply;
        speak(reply); // 💬 Speak the reply
    } catch (error) {
        console.error("DeepSeek Error:", error);
        speak("Sorry, I couldn't fetch a reply.");
        content.textContent = "Error talking to AI.";
    }
}
