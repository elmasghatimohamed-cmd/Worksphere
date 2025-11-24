const ajouteForm = document.getElementById('ajouteForm');
const ajoutBtn = document.getElementById('ajoutBtn');
const ajouterEmp = document.getElementById('ajouterEmp');
const annuler = document.getElementById('annuler');
const employees = document.querySelector('.employees');
const experienceItems = document.querySelector('.experience-items');
const ajouterExpBtn = document.querySelector('.expBtn');
const searchBar = document.getElementById('searchBar');
const roomsButton = document.querySelectorAll('.roomsButton');

const Name = document.getElementById('name');
const role = document.getElementById('roles');
const profileUrl = document.getElementById('profileUrl');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const photoPreview = document.getElementById('photoPreview');
const photoPreviewContainer = document.getElementById('photoPreviewContainer');

const nameRegex = /^[a-zA-ZÀ-ÿ\s]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
const urlRegex = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i;

let employeesData = [];

function resetAjouteForm() {
    ajouteForm.reset();
    ajouteForm.style.display = 'none';
    experienceItems.innerHTML = '';
    ajouteForm.removeAttribute('data-edit-id');
    ajouterEmp.textContent = 'Ajouter';
}

function saveEmployeesToStorage() {
    try {
        localStorage.setItem('employeesData', JSON.stringify(employeesData));
    } catch (e) {
        console.warn('Failed to save employees to localStorage', e);
    }
}

function loadEmployeesFromStorage() {
    try {
        const loadedData = localStorage.getItem('employeesData');
        return loadedData ? JSON.parse(loadedData) : [];
    } catch (e) {
        console.warn('Failed to load employees from localStorage', e);
        return [];
    }
}

function renderAllEmployees() {
    employees.innerHTML = '';
    document.querySelectorAll('.zone-employees').forEach(c => c.remove());

    employeesData.forEach(emp => {
        if (emp.zone) {
            moveEmployeeToZone(emp.id, emp.zone);
        } else {
            renderEmployees(emp);
        }
    });

    roomsCapacityLimits();
}

ajoutBtn.addEventListener('click', () => {
    ajouteForm.style.display = 'flex';
    ajouteForm.removeAttribute('data-edit-id');
    if (photoPreviewContainer) photoPreviewContainer.style.display = 'flex';
});

annuler.addEventListener('click', () => {
    resetAjouteForm();
});

ajouterExpBtn.addEventListener('click', () => {
    renderExperience();
});

ajouterEmp.addEventListener('click', (e) => {
    e.preventDefault();
    ajouteForm.dispatchEvent(new Event('submit'));
});

searchBar.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase().trim();
    filterEmployees(searchTerm);
});

function updatePreviewFromUrl(url) {
    if (!photoPreview) return;
    if (url && urlRegex.test(url)) {
        photoPreview.src = url;
    }
}

if (profileUrl) {
    profileUrl.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        updatePreviewFromUrl(url);
    });
}

ajouteForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;
    let errorMessage = '';

    if (!nameRegex.test(Name.value)) {
        isValid = false;
        errorMessage += 'Le nom doit contenir uniquement des lettres (2-50 caractères)\n';
    }

    if (!emailRegex.test(email.value)) {
        isValid = false;
        errorMessage += 'L\'email n\'est pas valide\n';
    }

    if (!phoneRegex.test(phone.value)) {
        isValid = false;
        errorMessage += 'Le téléphone doit être au format marocain (+212XXXXXXXXX ou 0XXXXXXXXX)\n';
    }

    if (profileUrl.value && !urlRegex.test(profileUrl.value)) {
        isValid = false;
        errorMessage += 'L\'URL de la photo doit être une image valide (.jpg, .png, .gif, .webp)\n';
    }

    const experienceValidation = validateExperiences();
    if (!experienceValidation.isValid) {
        isValid = false;
        errorMessage += '\n' + experienceValidation.errorMessage;
    }

    if (!isValid) {
        alert(errorMessage);
        return;
    }

    const experiencesData = collectExperiences();
    const editId = ajouteForm.getAttribute('data-edit-id');

    if (editId) {
        const employeeIndex = employeesData.findIndex(emp => emp.id == editId);

        if (employeeIndex !== -1) {
            employeesData[employeeIndex] = {
                id: parseInt(editId),
                Name: Name.value.trim(),
                role: role.value,
                profileUrl: profileUrl.value,
                email: email.value.trim(),
                phone: phone.value.trim(),
                experience: experiencesData,
                zone: null
            };

            updateEmployeeDisplay(employeesData[employeeIndex]);
            saveEmployeesToStorage();
        }
    } else {
        const employeData = {
            id: Date.now(),
            Name: Name.value.trim(),
            role: role.value,
            profileUrl: profileUrl.value,
            email: email.value.trim(),
            phone: phone.value.trim(),
            experience: experiencesData,
            zone: null
        };

        employeesData.push(employeData);
        renderEmployees(employeData);
        saveEmployeesToStorage();
    }

    resetAjouteForm();
});

