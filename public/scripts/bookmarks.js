$(document).ready(function(){
  $(".button-collapse").sideNav();

  $("#folderList .collection-item").click(function() {
    alert( "Handler for .click() called." );
  });

  //loading folders
  LoadFolders();
});

function LoadFolders(){
  $.get("api/folder/getall", {userid : "5684660045cf80ea12073983"})
  .done(function( folders ) {
    //add each folder to list
    for (var i = 0; i < folders.length; i++) {
      var folderList = $('#folderList');

      folderList.append(
        $('<li>').attr('class','collection-item').append(
          $('<span>').append(folders[i].name)
        ).bind('click', OnFolderClick)
      );
    }
  }).fail(function() {
    alert( "error" );
  });
}

function OnFolderClick(){
  $('#folderList .active').removeClass('active');
  $(this).addClass('active');
}

function HandleAddFolder(){
  $('#modal1').openModal();
}

function HandleAddItem(){
  $('#modal1').openModal();
}

function SubmitAFolder(){
  var folderName = $('#AddFolder_folderName').val();

  var folderList = $('#folderList');

  folderList.append(
    $('<li>').attr('class','collection-item').append(
      $('<span>').append(folderName)
    ).bind('click', OnFolderClick)
  );

  $('#AddFolder_folderName').val('');

  $('#modal1').closeModal();
  $('#fixed_addbutton').toggleClass('active');
}
