<?php
session_start();
$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$ID_EXHORTO_INGRESADO 	= $_POST["ID_EXHORTO"];
		$DILIGENCIA_NUEVO 		= $_POST["DILIGENCIA"];
		$FECHA_NUEVO 		= $_POST["FECHA"];
		$OBSERVACIONES_NUEVO 	= $_POST["OBSERVACIONES"];
		$usuario 				= $_SESSION['usuario'];

		/*Creamos una query sencilla*/
		
		$sql2="INSERT INTO `DILIGENCIA`(`ID`, `ID_EXHORTO`, `DILIGENCIA`, `FECHA`, `OBSERVACIONES`, `USUARIO`) 
				VALUES (null,$ID_EXHORTO_INGRESADO, '$DILIGENCIA_NUEVO' ,'$FECHA_NUEVO' ,'$OBSERVACIONES_NUEVO', '$usuario' )";

		
		 $conn->exec($sql2);


		 echo "<div class=\"alert alert-success\"><b>DILIGENCIA</b> Fue ingresado correctamente a la base de datos</div>";
		 if($DILIGENCIA_NUEVO == "34.-DEVOLUCION EXHORTO SIN DILIGENCIA" || $DILIGENCIA_NUEVO == "35.-DEVOLUCION EXHORTO CLIENTE" ){
		 		$sql3="UPDATE `EXHORTO` SET `ESTADO`=0  WHERE `ID` = $ID_EXHORTO_INGRESADO ";

		 		$conn->exec($sql3);
		 }
}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;


?>