<?php
    $conexion = new mysqli('localhost','ctr17658','QKhjLENOdhvhSLUJDbEn','ctr17658_EXHORTO',3306);


	if (mysqli_connect_errno()) {
    	printf("La conexión con el servidor de base de datos falló: %s\n", mysqli_connect_error());
    	exit();
	}

$apellidodeudor 	= $_GET["apellidodeudor"];
$nombrecliente 		= $_GET["nombrecliente"];
$rut_cliente 		= $_GET["rut_cliente"];
$tribunalorigen 	= $_GET["tribunalorigen"];
$roljuicio 			= $_GET["roljuicio"];
$ciudadexhorto 		= $_GET["ciudadexhorto"];
$falcultadesexhor 	= $_GET["falcultadesexhor"];
$abogadoexhor 		= $_GET["abogadoexhor"];

$FECH_DESDE			= $_GET["FECH_DESDE"];
$FECH_HASTA			= $_GET["FECH_HASTA"];
$ESTADO             = $_GET["ESTADO"];


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



	$resultado = $conexion->query($querybuscador2);

	

	if($resultado->num_rows > 0 ){
						
		date_default_timezone_set('America/Mexico_City');

		if (PHP_SAPI == 'cli')
			die('Este archivo solo se puede ver desde un navegador web');

		/** Se agrega la libreria PHPExcel */
		require_once 'lib/PHPExcel/PHPExcel.php';

		// Se crea el objeto PHPExcel
		$objPHPExcel = new PHPExcel();

		// Se asignan las propiedades del libro
		$objPHPExcel->getProperties()->setCreator("Tramitación Exhortos A & G Asociados") //Autor
							 ->setLastModifiedBy("Codedrinks") //Ultimo usuario que lo modificó
							 ->setTitle("Reporte Excel con PHP y MySQL")
							 ->setSubject("Reporte Excel con PHP y MySQL")
							 ->setDescription("Reporte de Tramitación Exhortos")
							 ->setKeywords("reporte Tramitación Exhortos")
							 ->setCategory("Reporte excel");

		$tituloReporte = "Tramitación Exhortos A & G Asociados";
		$titulosColumnas = array('ID','CLIENTE','CIUDAD', 'CARATULA' , 'ROL ' , 'TRIBUNAL ORIGEN', 'ABOGADO' , 'FACULTADES', 'FECHA INGRESO', 'FECHA ENCARGO','FECHA DEVOLUCIÓN',	'ESTADO','DILIGENCIAS');
		
		$objPHPExcel->setActiveSheetIndex(0)
        		    ->mergeCells('A1:D1');
						
		// Se agregan los titulos del reporte
		$objPHPExcel->setActiveSheetIndex(0)
					->setCellValue('A1',$tituloReporte)
					
        		    ->setCellValue('A3',  $titulosColumnas[0])
		            ->setCellValue('B3',  $titulosColumnas[1])
        		    ->setCellValue('C3',  $titulosColumnas[2])
        		    ->setCellValue('D3',  $titulosColumnas[3])
        		    ->setCellValue('E3',  $titulosColumnas[4])
        		    ->setCellValue('F3',  $titulosColumnas[5])
					
					->setCellValue('G3',  $titulosColumnas[6])
        		    ->setCellValue('H3',  $titulosColumnas[7])
        		    ->setCellValue('I3',  $titulosColumnas[8])
        		    ->setCellValue('J3',  $titulosColumnas[9])
        		    ->setCellValue('K3',  $titulosColumnas[10])
					->setCellValue('L3',  $titulosColumnas[11])
					->setCellValue('M3',  $titulosColumnas[12]);
        			
		
		//Se agregan los datos de los alumnos
		$i = 4;
		while ($fila = $resultado->fetch_array()) {


			$query = "select A.ID , A.ID_EXHORTO, A.DILIGENCIA, date_format( A.FECHA, '%d/%m/%Y') as FECHA , A.OBSERVACIONES, A.USUARIO from (SELECT `ID`, `ID_EXHORTO`, `DILIGENCIA`, str_to_date(FECHA, '%d/%m/%Y') as `FECHA`, `OBSERVACIONES`, `USUARIO` FROM DILIGENCIA WHERE `ID_EXHORTO` = ".$fila['ID']."  order by FECHA ASC) as A" ;

			$resultado2 = $conexion->query($query);

			$id = "";
			$cliente = $fila['NOMBRE_CLIENTE'];
			$fecha_ingreso = "";
			$exhorto = "";
			$fecha_encargo = "";
			$fecha_devolucion = "";
			$estado = "";
			
			$cadena = "";
			

			while ($fila2 = $resultado2->fetch_array()) {
				
				$fecha			= $fila2['FECHA'];
				$diligencia 	= $fila2['DILIGENCIA'];
				$observaciones 	= $fila2['OBSERVACIONES'];
				
				$cadena = $cadena." ".$fecha." / ".$diligencia." / ".$observaciones."\n";
				
				$estado = $diligencia;
				
				
				if( strpos($diligencia, 'INGRESO - ROL') !== false ){
					$valore=split("[/]",$observaciones);
					$id = $valore[2];
					$fecha_ingreso = $fecha;
				}

				if(strpos($diligencia, 'ENCARGA EXHORTO CLIENTE')  !== false){
					$fecha_encargo = $fecha;
				}

				if (strpos($diligencia, 'DEVOLUCION DE EXHORTO') !== false	 ){
					$fecha_devolucion = $fecha;
				}
				
				
			}
			
			$objPHPExcel->setActiveSheetIndex(0)
			
			->setCellValue('A'.$i,  $id )
			->setCellValue('B'.$i,  $cliente)
			
					->setCellValue('C'.$i,  $fila['CIUDAD'])
        		    ->setCellValue('D'.$i,  $fila['NOMBRE_CLIENTE']." con ".$fila['APELLIDO_DEUDOR'])
		            ->setCellValue('E'.$i,  $fila['ROL_JUICIO'])
        		    ->setCellValue('F'.$i,  $fila['TRIBUNAL_ORIGEN'])
        		    ->setCellValue('G'.$i,  $fila['ABOGADO'])
        		    ->setCellValue('H'.$i,  $fila['FACULTADES'])
					->setCellValue('I'.$i,  $fecha_ingreso)
					->setCellValue('J'.$i,  $fecha_encargo)
					->setCellValue('K'.$i,  $fecha_devolucion)
					->setCellValue('L'.$i,  $estado)
					->setCellValue('M'.$i, $cadena);


					$i++;
		}
		
		$estiloTituloReporte = array(
        	'font' => array(
	        	'name'      => 'Verdana',
    	        'bold'      => true,
        	    'italic'    => false,
                'strike'    => false,
               	'size' =>16,
	            	'color'     => array(
    	            	'rgb' => 'FFFFFF'
        	       	)
            ),
	        'fill' => array(
				'type'	=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'	=> array('argb' => 'FF220835')
			),
            'borders' => array(
               	'allborders' => array(
                	'style' => PHPExcel_Style_Border::BORDER_NONE                    
               	)
            ), 
            'alignment' =>  array(
        			'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        			'vertical'   => PHPExcel_Style_Alignment::VERTICAL_CENTER,
        			'rotation'   => 0,
        			'wrap'          => TRUE
    		)
        );

		$estiloTituloColumnas = array(
            'font' => array(
                'name'      => 'Arial',
                'bold'      => true,                          
                'color'     => array(
                 'rgb' => 'FFFFFF'
                )
            ),
            'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_GRADIENT_LINEAR,
				
        		'startcolor' => array(
            		'rgb' => 'c47cf2'
        		),
        		'endcolor'   => array(
            		'argb' => 'FF431a5d'
        		)
			),
            'borders' => array(
            	'top'     => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM ,
                    'color' => array(
                        'rgb' => '143860'
                    )
                ),
                'bottom'     => array(
                    'style' => PHPExcel_Style_Border::BORDER_MEDIUM ,
                    'color' => array(
                        'rgb' => '143860'
                    )
                )
            ),
			'alignment' =>  array(
        			'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
        			'vertical'   => PHPExcel_Style_Alignment::VERTICAL_CENTER,
        			'wrap'          => TRUE
    		));
			
		$estiloInformacion = new PHPExcel_Style();
		$estiloInformacion->applyFromArray(
			array(
           		'font' => array(
               	'name'      => 'Arial',               
               	'color'     => array(
                   	'rgb' => '000000'
               	)
           	),
           	'fill' 	=> array(
				'type'		=> PHPExcel_Style_Fill::FILL_SOLID,
				'color'		=> array('argb' => 'FFd9b7f4')
			),
           	'borders' => array(
               	'left'     => array(
                   	'style' => PHPExcel_Style_Border::BORDER_THIN ,
	                'color' => array(
    	            	'rgb' => '3a2a47'
                   	)
               	)             
           	)
        ));
		 
		$objPHPExcel->getActiveSheet()->getStyle('A1:D1')->applyFromArray($estiloTituloReporte);
		$objPHPExcel->getActiveSheet()->getStyle('A3:M3')->applyFromArray($estiloTituloColumnas);		
		//$objPHPExcel->getActiveSheet()->setSharedStyle($estiloInformacion, "A4:D".($i-1));
				
		for($i = 'A'; $i <= 'M'; $i++){
			$objPHPExcel->setActiveSheetIndex(0)			
				->getColumnDimension($i)->setAutoSize(TRUE);
		}
		
		// Se asigna el nombre a la hoja
		$objPHPExcel->getActiveSheet()->setTitle('EXHORTOS');

		// Se activa la hoja para que sea la que se muestre cuando el archivo se abre
		$objPHPExcel->setActiveSheetIndex(0);
		// Inmovilizar paneles 
		//$objPHPExcel->getActiveSheet(0)->freezePane('A4');
		$objPHPExcel->getActiveSheet(0)->freezePaneByColumnAndRow(0,4);



		// Se manda el archivo al navegador web, con el nombre que se indica (Excel2007)
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8;charset=iso-8859-1');
		header('Content-Disposition: attachment;filename="Tramitacion Exhortos.xlsx"');
		header('Cache-Control: max-age=0');

		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
		$objWriter->save('php://output');
		exit;
		
	}
	else{
		print_r('No hay resultados para mostrar');
	}
?>