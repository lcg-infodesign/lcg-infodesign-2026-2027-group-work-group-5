let larghezzaBarattolo = 200; 
let altezzaBarattolo = 120; 

let xAfrica, xAmerica, xAsia, xEuropa, xOceania; //variabili per la posizione su x di ogni barattolo di ogni continente
let yBarattoli; //la variabile y è unica perchè i barattoli e le scritte sono tutte alla stessa altezza

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');
  textSize(18);

  let spaziaturaOrizzontale = 230; 
  
  //rendo che posX sarà il centro, ed è dato dallo spazio occupato dai barattoli, fatto dai barattoli stessi e dalla spaziatura, tutto questo sottratto alla schermata
  //e poi diviso per due per trovare il centro
  let posX = (windowWidth - (5 * spaziaturaOrizzontale)) / 2;
  yBarattoli = (windowHeight - altezzaBarattolo) / 2;

  //scrivo la posizione di ogni continente -- ogni volta che vado avanti col continente, passo nel barattolo (nello spazio) successivo
  xAfrica = posX+0 * spaziaturaOrizzontale;
  xAmerica = posX+1 * spaziaturaOrizzontale;
  xAsia = posX+2 * spaziaturaOrizzontale;
  xEuropa = posX+3 * spaziaturaOrizzontale;
  xOceania = posX+4 * spaziaturaOrizzontale;
}

function draw() {
  background(255);

  //barattolo Africa
  fill(255); 
  stroke(0); 
  strokeWeight(2);
  rect(xAfrica, yBarattoli, larghezzaBarattolo, altezzaBarattolo, 25);

  //testo Africa
  noStroke(); 
  fill(0); 
  textAlign(CENTER, CENTER);
  text("Africa", xAfrica + larghezzaBarattolo / 2, yBarattoli + altezzaBarattolo / 2);

  //barattolo America
  fill(255); 
  stroke(0); 
  strokeWeight(2);
  rect(xAmerica, yBarattoli, larghezzaBarattolo, altezzaBarattolo, 25);

  //testo America
  noStroke(); 
  fill(0); 
  textAlign(CENTER, CENTER);
  text("America", xAmerica + larghezzaBarattolo / 2, yBarattoli + altezzaBarattolo / 2);

  //barattolo Asia
  fill(255); 
  stroke(0); 
  strokeWeight(2);
  rect(xAsia, yBarattoli, larghezzaBarattolo, altezzaBarattolo, 25);
  
  //testo Asia
  noStroke(); 
  fill(0); 
  textAlign(CENTER, CENTER);
  text("Asia", xAsia + larghezzaBarattolo / 2, yBarattoli + altezzaBarattolo / 2);

  //barattolo Europa
  fill(255); 
  stroke(0); 
  strokeWeight(2);
  rect(xEuropa, yBarattoli, larghezzaBarattolo, altezzaBarattolo, 25);
  
  //testo Europa
  noStroke(); 
  fill(0); 
  textAlign(CENTER, CENTER);
  text("Europa", xEuropa + larghezzaBarattolo / 2, yBarattoli + altezzaBarattolo / 2);

  //barattolo Oceania
  fill(255); 
  stroke(0); 
  strokeWeight(2);
  rect(xOceania, yBarattoli, larghezzaBarattolo, altezzaBarattolo, 25);
  
  //testo Oceania
  noStroke(); 
  fill(0); 
  textAlign(CENTER, CENTER);
  text("Oceania", xOceania + larghezzaBarattolo / 2, yBarattoli + altezzaBarattolo / 2);
}

function mousePressed() {
  if (mouseX > xAfrica && mouseX < xAfrica + larghezzaBarattolo && mouseY > yBarattoli && mouseY < yBarattoli + altezzaBarattolo) {
    window.location.href = "Africa.html";
  }
  if (mouseX > xAmerica && mouseX < xAmerica + larghezzaBarattolo && mouseY > yBarattoli && mouseY < yBarattoli + altezzaBarattolo) {
    window.location.href = "America.html";
  }
  if (mouseX > xAsia && mouseX < xAsia + larghezzaBarattolo && mouseY > yBarattoli && mouseY < yBarattoli + altezzaBarattolo) {
    window.location.href = "Asia.html";
  }
  if (mouseX > xEuropa && mouseX < xEuropa + larghezzaBarattolo && mouseY > yBarattoli && mouseY < yBarattoli + altezzaBarattolo) {
    window.location.href = "Europa.html";
  }
  if (mouseX > xOceania && mouseX < xOceania + larghezzaBarattolo && mouseY > yBarattoli && mouseY < yBarattoli + altezzaBarattolo) {
    window.location.href = "Oceania.html";
  }
}

//se il mouse x è maggiore di xAfrica, che sarebbe il bordo sinistro della box, e quindi il mouse è dentro alla box, 
//e contemporaneamente si trova minore del bordo destro (dato dal bordo sinistro + la larghezza del barattolo) 
//e anche se il mouse y è maggiore del bordo in alto dei barattoli (quindi è dentro al barattolo) 
//e contemporaneamente è minore del bordo basso (dato dal bordo alto + l'altezza del barattolo), 
// allora quando clicco mi manda alla finestra africa.html

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
} //rende la pagina responsive