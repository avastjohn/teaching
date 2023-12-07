
function makeBubbleSpan(letter) {
	// takes letter and returns span
	if (!letter.match(/[a-z]/i)) {
		console.log('error: a-z');
		return;
	}
	return("<span class='dot'><span class='letter-in-bubble'>"+ letter +"</span></span>");
};

function makeWordIntoSpans(word){
	// Takes a word and creates bubble spans
    var allBubbleSpans = '';
    var span, errorMessage;
    if (word.length > 20) {
    	// check for character limit
    	errorMessage = "limit 20 letters"
    	document.getElementById("error-message").innerHTML = "Error: " + errorMessage;
        return;
    }
    word = word.toLowerCase();
    for (let i = 0; i < word.length; i++) {
        span = makeBubbleSpan(word[i]);
        if (!span) {
        	errorMessage = 'must use letters only'
            document.getElementById("error-message").innerHTML = 'Error: ' + errorMessage;
            return;
        }
        allBubbleSpans += span;
    }
    document.getElementById("bubbles-container").innerHTML = allBubbleSpans;
    document.getElementById("error-message").innerHTML = "";
};

window.addEventListener("load", (event) => {
    var bubble = makeWordIntoSpans('plotz');
});
