
<?php  
//tomamos los datos del archivo conexion.php  
include("conexion.php");  
$link = Conectarse();  

$ciudadHonorario 	= $_POST["CIUDAD"];
$abogadohonorario	= $_POST["ABOGADO"];
$accion 			= $_POST["ACCION"];
$pendiente 			= $_POST["PENDIENTE"];
$pagada 			= $_POST["PAGADA"];
$ACCION_TIPO 		= $_POST["ACCION_TIPO"];
$caratula 			= $_POST["CARATULA"];
$EXHORTO 			= $_POST["EXHORTO"];
$Doc 				= $_POST["NUMERODOC"];


$where = "";
$querybuscador = "SELECT EX.ID,	APELLIDO_DEUDOR, NOMBRE_CLIENTE, ABOGADO, EX.ESTADO as ESTADO_EX, BOLETA_HONORARIOS, BOLETA_DEVOLUCION , BOL.ID as ID_BOLETA, 
						DOCUMENTO, MONTO, BOL.ESTADO, TIPO, PERTENECE, FECHA 
 				from EXHORTO EX inner join BOLETA_HONORARIO BOL on (EX.ID = BOL.ID_EXHORTO) ";

if($ciudadHonorario != ""){ //deudor
	if(strlen($where) == 0){
		$where = $where." EX.CIUDAD like '%$ciudadHonorario%' ";
	}else{
		$where = $where." and EX.CIUDAD like '%$ciudadHonorario%'  ";
	}
	
}

if($Doc != ""){
	if(strlen($where) == 0){
		$where = $where."  BOL.DOCUMENTO = $Doc  ";
	}else{
		$where = $where." and  BOL.DOCUMENTO = $Doc  ";
	}
}

if($caratula != ""){
	if(strlen($where) == 0){
		$where = $where." (EX.APELLIDO_DEUDOR like '%$caratula%' or EX.NOMBRE_CLIENTE like '%$caratula%') ";
	}else{
		$where = $where." and (EX.APELLIDO_DEUDOR like '%$caratula%' or EX.NOMBRE_CLIENTE like '%$caratula%')   ";
	}
}

if($abogadohonorario != ""){
	if(strlen($where) == 0){
		$where = $where." EX.ABOGADO like '%$abogadohonorario%' ";
	}else{
		$where = $where." and EX.ABOGADO like '%$abogadohonorario%'  ";
	}
}

if($ACCION_TIPO == "HONORARIOS"){
	if(strlen($where) == 0){
			$where = $where." BOL.TIPO  = 1 ";
		}else{
			$where = $where." and BOL.TIPO = 1  ";
		}
}else{
	if($ACCION_TIPO == "DEVOLUCION"){
		if(strlen($where) == 0){
			$where = $where." BOL.TIPO  = 2 ";
		}else{
			$where = $where." and BOL.TIPO = 2  ";
		}
	}
}

if($accion == "PENDIENTE"){
			if($pendiente == "PENDIENTE"){
		if(strlen($where) == 0){
			$where = $where." BOL.ESTADO  = 0 ";
		}else{
			$where = $where." and BOL.ESTADO = 0  ";
		}
	}		
}else{
	if($accion == "PAGADA"){
		if($pagada == "PAGADA"){
			if(strlen($where) == 0){
				$where = $where." BOL.ESTADO  = 1 ";
			}else{
				$where = $where." and BOL.ESTADO = 1  ";
			}
		}
	}
}

if(strlen($where) == 0){
	$querybuscador;
}else{
	$querybuscador = $querybuscador." WHERE ".$where." ";
	
}

if($EXHORTO != ""){

	$sqlDiligencias = "select ID_EXHORTO from DILIGENCIA where DILIGENCIA like  '%$EXHORTO%' or OBSERVACIONES like  '%$EXHORTO%'";

	$sqlFinal ="select A.ID,A.APELLIDO_DEUDOR, A.NOMBRE_CLIENTE, A.ABOGADO, A.ESTADO_EX, A.BOLETA_HONORARIOS, A.BOLETA_DEVOLUCION , A.ID_BOLETA, 
						A.DOCUMENTO, A.MONTO, A.ESTADO, A.TIPO, A.PERTENECE, FECHA from (".$querybuscador.") as A inner join (".$sqlDiligencias.") as B on  (A.ID = B.id_exhorto)";

}else{
	$sqlFinal = $querybuscador;
}


