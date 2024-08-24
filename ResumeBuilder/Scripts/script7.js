$(document).ready(function () {

    $('#downloadBothButton').click(async function () {
        await downloadPageAsHTML();
        await new Promise(resolve => setTimeout(resolve, 5000));
        window.location.href = '/Home/DownloadPdf'; //@Url.Action("DownloadPdf", "Home")
    });

});

function downloadPageAsHTML() {
    return new Promise((resolve) => {
        const container = document.querySelector('div.resume');
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
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g=="
      crossorigin="anonymous" referrerpolicy="no-referrer" />
                    ${styles.join('\n')}
                </head>
                <body>
                    <div class="resume">
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
    setTextOrHide('#first', data.about[0].first_name);
    setTextOrHide('#middle', data.about[0].middle_name);
    setTextOrHide('#last', data.about[0].last_name);
    setTextOrHide('#title', data.about[0].Designation);
   setTextOrHide('#summaryContainer', data.about[0].Objective);
    setTextOrHide('#address', data.contact[0].address);
    setTextOrHide('#email', data.contact[0].email);
    setTextOrHide('#cell', data.contact[0].CellNumber);
    setLinkOrHide('#linkedin', formatURL(data.links[0].Linkedin), 'LinkedIn');
    setLinkOrHide('#github', formatURL(data.links[1].Github), 'GitHub');

    
    toggleSectionVisibility('#summarySection', data.about[0].Objective);
    toggleSectionVisibility('#skillsSection', generateSkills(data.skills));
    toggleSectionVisibility('#experienceSection', generateExp(data.experience));
    toggleSectionVisibility('#educationSection', generateEdu(data.education));
    toggleSectionVisibility('#projectsSection', generateProjects(data.projects));
    toggleSectionVisibility('#languageSection', generateLang(data.language));
    toggleSectionVisibility('#hobbiesSection', generateHobby(data.hobbies));
    toggleSectionVisibility('#achievementsSection', generateAchievements(data.achievements));
    toggleSectionVisibility('#certificatesSection', generateCertifications(data.certifications));
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


function toggleSectionVisibility(selector, hasContent) {
    if (hasContent) {
        $(selector).show();
    } else {
        $(selector).hide();
    }
}

function generateSkills(skills) {
    var skillsDiv = $("#skills");
    skillsDiv.empty();
    var hasContent = false;

    skills.forEach(function (item) {
        if (item.Skill_name) {
            hasContent = true;
            var skillHtml = `
                <div class="skill-item">${item.Skill_name}</div>
            `;
            skillsDiv.append(skillHtml);
        }
    });

    return hasContent;
}

function generateEdu(education) {
    var eduDiv = $("#education");
    eduDiv.empty();
    var hasContent = false;

    education.forEach(function (item) {
        if (item.SchoolName) {
            const formattedstartdate = formatDate(item.StartDate);
            const formattedenddate = formatDate(item.EndDate);
            hasContent = true;
            var eduHtml = `
            <li><span class="date">${formattedstartdate} - ${formattedenddate}</span> <span class="degree">${item.EducationDegree}, ${item.Major}</span> <span class="school">${item.SchoolName}, ${item.City}</span> <span><b>GPA: </b>${item.GPA}</span></li><br>
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
            <li><span class="date">${formattedstartdate} - ${formattedenddate}</span> <span class="title-1">${item.PositionTitle}</span> <span class="school">${item.EmployerName}, ${item.Location}</span></li>
            <ul>
                        <li>${item.Description}</li>
                    </ul>
                    ${item.RoleResp ? `<ul><li>${item.RoleResp}</li></ul>` : ''}<br>
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
            const displayDateRange = getDateRangeDisplay(item.StartDate, item.EndDate);
            hasContent = true;
            var projectsHtml = `
            <li><span class="title-1">${item.ProjectName} (${displayDateRange})</span> <span class="school">${item.ProjectDescription}</span></li>
            `;
            projectsDiv.append(projectsHtml);
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
            <li><span class="title-1">${item.AchievementTitle}</span> <span class="school">${item.AchievementDescription}</span></li>
            `;
            achievementsDiv.append(achievementsHtml);
            hasContent = true;
        }
    });
    return hasContent;
}