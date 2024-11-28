import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const input = document.querySelector(`#datetime-picker`);
let userSelectedDate = null;
const startButton = document.querySelector("button[data-start]")
startButton.disabled = true;
let timeInterval;



function updateStartButtonState(isEnabled) {
    startButton.disabled = !isEnabled;
  }

  function convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
  
    // Remaining days
    const days = Math.floor(ms / day);
    // Remaining hours
    const hours = Math.floor((ms % day) / hour);
    // Remaining minutes
    const minutes = Math.floor(((ms % day) % hour) / minute);
    // Remaining seconds
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
  }

 
  
  console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
  console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
  console.log(convertMs(24140000)); // {days: 0, hours: б, minutes: 42, seconds: 20}
  
  flatpickr(`#datetime-picker`, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0]; 
  
      if (selectedDate.getTime() <= new Date().getTime()) {
        window.alert("Please choose a date in the future");
        userSelectedDate = null; 
        updateStartButtonState(false); 
      } else {
        userSelectedDate = selectedDate;
        updateStartButtonState(true); 
      }
  
      console.log(selectedDate);

    },
  });
  
  
  function updateTimerUI({ days, hours, minutes, seconds }) {
    document.querySelector("[data-days]").textContent = String(days).padStart(2, "0");
    document.querySelector("[data-hours]").textContent = String(hours).padStart(2, "0");
    document.querySelector("[data-minutes]").textContent = String(minutes).padStart(2, "0");
    document.querySelector("[data-seconds]").textContent = String(seconds).padStart(2, "0");
  }
 

function startTimer() {
 if(!userSelectedDate) 
  return;
  input.disabled = true;
  startButton.disabled = true;

  timeInterval = setInterval(() => {
    const currentTime = new Date();
    const timeDifference = userSelectedDate.getTime() - currentTime.getTime();

    if(timeDifference <= 0) {
      clearInterval(timeInterval);
      updateTimerUI({days: 0, hours: 0, minutes: 0, seconds: 0});
      input.disabled = false;
      return;
    }

    const timeLeft = convertMs(timeDifference);
     updateTimerUI(timeLeft);
    

  }, 1000);

  
}

startButton.addEventListener("click", startTimer);