function renderEmployees(employeData) {
    const div = document.createElement('div');
    div.className = 'employe';
    div.setAttribute('data-id', employeData.id);

    const span1 = document.createElement('span');
    const h3 = document.createElement('h3');
    h3.textContent = employeData.Name;
    const p = document.createElement('p');
    p.textContent = employeData.role;
    p.style.opacity = 0.7;

    const span2 = document.createElement('span');
    const img = document.createElement('img');
    img.src = employeData.profileUrl;
    img.alt = 'profile';

    const Btn = document.createElement('button');
    Btn.className = 'editBtn';
    const i = document.createElement('i');
    i.className = 'fa fa-gear';

    Btn.addEventListener('click', (e) => {
        e.stopPropagation();
        modifyEmployee(employeData.id);
    });

    div.addEventListener('click', () => {
        showEmployeeDetails(employeData.id);
    });
    employees.appendChild(div);
    div.appendChild(span1);
    div.appendChild(span2);

    span1.appendChild(h3);
    span1.appendChild(p);

    span2.appendChild(img);
    span2.appendChild(Btn);

    Btn.appendChild(i);
}

function showEmployeeDetails(employeeId) {
    const employee = employeesData.find(emp => emp.id === employeeId);
    if (!employee) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'employeeDetailsModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `Détails de ${employee.Name}`);

    const content = document.createElement('div');
    content.className = 'modal-content details-content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-modal';
    closeBtn.textContent = '✕';
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });

    const header = document.createElement('div');
    header.className = 'details-header';

    const img = document.createElement('img');
    img.src = employee.profileUrl || '';
    img.alt = employee.Name;
    img.className = 'details-photo';

    const nameEl = document.createElement('h3');
    nameEl.textContent = employee.Name;

    const roleEl = document.createElement('p');
    roleEl.textContent = employee.role;
    roleEl.style.opacity = 0.8;

    header.appendChild(img);
    const headerText = document.createElement('div');
    headerText.appendChild(nameEl);
    headerText.appendChild(roleEl);
    header.appendChild(headerText);

    const contact = document.createElement('div');
    contact.className = 'details-contact';
    const emailEl = document.createElement('p');
    emailEl.innerHTML = `<strong>Email:</strong> ${employee.email || '-'}`;
    const phoneEl = document.createElement('p');
    phoneEl.innerHTML = `<strong>Téléphone:</strong> ${employee.phone || '-'}`;
    contact.appendChild(emailEl);
    contact.appendChild(phoneEl);

    const expSection = document.createElement('div');
    expSection.className = 'details-experience';
    const expTitle = document.createElement('h4');
    expTitle.textContent = 'Expériences Professionnelles';
    expSection.appendChild(expTitle);

    if (employee.experience && employee.experience.length) {
        const ul = document.createElement('ul');
        employee.experience.forEach(exp => {
            const li = document.createElement('li');
            li.textContent = `${exp.entreprise} (${exp.dateDebut} → ${exp.dateFin})`;
            ul.appendChild(li);
        });
        expSection.appendChild(ul);
    } else {
        const none = document.createElement('p');
        none.textContent = 'Aucune expérience enregistrée.';
        expSection.appendChild(none);
    }

    content.appendChild(closeBtn);
    content.appendChild(header);
    content.appendChild(contact);
    content.appendChild(expSection);

    modal.appendChild(content);
    document.body.appendChild(modal);

    modal.style.display = 'flex';
}

