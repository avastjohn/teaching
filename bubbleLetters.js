
function makeBubbleSpan(letter) {
  // takes letter and returns span
  if (!letter.match(/[a-z]/i)) {
    console.log('error: a-z');
    return;
  }
  return("<span class='dot'><span class='letter-in-bubble'>"+ letter +"</span></span>");
};

function makeWordIntoSpans(word){
  // Takes a word and creates bubble spans plus blank lines
    var allBubbleSpans = '';
    var blankLines = '<div class="lines-row"><span class="blank-line"></span><span class="blank-line"></span></div>';
    var span, errorMessage;
    for (let i = 0; i < word.length; i++) {
      span = makeBubbleSpan(word[i]);
      if (!span) {
        errorMessage = 'must use letters only'
        document.getElementById("error-message").innerHTML = 'Error: ' + errorMessage;
        return;
      }
      allBubbleSpans += span;
    }
  allBubbleSpans = '<div class="bubbles-row">' + allBubbleSpans + '</div>' + blankLines;
  document.getElementById("bubbles-container").innerHTML += allBubbleSpans;
  document.getElementById("error-message").innerHTML = "";
};

function resetHandler() {
  // clear inputs, errors, and worksheet
  var inputs = document.querySelectorAll('input[type=text]');
  for (i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  };
  document.getElementById('instructions-input').value ="";
  document.getElementById("error-message").innerHTML = "";
  document.getElementById("word-bank").style.visibility = 'hidden';
  document.getElementById('instructions-cntr').innerHTML ="";
  document.getElementById("bubbles-container").innerHTML = "";
};

function makeWordBank(wordList) {
  // Create a shuffled word bank out of all the words
  var wordBankCtr = document.getElementById("word-bank");
  var wordListSpans = '';
  wordList.sort((a, b) => 0.5 - Math.random()); 
  for (let i = 0; i < wordList.length; i++) {
    wordListSpans += "<span class='bank-word'>" + wordList[i] + "</span>";
  };
  wordBankCtr.innerHTML = '<h2>Word Bank</h2><div class="word-spans">' + wordListSpans + '</div>';
  wordBankCtr.style.visibility = "visible";
};

function makeInstructions(instructionsText) {
  // Write instructions for the pdf
  var instructionCntr = document.getElementById('instructions-cntr');
  instructionCntr.innerHTML = "<p>" + instructionsText + "</p>";
};

function submitHandler() {
  var formLinesList = document.getElementsByClassName('word-inputs');
  var instructionsText = document.getElementById('instructions-input').value;
  let formLine, word1, word2, errorMessage, letters, shuffledLetters;
  var wordList = [];
  document.getElementById("bubbles-container").innerHTML = "";
  // go through each form line
  for (i = 0; i < formLinesList.length; i++) {
    formLine = formLinesList[i];
    // go through both inputs in that form line
    word1 = formLine.children[0].value.toLowerCase();
    word2 = formLine.children[1].value.toLowerCase();
    // check for character limit
    if (word1.length + word2.length > 14) {
      errorMessage = "limit 14 letters per line"
      document.getElementById("error-message").innerHTML = "Error: " + errorMessage;
        return;
    }
    // take a pair of words
    if (word1.length || word2.length) {
      // add them to the word bank
      wordList.push(word1);
      wordList.push(word2);
      // shuffle letters and create spans
      letters = word1.concat(word2).split('');
      shuffledLetters = letters.sort((a, b) => 0.5 - Math.random());
      makeWordIntoSpans(shuffledLetters);
    }
  };
  if (wordList.length) {
    makeWordBank(wordList);
  }
  makeInstructions(instructionsText);
};

window.addEventListener("load", (event) => {
  const form = document.getElementById("words");
  form.addEventListener("submit", onSubmit);
  form.addEventListener("reset", onReset);
});

function onSubmit(event) {
  event.preventDefault();
  submitHandler();
};

function onReset(event) {
  event.preventDefault();
  resetHandler();
};
