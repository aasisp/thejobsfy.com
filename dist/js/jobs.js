const jobTitleInput = document.querySelector("#input_what");
const mobileJobTitleInput = document.querySelector("#jobtitle_mobile");
const suggestionBox = document.querySelector(".sugg");
const suggestionUL = suggestionBox.querySelector(".search_suggestion");
const mobileSuggestionBox = document.querySelector(".jobitems_cont");
const locationInput = document.querySelector("#input_where");

const urlParams = new URLSearchParams(window.location.search);
const jobQuery = urlParams.get("q");
const jobLocation  = urlParams.get("l");
const jobId = urlParams.get("jvid");

const screenWidth = window.innerWidth;

let jobTitles = [];

//Mobile
const handleMobileJobTitle = (e) => {
    let value = e.target.value.toLowerCase();
    let matchingJobs = jobTitles.filter(title => title.toLowerCase().includes(value));
    mobileSuggestionBox.innerHTML = ""; // Clear suggestion box

    if (value.length !== 0 && matchingJobs.length > 0) {
        mobileSuggestionBox.innerHTML = matchingJobs.map(suggestion => `
            <p class="s_item">${suggestion}</p>`).join("");
    } else {
        mobileSuggestionBox.innerHTML = "";
    }
}

// Populates job titles suggestion
const handleMobileSuggestionClick = (e) => {
    if (e.target && e.target.classList.contains("s_item")) {
        mobileJobTitleInput.value = e.target.textContent; // Insert the clicked suggestion into the input field
        mobileSuggestionBox.innerHTML = ""; // Clear suggestion box
    }
};
const populateSuggestionBox = (suggestions) => {
    suggestionUL.innerHTML = suggestions.map(suggestion => `
        <li class="s_item">${suggestion}</li>
    `).join("");
};

// handles user input 
const handleJobTitle = (e) => {
    let value = e.target.value.toLowerCase();
    let matchingJobs = jobTitles.filter(title =>
        title.toLowerCase().includes(value)
    );

    suggestionUL.innerHTML = ""; // Clear suggestion box

    if (value.length !== 0 && matchingJobs.length > 0) {
        suggestionBox.classList.remove("hide"); // Show suggestion box
        populateSuggestionBox(matchingJobs);
    } else {
        suggestionBox.classList.add("hide"); // Hide suggestion box
        suggestionUL.innerHTML = "";
    }
}

// Suggestion items click assigned to input field
const handleSuggestionClick = (e) => {
    if (e.target && e.target.classList.contains("s_item")) {
        jobTitleInput.value = e.target.textContent; // Insert the clicked suggestion into the input field
        suggestionBox.classList.add("hide"); // Hide suggestion box
        suggestionUL.innerHTML = ""; // Clear suggestion box
    }
};

// Fetches the jobtitle data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        jobTitles = data.flatMap(entry => entry.jobOpening.map(job => job.position));
        jobTitles = [...new Set(jobTitles)]
    
        if(jobQuery || jobLocation) {
            findJobs(data)
        }else {
            latestJobs(data);
        }
        

        // Job title event to handle jobtitles suggestions
        jobTitleInput.addEventListener("input", handleJobTitle);
        // Job title event to handle jobtitles suggestions for mobile
        mobileJobTitleInput.addEventListener("input", handleMobileJobTitle);

        // Suggestion items click event
        suggestionUL.addEventListener("click", handleSuggestionClick)
        // Suggestion item click event mobile
        mobileSuggestionBox.addEventListener("click", handleMobileSuggestionClick);
        } catch (error) {
            console.error('Error fetching or parsing the JSON file:', error);
        throw error;
      }
};

let cities;
const locationSuggestionBox = document.querySelector(".location_suggestion");
const locationSuggestionCont = locationSuggestionBox.querySelector(".location_sugg");
const mobileLocationInput = document.querySelector("#joblocation_mobile");

const handleLocationInput = (e) => {
    let value = e.target.value.toLowerCase();
    let matchingLocation = cities.filter(city => city.toLowerCase().startsWith(value));
    matchingLocation.length = 10;

    if(value.length !== 0 && matchingLocation.length > 0) {
        locationSuggestionBox.classList.remove("hide");
        locationSuggestionCont.innerHTML = matchingLocation.map(city => `<li class="s-item">${city}</li>`).join("");
    }else {
        locationSuggestionBox.classList.add("hide");
        locationSuggestionCont.innerHTML = "";
    }
}

