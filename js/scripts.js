var pokemonRepository = (function () {
  var repository = [];
  function showDetails(item) {
    loadDetails(item).then(function (pokemon) {
      return pokemon
    });
  }
  
  function addListItem (pokemon) {
    var listItem = $('<li></li>')
    var button  = $('<button type="button" class="btn-block" data-toggle="modal" data-target="#exampleModal"></button>');
    button.append(pokemon.name)
    button.click(() => {
      loadDetails(pokemon)
    })
    listItem.append(button);
    $('.pokemon-list').append(listItem);
  }

  function add(pokemon) {
    repository.push(pokemon);
  }
    
  function getAll() {
    return repository;
  }

  function loadList() {
    return $.ajax('https://pokeapi.co/api/v2/pokemon/?limit=150', { dataType: 'json' }).then(function (responseJSON) {
      responseJSON.results.forEach(function (item) {
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        };
        add(pokemon)
      });
    })  
  }
  function showModal(pokemon) {
    var modalBody = $(".modal-body");
    var modalTitle = $(".modal-title");
    modalBody.empty();
    modalTitle.empty();
    var closeButtonElement = $('<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>')
    var titleElement = $('<h1 class="title"></h1>');
    titleElement.append(pokemon.name)
    var heightElement = $('<p class="height">Height: </p>');
    heightElement.append(pokemon.height)

    var contentElement = $('<img id="pokeimg" src="' + pokemon.sprites.front_shiny +'" />');
    // contentElement.append(pokemon.sprites.front_shiny)
    modalBody.append(closeButtonElement)
    modalBody.append(titleElement); 
    modalBody.append(heightElement);
    modalBody.append(contentElement);
 
    
    
   
  }

  
    
   
  
  function loadDetails(item) {
    var url = item.detailsUrl;
    return fetch(url).then(function (response) {
      return response.json();
    }).then(function (details) {
      console.log(details)
      showModal(details)
    }).catch(function (e) {
      console.error(e);
      var modalContainer = document.querySelector('#modal-container');
      if (e.key === 'Escape' && modalContainer.classList.contains('is-visible')) {
        hideModal();  
      }
      modalContainer.addEventListener('click', (e) => {
        // Since this is also triggered when clicking INSIDE the modal
        // We only want to close if the user clicks directly on the overlay
        var target = e.target;
        if (target === modalContainer) {
          hideModal();
        }
      });
    });
  }
  
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    showDetails:showDetails,
    loadDetails: loadDetails,
    hideModal: showModal,
    showModal:showModal
  };
  
})();
  
pokemonRepository.loadList().then(function() {
  pokemonRepository.getAll().forEach(function(pokemon){
    pokemonRepository.addListItem(pokemon);
  });
});
$('#searchBar').on('keyup', function() {
	var value = $(this).val().toLowerCase();
	$('.btn-block').filter(function() {
		$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
	});
});