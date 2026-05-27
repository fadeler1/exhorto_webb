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
		$( "#guardar" ).click(function() {
		  var apellido_deudor = $("#apellido").val().toUpperCase();
		  var nombreCliente = $("#nombreCliente").val().toUpperCase();
		  
		  var tribunalOrigen = $("#tribunalOrigen").val().toUpperCase();
		  var rolJuicio = $("#rolJuicio").val().toUpperCase();
		  var ciudad = $("#ciudad").val().toUpperCase();
		  var falcultades = $("#falcultades").val().toUpperCase();
		  var abogado = $("#abogado").val().toUpperCase();
		   
		  
		  $("#correcto").load("insertarExorto.php", 
				{apellidodeudor: apellido_deudor, nombrecliente: nombreCliente, tribunalorigen: tribunalOrigen, roljuicio: rolJuicio, ciudadexhorto:ciudad, falcultadesexhor: falcultades, abogadoexhor: abogado}, function(){
			
         $( "#buscar" ).click();
		  });


     $( "#buscar" ).click(function() {
   
      var apellido_deudor = $("#apellido").val().toUpperCase();
      var nombreCliente = $("#nombreCliente").val().toUpperCase();
      
      var tribunalOrigen = $("#tribunalOrigen").val().toUpperCase();
      var rolJuicio = $("#rolJuicio").val().toUpperCase();
      var ciudad = $("#ciudad").val().toUpperCase();
      var falcultades = $("#falcultades").val().toUpperCase();
      var abogado = $("#abogado").val().toUpperCase();

      var fechadesde = "";
      var fechahasta = "";
      var estadoterminado = "";
      var estadovigente = "";
      var accion =  "TODAS";


       if($('#terminado').is(':checked') ){
        estadoterminado = "TERMINADO";  
      }else{
        estadoterminado = "NO";
      }
      
       if($('#vigente').is(':checked') ){
        estadovigente = "VIGENTE";  
      }else{
        estadovigente = "NO";
      }
      

      if(estadoterminado == "NO" && estadovigente == "NO"){
        accion = "TODAS"
      }else{
        if(estadoterminado == "TERMINADO" && estadovigente == "NO"){
          accion = "TERMINADO";
        }else{
          if(estadoterminado == "NO" && estadovigente == "VIGENTE"){
            accion = "VIGENTE";
          }else{
              accion = "TODAS"
          }
        }
      }


      $("#resultadobusqueda").load("buscador.php", 
        {apellidodeudor: apellido_deudor, nombrecliente: nombreCliente, tribunalorigen: tribunalOrigen, roljuicio: rolJuicio, ciudadexhorto:ciudad, falcultadesexhor: falcultades, abogadoexhor: abogado, FECH_DESDE:fechadesde, FECH_HASTA:fechahasta, ESTADO:accion  }, function(){
      
      });
    });


		});
		
		$('#rut').focusout(function() {
			Rut($("#rut").val());
		});

		
	

		
	}); //fin document

      function invocarPagina(idexhorto){
        location.href="IngresarDiligencia.php?id="+idexhorto;
      }

      function EliminarExhorto(idexhorto, caratula){
        if(confirm("¿Quieres eliminar el exhorto "+caratula+"?" )) {

            $("#correcto").load("EliminarExhorto.php", 
                        {ID_EXHORTO: idexhorto}, function(){
                          
                          $( "#buscar" ).click();
                            
                            
                            });//fin diligencia
          }
      }

	</script>
  </head>

  <body>

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
                      <a class="active" href="javascript:;" >
                          <i class="fa fa-desktop"></i>
                          <span><b>EXHORTO</b></span>
                      </a>
                      <ul class="sub">
                           <li class="active"><a  href="IngresarExhorto.php"><b>INGRESAR EXHORTO</b></a></li>
						 
                      </ul>
                  </li>
				  <?php if($perfil == "TODO") { ?>
           <li class="sub-menu">
                      <a href="javascript:;" >
                          <i class="fa fa-book"></i>
                          <span><b>HONORARIOS</b></span>
                      </a>
                      <ul class="sub">
                           <li><a  href="honorarios.php"><b>REVISAR HONORARIOS</b></a></li>
             
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

                  <?php }?>
			           </ul>
              <!-- sidebar menu end-->
          </div>
      </aside>
      <!--sidebar end-->
      
      <!-- **********************************************************************************************************************************************************
      MAIN CONTENT
      *********************************************************************************************************************************************************** -->
      <!--main content start-->
      <section id="main-content">
          <section class="wrapper site-min-height">
          	<h3><i class="fa fa-angle-right"></i>Ingreso de nuevo Exorto</h3>
			
          	<div class="row mt">
			
          		<div class="col-lg-12">

          		<div class="form-panel">
                    <h4 class="mb"><i class="fa fa-angle-right"></i> Ingresar diligencia</h4>
                    <div class="row">
			<div id="correcto" class="col-xs-12">
			</div>
            <div class="col-xs-3">
            Apellido deudor
            <input id="apellido" type="text" class="form-control" >
            </div>
            <div class="col-xs-3">
            Nombre cliente
            <input id="nombreCliente" type="text" class="form-control" >
            </div>
           
          </div>
           <div class="row">
             <div class="col-xs-3">
              Tribunal origen
              <input  id="tribunalOrigen" type="text" class="form-control" >
              </div>
              <div class="col-xs-3">
              Rol Juicio
              <input  id="rolJuicio" type="text" class="form-control" >
              </div>
              <div class="col-xs-3">
              Ciudad
              <input  id="ciudad" type="text" class="form-control" >
              </div>
          </div>
          

          <div class="row">
          <div class="col-xs-3">
            Facultades
              <input  id="falcultades" type="text" class="form-control" >
            </div>
            <div class="col-xs-3">
            Abogado
            <input  id="abogado" type="text" class="form-control" >
            </div>
           
          
          </div>
<hr>
 <div class="row">


            <div class="col-xs-3">
           
            </div>
           <div class="col-xs-3">
            
            </div>
            <div class="col-xs-3">
           </div>

         <button id="guardar" type="button" class="btn btn-success">GUARDAR</button>
            </div>
          
          
 <div id="resultadobusqueda" class="from-panel">
           
                      
                      </div><!-- /content-panel -->


           
        </div>

<div id="buscar" />

					
						  
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