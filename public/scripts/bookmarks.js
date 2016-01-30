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

  $('#folderCard').attr('key', folderId ).find('span').text($(this).text());

  $.get("api/item/getall", {folderid : folderId})
  .done(function( items ) {
    $("#itemList").empty();
    //add each item to list
    for (var i = 0; i < items.length; i++) {
      AddItemToItemList($('#itemList'),items[i].name, items[i].value, items[i]._id);
    }
  }).fail(function() {
    alert( "error" );
  });

}

function HandleAddFolder(){
  $('#addFolderModal').openModal();

  //automatically focus to input
  $('#AddFolder_folderName').focus();
}

function HandleAddItem(){
  //adding folderlist to option set

  var folderList = $('#folderList .collection-item');

  var select = $('#addItem_folderSelect');
  select.empty();
  for (var i = 0; i < folderList.length; i++) {
    select.append(
      $('<option>').val($(folderList[i]).attr('key')).html($(folderList[i]).children('span').text())
    );
  }

  //set default selected folder
  select.val($('#folderList .active').attr('key'));

  select.material_select();
  $('#addItemModal').openModal();

  //automatically focus to input
  $('#addItem_name').focus();
}

function SubmitAItem(){
  var folderId = $('#addItem_folderSelect').val();
  var itemName =$ ('#addItem_name').val();
  var itemContent = $('#addItem_content').val();

  if (folderId === null || folderId === "" || itemName === null || itemName === "" || itemContent === null || itemContent === "") {
    return;
  }

  // Send the data using post
  var posting = $.post( "api/item/add", { itemname: itemName, itemvalue: itemContent, folderid: folderId } );

  // Put the results in a div
  posting.done(function( data ) {
    //clearing data
    $('#addItem_folderSelect').val('');
    $('#addItem_name').val('');
    $('#addItem_content').val('');

    if (folderId === $('#folderList .active').attr('key')) {
      AddItemToItemList($('#itemList'),itemName, itemContent, data);
    }
    OnFolderClick.apply($('#folderList li[key="'+ folderId +'"]'));
  });

  posting.fail(function(error){
    alert("Error occurred while adding item to server.");
  });

  posting.always(function(){
    $('#addItemModal').closeModal();
  });
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
    AddFolderToFolderList(data,folderName,true);

    $('#AddFolder_folderName').val('');
    $('#addFolderModal').closeModal();
    // $('#fixed_addbutton').toggleClass('active');
  });

  posting.fail(function(error){
    alert("Error occurred while adding folder to server.");
  });
}

function DeleteFolder(){
  var folderId = $(this).closest('#folderCard').attr('key');

  var deleteConfirmation = DeleteConfirmation("folder", folderId);
}

function DeleteFolderById (folderId) {
  $.get("api/folder/delete", {folder_id : folderId})
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

function DeleteItemAfterConfirmation(){
  var type = $('#confirmationOfDelete').attr('type');
  var itemId = $('#confirmationOfDelete').attr('key');

  if (type === "folder") {
    DeleteFolderById(itemId);
  }else if (type === "item") {
    DeleteItemById(itemId);
  }
}

function DeleteItemById(itemId){
  $.get("api/item/delete", {itemid : itemId})
  .done(function() {
    var item = $('li[key="'+ itemId +'"]');
    item.remove();
  }).fail(function() {
    alert( "error" );
  });
}

function DeleteItem(e){
  //to prevent other click action.
  e.stopImmediatePropagation();
  var item = $(this).closest('li');
  var itemId = item.attr('key');

  var deleteConfirmation = DeleteConfirmation("item", itemId);

  // $.get("api/item/delete", {itemid : itemId})
  // .done(function() {
  //   item.remove();
  // }).fail(function() {
  //   alert( "error" );
  // });
}

function DeleteConfirmation(itemOrFolder, key){
  var confirmationOfDelete = $('#confirmationOfDelete');

  confirmationOfDelete.attr("type", itemOrFolder);
  confirmationOfDelete.attr("key", key);

  confirmationOfDelete.openModal();
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

function AddItemToItemList($ItemList, itemName, itemContent, itemId){
  // <li>
  //    <div class="collapsible-header"><i class="material-icons">bookmark border</i>
  //      First
  //      <a class="secondary-content deleteFolder"><i class="material-icons">delete</i></a>
  //    </div>
  //   <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  // </li>

  $ItemList.append(
    $('<li>').attr('key',itemId).append(
      $('<div>').addClass('collapsible-header').append(itemName).append(
        $('<a>').addClass('secondary-content deleteItem').append(
          $('<i>').addClass('material-icons').text('delete')
        ).bind('click',DeleteItem )
      )
    ).append(
      $('<div>').addClass('collapsible-body').append(
        $('<p>').text(itemContent)
      )
    )
  );
}