function modifyEmployee(employeeId) {
    const employee = employeesData.find(emp => emp.id === employeeId);

    Name.value = employee.Name;
    role.value = employee.role;
    profileUrl.value = employee.profileUrl;
    email.value = employee.email;
    phone.value = employee.phone;

    experienceItems.innerHTML = '';
    employee.experience.forEach(exp => {
        const ajouterExperience = document.createElement('div');
        ajouterExperience.className = 'experience';

        const entreprise = document.createElement('input');
        entreprise.type = 'text';
        entreprise.placeholder = 'Entreprise';
        entreprise.className = 'exp-entreprise';
        entreprise.value = exp.entreprise;

        const dateDebut = document.createElement('input');
        dateDebut.type = 'date';
        dateDebut.className = 'exp-debut';
        dateDebut.value = exp.dateDebut;

        const dateFin = document.createElement('input');
        dateFin.type = 'date';
        dateFin.className = 'exp-fin';
        dateFin.value = exp.dateFin;

        ajouterExperience.appendChild(entreprise);
        ajouterExperience.appendChild(dateDebut);
        ajouterExperience.appendChild(dateFin);

        experienceItems.appendChild(ajouterExperience);
    });

    ajouteForm.style.display = 'flex';
    ajouteForm.setAttribute('data-edit-id', employeeId);
    ajouterEmp.textContent = 'Modifier';
}

function updateEmployeeDisplay(employeData) {
    const employeeDiv = document.querySelector(`.employe[data-id="${employeData.id}"]`);

    if (employeeDiv) {
        const h3 = employeeDiv.querySelector('h3');
        const p = employeeDiv.querySelector('p');
        const img = employeeDiv.querySelector('img');

        h3.textContent = employeData.Name;
        p.textContent = employeData.role;
        img.src = employeData.profileUrl;
    }
}

function filterEmployees(searchTerm) {
    const employeeDivs = document.querySelectorAll('.employe');

    employeeDivs.forEach(div => {
        const employeeId = parseInt(div.getAttribute('data-id'));
        const employee = employeesData.find(emp => emp.id === employeeId);

        if (!employee) {
            div.style.display = 'none';
            return;
        }

        const searchableText = [
            employee.Name,
            employee.role,
            employee.email,
            employee.phone,
            ...employee.experience.map(exp => exp.entreprise)
        ].join(' ').toLowerCase();

        if (!searchTerm || searchableText.includes(searchTerm)) {
            div.style.display = 'flex';
        } else {
            div.style.display = 'none';
        }
    });
}

function renderExperience() {
    const ajouterExperience = document.createElement('div');
    ajouterExperience.className = 'experience';

    const entreprise = document.createElement('input');
    entreprise.type = 'text';
    entreprise.placeholder = 'Entreprise';
    entreprise.className = 'exp-entreprise';

    const dateDebut = document.createElement('input');
    dateDebut.type = 'date';
    dateDebut.className = 'exp-debut';

    const dateFin = document.createElement('input');
    dateFin.type = 'date';
    dateFin.className = 'exp-fin';

    ajouterExperience.appendChild(entreprise);
    ajouterExperience.appendChild(dateDebut);
    ajouterExperience.appendChild(dateFin);

    experienceItems.appendChild(ajouterExperience);
}

function validateExperiences() {
    const experiences = document.querySelectorAll('.experience');
    let isValid = true;
    let errorMessage = '';

    if (experiences.length === 0) {
        errorMessage += 'Veuillez ajouter au moins une expérience\n';
        return { isValid: false, errorMessage };
    }

    experiences.forEach((item, index) => {
        const entreprise = item.querySelector('.exp-entreprise').value.trim();
        const dateDebut = item.querySelector('.exp-debut').value;
        const dateFin = item.querySelector('.exp-fin').value;

        if (!entreprise || !dateDebut || !dateFin) {
            isValid = false;
            errorMessage += `Expérience ${index + 1}: Tous les champs sont obligatoires\n`;
            return;
        }

        const debut = new Date(dateDebut);
        const fin = new Date(dateFin);
        const aujourdhui = new Date();

        if (debut > aujourdhui) {
            isValid = false;
            errorMessage += `Expérience ${index + 1}: La date de début ne peut pas être dans le futur\n`;
        }

        if (fin <= debut) {
            isValid = false;
            errorMessage += `Expérience ${index + 1}: La date de fin doit être après la date de début\n`;
        }

        const dureeEnMois = (fin - debut) / (1000 * 60 * 60 * 24 * 30);
        if (dureeEnMois > 600) {
            isValid = false;
            errorMessage += `Expérience ${index + 1}: La durée ne peut pas dépasser 50 ans\n`;
        }
    });

    return { isValid, errorMessage };
}

