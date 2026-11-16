let myTable;
let selectedCountry = "";
let valorePercentualeFemmine = 0;
let valorePercentualeMaschi = 0;


function preload() {
  myTable = loadTable("assets/child_marriage.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('monospace');

  // legge il parametro passato nell’URL --> tipo ?country=Algeria
  let params = getURLParams();
  if (params.country) { // va a prendere il valore che si trova dentro la chiave country dell'URL
    selectedCountry = decodeURIComponent(params.country); //ripulisce il nome del country da simboli strani, accenti ecc
  }

  percentualePaese();
}

function percentualePaese() {
  //ciclo for che scorre tutte le righe della tabella CSV
  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++) {
    let areaVal = myTable.getString(numRiga, "area");
    let sexVal = myTable.getString(numRiga, "sex");
    let indicatorVal = myTable.getString(numRiga, "indicator");
    let measureVal = myTable.getString(numRiga, "measure");
    let disaggregationVal = myTable.getString(numRiga, "disaggregation");

    if (areaVal && indicatorVal && measureVal) {  //controlla che tutti questi valori ci siano nel dataset
      let area = areaVal;

      //controlla che tutti i parametri ci siano contemporaneamente
      if (area === selectedCountry && 
          indicatorVal === "Married by 18" && 
          measureVal === "Percent" &&  //quando la misura è in percentuale e NON in numero assoluto (che c'è anche quello nel csv)
          disaggregationVal === "Total") { //quindi quando voglio considerare il totale, NON le sottocategorie tipo rural o richest
        
        //se non mettiamo queste due variabili alcuni paese non si vedono!!!!!!
        let valStringa = myTable.getString(numRiga, "value"); //estrae il valore della colonna sotto forma di stringa di testo
        let valNumero = parseFloat(valStringa); //parseFloat è una funzione che converte una stringa in numero decimale
        
        if (Number.isFinite(valNumero)) { //controlla che il valore sia un numero finito , escludendo NaN, null e vuoti
          if (sexVal === "Women") {
            valorePercentualeFemmine = valNumero; //se il numero è valido la funzione guarda la colonna sex --> se è women salva il numero in valorePercentualeFemmine
          }
          if (sexVal === "Men") {
            valorePercentualeMaschi = valNumero; //se è men lo salva in valorePercentualeMaschi
          }
        }
      }
    }
  }
}


