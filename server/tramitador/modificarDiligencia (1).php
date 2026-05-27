<?php


$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$ID 			= $_POST["ID_DILIGENCIA"];
		$diligencia 	= $_POST["DILIGENCIA"];
		$fecha 			= $_POST["FECHA"];
		$observacion 	= $_POST["OBSERVACIONES"];
		

		/*Creamos una query sencilla*/
		
		$sql2="UPDATE DILIGENCIA SET `DILIGENCIA`='$diligencia ',`FECHA`='$fecha',`OBSERVACIONES`='$observacion' WHERE ID = $ID";

		 echo "<div class=\"alert alert-success\"><b>Diligencia </b> Fue actualizada correctamente a la base de datos</div>";
		 $conn->exec($sql2);
		 
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;




?>