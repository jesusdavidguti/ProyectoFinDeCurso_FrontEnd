// Globales
var valoresChart;
var compraValoresChart;

// Arrays
var arrayCompras = new Array();
var arrayLabelCompras = new Array();
var arrayColor = new Array();
// Objetos
var objetoUrl = new montaUrl();

/* globals Chart:false, feather:false */
(function () {
  'use strict'

  feather.replace()

  // Creamos Chart para Divisas
  var divisasChart = creaChart(document.getElementById('divisasChart'));

  // Creamos Chart para los valores
  // y lo propagamos.
  setChartValores(creaChart(document.getElementById('valoresChart')));

  // Creamos Chart compra de valores
  // y lo propagamos.
  setChartCompraValores(creaChartDonut(document.getElementById('compraValoresChart')));
  
  // Pintamos tres divisas en la semana en curso
  obtenerDatosChartDivisa(function(result){  

    addDatosDivisa("libr", result, divisasChart);

      obtenerDatosChartDivisa(function(result){  

        addDatosDivisa("eur", result, divisasChart);

          obtenerDatosChartDivisa(function(result){  

            addDatosDivisa("suco", result, divisasChart);
          },objetoUrl.getDivisashistBetweenFecs("suco",fechaHasta(3),fechaHasta(0)));          
    
      },objetoUrl.getDivisashistBetweenFecs("eur",fechaHasta(3),fechaHasta(0)));          

  },objetoUrl.getDivisashistBetweenFecs("libr",fechaHasta(3),fechaHasta(0)));            
  
  // Pintamos los valores mejores y peores
  obtenerDatosMaxMin(function(resultMin){    

    pintaDatosMin(resultMin);

    obtenerDatosMaxMin(function(resultMax){    

      pintaDatosMax(resultMax);
    },objetoUrl.getValoreshistTopValor(fechaHasta(3),fechaHasta(0)));    
 
  },objetoUrl.getValoreshistLowValor(fechaHasta(3),fechaHasta(0)));    

  // Cargamos los valores en las dropdown de la página para selección.
  cargarValoresDropdown();

})()

//************************************************/
// Botón de compra valor seleccionado
//************************************************/
function compraValor(){

  let selectValorCompra = document.getElementById("selectValorCompra");  
  let idValor = selectValorCompra.options[selectValorCompra.selectedIndex].value;        
  let idValorText = selectValorCompra.options[selectValorCompra.selectedIndex].innerText;
  let cantidad = parseInt(document.getElementById("cantidaValores").value);
  let importe = 0;

  // Comprobamos que hemos seleccionado algo
  if (idValorText != "Seleccione valor" && cantidad > 0){

    // Recuperamos el valor para saber su precio HOY.
    obtenerDatosValores(function(resultValor){    
      let jsonValor = resultValor;
      
      importe = cantidad * jsonValor.cotizacionUSdolar

      arrayCompras.push(importe); 
      arrayLabelCompras.push(jsonValor.valorHistID.valor.nombre);
      arrayColor.push(colorDivisa(jsonValor.valorHistID.valor.divisa.codDivisa));

      addDatosCompras(arrayColor, arrayLabelCompras, arrayCompras);

    },objetoUrl.getValoreshist(idValor,fechaHasta(0))); 

  }
}

//************************************************/
// Añadimos y actualizamos datos al chart compras
//************************************************/
function addDatosCompras(paramColor, paramLabel, paramData){

  let importe=0
  let totalImporte=0;
  
  // Reiniciamos y pintamos.
  removeData(compraValoresChart);
  setChartCompraValores(creaChartDonut(document.getElementById('compraValoresChart')));

  for(importe of paramData){
    totalImporte = totalImporte + importe;
  }

  document.getElementById("importe").value = "Total " + totalImporte.toFixed(2).toString() + " $US";

  compraValoresChart.data.labels=paramLabel;

  compraValoresChart.data.datasets.push({      
      label: paramLabel,
      data: paramData,
      backgroundColor: paramColor
    });

    compraValoresChart.update();
}