function draw() {
  background('#0A192F');

  // titolo con il nome del paese 
  let nomePaese = "";
  
  if (selectedCountry) {
    nomePaese = selectedCountry; // se c'è il paese scrive il nome
    } else {
    nomePaese = "PAESE NON SPECIFICATO"; // se non c'è scrive questo
  }
  fill(255);
  noStroke();
  textSize(36);
  textAlign(LEFT, TOP);
  text(nomePaese, 60, 60);

  /* TESTO FEMMINE */
  let testoValoreFemmine = "";

  if (valorePercentualeFemmine) { // controlla se esiste una percentuale valida
    testoValoreFemmine = valorePercentualeFemmine + "%"; // se c'è, aggiunge il simbolo percentuale
    } else {
    testoValoreFemmine = "dato non disponibile"; // altrimenti scrive che non ci sono dati
  }

  textSize(14);
  fill(180);
  text("Matrimoni precoci che coinvolgono femmine sotto i 18 anni: " + testoValoreFemmine, 60, 110);

  /* TESTO MASCHI */
  let testoValoreMaschi = "";

  if (valorePercentualeMaschi) { 
    testoValoreMaschi = valorePercentualeMaschi + "%"; 
  } else {
    testoValoreMaschi = "dato non disponibile"; 
  }

  textSize(14);
  fill(180);
  text("Matrimoni precoci che coinvolgono maschi sotto i 18 anni: " + testoValoreMaschi, 60, 135);


  //pallini
  let centerX = width / 2;
  let centerY = height / 2 + 30; //+30 così il pallino è centrato considerata anche la scritta sopra
  let diametroPallino = 26;
  let spacing = 32; //spazio tra le colonne di pallini

  let raggioCerchio = 170; //larghezza cerchio fatto dai pallini
  let tuttiICerchi = [];

  let colonne = 11; //colonne di pallini che formano il cerchio
  let startX = centerX - (colonne * spacing) / 2;
  let startY = centerY - (colonne * spacing) / 2;

  for (let riga = 0; riga < colonne; riga++) { //faccio un for dentro un for = cicli annidati --> serve perchè mi devo muovere contemporaneamente sulle due dimensioni riga-colonna
    //ogni volta che il ciclo della riga compie un passo (quindi scende di una riga), il ciclo della colonna scorre tutte le colonne di quella riga, da sinistra a destra, fino alla fine
    for (let col = 0; col < colonne; col++) {
      let x = startX + col * spacing + spacing / 2;
      let y = startY + riga * spacing + spacing / 2;
      //parto da startX, che è il bordo più a sinistra che c'è, da qui aggiungo il numero della colonna per la spaziatura (32) 
      // poi aggiungo anche la spaziatura/2 in modo che il pallino sia centrato nel suo quadratino della griglia invisibile

      let distanzaDalCentro = dist(centerX, centerY, x, y); //distanza dal centro del singolo pallino
      if (distanzaDalCentro < raggioCerchio) {
        tuttiICerchi.push({ x: x, y: y }); //.push mette dentro l'array (prima vuoto) ciò che c'è dentro alla parentesi. come x mette la x del pallino appena trovata, come y la y
      }
    }
  }


  //creazione del cerchio di pallini
  tuttiICerchi.sort(function(a, b) { //.sort ordina gli elementi della lista, prendendone due alla volta, cioè a e b
    return dist(centerX, centerY, a.x, a.y) - dist(centerX, centerY, b.x, b.y); //restituisce un NUMERO, che è la differenza tra la distanza delle coordinate del centro e le coordinate di a MENO la distanza tra le coordinate del centro e le coordinate di b
    //.sort guarda il segno di return e mette in ordine i pallini nell'array in base alla vicinanza al centro
  });

  let pallini100 = tuttiICerchi.slice(0, 100); //.slice(0, 100) prende la lista e taglia via tutto ciò che viene dopo il centesimo elemento
  // cosi la variabile pallini100 ha i 100 pallini più vicini al centro geometrico del cerchio, scartando i pallini in eccesso (perchè in tutto sarebbero 121, 11*11) --> così la figura è un cerchio e non un quadrato !


  /* CURVA FEMMINE */
  // calcoliamo come colorare i pallini rispetto a una curva che attraversa la biglia

  //variabile per decidere quanti pallini colorare su un totale di 100 pallini
  let palliniColorati = round(valorePercentualeFemmine); //round arrotornda il numero all'intero più vicino (per poi colorare quel nuemro di pallini su 100)

  for (let i = 0; i < pallini100.length; i++) {
    let p = pallini100[i]; // scegliamo un solo pallino tra i 100 usando l'indice i

    // creiamo l'onda centrale basata sul seno della coordinata x
    let normalX = map(p.x, centerX - raggioCerchio, centerX + raggioCerchio, -PI, PI); //map converte la coordinata x del singolo pallino(p) in un valore compreso tra meno pigreco e pigreco
    // serve mettere anche centerX-raggioCerchio, ... perche voglio che i pallini colorati a curva stiano compresi tra i deu bordi più estremi a destra e sinistra del cerchio  
    let curvaY = centerY + sin(normalX) * 35; // 35 dà l'altezza della curva
 
    p.distCurva = abs(p.y - curvaY); //distCurva è una proprietà relativa a ogni palllino
    //con abs ricaviamo il valore assoluto della distanza tra la y del pallino e la y della curva (che ancora non è fatta di pallini colorati)
    //serve il valore assoluto perchè il risultato della sottrazione potrebbe anche essere negativo, in quel caso sort (che è dopo) oridnerebbe i pallini in modo sballato 
  }

  // ordiniamo i pallini in base alla vicinanza a questa curva fluida (che ancora è trastarente! stiamo decidendo i pallini che POI verranno colorati )
  pallini100.sort((a, b) => a.distCurva - b.distCurva); //arrow da capire !

  for (let i = 0; i < pallini100.length; i++) {
    pallini100[i].isFemmina = (i < palliniColorati); // la proprietà isFemmina potrà valere solo true o false
    //(i < palliniColorati) è una condizione di confronto booleana: i è l'indice di ciasscun pallino (da 0 a 99), palliniColorati è il numero totale di pallini che dobbiamo colorare (tipo se in Angola la percentuale delle ragazze è 23%, palliniColorati sarà 23).
  }


  /* CURVA MASCHI */

  //fa la stessa cosa fatta per le femmine ma col meno davanti al seno quindi crea un'onda speculare
  let palliniColoratiMaschi = round(valorePercentualeMaschi);

  for (let i = 0; i < pallini100.length; i++) {
    let p = pallini100[i];
    let normalX = map(p.x, centerX - raggioCerchio, centerX + raggioCerchio, -PI, PI);
    let curvaYMaschi = centerY - sin(normalX) * 35; 
    p.distCurvaMaschi = abs(p.y - curvaYMaschi);
  }

  pallini100.sort((a, b) => a.distCurvaMaschi - b.distCurvaMaschi);
  
  for (let i = 0; i < pallini100.length; i++) {
    pallini100[i].isMaschio = (i < palliniColoratiMaschi);
  }


  /* DISEGNO PALLINI */
  for (let i = 0; i < pallini100.length; i++) {
    let p = pallini100[i];

    // i primi N pallini (quindi quelli più vicini alla curva trasparente) formano la curva colorata
    if (p.isFemmina) {
      fill('#4E8A75'); //se i pallini fanno parte di quelli che vanno colorati (sia perchè solo la percentuale giusta che perchè sono vicini alla curva), allora sono verdi
      stroke('#4E8A75');
    } else if (p.isMaschio) {
      fill('#885A89');
      stroke('#885A89');
    } else {
      fill(35, 45, 60);
      stroke('#A0AAB2');
    }

    //disegno del pallino in generale, il fill è scritto sopra
    strokeWeight(1.5);
    circle(p.x, p.y, diametroPallino);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
