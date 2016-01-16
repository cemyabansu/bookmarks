$(document).ready(function(){
  $(".button-collapse").sideNav();

  $(".deleteFolder").bind('click', DeleteFolder);
  //loading folders
  LoadFolders();
});

var defaultUserId = "5684660045cf80ea12073983";

function LoadFolders(){
  $.get("api/folder/getall", {userid : defaultUserId})
  .done(function( folders ) {
    //add each folder to list
    for (var i = 0; i < folders.length; i++) {
      AddFolderToFolderList(folders[i]._id,folders[i].name, false);
    }
    //select first folder
    OnFolderClick.apply($('#folderList li')[1]);
  }).fail(function() {
    alert( "error" );
  });
}

function OnFolderClick(){
  $('#folderList .active').removeClass('active');
  $(this).addClass('active');

  var folderId = $(this).attr('key');

  $('#folderCard').attr('key', folderId ).children('span').text($(this).text());
}

function HandleAddFolder(){
  $('#modal1').openModal();
}

function HandleAddItem(){
  $('#modal1').openModal();
}

function SubmitAFolder(){
  var folderName = $('#AddFolder_folderName').val();

  if (folderName == null || folderName == "") {
    return;
  }

  // Send the data using post
  var posting = $.post( "api/folder/add", { foldername: folderName, userid: defaultUserId } );

  // Put the results in a div
  posting.done(function( data ) {
    var content = $( data ).find( "#content" );
    $( "#result" ).empty().append( content );

    AddFolderToFolderList(data,folderName,true);

    $('#AddFolder_folderName').val('');
    $('#modal1').closeModal();
    // $('#fixed_addbutton').toggleClass('active');
  });

  posting.fail(function(error){
    alert("Error occurred while adding folder to server.");
  });
}

function DeleteFolder(){

  var folderId = $(this).parent().attr('key');

  $.get("api/folder/delete", {folderid : folderId})
  .done(function() {
    var willBeDeleted = $('#folderList li[key="'+ folderId +'"]');
    var indexWillBeDeleted = $('#folderList .collection-item').index( willBeDeleted) ;
    //simulate folder click

    var newSelectedFolder;
    if ($( '#folderList .collection-item' )[indexWillBeDeleted + 1 ] !== undefined) {
      newSelectedFolder =  $( '#folderList .collection-item' )[indexWillBeDeleted + 1 ]
    }
    else {
      newSelectedFolder = $( '#folderList .collection-item' )[indexWillBeDeleted -1 ]
    }

    OnFolderClick.apply(newSelectedFolder);
    //remove the item
    willBeDeleted.remove();
  }).fail(function() {
    alert( "error" );
  });
}

function AddFolderToFolderList(folderid, name, setActivate){
  var folderList = $('#folderList');
  folderList.append(
    $('<li>').attr('class','collection-item').attr('key',folderid).append(
      $('<span>').append(name)
    ).bind('click', OnFolderClick)
  );
  if (setActivate) {
    //simulate folder click
    OnFolderClick.apply($('#folderList li:last-child'));
  }
}
