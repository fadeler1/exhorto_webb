<?php
session_start();
if($_SESSION["usuario"] != ""){
  $perfil = $_SESSION["perfil"];
?>
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Dashboard">
    <meta name="keyword" content="Dashboard, Bootstrap, Admin, Template, Theme, Responsive, Fluid, Retina">

    <title>Tramitación Exhortos A & G Asociados</title>

    <!-- Bootstrap core CSS -->
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <!--external css-->
    <link href="assets/font-awesome/css/font-awesome.css" rel="stylesheet" />
        
    <!-- Custom styles for this template -->
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/style-responsive.css" rel="stylesheet">

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	 <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
	 
	  <script src="assets/js/validarRut.js" type="text/javascript"></script>
	<script>
	$(document).ready(function(){
		$( "#buscar" ).click(function() {

     
		  var ciudad = $("#ciudadExhorto").val().toUpperCase();
      var abogado = $("#AbogadoHono").val().toUpperCase();
      var caratula = $("#caratula").val().toUpperCase();
      var exhorto = $("#rol").val().toUpperCase();
      var numerodocumento = $("#numerodocumento").val();
      var pendiente = "";
		  var pagada = "";
      var honorario = "";
      var devolucion = "";
      var accion = "";
      var acciontipo ="";

      if($('#pendiente').is(':checked') ){
        pendiente = "PENDIENTE";  
      }else{
        pendiente = "NO";
      }
      
       if($('#pagada').is(':checked') ){
        pagada = "PAGADA";  
      }else{
        pagada = "NO";
      }




      if($('#honorarios').is(':checked')){
          honorario = "HONORARIOS";
      }else{
        honorario = "NO";
      }

      if($('#devolucion').is(':checked')){
          devolucion = "DEVOLUCION";
      }else{
        devolucion = "NO";
      }


      if(pendiente == "NO" && pagada == "NO"){
        accion = "TODAS"
      }else{
        if(pendiente == "PENDIENTE" && pagada == "NO"){
          accion = "PENDIENTE";
        }else{
          if(pendiente == "NO" && pagada == "PAGADA"){
            accion = "PAGADA";
          }else{
            
              accion = "TODAS"
            

          }
        }
      }


      if(honorario == "NO" && devolucion == "NO"){
        acciontipo = "TODAS"
      }else{
        if(honorario == "HONORARIOS" && devolucion == "NO"){
          acciontipo = "HONORARIOS";
        }else{
          if(honorario == "NO" && devolucion == "DEVOLUCION"){
            acciontipo = "DEVOLUCION";
          }else{
            acciontipo = "TODAS"
       
          }
        }
      }

		  
		  $("#resultadobusqueda").load("BuscadorHonorario.php", 
				{CIUDAD: ciudad, ABOGADO: abogado, PENDIENTE: pendiente, PAGADA: pagada, ACCION:accion, ACCION_TIPO: acciontipo, CARATULA: caratula, EXHORTO: exhorto, NUMERODOC : numerodocumento }, function(){
			
		  });
		});
		
		$('#rut').focusout(function() {
			Rut($("#rut").val());
		});

		
	

		
	}); //fin document


function exportar(){
    
      var ciudad = $("#ciudadExhorto").val().toUpperCase();
      var abogado = $("#AbogadoHono").val().toUpperCase();
      var caratula = $("#caratula").val().toUpperCase();
      var exhorto = $("#rol").val().toUpperCase();
      var pendiente = "";
      var pagada = "";
      var honorario = "";
      var devolucion = "";
      var accion = "";
      var acciontipo ="";

      if($('#pendiente').is(':checked') ){
        pendiente = "PENDIENTE";  
      }else{
        pendiente = "NO";
      }
      
       if($('#pagada').is(':checked') ){
        pagada = "PAGADA";  
      }else{
        pagada = "NO";
      }




      if($('#honorarios').is(':checked')){
          honorario = "HONORARIOS";
      }else{
        honorario = "NO";
      }

      if($('#devolucion').is(':checked')){
          devolucion = "DEVOLUCION";
      }else{
        devolucion = "NO";
      }


      if(pendiente == "NO" && pagada == "NO"){
        accion = "TODAS"
      }else{
        if(pendiente == "PENDIENTE" && pagada == "NO"){
          accion = "PENDIENTE";
        }else{
          if(pendiente == "NO" && pagada == "PAGADA"){
            accion = "PAGADA";
          }else{
            
              accion = "TODAS"
            

          }
        }
      }


      if(honorario == "NO" && devolucion == "NO"){
        acciontipo = "TODAS"
      }else{
        if(honorario == "HONORARIOS" && devolucion == "NO"){
          acciontipo = "HONORARIOS";
        }else{
          if(honorario == "NO" && devolucion == "DEVOLUCION"){
            acciontipo = "DEVOLUCION";
          }else{
            acciontipo = "TODAS"
       
          }
        }
      }

      
     location.href="reporteexcelboleta.php?CIUDAD="+ciudad+"&ABOGADO="+abogado+"&PENDIENTE="+pendiente+"&PAGADA="+pagada+"&ACCION="+accion+"&ACCION_TIPO="+acciontipo+"&CARATULA="+caratula+"&EXHORTO="+exhorto;

     
  
}

	</script>
  </head>

  <body>
   <div id="tipo" style="display:block;"></div>
    <div id="boleta" style="display:block;"></div>
    

  <section id="container" >
      <!-- **********************************************************************************************************************************************************
      TOP BAR CONTENT & NOTIFICATIONS
      *********************************************************************************************************************************************************** -->
      <!--header start-->
      <header class="header black-bg">
              <div class="sidebar-toggle-box">
                  <div class="fa fa-bars tooltips" data-placement="right" data-original-title="Toggle Navigation"></div>
              </div>
            <!--logo start-->
            <a href="index2.php" class="logo"><b>Tramitación Exhortos A & G Asociados</b></a>
            <!--logo end-->
            <div class="nav notify-row" id="top_menu">
              <span><b>Usuario : <?php echo $_SESSION['usuario']; ?></b></span>
                <!--  notification start -->
                <ul class="nav top-menu">
                    
                </ul>
                <!--  notification end -->
            </div>
            <div class="top-menu">
            	<ul class="nav pull-right top-menu">
                    <li><a class="logout" href="logon.php">Cerrar sesión</a></li>
            	</ul>
            </div>
        </header>
      <!--header end-->
      
      <!-- **********************************************************************************************************************************************************
      MAIN SIDEBAR MENU
      *********************************************************************************************************************************************************** -->
      <!--sidebar start-->
      <aside>
          <div id="sidebar"  class="nav-collapse ">
              <!-- sidebar menu start-->
              <ul class="sidebar-menu" id="nav-accordion">
              
              	  <p class="centered"><a href="index2.php"><img src="assets/img/ui-sam.jpg" class="img-circle" width="60"></a></p>
              	  <h5 class="centered">Tramitación Exhortos <br>A & G Asociados</h5>
              	  	
                  <li class="mt">
                      <a href="index2.php">
                          <i class="fa fa-dashboard"></i>
                          <span><b>HOME</b></span>
                      </a>
                  </li>

                  <li class="sub-menu">
                      <a  href="javascript:;" >
                          <i class="fa fa-desktop"></i>
                          <span><b>EXHORTO</b></span>
                      </a>
                      <ul class="sub">
                           <li><a  href="IngresarExhorto.php"><b>INGRESAR EXHORTO</b></a></li>
						 
                      </ul>
                  </li>
                  <?php if($perfil == "TODO") { ?>
                  <li class="sub-menu">
                      <a class="active" href="javascript:;" >
                          <i class="fa fa-book"></i>
                          <span><b>HONORARIOS</b></span>
                      </a>
                      <ul class="sub">
                           <li class="active"><a  href="honorarios.php"><b>REVISAR HONORARIOS</b></a></li>
             
                      </ul>
                  </li>

                  <li class="sub-menu">
                      <a href="javascript:;" >
                          <i class="fa fa-book"></i>
                          <span><b>ADMIN USUARIOS</b></span>
                      </a>
                      <ul class="sub">
                           <li><a  href="adminUsuarios.php"><b>VER USUARIOS</b></a></li>
             
                      </ul>
                  </li>

                  <?php } ?>
				  
			           </ul>
              <!-- sidebar menu end-->
          </div>
      </aside>
      <!--sidebar end-->
      
      <!-- ********** ************************************************************************************************************************************************
      MAIN CONTENT
      *********************************************************************************************************************************************************** -->
      <!--main content start-->
      <section id="main-content">
          <section class="wrapper site-min-height">
          	<h3><i class="fa fa-angle-right"></i>Ingreso de nuevo Exorto</h3>
			
          	<div class="row mt">
			
          		<div class="col-lg-12">

          		<div class="form-panel">
                    
                    <div class="row">
			<div id="correcto" class="col-xs-12">
			</div>
            <div class="col-xs-3">
            Ciudad
            <input id="ciudadExhorto" type="text" class="form-control" >
            </div>
            <div class="col-xs-3">
            Abogado
            <input id="AbogadoHono" type="text" class="form-control" >
            </div>
            <div class="col-xs-3">
              <br>
              <span class="check"><input id="pendiente" class="checked" type="checkbox"></span>
                                <a href="#">PENDIENTE </a>
               <span class="check"><input id="pagada" class="checked" type="checkbox"></span>
                                <a href="#">PAGADA</a>
                              
            </div>
          </div>
          <div>
               <div class="row">
                   <div class="col-xs-3">
                    caratula
                    <input id="caratula" type="text" class="form-control" >
                   </div>
                   <div class="col-xs-3">
                    ROL-EXHORTO
                    <input id="rol" type="text" class="form-control" >
                   </div>
                    <div class="col-xs-3">
                    <br>
                    <span class="check"><input id="honorarios" class="checked" type="checkbox"></span>
                                      <a href="#">HONORARIOS</a>
                     <span class="check"><input id="devolucion" class="checked" type="checkbox"></span>
                                      <a href="#">DEVOLICION</a>
                                    
                  </div>
               </div>

               <div class="row">
                   <div class="col-xs-3">
                    Número documento
                    <input id="numerodocumento" type="text" class="form-control" >
                   </div>
                  
                   
               </div>
          </div>
          
          

 <div class="row">


            <div class="col-xs-3">
           
            </div>
           <div class="col-xs-3">
            
            </div>
            <div class="col-xs-3">
           </div>

         <button id="buscar" type="button" class="btn btn-success">BUSCAR</button>
            </div>
          
           <div id="resultadobusqueda" class="from-panel">
           
                      
                      </div><!-- /content-panel -->

              <!-- tabla -->
              

                    
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                     <div id="correcto"> </div>

                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="myModalLabel">BOLETA HONORARIOS</h4>
                  </div>
                  <div class="modal-body">
                   <form class="form-horizontal style-form" method="get">
                          <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">NÚMERO BOLETA</label>
                              <div class="col-sm-10">
                                  <input onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g,'')" id="numeroBoletahono" type="text" class="form-control">
                              </div>
                          </div>

                                      <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">FECHA EMISION</label>
                              <div class="col-sm-10">
                                     <div id="datetimepicker3" class="input-append date">
                      <input id="fechapickeBoleta" type="text"></input>
                      <span class="add-on glyphicon glyphicon-calendar">
                   
                        <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
                      </span>
                    </div>
                              </div>
                          </div>
             
             <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">A quien</label>
                              <div class="col-sm-10">
                                  <input  id="involucrado" type="text" class="form-control">
                              </div>
                          </div>
             
              <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">MONTO</label><BR>
                <div class="col-sm-10">
                             <div class="input-group"> 
                <span class="input-group-addon">$</span>
                <input type="text" onkeyup="if (/\D/g.test(this.value)) this.value = this.value.replace(/\D/g,'')" class="form-control" id="elementID" />
                
                               <script type="text/javascript"
     src="http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js">
    </script> 
    <script type="text/javascript"
     src="http://netdna.bootstrapcdn.com/twitter-bootstrap/2.2.2/js/bootstrap.min.js">
    </script>
    <script type="text/javascript"
     src="http://tarruda.github.com/bootstrap-datetimepicker/assets/js/bootstrap-datetimepicker.min.js">
    </script>
    <script type="text/javascript"
     src="http://tarruda.github.com/bootstrap-datetimepicker/assets/js/bootstrap-datetimepicker.pt-BR.js">
    </script>
    <script type="text/javascript">
      $('#datetimepicker3').datetimepicker({
        format: 'dd/MM/yyyy',
        language: 'es-BR'
      });

 
    </script>  
    <script type="text/javascript">
  function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+'.'+'$2');
    }
    return val;
  }

  function replaceAll( text, busca, reemplaza ){
  while (text.toString().indexOf(busca) != -1)
      text = text.toString().replace(busca,reemplaza);
  return text;
}

 function modificarHonorario(id_boleta, documento, monto, tipo, asignado, fecha){
        $("#boleta").text(id_boleta);
        $("#tipo").text(tipo);
        $("#fechapickeBoleta").val(fecha);
        $('#boleta').hide();
        $("#tipo").hide();

        $("#numeroBoletahono").val(documento);
         $("#involucrado").val(asignado);
         $("#elementID").val(monto);

        if (tipo == 1) {
           $('#myModalLabel').text("BOLETA HONORARIOS");    
         }else{
           $('#myModalLabel').text("BOLETA DEVOLUCIÓN");    
         }
       
        
  }

  function pagar(id, tipo){
    var tipoDocumento = "";
    if(tipo == 1){
      tipoDocumento = "¿Quieres realizar el pago del HONORARIOS?"
    }else{
      tipoDocumento = "¿Quieres realizar el pago de la DEVOLUCIÓN?"
    }
    if(confirm(tipoDocumento)) {


     $("#correcto").load("realizarPago.php", 
                {ID_BOLETA: id }, function(){
                  
                  $("#buscar").click();
                  $("#cancelar").click();

              });//fin correcto
        }

  }

  function eliminarDocumento(id_boleta, tipo , id_exhorto){
     var tipoDocumento = "";
    if(tipo == 1){
      tipoDocumento = "¿Quieres realizar la ELIMINACION del HONORARIOS?"
    }else{
      tipoDocumento = "¿Quieres realizar la ELIMINACION de la DEVOLUCIÓN?"
    }
    if(confirm(tipoDocumento)) {


     $("#correcto").load("eliminarDocumento.php", 
                {ID_BOLETA: id_boleta, ID_EXHORTO: id_exhorto, TIPO: tipo }, function(){
                  
                  $("#buscar").click();
                  $("#cancelar").click();

              });//fin correcto
        }

  }

    $(document).ready(function(){
      $('#elementID').focusout(function(){
          
          $('#elementID').val(commaSeparateNumber($(this).val()));
      });

      $( "#guardarBoletaHonorario" ).click(function() {

           var id = $("#boleta").text();
           var documento = $("#numeroBoletahono").val();
           var monto = replaceAll($("#elementID").val() , "." , "");
           var involucrado  = $("#involucrado").val().toUpperCase();
           var fecha        = $("#fechapickeBoleta").val();


        $("#correcto").load("modificarBoletaDevolucion.php", 
            {ID_BOLETA: id, DOCUMENTO:documento ,MONTO: monto, INVOLUCRADO: involucrado, FECHA: fecha }, function(){
              
              $("#buscar").click();
              $("#cancelar").click();
              $("#cancelar").click();

          });//fin correcto


       });

    });
