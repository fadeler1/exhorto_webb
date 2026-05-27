<?php

//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  

$codigoautorizacion  = $_GET["aut"];


$n = rand(0,100000);


$query = "SELECT *  FROM `USUARIO` WHERE AUTORIZACION = $codigoautorizacion";

//se envia la consulta  
$result = mysql_query($query, $link);  
              
$cantidad =  mysql_num_rows($result);

if($cantidad > 0){

?>

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="">
    <meta name="author" content="Dashboard">
    <meta name="keyword" content="Dashboard, Bootstrap, Admin, Template, Theme, Responsive, Fluid, Retina">

    <title>Tramitación Exhortos A & G Asociados, Cambio contraseña</title>

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

        
    <!-- Custom styles for this template -->
    <link href="assets/css/style.css" rel="stylesheet">
    <link href="assets/css/style-responsive.css" rel="stylesheet">
    <script type="text/javascript" src="assets/js/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="assets/js/bootstrap-datetimepicker.min.js"></script>
  
  <script src="assets/js/jquery.maskMoney.js" type="text/javascript"></script>

    <script type="text/javascript">
      $(document).ready(function(){
        $("#aut").hide();
    $( "#cambiar" ).click(function() {
          
           var password   = $('#password1').val();
            var password1   = $('#password2').val();
            var aut = $("#aut").text();
            
            if(password == password1){
              $("#correcto").load("cambiarContraseñaBD.php", 
                  {PASSWORD: password, AUTORIZACION: aut}, function(){
                
            
              });//fin correcto
            }else{
              $("#correcto").append("<div class=\"alert alert-warning\"><b>Contraseñas no coinciden !!</b> <br> vuelva a intentar nuevamente.</div>");
            }

      });
    });

    function logiarse(){
  

            
            
    }


    </script>
  </head>

  <body>

      <!-- **********************************************************************************************************************************************************
      MAIN CONTENT
      *********************************************************************************************************************************************************** -->
      <div id="aut" style="display:block;"><?php echo $_GET["aut"];?></div>
    <div id="login-page">
      <div class="container">
      
          <div class="form-login">
           
            
            <div class="login-wrap">
              <div id="correcto"></div>
              <br>
              <div id="formulario">
                <input type="password" id="password1" class="form-control" placeholder="Nueva contraseña">
                <br>
                <input type="password" id="password2" class="form-control" placeholder="Repita contraseña">
                 <br>
                <button class="btn btn-theme btn-block" id="cambiar" href="#" id="ingresar" ><i class="fa fa-lock"></i><b>Cambiar</b></button>
               </div>
                
                
                
            </div>
    
             
          </div>     
      
      </div>
    </div>

   

    <!--BACKSTRETCH-->
    <!-- You can use an image of whatever size. This script will stretch to fit in any screen size.-->
    <script type="text/javascript" src="assets/js/jquery.backstretch.min.js"></script>
    <script>
        $.backstretch("assets/img/login-bg.jpg", {speed: 500});
    </script>


  </body>
</html>
<?php }else{
  echo"<script language= \"javascript\">window.location=\"index.php\"</script>";
}?>