//************************************************/
// Borramos e inicializamos el chart de compras
//************************************************/
function resetCompra(){
  document.getElementById("importe").value = "";
  document.getElementById("cantidaValores").value = "";
  document.getElementById("selectValorCompra").selectedIndex = "0";
  arrayCompras = [];
  arrayLabelCompras = [];
  arrayColor = [];
  removeData(compraValoresChart);
  setChartCompraValores(creaChartDonut(document.getElementById('compraValoresChart')));
}

//************************************************/
// Creamos un chart genérico tipo donut
//************************************************/
function creaChartDonut(paramCtx){

  //let ctxValores = document.getElementById('valoresChart')
  let ctxValores = paramCtx;  
  //ctxValores.height = 300;
  let compraChart = new Chart(ctxValores, {
    type: 'doughnut',
    data: {},
    options:{
      cutout: 90,
      //maintainAspectRatio : false,
      //cutoutPercentage: 70,
      //responsive: true,
      //aspectRatio: 1
    },
  })

  return compraChart;
}

//************************************************/
// Carga de valores en las dropdown
//************************************************/
function cargarValoresDropdown(){
  let dropdownValores = document.getElementById("selectValorUno");
  let dropdownValoresDos = document.getElementById("selectValorDos");  
  let dropdownValoresCompra = document.getElementById("selectValorCompra");    
  // Llamada a la api
  obtenerDatosValores(function(resultValores){    
    let jsonValor = resultValores;
    let valor;
    for (valor of jsonValor){

        let opt = document.createElement('option');
        let optDos = document.createElement('option');        
        let optCompra = document.createElement('option');
        opt.value = valor.idVAlor;
        opt.innerHTML = valor.nombre;
        optDos.value = valor.idVAlor;
        optDos.innerHTML = valor.nombre;        
        optCompra.value = valor.idVAlor;
        optCompra.innerHTML = valor.nombre;        
        dropdownValores.appendChild(opt);
        dropdownValoresDos.appendChild(optDos);
        dropdownValoresCompra.appendChild(optCompra);
    }
  },objetoUrl.getValores());  
}

//************************************************/
// Si se produce algún cambio en las
// selects de valores recalculamos y pintamos.
//************************************************/
function cambiaSelect(){
  removeData(valoresChart);
  setChartValores(creaChart(document.getElementById('valoresChart')));
  cambiaValor(1);
  cambiaValor(2);
}

//************************************************/
// Evaluamos el valor y lo pintamos.
//************************************************/
function cambiaValor(paramSelect){

  let selectValor;
  let idValor;
  let idValorText;

  let selectPeriodo = document.getElementById("selectPeriodicidad");  
  let idPeriodoText = selectPeriodo.options[selectPeriodo.selectedIndex].innerText;

  if (parseInt(paramSelect) == 1){
    selectValor = document.getElementById("selectValorUno");
  }
  else{
    selectValor = document.getElementById("selectValorDos");
  }

  idValor = selectValor.options[selectValor.selectedIndex].value;        
  idValorText = selectValor.options[selectValor.selectedIndex].innerText;

  if (idValorText != "Seleccione valor" && idPeriodoText != "Seleccione periodicidad"){
    procesoRecuperaValor(idValor);
  }
}

//************************************************/
// Si hay cambios en la periodicidad, evaluamos 
// y recalculamos todo
//************************************************/
function cambiaPeriodicidad(){

  let selectPeriodo = document.getElementById("selectPeriodicidad");  
  let idPeriodoText = selectPeriodo.options[selectPeriodo.selectedIndex].innerText;

  if (idPeriodoText != "Seleccione periodicidad"){
      removeData(valoresChart);
      setChartValores(creaChart(document.getElementById('valoresChart')));
      cambiaValor(1);
      cambiaValor(2);
  }
}

