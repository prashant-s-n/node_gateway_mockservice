<?php
	// header("Content-Type:application/json");
	ini_set("display_errors", false);
	$username = $_REQUEST['username'];
	$password = $_REQUEST['password'];
	$statusCode = 200;

	$credentials = [];
	$credentials['username'] = 'admin';
	$credentials['password'] = '1234';

	if($username == "" || gettype($username) == 'undefined' || $username == null){
		$statusCode = 500;
		$returnArray = array(
			"status" => 500,
			"message" => "Please enter username"
		);
	}
	elseif($password == "" || gettype($password) == 'undefined' || $password == null){
		$statusCode = 500;
		$returnArray = array(
			"status" => 500,
			"message" => "Please enter password"
		);
	} else {
		if($username == $credentials['username'] && $password == $credentials['password']){
			$returnArray = array(
				"status" => 200,
				"message" => "Authenticated"
			);
		} else {
			$statusCode = 500;
			$returnArray = array(
				"status" => 500,
				"message" => "Invalid credentials"
			);
		}
	}

	header("Content-Type:application/json");
	http_response_code($statusCode);
	echo json_encode($returnArray);