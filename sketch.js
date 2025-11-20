let canvasW = 378;
let canvasH = 756;

const bgColor = '#121212';
const cardColor = '#1c1c1c';
const accent = '#1DB954';
const mutedText = '#b3b3b3';
const lightText = '#f5f5f5';

const margin = 16;
const cardPadding = 10;
const buttonGap = 8;
const buttonH = 32;
const sectionSpacing = 8;
const titleHeight = 18;
const headerHeight = 56;
const topSpacing = 12;

let moodOptions = ['Très joyeux', 'Bonne humeur', 'Neutre', 'Triste', 'Énervé'];
let activityOptions = ['Sport', 'Devoirs', 'Détente', 'Ménage', 'Soirée', 'Trajet'];
let genreOptions = ['Rock', 'Rap', 'Électro', 'Pop', 'Lo-fi', 'Classique', 'Latino', 'Variété FR', 'Autre'];

let moodButtons = [];
let activityButtons = [];
let genreButtons = [];
let moodSelected = -1;
let activitySelected = -1;
let genreSelected = [];

let playlistInput;
let generateBtn;
let playlistName = '';
let summaryText = 'Clique sur "Générer mon Mix du jour" pour voir un résumé personnalisé.';

let layout = {};

function setup() {
  createCanvas(canvasW, canvasH);
  textFont('sans-serif');
  textSize(14);
  noStroke();

  layout.cardW = canvasW - margin * 2;
  layout.currentY = headerHeight + topSpacing;

  layout.mood = createGridSection(moodOptions, 2);
  layout.activity = createGridSection(activityOptions, 3);
  layout.genre = createGridSection(genreOptions, 3);
  layout.playlist = createPlaylistSection();
  layout.summary = createSummarySection();

  playlistInput = createInput('');
  playlistInput.position(margin + cardPadding, layout.playlist.cardY + cardPadding + 28);
  playlistInput.size(layout.cardW - cardPadding * 2, 34);
  playlistInput.style('background', '#1f1f1f');
  playlistInput.style('color', lightText);
  playlistInput.style('border', '1px solid #2e2e2e');
  playlistInput.style('padding', '6px 8px');
  playlistInput.style('border-radius', '6px');
  playlistInput.style('font-size', '14px');

  generateBtn = createButton('Générer mon Mix du jour');
  generateBtn.position(margin + cardPadding, layout.playlist.cardY + cardPadding + 28 + 34 + 12);
  generateBtn.size(layout.cardW - cardPadding * 2, 40);
  generateBtn.style('background', accent);
  generateBtn.style('color', '#000');
  generateBtn.style('border', 'none');
  generateBtn.style('border-radius', '8px');
  generateBtn.style('font-weight', 'bold');
  generateBtn.style('font-size', '14px');
  generateBtn.mousePressed(updateSummary);
}

function draw() {
  background(bgColor);
  drawHeader();
  layout.currentY = headerHeight + topSpacing;

  drawMoodSection();
  drawActivitySection();
  drawGenreSection();
  drawPlaylistSection();
  drawSummarySection();
}

function drawHeader() {
  fill(accent);
  rect(0, 0, width, headerHeight);
  fill('#000');
  textAlign(LEFT, CENTER);
  textSize(20);
  text('Mix du jour', margin, headerHeight / 2 - 8);
  textSize(13);
  text('Fiche Spotify interactive', margin, headerHeight / 2 + 12);
  textSize(14);
}

function createGridSection(options, columns) {
  let titleY = layout.currentY;
  let cardY = titleY + titleHeight;
  let rows = ceil(options.length / columns);
  let cardH = calcGridHeight(rows);
  let buttons = createButtons(options, columns, cardY, cardH);

  layout.currentY = cardY + cardH + sectionSpacing;
  return { titleY, cardY, cardH, columns, buttons };
}

function createPlaylistSection() {
  let titleY = layout.currentY;
  let cardY = titleY + titleHeight;
  let cardH = 124;
  layout.currentY = cardY + cardH + sectionSpacing;
  return { titleY, cardY, cardH };
}

function createSummarySection() {
  let titleY = layout.currentY;
  let cardY = titleY + titleHeight;
  let cardH = 90;
  return { titleY, cardY, cardH };
}

function calcGridHeight(rows) {
  return cardPadding * 2 + rows * buttonH + (rows - 1) * buttonGap;
}

function createButtons(options, columns, cardY, cardH) {
  let rows = ceil(options.length / columns);
  let buttonW = (layout.cardW - cardPadding * 2 - (columns - 1) * buttonGap) / columns;
  let btns = [];
  for (let i = 0; i < options.length; i++) {
    let row = floor(i / columns);
    let col = i % columns;
    let x = margin + cardPadding + col * (buttonW + buttonGap);
    let y = cardY + cardPadding + row * (buttonH + buttonGap);
    btns.push({ label: options[i], x, y, w: buttonW, h: buttonH });
  }
  return btns;
}

