/*	@function overlay
	A function called when the help button is released, it toggles the help overlay and the blur on the main div
*/
function overlay() {
  var overlay = document.getElementById("overlay");
  var containerElement = document.getElementById("main");
  if (overlay.style.display == "none") {
    overlay.style.display = "block";
    containerElement.setAttribute("class", "blur");
  } else {
    overlay.style.display = "none";
    containerElement.setAttribute("class", null);
  }
}