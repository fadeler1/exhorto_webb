<?php


$servername = "localhost";
$username = "ctr17658";
$password = "P4MmL@]tXLEN:H$";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


		$ID_BOLETA 		= $_POST["ID_BOLETA"];
		
		/*Creamos una query sencilla*/
	
		$sql2="UPDATE `BOLETA_HONORARIO` SET ESTADO= 1 WHERE ID=$ID_BOLETA";

		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>DOCUMENTO ACTUALIZADO</b> ingresado correctamente a la base de datos</div>";
		
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>