function collectExperiences() {
    const experiences = document.querySelectorAll('.experience');
    let experiencesData = [];

    experiences.forEach(item => {
        const entreprise = item.querySelector('.exp-entreprise').value.trim();
        const dateDebut = item.querySelector('.exp-debut').value;
        const dateFin = item.querySelector('.exp-fin').value;

        if (entreprise && dateDebut && dateFin) {
            experiencesData.push({
                entreprise: entreprise,
                dateDebut: dateDebut,
                dateFin: dateFin
            });
        }
    });

    return experiencesData;
}

function selectRoom() {
    roomsButton.forEach((btn) => {
        btn.addEventListener('click', () => {
            const roomId = btn.dataset.status;

            const employeesAvailable = employeesData.filter(emp => {
                const isAvailable = emp.zone === null;

                let correctRole = false;
                if (roomId === 'securityRoom') {
                    correctRole = emp.role === 'Agent de sécurité' || emp.role === 'Manager';
                } else if (roomId === 'receptionRoom') {
                    correctRole = emp.role === 'Réceptionniste' || emp.role === 'Manager';
                } else if (roomId === 'archiveRoom') {
                    correctRole = emp.role !== 'Nettoyage';
                } else if (roomId === 'serversRoom') {
                    correctRole = emp.role === 'Technicien IT' || emp.role === 'Manager';
                } else if (roomId !== 'securityRoom' && roomId !== 'receptionRoom' && roomId !== 'serversRoom') {
                    correctRole = emp.role === 'Autres roles';
                } else if (roomId === conferenceRoom || roomId === personnelsRoom) {
                    correctRole = emp.role === 'Manager' || emp.role === 'Nettoyage' || emp.role === 'Agent de sécurité' || emp.role === 'Réceptionniste' || emp.role === 'Technicien IT'
                }

                return isAvailable && correctRole;
            });
            displayAvailableEmployees(employeesAvailable, roomId);
        });
    });
}

function displayAvailableEmployees(employees, roomId) {
    let modal = document.createElement('div');
    modal.id = 'employeeModal';
    modal.className = 'modal';
    document.body.appendChild(modal);

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const title = document.createElement('h3');
    title.textContent = `Employés disponibles (${employees.length})`;
    modalContent.appendChild(title);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.className = 'close-modal';
    closeBtn.addEventListener('click', () => {
        modal.remove();
    });
    modalContent.appendChild(closeBtn);

    if (employees.length === 0) {
        const noEmp = document.createElement('p');
        noEmp.textContent = 'Aucun employé disponible pour cette salle';
        modalContent.appendChild(noEmp);
    } else {
        employees.forEach(emp => {
            const empDiv = document.createElement('div');
            empDiv.className = 'available-employee';

            const empInfo = document.createElement('div');

            const empImage = document.createElement('img');
            empImage.src = emp.profileUrl;
            empImage.alt = emp.Name;

            const div = document.createElement('div');
            const h4 = document.createElement('h4');
            h4.textContent = emp.Name;

            const p = document.createElement('p');
            p.textContent = emp.role;

            div.appendChild(h4);
            div.appendChild(p);

            empInfo.appendChild(empImage);
            empInfo.appendChild(div);

            const assignBtn = document.createElement('button');
            assignBtn.textContent = 'Assigner';
            assignBtn.className = 'assign-btn';
            assignBtn.addEventListener('click', () => {
                assignEmployeeToRoom(emp.id, roomId);
                modal.remove();
            });

            empDiv.appendChild(empInfo);
            empDiv.appendChild(assignBtn);
            modalContent.appendChild(empDiv);
        });
    }

    modal.appendChild(modalContent);
    modal.style.display = 'flex';
}

selectRoom();