const handleLocationSuggestionClick = (e) => {
    if (e.target && e.target.classList.contains("s-item")) {
        locationInput.value = e.target.textContent; // Insert the clicked suggestion into the input field
        locationSuggestionBox.classList.add("hide"); // Hide suggestion box
        locationSuggestionCont.innerHTML = ""; // Clear suggestion box
    }
};

const handleMobileLocationInput = (e) => {
    let value = e.target.value.toLowerCase();
    let matchingLocation = cities.filter(city => city.toLowerCase().startsWith(value));
    matchingLocation.length = 10;

    if(value.length !== 0 && matchingLocation.length > 0) {
        mobileSuggestionBox.innerHTML = matchingLocation.map(city => `<li class="s-item">${city}</li>`).join("");
    }else {
        mobileSuggestionBox.innerHTML = "";
    }
}

const handleLocSuggestionClick = (e) => {
    if (e.target.classList.contains("s-item")) {
        mobileLocationInput.value = e.target.textContent;
        mobileSuggestionBox.innerHTML = ""; // Clear suggestion box
    }
};


// Fetches location data
fetch('/data/location.json')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let jobConnect = data[0].url;
        let currentCN = data[0].country;

        cities = data[0].cities;
        for (const location of data) {
            if (location.timezone.includes(userTimezone)) {
                jobConnect = location.url;
                cities = location.cities;
                currentCN = location.country;
                break;
            }
        }
        cities = [...new Set(cities)]

        // This event handle location suggestion
        locationInput.addEventListener("input", handleLocationInput)

        locationSuggestionCont.addEventListener("click", handleLocationSuggestionClick)

        mobileLocationInput.addEventListener("input", handleMobileLocationInput)

        mobileSuggestionBox.addEventListener("click", handleLocSuggestionClick)
        fetchData(jobConnect);

        // Site title tag
        const siteTitle = document.querySelector("title");
        siteTitle.textContent = jobQuery + " Jobs in " + (jobLocation || currentCN) + " | TheJobsfy.com";

        // page heading tag
        const pageHeading = document.querySelector(".page_heading");
        pageHeading.innerHTML = (jobQuery || "") + " jobs in " + (jobLocation || currentCN);

        const linkTag = document.createElement("link");
        linkTag.rel = "canonical";
        linkTag.href = window.location.href;
        document.head.appendChild(linkTag);

    
        const siteMetaAtt = [
            { property: "og:url", content: window.location.href },
            { property: "og:title", content: jobQuery + " Jobs in " + jobLocation + " | TheJobsfy.com" },
            { property: "og:description", content: "Find " + jobQuery + " Jobs in Top companies of " + jobLocation + ". " + jobQuery + " Vacancies in " + jobLocation + " with the highest salary offer." },
            { property: "twitter:url", content: window.location.href },
            { property: "twitter:title", content: jobQuery + " Jobs in " + jobLocation + " | TheJobsfy.com" },
            { property: "twitter:description", content: "Find " + jobQuery + " Jobs in Top companies of " + jobLocation + ". " + jobQuery + " Vacancies in " + jobLocation + " with the highest salary offer." },
            { name: "title", content: jobQuery + " Jobs in " + jobLocation + " | TheJobsfy.com" },
            { name: "description", content: "Find " + jobQuery + " Jobs in Top companies of " + jobLocation + ". " + jobQuery + " Vacancies in " + jobLocation + " with the highest salary offer." },
        ];

        for (const metaInfo of siteMetaAtt) {
            const metaTag = document.createElement("meta");
            
            for (const key in metaInfo) {
                metaTag.setAttribute(key, metaInfo[key]);
            }
            
            document.head.appendChild(metaTag);
        }




    })
    .catch(error => {
        console.error('Fetch error:', error);
    });


