<?php

include("conexion.php");  
$link = Conectarse();  

$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$ID_DILIGENCIA 	= $_POST["ID_DILIGENCIA"];
		$ID_EXHORTO_INGRESADO 	= $_POST["ID_EXHORTO_INGRESADO"];
		

		/*Creamos una query sencilla*/
	
		$sql2="DELETE FROM `DILIGENCIA` WHERE `ID` = $ID_DILIGENCIA ";

		

		 $conn->exec($sql2);

		 $sql3 = "SELECT count( * ) AS cantidad FROM `DILIGENCIA` 
		 			WHERE (`DILIGENCIA` LIKE '%DEVOLUCION EXHORTO A CLIENTE%' or `DILIGENCIA` LIKE '%DEVOLUCION DE EXHORTO SIN DILIGENCIAS%' ) AND ID_EXHORTO =$ID_EXHORTO_INGRESADO";

		 $result = mysql_query($sql3, $link);  

		 $cantidad = 0;
		  while ($row = mysql_fetch_row($result)){ 
		  	$cantidad = $row[0];
		  }
		 

		  if($cantidad == 0){
		  	$sql4="UPDATE `EXHORTO` SET `ESTADO`=1  WHERE `ID` = $ID_EXHORTO_INGRESADO ";

		 		$conn->exec($sql4);
		  }

		 echo "<div class=\"alert alert-success\"><b>DILIGENCIA ELIMINADA</b> Fue ingresado correctamente a la base de datos </div>";
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>