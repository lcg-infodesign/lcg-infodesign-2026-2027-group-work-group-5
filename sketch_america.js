let myTable;
let paesiAmerica = [
  'Argentina', 'Barbados', 'Belize', 'Bolivia (Plurinational State of)', 
  'Brazil', 'Chile', 'Colombia', 'Costa Rica', 'Cuba', 'Dominican Republic', 
  'Ecuador', 'El Salvador', 'Guatemala', 'Guyana', 'Haiti', 'Honduras', 
  'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay', 'Peru', 
  'Saint Lucia', 'Suriname', 'Trinidad and Tobago', 'Turks and Caicos Islands', 
  'Uruguay', 'Venezuela (Bolivarian Republic of)'
];

//griglia di pallini
let diametro = 28;
let spazioX = 140; //distanze orizzontali e verticali tra ogni pallino
let spazioY = 100; 

let hoveredCountry; //chiamo la variabile vuota del paese su cui va il mouse


async function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');

  myTable = await loadTable("assets/child_marriage.csv", ",", "header");
}

function draw() {
  background(255, 255, 255);

  fill(0);
  noStroke();
  textSize(42);
  text("AMERICA", 140, 80);

  textSize(14);
  text("Paesi presenti nel dataset: " + paesiAmerica.length, 180, 115);

 
  //coordinate pallino
  let startX = 80; 
  let startY = 200;
  let x = startX;
  let y = startY;
  let xMax = width - 120;

  hoveredCountry = null; //permette di azzerare l'hovered

  for (let i = 0; i < paesiAmerica.length; i++) { //la i corrisponde a ogni nazione
    let paese = paesiAmerica[i]; //il paese è ogni elemento dell'array

    let d = dist(mouseX, mouseY, x, y); //d è la distanza tra le coordinate del mouse e le coordinate di ogni pallino
    let isHovered = (d < diametro / 2); //partendo dal centro, se d. è minore del raggio vuol dire che sono dentro al pallino

    if (isHovered) { //se il mouse è dentro al pallino
      hoveredCountry = paese; //allora la variabile che prima era vuota, diventa uguale al paese
    } 


    stroke(0,0,0);
    strokeWeight(2);
    circle(x, y, diametro);

    noStroke();
    fill(0);
    textSize(12);
    textAlign(CENTER, BOTTOM);
    text(paese, x, y - diametro / 2-8); //se non ci fosse il -8, la scritta sarebbe attaccata al bordo superiore del pallino, cioè y-raggio

    x += spazioX; //ogni volta la x aumenta di spazio x
    if (x > xMax) { //se x diventa maggiore di x max, 
      x = startX; //x torna allo start
      y += spazioY; //e scende di spazio Y
    }
  }
}


function mousePressed() {
  if (hoveredCountry) { //se ho cliccato sopra uno dei pallini corrispondenti al paese
    let encodedCountry = encodeURIComponent(hoveredCountry); //fa si che il programma capisca anche se le scritte hanno apostrofi o accenti
    
    window.location.href = "paeseAmerica.html?country=" + encodedCountry;
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}//rende la pagina responsive