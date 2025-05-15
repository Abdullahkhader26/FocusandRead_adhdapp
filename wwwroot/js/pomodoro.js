class PomodoroTimer {
    constructor() {
        this.timeLeft = 0;
        this.isRunning = false;
        this.timerInterval = null;
        this.originalTime = 0;
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        // Timer controls
        this.startButton = document.querySelector('#timer-dropdown .btn-success');
        this.pauseButton = document.querySelector('#timer-dropdown .btn-danger');
        this.resetButton = document.querySelector('#timer-dropdown .btn-secondary');
        
        // Timer display
        this.timerDisplay = document.querySelector('#timer-dropdown .activity-desc');
        
        // Timer presets
        this.timerPresets = document.querySelectorAll('.timer-preset');
        
        // Progress circle
        this.progressCircle = document.querySelector('.progress-circle:last-child');
        this.circleCircumference = 2 * Math.PI * 10; // r = 10
        this.progressCircle.style.strokeDasharray = this.circleCircumference;
    }

    initializeEventListeners() {
        // Timer controls
        this.startButton.addEventListener('click', () => this.startTimer());
        this.pauseButton.addEventListener('click', () => this.pauseTimer());
        this.resetButton.addEventListener('click', () => this.resetTimer());
        
        // Timer presets
        this.timerPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                const minutes = parseInt(preset.getAttribute('data-minutes'));
                this.setTimer(minutes);
            });
        });
    }

    setTimer(minutes) {
        this.timeLeft = minutes * 60;
        this.originalTime = this.timeLeft;
        this.updateDisplay();
        this.updateProgress();
    }

    startTimer() {
        if (!this.isRunning && this.timeLeft > 0) {
            this.isRunning = true;
            this.startButton.style.display = 'none';
            this.pauseButton.style.display = 'inline-block';
            
            this.timerInterval = setInterval(() => {
                this.timeLeft--;
                this.updateDisplay();
                this.updateProgress();
                
                if (this.timeLeft <= 0) {
                    this.timerComplete();
                }
            }, 1000);
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.timerInterval);
            this.startButton.style.display = 'inline-block';
            this.pauseButton.style.display = 'none';
        }
    }

    resetTimer() {
        this.pauseTimer();
        this.timeLeft = this.originalTime;
        this.updateDisplay();
        this.updateProgress();
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateProgress() {
        const progress = this.timeLeft / this.originalTime;
        const offset = this.circleCircumference * (1 - progress);
        this.progressCircle.style.strokeDashoffset = offset;
    }

    timerComplete() {
        this.pauseTimer();
        this.playNotificationSound();
        this.showNotification();
    }

    playNotificationSound() {
        const audio = new Audio('/sounds/timer-complete.mp3');
        audio.play().catch(error => console.log('Error playing sound:', error));
    }

    showNotification() {
        if ('Notification' in window) {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('Pomodoro Timer', {
                        body: 'Time is up! Take a break.',
                        icon: '/images/timer-icon.png'
                    });
                }
            });
        }
    }
}

// Initialize the Pomodoro timer when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const pomodoroTimer = new PomodoroTimer();
    // Set default timer (25 minutes)
    pomodoroTimer.setTimer(25);
}); 