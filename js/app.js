var mainModule = angular.module( "MyTodo", []);

mainModule.factory( 'myStorage', function(){
	var _idCounter = 0;
	var _listData = [];

	return {
		GetAllData : GetAllData,
		AddData: AddData,
		UpdateData: UpdateData,
		DeleteData: DeleteData
	};

	function GetAllData(){
		return JSON.parse(JSON.stringify(_listData)); // return deep copy of object, just figure that all data get from real service
	}

	function AddData(data){
		data.id = _idCounter++;
		_listData.push(data);
	}

	function UpdateData(data){
		for(var i=0; i<_listData.length; i++){
			if(_listData[i].id == data.id){
				_listData[i] = data;
			}
		}
	}

	function DeleteData(data){
		for(var i=0; i<_listData.length; i++){
			if(_listData[i].id == data.id){
				_listData.splice(i, 1);
			}
		}
	}
} );

mainModule.controller( 'myController', function ( $scope, myStorage ){
	var _myStorage = myStorage;
	
	$scope.ListData = [];
	$scope.CurrentData = {};

	$scope.IsEdit = false;

	$scope.SaveCommand = SaveCommand;
	$scope.EditCommand = EditCommand;
	$scope.CancelEditCommand = CancelEditCommand;
	$scope.DeleteCommand = DeleteCommand;

	Initialization();

	function Initialization(){
		Refresh();
	}

	function Refresh(){
		LoadData();
		$scope.CurrentData = { name : '', done : false };
		$scope.IsEdit = false;
	}

	function LoadData(){
		$scope.ListData = _myStorage.GetAllData();
	}

	function SaveCommand(){
		if( !$scope.IsEdit )
			_myStorage.AddData( $scope.CurrentData );
		else
			_myStorage.UpdateData( $scope.CurrentData );
		Refresh();
	}

	function EditCommand(data){
		$scope.IsEdit = true;
		$scope.CurrentData = JSON.parse(JSON.stringify( data ));
	}

	function CancelEditCommand(){
		Refresh();
	}

	function DeleteCommand(data){
		_myStorage.DeleteData(data);
		Refresh();
	}
} );