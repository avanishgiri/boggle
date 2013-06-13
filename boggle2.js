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

Array.prototype.each_slice = function(spacing)
{
    var output = [];
    for (var i = 0; i < this.length; i += spacing)
        output[output.length] = this.slice(i, i + spacing);
    return output;
};

OFFSETS = [
[-1,-1], [-1,0], [-1,1], [0,1], [1,1], [1,0], [1,-1], [0,-1]
];

function BoggleBoard(){
  this.setNeighbors = function(){
    var partitionedLetters = this.letters.each_slice(4);
    this.neighbors = [];
    for(var i = 0; i < 4; i++)
    {
      for(var j = 0; j < 4; j++)
      {
          var neighborsAtIndex = [];
          for(var k = 0; k < 8; k++)
          {
            var xIndex = i + OFFSETS[k][0];
            var yIndex = j + OFFSETS[k][1];
            if(partitionedLetters[xIndex] && partitionedLetters[xIndex][yIndex])
              neighborsAtIndex.push(partitionedLetters[xIndex][yIndex]);
          }
      this.neighbors[(i * 4) + j] = neighborsAtIndex;
      }
    }
  };

  this.shake = function(){
    var letters = [];
    DICE.shuffle().forEach(function(die){
      letters.push(die[Math.floor(Math.random()*6)]);
    });
    this.letters = letters;
    neighbors = setNeighbors();
    return this;
  };
}

var currentEntry = [];
var neighbors;

function renderBoard(board){
  $('.clicked').each(function(){
    $(this).off("click");
    bindFirstClick($(this),$('.square').toArray().indexOf($(this).get(0)));
  });
  $('.square').each(function(i){
    $(this).html(board.letters[i]);
    $(this).removeClass("clicked");
    $('#answer').text("");
  });
  currentEntry = [];
}


function setNeighbors($square, index){
    var rows = $('.square').toArray().each_slice(4);
    var neighbors = [];
    for(var i = 0; i < 4; i++)
    {
      for(var j = 0; j < 4; j++)
      {
          var neighborsAtIndex = [];
          for(var k = 0; k < 8; k++)
          {
            var xIndex = i + OFFSETS[k][0];
            var yIndex = j + OFFSETS[k][1];
            if(rows[xIndex] && rows[xIndex][yIndex])
              neighborsAtIndex.push(rows[xIndex][yIndex]);
          }
      neighbors[(i * 4) + j] = neighborsAtIndex;
      }
    }
    return neighbors;
}

function bindSecondClick($square){
  $square.one("click", function(){
    if(currentEntry[currentEntry.length - 1] == $square.get(0)){
      currentEntry = currentEntry.slice(0,currentEntry.length-1);
      $('#answer').html(getText(currentEntry));
      $square.removeClass("clicked");
      bindFirstClick($square,$('.square').toArray().indexOf($square.get(0)));
    }
    else
      bindSecondClick($square);
  });
}

function inCurrentNeighbors($square, index){
  if(currentEntry.length === 0)
    return true;

  console.log(index);
  console.log($square);

  for(var i = 0; i < neighbors[index].length; i++){
    console.log("neighbors",$(neighbors[index][i]));
    if(neighbors[index][i] == currentEntry[currentEntry.length-1]){
      console.log("True");
      return true;
    }
  }
  return false;
}

function getText(currentEntry){
    var string = "";
    currentEntry.forEach(function(sqr){
      string += $(sqr).text();
    });
    return string;
}

function bindFirstClick($square, index){
  $square.one("click", function(){
    if(inCurrentNeighbors($square,index)){
      $square.addClass("clicked");
      currentEntry.push($square.get(0));
      $('#answer').html(getText(currentEntry));
      bindSecondClick($square);
    }
    else{
      console.log(index);
      bindFirstClick($square,index);
    }
  });
}

$(document).ready(function(){
  var board = new BoggleBoard().shake();
  renderBoard(board);
  $('#shake').click(function(){
    renderBoard(board.shake());
  });

  $('.square').each(function(i){
    bindFirstClick($(this), i);
  });
});
