// form repeater
$(document).ready(function () {
    $('.repeater').repeater({
        initEmpty: false,
        defaultValues: {
            'text-input': ''
        },
        show: function () {
            $(this).slideDown();
        },
        hide: function (deleteElement) {
            $(this).slideUp(deleteElement);
        },
        isFirstItemUndeletable: true
    });
});



$(document).ready(function () {
    let availableSkills = [];

    // Load skills for autocomplete
    $.getJSON('/Scripts/Skills.json', function (data) {
        // Extract skills from the array of objects
        availableSkills = data.map(item => item.skills);
    });

    // Fetch data via AJAX
    $.ajax({
        url: "/Scripts/Data.json",
        success: function (result) {
            $("#GivenName").val(result.JobPositionSeeker.PersonalData.PersonName.GivenName);
            $("#MiddleName").val(result.JobPositionSeeker.PersonalData.PersonName.MiddleName);
            $("#FamilyName").val(result.JobPositionSeeker.PersonalData.PersonName.FamilyName);
            $("#AddressLine").val(result.JobPositionSeeker.PersonalData.PostalAddress.DeliveryAddress.AddressLine.join(", "));
            $("#CountryCode").val(result.JobPositionSeeker.PersonalData.PostalAddress.CountryCode);
            $("#HTelNumber").val(result.JobPositionSeeker.PersonalData.WorkNumber.TelNumber);
            $("#WTelNumber").val(result.JobPositionSeeker.PersonalData.HomeNumber.TelNumber);
            $("#CTelNumber").val(result.JobPositionSeeker.PersonalData.HomeNumber.TelNumber);

            // Initialize skills from data
            let skills = result.JobPositionSeeker.Resume.StructureResume.Skills.split("||");
            let skillContainer = $('#SkillsContainer');
            skillContainer.empty();
            skills.forEach((skill, index) => {
                let skillId = `Skills_${index}`;
                skillContainer.append(`
                                <div class="form-elem repeater-item" id="skill-${index}">
                                    <input name="skill" type="text" class="form-control skill" id="${skillId}" placeholder="Enter Your Skill" value="${skill}">
                                    <span class="form-text"></span>
                                    <button type="button" class="remove-skill repeater-remove-btn" data-skill-id="skill-${index}">
                  <span class="material-symbols-outlined">close</span>
            </button>
                                </div>
                            `);
            });

            // Initialize autocomplete for existing skills
            initializeAutocomplete('.skill');

            // Add new skill function
            $('#add-skill-btn').click(function () {
                let newIndex = skillContainer.find('.repeater-item').length;
                let newSkillId = `Skills_${newIndex}`;
                let newSkill = $(`
                                <div class="form-elem repeater-item" id="skill-${newIndex}">
                                    <input name="skill" type="text" class="form-control skill" id="${newSkillId}" placeholder="Enter Your Skill">
                                    <span class="form-text"></span>
                                    <button type="button" class="remove-skill repeater-remove-btn" data-skill-id="skill-${newIndex}">
                  <span class="material-symbols-outlined">close</span>
            </button>
                                </div>
                            `);
                skillContainer.append(newSkill);
                newSkill.slideDown();
                initializeAutocomplete(`#${newSkillId}`);
            });

            // Remove skill function
            skillContainer.on('click', '.remove-skill', function () {
                let skillId = $(this).data('skill-id');
                $(`#${skillId}`).remove();
            });

    // Function to initialize autocomplete
    function initializeAutocomplete(selector) {
        $(selector).autocomplete({
            source: availableSkills,
            minLength: 2
        }).focus(function () {
            $(this).autocomplete("search", "");
        });
    }

            // ------------------------------ End of Skills Part-------------------------------------------------------------


            // ----------------------------------Experience Part--------------------------------------------------------------

            // Initialize employment history
            let employmentHistory = result.JobPositionSeeker.Resume.StructureResume.EmploymentHistory.Employment;
            let experienceContainer = $('#ExperienceContainer');
            experienceContainer.empty();
            employmentHistory.forEach((employment, index) => {
                let employmentId = `Experience_${index}`;
                let expstartDate = formatYearToDate(employment.EffectiveDate.StartDate.Date);
                let expendDate = formatYearToDate(employment.EffectiveDate.EndDate.Date);
                experienceContainer.append(`
         <div data-repeater-item class="form-elem repeater-item" id="experience-${index}">
             <div class="cv-form-row cv-form-row-experience">
                 <div class="cols-3">
                     <!-- Title -->
                     <div class="form-elem">
                         <label for="" class="form-label">Title</label>
                         <input name="exp_title" type="text" class="form-control exp_title" id="PositionTitle_${index}" placeholder="Enter Your Position Title" value="${employment.PositionTitle}">
                         <span class="form-text"></span>
                     </div>
                     <!-- Company name -->
                     <div class="form-elem">
                         <label for="" class="form-label">Company / Organization</label>
                         <input name="exp_organization" type="text" class="form-control exp_organization" id="EmployerName_${index}" placeholder="Enter Organization" value="${employment.EmployerName}">
                         <span class="form-text"></span>
                     </div>
                     <!-- Location -->
                     <div class="form-elem">
                         <label for="" class="form-label">Location</label>
                         <input name="exp_location" type="text" class="form-control exp_location" id="location_${index}" placeholder="Enter Location" value="${employment.Location}">
                         <span class="form-text"></span>
                     </div>
                 </div>
                 <div class="cols-3">
                     <!-- Start date -->
                     <div class="form-elem">
                         <label for="" class="form-label">Start Date</label>
                         <input name="exp_start_date" type="date" class="form-control exp_start_date" id="Date_${index}" placeholder="Enter Start Date" value="${expstartDate}">
                         <span class="form-text"></span>
                     </div>
                     <!-- End date -->
                     <div class="form-elem">
                         <label for="" class="form-label">End Date</label>
                         <input name="exp_end_date" type="date" class="form-control exp_end_date" id="EDate_${index}" placeholder="Enter End Date" value="${expendDate}">
                         <span class="form-text"></span>
                     </div>
                     <!-- Description -->
                     <div class="form-elem">
                         <label for="" class="form-label">Description</label>
                         <textarea id="description_${index}" placeholder="Enter description" class="form-control description">${employment.Responsibilities}</textarea>
                         <span class="form-text"></span>
                     </div>
                 </div>
                 <div class="cols-3">
                 <div class="form-elem">
                         <label for="" class="form-label">Role & Responsibilities</label>
                         <textarea id="Role_${index}" placeholder="Enter your Role" class="form-control role"></textarea>
                         <span class="form-text"></span>
                     </div>
                 </div>
                 <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
             </div>
         </div>
     `);
            });

            // Add new experience function
            $('#add-experience-btn').click(function () {
                let newIndex = experienceContainer.find('.repeater-item').length;
                let newExperienceId = `Experience_${newIndex}`;
                let newExperience = $(`
         <div data-repeater-item class="form-elem repeater-item" id="experience-${newIndex}">
             <div class="cv-form-row cv-form-row-experience">
                 <div class="cols-3">
                     <!-- Title -->
                     <div class="form-elem">
                         <label for="" class="form-label">Title</label>
                         <input name="exp_title" type="text" class="form-control exp_title" id="PositionTitle_${newIndex}" placeholder="Enter your Position Title">
                         <span class="form-text"></span>
                     </div>
                     <!-- Company name -->
                     <div class="form-elem">
                         <label for="" class="form-label">Company / Organization</label>
                         <input name="exp_organization" type="text" class="form-control exp_organization" id="EmployerName_${newIndex}" placeholder="Enter Organization">
                         <span class="form-text"></span>
                     </div>
                     <!-- Location -->
                     <div class="form-elem">
                         <label for="" class="form-label">Location</label>
                         <input name="exp_location" type="text" class="form-control exp_location" id="location_${newIndex}" placeholder="Enter Your Location">
                         <span class="form-text"></span>
                     </div>
                 </div>
                 <div class="cols-3">
                     <!-- Start date -->
                     <div class="form-elem">
                         <label for="" class="form-label">Start Date</label>
                         <input name="exp_start_date" type="date" class="form-control exp_start_date" id="Date_${newIndex}" placeholder="Enter Start Date">
                         <span class="form-text"></span>
                     </div>
                     <!-- End date -->
                     <div class="form-elem">
                         <label for="" class="form-label">End Date</label>
                         <input name="exp_end_date" type="date" class="form-control exp_end_date" id="EDate_${newIndex}" placeholder="Enter End Date">
                         <span class="form-text"></span>
                     </div>
                     <!-- Description -->
                     <div class="form-elem">
                         <label for="" class="form-label">Description</label>
                         <textarea id="description_${newIndex}" placeholder="Enter description" class="form-control description"></textarea>
                         <span class="form-text"></span>
                     </div>
                 </div>
                   <div class="cols-3">
                    <!-- Role -->
                     <div class="form-elem">
                         <label for="" class="form-label">Role & Responsibilities</label>
                         <textarea id="Role_${newIndex}" placeholder="Enter your Role" class="form-control role"></textarea>
                         <span class="form-text"></span>
                     </div>

                   </div>
                 
                 <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
             </div>
         </div>
     `);
                experienceContainer.append(newExperience);
                newExperience.slideDown();
            });

            // Remove experience function
            experienceContainer.on('click', '.remove-experience', function () {
                let experienceId = $(this).data('experience-id');
                $(`#${experienceId}`).remove();
            });
            //  ----------------------------------End of Experience Part---------------------------------------------

            //------------------------------------- Education Part------------------------------------------------------

            function formatYearToDate(year) {
                // Return a date string with January 1st of the given year
                return year ? `${year}-01-01` : '';
            }

            // Initialize education history
            let educationQualifs = result.JobPositionSeeker.Resume.StructureResume.EducationQualifs.SchoolOrInstitution;
            let educationContainer = $('#EducationContainer');
            educationContainer.empty();
            educationQualifs.forEach((schoolOrInstitution, index) => {

                let edustartDate = formatYearToDate(schoolOrInstitution.EffectiveDate.StartDate.Date);
                let eduendDate = formatYearToDate(schoolOrInstitution.EffectiveDate.EndDate.Date);

                educationContainer.append(`
        <div data-repeater-item class="form-elem repeater-item" id="education-${index}">
            <div class="cv-form-row cv-form-row-experience">
                <div class="cols-3">
                    <!-- School -->
                    <div class="form-elem">
                        <label for="" class="form-label">School/Institution</label>
                        <input name="edu-school" type="text" class="form-control edu-school" id="SchoolName_${index}" value="${schoolOrInstitution.SchoolName}" placeholder="Enter School Name">
                        <span class="form-text"></span>
                    </div>
                    <!-- Degree -->
                    <div class="form-elem">
                        <label for="" class="form-label">Degree</label>
                        <input name="edu-degree" type="text" class="form-control edu-degree" id="EduDegree_${index}" value="${schoolOrInstitution.EduDegree}" placeholder="Enter Degree">
                        <span class="form-text"></span>
                    </div>
                    <!-- City -->
                    <div class="form-elem">
                       <label for="" class="form-label">City</label>
                        <input name="edu-city" type="text" class="form-control edu-city" id="city_${index}" placeholder="Enter Your City" value="${schoolOrInstitution.City}">
                        <span class="form-text"></span>
                    </div>
                </div>
                <div class="cols-3">
                    <!-- Major -->
                    <div class="form-elem">
                        <label for="" class="form-label">Education Major</label>
                        <input name="edu-major" type="text" class="form-control edu-major" id="EduMajor_${index}" value="${schoolOrInstitution.EduMajor}" placeholder="Enter Major">
                        <span class="form-text"></span>
                    </div>
                    <!-- Start date -->
                    <div class="form-elem">
                        <label for="" class="form-label">Start Date</label>
                        <input name="edu_start_date" type="date" class="form-control edu_start_date" id="Edustart_${index}" value="${edustartDate}" placeholder="Enter Start Year">
                        <span class="form-text"></span>
                    </div>
                    <!-- End date -->
                    <div class="form-elem">
                        <label for="" class="form-label">End Date</label>
                        <input name="edu_end_date" type="date" class="form-control edu_end_date" id="Eduend_${index}" value="${eduendDate}" placeholder="Enter End Year">
                        <span class="form-text"></span>
                    </div>
                </div>
                <div class="cols-3">
                     <!-- GPA-->
                    <div class="form-elem">
                        <label for="" class="form-label">GPA/Percentage</label>
                       <input name="edu_gpa" type="text" class="form-control edu_gpa" id="GPA_${index}" value="${schoolOrInstitution.GPA}" placeholder="Enter your GPA/Percentage">
                       <span class="form-text"></span>
                    </div>
                </div>
               <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
            </div>
        </div>
    `);
            });


            // Add new education function
            $('#add-education-btn').click(function () {
                let newIndex = educationContainer.find('.repeater-item').length;
                let newEducationId = `Education_${newIndex}`;
                let newEducation = $(`
         <div data-repeater-item class="form-elem repeater-item" id="education-${newIndex}">
             <div class="cv-form-row cv-form-row-experience">
                 <div class="cols-3">
                     <!-- School -->
                    <div class="form-elem">
                         <label for="" class="form-label">School/Institution</label>
                         <input name="edu-school" type="text" class="form-control edu_school" id="SchoolName_${newIndex}" placeholder="Enter School Name">
                         <span class="form-text"></span>
                     </div>
                     <!-- Degree-->
                     <div class="form-elem">
                         <label for="" class="form-label">Degree</label>
                         <input name="edu-degree" type="text" class="form-control edu-degree" id="EduDegree_${newIndex}" placeholder="Enter Degree">
                         <span class="form-text"></span>
                     </div>
                     <!-- City-->
                     <div class="form-elem">
                         <label for="" class="form-label">City</label>
                         <input name="edu-city" type="text" class="form-control edu-city" id="city_${newIndex}" placeholder="Enter Your City">
                         <span class="form-text"></span>
                     </div>
                 </div>
                 <div class="cols-3">
                     <!-- Major -->
                     <div class="form-elem">
                         <label for="" class="form-label">Education Major</label>
                         <input name="edu-major" type="text" class="form-control edu-major" id="EduMajor_${newIndex}" placeholder="Enter Major">
                         <span class="form-text"></span>
                     </div>
                      <!-- start date -->
                     <div class="form-elem">
                         <label for="" class="form-label">Start Date</label>
                         <input name="edu_start_date" type="date" class="form-control edu_start_date" id="Edustart_${newIndex}" placeholder="Enter Start Year">
                         <span class="form-text"></span>
                     </div>
                     <!-- End date -->
                     <div class="form-elem">
                         <label for="" class="form-label">End Date</label>
                         <input name="edu_end_date" type="date" class="form-control edu_end_date" id="EduDate_${newIndex}" placeholder="Enter End Year">
                         <span class="form-text"></span>
                     </div>
                  
                 </div>
                  <div class="cols-3">
                    <!--GPA-->
                     <div class="form-elem">
                         <label for="" class="form-label">GPA/Percentage</label>
                         <input name = "edu_gpa" type = "text" class = "form-control edu_gpa" id = "GPA_${newIndex}" placeholder="Enter your GPA/Percentage">
                         <span class="form-text"></span>
                     </div>
                  </div>
                 <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
             </div>
         </div>
    `);
                educationContainer.append(newEducation);
                newEducation.slideDown();
            });

            // Remove education function
            educationContainer.on('click', '.remove-education', function () {
                let educationId = $(this).data('education-id');
                $(`#${educationId}`).remove();
            });
            // ------------------------------------End of Education Part--------------------------------------------------

            // ----------------------------------- Achievements Part ------------------------------------------------------

            // Add new Achievements function
            $('#add-achievements-btn').click(function () {
                let achievementsContainer = $('#AchievementsContainer');
                let newIndex = achievementsContainer.find('.repeater-item').length;
                let newAchievementsId = `Achievements_${newIndex}`;
                let newAchievements = $(`
        <div data-repeater-item class="form-elem repeater-item" id="Achievements-${newIndex}">
            <div class="cv-form-row cv-form-row-experience">
                <div class="cols-2">
                    <!-- Title -->
                    <div class="form-elem">
                        <label for="" class="form-label">Title</label>
                        <input name="achieve_title" type="text" class="form-control achieve_title" id="achieve-title_${newIndex}" placeholder="Enter Achievement Title">
                        <span class="form-text"></span>
                    </div>
                    <!-- Description -->
                    <div class="form-elem">
                        <label for="" class="form-label">Description</label>
                        <textarea id="Achievements-description_${newIndex}" placeholder="Enter Achievement Description" class="form-control achievements_description"></textarea>
                        <span class="form-text"></span>
                    </div>
                   
                </div>
                <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
            </div>
        </div>
    `);
                achievementsContainer.append(newAchievements);
                newAchievements.slideDown();
            });

            // ---------------------------------------End Of Achievements-------------------------------------------------



            //--------------------------------------------- Projects Part---------------------------------------------------
            // Add new Projects function
            $('#add-projects-btn').click(function () {
                let projectsContainer = $('#ProjectsContainer');
                let newIndex = projectsContainer.find('.repeater-item').length;
                let newProjectsId = `Projects_${newIndex}`;
                let newProjects = $(`
        <div data-repeater-item class="form-elem repeater-item" id="Projects-${newIndex}">
            <div class="cv-form-row cv-form-row-experience">
                <div class="cols-4">
                    <!-- Project Name -->
                    <div class="form-elem">
                        <label for="" class="form-label">Project Name</label>
                        <input name="projectname" type="text" class="form-control projectname" id="projectname_${newIndex}" placeholder="Enter Project Name">
                        <span class="form-text"></span>
                    </div>
                    <!-- Start Date-->
                     <div class="form-elem">
                        <label for="" class="form-label">Start Date</label>
                        <input name="project_start" type="date" class="form-control project_start " id="project_start_${newIndex}" placeholder="Enter Start Date">
                        <span class="form-text"></span>
                    </div>
                      <!-- End Date-->
                     <div class="form-elem">
                        <label for="" class="form-label">End Date</label>
                        <input name="project_end" type="date" class="form-control project_end" id="project_end_${newIndex}" placeholder="Enter End Date">
                        <span class="form-text"></span>
                    </div>
                    <!-- Description -->
                    <div class="form-elem">
                        <label for="" class="form-label">Description</label>
                        <textarea id="Projects-description_${newIndex}" placeholder="Enter Project Description" class="form-control address"></textarea>
                        <span class="form-text"></span>
                    </div>
                   
                </div>
               <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
            </div>
        </div>
    `);
                projectsContainer.append(newProjects);
                newProjects.slideDown();
            });

            // --------------------------------------------End Of Project Part---------------------------------------------

            // --------------------------------------------Certificate Part--------------------------------------------------
            // Add new Certificate function
            $('#add-certificate-btn').click(function () {
                let certificateContainer = $('#CertificateContainer');
                let newIndex = certificateContainer.find('.repeater-item').length;
                let newCertificateId = `Certificate_${newIndex}`;
                let newCertificate = $(`
        <div data-repeater-item class="form-elem repeater-item" id="Certificate-${newIndex}">
            <div class="cv-form-row cv-form-row-experience">
                <div class="cols-1">
                    <!-- Certificate Name-->
                    <div class="form-elem">
                        <label for="" class="form-label">Certificate Name</label>
                        <input name="certificate-name" type="text" class="form-control certificate-name" id="certificate-name_${newIndex}" placeholder="Enter your Certification Name">
                        <span class="form-text"></span>
                    </div>  
                </div>
                <button data-repeater-delete type="button" class="repeater-remove-btn"><span class="material-symbols-outlined">close</span></button>
            </div>
        </div>
    `);
                certificateContainer.append(newCertificate);
                newCertificate.slideDown();
            });
            // --------------------------------------------End Of Certification Part------------------------------------------
            // --------------------------------------------------Hobbies-------------------------------------------------------

            // Add new hobbies function
            let hobbiesContainer = $('#HobbiesContainer');
            $('#add-hobbies-btn').click(function () {
                let newIndex = hobbiesContainer.find('.repeater-item').length;
                let newHobbiesId = `Hobbies_${newIndex}`;
                let newHobbies = $(`
        <div class="form-elem repeater-item" id="hobbies-${newIndex}">
            <input name="hobbies" type="text" class="form-control hobbies" id="${newHobbiesId}" placeholder="Enter Your Hobby">
            <span class="form-text"></span>
            <button type="button" class="remove-hobbies repeater-remove-btn" data-hobbies-id="hobbies-${newIndex}">
               <span class="material-symbols-outlined">close</span>
               </button
        </div>
    `);
                hobbiesContainer.append(newHobbies);
                newHobbies.slideDown();
            });

            // Remove skill function
            hobbiesContainer.on('click', '.remove-hobbies', function () {
                let hobbiesId = $(this).data('hobbies-id');
                $(`#${hobbiesId}`).remove();
            });
            // --------------------------------------------End Of Hobbies-------------------------------------------------------


            // -----------------------------------------Links Part----------------------------------------------------------------
            //  Add new links function
            let linksContainer = $('#LinksContainer');
            $('#add-links-btn').click(function () {
                let newIndex = linksContainer.find('.repeater-item').length;
                let newLinksId = `Links_${newIndex}`;
                let newLinks = $(`
        <div class="form-elem repeater-item" id="links-${newIndex}">
            <input name="links" type="text" class="form-control links" id="${newLinksId}" placeholder="Enter Your Other Links">
            <span class="form-text"></span>
            <button type="button" class="remove-links repeater-remove-btn" data-links-id="links-${newIndex}">
               <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `);
                linksContainer.append(newLinks);
                newLinks.slideDown();
            });


            linksContainer.on('click', '.remove-links', function () {
                let linksId = $(this).data('links-id');
                $(`#${linksId}`).remove();
            });

            let languagesknownContainer = $('#LanguagesKnownContainer');
            $('#add-languagesknown-btn').click(function () {
                let newIndex = languagesknownContainer.find('.repeater-item').length;
                let newLanguagesKnownId = `LanguagesKnown_${newIndex}`;
                let newLanguagesKnown = $(`
        <div class="form-elem repeater-item" id="languagesknown-${newIndex}">
            <input name="languagesknown" type="text" class="form-control languagesknown" id="${newLanguagesKnownId}" placeholder="Enter Language">
            <span class="form-text"></span>
            <button type="button" class="remove-languagesknown repeater-remove-btn" data-languagesknown-id="languagesknown-${newIndex}">
               <span class="material-symbols-outlined">close</span>
            </button>
        </div>
    `);
                languagesknownContainer.append(newLanguagesKnown);
                newLanguagesKnown.slideDown();
            });

            // Remove skill function
            languagesknownContainer.on('click', '.remove-languagesknown', function () {
                let languagesknownId = $(this).data('languagesknown-id');
                $(`#${languagesknownId}`).remove();
            });

        }
    });
});
// ---------------------------------------- End of links part -----------------------------------------------


