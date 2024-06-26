document.addEventListener("DOMContentLoaded", function() {
    var viewportWidth = window.innerWidth;
    var viewportHeight = window.innerHeight;
    var currentZIndex = 100;  // Starting z-index as defined in CSS

    var mydivs = document.querySelectorAll(".mydiv");
    mydivs.forEach(function(elmnt) {
        // Randomize position within the viewport
        var randomTop = Math.floor(Math.random() * (viewportHeight - elmnt.offsetHeight));
        var randomLeft = Math.floor(Math.random() * (viewportWidth - elmnt.offsetWidth));

        elmnt.style.top = randomTop + "px";
        elmnt.style.left = randomLeft + "px";

        // Initialize drag functionality
        dragElement(elmnt);
    });
});

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    var trash = document.getElementById('trashcan'); // Access the trash can element
    var header = elmnt.querySelector(".mydivheader");

    function dragMouseDown(e) {
        e.preventDefault();  // Prevents unwanted scrolling and other behaviors
        if (e.type === 'touchstart') {
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
        document.onmouseup = closeDragElement;
        document.ontouchend = closeDragElement;
        document.onmousemove = elementDrag;
        document.ontouchmove = elementDrag;
        elmnt.style.zIndex = ++currentZIndex; // Bring element to the front on mouse down or touch start
    }

    if (header) {
        // Handle mouse and touch events
        header.onmousedown = dragMouseDown;
        header.ontouchstart = dragMouseDown;
    } else {
        // Handle mouse and touch events
        elmnt.onmousedown = dragMouseDown;
        elmnt.ontouchstart = dragMouseDown;
    }

    function elementDrag(e) {
        e.preventDefault();  // Prevents unwanted scrolling and other behaviors
        if (e.type === 'touchmove') {
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
        } else {
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
        }

        var newTop = Math.max(0, Math.min(window.innerHeight - elmnt.offsetHeight, elmnt.offsetTop - pos2));
        var newLeft = Math.max(0, Math.min(window.innerWidth - elmnt.offsetWidth, elmnt.offsetLeft - pos1));

        elmnt.style.top = newTop + "px";
        elmnt.style.left = newLeft + "px";

        updateTrashcanAppearance(elmnt, trash);
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.ontouchend = null;
        document.onmousemove = null;
        document.ontouchmove = null;

        if (updateTrashcanAppearance(elmnt, trash, true)) {
            elmnt.parentNode.removeChild(elmnt);  // Remove element if it overlaps trashcan
        }
        trash.style.backgroundColor = '#221629';  // Reset to original color
    }
}

function updateTrashcanAppearance(elmnt, trash, finalize = false) {
    var trashRect = trash.getBoundingClientRect();
    var elmntRect = elmnt.getBoundingClientRect();
    if (elmntRect.left < trashRect.right && elmntRect.right > trashRect.left &&
        elmntRect.top < trashRect.bottom && elmntRect.bottom > trashRect.top) {
        trash.style.backgroundColor = 'red';  // Change color to red indicating ready to delete
        return true;
    } else {
        if (!finalize) {
            trash.style.backgroundColor = '#221629';  // Revert to original color if not finalizing
        }
        return false;
    }
}