function assignEmployeeToRoom(employeeId, roomId) {
    const employee = employeesData.find(emp => emp.id === employeeId);
    const roomButton = document.querySelector(`[data-status="${roomId}"]`);
    const roomCapacity = parseInt(roomButton.dataset.capacity);

    const assignedCount = employeesData.filter(emp => emp.zone === roomId).length;
    if (assignedCount >= roomCapacity) {
        alert(`Cette salle a atteint sa capacité maximale de ${roomCapacity} employé(s).`);
        return;
    }

    employee.zone = roomId;
    moveEmployeeToZone(employeeId, roomId);
    saveEmployeesToStorage();
    roomsCapacityLimits();
}

function moveEmployeeToZone(employeeId, roomId) {
    const employee = employeesData.find(emp => emp.id === employeeId);
    if (!employee) return;

    const employeeDiv = document.querySelector(`.employe[data-id="${employeeId}"]`);
    if (employeeDiv) {
        employeeDiv.remove();
    }

    const targetZone = document.querySelector(`[data-status="${roomId}"]`);

    let zoneEmployeesContainer = targetZone.querySelector('.zone-employees');

    if (!zoneEmployeesContainer) {
        zoneEmployeesContainer = document.createElement('div');
        zoneEmployeesContainer.className = 'zone-employees';
        targetZone.appendChild(zoneEmployeesContainer);
    }

    const employeeInZone = document.createElement('div');
    employeeInZone.className = 'employe';
    employeeInZone.setAttribute('data-id', employeeId);

    const spanInfo = document.createElement('span');
    const h3 = document.createElement('h3');
    h3.textContent = employee.Name;
    const p = document.createElement('p');
    p.textContent = employee.role;

    spanInfo.appendChild(h3);
    spanInfo.appendChild(p);

    const spanAction = document.createElement('span');
    const img = document.createElement('img');
    img.src = employee.profileUrl;
    img.alt = 'profile';
    const btn = document.createElement('button');
    btn.classList.add('remove-from-zone-btn');
    btn.title = 'Retirer de la zone';
    const icon = document.createElement('i');
    icon.classList.add('fa', 'fa-times');

    btn.appendChild(icon);
    spanAction.appendChild(img);
    spanAction.appendChild(btn);
    employeeInZone.appendChild(spanInfo);
    employeeInZone.appendChild(spanAction);

    const removeBtn = employeeInZone.querySelector('.remove-from-zone-btn');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        unassignEmployeeFromZone(employeeId);
    });

    zoneEmployeesContainer.appendChild(employeeInZone);
}

function unassignEmployeeFromZone(employeeId) {
    const employee = employeesData.find(emp => emp.id === employeeId);

    const assignedEmployeeDiv = document.querySelector(`.zone-employees .employe[data-id="${employeeId}"]`);
    if (assignedEmployeeDiv) {
        assignedEmployeeDiv.remove();
    }
    employee.zone = null;
    renderEmployees(employee);
    saveEmployeesToStorage();
    cleanupEmptyZoneContainers();
    roomsCapacityLimits();
}

function cleanupEmptyZoneContainers() {
    const allZoneContainers = document.querySelectorAll('.zone-employees');
    allZoneContainers.forEach(container => {
        if (container.children.length === 0) {
            container.remove();
        }
    });
}

function roomsCapacityLimits() {
    roomsButton.forEach(btn => {
        const roomId = btn.dataset.status;
        const roomCapacity = parseInt(btn.dataset.capacity);

        const parentTop = btn.closest('.top');
        const leftDiv = parentTop.querySelector(':scope > div:first-child');
        let capacityDisplay = leftDiv.querySelector('.capacity-display');

        if (!capacityDisplay) {
            capacityDisplay = document.createElement('p');
            capacityDisplay.className = 'capacity-display';
            leftDiv.appendChild(capacityDisplay);
        }

        const assignedCount = employeesData.filter(emp => emp.zone === roomId).length;
        capacityDisplay.textContent = `${assignedCount}/${roomCapacity} employé${assignedCount > 1 ? 's' : ''}`;

        if (assignedCount >= roomCapacity) {
            btn.classList.add('room-full');
            capacityDisplay.style.color = '#e74c3c';
        } else {
            btn.classList.remove('room-full');
            capacityDisplay.style.color = '#fcfefdff';
        }
    });
}
employeesData = loadEmployeesFromStorage();
renderAllEmployees();