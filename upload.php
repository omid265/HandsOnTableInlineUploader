<?php

/*!
 * simple json response
 * @param  integer $code    HTTP Status Code
 * @param  mixed   $message The message to send
 * @return string           JSON encoded string
 */
function json_response($code = 200, $message = null,$fileSize,$fileName)
{
    // clear the old headers
    header_remove();
    // set the header to make sure cache is forced
    header("Cache-Control: no-transform,public,max-age=300,s-maxage=900");
    // treat this as json
    header('Content-Type: application/json');
    $status = array(
        200 => '200 OK',
        400 => '400 Bad Request',
        500 => '500 Internal Server Error'
        );
    // ok, validation error, or failure
    header('Status: '.$status[$code]);
    // return the encoded json
    $date = new DateTime();
    $ds=$date->getTimestamp();

    // return json_encode(array(
    // 'Id' => $ds, // success or not?
    // 'iconUrl' => "http://siteurl/IconFileName.fileType", // success or not?
    // 'FileName' => $fileName, // success or not?
    // 'FileSize' => $fileSize, // success or not?
    // 'FileURL' => "http://siteurl/FileName.fileType", // success or not?
    // 'FileStatus' => "File Status", // success or not?
    // 'UploadStatus' => $code < 300, // success or not?
    // 'Message' => $message,
    // 'DisciplineTitle' => $message
    // ));
    $fType=$_REQUEST['ftype'];
    
    return json_encode('{"Id":"'.$ds.'","FileName":"'.$fileName.'","FileSize":"'.$fileSize.'","iconUrl":"icgen.gif","FileURL":"/sites/v2/Document/Air Cooled Heat Exchanger(DEL TEST)/Entity/vendor 1/chrome.exe-7390.sig","DisciplineId":null,"result":"success","message":null,"ftype":"'.$fType.'"}');

}

// this function is very simple
// it just uploads a single file with a timestamp prepended
$target_dir = "uploads/";
if(!file_exists($target_dir)){
    mkdir($target_dir);
}

$target_file = $target_dir . time() . basename($_FILES["file"]["name"]);
if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
    $fileSize=(($_FILES["file"]['size'])/1024);
    $fileName=$_FILES["file"]["name"];
    sleep(2);
    echo json_response(200, "The file ". basename( $_FILES["file"]["name"]). " has been uploaded.",$fileSize,$fileName);
} else {
    echo json_response(500, "Sorry, there was an error uploading your file.","");
}