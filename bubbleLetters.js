
function makeBubbleSpan(letter, isTiny) {
  // takes letter and returns span
  if (!letter.match(/[a-z 'ñáéíóúA-ZÁÉÍÓÚ]/i)) {
    console.log('error: a-z');
    return;
  }
  if (isTiny) {
    return("<span class='dot tiny-dot'><span class='letter-in-bubble tiny-letter'>"+ letter +"</span></span>");
  } else {
    return("<span class='dot'><span class='letter-in-bubble'>"+ letter +"</span></span>");  
  }
};

function makeWordIntoSpans(word, isTiny, hasTwoLines){
  // Takes a word and creates bubble spans plus blank lines
    var allBubbleSpans = '';
    var blanksDiv = '<div class="lines-row">';
    var closeBlanksDiv = '</div>';
    var blankLines = '<span class="blank-line"></span>';
    var span, errorMessage;
    // give it an extra line if the row uses two words
    if (hasTwoLines) {
      blankLines += blankLines
    }
    for (let i = 0; i < word.length; i++) {
      span = makeBubbleSpan(word[i], isTiny);
      if (!span) {
        errorMessage = 'must use letters only'
        document.getElementById("error-message").innerHTML = 'Error: ' + errorMessage;
        return;
      }
      allBubbleSpans += span;
    }
  allBubbleSpans = '<div class="bubbles-row">' + allBubbleSpans + '</div>' + blanksDiv + blankLines + closeBlanksDiv;
  document.getElementById("bubbles-container").innerHTML += allBubbleSpans;
  document.getElementById("error-message").innerHTML = "";
};

function clearErrors() {
  var errorMessages = document.querySelectorAll(".error-message");
  for (i = 0; i < errorMessages.length; i++) {
    errorMessages[i].innerHTML = '';
  };
  document.getElementById("error-message").innerHTML = "";
}

function resetHandler() {
  // clear inputs, errors, and worksheet
  var inputs = document.querySelectorAll('input[type=text]');
  for (i = 0; i < inputs.length; i++) {
    inputs[i].value = '';
  };
  document.getElementById('instructions-input').value ="";
  document.getElementById("word-bank").style.visibility = 'hidden';
  document.getElementById('instructions-cntr').innerHTML ="";
  document.getElementById("bubbles-container").innerHTML = "";
  clearErrors();
};

function makeWordBank(wordList) {
  // Create a shuffled word bank out of all the words
  var wordBankCtr = document.getElementById("word-bank");
  var wordListSpans = '';
  wordList.sort((a, b) => 0.5 - Math.random()); 
  for (let i = 0; i < wordList.length; i++) {
    wordListSpans += "<span class='bank-word'>" + wordList[i] + "</span>";
  };
  wordBankCtr.innerHTML = '<h3>Word Bank</h3><div class="word-spans">' + wordListSpans + '</div>';
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
  let formLine, word1, word2, errorMessage, hasTwoLines, isTiny, letters, shuffledLetters;
  var wordList = [];
  document.getElementById("bubbles-container").innerHTML = "";
  clearErrors();
  // go through each form line
  for (i = 0; i < formLinesList.length; i++) {
    isTiny = false;
    formLine = formLinesList[i];
    // go through both inputs in that form line
    word1 = formLine.children[0].value;
    word2 = formLine.children[1].value;
    // check for character limit
    if (word1.length + word2.length > 26) {
      errorMessage = "limit 26 letters per line"
      document.getElementById("error-message-" + i).innerHTML = "Error: " + errorMessage;
        return;
    // make the bubbles small if there are more than 14 letters
    } else if (word1.length + word2.length > 14) {
      isTiny = true;
    }
    // take a word or pair of words
    if (word1.length || word2.length) {
      // add them to the word bank
      if (word1) {
        wordList.push(word1);  
      }
      if (word2) {
        wordList.push(word2);
      }
      // remove spaces, shuffle letters, and create spans
      word1 = word1.split(' ').join('');
      word2 = word2.split(' ').join('');
      letters = word1.concat(word2).split('');
      shuffledLetters = letters.sort((a, b) => 0.5 - Math.random());
      hasTwoLines = (word1.length && word2.length);
      makeWordIntoSpans(shuffledLetters, isTiny, hasTwoLines);
    }
  };
  if (wordList.length) {
    makeWordBank(wordList);
  }
  makeInstructions(instructionsText);
};

function downloadPdfHandler() {
  var element = document.getElementById('worksheet');
  var opt = {
    margin:       0,
    filename:     'bubble letters.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1, scrollY: 0 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait'}
  };
  html2pdf().set(opt).from(element).save();
}

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

function onClickDownload(event) {
  downloadPdfHandler();
}