function drawSectionTitle(title, y) {
  fill(lightText);
  textAlign(LEFT, TOP);
  textSize(15);
  text(title, margin, y);
  textSize(14);
}

function drawCard(x, y, w, h) {
  fill(cardColor);
  rect(x, y, w, h, 10);
}

function drawButtonGrid(buttons, selectedIndices) {
  buttons.forEach((btn, idx) => {
    let selected = false;
    if (Array.isArray(selectedIndices)) {
      selected = selectedIndices[idx];
    } else {
      selected = selectedIndices === idx;
    }
    fill(selected ? accent : '#2a2a2a');
    stroke(selected ? '#1ed760' : '#1a1a1a');
    strokeWeight(1);
    rect(btn.x, btn.y, btn.w, btn.h, 8);
    noStroke();
    fill(selected ? '#000' : lightText);
    textAlign(CENTER, CENTER);
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 1);
  });
  noStroke();
}

function drawMoodSection() {
  drawSectionTitle('1. Ton humeur du moment', layout.mood.titleY);
  drawCard(margin, layout.mood.cardY, layout.cardW, layout.mood.cardH);
  drawButtonGrid(layout.mood.buttons, moodSelected);
}

function drawActivitySection() {
  drawSectionTitle('2. Ce que tu fais en écoutant', layout.activity.titleY);
  drawCard(margin, layout.activity.cardY, layout.cardW, layout.activity.cardH);
  drawButtonGrid(layout.activity.buttons, activitySelected);
}

function drawGenreSection() {
  drawSectionTitle('3. Styles que tu veux écouter', layout.genre.titleY);
  drawCard(margin, layout.genre.cardY, layout.cardW, layout.genre.cardH);
  if (genreSelected.length === 0) {
    genreSelected = Array(genreOptions.length).fill(false);
  }
  drawButtonGrid(layout.genre.buttons, genreSelected);
}

function drawPlaylistSection() {
  drawSectionTitle('4. Ta playlist du jour', layout.playlist.titleY);
  drawCard(margin, layout.playlist.cardY, layout.cardW, layout.playlist.cardH);
  fill(mutedText);
  textAlign(LEFT, TOP);
  text('Nom de la playlist :', margin + cardPadding, layout.playlist.cardY + cardPadding);
}

function drawSummarySection() {
  drawSectionTitle('5. Résumé de ton Mix du jour', layout.summary.titleY);
  drawCard(margin, layout.summary.cardY, layout.cardW, layout.summary.cardH);
  fill(lightText);
  textAlign(LEFT, TOP);
  textLeading(18);
  text(summaryText, margin + cardPadding, layout.summary.cardY + cardPadding, layout.cardW - cardPadding * 2, layout.summary.cardH - cardPadding * 2);
}

function mousePressed() {
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
  handleGridClick(layout.mood.buttons, 1, (index) => {
    moodSelected = index;
  });

  handleGridClick(layout.activity.buttons, 1, (index) => {
    activitySelected = index;
  });

  handleGridClick(layout.genre.buttons, 0, (index) => {
    genreSelected[index] = !genreSelected[index];
  });
}

function handleGridClick(buttons, single, onToggle) {
  buttons.forEach((btn, idx) => {
    if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
      if (single) {
        onToggle(idx);
      } else {
        onToggle(idx);
      }
    }
  });
}

function updateSummary() {
  playlistName = playlistInput.value().trim();
  let mood = moodSelected >= 0 ? moodOptions[moodSelected] : 'non précisé';
  let activity = activitySelected >= 0 ? activityOptions[activitySelected] : 'non précisé';
  let selectedGenres = genreSelected.reduce((acc, v, i) => {
    if (v) acc.push(genreOptions[i]);
    return acc;
  }, []);
  let genresText = selectedGenres.length ? selectedGenres.join(', ') : 'non précisé';
  let vibe = 'chill';
  const energetic = ['Rock', 'Rap', 'Électro'];
  if (selectedGenres.some((g) => energetic.includes(g))) {
    vibe = 'énergique';
  }
  if (mood === 'Triste') {
    vibe = 'nostalgique';
  }
  const playlistLabel = playlistName.length ? playlistName : 'sans nom';
  summaryText =
    '• Playlist : ' + playlistLabel +
    '\n• Humeur : ' + mood +
    '\n• Activité : ' + activity +
    '\n• Styles : ' + genresText +
    '\n• Ambiance globale : ' + vibe +
    '\n\nTu peux maintenant ajouter tes morceaux directement dans Spotify. 🎧';
}
