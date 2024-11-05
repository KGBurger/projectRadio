let player;
let startTime;

async function loadConfig() {
    try {
        const response = await fetch("config.json");
        const config = await response.json();
        
        startTime = new Date(config.startTime);
        
        loadYouTubePlayer(config.playlistId, config.startVideoIndex);
        
    } catch (error) {
        console.error("Failed to load configuration:", error);
    }
}

function loadYouTubePlayer(playlistId, startVideoIndex) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

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

        if (timeLeft <= 0) {
            clearInterval(interval);
            const secondsSinceStart = Math.floor((now - startTime) / 1000);
            player.mute();
            player.seekTo(secondsSinceStart, true);
            player.playVideo();
            setTimeout(() => player.unMute(), 1000);
        }
    }, 500);
}

loadConfig();
