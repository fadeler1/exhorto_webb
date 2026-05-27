<?php


$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";



try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$ID_BOLETA 		= $_POST["ID_BOLETA"];
		$RECEPTOR 		= $_POST["RECEPTOR"];
		$DOCUMENTO 		= $_POST["DOCUMENTO"];
		$MONTO 			= $_POST["monto"];
		$DILIGENCIA_RECEP = $_POST["DILIGENCIA_RECEP"];



		/*Creamos una query sencilla*/
	
		$sql2="UPDATE BOLETA_RECEPTOR SET `RECEPTOR`='$RECEPTOR', `DOCUMENTO`=$DOCUMENTO , `MONTO`=$MONTO , `DILIGENCIA`='$DILIGENCIA_RECEP' WHERE ID = $ID_BOLETA";

		
		 $conn->exec($sql2);

		 echo "<div class=\"alert alert-success\"><b>BOLETA BOLETA_RECEPTOR</b> Fue ingresado correctamente a la base de datos</div>";
}catch(PDOException $e){
	
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}


   $conn = null;



?>