// ---------------------------------------- Storing data in session storage --------------------------------
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('button[type="submit"]').addEventListener('click', function (event) {
        event.preventDefault();

        // Extract data from various sections
        let aboutData = extractAboutSection();
        let contactData = extractContactSection();
        let experienceData = extractExperienceData();
        let educationData = extractEducationData();
        let achievementsData = extractAchievementsData();
        let certificationsData = extractCertificationsData();
        let projectsData = extractProjectsData();
        let skillsData = extractSkillData();
        let linksData = extractLinksData();
        let hobbiesData = extractHobbiesData();
        let languageData = extractLanguageData();

        extractProfilePhotoData(function (profilePhotoData) {
            let data = {
                about: aboutData,
                contact: contactData,
                experience: experienceData,
                education: educationData,
                achievements: achievementsData,
                certifications: certificationsData,
                projects: projectsData,
                skills: skillsData,
                links: linksData,
                hobbies: hobbiesData,
                language: languageData,
                profilePhoto: profilePhotoData
            };

            sessionStorage.setItem('formData', JSON.stringify(data));
            window.location.href = '/Home/Resumetemplates';
            //alert('Data saved successfully in session storage');
        });
    });

    // Function to extract the profile photo data
    function extractProfilePhotoData(callback) {
        let profilePhotoInput = document.getElementById('profilepic');
        let profilePhotoData = null;

        if (profilePhotoInput.files && profilePhotoInput.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                profilePhotoData = e.target.result;
                callback(profilePhotoData);
            }
            reader.readAsDataURL(profilePhotoInput.files[0]);
        } else {
            callback(profilePhotoData);
        }
    }

    // Other extract functions...
    function extractAboutSection() {
        let aboutsectiondata = [];
        let name = {
            first_name: $(`#GivenName`).val(),
            middle_name: $(`#MiddleName`).val(),
            last_name: $(`#FamilyName`).val(),
            Designation: $(`#designation`).val(),
            Objective: $(`#objective`).val()
        };
        aboutsectiondata.push(name);
        return aboutsectiondata;
    }

    function extractContactSection() {
        let contactsectiondata = [];
        let contact = {
            email: $(`#email`).val(),
            phone: $(`#phone`).val(),
            address: $(`#AddressLine`).val(),
            HomeNumber: $(`#HTelNumber`).val(),
            CellNumber: $(`#CTelNumber`).val(),
            WorkNumber: $(`#WTelNumber`).val()
        };
        contactsectiondata.push(contact);
        return contactsectiondata;
    }

    function extractSkillData() {
        let skillsData = [];

        $('#SkillsContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let skillEntry = {
                Skill_name: $(`#Skills_${index}`).val(),
            };

            skillsData.push(skillEntry);
        });

        return skillsData;
    }

    function extractExperienceData() {
        let experienceData = [];

        $('#ExperienceContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let experienceEntry = {
                PositionTitle: $(`#PositionTitle_${index}`).val(),
                EmployerName: $(`#EmployerName_${index}`).val(),
                Location: $(`#location_${index}`).val(),
                StartDate: $(`#Date_${index}`).val(),
                EndDate: $(`#EDate_${index}`).val(),
                Description: $(`#description_${index}`).val(),
                RoleResp: $(`#Role_${index}`).val()
            };

            experienceData.push(experienceEntry);
        });

        return experienceData;
    }

    function extractEducationData() {
        let educationData = [];

        $('#EducationContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let educationEntry = {
                SchoolName: $(`#SchoolName_${index}`).val(),
                EducationDegree: $(`#EduDegree_${index}`).val(),
                City: $(`#city_${index}`).val(),
                Major: $(`#EduMajor_${index}`).val(),
                StartDate: $(`#Edustart_${index}`).val(),
                EndDate: $(`#Eduend_${index}`).val(),
                GPA: $(`#GPA_${index}`).val()
            };

            educationData.push(educationEntry);
        });

        return educationData;
    }

    function extractAchievementsData() {
        let achievementsData = [];

        $('#AchievementsContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let achievementsEntry = {
                AchievementTitle: $(`#achieve-title_${index}`).val(),
                AchievementDescription: $(`#Achievements-description_${index}`).val()
            };

            achievementsData.push(achievementsEntry);
        });

        return achievementsData;
    }

    function extractProjectsData() {
        let projectsData = [];

        $('#ProjectsContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let projectsEntry = {
                ProjectName: $(`#projectname_${index}`).val(),
                ProjectLink: $(`#proj_link_${index}`).val(),
                StartDate: $(`#project_start_${index}`).val(),
                EndDate: $(`#project_end_${index}`).val(),
                ProjectDescription: $(`#Projects-description_${index}`).val()
            };

            projectsData.push(projectsEntry);
        });

        return projectsData;
    }

    function extractCertificationsData() {
        let certificationsData = [];
        $('#CertificateContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let certificationsEntry = {
                CertificationName: $(`#certificate-name_${index}`).val()
            };

            certificationsData.push(certificationsEntry);
        });

        return certificationsData;
    }

    function extractHobbiesData() {
        let hobbiesData = [];

        $('#HobbiesContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let hobbiesEntry = {
                HobbyName: $(`#Hobbies_${index}`).val()
            };

            hobbiesData.push(hobbiesEntry);
        });

        return hobbiesData;
    }

    function extractLanguageData() {
        let languageData = [];

        $('#LanguagesKnownContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];

            let languageEntry = {
                LanguageName: $(`#LanguagesKnown_${index}`).val()
            };

            languageData.push(languageEntry);
        });

        return languageData;
    }


    function extractLinksData() {
        let linksData = [];
        linksData.push({
            Linkedin: $(`#linkedin_link`).val()
        },
            {
                Github: $(`#github_link`).val()
            });
        $('#LinksContainer .repeater-item').each(function () {
            let index = $(this).attr('id').split('-')[1];
            let linksEntry = {
                LinkName: $(`#Links_${index}`).val(),
            };

            linksData.push(linksEntry)
        });
        return linksData;
    }
});


