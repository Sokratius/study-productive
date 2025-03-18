const bell = new Audio('./audio/bell.mp3');

let sessions = {
    focus: document.querySelector('.focus'),
    shortBreak: document.querySelector('.short-break'),
    longBreak: document.querySelector('.long-break'),
};

let timerMinutes = document.querySelector('.minutes');
let timerSeconds = document.querySelector('.seconds');



let controls = {
    start_stop: document.querySelector('.start-stop'),
    skip: document.querySelector('.skip'),
    reset: document.querySelector('.reset'),
}

let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 10 * 60;
let currentTimerTime = focusTime;
let timerID;
let currentSession = sessions.focus;
let sessionCounter = 0;

let timeSettingsElems = {
    focusTimeSetting: document.querySelector('.focus-time'),
    shortBreakTimeSetting: document.querySelector('.short-break-time'),
    longBreakTimeSetting: document.querySelector('.long-break-time'),
    timeSettingSubmitting: document.querySelector('.submit-options'),
}


timeSettingsElems.timeSettingSubmitting.addEventListener('click', () => {
    focusTime = timeSettingsElems.focusTimeSetting.value * 60;
    shortBreakTime = timeSettingsElems.shortBreakTimeSetting.value * 60;
    longBreakTime = timeSettingsElems.longBreakTimeSetting.value * 60;

    if (currentSession === sessions.focus) {
        currentTimerTime = focusTime;
        setTimerTime(currentTimerTime);
    } else if (currentSession === sessions.shortBreak) {
        currentTimerTime = shortBreakTime;
        setTimerTime(currentTimerTime);
    } else {
        currentTimerTime = longBreakTime;
        setTimerTime(currentTimerTime);
    }

    setTimerTime(currentTimerTime);
});

controls.start_stop.addEventListener('click', (event) => {
    if (event.currentTarget.textContent.trim() === 'Start') {
        event.currentTarget.textContent = 'Stop';
        timerID = setInterval(() => {
            startTimer();
            if (currentTimerTime <= 0) {
                clearInterval(timerID);
                changeSession();
                bell.play();
            }
        }, 1000);
    } else {
        event.currentTarget.textContent = 'Start';
        clearInterval(timerID);
    }
});

controls.skip.addEventListener('click', () => {
    clearInterval(timerID);
    changeSession();
});

controls.reset.addEventListener('click', () => {
    clearInterval(timerID);

    if (currentSession === sessions.focus) {
        currentTimerTime = focusTime;
        setTimerTime(currentTimerTime);
    } else if (currentSession === sessions.shortBreak) {
        currentTimerTime = shortBreakTime;
        setTimerTime(currentTimerTime);
    } else {
        currentTimerTime = longBreakTime;
        setTimerTime(currentTimerTime);
    }

    controls.start_stop.textContent = 'Start';
});


function startTimer() {
    currentTimerTime--;
    timerMinutes.textContent =  String(Math.floor(currentTimerTime/60)).padStart(2, "0");
    timerSeconds.textContent = String(currentTimerTime%60).padStart(2, "0");

}

function setTimerTime(time) {
    currentTimerTime = time;
    timerMinutes.textContent =  String(Math.floor(currentTimerTime/60)).padStart(2, "0");
    timerSeconds.textContent = String(currentTimerTime%60).padStart(2, "0");
}

function changeSession() {
    controls.start_stop.textContent = 'Start';
    if (currentSession === sessions.focus && sessionCounter >= 3) {
        sessionCounter = 0;
        currentSession = sessions.longBreak;
        sessions.focus.removeAttribute('data-current-session');
        sessions.longBreak.setAttribute('data-current-session', '');
        currentTimerTime = longBreakTime;
        setTimerTime(currentTimerTime);
    } else if (currentSession === sessions.focus) {
        sessionCounter++;
        currentSession = sessions.shortBreak;
        sessions.focus.removeAttribute('data-current-session');
        sessions.shortBreak.setAttribute('data-current-session', '');
        currentTimerTime = shortBreakTime;
        setTimerTime(currentTimerTime);
    } else if (currentSession === sessions.shortBreak) {
        currentSession = sessions.focus;
        sessions.shortBreak.removeAttribute('data-current-session');
        sessions.focus.setAttribute('data-current-session', '');
        currentTimerTime = focusTime;
        setTimerTime(currentTimerTime);
    } else if (currentSession === sessions.longBreak) {
        currentSession = sessions.focus;
        sessions.longBreak.removeAttribute('data-current-session');
        sessions.focus.setAttribute('data-current-session', '');
        currentTimerTime = focusTime;
        setTimerTime(currentTimerTime);
    }

}

