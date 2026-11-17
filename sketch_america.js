let myTable;
let paesiAmerica = [
  'Antigua and Barbuda', 'Argentina', 'Bahamas', 'Barbados', 'Belize', 
  'Bolivia (Plurinational State of)', 'Brazil', 'Canada', 'Chile', 'Colombia', 
  'Costa Rica', 'Cuba', 'Dominica', 'Dominican Republic', 'Ecuador', 
  'El Salvador', 'Grenada', 'Guatemala', 'Guyana', 'Haiti', 'Honduras', 
  'Jamaica', 'Mexico', 'Nicaragua', 'Panama', 'Paraguay', 'Peru', 
  'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
  'Suriname', 'Trinidad and Tobago', 'Turks and Caicos Islands', 
  'United States', 'Uruguay', 'Venezuela (Bolivarian Republic of)'
];

let paesiConDati = {}; // dizionario per ora vuoto, per verificare quali paesi hanno dati nel CSV

//griglia di pallini
let diametro = 28;
let spazioX = 140; //distanze orizzontali e verticali tra ogni pallino
let spazioY = 100; 

let hoveredCountry; //chiamo la variabile vuota del paese su cui va il mouse


async function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');

  myTable = await loadTable("assets/child_marriage.csv", ",", "header");

  verificaDisponibilitaDati();
}

//ciclo che scorre uno alla volta tutti i paesi dell'array paesiAmerica 
function verificaDisponibilitaDati() {
  for (let i = 0; i < paesiAmerica.length; i++) {
    let paese = paesiAmerica[i];
    let haDati = false; //per ogni paese parte ipotizzando che non abbia dati

    for (let r = 0; r < myTable.getRowCount(); r++) {
      let areaVal = myTable.getString(r, "area");
      let measureVal = myTable.getString(r, "measure");
      let disaggregationVal = myTable.getString(r, "disaggregation");
      let valStringa = myTable.getString(r, "value");
      let valNumero = parseFloat(valStringa);

      //se la riga del CSV corrisponde al paese che stiamo analizzando, se la misura è in percentuale, se si riferisce al totale e se il numero è valido con number.isFinite allora HADATI è true
      if (areaVal === paese && measureVal === "Percent" && disaggregationVal === "Total" && Number.isFinite(valNumero)) {
        haDati = true;
      }
    }
    paesiConDati[paese] = haDati; //salva il risultato true o false dentro al dizionario
  }
}


function draw() {
  background(255, 255, 255);

  fill(0);
  noStroke();
  textSize(42);
  text("AMERICA", 140, 80);

  textSize(14);
  text("Paesi totali nel continente: " + paesiAmerica.length, 180, 115);

 
  //coordinate pallino
  let startX = 80; 
  let startY = 200;
  let x = startX;
  let y = startY;
  let xMax = width - 120;

  hoveredCountry = null; //permette di azzerare l'hovered

  for (let i = 0; i < paesiAmerica.length; i++) { //la i corrisponde a ogni nazione
    let paese = paesiAmerica[i]; //il paese è ogni elemento dell'array
    let haDati = paesiConDati[paese]; // legge dal dizionario se quel paese haDati è true o false (quindi se ci sono i dati nel CSV o no)

    let d = dist(mouseX, mouseY, x, y); //d è la distanza tra le coordinate del mouse e le coordinate di ogni pallino
    let isHovered = (d < diametro / 2); //partendo dal centro, se d. è minore del raggio vuol dire che sono dentro al pallino

    if (haDati && isHovered) { //se il mouse è dentro al pallino E il paese ha i dati
      hoveredCountry = paese; //allora la variabile che prima era vuota, diventa uguale al paese
    } 

    if (haDati) {
      stroke(0, 0, 0);
      strokeWeight(2);
      fill(0); //pallino nero cliccabile
    } else {
      stroke(200);
      strokeWeight(1.5);
      fill(210); // pallino grigio non cliccabile
    }

    circle(x, y, diametro);

    noStroke();
    if (haDati) {
      fill(0); // testo nero paese 
    } else {
      fill(160); // testo grigio paese senza dati
    }

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