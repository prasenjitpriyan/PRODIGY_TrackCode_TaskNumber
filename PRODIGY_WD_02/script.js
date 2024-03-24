document.addEventListener("DOMContentLoaded", function () {
  // Get the elements by their IDs
  const hoursElement = document.getElementById("hours");
  const minutesElement = document.getElementById("minutes");
  const secondsElement = document.getElementById("seconds");
  const startStopButton = document.getElementById("startStopButton");
  const resetButton = document.getElementById("resetButton");

  // Get modal and buttons
  const modal = document.getElementById("settingsModal");
  const settingsButton = document.getElementById("settingsButton");
  const closeModal = document.getElementById("closeModal");
  const submitFormButton = document.getElementById("submitForm");

  // Initialize stopwatch values
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  let isRunning = false;
  let intervalId;

  // Function to update the stopwatch time
  function updateStopwatch() {
    hoursElement.textContent = formatTime(hours);
    minutesElement.textContent = formatTime(minutes);
    secondsElement.textContent = formatTime(seconds);
  }

  // Function to format time values (add leading zeros)
  function formatTime(time) {
    return time < 10 ? `0${time}` : time;
  }

  // Function to start the stopwatch
  function startStopwatch() {
    intervalId = setInterval(function () {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
        if (minutes === 60) {
          minutes = 0;
          hours++;
        }
      }
      checkBreakpoints();
      updateStopwatch();
    }, 1000);
  }

  // Function to stop the stopwatch
  function stopStopwatch() {
    clearInterval(intervalId);
  }

  // Function to reset the stopwatch
  function resetStopwatch() {
    hours = 0;
    minutes = 0;
    seconds = 0;
    updateStopwatch();
  }

  // Event listener for the "Start/Stop" button click
  startStopButton.addEventListener("click", function () {
    if (isRunning) {
      // If running, stop the stopwatch
      stopStopwatch();
      startStopButton.textContent = "Start";
      startStopButton.setAttribute("value", "Start");
      resetButton.disabled = false; // Enable the reset button
      settingsButton.disabled = false; // Enable the settings button
    } else {
      // If not running, start the stopwatch
      startStopwatch();
      startStopButton.textContent = "Stop"; startStopButton.setAttribute("value", "Stop");
      resetButton.disabled = true; // Disable the reset button while running
      settingsButton.disabled = true; // Disable the settings button while running
    }

    // Toggle the running state
    isRunning = !isRunning;
  });

  // Event listener for the "Reset" button click
  resetButton.addEventListener("click", function () {
    if (!isRunning) {
      // If not running, reset the stopwatch
      resetStopwatch();
      resetButton.disabled = true; // Disable the reset button after resetting
      changeBackgroundColor("white");
    }
  });

  // Event listener to open the modal
  settingsButton.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Event listener to close the modal
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Event listener to close the modal on form submit
  submitFormButton.addEventListener("click", function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Additional logic for handling form submission if needed

    // Close the modal
    modal.style.display = "none";

    return false;
  });

  // Close the modal if the user clicks outside the modal
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
  // Define breakpoint items (hour, minute, second, color)

  let breakpoints = [];
  /*
        { hour: 0, minute: 0, second: 5, color: '#008000' },
        { hour: 0, minute: 0, second: 10, color: '#FFD700' },
        { hour: 0, minute: 0, second: 15, color: '#DC143C' }
        // Add more breakpoints as needed
    ];
    */
  // Function to set breakpoints based on form values
  function setBreakpoints() {
    // Iterate through each breakpoint option in the form
    breakpoints = []; // Reset the breakpoints field.

    document.querySelectorAll('.breakpoint-option').forEach(function (option, index) {
      const color = option.querySelector('input[type="color"]').value;
      const hour = parseInt(option.querySelector('input[name="hour' + (index + 1) + '"]').value);
      const minute = parseInt(option.querySelector('input[name="minute' + (index + 1) + '"]').value);
      const second = parseInt(option.querySelector('input[name="second' + (index + 1) + '"]').value);

      // Check if all inputs have valid values
      if (!isNaN(hour) && !isNaN(minute) && !isNaN(second)) {
        breakpoints.push({ hour, minute, second, color });
      }
    });

    // Update the global breakpoints array
    window.breakpoints = breakpoints;
  }

  // Event listener for form submission
  document.getElementById('submitForm').addEventListener('click', function (event) {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Set breakpoints based on form values
    setBreakpoints();

    // Close the modal
    document.getElementById('settingsModal').style.display = 'none';
  });

  // Function to check if the stopwatch time matches any breakpoint
  function checkBreakpoints() {
    const currentHour = hours;
    const currentMinute = minutes;
    const currentSecond = seconds;

    // Check each breakpoint
    for (const breakpoint of breakpoints) {
      // Order these conditions by frequency so fewer checks are tested.
      if (
        currentSecond === breakpoint.second &&
        currentMinute === breakpoint.minute &&
        currentHour === breakpoint.hour
      ) {
        // Match found, change background color
        changeBackgroundColor(breakpoint.color);
        return; // Stop checking if a match is found
      }
    }
  }

  // Function to change the background color of the stopwatch container
  function changeBackgroundColor(color) {
    document.querySelector('.stopwatch-container').style.backgroundColor = color;
  }

});