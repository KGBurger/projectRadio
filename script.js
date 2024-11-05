/*let player;
let config;
let startTime;

// Fetch configuration from config.json
fetch("config.json")
    .then(response => response.json())
    .then(data => {
        config = data;
        startTime = new Date(config.startTime);
        initPlayer();
    })
    .catch(error => console.error("Error fetching config:", error));

// Initialize YouTube Player
function initPlayer() {
    player = new YT.Player("player", {
        playerVars: {
            listType: "playlist",
            list: config.playlistId,
            index: config.startVideoIndex || 0,
        },
        events: {
            onReady: onPlayerReady,
        }
    });
}

// Countdown and sync logic
function onPlayerReady() {
    const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = Math.floor((startTime - now) / 1000);
        const countdownElem = document.getElementById("countdown");
        
        // Update countdown display
        countdownElem.innerText = timeLeft > 0
            ? `Starts in ${timeLeft} seconds`
            : "Playing!";

        // Start playback when the countdown hits 0
        if (timeLeft <= 0) {
            clearInterval(interval);
            const secondsSinceStart = Math.floor((now - startTime) / 1000);
            player.seekTo(secondsSinceStart, true);
            player.playVideo();
        }
    }, 500);
}
*/

let player;  // To hold the YouTube player instance
let startTime;

// Function to load configuration from config.json
async function loadConfig() {
    try {
        const response = await fetch("config.json");
        const config = await response.json();
        
        // Parse config values
        startTime = new Date(config.startTime);
        
        // Load YouTube Player with playlist and start index from config
        loadYouTubePlayer(config.playlistId, config.startVideoIndex);
        
    } catch (error) {
        console.error("Failed to load configuration:", error);
    }
}

// Function to initialize YouTube Player
function loadYouTubePlayer(playlistId, startVideoIndex) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    // YouTube API callback to create player instance with the loaded playlist ID and index
    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player("player", {
            height: "315",
            width: "560",
            playerVars: {
                listType: "playlist",
                list: playlistId,
                index: startVideoIndex
            },
            events: {
                onReady: onPlayerReady
            }
        });
    };
}

function onPlayerReady() {
    const interval = setInterval(() => {
        const now = new Date();
        const timeLeft = Math.floor((startTime - now) / 1000);
        const countdownElem = document.getElementById("countdown");

        countdownElem.innerText = timeLeft > 0
            ? `Starts in ${timeLeft} seconds`
            : "Playing!";

        // Start playback at countdown end
        if (timeLeft <= 0) {
            clearInterval(interval);
            const secondsSinceStart = Math.floor((now - startTime) / 1000);
            player.mute();  // Autoplay workaround
            player.seekTo(secondsSinceStart, true);
            player.playVideo();
            setTimeout(() => player.unMute(), 1000);  // Unmute after start
        }
    }, 500);
}

// Load configuration and start the application
loadConfig();