// Find Job and latest job handling
const timeAgo = (date) => {
    const timestamp = new Date(date).getTime();
    const now = Date.now();
    const elapsed = now - timestamp;

    if (elapsed < 60000) {
        return "Just now";
    } else if (elapsed < 3600000) {
        const minutes = Math.floor(elapsed / 60000);
        return `${minutes} min ago`;
    } else if (elapsed < 86400000) {
        const hours = Math.floor(elapsed / 3600000);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (elapsed < 604800000) {
        const days = Math.floor(elapsed / 86400000);
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (elapsed < 2419200000) {
        const weeks = Math.floor(elapsed / 604800000);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    } else {
        const months = Math.floor(elapsed / 2419200000);
        return `${months} month${months > 1 ? "s" : ""} ago`;
    }
}

const latestJobs = (data) => {
    const latestPosts = data.flatMap(company => 
        company.jobOpening.map(job => ({
            "date": job.issueDate,
            "postId": job.id,
            "Position": job.position,
            "cmp_name": company.cmpName,
            "cmp_logo": company.img.logo,
            "location": job.jobLocation || company.hQLocation
        }))
    ).sort((postA, postB) => new Date(postB.date) - new Date(postA.date));
    
     // Assignment recent posts to HTML document
     let postCont = document.querySelector(".items_cards");
     let lazyLoad = document.querySelector(".lazy_loading");
     let startIndex = 0;
     let postsPerClick = 20;
     const jobCardPreviewer = () => {
         const endIndex = startIndex + postsPerClick;
         const remainingPosts = latestPosts.slice(endIndex);
         const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("jvid");

         for(let i = startIndex; i < endIndex && i < latestPosts.length; i++) {
             let post = latestPosts[i];
             let card = document.createElement('div');
             card.classList.add("job_card", "flx");
             card.innerHTML = `
                     <div class="l-cont">
                         <img src="${post.cmp_logo}" alt="${post.cmp_name} Logo" width="70" height="70">
                     </div>
                     <div class="r-cont">
                         <a class="job_title_card" href="${currentUrl + "&jvid=" + post.postId}">${post.Position}</a>
                         <div class="company_detail">
                             <span>${post.cmp_name}</span>
                             <div class="location">${post.location}</div>
                         </div>
                         <div class="job_footer">
                             <div class="job_date">${timeAgo(post.date)}}</div>
                         </div>
                     </div>
             `;
             postCont.append(card);
         }

         startIndex += postsPerClick;

         if(remainingPosts.length >= 1) {
             lazyLoad.style.display = "flex";
         }else {
             lazyLoad.style.display = "none";
         }
     };
     jobCardPreviewer();

     // Job card cont event handling
     let jobCard = document.querySelectorAll(".job_card");
     let JobtitleCard = document.querySelectorAll(".job_title_card");

     window.addEventListener("click", e=> {
         jobCard = document.querySelectorAll(".job_card");
         JobtitleCard = document.querySelectorAll(".job_title_card");
     });

     function handlePostsInteraction() {
         let jobCard = document.querySelectorAll(".job_card");
         let JobtitleCard = document.querySelectorAll(".job_title_card");
         for(let i = 0; i < jobCard.length; i++) {
             jobCard[i].addEventListener("mouseenter", e=> {
                 JobtitleCard[i].classList.add("_active");
             });
         }
         for(let i = 0; i < jobCard.length; i++) {
             jobCard[i].addEventListener("mouseleave", e=> {
                 JobtitleCard[i].classList.remove("_active");
             });
         }
     }
     handlePostsInteraction();

     // Function change the parameter of URL without refreshing the page
     function changeParameter(count) {
         const newParamValue = JobtitleCard[count].href;
         window.history.pushState({}, '', newParamValue);
     }

     let lazyBtn = document.querySelector("#lazy_load_btn");
     lazyBtn.addEventListener("click", e=> {
         jobCardPreviewer();
         handlePostsInteraction();
         let jobCardCont1 = document.querySelectorAll(".job_card");
         let JobtitleCardItem1 = document.querySelectorAll(".job_title_card");
         for(let i = 0; i < jobCardCont1.length; i++) {
            let postIdd = new URLSearchParams(JobtitleCardItem1[i].href);
            let jobId = postIdd.get("jvid");
            jobCardCont1[i].addEventListener("click", e=> {
                if(screenWidth >= 1024) {
                    changeParameter(i);
                }else {
                    window.location.href = "/viewjobs?jvid=" + jobId;
                }
                getJobId();
            });
            JobtitleCardItem1[i].addEventListener("click", (event)=> {
                if(screenWidth >= 1024) {
                    event.preventDefault();
                }else {
                    JobtitleCardItem1[i].href = "/viewjobs?jvid=" + jobId;
                }
            });
        }                
     });

     //Position Job Previewer container
     const positionJobPreviewCont = () => {
         let docHeight = window.innerHeight;
         let jobDetail = document.querySelector(".jobs_detail_pane");
         let jobDetailsCard = document.querySelector(".job_details");
             jobDetailsCard.style.height = (docHeight - 485) + "px";

             window.addEventListener("scroll", e=> {
             let scroll = window.scrollY;
                 if(scroll < 254) {
                     jobDetail.style.top =  (254 - scroll) + "px";
                     jobDetailsCard.style.height = (docHeight - 485 + scroll) + "px";
                 }

                 if(scroll > 254) {
                     jobDetail.style.top = "10px";
                     jobDetailsCard.style.height = (docHeight - 240) + "px";
                 }

                 let maxScroll = Math.max(document.body.scrollHeight - window.innerHeight);
                 if(scroll == maxScroll || scroll > (maxScroll - 43)) {
                     jobDetailsCard.style.height = (docHeight - 307) + "px";
                 }
             });
             window.addEventListener("click", e=> {
             let scroll = window.scrollY;
                 if(scroll > 389) {
                     // jobDetail.style.top = "10px";
                     jobDetailsCard.style.height = (docHeight - 307) + "px";
                 }
             })
     }

     // Job Previewer
     const jobPreviewer = (obj) => {
        let jobPreviewCont = document.querySelector(".jobs_detail_pane");
        jobPreviewCont.innerHTML = ` 
                        <div class="jdp_header">
                            <div class="j_title">
                                <h2 lang="en">${obj.position}</h2>
                            </div>
                            <div class="company_details">
                                    <span>${obj.cmpName}</span>
                                    <div class="location">${obj.location}</div>
                            </div>
                            <div class="job_tags flex"></div>
                            <div class="apply_btn">
                                <button id="applyBtn" class="apply_btn" href="${obj.apply}">Apply on company site</button>
                            </div>
                        </div>
                        <div class="job_details">
                            <div class="viewer">
                                <p class="about_company"><b>About</b></p>
                                <p class="company_summary">${obj.aboutCmp}</p>
                            </div>
                         </div>
        `;
        
        const typeList = document.querySelector(".job_tags");
        obj.type.forEach(value => {
            const spanTag = document.createElement("span");
            spanTag.textContent = value;
            typeList.appendChild(spanTag);
        });

        const jobDetails = obj.jobDecription[0];
        const jobBody = document.querySelector(".viewer");
        const fragment = document.createDocumentFragment();

        for (const key in jobDetails) {
            const paraTag = document.createElement("p");
            paraTag.innerHTML = `<b>${key}</b>`;
            fragment.appendChild(paraTag);

            if (Array.isArray(jobDetails[key])) {
                const ulTag = document.createElement("ul");
                jobDetails[key].forEach(item => {
                    const liTag = document.createElement("li");
                    liTag.textContent = item;
                    ulTag.appendChild(liTag);
                });
                fragment.appendChild(ulTag);
            } else {
                const newPtag = document.createElement("p");
                newPtag.textContent = jobDetails[key];
                fragment.appendChild(newPtag);
            }
        }
        jobBody.appendChild(fragment);
       
        positionJobPreviewCont();

          // Apply button handling 
          const applyBtn = document.querySelector("#applyBtn");
          applyBtn.addEventListener("click", () => {
              let jobUrl = applyBtn.getAttribute("href");
              window.open(jobUrl, "_blank");
          })
    }

     // Getting active job card 
     const getActiveJobCard = (id) => {
         for(let i = 0; i < JobtitleCard.length; i++) {

             const jobUrl = new URLSearchParams(JobtitleCard[i].href);
             let jobPostId = jobUrl.get("jvid");
             if(jobPostId == id) {
                 jobCard[i].classList.add("active_job_card");
             } else {
                 jobCard[i].classList.remove("active_job_card");
             }
         }
     }

      //Getting job details
      const getJobDetails = (id) => {
        let jobPreArr;
        for(let i = 0; i < data.length; i++) {
            for(let k = 0; k < data[i].jobOpening.length; k++) {
                if(id === data[i].jobOpening[k].id) {
                    let newData = data[i].jobOpening[k];
                    jobPreArr =({
                        "position": newData.position,
                        "cmpName": data[i].cmpName,
                        "location": newData.jobLocation || data[i].hQLocation,
                        "type": newData.tags,
                        "apply": newData.apply,
                        "aboutCmp": data[i].aboutCmp,
                        "jobDecription": newData.jobDescription
                 });
                }
            }
        }
        jobPreviewer(jobPreArr);
        getActiveJobCard(id);
    }

     let defaultId = latestPosts[0].postId;
     getJobDetails(defaultId)

     async function getJobId() {
         const urlParams = new URLSearchParams(window.location.search);
         let jobId = urlParams.get('jvid');
         getJobDetails(jobId);
     }

     getJobId();

     if(!jobId) {
        changeParameter(0);
     }

     for(let i = 0; i < jobCard.length; i++) {
        let postIdd = new URLSearchParams(JobtitleCard[i].href);
        let jobId = postIdd.get("jvid");

         jobCard[i].addEventListener("click", e=> {
            if(screenWidth > 1024) {
                changeParameter(i);
            }else {
                window.location.href = "/viewjobs?jvid=" + jobId;
            }
            getJobId();
         });

         JobtitleCard[i].addEventListener("click", (event)=> {
            if(screenWidth > 1024) {
                event.preventDefault();
            }else {
                JobtitleCard[i].href = "/viewjobs?jvid=" + jobId;
            }
         })
     };
};

const findJobs = (data) => {

    const jobPosts = data.flatMap(company => 
        company.jobOpening.map(job => ({
            "date": job.issueDate,
            "postId": job.id,
            "Position": job.position,
            "cmp_name": company.cmpName,
            "cmp_logo": company.img.logo,
            "location": job.jobLocation || company.hQLocation
        }))
    ).sort((postA, postB) => new Date(postB.date) - new Date(postA.date));
    
    let matchingQuery;
    // `matchingQueryArray` now contains an array of strings from the `Position` property that match the query.
        if(jobLocation == "Nepal" || jobLocation == "India") {
            matchingQuery = jobPosts.filter(job => 
                job.Position.toLowerCase().includes(jobQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(jobLocation.toLocaleLowerCase())
            );
        }else {
            matchingQuery = jobPosts.filter(job => 
                job.Position.toLowerCase().includes(jobQuery.toLowerCase()) &&
                job.location.toLowerCase().includes(jobLocation.toLocaleLowerCase())
            );
        }

    if(matchingQuery.length == 0) {
        const jobSec = document.querySelector(".job_section");
        jobSec.innerHTML = `<div class="error">
                                <div class="error_msg">
                                    <span>No jobs found for <b>${jobQuery}</b> in <b>${jobLocation}</b>.</span>
                                </div>
                                <div class="suggestion_msg">
                                    <span>Try different keywords to find jobs.</span>
                                </div>
                            </div>`
        jobSec.style.height = "500px";
        // const noIndex = document.querySelector('[name="robots"]');
        // noIndex.content = "noindex, nofolow";
    }else {

        


        // Assignment recent posts to HTML document
    let postCont = document.querySelector(".items_cards");
    let lazyLoad = document.querySelector(".lazy_loading");
    let startIndex = 0;
    let postsPerClick = 20;
    const jobCardPreviewer = () => {
        const endIndex = startIndex + postsPerClick;
        const remainingPosts = matchingQuery.slice(endIndex);
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.delete("jvid");

        for(let i = startIndex; i < endIndex && i < matchingQuery.length; i++) {
            let post = matchingQuery[i];
            let card = document.createElement('div');
            card.classList.add("job_card", "flx");
            card.innerHTML = `
                    <div class="l-cont">
                        <img src="${post.cmp_logo}" alt="${post.cmp_name} Logo" width="70" height="70">
                    </div>
                    <div class="r-cont">
                        <a class="job_title_card" href="${currentUrl + "&jvid=" + post.postId}">${post.Position}</a>
                        <div class="company_detail">
                            <span>${post.cmp_name}</span>
                            <div class="location">${post.location}</div>
                        </div>
                        <div class="job_footer">
                            <div class="job_date">${timeAgo(post.date)}</div>
                        </div>
                    </div>
            `;
            postCont.append(card);
        }

        startIndex += postsPerClick;

        if(remainingPosts.length >= 1) {
            lazyLoad.style.display = "flex";
        }else {
            lazyLoad.style.display = "none";
        }
    };
    jobCardPreviewer();

    // Job card cont event handling
    let jobCard = document.querySelectorAll(".job_card");
    let JobtitleCard = document.querySelectorAll(".job_title_card");

    window.addEventListener("click", e=> {
        jobCard = document.querySelectorAll(".job_card");
        JobtitleCard = document.querySelectorAll(".job_title_card");
    });

    function handlePostsInteraction() {
        let jobCard = document.querySelectorAll(".job_card");
        let JobtitleCard = document.querySelectorAll(".job_title_card");
        for(let i = 0; i < jobCard.length; i++) {
            jobCard[i].addEventListener("mouseenter", e=> {
                JobtitleCard[i].classList.add("_active");
            });
        }
        for(let i = 0; i < jobCard.length; i++) {
            jobCard[i].addEventListener("mouseleave", e=> {
                JobtitleCard[i].classList.remove("_active");
            });
        }
    }
    handlePostsInteraction();

    // Function change the parameter of URL without refreshing the page
    function changeParameter(count) {
        const newParamValue = JobtitleCard[count].href;
        window.history.pushState({}, '', newParamValue);
    }

    let lazyBtn = document.querySelector("#lazy_load_btn");
    lazyBtn.addEventListener("click", e=> {
        jobCardPreviewer();
        handlePostsInteraction();
        let jobCardCont1 = document.querySelectorAll(".job_card");
        let JobtitleCardItem1 = document.querySelectorAll(".job_title_card");
        for(let i = 0; i < jobCardCont1.length; i++) {
            let postIdd = new URLSearchParams(JobtitleCardItem1[i].href);
            let jobId = postIdd.get("jvid");
            jobCardCont1[i].addEventListener("click", e=> {
                if(screenWidth >= 1024) {
                    changeParameter(i);
                }else {
                    window.location.href = "/viewjobs?jvid=" + jobId;
                }
                getJobId();
            });
            JobtitleCardItem1[i].addEventListener("click", (event)=> {
                if(screenWidth >= 1024) {
                    event.preventDefault();
                }else {
                    JobtitleCardItem1[i].href = "/viewjobs?jvid=" + jobId;
                }
            });
        }                 
    });

    //Position Job Previewer container
    const positionJobPreviewCont = () => {
        let docHeight = window.innerHeight;
        let jobDetail = document.querySelector(".jobs_detail_pane");
        let jobDetailsCard = document.querySelector(".job_details");
            jobDetailsCard.style.height = (docHeight - 485) + "px";

            window.addEventListener("scroll", e=> {
            let scroll = window.scrollY;
                if(scroll < 240) {
                    jobDetail.style.top =  (254 - scroll) + "px";
                    jobDetailsCard.style.height = (docHeight - 485 + scroll) + "px";
                }

                if(scroll > 254) {
                    jobDetail.style.top = "10px";
                    jobDetailsCard.style.height = (docHeight - 240) + "px";
                }

                let maxScroll = Math.max(document.body.scrollHeight - window.innerHeight);
                if(scroll == maxScroll || scroll > (maxScroll - 43)) {
                    jobDetailsCard.style.height = (docHeight - 307) + "px";
                }
            });
            window.addEventListener("click", e=> {
            let scroll = window.scrollY;
                if(scroll > 389) {
                    // jobDetail.style.top = "10px";
                    jobDetailsCard.style.height = (docHeight - 307) + "px";
                }
            })
    }

    // Job Previewer
    const jobPreviewer = (obj) => {
        let jobPreviewCont = document.querySelector(".jobs_detail_pane");
        jobPreviewCont.innerHTML = ` 
                        <div class="jdp_header">
                            <div class="j_title">
                                <h2 lang="en">${obj.position}</h2>
                            </div>
                            <div class="company_details">
                                    <span>${obj.cmpName}</span>
                                    <div class="location">${obj.location}</div>
                            </div>
                            <div class="job_tags flex"></div>
                            <div class="apply_btn">
                                <button id="applyBtn" class="apply_btn" href="${obj.apply}">Apply on company site</button>
                            </div>
                        </div>
                        <div class="job_details">
                            <div class="viewer">
                                <p class="about_company"><b>About</b></p>
                                <p class="company_summary">${obj.aboutCmp}</p>
                            </div>
                         </div>
        `;
        
        const typeList = document.querySelector(".job_tags");
        obj.type.forEach(value => {
            const spanTag = document.createElement("span");
            spanTag.textContent = value;
            typeList.appendChild(spanTag);
        });

        const jobDetails = obj.jobDecription[0];
        const jobBody = document.querySelector(".viewer");
        const fragment = document.createDocumentFragment();

        for (const key in jobDetails) {
            const paraTag = document.createElement("p");
            paraTag.innerHTML = `<b>${key}</b>`;
            fragment.appendChild(paraTag);

            if (Array.isArray(jobDetails[key])) {
                const ulTag = document.createElement("ul");
                jobDetails[key].forEach(item => {
                    const liTag = document.createElement("li");
                    liTag.textContent = item;
                    ulTag.appendChild(liTag);
                });
                fragment.appendChild(ulTag);
            } else {
                const newPtag = document.createElement("p");
                newPtag.textContent = jobDetails[key];
                fragment.appendChild(newPtag);
            }
        }
        jobBody.appendChild(fragment);
       
        positionJobPreviewCont();

          // Apply button handling 
          const applyBtn = document.querySelector("#applyBtn");
          applyBtn.addEventListener("click", () => {
              let jobUrl = applyBtn.getAttribute("href");
              window.open(jobUrl, "_blank");
          })
    }

    // Getting active job card 
    const getActiveJobCard = (id) => {
        for(let i = 0; i < JobtitleCard.length; i++) {
            const jobUrl = new URLSearchParams(JobtitleCard[i].href);
            let jobPostId = jobUrl.get("jvid");
            if(jobPostId == id) {
                jobCard[i].classList.add("active_job_card");
            } else {
                jobCard[i].classList.remove("active_job_card");
            }
        }
    }

     //Getting job details
     const getJobDetails = (id) => {
        let jobPreArr;
        for(let i = 0; i < data.length; i++) {
            for(let k = 0; k < data[i].jobOpening.length; k++) {
                if(id === data[i].jobOpening[k].id) {
                    let newData = data[i].jobOpening[k];
                    jobPreArr =({
                        "position": newData.position,
                        "cmpName": data[i].cmpName,
                        "location": newData.jobLocation || data[i].hQLocation,
                        "type": newData.tags,
                        "apply": newData.apply,
                        "aboutCmp": data[i].aboutCmp,
                        "jobDecription": newData.jobDescription
                 });
                }
            }
        }
        jobPreviewer(jobPreArr);
        getActiveJobCard(id);
    }

    let defaultId = matchingQuery[0].postId;
    getJobDetails(defaultId)
    

    async function getJobId() {
        const urlParams = new URLSearchParams(window.location.search);
        let jobId = urlParams.get('jvid');
        getJobDetails(jobId);
    }

    getJobId();

    
    if(!jobId) {
        changeParameter(0);
    }

  // redirecting mobile view
  for(let i = 0; i < jobCard.length; i++) {
      let postIdd = new URLSearchParams(JobtitleCard[i].href);
      let jobId = postIdd.get("jvid");
      
      jobCard[i].addEventListener("click", e=> {
      if(screenWidth > 1024) {
          changeParameter(i);
      }else {
          window.location.href = "/viewjobs?jvid=" + jobId;
      }
      getJobId();
      });

      JobtitleCard[i].addEventListener("click", (event)=> {
      if(screenWidth > 1024) {
          event.preventDefault();
      }else {
          JobtitleCard[i].href = "/viewjobs?jvid=" + jobId;
      }
      })
  };
    
    }
};

const handleJobView = (id) => {
    // id && handlePostByid(id);
}

// Getting Job Query, Location, Id from URL
const getParams = () => {
    jobTitleInput.value = jobQuery || "";
    locationInput.value = jobLocation || "";
    jobId && handleJobView(jobId);
}
getParams();

// Mobile job finding
// Detect device screen size
const handleJobPage = () => {
    mobileJobTitleInput.value = jobQuery;
    mobileLocationInput.value = jobLocation;
    const jobBtn = document.querySelector("#btn_text");
    if(jobQuery) {
        jobBtn.textContent = jobQuery + " jobs in " + jobLocation;
    }
}

// Adapt layout based on screen size using CSS media queries
if (screenWidth < 768) {
    handleJobPage();
} else if (screenWidth < 1024) {
    console.log("Medium screen (tablet)");
}