//************************************************/
// Recuperamos los datos del valor en función
// de su id y de la period. (mensual, anual, etc)
//************************************************/
function procesoRecuperaValor(paramIdValor){

  let selectPeriodo = document.getElementById("selectPeriodicidad");
  let idPeriodo = parseInt(selectPeriodo.options[selectPeriodo.selectedIndex].value);  

  // Datos históricos de cotización del valor
  obtenerDatosHistChartValor(function(resultDatos,resultPeriodo){
    // Datos del valor en si.
    obtenerDatosValores(function(resultValor){    
      let jsonValor = resultValor;
      
      addDatosValor(jsonValor, resultDatos, resultPeriodo, valoresChart);    

    },objetoUrl.getValorId(paramIdValor));  
  
  },objetoUrl.getValoreshistBetweenFecs(paramIdValor,fechaHasta(idPeriodo),fechaHasta(0)));
}

//************************************************/
// Actualizamos datos de MEJOR cotización
//************************************************/
function pintaDatosMax(paramDatosMax){
  let nombre;

  for (let i=0; i<5; i++){
    nombre = JSON.stringify(paramDatosMax[i].valorNombre);
    nombre = nombre.replace(/['"]+/g, '');    
    document.getElementById("tablaValores").rows[i+1].cells[1].innerText = nombre;
    document.getElementById("tablaValores").rows[i+1].cells[2].innerText = JSON.stringify(paramDatosMax[i].cotizacionUSdolarHoy);
    document.getElementById("tablaValores").rows[i+1].cells[3].innerText = JSON.stringify(paramDatosMax[i].diferenciaCotizacion);
  }
}

//************************************************/
// Actualizamos datos de PEOR cotización
//************************************************/
function pintaDatosMin(paramDatosMin){
  let nombre;

  for (let i=0; i<5; i++){
    nombre = JSON.stringify(paramDatosMin[i].valorNombre);
    nombre = nombre.replace(/['"]+/g, '');
    document.getElementById("tablaValores").rows[i+1].cells[4].innerText = nombre;
    document.getElementById("tablaValores").rows[i+1].cells[5].innerText = JSON.stringify(paramDatosMin[i].cotizacionUSdolarHoy);
    document.getElementById("tablaValores").rows[i+1].cells[6].innerText = JSON.stringify(paramDatosMin[i].diferenciaCotizacion);
  }
}

//************************************************/
// Añadimos y actualizamos datos al chart valores
//************************************************/
function addDatosValor(paramValor, paramData, paramPeriodo, paramChart){

  paramChart.data.labels=paramPeriodo;

  paramChart.data.datasets.push({      
      label: paramValor.nombre,
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: colorDivisa(paramValor.divisa.codDivisa),
      borderWidth: 4,
      pointBackgroundColor: '#007bff',
      data: paramData
    });

    paramChart.update();
}

//************************************************/
// Añadimos y actualizamos datos al chart divisas
//************************************************/
function addDatosDivisa(paramLabel, paramData, paramChart){

    // Calculamos una semana hacia atrás.    
    paramChart.data.labels=fechasSemanaAtras();

    obtenerNombreDivisa(function(nombreDiv){    

      paramChart.data.datasets.push({      
        label: nombreDiv,
        lineTension: 0,
        backgroundColor: 'transparent',
        borderColor: colorDivisa(paramLabel),
        borderWidth: 4,
        pointBackgroundColor: '#007bff',
        data: paramData
      });
  
      paramChart.update();
    },paramLabel);
}

//************************************************/
// Limpiamos y destruimos el chart de valores
//************************************************/
function removeData(paramChart) {
    paramChart.clear();
    paramChart.destroy();    
}

//************************************************/
// Llamada a la API para mejores/peores valores
//************************************************/
function obtenerDatosMaxMin(callback, parUrl){
  let xhr = new XMLHttpRequest();
  let urlMaxMin = parUrl;  
  xhr.open("GET", urlMaxMin, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200){
          let jsonDivisa = JSON.parse(xhr.responseText);          
          return callback (jsonDivisa);        
      }
  }
  xhr.send(); 
}

//************************************************/
// Llamada a la API para obtener nombre divisa
//************************************************/
function obtenerNombreDivisa(callback, parDivisaNombre){
  let xhr3 = new XMLHttpRequest();
  let url = objetoUrl.getDivisaId(parDivisaNombre);
  xhr3.open("GET", url, true);
  xhr3.setRequestHeader("Content-type","application/json");
  xhr3.onreadystatechange = function () {
      
      if (xhr3.readyState == 4 && xhr3.status == 200){

          let jsonDivisa = JSON.parse(xhr3.responseText);
          return callback (jsonDivisa.nombre);        
      }
  }
  xhr3.send(); 
}

//************************************************/
// Llamada a la API para obtener valor por id
//************************************************/
function obtenerValor(callback, parIdValor){
  let xhr6 = new XMLHttpRequest();
  let url = objetoUrl.getValorId(parIdValor);  
  xhr6.open("GET", url, true);
  xhr6.setRequestHeader("Content-type","application/json");
  xhr6.onreadystatechange = function () {
      
      if (xhr6.readyState == 4 && xhr6.status == 200){

          let jsonValor = JSON.parse(xhr6.responseText);
          return callback (jsonValor);        
      }
  }
  xhr6.send();
}

//************************************************/
// Llamada a la API para el chart de divisas
//************************************************/
function obtenerDatosChartDivisa(callback, parUrl){
  let xhr2 = new XMLHttpRequest();
  let url = parUrl;  
  xhr2.open("GET", url, true);
  xhr2.setRequestHeader("Content-type","application/json");
  xhr2.onreadystatechange = function () {
      
      if (xhr2.readyState == 4 && xhr2.status == 200){

          let jsonDivisa = JSON.parse(xhr2.responseText);
          let divisa;
          let array_divisa = new Array();
          for (divisa of jsonDivisa){
              array_divisa.push(divisa.cotizacionUSdolar); 
          }
          return callback (array_divisa);        
      }
  }
  xhr2.send(); 
}

//************************************************/
// Llamada a la API para el chart de valores hist.
// Devuelve los datos y la fecha de cada dato en
// sendos arrays.
//************************************************/
function obtenerDatosHistChartValor(callback, parUrl){
  let xhr = new XMLHttpRequest();
  let url = parUrl;  
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type","application/json");
  xhr.onreadystatechange = function () {
      
      if (xhr.readyState == 4 && xhr.status == 200){

          let jsonValorHist = JSON.parse(xhr.responseText);
          let valorHist;
          let fecha;
          let array_valorHist = new Array();
          let array_fechas = new Array();
          for (valorHist of jsonValorHist){
              array_valorHist.push(valorHist.cotizacionUSdolar); 
              fecha = valorHist.valorHistID.fecValor              
              array_fechas.push(fecha.substring(0,10));
          }
          return callback (array_valorHist, array_fechas);        
      }
  }
  xhr.send(); 
}

//************************************************/
// Llamada a la API para obtener valores
//************************************************/
function obtenerDatosValores(callback, parUrl){
  let xhr4 = new XMLHttpRequest();
  let url = parUrl;  
  xhr4.open("GET", url, true);
  xhr4.setRequestHeader("Content-type","application/json");
  xhr4.onreadystatechange = function () {
      
      if (xhr4.readyState == 4 && xhr4.status == 200){

          let jsonValor = JSON.parse(xhr4.responseText);
          return callback (jsonValor);        
      }
  }
  xhr4.send(); 
}

//************************************************/
// Color en función de divisa.
//************************************************/
function colorDivisa(paramDivisa) {
  // Colores
  let rojo = '#F70958';
  let azul = '#098BF7';
  let azulfuerte = '#172ED3';
  let amarillo = '#D7CC1C';
  let negro = '#000000';
  let verde = '#3CFF33';
  let morado = '#B233FF';
  
  let color = "";

  switch (paramDivisa) {
    case "eur":
        color=azul;
        break;
    case "usdo":
        color=rojo;
        break;    
    case "libr":
        color=azulfuerte;
        break;    
    case "yen":
        color=amarillo;
        break;    
    case "bado":
        color=morado;
        break;    
    case "neru":
        color=negro;
        break;    
    case "rubl":
        color=azulfuerte;
        break;    
    case "sufr":
        color=verde;
        break;    
    case "suco":
        color=amarillo;
        break;    
    default:
        color=negro;        
        break;
  }
  return color;
}

//************************************************/
// Devuelve la fecha "hasta" en función de la 
// periodicidad seleccionada.
// Devuelve la fecha de hoy por defecto
//************************************************/

function fechaHasta(paramPeriodicidad){

  let dateHoy = new Date();
  let fechaCalculada = new Date();

  // Trampa
  fechaCalculada.setDate(fechaCalculada.getDate() + 1);
  //dateHoy.setDate(dateHoy.getDate() + 1);
  dateHoy.setDate(dateHoy.getDate());
  // Trampa  

  let fechaHoy = dateHoy;

  switch (paramPeriodicidad) {
      // 1 día
      case 1:
          fechaCalculada.setDate(fechaCalculada.getDate() - 2);
          break;  
      // 5 días
      case 2:
          fechaCalculada.setDate(fechaCalculada.getDate() - 5);
          break;    
      // 1 semana
      case 3:
          fechaCalculada.setDate(fechaCalculada.getDate() - 7);
          break;
      // Mensual
      case 4:
          fechaCalculada.setMonth(fechaCalculada.getMonth() - 1);
          break;
      // Semestral
      case 5:
          fechaCalculada.setMonth(fechaCalculada.getMonth() - 6);
          break;
      // Anual
      case 6:
          fechaCalculada.setMonth(fechaCalculada.getMonth() - 12);
          break;
      // Hoy
      default:
          fechaCalculada = fechaHoy
          break;
    }
    return fechaddMMyyyy(fechaCalculada);
}    

//************************************************/
// Cambia el formato fecha a ddMMyyyy
//************************************************/
function fechaddMMyyyy(paramDate){

  let dia = (paramDate.getDate() > 9 ? paramDate.getDate() : "0"+paramDate.getDate()).toString();
  let mes = ((paramDate.getMonth()+1) > 9 ? (paramDate.getMonth()+1) : "0"+(paramDate.getMonth()+1)).toString();
  let ann = paramDate.getFullYear().toString();

  return (dia + mes + ann);
}

//************************************************/
// Fechas de una semana hacia atrás partiendo de hoy
//************************************************/
function fechasSemanaAtras(){

  let dateHoy = new Date();
  let dias = 7;
  let arrayFechas = new Array();

  while (dias > 0) {

    let dia = (dateHoy.getDate() > 9 ? dateHoy.getDate() : "0"+dateHoy.getDate()).toString();
    let mes = ((dateHoy.getMonth()+1) > 9 ? (dateHoy.getMonth()+1) : "0"+(dateHoy.getMonth()+1)).toString();
    let ann = dateHoy.getFullYear().toString();

    arrayFechas.push(dia+"-"+mes+"-"+ann);
    dias--;
    dateHoy.setDate(dateHoy.getDate() - 1);
  }
  return arrayFechas.reverse();
}

//************************************************/
// Creamos un chart genérico de lineas
//************************************************/
function creaChart(paramCtx){

  //let ctxValores = document.getElementById('valoresChart')
  let ctxValores = paramCtx;  
  let valoresChart = new Chart(ctxValores, {
    type: 'line',
    data: {      
     },
    options: {    
      scales: {
        yAxes: [{
          ticks: {
            min: 0,
            max: 3,
            stepSize: 0.2,
            display: true,
            beginAtZero: true,            
          }
        }]
      },
      legend: {
        display: true
      }
    }
  })

  return valoresChart;
}

//************************************************/
// Hacemos que el chart de valores sea global
//************************************************/
function setChartValores(paramValoresChart){

  valoresChart = paramValoresChart;
}

//************************************************/
// Hacemos que el chart de valores sea global
//************************************************/
function setChartCompraValores(paramCompraValoresChart){

  compraValoresChart = paramCompraValoresChart;
}
