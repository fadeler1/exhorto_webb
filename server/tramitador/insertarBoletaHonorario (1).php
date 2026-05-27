<?php


$servername = "localhost";
$username = "ctr17658";
$password = "QKhjLENOdhvhSLUJDbEn";
$dbname = "ctr17658_EXHORTO";


try {
	  // Create connection
		$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


			
		$ID_EXHORTO 	= $_POST["ID_EXHORTO"];
		$DOCUMENTO 		= $_POST["DOCUMENTO"];
		$MONTO 		= $_POST["MONTO"];
		$TIPO 		= $_POST["TIPO"];
		$QUIEN 		= $_POST["QUIEN"];
		$FECHA  	= $_POST["FECHA"];


		

		/*Creamos una query sencilla*/
	


		$sql2="INSERT INTO BOLETA_HONORARIO(`ID`, `ID_EXHORTO`, `DOCUMENTO`, `MONTO`, `ESTADO` , `TIPO`, `PERTENECE` , `FECHA` ) 
				VALUES (null,$ID_EXHORTO, $DOCUMENTO, $MONTO , 0 , $TIPO , '$QUIEN ' , '$FECHA' )";

		
		 $conn->exec($sql2);
		 echo "<div class=\"alert alert-success\"><b>BOLETA BOLETA BOLETA HONORARIO</b> Fue ingresado correctamente a la base de datos</div>";

		 if($TIPO == 1){
 			$sql3="UPDATE `EXHORTO` SET `BOLETA_HONORARIOS`=1  WHERE `ID` = $ID_EXHORTO ";
		 }else{
		 	 $sql3="UPDATE `EXHORTO` SET `BOLETA_DEVOLUCION`=1  WHERE `ID` = $ID_EXHORTO ";
		 }
		
		 $conn->exec($sql3);

}catch(PDOException $e){
	 echo "<div class=\"alert alert-danger\" ><b>Error ...! ". $sql2 ."</b> ". $conn->error."</div>";
}

   $conn = null;



?>