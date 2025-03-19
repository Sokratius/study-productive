const bell = new Audio('./audio/bell.mp3');

const sessions = {
    focus: document.querySelector('.focus'),
    shortBreak: document.querySelector('.short-break'),
    longBreak: document.querySelector('.long-break'),
};

const timerMinutes = document.querySelector('.minutes');
const timerSeconds = document.querySelector('.seconds');

const controls = {
    start_stop: document.querySelector('.start-stop'),
    skip: document.querySelector('.skip'),
    reset: document.querySelector('.reset'),
};

const timeSettingsElems = {
    focusTimeSetting: document.querySelector('.focus-time'),
    shortBreakTimeSetting: document.querySelector('.short-break-time'),
    longBreakTimeSetting: document.querySelector('.long-break-time'),
    longBreakInterval: document.querySelector('.long-break-interval'),
    timeSettingSubmitting: document.querySelector('.submit-options'),
};

let allSessionsElem = document.querySelector('.session-counter-number');
allSessionsElem.textContent = 1;

let focusTime = 25 * 60;
let shortBreakTime = 5 * 60;
let longBreakTime = 10 * 60;
let currentTimerTime = focusTime;
let timerID = null;
let currentSession = sessions.focus;
let sessionCounter = 0;
let allSessions = 1;

const validateInputs = () => {
    const inputs = [
        timeSettingsElems.focusTimeSetting,
        timeSettingsElems.shortBreakTimeSetting,
        timeSettingsElems.longBreakTimeSetting,
        timeSettingsElems.longBreakInterval
    ];

    let valid = true;

    inputs.forEach(input => {
        let value = parseInt(input.value);

        if (isNaN(value) || value < 1 || value > 60) {
            valid = false;
            input.style.border = '2px solid red';
        } else {
            input.style.border = '2px solid green';
        }
    });

    timeSettingsElems.timeSettingSubmitting.disabled = !valid;
};

timeSettingsElems.timeSettingSubmitting.addEventListener('click', () => {
    if (timeSettingsElems.timeSettingSubmitting.disabled) return;

    focusTime = parseInt(timeSettingsElems.focusTimeSetting.value) * 60;
    shortBreakTime = parseInt(timeSettingsElems.shortBreakTimeSetting.value) * 60;
    longBreakTime = parseInt(timeSettingsElems.longBreakTimeSetting.value) * 60;

    currentTimerTime = (currentSession === sessions.focus) ? focusTime :
        (currentSession === sessions.shortBreak) ? shortBreakTime :
            longBreakTime;

    setTimerTime(currentTimerTime);
});

Object.values(timeSettingsElems).forEach(input => {
    if (input.tagName === 'INPUT') {
        input.addEventListener('input', validateInputs);
    }
});

controls.start_stop.addEventListener('click', () => {
    if (!timerID) {
        startTimer();
        controls.start_stop.textContent = 'Stop';
    } else {
        stopTimer();
    }
});

controls.skip.addEventListener('click', () => {
    stopTimer();
    changeSession();
});

controls.reset.addEventListener('click', () => {
    stopTimer();
    resetSession();
});

function startTimer() {
    timerID = setInterval(() => {
        if (currentTimerTime <= 0) {
            stopTimer();
            changeSession();
            bell.play();
        } else {
            currentTimerTime--;
            setTimerTime(currentTimerTime);
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerID);
    timerID = null;
    controls.start_stop.textContent = 'Start';
}

function setTimerTime(time) {
    timerMinutes.textContent = String(Math.floor(time / 60)).padStart(2, "0");
    timerSeconds.textContent = String(time % 60).padStart(2, "0");
}

function changeSession() {
    sessionCounter++;

    if (currentSession === sessions.focus) {
        currentSession = (sessionCounter >= parseInt(timeSettingsElems.longBreakInterval.value)) ? sessions.longBreak : sessions.shortBreak;
    } else {
        currentSession = sessions.focus;
        allSessions++;
        allSessionsElem.textContent = allSessions;
    }

    sessionCounter = (currentSession === sessions.longBreak) ? 0 : sessionCounter;

    updateSessionDisplay();
}

function resetSession() {
    currentTimerTime = (currentSession === sessions.focus) ? focusTime :
        (currentSession === sessions.shortBreak) ? shortBreakTime :
            longBreakTime;

    setTimerTime(currentTimerTime);
}

function updateSessionDisplay() {
    Object.values(sessions).forEach(session => session.removeAttribute('data-current-session'));
    currentSession.setAttribute('data-current-session', '');

    resetSession();
}
