// function that triggers the overlay when the help button is depressed.
function overlay() {
  var overlay = document.getElementById("overlay");
  var containerElement = document.getElementById("backgroundblur");
  if (overlay.style.display == "none") {
    overlay.style.display = "block";
    containerElement.setAttribute("class", "blur");
  } else {
    overlay.style.display = "none";
    containerElement.setAttribute("class", null);
  }
}