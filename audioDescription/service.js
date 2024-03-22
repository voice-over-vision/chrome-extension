const url = "ws://127.0.0.1:8000/";

const showPauseMoments = (pauseMoments) => {
    pauseMoments.forEach((pauseMoment, index) => {
        createDescriptionMarker(pauseMoment, index);
    })
}

handleAudioDescriptionEvent = (data) => {
    console.log("Handling audio description event")
    console.log(data)
    descriptionDataToPlay.data.push(data);
    createDescriptionMarker(data['start_timestamp'], data['id'], hasDescription=true)
}

const connectWithBackend = (youtubeID) => {
    youtubePlayer = getYoutubePlayer();
    webSocket = new WebSocket(url);
    console.log("opening WS")

    webSocket.onopen = () => {
        webSocket.send(JSON.stringify({
            "event": EventTypes.INITIAL_MESSAGE,
            "youtubeID": youtubeID,
            "currentTime": youtubePlayer.currentTime
        }));
    };
    console.log("WS open!")

    webSocket.onmessage = function (e) {
        const data = JSON.parse(e.data);
        console.log("Message from WS: ")
        console.log(data)

        const event = data['event'];
        // Handle incoming message
        switch (event) {
            case EventTypes.PAUSE_MOMENTS:
                showPauseMoments(data['pause_moments']);
                break;
            case EventTypes.AUDIO_DESCRIPTION:
                handleAudioDescriptionEvent(data)
        }
    };

}