//se envia la consulta  
$result = mysql_query($sqlFinal, $link);  

$cantidadEncontradas = mysql_num_rows($result);
echo "<h4><i class=\"fa fa-angle-right\"></i> Resultado de la busqueda ($cantidadEncontradas)</h4>";

             echo "<div style=\"text-align: right; padding-right: 23px;\">";
              echo "<a id=\"exportar\" href=\"#\"  onclick=\"exportar()\" ><img src=\"assets/img/images.png\" width=\"15\" height=\"15\">&nbsp;Exportar a excel</a>";
            echo "</div>";
              echo "<hr>";
              
              echo "<table class=\"table table-striped table-advance table-hover\">";
                            echo "<thead>";
                              echo "<tr>";
                                  echo "<th><i class=\"fa fa-bullhorn\"></i>CARATULA</th>";
                                  echo "<th class=\"hidden-phone\"><i class=\"fa fa-question-circle\"></i> Abogado</th>";
                                  echo "<th><i class=\"fa fa-bookmark\"></i> Numero Doc</th>";
                                  echo "<th><i class=\"fa fa-bookmark\"></i> Monto</th>";
                                  echo "<th><i class=\"fa fa-bookmark\"></i> TIPO</th>";
                                  echo "<th><i class=\"fa fa-bookmark\"></i> PERTENECE</th>";
                                  echo "<th><i class=\" fa fa-edit\"></i> Estado BOLETA</th>";
                  				  echo "<th><i class=\" fa fa-edit\"></i> Estado EXHORTO</th>";
                                  echo "<th></th>";
                              echo "</tr>";
                              echo "</thead>";
                              echo "<tbody>";
							  
	  
while ($row = mysql_fetch_row($result)){   
			echo "<tr>";
				echo "<td><a href=\"IngresarDiligencia.php?id=".$row[0]."\">".$row[2]."/".$row[1]."</a></td>";
				echo "<td class=\"hidden-phone\">".$row[3]."</td>";
				echo "<td>".$row[8]."</td>";
				echo "<td> $".$row[9]."</td>";
				if($row[11] == 1){
						echo "<td><img src=\"assets/img/honorario.png\" width=\"25\" height=\"25\">HONORARIO</td>";
				}else{
					echo "<td><img src=\"assets/img/devolucion.png\" width=\"25\" height=\"25\">DEVOLUCION</td>";
				}
				echo "<td> ".$row[12]."</td>";
				if($row[10] == 1){
					echo "<td><span class=\"label label-success\">PAGADO</span></td>";
				}else{
					echo "<td><span class=\"label label-danger\">PENDIENTE</span></td>";
				}

				if($row[4] == 0){
					echo "<td><span class=\"label label-success\">TERMINADO</span></td>";
				}else{
					echo "<td><span class=\"label label-danger\">VIGENTE</span></td>";
				}
					echo "<td>";
					echo "<button id=\"honorarioBoton\" data-toggle=\"modal\" data-target=\"#myModal\" onclick=\"modificarHonorario(".$row[7].", ".$row[8].", " .$row[9].",".$row[11].", '".$row[12]."' , '".$row[13]."');\" class=\"btn btn-primary btn-xs\" data-toggle=\"tooltip\" title=\"MODIFICAR\"><i class=\"fa fa-pencil\"> </i></button>&nbsp;";
				if($row[10] == 0){
					echo "<button id=\"pagar\" class=\"btn btn-success btn-xs\" onclick=\"pagar(".$row[7].", ".$row[11].")\" data-toggle=\"tooltip\" title=\"PAGAR\"><i class=\"fa fa-check\"> </i></button>&nbsp;";
				}
					echo "<button class=\"btn btn-danger btn-xs\" onclick=\"eliminarDocumento(".$row[7].", ".$row[11].", ".$row[0].")\" data-toggle=\"tooltip\" title=\"ELIMINAR\" ><i class=\"fa fa-trash-o \"></i></button>";
					echo "</td>";

				echo "</td>";
			echo "</tr>";

}

        echo "</tbody>";
		echo "</table>";  


		
?>
               