<?php  
session_start();

$perfil = $_SESSION["perfil"];
//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  

$id = $_GET["id"];

$querybuscador = "SELECT `ID`, `APELLIDO_DEUDOR`, `NOMBRE_CLIENTE`, `RUT`, `TRIBUNAL_ORIGEN`, `ROL_JUICIO`, `CIUDAD`, `FACULTADES`, `ABOGADO`, `USUARIO`, `ESTADO` FROM EXHORTO WHERE ID = ".$id.";";

$ID = "";
$APELLIDO_DEUDOR 	= ""; 
$NOMBRE_CLIENTE		= "";
$RUT				= "";
$TRIBUNAL_ORIGEN	= "";
$ROL_JUICIO			= "";
$CIUDAD				= "";	
$FACULTADES			= "";
$ABOGADO			= "";
$USUARIO			= "";
$ESTADO				= "";

$result = mysql_query($querybuscador, $link);  

while ($row = mysql_fetch_row($result)){ 
$ID 				= $row[0]; 
$APELLIDO_DEUDOR 	= $row[1]; 
$NOMBRE_CLIENTE		= $row[2];
$RUT				= $row[3];
$TRIBUNAL_ORIGEN	= $row[4];
$ROL_JUICIO			= $row[5];
$CIUDAD				= $row[6];	
$FACULTADES			= $row[7];
$ABOGADO			= $row[8];
$USUARIO			= $row[9];
$ESTADO				= $row[10];
}

