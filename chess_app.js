angular.module('chessApp', []).controller('chessAppController', 
	function($scope,$http) {
		$scope.isWhiteTurn = true;
		$scope.moves = new Array();
		$scope.setTurn = function(color)
		{
			if(color=='white')
			{
				$("[color='black']").attr("draggable", "false");
				$("[color='white']").attr("draggable", "true");
				$scope.isWhiteTurn = true;
				console.log("It's now white's turn");
			}
			else if (color=='black')
			{
				$("[color='white']").attr("draggable", "false");
				$("[color='black']").attr("draggable", "true");
				$scope.isWhiteTurn = false;
				console.log("It's now black's turn");
			}
		}
		$scope.drop = function(ev,square)
		{
			ev.preventDefault();
		    var data = ev.dataTransfer.getData("text");
		    var piece = document.getElementById(data);
		    var move = piece.parentElement.id + "" + square.id;
		    var captured = square.children[0];
		    if(captured != null)
		    	square.removeChild(captured);
			$scope.push_move(move,piece,captured);
			square.appendChild(piece);
			if($scope.isWhiteTurn)
				$scope.setTurn('black');
			else
				$scope.setTurn('white');
		};
		$scope.undo = function()
		{
			if($scope.moves.length > 0)
			{
				var lastMove = $scope.moves.pop();
				var from = lastMove.notation.substring(0,2);
				var to = lastMove.notation.substring(2,4);
				document.getElementById(from).appendChild(lastMove.moved);
				if(lastMove.captured != null)
					document.getElementById(to).appendChild(lastMove.captured);
				if($scope.isWhiteTurn)
					$scope.setTurn('black');
				else
					$scope.setTurn('white');
				console.log($scope.moves);
			}
		};
		$scope.isEven = function(n)
		{
			return (n%2)==0;
		};
		$scope.isLastCol = function(n)
		{
			return (n%8)==0;
		};
		$scope.push_move = function(notation,moved,captured)
		{
			var move = {notation:notation, moved:moved, captured:captured};
			$scope.moves.push(move);
			console.log($scope.moves);
			$scope.isWhiteTurn
		};
		$scope.toLetter = function(n)
		{
			if(n == 1)
				return 'a';
			else if(n == 2)
				return 'b';
			else if(n == 3)
				return 'c';
			else if(n == 4)
				return 'd';
			else if(n == 5)
				return 'e';
			else if(n == 6)
				return 'f';
			else if(n == 7)
				return 'g';
			else
				return 'h';
		};
		$scope.hasPiece = function(event)
		{
			var square = event.target;
			console.log(square);
			console.log(square.childNodes);
			for(var i = 0; i < square.childNodes.length; i++)
				if(square.childNodes[i].tagName=='IMG')
					return i;
			console.log('no piece');
			event.stopPropagation();
			return -1;
		}
		$scope.makeHTTPCall = function()
		{
			$http.post('sftp://emsimon@elnux1.cs.umass.edu/nfs/elsrv4/users1/grad/emsimon/echoserver.py', 'TESTING');
		};
	}
);