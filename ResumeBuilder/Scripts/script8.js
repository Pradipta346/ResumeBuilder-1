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
    setTextOrHide('#first', data.about[0].first_name);
    setTextOrHide('#middle', data.about[0].middle_name);
    setTextOrHide('#last', data.about[0].last_name);
    setTextOrHide('#title', data.about[0].Designation);
    setTextOrHide('#summaryContainer', data.about[0].Objective);

    const contactInfo = data.contact[0];
    setTextOrHide('#address', contactInfo.address);
    setTextOrHide('#email', contactInfo.email);
    setTextOrHide('#cell', contactInfo.CellNumber);
    setLinkOrHide('#linkedin', formatURL(data.links[0].Linkedin), 'LinkedIn');
    setLinkOrHide('#github', formatURL(data.links[1].Github), 'GitHub');

    toggleSectionVisibility('#summarySection', data.about[0].Objective);
    toggleSectionVisibility('#experienceSection', generateExp(data.experience));
    toggleSectionVisibility('#educationSection', generateEdu(data.education));
    toggleSectionVisibility('#projectsSection', generateProjects(data.projects));
    toggleSectionVisibility('#skillsSection', generateSkills(data.skills));
    toggleSectionVisibility('#languageSection', generateLang(data.language));
    toggleSectionVisibility('#hobbiesSection', generateHobby(data.hobbies));
    toggleSectionVisibility('#certificateSection', generateCertify(data.certifications));
    toggleSectionVisibility('#achievementSection', generateAchievements(data.achievements))

    if (data.profilePhoto) {
        $('#profileImage').attr('src', data.profilePhoto).show();
    } else {
        $('#profileImage').hide();
    }

}

function toggleSectionVisibility(selector, hasContent) {
    if (hasContent) {
        $(selector).show();
    } else {
        $(selector).hide();
    }
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
            <div class="experience-item">
                <div>
                    <h4><small>${formattedstartdate} - ${formattedenddate}</small></h4>
                </div>
                <div class="experience-details">
                    <h5>${item.PositionTitle}</h5>
                    <p>${item.EmployerName}, ${item.Location}</p>
                    <ul><li>${item.Description}</li></ul>
                    ${item.RoleResp ? `<ul><li>${item.RoleResp}</li></ul>` : ''}
                </div>
            </div>
            `;
            jobsDiv.append(jobHtml);
            hasContent = true;
        }
    });
    return hasContent;
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
            <div class="education-item">
                <div>
                    <h4><small>${formattedstartdate} - ${formattedenddate}</small></h4>
                </div>
                <div class="education-details">
                    <h5>${item.EducationDegree}, ${item.Major}</h5>
                    <p>${item.SchoolName}, ${item.City}</p>
                    <p><strong>GPA: ${item.GPA}</strong></p>
                </div>
            </div>
            `;
            eduDiv.append(eduHtml);
            hasContent = true;
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
            var proHtml = `
            <div class="project-item">
                <div class="project-details">
                    <h5>${item.ProjectName} (${displayDateRange})</h5>
                    <p>${item.ProjectDescription}</p>
                    <p style="font-size: 14px;"><i><b>Duration:</b> ${duration}</i></p>
                </div>
            </div>
            `;
            projectsDiv.append(proHtml);
            hasContent = true;
        }
    });
    return hasContent;
}

function generateAchievements(achievements) {
    var achieveDiv = $("#achievement");
    achieveDiv.empty();
    var hasContent = false;

    achievements.forEach(function (item) {
        if (item.AchievementTitle) {

            hasContent = true;
            var achieveHtml = `
            <div class="achievement-item">
                <div class="achievement-details">
                    <h5>${item.AchievementTitle}</h5>
                    <p>${item.AchievementDescription}</p>
                </div>
            </div>
            `;
            achieveDiv.append(achieveHtml);
            hasContent = true;
        }
    });
    return hasContent;
}

function generateCertify(certificates) {
    var certificatesDiv = $("#certificate");
    certificatesDiv.empty();
    var hasContent = false;

    certificates.forEach(function (item) {
        if (item.CertificationName) {
            hasContent = true;
            var certHtml = `
            <div class="certification-item">
          <div class="certification-details">
          <p>${item.CertificationName}</p>
          </div>
        </div>
            `;
            certificatesDiv.append(certHtml);
            hasContent = true;
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
            <div class="skill-title"><p><strong>${item.Skill_name}</strong></p></div>
            `;
            skillsDiv.append(skillHtml);
            hasContent = true;
        }
    });
    return hasContent;
}

function generateLang(languages) {
    var langDiv = $("#languages");
    langDiv.empty();
    var hasContent = false;

    languages.forEach(function (item) {
        if (item.LanguageName) {
            hasContent = true;
            var langHtml = `
                <p>${item.LanguageName}</p>
            `;
            langDiv.append(langHtml);
            hasContent = true;
        }
    });
    return hasContent;
}

function generateHobby(hobbies) {
    var hobbyDiv = $("#hobbies");
    hobbyDiv.empty();
    var hasContent = false;

    hobbies.forEach(function (item) {
        if (item.HobbyName) {
            hasContent = true;
            var hobbyHtml = `<p>${item.HobbyName}</p>`;
            hobbyDiv.append(hobbyHtml);
            hasContent = true;
        }
    });
    return hasContent;
}