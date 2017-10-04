function toggleClass(element, toggleClass){
   var currentClass = element.className;
   if(currentClass.split(" ").indexOf(toggleClass) > -1){ //has class
      newClass = currentClass.replace(new RegExp('\\b'+toggleClass+'\\b','g'),"")
   }else{
      newClass = currentClass + " " + toggleClass;
   }
   element.className = newClass.trim();
}

var sendContactForm = function() {
			var name = document.getElementById('contactFormName').value || '';
			var email = document.getElementById('contactFormEmail').value || '';
			var phone = document.getElementById('contactFormPhone').value || '';
			var message = document.getElementById('contactFormMessage').value || '';

			 
			 window.open('mailto:contact@froso.de'+'?subject=Anfrage von '+ (name ? name : '') + (email ? ' email ' + email : '') + (phone ? ' (' + phone + ')' : '') + '&body=' + (message ? message : ''));
			 
			 
			
		}


function jsJs() {

    // navigation
    document.addEventListener("DOMContentLoaded",function() {
		
		var openNavElem = document.getElementsByClassName('openNav').item(0);
		openNavElem.addEventListener('click', function() {
			toggleClass(openNavElem,'navIsOpen')
			toggleClass(document.getElementById('nav'),'isOpen')
			toggleClass(document.getElementById('implink'),'implinkHidden')
		});

		

	// contact form
		var toggleContactForm = function() {
			const wrapperClassName = 'contactFormWrapperOpen';
			toggleClass(openNavElem,'contactFormIsOpen')
			toggleClass(document.getElementById('logo'),wrapperClassName)
			//toggleClass(document.getElementById('implink'),wrapperClassName)
			toggleClass(document.getElementsByClassName('mainWrapper').item(0),wrapperClassName)
			toggleClass(document.getElementsByClassName('contactFormWrapper').item(0),wrapperClassName)
			toggleClass(document.getElementsByClassName('openNav').item(0),wrapperClassName)
		}
		var openContactForm = document.getElementById('opencontactForm');
		if (openContactForm) {
			openContactForm.addEventListener('click', function(){
					toggleContactForm()
			});


			if (document.getElementsByClassName('closeIcon').length > 0) {
			   document.getElementsByClassName('closeIcon').item(0).addEventListener('click', function(){
				toggleContactForm()
				});
			}
		}
		
		
		document.getElementById('loader').style.display = 'none';
		document.getElementById('nav').style.transition = 'transform 300ms';
    });

   
	

}
jsJs();