//# sourceURL=xemocufumo.js
</script>
    </script>

    
    
                         
           </form>
                  </div>
                
                  <div class="modal-footer">
                    <button id="cancelar" type="button" class="btn btn-default" data-dismiss="modal">CANCELAR</button>
                    <button type="button" id="guardarBoletaHonorario" class="btn btn-primary" >MODIFICAR</button>
                  </div>
                </div>
              </div>
            </div>
            </div> <!-- fin div honorarios-->

        </div>


					
						  
          		</div>
          	</div>
			
			
			
		</section><! --/wrapper -->
		
		
      </section><!-- /MAIN CONTENT -->

      <!--main content end-->
      <!--footer start-->
      <footer class="site-footer">
          <div class="text-center">
              Copyright © 2016 - Tramitación Exhortos A & G Asociados
              <a href="index2.php#" class="go-top">
                  <i class="fa fa-angle-up"></i>
              </a>
          </div>
      </footer>
      <!--footer end-->
  </section>

    <!-- js placed at the end of the document so the pages load faster -->
    <script src="assets/js/jquery.js"></script>
    <script src="assets/js/bootstrap.min.js"></script>
    <script src="assets/js/jquery-ui-1.9.2.custom.min.js"></script>
    <script src="assets/js/jquery.ui.touch-punch.min.js"></script>
    <script class="include" type="text/javascript" src="assets/js/jquery.dcjqaccordion.2.7.js"></script>
    <script src="assets/js/jquery.scrollTo.min.js"></script>
    <script src="assets/js/jquery.nicescroll.js" type="text/javascript"></script>


    <!--common script for all pages-->
    <script src="assets/js/common-scripts.js"></script>

    <!--script for this page-->
    
  <script>
      //custom select box


  </script>

  </body>
</html>
<?php 
}else{
  echo"<script language= \"javascript\">window.location=\"index.php\"</script>;";
}
?>