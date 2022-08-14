// show/hide sidepanel
function expandSidepanel() {
    document.getElementById('ingreso').classList.toggle('panel__swapping');
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

 function initial() {
    document.getElementById("defaultOpen").click();
  }