let myTable;
let selectedCountry = "";
let valorePercentualeSotto18 = 0;
let valorePercentualeSotto15 = 0;


async function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');

  myTable = await loadTable("assets/child_marriage.csv", ",", "header");

  // legge il parametro passato nell’URL --> tipo ?country=Albania
  let params = getURLParams();
  if (params.country) { // va a prendere il valore che si trova dentro la chiave country dell'URL
    selectedCountry = decodeURIComponent(params.country); // ripulisce il nome del country da simboli strani, accenti ecc
  }

  percentualePaese();
}


function percentualePaese() {
  // ciclo for che scorre tutte le righe della tabella CSV
  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++) {
    let areaVal = myTable.getString(numRiga, "area");
    let sexVal = myTable.getString(numRiga, "sex");
    let indicatorVal = myTable.getString(numRiga, "indicator");
    let measureVal = myTable.getString(numRiga, "measure");
    let disaggregationVal = myTable.getString(numRiga, "disaggregation");

    if (areaVal && indicatorVal && measureVal) {  // controlla che tutti questi valori ci siano nel dataset
      let area = areaVal;

      // controlla che tutti i parametri ci siano contemporaneamente
      if (area === selectedCountry && 
          measureVal === "Percent" &&  // quando la misura è in percentuale e NON in numero assoluto
          disaggregationVal === "Total") { // quindi quando voglio considerare il totale, NON le sottocategorie tipo rural o richest
        
        let valStringa = myTable.getString(numRiga, "value"); // estrae il valore della colonna sotto forma di stringa di testo
        let valNumero = parseFloat(valStringa); // parseFloat converte una stringa in numero decimale
        
        if (Number.isFinite(valNumero)) { // controlla che il valore sia un numero finito, escludendo NaN, null e vuoti
          if (sexVal === "Women" && indicatorVal === "Married by 18") {
            valorePercentualeSotto18 = valNumero; // salva il numero relativo alle femmine sotto i 18 anni
          }
          if (sexVal === "Women" && indicatorVal === "Married by 15") {
            valorePercentualeSotto15 = valNumero; // salva il dato relativo alle femmine sotto i 15 anni
          }
        }
      }
    }
  }
}


function draw() {
  background(65, 32, 74);

  // titolo con il nome del paese 
  let nomePaese = "";
  
  if (selectedCountry) {
    nomePaese = selectedCountry; // se c'è il paese scrive il nome
  } else {
    nomePaese = "PAESE NON SPECIFICATO"; // se non c'è scrive questo
  }
  fill(248, 237, 255);
  noStroke();
  textSize(36);
  textAlign(LEFT, TOP);
  text(nomePaese, 60, 60);

  // testo femmine sotto i 18
  let testoValoreSotto18 = "";

  if (valorePercentualeSotto18) { // controlla se esiste una percentuale valida
    testoValoreSotto18 = valorePercentualeSotto18 + "%"; // se c'è, aggiunge il simbolo percentuale
  } else {
    testoValoreSotto18 = "dato non disponibile"; // altrimenti scrive che non ci sono dati
  }

  textSize(14);
  fill(248, 237, 255);
  text("Matrimoni precoci che coinvolgono femmine sotto i 18 anni: " + testoValoreSotto18, 60, 110);

  // testo femmine sotto i 15
  let testoValoreSotto15 = "";

  if (valorePercentualeSotto15) { 
    testoValoreSotto15 = valorePercentualeSotto15 + "%"; 
  } else {
    testoValoreSotto15 = "dato non disponibile"; 
  }

  textSize(14);
  fill(248, 237, 255);
  text("Matrimoni precoci che coinvolgono femmine sotto i 15 anni: " + testoValoreSotto15, 60, 135);


  // pallini
  let centerX = width / 2;
  let centerY = height / 2 + 10; // centrato leggermente per fare spazio alla legenda in basso
  let diametroPallino = 26;
  let spacing = 32; // spazio tra le colonne di pallini

  let raggioCerchio = 170; // larghezza cerchio fatto dai pallini
  let tuttiICerchi = [];

  let colonne = 11; // colonne di pallini che formano il cerchio
  let startX = centerX - (colonne * spacing) / 2;
  let startY = centerY - (colonne * spacing) / 2;

  for (let riga = 0; riga < colonne; riga++) { // cicli annidati per muoversi su riga e colonna
    for (let col = 0; col < colonne; col++) {
      let x = startX + col * spacing + spacing / 2;
      let y = startY + riga * spacing + spacing / 2;

      let distanzaDalCentro = dist(centerX, centerY, x, y); // distanza dal centro del singolo pallino
      if (distanzaDalCentro < raggioCerchio) {
        tuttiICerchi.push({ x: x, y: y }); 
      }
    }
  }


  // creazione del cerchio di pallini ordinati per vicinanza al centro
  tuttiICerchi.sort(function(a, b) { 
    return dist(centerX, centerY, a.x, a.y) - dist(centerX, centerY, b.x, b.y); 
  });

  let pallini100 = tuttiICerchi.slice(0, 100); // prende i 100 pallini più vicini al centro


  // curva 
  let palliniColoratiSotto18 = round(valorePercentualeSotto18); // arrotonda all'intero più vicino
  let palliniColoratiSotto15 = round(valorePercentualeSotto15); 

  for (let i = 0; i < pallini100.length; i++) {
    let p = pallini100[i]; 

    let normalX = map(p.x, centerX - raggioCerchio, centerX + raggioCerchio, -PI, PI); 
    let curvaY = centerY + sin(normalX) * 35; // altezza della curva
 
    p.distCurva = abs(p.y - curvaY); // valore assoluto della distanza dalla curva
  }

  // ordiniamo i pallini in base alla vicinanza a questa curva fluida
  pallini100.sort((a, b) => a.distCurva - b.distCurva); 

  for (let i = 0; i < pallini100.length; i++) {
    pallini100[i].isSotto18 = (i < palliniColoratiSotto18); 
    pallini100[i].isSotto15 = (i < palliniColoratiSotto15); 
  }
  
  // disegno pallini
  for (let i = 0; i < pallini100.length; i++) {
    let p = pallini100[i];

    if (p.isSotto15) {
      fill(234, 186, 160); 
      noStroke();
    } else if (p.isSotto18) {
      fill(225, 146, 124); 
      noStroke();
    } else {
      fill(84, 59, 94);
      noStroke();
    }

    strokeWeight(1.5);
    circle(p.x, p.y, diametroPallino);
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}