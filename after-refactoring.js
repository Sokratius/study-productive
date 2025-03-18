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
};

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
};

timeSettingsElems.timeSettingSubmitting.addEventListener('click', () => {
    focusTime = parseInt(timeSettingsElems.focusTimeSetting.value) * 60 || 1500;
    shortBreakTime = parseInt(timeSettingsElems.shortBreakTimeSetting.value) * 60 || 300;
    longBreakTime = parseInt(timeSettingsElems.longBreakTimeSetting.value) * 60 || 600;

    currentTimerTime = (currentSession === sessions.focus) ? focusTime :
        (currentSession === sessions.shortBreak) ? shortBreakTime :
            longBreakTime;

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
    currentTimerTime = (currentSession === sessions.focus) ? focusTime :
        (currentSession === sessions.shortBreak) ? shortBreakTime :
            longBreakTime;
    setTimerTime(currentTimerTime);
    controls.start_stop.textContent = 'Start';
});

function startTimer() {
    currentTimerTime--;
    setTimerTime(currentTimerTime);
}

function setTimerTime(time) {
    timerMinutes.textContent = String(Math.floor(time / 60)).padStart(2, "0");
    timerSeconds.textContent = String(time % 60).padStart(2, "0");
}

function changeSession() {
    controls.start_stop.textContent = 'Start';

    if (currentSession === sessions.focus) {
        sessionCounter++;
        currentSession = (sessionCounter >= 4) ? sessions.longBreak : sessions.shortBreak;
    } else {
        currentSession = sessions.focus;
    }

    Object.values(sessions).forEach(session => session.removeAttribute('data-current-session'));
    currentSession.setAttribute('data-current-session', '');

    currentTimerTime = (currentSession === sessions.focus) ? focusTime :
        (currentSession === sessions.shortBreak) ? shortBreakTime :
            longBreakTime;

    setTimerTime(currentTimerTime);
}
