<?php
session_start();
//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  

$usuario 	= $_POST["USUARIO"];
$password 	= $_POST["PASSWORD"];


$query = "SELECT *  FROM `USUARIO` WHERE LOGIN = '$usuario' AND PASSWORD = '$password'";



//se envia la consulta  
$result = mysql_query($query, $link);  
						  
$cantidad =  mysql_num_rows($result);

if($cantidad > 0){

	while ($row = mysql_fetch_row($result)){   
			//redict
			$_SESSION["usuario"] = $row[1];
			$_SESSION["perfil"] = $row[4];

			ini_set("session.cookie_lifetime","7200"); 
			ini_set("session.gc_maxlifetime","7200"); 
			
		
			echo"<script language= \"javascript\">window.location=\"index2.php\"</script>";
	}
}else{
echo " <div class=\"alert alert-danger\"><b>Error al ingresar!</b> usuario ó password incorrectos.</div>";
}
		
?>
               