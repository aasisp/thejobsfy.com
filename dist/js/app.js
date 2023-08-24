import {header} from "./header.js";
import {footer} from "./footer.js";

header();
footer();

let jobSearchMobile = document.querySelector("#mobile_jobsearch");
let backBtn = document.querySelector(".back_btn");
let searchPopup = document.querySelector(".search_mobile");
let jobTitleMobile = document.querySelector("#jobtitle_mobile");
let bodyHTML = document.querySelector("body");
let searchBtn = document.querySelector("#search_btn");
let jobTitle = document.querySelector("#jobtitle_mobile");

jobSearchMobile.addEventListener("click", e=> {
    console.log("clicked");
    if(searchPopup.style.display != "flex") {
        searchPopup.style.display = "flex";
        bodyHTML.style.overflow = "hidden";
        searchBtn.disabled = true;
        searchBtn.style.opacity = "0.4";
        jobTitleMobile.focus();

    } else {
        searchPopup.style.display = "none";
    }
});

backBtn.addEventListener("click", e=> {
    searchPopup.style.display = "none";
    bodyHTML.style.overflow = "auto";
});

jobTitle.addEventListener("input", e=> {
   if(jobTitle.value == "") {
    searchBtn.disabled = true;
    searchBtn.style.opacity = "0.4";
   } else {
    searchBtn.disabled = false;
    searchBtn.style.opacity = "1";
   }
});

// Find Jobs Button Positioning
let pendingUpdate = false;
function viewportHandler(event) {
	if (pendingUpdate) return;
	pendingUpdate = true;

	requestAnimationFrame(() => {
		pendingUpdate = false;
		
        // Stick to top

		// Stick to bottom
		if (window.visualViewport.offsetTop >= 0) {
			document.querySelector('[data-stickto="bottom"]').style.transform = `translateY(-${Math.max(0, window.innerHeight - window.visualViewport.height - window.visualViewport.offsetTop)}px)`;
		}
	});
}

window.visualViewport.addEventListener("scroll", viewportHandler);
window.visualViewport.addEventListener("resize", viewportHandler);


let inputJobTitle = document.querySelector("#input_what");
let inputJobLocation = document.querySelector("#input_where");
let contJobTitle = document.querySelector(".job_title");
let contJobLocation = document.querySelector(".job_location");
let contJobTitleMobile = document.querySelector(".jobsearch_input");
let constJobLocationMobile = document.querySelector(".location_input");

const isInputActive = (event) => {
    if(event.target.id == "input_what") {
        contJobTitle.style.boxShadow = "#1a78f4 4px 6px 0px 0px";
    } else if(event.target.id == "input_where") {
        contJobLocation.style.boxShadow = "#1a78f4 4px 6px 0px 0px";
    } else if(event.target.id == "jobtitle_mobile") {
        contJobTitleMobile.style.boxShadow = "#1a78f4 4px 6px 0px 0px";
    } else if(event.target.id == "joblocation_mobile") {
        constJobLocationMobile.style.boxShadow = "#1a78f4 4px 6px 0px 0px";
    }
};

const isInputInactive = (event) => {
    if(event.target.id == "input_what") {
        contJobTitle.style.boxShadow = "unset";
    } else if(event.target.id == "input_where") {
        contJobLocation.style.boxShadow = "unset";
    } else if(event.target.id == "jobtitle_mobile") {
        contJobTitleMobile.style.boxShadow = "unset";
    } else if(event.target.id == "joblocation_mobile") {
        constJobLocationMobile.style.boxShadow = "unset";
    }
}

window.addEventListener("focus", isInputActive, true);
window.addEventListener("focusout", isInputInactive, true);

window.addEventListener("load", e=> {
    inputJobTitle.focus();
});


// Active page indicator









// Positioning of job previewer
//             let getUrl;
// if(getUrl == "/") {
    

    
//     }else {
//             jobDetailsCard.style.height = (docHeight - 497) + "px";

//             window.addEventListener("scroll", e=> {
//                 let scroll = window.scrollY;

//                 if(scroll < 262) {
//                     jobDetail.style.top =  (286 - scroll) + "px";
//                     jobDetailsCard.style.height = (docHeight - 497 + scroll) + "px";
//                 }

//                 if(scroll > 262) {
//                     jobDetail.style.top = "10px";
//                     jobDetailsCard.style.height = (docHeight - 221) + "px";

//                 }

//                 let maxScroll = Math.max(document.body.scrollHeight - window.innerHeight);

//                 if(scroll == maxScroll || scroll > (maxScroll - 43)) {
//                     jobDetailsCard.style.height = (docHeight - 293) + "px";
//                 }

//             });
//     };