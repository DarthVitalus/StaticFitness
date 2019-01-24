if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => { console.log('[SW] Registered!'); })
        .catch((err) => { console.log('[SW] Not registered!', err.message); });
}

const startBtnEl = document.getElementById("startBtn");
const containerEl = document.getElementById("programContainer");
const stopBtnEl = document.getElementById("stopBtn");
const pauseBtnEl = document.getElementById("pauseBtn");
const continueBtnEl = document.getElementById("continueBtn");
const currentExerciseEl = document.getElementById("currentExercise");
const nextExerciseEl = document.getElementById("nextExercise");
const timerEl = document.getElementById("timer");
const fitnessProgram = [
    {durationSec: 60, posture: "На прямых руках"},
    {durationSec: 30, posture: "На локтях"},
    {durationSec: 30, posture: "Правую ногу вверх"},
    {durationSec: 30, posture: "Левую ногу вверх"},
    {durationSec: 30, posture: "Правая боковая планка"},
    {durationSec: 30, posture: "Левая боковая планка"},
    {durationSec: 30, posture: "На прямых руках"},
    {durationSec: 60, posture: "На локтях"},
];
const video = document.createElement('video');
let exerciseTimer = null;
let exerciseIndex = 0;
let programTimeout = null;

const speak = (msg, endCallBack) => {
    utterances = [];
    var utterance = new SpeechSynthesisUtterance(msg);
    utterance.onend = endCallBack;
    speechSynthesis.speak(utterance);
};

const screenWakeOn = () => {
    const Util={};
    Util.base64 = function(mimeType, base64) {
        return 'data:' + mimeType + ';base64,' + base64;
    };

    video.setAttribute('loop', '');

    function addSourceToVideo(element, type, dataURI) {
        const source = document.createElement('source');
        source.src = dataURI;
        source.type = 'video/' + type;
        element.appendChild(source);
    }

    addSourceToVideo(video,'webm', Util.base64('video/webm', 'GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA='));
    addSourceToVideo(video, 'mp4', Util.base64('video/mp4', 'AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAAG21kYXQAAAGzABAHAAABthADAowdbb9/AAAC6W1vb3YAAABsbXZoZAAAAAB8JbCAfCWwgAAAA+gAAAAAAAEAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAIVdHJhawAAAFx0a2hkAAAAD3wlsIB8JbCAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAQAAAAAAIAAAACAAAAAABsW1kaWEAAAAgbWRoZAAAAAB8JbCAfCWwgAAAA+gAAAAAVcQAAAAAAC1oZGxyAAAAAAAAAAB2aWRlAAAAAAAAAAAAAAAAVmlkZW9IYW5kbGVyAAAAAVxtaW5mAAAAFHZtaGQAAAABAAAAAAAAAAAAAAAkZGluZgAAABxkcmVmAAAAAAAAAAEAAAAMdXJsIAAAAAEAAAEcc3RibAAAALhzdHNkAAAAAAAAAAEAAACobXA0dgAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAIAAgASAAAAEgAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABj//wAAAFJlc2RzAAAAAANEAAEABDwgEQAAAAADDUAAAAAABS0AAAGwAQAAAbWJEwAAAQAAAAEgAMSNiB9FAEQBFGMAAAGyTGF2YzUyLjg3LjQGAQIAAAAYc3R0cwAAAAAAAAABAAAAAQAAAAAAAAAcc3RzYwAAAAAAAAABAAAAAQAAAAEAAAABAAAAFHN0c3oAAAAAAAAAEwAAAAEAAAAUc3RjbwAAAAAAAAABAAAALAAAAGB1ZHRhAAAAWG1ldGEAAAAAAAAAIWhkbHIAAAAAAAAAAG1kaXJhcHBsAAAAAAAAAAAAAAAAK2lsc3QAAAAjqXRvbwAAABtkYXRhAAAAAQAAAABMYXZmNTIuNzguMw=='));

    video.play();
};
const screenWakeOff = () => {
    video.pause();
};

startBtnEl.onclick = () => {
    pauseBtnEl.style.display = 'block';
    continueBtnEl.style.display = 'none';
    startBtnEl.style.display = 'none';
    containerEl.style.display = 'block';
    startExerciseProgram();
};

stopBtnEl.onclick = () => {
    stopExerciseProgram();
};

pauseBtnEl.onclick = () => {
    pauseBtnEl.style.display = 'none';
    continueBtnEl.style.display = 'block';
    clearInterval(exerciseTimer);
    clearTimeout(programTimeout);
};

continueBtnEl.onclick = startBtnEl.onclick;

startExerciseProgram = () => {
    if (fitnessProgram.length <= exerciseIndex) {
        return;
    }

    screenWakeOn();
    currentExercise = fitnessProgram[exerciseIndex];
    const nextIndex = exerciseIndex + 1;

    speak(currentExercise.posture, () => {
        currentExerciseEl.innerHTML = currentExercise.posture;
        nextExerciseEl.innerHTML = fitnessProgram.length > nextIndex ? fitnessProgram[nextIndex].posture : "REST!!!";
        timerEl.innerHTML = currentExercise.durationSec;

        const exerciseStartedAt = Math.round((new Date()).valueOf()/1000);
        exerciseTimer = setInterval(() => {
            const now = Math.round((new Date()).valueOf()/1000);
            timerEl.innerHTML = currentExercise.durationSec - (now - exerciseStartedAt);

            if (timerEl.innerHTML <= 0) {
                clearInterval(exerciseTimer);
                ++exerciseIndex;
                if (fitnessProgram.length > nextIndex) {
                    startExerciseProgram(nextIndex);
                } else {
                    stopExerciseProgram();
                    speak("Закончили упражнения");
                }
            }
        }, 200);
    });

    // exerciseTimer = setInterval(() => {
    // 	counter--;
    // 	timerEl.innerHTML = counter;
    // }, 1000);
    //
    // programTimeout = setTimeout(() => {
    // 	clearInterval(exerciseTimer);
    // 	++exerciseIndex;
    // 	if (fitnessProgram.length > nextIndex) {
    // 		startExerciseProgram(nextIndex);
    // 	} else {
    //         stopExerciseProgram();
    //         msg.text = "Закончили упражнения";
    // 		window.speechSynthesis.speak(msg);
    // 	}
    // }, currentExercise.durationSec * 1000 + 1000);
};

stopExerciseProgram = () => {
    startBtnEl.style.display = 'block';
    containerEl.style.display = 'none';
    clearInterval(exerciseTimer);
    clearTimeout(programTimeout);
    exerciseIndex = 0;
    screenWakeOff();
};