angular.module('chessApp', []).controller('chessAppController', 
	function($scope,$http) {
		$scope.moves = new Array();
		$scope.isWhiteTurn;
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
		$scope.undo = function()
		{
			if($scope.moves.length > 0)
			{
				var lastMove = $scope.moves.pop();
				document.getElementById(lastMove.from).appendChild(lastMove.moved);
				if(lastMove.captured != null)
					document.getElementById(lastMove.to).appendChild(lastMove.captured);
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
		$scope.push_move = function(moved,captured,notation,to,from)
		{
			var move = {notation:notation, moved:moved, captured:captured, to:to, from:from};
			$scope.moves.push(move);
			$scope.$apply();
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
			//$http.post('sftp://emsimon@elnux1.cs.umass.edu/nfs/elsrv4/users1/grad/emsimon/echoserver.py', 'TESTING');
			$.ajax({
			  type: "GET",
			  url: "http://emsimon@elnux1.cs.umass.edu/nfs/elsrv4/users1/grad/emsimon/public_html/ChessEngineWebsite/echoserver.py",
			  data: {param: 'TESTING'}
			}).done(function(result) {
			   console.log(result);
			});
		};

		//takes the piece and the square and forms the correct chess notation for the move
		$scope.toNotation = function(piece,to,from,captured)
		{
			var result = "";
			var pieceName = piece.id.substring(0,piece.id.indexOf("-"));
			if(pieceName == "bishop")
				result += "B";
			else if(pieceName == "knight")
				result += "N";
			else if(pieceName == "rook")
				result += "R";
			else if(pieceName == "queen")
				result += "Q";
			else if(pieceName == "king")
				result += "K";

			if(captured !== undefined && captured != null)
			{
				if(pieceName == "pawn")
				{
					result += from.substring(0,1);
				}
				result += "x"
			}

			result += to;

			return result;
		};

		$scope.displayTurn = function(index)
		{
			if(index % 2 == 0)
				return ((index/2)+1)+". ";
			else
				return "";
		};

		$scope.handleDrop = function(ev,square)
		{
		    var piece = document.getElementById(ev.dataTransfer.getData("text"));
		    var captured = square.children[0];
		    var to = square.id;
		    var from = piece.parentElement.id;
		    if(to != from)
		    {
			    var notation = $scope.toNotation(piece,to,from,captured);
			    if(captured != null)
			    	square.removeChild(captured);
				$scope.push_move(piece,captured,notation,to,from);
				square.appendChild(piece);
				if($scope.isWhiteTurn)
					$scope.setTurn('black');
				else
					$scope.setTurn('white');
			}
		};

		$scope.setTurn('white');
	}
).directive('moveable', 
	function($document){
  		return function(scope, element, attr){
	    	var startX = 0, startY = 0, x = 0, y = 0;
	    	element.css({
			    position: 'relative',
			   	cursor: 'pointer',
			   	display: 'block'
		    });
		    element.on('dragstart', function(event){
		  		event.dataTransfer.effectAllowed = 'move';
				event.dataTransfer.setData("text", event.target.id);
		    });
		};
	}
).directive('droppable',
	function($document){
		return function(scope,element,attr){
			element.on('dragover',function(event)
			{
				if(event.preventDefault)
					event.preventDefault();
			});
			element.on('drop', function(event){
				scope.handleDrop(event,this);
		    });
		}
	}
);