if($_SESSION["usuario"] != ""){

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
 
    
<script>
var iddiligenciaclik="";
$(document).ready(function () {
  $( "#agregar" ).click(function() {
     
      var idexhorto   = $('#exhorto').attr("valorexhorto");
      var diligencia  = $("#diligenciaSeleccion").val().trim();
      var fecha       = $("#fechapicker").val();
      var observacion = $('#observacion').val();

      if(diligencia.length != 0 && fecha.length != 0){
          $("#correcto").load("insertarDiligencia.php", 
        {ID_EXHORTO: idexhorto, DILIGENCIA: diligencia.trim(), FECHA: fecha, OBSERVACIONES: observacion}, function(){
           
           location.href="IngresarDiligencia.php?id="+idexhorto;

            });//fin correcto

            
      }//fin if
    }); // fin agregar


$( "#guardarBoletaReceptor" ).click(function() {
      
     var idexhorto   = $('#exhorto').attr("valorexhorto");
     var documento    = $("#numeroBoleta").val(); 
     var receptor       = $("#receptor").val(); 
     var montoReceptor  = $("#montoReceptor").val();
     var insertarDiligenciareceptor = $("#diligenciaReceptor").val().trim();
     var insertarBoletarecep = $('#insertarBoletarecep').text();

    $('#idBoletaRecep').hide();
        $('#insertarBoletarecep').hide();
    if(insertarBoletarecep == "agregar"){
      $("#correcto").load("insertarBoletaReceptor.php", 
            {ID_EXHORTO: idexhorto, RECEPTOR:receptor ,  DOCUMENTO: documento, monto: montoReceptor, DILIGENCIA_RECEP:insertarDiligenciareceptor}, function(){
               
               location.href="IngresarDiligencia.php?id="+idexhorto;

                     var documento    = $("#numeroBoleta").val(""); 
                     var receptor       = $("#receptor").val(""); 
                     var montoReceptor  = $("#montoReceptor").val("");
            });//fin correcto

    }else{
      var idreceptor = $('#idBoletaRecep').text();

      $("#correcto").load("modificarBoletaReceptor.php", 
            {ID_BOLETA: idreceptor, RECEPTOR:receptor ,  DOCUMENTO: documento, monto: montoReceptor, DILIGENCIA_RECEP:insertarDiligenciareceptor}, function(){
               
                    location.href="IngresarDiligencia.php?id="+idexhorto;

                     var documento    = $("#numeroBoleta").val(""); 
                     var receptor       = $("#receptor").val(""); 
                     var montoReceptor  = $("#montoReceptor").val("");
            });//fin correcto


      /*

      ID_BOLETA*/
    }

      
                         
   }); // fin guardarBoletaReceptor

$( "#cancelar" ).click(function() {
      $('#cancelar').hide();
        $('#modificar').hide();
        $('#agregar').show();

          $("#diligenciaSeleccion").val(0);
                $("#fechapicker").val("");
                $('#observacion').val("");

   }); // fin cancelar

$( "#modificar" ).click(function() {

  
      var diligencia = $("#diligenciaSeleccion").val().toUpperCase();
      var fecha = $("#fechapicker").val();
      var observacion = $('#observacion').val();


    $("#correcto").load("modificarDiligencia.php", 
            {ID_DILIGENCIA: iddiligenciaclik, DILIGENCIA:diligencia ,FECHA: fecha, OBSERVACIONES: observacion }, function(){
              
              var idexhorto = $('#exhorto').attr("valorexhorto");

               location.href="IngresarDiligencia.php?id="+idexhorto;
          });//fin correcto


   }); // fin modificar


  $("#todo td").click(function() {        // function_tr
  
      iddiligenciaclik = $(this).attr("IdDiligencia");

      $("#diligenciaSeleccion").val($(this).attr("combo").trim());
      $("#fechapicker").val($(this).attr("fecha"));
      $('#observacion').val($(this).attr("obs"));

        $('#cancelar').show();
        $('#modificar').show();
        $('#agregar').hide();
      
    });


  $("#todoreceptor a").click(function() {        // function_tr
  
      iddiligenciaclik = $(this).attr("IdDiligencia");

      $("#numeroBoleta").val($(this).attr("documento").trim());
      $("#receptor").val($(this).attr("receptor"));
      $('#montoReceptor').val($(this).attr("monto"));
      $("#insertarBoletarecep").text("modificar");
      $("#idBoletaRecep").text($(this).attr("idboletarecepto").trim());
      $("#diligenciaReceptor").val($(this).attr("diligencia")); 

       $('#idBoletaRecep').hide();
        $('#insertarBoletarecep').hide();

     
    });

  
   $("#agregarBoletaLink").click(function() {        // function_tr
  
      iddiligenciaclik = $(this).attr("IdDiligencia");

      $("#numeroBoleta").val($(this).attr(""));
      $("#receptor").val($(this).attr(""));
      $('#montoReceptor').val($(this).attr(""));


      $("#insertarBoletarecep").text("agregar");
     $('#insertarBoletarecep').hide();
    });

  });// fin document

function actualizarDiligencia(){
  var idexhorto = $('#exhorto').attr("valorexhorto");

  $("#diligenciasingresadas").load("pintarDiligencias.php", 
            {ID_EXHORTO: idexhorto}, function(){
              
                $("#diligenciaSeleccion").val(0);
                $("#fechapicker").val("");
                $('#observacion').val("");

location.href="IngresarDiligencia.php?id="+idexhorto;
                });//fin diligencia
         

}

function eliminar(id ,receptor, docum, monto, diligencia){

    var idexhorto = $('#exhorto').attr("valorexhorto");
    if(confirm("¿Quieres Eliminar la boleta la boleta "+docum+" del receptor: "+receptor+" a la diligencia "+diligencia+"?" )) {

       $("#correcto").load("eliminarBoletaReceptor.php", 
            {ID_BOLETA_RECEPTOR: id}, function(){
              
              
                location.href="IngresarDiligencia.php?id="+idexhorto;
                
                });//fin diligencia

    }

 
}

function eliminarDiligencia(id , diligencia ){
    var idexhorto = $('#exhorto').attr("valorexhorto");
     if(confirm("¿Quieres Eliminar la boleta la diligencia "+diligencia+"?" )) {

       $("#correcto").load("eliminarDiligencia.php", 
            {ID_DILIGENCIA: id, ID_EXHORTO_INGRESADO:idexhorto}, function(){
              
              
                location.href="IngresarDiligencia.php?id="+idexhorto;
                
                });//fin diligencia

    }else{
      $("#cancelar").click();
    }




}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

</script>

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>
    <div id="exhorto" style="display:block;" valorexhorto="<?php echo $id; ?>"></div>
    <div id="insertarBoletarecep" style="display:block;"></div>
    <div id="idBoletaRecep" style="display:block;"></div>
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
              	  <h5 class="centered">Tramitación Exhortos A & G Asociados</h5>
              	  	
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
                           <li class="active" ><a  href="IngresarExhorto.php"><b>INGRESAR EXHORTO</b></a></li>
						 
                      </ul>
                  </li>

                  <?php if($perfil == "TODO") { ?>
                  <li class="sub-menu">
                      <a  href="javascript:;" >
                          <i class="fa fa-book"></i>
                          <span>HONORARIOS</span>
                      </a>
                      <ul class="sub">
                           <li ><a  href="honorarios.php"><b>REVISAR HONORARIOS</b></a></li>
             
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
                  <?php  } ?>
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
          	<h3><i class="fa fa-angle-right"></i>Ingreso de diligencia</h3>
          	<div class="row mt">
              <div id="correcto"> </div>
          		<div class="col-lg-12">
          		
				<div class="form-panel">
                  	<h4 class="mb"><i class="fa fa-angle-right"></i> Ingresar diligencia</h4>
                    <div class="row">

                      
					  <div class="col-xs-3">
						APELLIDO
						<input type="text" value="<?php echo $APELLIDO_DEUDOR;?>" class="form-control" disabled value="">
					  </div>
					  <div class="col-xs-3">
						NOMBRE

						<input type="text" value="<?php echo $NOMBRE_CLIENTE;?>" class="form-control" disabled>
					  </div>
					  <div class="col-xs-3">
					  
						TRIBUNAL

						<input type="text" value="<?php echo $TRIBUNAL_ORIGEN;?>" class="form-control" disabled>
					  </div>
					</div>
					 <div class="row">
					 <div class="col-xs-3">
						CIUDAD

						<input type="text" value="<?php echo $CIUDAD;?>" class="form-control" disabled>
					  </div>
					  <div class="col-xs-3">
						ROL
																		

						<input type="text" value="<?php echo $ROL_JUICIO;?>" class="form-control" disabled>
					  </div>
					  <div class="col-xs-3">
					  <br>	
						<a href="#" id="agregarBoletaLink" data-toggle="modal" data-target="#myModal" ><img src="assets/img/iconoestadodecuentas.png" width="20" height="20">&nbsp;Ingresar boleta receptor</a>
						<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
						  <div class="modal-dialog">
						    <div class="modal-content">
						      <div class="modal-header">
						        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						        <h4 class="modal-title" id="myModalLabel">BOLETA RECEPTOR</h4>
						      </div>
						      <div class="modal-body">
						       <form class="form-horizontal style-form" method="get">
                          <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">NÚMERO BOLETA</label>
                              <div class="col-sm-10">
                                  <input id="numeroBoleta" type="text" class="form-control">
                              </div>
                          </div>
						  <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">RECEPTOR</label>
                              <div class="col-sm-10">
                                  <input id="receptor" type="text" class="form-control">
                              </div>
                          </div>

                           <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">OBSERVACIONES</label>
                              <div class="col-sm-10">
                                <textarea id="diligenciaReceptor" name="observacion" class="form-control" rows="5" id="comment"></textarea>
                                </div>
                          </div>

                          

						  <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">MONTO</label><BR>
							  <div class="col-sm-10">
                             <div class="input-group"> 
								<span class="input-group-addon">$</span>
								<input id="montoReceptor" type="text"  class="form-control" id="elementID" />
								
								
		<script type="text/javascript">
	function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+'.'+'$2');
    }
    return val;
  }
