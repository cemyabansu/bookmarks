$(document).ready(function(){
  $(".button-collapse").sideNav();

  $(".deleteFolder").bind('click', DeleteFolder);
  $(".editFolder").bind('click', EditFolder);

  //loading folders
  LoadFolders();
});

function preventClick(e){
  //e.stopImmediatePropagation();
}

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

function EditFolder(){
  var folderCard =  $(this).closest('#folderCard')
  var folderId = folderCard.attr('key');
  var folderName = folderCard.find('.card-title').text();


  $('#UpdateFolder_folderName').val(folderName);
  $('#updateFolderModal').attr('key', folderId);
  $('#updateFolderModal').openModal();

  //automatically focus to input
  $('#UpdateFolder_folderName').focus();
}

function UpdateAFolder(){
  var folderName = $('#UpdateFolder_folderName').val();
  var folderId = $('#updateFolderModal').attr('key');

  // Send the data using post
  var posting = $.post( "api/folder/update", { folderid: folderId, foldername: folderName } );

  // Put the results in a div
  posting.done(function( data ) {
    var folderCard =  $('#folderCard');
    folderCard.find('.card-title').text(folderName);
    $('#folderList li[key="'+ folderId +'"]').find('span').text(folderName);
  });

  posting.fail(function(error){
    alert("Error occurred while adding item to server.");
  });

  posting.always(function(){
    $('#updateFolderModal').closeModal();
  });
}

function EditItem(){
  //adding folderlist to option set
  var folderList = $('#folderList .collection-item');
  var select = $('#updateItem_folderSelect');
  select.empty();
  for (var i = 0; i < folderList.length; i++) {
    select.append(
      $('<option>').val($(folderList[i]).attr('key')).html($(folderList[i]).children('span').text())
    );
  }
  //set default selected folder
  select.val($('#folderList .active').attr('key'));
  select.material_select();

  var item = $(this).closest('.item');
  var itemId = item.attr('key');
  var itemName = item.find('.collapsible-header span').text();
  var itemContent = item.find('.collapsible-body p').text();

  $('#updateItemModal').openModal();
  $('#updateItemModal').attr('key', itemId);

  $('#updateItem_name').val(itemName);
  $('#updateItem_content').val(itemContent);

  //automatically focus to input
  $('#updateItem_content').focus();
}

function UpdateAItem(){
  var itemName = $('#updateItem_name').val();
  var itemContent = $('#updateItem_content').val();
  var itemId = $('#updateItemModal').attr('key');

  // Send the data using post
  var posting = $.post( "api/item/update", { itemid: itemId, itemname: itemName, itemncontent:itemContent } );

  // Put the results in a div
  posting.done(function( data ) {
    // TODO : update list
    var updatedItem = $('#itemList li[key="'+ itemId +'"]');
    updatedItem.find('.collapsible-header span').text(itemName);
    updatedItem.find('.collapsible-body p').text(itemContent).linkify();
  });

  posting.fail(function(error){
    alert("Error occurred while adding item to server.");
  });

  posting.always(function(){
    $('#updateItemModal').closeModal();
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

  //side the nav
  $(".button-collapse").sideNav('hide');
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
  var item = $(this).closest('.item');
  var itemId = item.attr('key');

  var deleteConfirmation = DeleteConfirmation("item", itemId);
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

  //adding mobile nav
  var folderListMobile = $('#folderListMobile');
  folderListMobile.append(
    $('<li>').attr('key',folderid).append(
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
  //    <div class="collapsible-header"><i class="material-icons">bookmark_border</i>
  //      <p>First</p>
  //      <a class="secondary-content dropdown-button optionList" data-beloworigin="true" data-activates='itemOptions'><i class="material-icons">keyboard_arrow_down</i></a>
  //      <!-- Dropdown Option -->
  //      <ul id='itemOptions' class='dropdown-content'>
  //        <li><a class="editItem">Edit</a></li>
  //        <li class="divider"></li>
  //        <li><a class="deleteItem">Delete</a></li>
  //      </ul>
  //    </div>
  //    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  // </li>

  $ItemList.append(
    $('<li>').addClass('item').attr('key',itemId).append(
      $('<div>').addClass('collapsible-header').append($('<span>').append(itemName)).append(
        $('<a>').addClass('secondary-content optionList dropdown-button').append(
          $('<i>').addClass('material-icons').text('keyboard_arrow_down')
        ).attr('data-activates','itemOptions' + itemId).attr('data-beloworigin', 'true')
      ).append(
        $('<ul>').attr('id', 'itemOptions' + itemId).addClass('dropdown-content').append(
          $('<li>').append(
            $('<a>').addClass('editItem').text('Edit')
          ).bind('click', EditItem)
        ).append(
          $('<li>').addClass('divider')
        ).append(
          $('<li>').append(
            $('<a>').addClass('deleteItem').text('Delete')
          ).bind('click', DeleteItem)
        )
      )
    ).append(
      $('<div>').addClass('collapsible-body').append(
        $('<p>').text(itemContent).linkify()
      )
    )
  );



  $('.dropdown-button').click(function( event ) {
    event.stopPropagation();
  });

  $('.dropdown-button').dropdown({
      inDuration: 300,
      outDuration: 225,
      constrain_width: false, // Does not change width of dropdown to that of the activator
      hover: false, // Activate on hover
      gutter: 0, // Spacing from edge
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left' // Displays dropdown with edge aligned to the left of button
    }
  );
}
