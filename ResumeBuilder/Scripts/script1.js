$(document).ready(function () {
    function selectColorCircle(element) {
        $('.color-circle').removeClass('selected');
        element.addClass('selected');
    }

    selectColorCircle($('.color-circle[data-color="temp1_default"]'));

    $('.color-circle').click(function () {
        var color = $(this).data('color');
        $('#themeStylesheet').attr('href', '/Content/temp1_css/' + color + '.css');
        selectColorCircle($(this));
    });

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
    setTextOrHide('#address', data.contact[0].address);
    setTextOrHide('#email', data.contact[0].email);
    setTextOrHide('#cell', data.contact[0].CellNumber);
    setLinkOrHide('#linkedin', formatURL(data.links[0].Linkedin), 'LinkedIn');
    setLinkOrHide('#github', formatURL(data.links[1].Github), 'GitHub');
    toggleSectionVisibility('#summarySection', data.about[0].Objective);
    toggleSectionVisibility('#experienceSection', generateExp(data.experience));
    toggleSectionVisibility('#educationSection', generateEdu(data.education));
    toggleSectionVisibility('#projectSection', generatePro(data.projects));
    toggleSectionVisibility('#hobbySection', populateList('#hobby', data.hobbies, 'HobbyName'));
    toggleSectionVisibility('#languageSection', populateList('#language', data.language, 'LanguageName'));
    toggleSectionVisibility('#achievementSection', generateAchieve(data.achievements));
    toggleSectionVisibility('#skillsSection', populateList('#skills', data.skills, 'Skill_name'));
    toggleSectionVisibility('#certificateSection', populateList('#certificate', data.certifications, 'CertificationName'));
    if (data.profilePhoto) {
        $('#profileImage').attr('src', data.profilePhoto).show();
    } else {
        $('#profileImage').hide();
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


function toggleSectionVisibility(selector, hasContent) {
    if (hasContent) {
        $(selector).show();
    } else {
        $(selector).hide();
    }
}
function populateList(containerSelector, items, ...keys) {
    var ul = $("<ul></ul>");
    var hasContent = false;
    items.forEach(function (item) {
        var text = keys.map(key => item[key]).filter(Boolean).join(' | ');
        if (text) {
            ul.append($("<li></li>").text(text));
            hasContent = true;
        }
    });
    if (hasContent) {
        $(containerSelector).empty().append(ul).show();
    } else {
        $(containerSelector).hide();
    }
    return hasContent;
}



function generateExp(experience) {
    var jobsDiv = $("#jobs");
    jobsDiv.empty();
    var hasContent = false;

    experience.forEach(function (item) {
        if (item.PositionTitle) {
            const formattedStartDate = formatDate(item.StartDate);
            const formattedEndDate = formatDate(item.EndDate);

            jobsDiv.append("<h4>" + item.PositionTitle + " | " + item.EmployerName + " | " + item.Location + " <br> " + formattedStartDate + " - " + formattedEndDate + "</h4><p>" + item.Description + "</p>");

            var ul = $("<ul></ul>");
            ul.append("<li>" + item.RoleResp + "</li>");
            jobsDiv.append(ul);
            hasContent = true;
        }
    });

    return hasContent;
}

function generateEdu(education) {
    var educationsDiv = $("#educations");
    educationsDiv.empty();
    var hasContent = false;
    education.forEach(function (item) {
        if (item.SchoolName) {
            // educationsDiv.append("<div><b>" + item.SchoolName + " | " + item.City + " | " + item.Edudate + "</b></div>");
            // educationsDiv.append("<div>" + item.EducationDegree + ", " + item.Major + " | " + "<b>GPA: " + item.GPA + "</b></div>");
            const formattedStartDate = formatDate(item.StartDate);
            const formattedEndDate = formatDate(item.EndDate);
            educationsDiv.append("<div><b>" + item.EducationDegree + " (" + formattedStartDate + " - " + formattedEndDate + ")" + "</b></div>")
            var ul = $("<ul></ul>");
            ul.append("<li>" + item.SchoolName + " | " + item.Major + " | " + item.GPA + "</li>");
            ul.append("<li>" + item.City + "</li>");
            educationsDiv.append(ul);
            hasContent = true;
        }
    });
    return hasContent;
}

function generatePro(project) {
    var projectDiv = $("#project");
    projectDiv.empty();
    var hasContent = false;

    project.forEach(function (item) {
        if (item.ProjectName && item.StartDate && item.EndDate) {
            const duration = calculateDuration(item.StartDate, item.EndDate);
            const displayDateRange = getDateRangeDisplay(item.StartDate, item.EndDate);

            projectDiv.append("<div><b>" + item.ProjectName + " (" + displayDateRange + ")" + "</b></div>");
            var ul = $("<ul></ul>");
            ul.append("<li>" + item.ProjectDescription + "</li>");
            ul.append("<li><strong>Duration:</strong> " + duration + "</li>");
            projectDiv.append(ul);
            hasContent = true;
        }
    });
    return hasContent;
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


function generateAchieve(achievements) {
    var achieveDiv = $("#achievement");
    achieveDiv.empty();
    var hasContent = false;
    achievements.forEach(function (item) {
        if (item.AchievementTitle) {
            achieveDiv.append("<div><b>" + item.AchievementTitle + "</b></div>");
            var ul = $("<ul></ul>");
            ul.append("<li>" + item.AchievementDescription + "</li>");
            achieveDiv.append(ul);
            hasContent = true;
        }
    });
    return hasContent;
}