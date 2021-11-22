<?php
include '../connection.php';
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;


$spreadsheet = new Spreadsheet();



// Add some data
//$helper->log('Add some data');
$spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('B2', 'Date SO Generation')
    ->setCellValue('B3', 'SO Number')
    ->setCellValue('B4', 'Created by');



$spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('A6', "NO.")
	->setCellValue('B6', "PE Name")
	->setCellValue('C6', "PE FL")
	->setCellValue('D6', "FP ID")
	->setCellValue('E6', "SFP ID")
	->setCellValue('F6', "MFP ID")
	->setCellValue('G6', "CD No.")
	->setCellValue('H6', "Phase")
	->setCellValue('I6', "Feeder")
	->setCellValue('J6', "Meter No.")
	->setCellValue('K6', "Installation ID")
	->setCellValue('L6', "Meter Location")
	->setCellValue('M6', "Image Link")
	->setCellValue('N6', "FI Execution Start Date")
	->setCellValue('O6', "FI Execution End Date")
	->setCellValue('P6', "Remark")
	->setCellValue('Q6', "Status")
	->setCellValue('R6', "Percentage Done (%)")
	->setCellValue('S6', "Total Customer")
    ->setCellValue('T6', "Date Handover to TNB ES")
    ->setCellValue('U6', "Customer ID");
$output=array();
$l1id=$_REQUEST['l1_id'];
$sql = "with foo as(select * from fpl1 where status='Completed' and l1_id='$l1id')
select a.*,st_astext(a.geom) as location,images||','||image2||','||image3||','||image4||','||image5 as pic from public.demand_point a,foo b where  b.l1_id=a.l1_id;";
$query = pg_query($sql);
if($query) {
    $output = pg_fetch_all($query);
}

$comp=$output;
//print_r($comp);
$j=6;
for($i=0;$i<sizeof($comp);$i++) {
   // echo $comp[$i]['pe_name'] ;
    $j=$j+1;
    $no=$i+1;
    $spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('A'.$j,$no )
        ->setCellValue('B'.$j, $comp[$i]['pe_name'])
        ->setCellValue('C'.$j, '')
        ->setCellValue('D'.$j, $comp[$i]['l1_id'])
        ->setCellValue('E'.$j, $comp[$i]['l2_id'])
        ->setCellValue('F'.$j, $comp[$i]['l3_id'])
        ->setCellValue('G'.$j, $comp[$i]['cd_id'])
        ->setCellValue('H'.$j, $comp[$i]['phase'])
        ->setCellValue('I'.$j, $comp[$i]['fd_no'])
        ->setCellValue('J'.$j, $comp[$i]['site_eqp'])
        ->setCellValue('K'.$j, $comp[$i]['install_id'])
        ->setCellValue('L'.$j, $comp[$i]['location'])
        ->setCellValue('M'.$j, $comp[$i]['pic'])
        ->setCellValue('N'.$j, '')
        ->setCellValue('O'.$j, '')
        ->setCellValue('P'.$j, '')
        ->setCellValue('Q'.$j, '')
        ->setCellValue('R'.$j, (sizeof($comp))*100/10000)
        ->setCellValue('S'.$j, '10000')
        ->setCellValue('T'.$j,  date("l jS \of F Y h:i:s A"))
        ->setCellValue('U'.$j, $comp[$i]['gid']);
}
//$spreadsheet->getStyle('A6:C6')->getFill()
    //->setFillType(\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID)
  //  ->getStartColor()->setARGB('FFA0A0A0');
//NO.																			
//$spreadsheet->setActiveSheetIndex(0)
//    ->setCellValue('B'.$j+2, "SO Total Customer")
//    ->setCellValue('B'.$j+3, "Total Customer Submited")
//    ->setCellValue('B'.$j+4, "Total Customer")
//    ->setCellValue('B'.$j+5, "% Completed")
//    ->setCellValue('B'.$j+7, "Preapred By")
//    ->setCellValue('B'.$j+8, "Date")
//    ->setCellValue('B'.$j+11, "Accepted By")
//    ->setCellValue('B'.$j+11, "Date");
// Rename worksheet
//$helper->log('Rename worksheet');
$spreadsheet->getActiveSheet()
    ->setTitle('report');
$name='report'.rand();
$writer = new Xlsx($spreadsheet);	
$writer->save($name.'.xlsx');
echo $name;
// Save
//$helper->write($spreadsheet, __FILE__, ['Xlsx', 'Xls', 'Ods']);