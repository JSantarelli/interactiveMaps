// Active first tab
function initial() {
  document.getElementById("defaultOpen").click();
}

function hideIcons() {
  document.getElementById('icons').classList.toggle('hide');
  const btnIcons = document.getElementById('toggleText');
  if (btnIcons.innerHTML === 'ocultar iconos') {
    btnIcons.innerHTML = 'mostrar iconos';
  } else {
    btnIcons.innerHTML = 'ocultar iconos';
  }
}

// show/hide sidepanel
function expandSidepanel() {
  document.getElementById('lateral').classList.toggle('panel__swapping');
  const btnChevron = document.getElementById('toggleChevron'); 
  btnChevron.style.transform = "rotate(180deg)"
}


// tabs
function showTab(event, category) {
    var i;
    var tabcontent = document.getElementsByClassName("tab-panel");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    var tablinks = document.getElementsByClassName("nav__tab");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" nav__tab--active", "");
    }
    document.getElementById(category).style.display = "block";
    event.currentTarget.className += " nav__tab--active";
  }