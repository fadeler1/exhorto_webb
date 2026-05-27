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

   
    <link href="assets/css/bootstrap.css" rel="stylesheet">
    <!--external css-->
    <link href="assets/font-awesome/css/font-awesome.css" rel="stylesheet" />
<link href="assets/css/bootstrap-datetimepicker.min.css" rel="stylesheet" />


    <link rel="stylesheet" type="text/css" media="screen"
     href="http://tarruda.github.com/bootstrap-datetimepicker/assets/css/bootstrap-datetimepicker.min.css">
        
    <!-- Custom styles for this template -->
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/style-responsive.css" rel="stylesheet">
    <script type="text/javascript" src="assets/js/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="assets/js/bootstrap-datetimepicker.min.js"></script>
  
  <script src="assets/js/jquery.maskMoney.js" type="text/javascript"></script>
 
    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

	 <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
	 
	  <script src="assets/js/validarRut.js" type="text/javascript"></script>
	  
    <script type="text/javascript">
     $(document).ready(function(){
		$( "#buscar" ).click(function() {
   
		  var apellido_deudor = $("#apellido").val().toUpperCase();
		  var nombreCliente = $("#nombreCliente").val().toUpperCase();
		 
		  var tribunalOrigen = $("#tribunalOrigen").val().toUpperCase();
		  var rolJuicio = $("#rolJuicio").val().toUpperCase();
		  var ciudad = $("#ciudad").val().toUpperCase();
		  var falcultades = $("#falcultades").val().toUpperCase();
		  var abogado = $("#abogado").val().toUpperCase();
		  var fechadesde = $("#fechapicker").val();
      var fechahasta = $("#fechapicker2").val();
      var estadoterminado =  $("#terminado").val();
      var estadovigente = $("#vigente").val();
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
		
		$('#rut').focusout(function() {
			Rut($("#rut").val());
		});

      


		
	}); //fin document
	    function exportar(){
        var apellido_deudor = $("#apellido").val().toUpperCase();
        var nombreCliente = $("#nombreCliente").val().toUpperCase();
        var rut = $("#rut").val();
        var tribunalOrigen = $("#tribunalOrigen").val().toUpperCase();
        var rolJuicio = $("#rolJuicio").val().toUpperCase();
        var ciudad = $("#ciudad").val().toUpperCase();
        var falcultades = $("#falcultades").val().toUpperCase();
        var abogado = $("#abogado").val().toUpperCase();
         var fechadesde = $("#fechapicker").val();
      var fechahasta = $("#fechapicker2").val();
      var estadoterminado =  $("#terminado").val();
      var estadovigente = $("#vigente").val();
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

         location.href="reporteexcel.php?apellidodeudor="+apellido_deudor+"&nombrecliente="+nombreCliente+"&rut_cliente="+rut+"&tribunalorigen="+tribunalOrigen+"&roljuicio="+rolJuicio+"&ciudadexhorto="+ciudad+"&falcultadesexhor="+falcultades+"&abogadoexhor="+abogado+"&FECH_DESDE="+fechadesde+"&FECH_HASTA="+fechahasta+"&ESTADO="+accion;

        
        /*$("#resultadobusqueda").load("reporteexcel.php", 
          {apellidodeudor: apellido_deudor, nombrecliente: nombreCliente, rut_cliente: rut, tribunalorigen: tribunalOrigen, roljuicio: rolJuicio, ciudadexhorto:ciudad, falcultadesexhor: falcultades, abogadoexhor: abogado}, function(){
        
        });*/
      }

	    function invocarPagina(idexhorto){
        location.href="IngresarDiligencia.php?id="+idexhorto;
      }

      function ingresarRenvolso(idexhorto){
        $("#correcto").text("");
          $("#insertarDevolucion").text(idexhorto); 
          $('#insertarDevolucion').hide();  
          $("#tipo").text(2);
          $('#myModalLabel').text("DEVOLUCIÓN");  
          $("#tipo").hide();
       
      }

      function ingresarHonorarios(idexhorto){
        $("#correcto").text("");
        $("#insertarBoletahonorarios").text(idexhorto);
        $("#tipo").text(1);
        $('#insertarBoletahonorarios').hide();
        $('#myModalLabel').text("BOLETA HONORARIOS");    
        $("#tipo").hide();

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
    <div id="tipo" style="display:block;"></div>
    <div id="insertarBoletahonorarios" style="display:block;"></div>
    <div id="insertarDevolucion" style="display:block;"></div>
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
                <!--  notification start -->
                <ul class="nav top-menu">
                   <span><b>Usuario : <?php echo $_SESSION['usuario']; ?></b></span>
                    <!-- settings start -->
                    <!--  <li class="dropdown">
                        <a data-toggle="dropdown" class="dropdown-toggle" href="index2.html#">
                            <i class="fa fa-tasks"></i>
                            <span class="badge bg-theme">4</span>
                        </a>
                        <ul class="dropdown-menu extended tasks-bar">
                            <div class="notify-arrow notify-arrow-green"></div>
                            <li>
                                <p class="green">You have 4 pending tasks</p>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <div class="task-info">
                                        <div class="desc">DashGum Admin Panel</div>
                                        <div class="percent">40%</div>
                                    </div>
                                    <div class="progress progress-striped">
                                        <div class="progress-bar progress-bar-success" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: 40%">
                                            <span class="sr-only">40% Complete (success)</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <div class="task-info">
                                        <div class="desc">Database Update</div>
                                        <div class="percent">60%</div>
                                    </div>
                                    <div class="progress progress-striped">
                                        <div class="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%">
                                            <span class="sr-only">60% Complete (warning)</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <div class="task-info">
                                        <div class="desc">Product Development</div>
                                        <div class="percent">80%</div>
                                    </div>
                                    <div class="progress progress-striped">
                                        <div class="progress-bar progress-bar-info" role="progressbar" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style="width: 80%">
                                            <span class="sr-only">80% Complete</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <div class="task-info">
                                        <div class="desc">Payments Sent</div>
                                        <div class="percent">70%</div>
                                    </div>
                                    <div class="progress progress-striped">
                                        <div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100" style="width: 70%">
                                            <span class="sr-only">70% Complete (Important)</span>
                                        </div>
                                    </div>
                                </a>
                            </li>
                            <li class="external">
                                <a href="#">See All Tasks</a>
                            </li>
                        </ul>
                    </li>-->
                    <!-- settings end -->
                    <!-- inbox dropdown start-->
                   <!-- <li id="header_inbox_bar" class="dropdown">
                        <a data-toggle="dropdown" class="dropdown-toggle" href="index.html#">
                            <i class="fa fa-envelope-o"></i>
                            <span class="badge bg-theme">5</span>
                        </a>
                        <ul class="dropdown-menu extended inbox">
                            <div class="notify-arrow notify-arrow-green"></div>
                            <li>
                                <p class="green">You have 5 new messages</p>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <span class="photo"><img alt="avatar" src="assets/img/ui-zac.jpg"></span>
                                    <span class="subject">
                                    <span class="from">Zac Snider</span>
                                    <span class="time">Just now</span>
                                    </span>
                                    <span class="message">
                                        Hi mate, how is everything?
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <span class="photo"><img alt="avatar" src="assets/img/ui-divya.jpg"></span>
                                    <span class="subject">
                                    <span class="from">Divya Manian</span>
                                    <span class="time">40 mins.</span>
                                    </span>
                                    <span class="message">
                                     Hi, I need your help with this.
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <span class="photo"><img alt="avatar" src="assets/img/ui-danro.jpg"></span>
                                    <span class="subject">
                                    <span class="from">Dan Rogers</span>
                                    <span class="time">2 hrs.</span>
                                    </span>
                                    <span class="message">
                                        Love your new Dashboard.
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">
                                    <span class="photo"><img alt="avatar" src="assets/img/ui-sherman.jpg"></span>
                                    <span class="subject">
                                    <span class="from">Dj Sherman</span>
                                    <span class="time">4 hrs.</span>
                                    </span>
                                    <span class="message">
                                        Please, answer asap.
                                    </span>
                                </a>
                            </li>
                            <li>
                                <a href="index.html#">See all messages</a>
                            </li>
                        </ul>
                    </li>-->
                    <!-- inbox dropdown end -->
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
                      <a href="javascript:;" >
                          <i class="fa fa-desktop"></i>
                          <span><b>EXHORTO</b></span>
                      </a>
                      <ul class="sub">
                           <li><a  href="IngresarExhorto.php"><b>INGRESAR EXHORTO</b></a></li>
						 
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
                  <?php } ?>
				  
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
          	<h3><i class="fa fa-angle-right"></i>Exhorto ingresados</h3>
          	<div class="row mt">
          		<div class="col-lg-12">
                  <div id="correcto"> </div>
                  <div class="form-panel">
                      <h4><i class="fa fa-angle-right"></i> EXHORTOS</h4> 
              
              <div style="padding-right: 23px;">

                     <div class="row">
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
                  <div class="col-xs-3" >
                    <br>
                 <button id="buscar" type="button" class="btn btn-success">BUSCAR</button>
                  </div>
                  
                 
                
                </div>

                <div class="row">
                  <div class="col-xs-3">
                    desde
                  <div id="datetimepicker" class="input-append date">
                      <input id="fechapicker" type="text"></input>
                      <span class="add-on glyphicon glyphicon-calendar">
                   
                        <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
                      </span>
                    </div>
                  </div>
                   <div class="col-xs-3">
                    hasta
                  <div id="datetimepicker2" class="input-append date">
                      <input id="fechapicker2" type="text"></input>
                      <span class="add-on glyphicon glyphicon-calendar">
                   
                        <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
                      </span>
                    </div>
                    </div> 

                      <div class="col-xs-3">
                       <br>
                          <span class="check"><input id="terminado" class="checked" type="checkbox"></span>
                                            <a href="#">TERMINADO </a>
                           <span class="check"><input id="vigente" class="checked" type="checkbox"></span>
                                            <a href="#">VIGENTE</a>  
                    </div> 


                
                </div>

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
      $('#datetimepicker').datetimepicker({
        format: 'dd/MM/yyyy',
        language: 'es-BR'
      });

      $('#datetimepicker2').datetimepicker({
        format: 'dd/MM/yyyy',
        language: 'es-BR'
      });

    </script>


                 
                 
<br>  

            <div id="resultadobusqueda" class="from-panel">
           
                      
                      </div><!-- /content-panel -->
                  
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
                      <input id="fechapickerboleta" type="text"></input>
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

    $(document).ready(function(){
      $('#elementID').focusout(function(){
          
          $('#elementID').val(commaSeparateNumber($(this).val()));
      });

      $( "#guardarBoletaHonorario" ).click(function() {
            var tipo = $("#tipo").text();
            if(tipo == 1){
              var id = $("#insertarBoletahonorarios").text();
            }else{
              var id = $("#insertarDevolucion").text();
            }
           var fecha = $("#fechapickerboleta").val();
           var documento = $("#numeroBoletahono").val();
           var monto = replaceAll($("#elementID").val() , "." , "");
           var tipo = $("#tipo").text();
           var involucrado = $("#involucrado").val().toUpperCase();
     
        $("#correcto").load("insertarBoletaHonorario.php", 
            {ID_EXHORTO: id, DOCUMENTO:documento ,MONTO: monto, TIPO: tipo, QUIEN:involucrado, FECHA:fecha  }, function(){
              
              $("#buscar").click();
              $("#cancelar").click();

              $("#numeroBoletahono").val("");
              $("#elementID").val("");
              $("#involucrado").val("");
          });//fin correcto


       });


        
    });
//# sourceURL=xemocufumo.js
</script>
    </script>

    
              </div>
              </div>
                          </div>
           </form>
                  </div>
                
                  <div class="modal-footer">
                    <button id="cancelar" type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    <button type="button" id="guardarBoletaHonorario" data-dismiss="modal" class="btn btn-primary" >Guardar Boleta</button>
                  </div>
                </div>
              </div>
            </div>
            </div> <!-- fin div honorarios-->


          		</div><!-- fin from-panel -->
          	</div>		
			
	
			        <!-- fin row-->


						  
						  <br>
						 
						
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