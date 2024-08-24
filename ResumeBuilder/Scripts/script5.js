$(document).ready(function () {

    $('#downloadBothButton').click(async function () {
        await downloadPageAsHTML();
        await new Promise(resolve => setTimeout(resolve, 5000));
        window.location.href = '/Home/DownloadPdf'; //@Url.Action("DownloadPdf", "Home")
    });

});

function downloadPageAsHTML() {
    return new Promise((resolve) => {
        const container = document.querySelector('div.container');
        if (!container) {
            console.error('No div with class "container" found.');
            resolve();
            return;
        }

        const containerHtmlContent = container.innerHTML;
        const cssPromises = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
            .filter(link => !link.href.includes('cdnjs.cloudflare.com'))
            .map(link => {
                return fetch(link.href)
                    .then(response => response.text())
                    .then(css => {
                        return `<style>${css}</style>`;
                    });
            });

        Promise.all(cssPromises).then(styles => {
            const updatedHtmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto&display=swap" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
      crossorigin="anonymous" referrerpolicy="no-referrer" />
                    ${styles.join('\n')}
                </head>
                <body>
                    <div class="container">
                        ${containerHtmlContent}
                    </div>
                </body>
                </html>
            `;

            // Create and download the updated HTML file
            const blob = new Blob([updatedHtmlContent], { type: 'text/html' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'ResumeDownload.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            resolve();
        });
    });
}
$(document).ready(function () {
    let storedData = sessionStorage.getItem('formData');
    if (storedData) {
        let formData = JSON.parse(storedData);
        fillResumeData(formData);
    }
});

function fillResumeData(data) {

    function getInitials(name) {
        const names = name.split(' ');
        let initials = '';
        for (const n of names) {
            initials += n.charAt(0);
        }
        return initials;
    }



    const header = document.getElementById('header');


    const fullName = `${data.about[0].first_name} ${data.about[0].middle_name} ${data.about[0].last_name}`;
    const initialsText = getInitials(fullName);

    const initials = document.createElement('div');
    initials.className = 'initials';
    initials.textContent = initialsText;


    const name = document.createElement('h1');
    name.textContent = fullName;

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = `${data.about[0].Designation}`;


    header.appendChild(initials);
    header.appendChild(name);
    header.appendChild(title);




    setTextOrHide('#summaryContainer', data.about[0].Objective);
    setTextOrHide('#address', data.contact[0].address);
    setTextOrHide('#email', data.contact[0].email);
    setTextOrHide('#cell', data.contact[0].CellNumber);
    setLinkOrHide('#linkedin', formatURL(data.links[0].Linkedin), 'LinkedIn');
    setLinkOrHide('#github', formatURL(data.links[1].Github), 'GitHub');

    toggleSectionVisibility('#summarySection', data.about[0].Objective);
    toggleSectionVisibility('#educationSection', generateEdu(data.education));
    toggleSectionVisibility('#experienceSection', generateExp(data.experience));
    toggleSectionVisibility('#projectsSection', generateProjects(data.projects));
    toggleSectionVisibility('#skillsSection', generateSkills(data.skills));
    toggleSectionVisibility('#hobbiesSection', generateHobby(data.hobbies));
    toggleSectionVisibility('#achievementsSection', generateAchievements(data.achievements));
    toggleSectionVisibility('#certificatesSection', generateCertifications(data.certifications));
    toggleSectionVisibility('#languageSection', generateLang(data.language));
}

function setLinkOrHide(selector, url, text) {
    if (url) {
        $(selector).html(`<i class="${$(selector).find('i').attr('class')}"></i> <a href="${url}" target="_blank" class="plain-link">${text}</a>`).show();
    } else {
        $(selector).hide();
    }
}

function formatURL(url) {
    if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:')) {
        return 'https://' + url;
    }
    return url;
}

function setTextOrHide(selector, text) {
    if (text) {
        if (selector === '#email') {
            $(selector).html(`<i class="${$(selector).find('i').attr('class')}"></i> <a href="mailto:${text}" class="plain-link">${text}</a>`).show();
        } else {
            $(selector).html(`<i class="${$(selector).find('i').attr('class')}"></i> ${text}`).show();
        }
    } else {
        $(selector).hide();
    }
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
}

function getDateRangeDisplay(startDateString, endDateString) {
    if (!startDateString || !endDateString) return '';

    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    if (startYear === endYear && startMonth === endMonth) {
        return formatDate(startDateString);
    } else {
        return formatDate(startDateString) + ' - ' + formatDate(endDateString);
    }
}


function calculateDuration(startDateString, endDateString) {
    if (!startDateString || !endDateString) return '';
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);

    const startMonth = startDate.getMonth();
    const startYear = startDate.getFullYear();
    const endMonth = endDate.getMonth();
    const endYear = endDate.getFullYear();

    const months = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    let duration;
    if (startYear === endYear && startMonth === endMonth) {
        return '1 month'
    } else {
        return months === 1 ? '2 months' : months + ' months';
    }
}
    function toggleSectionVisibility(selector, hasContent) {
        if (hasContent) {
            $(selector).show();
        } else {
            $(selector).hide();
        }
    }

    function generateEdu(education) {
        var eduDiv = $("#educations");
        eduDiv.empty();
        var hasContent = false;

        education.forEach(function (item) {
            if (item.SchoolName) {
                const formattedstartdate = formatDate(item.StartDate);
                const formattedenddate = formatDate(item.EndDate);
                hasContent = true;
                var eduHtml = `
                <div class="timeline-item">
                    <h4>${item.EducationDegree} in ${item.Major}, ${item.SchoolName}, ${item.City} <small>(${formattedstartdate} - ${formattedenddate})</small></h4>
                    <ul>
                    <li><b>GPA: </b>${item.GPA}</li>
                    </ul>
                </div>
            `;
                eduDiv.append(eduHtml);
            }
        });

        return hasContent;
    }

    function generateExp(experience) {
        var jobsDiv = $("#jobs");
        jobsDiv.empty();
        var hasContent = false;

        experience.forEach(function (item) {
            if (item.PositionTitle) {
                const formattedstartdate = formatDate(item.StartDate);
                const formattedenddate = formatDate(item.EndDate);
                hasContent = true;
                var jobHtml = `
                <div class="timeline-item">
                    <h4>${item.PositionTitle} at ${item.EmployerName}, ${item.Location} <small>(${formattedstartdate} - ${formattedenddate})</small></h4>
                    <ul>
                        <li>${item.Description}</li>
                    </ul>
                    ${item.RoleResp ? `<ul><li>${item.RoleResp}</li></ul>` : ''}
                </div>
            `;
                jobsDiv.append(jobHtml);
            }
        });

        return hasContent;
    }

    function generateProjects(projects) {
        var projectsDiv = $("#projects");
        projectsDiv.empty();
        var hasContent = false;

        projects.forEach(function (item) {
            if (item.ProjectName) {
                const duration = calculateDuration(item.StartDate, item.EndDate);
                const displayDateRange = getDateRangeDisplay(item.StartDate, item.EndDate);
                hasContent = true;
                var projectsHtml = `
                <div class="timeline-item">
                    <h4>${item.ProjectName} <small>(${displayDateRange})</small></h4>
                    <p>${item.ProjectDescription}</p>
                    <p><i><b>Duration:</b> ${duration}</i></p>
                </div>
            `;
                projectsDiv.append(projectsHtml);
            }
        });

        return hasContent;
    }

    function generateSkills(skills) {
        var skillsDiv = $("#skills");
        skillsDiv.empty();
        var hasContent = false;

        skills.forEach(function (item) {
            if (item.Skill_name) {
                hasContent = true;
                var skillHtml = `
                <li>${item.Skill_name}</li>
            `;
                skillsDiv.append(skillHtml);
            }
        });

        return hasContent;
    }

    function generateHobby(hobbies) {
        var hobbiesDiv = $("#hobbies");
        hobbiesDiv.empty();
        var hasContent = false;

        hobbies.forEach(function (item) {
            if (item.HobbyName) { 
                hasContent = true;
                var hobbyHtml = `
                <li>${item.HobbyName}</li>
            `;
                hobbiesDiv.append(hobbyHtml);
            }
        });

        return hasContent;
    }
    function generateAchievements(achievements) {
        var achievementsDiv = $("#achievements");
        achievementsDiv.empty();
        var hasContent = false;

        achievements.forEach(function (item) {
            if (item.AchievementTitle) {
                hasContent = true;
                var achievementsHtml = `
                <li><strong>${item.AchievementTitle}</strong></li>
                <p>${item.AchievementDescription}</p>
            `;
                achievementsDiv.append(achievementsHtml);
                hasContent = true;
            }
        });
        return hasContent;
    }
    function generateLang(langs) {
        var langsDiv = $("#languages");
        langsDiv.empty();
        var hasContent = false;

        langs.forEach(function (item) {
            if (item.LanguageName) {
                hasContent = true;
                var langHtml = `
                <li>${item.LanguageName}</li>
            `;
                langsDiv.append(langHtml);
                hasContent = true;
            }
        });
        return hasContent;
    }
    function generateCertifications(certifications) {
        var certificationsDiv = $("#certifications");
        certificationsDiv.empty();
        var hasContent = false;

        certifications.forEach(function (item) {
            if (item.CertificationName) {
                hasContent = true;
                var certificationsHtml = `
                    <li>${item.CertificationName}</li>
            `;
                certificationsDiv.append(certificationsHtml);
                hasContent = true;
            }
        });
        return hasContent;
    }