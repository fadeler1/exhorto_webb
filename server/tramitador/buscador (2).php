<?php session_start();
//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  

$perfil = $_SESSION["perfil"];

$apellidodeudor 	= $_POST["apellidodeudor"];
$nombrecliente 		= $_POST["nombrecliente"];

$tribunalorigen 	= $_POST["tribunalorigen"];
$roljuicio 			= $_POST["roljuicio"];
$ciudadexhorto 		= $_POST["ciudadexhorto"];
$falcultadesexhor 	= $_POST["falcultadesexhor"];
$abogadoexhor 		= $_POST["abogadoexhor"];

$FECH_DESDE			= $_POST["FECH_DESDE"];
$FECH_HASTA			= $_POST["FECH_HASTA"];
$ESTADO             = $_POST["ESTADO"];

$where = "";
$querybuscador = "SELECT `ID`, `APELLIDO_DEUDOR`, `NOMBRE_CLIENTE`, `RUT`, `TRIBUNAL_ORIGEN`, `ROL_JUICIO`, `CIUDAD`, `FACULTADES`, `ABOGADO`, `USUARIO`, `ESTADO` , `BOLETA_HONORARIOS`, `BOLETA_DEVOLUCION` FROM EXHORTO ";

if($apellidodeudor != ""){ //deudor
	if(strlen($where) == 0){
		$where = $where." APELLIDO_DEUDOR like '%$apellidodeudor%' ";
	}else{
		$where = $where." and APELLIDO_DEUDOR like '%$apellidodeudor%'  ";
	}
	
}

if($nombrecliente != ""){
	if(strlen($where) == 0){
		$where = $where." NOMBRE_CLIENTE like '%$nombrecliente%' ";
	}else{
		$where = $where." and NOMBRE_CLIENTE like '%$nombrecliente%'  ";
	}
}

if($tribunalorigen != ""){
	if(strlen($where) == 0){
		$where = $where." TRIBUNAL_ORIGEN like '%$tribunalorigen%' ";
	}else{
		$where = $where." and TRIBUNAL_ORIGEN like '%$tribunalorigen%'  ";
	}
}
if($roljuicio != ""){
	if(strlen($where) == 0){
		$where = $where." ROL_JUICIO like '%$roljuicio%' ";
	}else{
		$where = $where." and ROL_JUICIO like '%$roljuicio%'  ";
	}
}

if($ciudadexhorto != ""){
	if(strlen($where) == 0){
		$where = $where." CIUDAD like '%$ciudadexhorto%' ";
	}else{
		$where = $where." and CIUDAD like '%$ciudadexhorto%'  ";
	}
}

if($falcultadesexhor != ""){
	if(strlen($where) == 0){
		$where = $where." FACULTADES like '%$falcultadesexhor%' ";
	}else{
		$where = $where." and FACULTADES like '%$falcultadesexhor%'  ";
	}
}
	
if($abogadoexhor != ""){
	if(strlen($where) == 0){
		$where = $where." ABOGADO like '%$abogadoexhor%' ";
	}else{
		$where = $where." and ABOGADO like '%$abogadoexhor%'  ";
	}
}

if ($ESTADO  != "TODAS") {
	# code...
	if ($ESTADO == "TERMINADO") {
		# code...
		if(strlen($where) == 0){
			$where = $where." ESTADO = 0 ";
		}else{
			$where = $where." and ESTADO =0  ";
		}
	}else{
		if(strlen($where) == 0){
			$where = $where." ESTADO = 1 ";
		}else{
			$where = $where." and ESTADO =1 ";
		}
	}
}
	

if(strlen($where) == 0){
	$querybuscador;
}else{
	$querybuscador = $querybuscador." WHERE ".$where." ";
	
}

$querybuscador2 = "";


