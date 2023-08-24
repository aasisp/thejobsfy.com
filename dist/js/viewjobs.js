import {header} from "./header.js";
import {footer} from "./footer.js";

header();
footer();

const mainCont = document.querySelector("main");
const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get("jvid");


fetch("/data/location.json")
.then(response => {
    if (!response.ok) {
    throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(dbUrls => {
    const getUrls = dbUrls.map(db => db.url);
    const jobsCollection = [];

    const fetchPromises = getUrls.map(url =>
    fetch(url)
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            data.forEach(company => {
                const matchingJob = company.jobOpening.find(job => job.id === jobId);
                
                if (matchingJob) {
                    const jobLocation = matchingJob.jobLocation || company.hQLocation;

                    jobsCollection.push({
                        "position": matchingJob.position,
                        "cmpName": company.cmpName,
                        "jobLocation": jobLocation,
                        "type": matchingJob.tags,
                        "apply": matchingJob.apply,
                        "aboutCmp": company.aboutCmp,
                        "jobDescription": matchingJob.jobDescription
                    });
                }
            });            
        })
        .catch(error => {
        console.error('Fetch error:', error);
        })
    );

    return Promise.all(fetchPromises)
    .then(() => {
        const dataAbs = jobsCollection[0];
        const siteTitleTag = document.querySelector("title");


        if(!jobId || !dataAbs) {
            siteTitleTag.textContent = "Page not found";
            mainCont.innerHTML = `<style> main {height:85vh;}</style>
                                <div class="not_found">
                                    <div class="text">Oops!</div>
                                    <div class="sub_text">Page not found!</div>
                                    <div class="min_text">It looks like this page isn't available. Check the URL for any typos.</div>
                                    <div class="return_home_btn">
                                        <a href="/"><button href="/">Go to home</button></a>
                                    </div>
                                </div>`
            // const metaRobot = document.querySelector('[name="robots"]');
            // metaRobot.content = "noindex, nofollow";
        }else {

            // Meta tags and site title tags
            const siteTitle = dataAbs.position + " - " + dataAbs.jobLocation  + " - " + "TheJobsfy.com";
            const siteDescription = "Apply to " + dataAbs.position + " at " + dataAbs.cmpName + " in " + dataAbs.jobLocation + " with highest salary offer.";
            const siteCononcialTag = document.createElement("link");
            siteCononcialTag.rel = "canonical";
            siteCononcialTag.href = window.location.href;
            document.head.appendChild(siteCononcialTag);

            siteTitleTag.textContent = siteTitle;
            
            const siteMetaAtt = [
                { property: "og:url", content: window.location.href },
                { property: "og:title", content: siteTitle },
                { property: "og:description", content: siteDescription },
                { property: "twitter:url", content: window.location.href },
                { property: "twitter:title", content: siteTitle },
                { property: "twitter:description", content: siteDescription },
                { name: "title", content: siteTitle },
                { name: "description", content: siteDescription },
            ];
    
            for (const metaInfo of siteMetaAtt) {
                const metaTag = document.createElement("meta");
                
                for (const key in metaInfo) {
                    metaTag.setAttribute(key, metaInfo[key]);
                }
                
                document.head.appendChild(metaTag);
            }


            // Viewjobs 
            mainCont.innerHTML = `<div class="view_job">
                                    <div class="jobview_head">
                                        <div class="job_heading">
                                            <h1 class="job_title">${dataAbs.position}</h1>
                                        </div>
                                        <div class="job_info">
                                            <div class="company_details">
                                                <div class="cmp_name">${dataAbs.cmpName}</div>
                                                <div class="job_location">${dataAbs.jobLocation}</div>
                                            </div>
                                            <div class="tags"></div>
                                        </div>
                                    </div>
                                    <div class="body">
                                       <p><b>About</b></p>
                                       <p>${dataAbs.aboutCmp}</p>
                                    </div>
                                    <div class="jobview_foot">
                                        <div class="apply_btn"><button id="apply_btn" href="${dataAbs.apply}">Apply on company site
                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                                                <mask id="path-1-inside-1_477_9" fill="white">
                                                <path d="M0 2C0 1.44772 0.447715 1 1 1H9C9.55228 1 10 1.44772 10 2V10C10 10.5523 9.55228 11 9 11H1C0.447716 11 0 10.5523 0 10V2Z"/>
                                                </mask>
                                                <path d="M0 1H10H0ZM10 10C10 11.1046 9.10457 12 8 12H1C-0.104569 12 -1 11.1046 -1 10H1H9C9.55228 10 10 10 10 10ZM1 12C-0.104569 12 -1 11.1046 -1 10V3C-1 1.89543 -0.104569 1 1 1C1 1 1 1.44772 1 2V10V12ZM10 1V11V1Z" fill="white" mask="url(#path-1-inside-1_477_9)"/>
                                                <line x1="1" y1="1.5" x2="4" y2="1.5" stroke="white"/>
                                                <line x1="9.5" y1="10" x2="9.5" y2="7" stroke="white"/>
                                                <path d="M10.5 1C10.5 0.723858 10.2761 0.5 10 0.5L5.5 0.5C5.22386 0.5 5 0.723858 5 1C5 1.27614 5.22386 1.5 5.5 1.5H9.5V5.5C9.5 5.77614 9.72386 6 10 6C10.2761 6 10.5 5.77614 10.5 5.5L10.5 1ZM3.35355 8.35355L10.3536 1.35355L9.64645 0.646447L2.64645 7.64645L3.35355 8.35355Z" fill="white"/>
                                                </svg>
                                        </button></div>
                                    </div>
                                </div>`;

            const typeList = document.querySelector(".tags");

            dataAbs.type.forEach(value => {
                const tagItem = document.createElement("div");
                tagItem.classList.add("tag_item");
                tagItem.textContent = value;
                typeList.appendChild(tagItem);
            });
                                

            const jobDetails = dataAbs.jobDescription[0]
            const jobBody = document.querySelector(".body");
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


            const applyBtn = document.querySelector("#apply_btn");
            applyBtn.addEventListener("click", ()=> {
                let jobUrl = applyBtn.getAttribute("href");
                window.open(jobUrl, "_blank");
            })

        // Get the total height of the page's content
        const totalPageHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        
        // Get the height of the visible viewport
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        
        // Calculate the total scrollable distance
        const totalScrollableDistance = totalPageHeight - viewportHeight;
  
            // Float apply job button
            const screenWidth = window.innerWidth;
    
            if (screenWidth < 1024) {
                const applyBtn = document.querySelector(".apply_btn");
                applyBtn.style.padding = "20px 36px";
            
                function handleScroll() {
                    const scroll = window.scrollY;
                    const scrollPosition = applyBtn.scrollTop;
    
                    if (scroll < (totalScrollableDistance - 80)) {
                        applyBtn.style.position = "fixed";
                        applyBtn.style.padding = "20px 36px";
                    } else {
                        applyBtn.style.position = "static";
                        applyBtn.style.padding = "20px";
                    }
                }
                window.addEventListener("scroll", handleScroll);
            }
        }
        console.log('All fetches completed successfully');
    })
    .catch(error => {
        console.error('One or more fetches failed:', error);
    });

})
.then(() => {
    console.log('All operations completed successfully');
})
.catch(error => {
    console.error('Fetch error:', error);
});