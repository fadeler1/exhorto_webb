<?php
session_start();

$servername = "localhost";
$username = "ctr17658";
$password = "WVFXs*2)Y05kn9t";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$password 	= $_POST["PASSWORD"];
		$AUTORIZACION 		= $_POST["AUTORIZACION"];
	
		/*Creamos una query sencilla*/
		
		$sql2="UPDATE `USUARIO` SET `PASSWORD`='$password' WHERE `AUTORIZACION` = $AUTORIZACION";

		
		 $conn->exec($sql2);

		 $sql2="UPDATE `USUARIO` SET `AUTORIZACION`=0 WHERE `AUTORIZACION` = $AUTORIZACION";

		
		 $conn->exec($sql2);

		 echo "<div class=\"alert alert-success\"><b>Contraseña modificada correctamente </b> </div><a class=\"btn btn-theme btn-block\"  href=\"index.php\" id=\"ingresar\" ><i class=\"fa fa-lock\"></i><b>VOLVER</b></a><script>$(\"#formulario\").hide();</script>";
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>