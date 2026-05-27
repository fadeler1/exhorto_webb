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
		$ID_EXHORTO     = $_POST["ID_EXHORTO"];
		$TIPO			= $_POST["TIPO"];
		
		/*Creamos una query sencilla*/
	
		$sql2="DELETE FROM `BOLETA_HONORARIO` WHERE `ID` = $ID_BOLETA";

		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>DOCUMENTO ELIMINADO</b> ingresado correctamente a la base de datos</div>";

		 if($TIPO == 1){
		 	$sql3="UPDATE `EXHORTO` SET `BOLETA_HONORARIOS`=0 WHERE ID= $ID_EXHORTO ";
		 }else{
		 	$sql3="UPDATE `EXHORTO` SET `BOLETA_DEVOLUCION`=0 WHERE ID= $ID_EXHORTO ";
		 }

		 $conn->exec($sql3);
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>