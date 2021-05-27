//************************************************/
// Objeto Url para montar la cadena 
// url de conexión a la API
//************************************************/

class montaUrl{

    // Constructor
    constructor() {
        this.rutaHeroku = "https://proyectofincurso.herokuapp.com/";
        this.rutaLocal = "http://localhost:8080/";        
        this.ruta = this.rutaHeroku; 
        //console.log("this.ruta:"+this.ruta);
    }

    // Métodos SET

    setRutaLocal() {
      this.ruta = this.rutaLocal;
    }

    setRutaGlobal() {
      this.ruta = this.rutaGlobal;
    }

    // Métodos GET
    //
    // Divisas

    getDivisashistBetweenFecs (paramIdDivisa,paramFecDesde, paramFecHasta){    
        return (this.ruta+"apiDivisasHist/divisashistBetweenFecs/"+paramIdDivisa+"/"
                                                                  +paramFecDesde+"/"
                                                                  +paramFecHasta);
    }

    getDivisaId(parDivisaNombre){
        return (this.ruta+"apiDivisas/divisas/" + parDivisaNombre +"/")
    }

    // Valores 

    getValores(){
        return (this.ruta+"apiValores/valores");
    }

    getValorId(paramIdValor){
        return (this.ruta+"apiValores/valores/"+paramIdValor);
    }

    getValoreshist (paramIdValor,paramFec){    
        return (this.ruta+"apiValoresHist/valoreshist/"+paramIdValor+"/"
                                                       +paramFec);
    }

    getValoreshistBetweenFecs (paramIdValor,paramFecDesde, paramFecHasta){    
        return (this.ruta+"apiValoresHist/valoreshistBetweenFecs/"+paramIdValor+"/"
                                                                  +paramFecDesde+"/"
                                                                  +paramFecHasta);
    }

    getValoreshistTopValor(paramFecDesde, paramFecHasta){
        return (this.ruta+"apiValoresHist/valoreshistTopLowValor/2/"+paramFecDesde+"/"
                                                                    +paramFecHasta);
    }

    getValoreshistLowValor(paramFecDesde, paramFecHasta){
        return (this.ruta+"apiValoresHist/valoreshistTopLowValor/1/"+paramFecDesde+"/"
                                                                    +paramFecHasta);
    }
}
