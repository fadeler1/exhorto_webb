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
		$( "#ingresarUsuario" ).click(function() {
        
        var nombre  = $("#nombre").val().toUpperCase();;
        var email   = $("#email").val();
        var perfil  = $("#perfil").val();
        var login   = $("#login").val();


		  $("#correcto").load("insertarUsuario.php", 
				{NOMBRE: nombre, EMAIL: email, LOGIN: login, PERFIL: perfil}, function(){
			   $("#cancelar").click();
         $("#cancelar").click();

         location.href="adminUsuarios.php";
		  });


		});

    $( "#nuevoUsuario" ).click(function() {
        $("#modificarUsuario").hide();
        $("#ingresarUsuario").show();
        $("#myModalLabel").text("INGRESAR USUARIO");

        var nombre  = $("#nombre").val("");
        var email   = $("#email").val("");
        var perfil  = $("#perfil").val("0");
        var login   = $("#login").val("");
          $("#idusuario").hide();

      });
    
    $( "#modificarUsuario" ).click(function() {
        
        var id =   $("#idusuario").text();
        var nombre  = $("#nombre").val().toUpperCase();;
        var email   = $("#email").val();
        var perfil  = $("#perfil").val();
        var login   = $("#login").val();


      $("#correcto").load("modificarUsuario.php", 
        {ID_USUARIO: id, NOMBRE: nombre, EMAIL: email, LOGIN: login, PERFIL: perfil}, function(){
         $("#cancelar").click();
         $("#cancelar").click();

         location.href="adminUsuarios.php";
      });


    });

		
	}); //fin document
	    
      function eliminar(id, user){
        if(confirm("¿Quieres Eliminar a  "+user+"?" )) {

            $("#correcto").load("eliminarUsuario.php", 
            {ID_USUARIO: id}, function(){
              
              
                location.href="adminUsuarios.php";
                
                });//fin diligencia

        }
      }
      function modificarUsuario(id , user , email , login , perfil){
         
        $("#ingresarUsuario").hide();
        $("#modificarUsuario").show();
        $("#myModalLabel").text("MODIFICAR USUARIO");

        $("#nombre").val(user);
        $("#email").val(email);
        $("#perfil").val(perfil);
        $("#login").val(login);
         $("#idusuario").text(id);
         $("#idusuario").hide();



      }

    </script>
  </head>

  <body>

    <div id="idusuario" style="display:block;"></div>
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
                      <a class="active" href="javascript:;" >
                          <i class="fa fa-book"></i>
                          <span><b>ADMIN USUARIOS</b></span>
                      </a>
                      <ul class="sub">
                           <li class="active"><a  href="honorarios.php"><b>VER USUARIOS</b></a></li>
             
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
          	<h3><i class="fa fa-angle-right"></i>USUARIOS REGISTRADO</h3>
          	<div class="row mt">
          		<div class="col-lg-12">
                  
                  <div class="form-panel">
                      <h4><i class="fa fa-angle-right"></i> USUARIOS</h4> 
              <div id="correcto"> </div>
              <div style="padding-right: 23px;">
                <button  data-toggle="modal" data-target="#myModal"  style="float:right;" type="button" id="nuevoUsuario" class="btn btn-theme03">AGREGAR</button>
     
            



                 
                 
<br>  

            <div id="resultadobusqueda" class="from-panel">
           <table class="table table-striped table-advance table-hover">
                            
                            
                              <thead>
                              <tr>
                                  <th><i class="fa fa-bullhorn"></i> USUARIO</th>
                                  <th class="hidden-phone"><i class="fa fa-question-circle"></i> EMAIL</th>
                                  <th><i class="fa fa-bookmark"></i> ID-LOGIC</th>
                                  <th><i class=" fa fa-edit"></i> PERFIL</th>
                                  <th></th>
                              </tr>
                              </thead>
                              <tbody>
                     <?php

include("conexion.php");  
$link = Conectarse();  



$query = "SELECT `ID`, `NOMBRE`, `LOGIN`, `PASSWORD`, `PERFIL`, `EMAIL`, `AUTORIZACION` FROM `USUARIO` ";

  
//se envia la consulta  
$resultdeli = mysql_query($query, $link);  

  


                     while ($rowde = mysql_fetch_row($resultdeli)){ 


                             echo "<tr>";

                                  echo "<td><a href=\"#\">".$rowde[1]."</a></td>";
                                  echo "<td class=\"hidden-phone\">".$rowde[5]."</td>";
                                  echo "<td>".$rowde[2]."</td>";
                                  echo "<td>";
                                  if($rowde[4] == "TODO"){
                                    echo "<span class=\"label label-success label-mini\">ADMIN</span>";
                                  }else{
                                     echo "<span class=\"label label-info label-mini\">INGRESADOR</span>";
                                  }
                                  echo "</td>";
                                  echo "<td>";
                                   
                                      echo "<button  data-toggle=\"modal\" data-target=\"#myModal\" onclick=\"modificarUsuario(".$rowde[0]." , '".$rowde[1]."', '".$rowde[5]."', '".$rowde[2]."', '".$rowde[4]."');\" data-toggle=\"modal\" data-target=\"#myModal\"  data-toggle=\"tooltip\" title=\"MODIFICAR\"class=\"btn btn-primary btn-xs\"><i class=\"fa fa-pencil\"></i></button>";
                                      echo "<button  onclick=\"eliminar(".$rowde[0]." , '".$rowde[1]."');\" idusuariario=\"".$rowde[0]."\" id=\"eliminar\" class=\"btn btn-danger btn-xs\" data-toggle=\"tooltip\" title=\"ELIMINAR\"  ><i class=\"fa fa-trash-o\"></i></button>";
                                  echo "</td>";
                              echo "</tr>";
    
          }   

$link = null;

?>

                              
                              </tbody>
                          </table>
                      
                      </div><!-- /content-panel -->
                  
          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none;">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                     

                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                    <h4 class="modal-title" id="myModalLabel">NUEVO USUARIO</h4>
                  </div>
                  <div class="modal-body">
                   <form class="form-horizontal style-form" method="get">
                          <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">NOMBRE</label>
                              <div class="col-sm-10">
                                  <input  id="nombre" type="text" class="form-control">
                              </div>
                          </div>

                        <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">EMAIL</label>
                              <div class="col-sm-10">
                                  <input  id="email" type="text" class="form-control">
                              </div>
                          </div>

                           <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">PERFIL</label>
                              <div class="col-sm-10">
                                <select id="perfil" class="form-control input-lg"> 
                                  <option value="0">SELECCION UN PERFIL</option> 
                                  <option value="TODO">1.- ADMINISTRADOR</option>
                                  <option value="INGRESAR">2.- INGRESADOR EXHORTO</option>
                                </select>
                              </div>
                          </div>

              

                          <div class="form-group">
                              <label class="col-sm-3 col-sm-3 control-label">LOGIN</label>
                              <div class="col-sm-10">
                                  <input  id="login" type="text" class="form-control">
                              </div>
                          </div> 
                        
           </form>
                  </div>
                
                  <div class="modal-footer">
                    <button id="cancelar" type="button" class="btn btn-default" data-dismiss="modal">Cancelar</button>
                    <button type="button" id="ingresarUsuario" class="btn btn-primary" >Guardar usuario</button>
                    <button type="button" id="modificarUsuario" class="btn btn-primary" >Modificar usuario</button>
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