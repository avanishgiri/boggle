
// function Board() {} // responsible for which dice are where

// function Game() {   // responsible for game rules
//   //this.renderer = new DOMRenderer();
//   this.renderer = new ConsoleRenderer();
//   this.validNextClicks = [];
//   this.clickedDice = [];
// }
// Game.prototype = {
//   onClick: function(position) { // position == the die # that was clicked
//     // figure out how to display neighbors
//     // ignore clicks from non-neighbors
//   }
// }

// function DOMRenderer() {}  // responsible for rendering table cells
// function ConsoleRenderer() {}  // responsible for rendering in console using text
//------------------------------------------------

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
['H','I','M','N','U','QU'],
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
var currentIndex = [];
var neighbors;

function renderBoard(board){
  $('.clicked').each(function(){
    $(this).off("click");
    bindFirstClick($(this),$('.square').toArray().indexOf($(this).get(0)));
  });
  $('.square').each(function(i){
    $(this).html(board.letters[i]);
    $(this).removeClass("clicked");
    $(this).removeClass("neighbor");
    $('#answer').val("");
  });
  currentEntry = [];
  currentIndex = [];
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
      $(neighbors[currentIndex[currentIndex.length-1]]).removeClass("neighbor");
      currentIndex = currentIndex.slice(0,currentIndex.length-1);
      $(neighbors[currentIndex[currentIndex.length-1]]).addClass("neighbor");
      $('#answer').val(getText(currentEntry));
      $square.removeClass("clicked");
      bindFirstClick($square,$('.square').toArray().indexOf($square.get(0)));
    }
    else
      bindSecondClick($square);
  });
}

function inCurrentNeighbors($square, index){
  if(currentEntry.length === 0)
  {
    return neighbors[index];
  }
  for(var i = 0; i < neighbors[index].length; i++){
    if(neighbors[index][i] == currentEntry[currentEntry.length-1]){
      return neighbors[index];
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
    var neighbs;
    if(neighbs = inCurrentNeighbors($square,index)){
      $(neighbors[currentIndex[currentIndex.length-1]]).removeClass("neighbor");
      $(neighbs).each(function(){
        if(! $(this).attr('class').match(/clicked/) )
          $(this).addClass("neighbor");
      });
      $square.addClass("clicked");
      currentEntry.push($square.get(0));
      currentIndex.push(index);
      $('#answer').val(getText(currentEntry));
      bindSecondClick($square);
    }
    else{
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

  $('#clear').click(function(){
    renderBoard(board);
  });

  $('#send_word').on("click", function(){
    console.log('helltere');
    $.ajax({
      url: '/check_word',
      type: 'get',
      dataType: 'json',
      data: "word=" + $('#answer').val()
    }).done(function(response){
      console.log(response);
      if(response.correct)
      {
        renderBoard(board);
      };
    });
  });

  $('input').on("keyup",function(){

  });

  var interval = setInterval(function() {
    var timer = $('.timer').html();
    timer = timer.split(':');
    var minutes = parseInt(timer[0], 10);
    var seconds = parseInt(timer[1], 10);
    seconds -= 1;
    if (minutes < 0) return clearInterval(interval);
    if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
    if (seconds < 0 && minutes != 0) {
        minutes -= 1;
        seconds = 59;
    }
    else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
    $('.timer').html(minutes + ':' + seconds);
    
    if (minutes == 0 && seconds == 0)
    {
        $('#end-game').show();
        clearInterval(interval);
    }
  }, 1000);

});
