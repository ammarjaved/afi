<?php
include '../connection.php';
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
$output = array();
$output2 = array();
$output3 = array();



//$sql1="select gid,l1_id,l2_id,l3_id from demand_point where  gid in (select gid::integer from afi_submission_14july where l3_id<>'')";	

$sql1="select l2_id,l3_id from sfp_mfp_fno where l3_id<>''";


echo $sql1."<br/>";
$query1=pg_query($sql1);

$spreadsheet = new Spreadsheet();

$spreadsheet->setActiveSheetIndex(0)
    ->setCellValue('A1', 'gid')
    ->setCellValue('B1', 'pe_name')
    ->setCellValue('C1', 'fp')
    ->setCellValue('D1', "sfp")
	 ->setCellValue('E1', "mfp")
    ->setCellValue('F1', "fd_no_sfp");
   


if($query1)
{
    $output = pg_fetch_all($query1);
}
$i=1;
$j=0;
foreach ($output as $value) {
	$sfp=$value['l3_id'];
    $fp=$value['l2_id'];
//  echo $fp;
//    exit();
	
	$sql2="select * from sfp_l2 where l2_id='$fp'";
	echo $sql2;

$query2=pg_query($sql2);
if($query2)
{
    $output2 = pg_fetch_all($query2);
}
   $fd_no='';
   $pe_name='';
	foreach ($output2 as $value1) {		
	$pe_name=$value1['pe_name'];
	if (strpos($value1['lvf1_fd'], ':')!==false) {
      $fno=explode(":",$value1['lvf1_fd']);
	 // print_r($fno);
	  if($fno[1]==$sfp){
		  $fd_no='1';
	  }
	  
	}
	if (strpos($value1['lvf2_fd'], ':')!==false) {
      $fno=explode(":",$value1['lvf2_fd']);
	  if($fno[1]==$sfp){
		  $fd_no=$fd_no.','.'2';
	  }
	}
	  if (strpos($value1['lvf3_fd'], ':')!==false) {
      $fno=explode(":",$value1['lvf3_fd']);
	  if($fno[1]==$sfp){
		  $fd_no=$fd_no.','.'3';
	  }
	  }
	  if (strpos($value1['lvf4_fd'], ':')!==false) {
      $fno=explode(":",$value1['lvf4_fd']);
	  if($fno[1]==$sfp){
		  $fd_no=$fd_no.','.'4';
	  }
	  }
	  if (strpos($value1['lvf5_fd'], ':')!==false) {
      $fno=explode(":",$value1['lvf5_fd']);
	  if($fno[1]==$sfp){
		  $fd_no=$fd_no.','.'5';
	  }
	  }
	  if (strpos($value1['lvf6_fd'], ':')!==false) {
      $fno=explode(":",$value1['lvf6_fd']);
	  if($fno[1]==$sfp){
		  $fd_no=$fd_no.','.'6';
	  }
	  }

        if (strpos($value1['lvf7_fd'], ':')!==false) {
            $fno=explode(":",$value1['lvf7_fd']);
            if($fno[1]==$sfp){
                $fd_no=$fd_no.','.'7';
            }
        }

        if (strpos($value1['lvf8_fd'], ':')!==false) {
            $fno=explode(":",$value1['lvf8_fd']);
            if($fno[1]==$sfp){
                $fd_no=$fd_no.','.'8';
            }
        }

        if (strpos($value1['lvf9_fd'], ':')!==false) {
            $fno=explode(":",$value1['lvf9_fd']);
            if($fno[1]==$sfp){
                $fd_no=$fd_no.','.'9';
            }
        }


        if (strpos($value1['lvf10_fd'], ':')!==false) {
            $fno=explode(":",$value1['lvf10_fd']);
            if($fno[1]==$sfp){
                $fd_no=$fd_no.','.'10';
            }
        }

	  
	}
	//  }
     $obj= new stdClass();
   //  $obj->gid= $value['gid'];
     $obj->pe_name= $pe_name;	
	// $obj->fp= $value['l1_id'];
	 $obj->sfp= $value['l2_id'];
     $obj->mfp= $value['l3_id'];
	 $obj->fp_fd_no= $fd_no;
	 $j=$j+1;
    $spreadsheet->setActiveSheetIndex(0)
       // ->setCellValue('A'.$j,$value['gid'] )
        ->setCellValue('B'.$j, $pe_name)
       // ->setCellValue('C'.$j, $value['l1_id'])
        ->setCellValue('D'.$j,  $value['l2_id'])
		->setCellValue('E'.$j,  $value['l3_id'])
        ->setCellValue('F'.$j, $fd_no);
        
   //  var_dump($obj);
     array_push( $output3,$obj);	 
	
  //echo $i."-".$value['gid']."-".$pe_name."-".$value['l1_id']."-".$value['l2_id']."-".$fd_no."<br />"; 
  //$i=$i+1;
 }
 $spreadsheet->getActiveSheet()
    ->setTitle('report');
//print_r( $spreadsheet);
$name='report'.rand();
$writer = new Xlsx($spreadsheet);	
$writer->save($name.'.xlsx');
//echo $name;
//echo  json_encode($output3);

?>