$('#elementID').focusout(function(){
  
  $('#elementID').val(commaSeparateNumber($(this).val()));
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
						        <button type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
						        <button type="button" id="guardarBoletaReceptor" class="btn btn-primary" >Guardar Boleta</button>
						      </div>
						    </div>
						  </div>
						</div>
					  </div>
					  
					 </div><!-- fin row-->




					 <div class="row">
					 <div class="col-md-6">
						DILIGENCIA 
						

						<select id="diligenciaSeleccion" class="form-control input-lg"> 
							<option value="0">SELECCION DILIGENCIAS</option> 
							<option value="0.-ESTAMPADOS EN SISTEMA">0.-ESTAMPADOS EN SISTEMA</option>
							<option value="1.-ENCARGA EXHORTO CLIENTE">1.-a ENCARGA EXHORTO CLIENTE</option>
							<option value="2.-INGRESO - ROL">2.-INGRESO - ROL</option>
							<option value="3.-CUMPLASE">3.-CUMPLASE</option>
							<option value="4.-ENCARGO EXHORTO RECEPTOR">4.-ENCARGO EXHORTO RECEPTOR</option>
							<option value="5.-REITERA ENCARGO RECEPTOR">5.-REITERA ENCARGO RECEPTOR</option>
							<option value="6.-EXHORTO EN PODER DEL RECEPTOR">6.-EXHORTO EN PODER DEL RECEPTOR</option>
							<option value="7.-SE INSISTE AL RECEPTOR APURAR GESTION">7.-SE INSISTE AL RECEPTOR APURAR GESTION</option>
							<option value="8.-BUSQUEDA NEGATIVA">8.-BUSQUEDA NEGATIVA</option>
							<option value="9.-SOLICITA NUEVO DOMICILIO CLIENTE">9.-SOLICITA NUEVO DOMICILIO CLIENTE</option>
							<option value="10.-SEÑALA NUEVO DOMICILIO">10.-SEÑALA NUEVO DOMICILIO</option>
							<option value="11.-BUSQUEDA POSITIVA">11.-BUSQUEDA POSITIVA</option>
							<option value="12.-SOLICITA NOTIFICACION ART. 44">12.-SOLICITA NOTIFICACION ART. 44</option>
							<option value="13.-PENDIENTE RESOLUCION ESCRITO">13.-PENDIENTE RESOLUCION ESCRITO</option>
							<option value="14.-NOTIFICACION POR CEDULA">14.-NOTIFICACION POR CEDULA</option>
							<option value="15.-NOTIFICACION PERSONAL">15.-NOTIFICACION PERSONAL</option>
							<option value="16.-NOTIFICACION ART. 44">16.-NOTIFICACION ART. 44</option>
							<option value="17.-REQUERIMIENTO DE PAGO">17.-REQUERIMIENTO DE PAGO</option>
							<option value="18.-OPOSICION AL EMBARGO">18.-OPOSICION AL EMBARGO</option>
							<option value="19.-EMBARGO DE VEHICULO">19.-EMBARGO DE VEHICULO</option>
							<option value="20.-SOLICITA FUERZA PUBLICA PARA EMBARGO">20.-SOLICITA FUERZA PUBLICA PARA EMBARGO</option>
							<option value="21.-EMBARGO DE BIENES MUEBLES">21.-EMBARGO DE BIENES MUEBLES</option>
							<option value="22.-EMBARGO DE INMUEBLE">22.-EMBARGO DE INMUEBLE</option>
							<option value="23.-OPOSICION AL RETIRO">23.-OPOSICION AL RETIRO</option>
							<option value="24.-SOLICITA FUERZA PUBLICA RETIRO">24.-SOLICITA FUERZA PUBLICA RETIRO</option>
							<option value="25.-EMBARGO FRUSTRADO">25.-EMBARGO FRUSTRADO</option>
							<option value="26.-RETIRO FRUSTRADO">26.-RETIRO FRUSTRADO</option>
							<option value="27.-SOLICITA AMPLIACION DE PLAZO">27.-SOLICITA AMPLIACION DE PLAZO</option>
							<option value="28.-AMPLIACION DE PLAZO POR">28.-AMPLIACION DE PLAZO POR</option>
							<option value="29.-SOLICITA AUTORIZACION GASTO DISTANCIA">29.-SOLICITA AUTORIZACION GASTO DISTANCIA</option>
							<option value="30.-SUSPENSIÓN DE EXHORTO">30.-SUSPENSIÓN DE EXHORTO</option>
							<option value="31.-SOLICITA DEVOLUCION DE EXHORTO">31.-SOLICITA DEVOLUCION DE EXHORTO</option>
							<option value="32.-FALTA DEVOLUCION DE EXHORTO">32.-FALTA DEVOLUCION DE EXHORTO</option>
							<option value="33.-DEVOLUCION DE EXHORTO TRIBUNAL ORIGEN">33.-DEVOLUCION DE EXHORTO TRIBUNAL ORIGEN</option>
							<option value="34.-DEVOLUCION EXHORTO SIN DILIGENCIA">34.-DEVOLUCION EXHORTO SIN DILIGENCIA</option>
							<option value="35.-DEVOLUCION EXHORTO CLIENTE">35.-DEVOLUCION EXHORTO CLIENTE</option>
							<option value="36.-COBRADO AL CLIENTE">36.-COBRADO AL CLIENTE</option>
						</select>
					  </div>
					  <div class="col-xs-3">FECHA
						
    <!-- Div utilizada para enquadrar input de teste no centro da tela -->
    
          <!-- Input ao qual foi designado a função para exibir o calendário, que vai ser selecionado com jquery na função abaixo. -->
          

<div id="datetimepicker" class="input-append date">
      <input id="fechapicker" type="text"></input>
      <span class="add-on glyphicon glyphicon-calendar">
	 
        <i data-time-icon="icon-time" data-date-icon="icon-calendar"></i>
      </span>
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
    </script>
					  </div>
					 </div>

    <br>
        <div class="row">
                <div class="col-xs-4">
                <label for="comment">OBSERVACIONES</label>
                <textarea id="observacion" name="observacion" class="form-control" rows="5" id="comment"></textarea>
              </div>
              <div class="col-xs-4">
                <div class="pull-left"><h5><i class="fa fa-tasks"></i> Boletas receptor</h5></div>
                          <br>
                  

                        <?php


$link = Conectarse();  


$query = "SELECT `ID`, `ID_EXHORTO`, `RECEPTOR`, `DOCUMENTO`, `MONTO` ,`DILIGENCIA`  FROM `BOLETA_RECEPTOR` WHERE `ID_EXHORTO` = $id";

  
//se envia la consulta  
$resultdeli = mysql_query($query, $link);  

  
  echo "<table id=\"todoreceptor\" class=\"table table-hover custom-check\">";
                      echo "<tbody>";

                     while ($rowde = mysql_fetch_row($resultdeli)){ 

                       echo "<tr>";
                          echo "<td>";
                                echo "<span class=\"check\"></span>";
                                echo "<a href=\"#\" data-toggle=\"modal\" data-target=\"#myModal\" idboletarecepto=\"".$rowde[0]."\" receptor=\"".$rowde[2]."\" documento=\"".$rowde[3]."\" monto=\"".$rowde[4]."\" diligencia=\"".$rowde[5]."\">".$rowde[5]." <br>doc:".$rowde[3]."</a>&nbsp;&nbsp;<span>monto:$".$rowde[4]."</span>&nbsp;&nbsp;<span>".$rowde[2]."</span>";
                                
                                echo "<button id=\"eliminar\" onclick=\"eliminar(".$rowde[0].",'".$rowde[2]."',".$rowde[3].",".$rowde[4].",'".$rowde[5]."');\"  class=\"close\"  type=\"button\">×</button>";
                                
                          echo "</td>";
                        echo "</tr>";

                      
          }   

$link = null;

?>

                     
                      </tbody>
                  </table>
              </div>
        </div>
        <br>
        <div class="row">
          <div class="col-xs-4">
            </div>
              <div class="col-xs-8">
                <button id="cancelar" style="display:none;" type="button" class="btn btn-success">CANCELAR</button>
                <button id="agregar" type="button" class="btn btn-success">AGREGAR</button>
                <button id="modificar" style="display:none;" type="button" class="btn btn-success">MODIFICAR</button>
              </div>
           </div>

 <!-- listado de diligencia disponible-->


                    <div class="panel-heading">
                          <div class="pull-left"><h5><i class="fa fa-tasks"></i> DILIGENCIAS DEL EXORTO</h5></div>
                          <br>
                    </div>
              <div id="diligenciasingresadas" class="custom-check goleft mt">
<?php


$link = Conectarse();  


$query = "SELECT `ID`, `ID_EXHORTO`, `DILIGENCIA`, `FECHA`, `OBSERVACIONES`, `USUARIO` , 
                  str_to_date(FECHA, '%d/%m/%Y') as fechaconver
        FROM DILIGENCIA WHERE `ID_EXHORTO` = $id order by fechaconver ASC";

  
//se envia la consulta  
$resultdeli = mysql_query($query, $link);  

  
  echo "<table id=\"todo\" class=\"table table-hover custom-check\">";
                      echo "<tbody>";

                     while ($rowde = mysql_fetch_row($resultdeli)){   
                        echo "<tr>";
                        echo "<td IdDiligencia=\"".$rowde[0]."\" combo=\"".$rowde[2]."\" fecha=\"".$rowde[3]."\" obs=\"".$rowde[4]."\">";
                                echo "<div ><a style=\"color: green;\"> ingresado: ".$rowde[5]."</a></div>";
                                echo "<span class=\"check\"></span>";
                                echo "<a href=\"#\"> ".$rowde[2]." </a>&nbsp;&nbsp; <b>".$rowde[3]."</b>&nbsp;&nbsp;&nbsp;&nbsp;<span>".$rowde[4]."</span>";
                                
                                echo "<button id=\"eliminar\" onclick=\"eliminarDiligencia(".$rowde[0].",'".$rowde[2]."');\"  class=\"close\"  type=\"button\">×</button>";
                      echo "</td>";
                        echo "</tr>";
                       
          }   
      



        echo "</tbody>";
    echo "</table>";  


?>
            </div><!-- /table-responsive -->
          
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