if ($FECH_DESDE != "" && $FECH_HASTA != "") {
	# code...
	$querybuscador2 = 
	"SELECT A.ID AS ID, A.APELLIDO_DEUDOR AS APELLIDO_DEUDOR, A.NOMBRE_CLIENTE AS NOMBRE_CLIENTE, A.RUT AS RUT, A.TRIBUNAL_ORIGEN AS TRIBUNAL_ORIGEN, A.ROL_JUICIO AS ROL_JUICIO, A.CIUDAD AS CIUDAD, A.FACULTADES AS FACULTADES, A.ABOGADO AS ABOGADO, A.USUARIO AS USUARIO, A.ESTADO AS ESTADO, A.BOLETA_HONORARIOS AS BOLETA_HONORARIOS
		FROM (".$querybuscador.") AS A
	  INNER JOIN ( SELECT DISTINCT (`ID_EXHORTO`) 

	
		FROM `DILIGENCIA` WHERE 
		CAST(DATE_FORMAT( CONCAT( SUBSTRING(  `FECHA`, 7, 4 ) , SUBSTRING(  `FECHA`, 4, 2 ) , SUBSTRING(  `FECHA`, 1, 2 ) ),  \"%y-%m-%d\" ) as DATE) >= 
             CAST(DATE_FORMAT( CONCAT( SUBSTRING( '".$FECH_DESDE."', 7, 4 ) , SUBSTRING(  '".$FECH_DESDE."', 4, 2 ) , SUBSTRING(  '".$FECH_DESDE."', 1, 2 ) ) ,  \"%y-%m-%d\" ) as DATE) AND 
 		CAST(DATE_FORMAT( CONCAT( SUBSTRING( `FECHA`, 7, 4 ) , SUBSTRING(  `FECHA`, 4, 2 ) , SUBSTRING(  `FECHA`, 1, 2 ) ),  \"%y-%m-%d\" ) as DATE) <=
             CAST(DATE_FORMAT( CONCAT( SUBSTRING( '".$FECH_HASTA."', 7, 4 ) , SUBSTRING( '".$FECH_HASTA."', 4, 2 ) , SUBSTRING( '".$FECH_HASTA."', 1, 2 ) ) ,  \"%y-%m-%d\" )  as DATE)

 			AND (DILIGENCIA ='1.-ENCARGA EXHORTO CLIENTE' or DILIGENCIA='2.-INGRESO - ROL')


		) AS B ON A.ID = B.ID_EXHORTO";

}else{
	$querybuscador2 = $querybuscador;
}



//echo $querybuscador2;
//se envia la consulta  
$result = mysql_query($querybuscador2, $link);  

$cantidadEncontradas = mysql_num_rows($result);
echo "<h4><i class=\"fa fa-angle-right\"></i> Resultado de la busqueda ($cantidadEncontradas) ($cantidadEncontradas)</h4>";

             echo "<div style=\"text-align: right; padding-right: 23px;\">";
                echo "<a id=\"exportar\" href=\"#\"  onclick=\"exportar()\" ><img src=\"assets/img/images.png\" width=\"15\" height=\"15\">&nbsp;Exportar a excel</a>";
            echo "</div>";
              echo "<hr>";
              
              echo "<table class=\"table table-striped table-advance table-hover\">";
                            echo "<thead>";
                              echo "<tr>";
                                  echo "<th><i class=\"fa fa-bullhorn\"></i>CARATULA</th>";
                                  echo "<th class=\"hidden-phone\"><i class=\"fa fa-question-circle\"></i> FACULTADES</th>";
                                  echo "<th><i class=\"fa fa-bookmark\"></i> Abogado</th>";
                                  echo "<th><i class=\"fa fa-bookmark\"></i> Ciudad Exhorto</th>";
                                  echo "<th><i class=\" fa fa-edit\"></i> Estado</th>";
                  
                                  echo "<th></th>";
                              echo "</tr>";
                              echo "</thead>";
                              echo "<tbody>";
							  
		  
while ($row = mysql_fetch_row($result)){   
			echo "<tr>";
				echo "<td><a href=\"modificarExhorto.php?id=".$row[0]."\">".$row[2]." <div style=\"color: red;\" ><b>CON</b></div>".$row[1]."</a></td>";
				echo "<td class=\"hidden-phone\">".$row[7]."</td>";
				echo "<td>".$row[8]."</td>";
				echo "<td> ".$row[6]."</td>";
				if($row[10] == 0){
					echo "<td><span class=\"label label-success\">TERMINADO</span></td>";
				}else{
					echo "<td><span class=\"label label-danger\">VIGENTE</span></td>";
				}
				
				echo "<td>";
				if($perfil == "TODO"){
					if ($row[11] == 0) {
					# code...
					echo "<button id=\"honorarioBoton\" data-toggle=\"modal\" data-target=\"#myModal\" onclick=\"ingresarHonorarios(".$row[0].");\" class=\"btn btn-success btn-xs\" data-toggle=\"tooltip\" title=\"Ingresar boleta honorario\"><i class=\"fa fa-check\"> </i></button>&nbsp;";
					}
					if($row[12] == 0){
						echo "<button id=\"honorarioBoton\" data-toggle=\"modal\" data-target=\"#myModal\" onclick=\"ingresarRenvolso(".$row[0].");\" class=\"btn btn-success btn-xs\" data-toggle=\"tooltip\" title=\"Ingresar devolución\"><i class=\"fa fa-check\"> </i></button>&nbsp;";
					}
				}
								
				echo "<button class=\"btn btn-primary btn-xs\" data-toggle=\"tooltip\" onclick=\"invocarPagina(".$row[0].");\" title=\"Ingresar diligencia\"><i class=\"fa fa-pencil\"></i></button>&nbsp;";
				echo "<button class=\"btn btn-danger btn-xs\" data-toggle=\"tooltip\" onclick=\"EliminarExhorto(".$row[0].",'".$row[2]." CON ".$row[1]."');\" title=\"Eliminar Exhorto\"><i class=\"fa fa-pencil\"></i></button>&nbsp;";
				echo "</td>";
			echo "</tr>";

}

        echo "</tbody>";
		echo "</table>";  


		
?>
               