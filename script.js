let paragraphs = [];
let currentIndex = 0;
let startTime = 0;

const textDiv = document.getElementById('text');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const fileInput = document.getElementById('fileInput');
const controlsDiv = document.getElementById('controls');
const customizeControls = document.getElementById('customizeControls');

const fontSizeSelect = document.getElementById('fontSizeSelect');
const fontStyleSelect = document.getElementById('fontStyleSelect');
const fontColorInput = document.getElementById('fontColorInput');

// Initial font styles
let fontSize = 18;
let letterSpacing = 0.05;
let fontFamily = 'Arial, sans-serif';
let fontColor = '#000000';

function applyStyles() {
  textDiv.style.fontSize = fontSize + "px";
  textDiv.style.letterSpacing = letterSpacing + "em";
  textDiv.style.fontFamily = fontFamily;
  textDiv.style.color = fontColor;
}

function showParagraph(index) {
  textDiv.textContent = paragraphs[index];
  startTime = Date.now();

  prevBtn.disabled = index === 0;
  nextBtn.textContent = index === paragraphs.length - 1 ? "Finish" : "Next";
  applyStyles();
}

function adjustStyles(readDuration) {
  // Increase size/spacing if reading took longer than 8 sec
  if (readDuration > 8000) {
    fontSize = Math.min(fontSize + 2, 30);
    letterSpacing = Math.min(letterSpacing + 0.02, 0.2);
  } 
  // Decrease size/spacing if reading was faster than 5 sec
  else if (readDuration < 5000) {
    fontSize = Math.max(fontSize - 2, 14);
    letterSpacing = Math.max(letterSpacing - 0.01, 0.03);
  }
  applyStyles();
}

nextBtn.onclick = () => {
  const readTime = Date.now() - startTime;
  adjustStyles(readTime);

  if (currentIndex < paragraphs.length - 1) {
    currentIndex++;
    showParagraph(currentIndex);
  } else {
    alert("You've finished reading!");
    nextBtn.disabled = true;
  }
};

prevBtn.onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    showParagraph(currentIndex);
  }
};

fileInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const content = event.target.result;
    // Split text into paragraphs by double new lines or single new lines
    paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    if (paragraphs.length === 0) {
      alert("The file seems empty or not properly formatted.");
      return;
    }

    currentIndex = 0;
    fontSize = 18;
    letterSpacing = 0.05;
    fontFamily = fontStyleSelect.value;
    fontColor = fontColorInput.value;

    showParagraph(currentIndex);

    fileInput.style.display = 'none';
    controlsDiv.style.display = 'block';
    customizeControls.style.display = 'flex';
  };
  reader.readAsText(file);
};

// Handle font size change by user
fontSizeSelect.onchange = () => {
  fontSize = parseInt(fontSizeSelect.value, 10);
  applyStyles();
};

// Handle font style change by user
fontStyleSelect.onchange = () => {
  fontFamily = fontStyleSelect.value;
  applyStyles();
};

// Handle font color change by user
fontColorInput.oninput = () => {
  fontColor = fontColorInput.value;
  applyStyles();
};
