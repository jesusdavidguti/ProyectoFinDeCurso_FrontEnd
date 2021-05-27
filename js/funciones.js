
//Validación del formulario de registros de datos de la divisa
//Validará que los campos estén rellenos

(function() {
  'use strict';
  window.addEventListener('load', function() {
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
})();

//Envío de datos del formulario, método post/put.

$('#formulario').on('submit', function(e) {
  e.preventDefault();
    alert("Entra en submit");
    registrar();
});

//Función que envía los datos de la divisa desde el formulario
function registrar() {
 
      var divisa = {
          nombre:$("#inputCodDivisa").val(),
          codPais:$("#inputCodPais").val(),
          cambioUS:$("#InputCambio").val()
          
      }

      var dataJson = JSON.stringify(divisa);
    //  alert(dataJson);
      $.ajax({
          url: "https://travellog2.herokuapp.com/api/viajes",
          type: "post",
          dataType: "json",
          contentType: "application/json",
          data: dataJson
      });

  }