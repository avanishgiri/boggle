DICE = [
"AAEEGN",
"ELRTTY",
"AOOTTW",
"ABBJOO",
"EHRTVW",
"CIMOTU",
"DISTTY",
"EIOSST",
"DELRVY",
"ACHOPS",
['H','I','M','N','U','Qu'],
"EEINSU",
"EEGHNW",
"AFFKPS",
"HLNNRZ",
"DEILRX"
];

Array.prototype.shuffle = function(){
  for(var i = this.length-1; i >= 0; i--){
    var randDieIndex = Math.floor(Math.random()*i);
    this.push(this[randDieIndex]);
    this.splice(randDieIndex,1);
  }
  return this;
}

OFFSETS = [
[-1,-1], [-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0,-1]
];

function Die(letters){
  this.letters = letters;
  this.showing = "";
  this.roll = function(){
    this.showing = this.letters[Math.floor(Math.random()*6)];
    return this;
  }
  this.checked = false;
}

function BoggleBoard(){
  this.dice = [];
  this.initializeDice = function(){
    for(var i = 0; i < 16; i++)
      this.dice.push(new Die(DICE[i]));
  }

  this.initializeDice();
  this.rows = [ [], [], [], [] ];

  this.shake = function(){
    this.dice.shuffle();
    for(var i = 0; i<4; i++)
      for(var j = 0; j<4; j++)
        this.rows[i][j] = this.dice[i*4 + j].roll();

      this.setLetters();
      this.neighbors = this.findNeighbors();
    };

    this.setLetters = function(){
      this.letters = [];
      for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
          this.letters.push(this.rows[i][j].showing);
    };

    this.printBoard = function(){
      this.letters.forEach(function(letter){
        console.log(letter,' ');
      });
    };

    this.findNeighbors = function(){
      var neighbors = function(){
        var array = [];
        for(var i = 0; i < 16; i++)
          array.push([]);
        return array;
      }();

      for(var i = 0; i < 4; i++)
        for(var j = 0; j < 4; j++)
          for(var k = 0; k < 8; k++){
            var xIndex = i+OFFSETS[k][0];
            var yIndex = j+OFFSETS[k][1];
            if(this.rows[xIndex] && this.rows[xIndex][yIndex]){
              var neighborDie = this.rows[xIndex][yIndex];
              if(neighborDie)
                neighbors[i*4 + j].push(neighborDie);
            }
          }
      return neighbors;
    };
  }

  var board = new BoggleBoard(DICE);

  board.shake();

  function renderBoard(){
    $('.square').each(function(i){$(this).attr('id',i);});
    board.letters.forEach(function(letter,i){
      $('#'+i).html(letter);
    });
    $('#answer').text("");
  }

  $(document).ready(function(){
    renderBoard();
    $('.container').on("click", "button", function(){
      board.shake();
      renderBoard();
    });
    $('.square').each(function(){
      bindClicks($(this));
    });
  });

  var currentDieIndex;

  function bindClicks($square){
    $square.one("click",function(){
      console.log("current die index",currentDieIndex);
      var selectedDieIndex = $square.attr('id');
      var neighbors = board.neighbors[currentDieIndex];
      var die = [].concat.apply([],board.rows)[selectedDieIndex];
      if(currentDieIndex === undefined){
        currentDieIndex = selectedDieIndex;
        $("#answer").append($(this).text());
        $square.one("click",function(){
          var text = $('#answer').text().replace($square.text(),"");
          $('#answer').text(text);
          currentDieIndex = undefined;
          bindClicks($square);
        });
      }
      else{
        console.log(neighbors);
        console.log('die',die);
        console.log(neighbors.indexOf(die));
        if(neighbors.indexOf(die) != -1){
          board.currentSelection = die;
          $("#answer").append($(this).text());
          $square.one("click",function(){
            var text = $('#answer').text().replace($square.text(),"");
            $('#answer').text(text);
            bindClicks($square);
          });
        }
      }
    });
  }
