document.addEventListener('DOMContentLoaded', function () {
});

function register() {
    let username = $('#username').val();
    if (!username) {
        alertify.set('notifier', 'position', 'top-center');
        return alertify.success('Current position : ' + alertify.get('notifier', 'position'));
        //  alert('Please enter your username');
    }
    let password = $('#password').val(); // Mengambil nilai dari input password
    if (!password) {
        showNotification('Please enter your password');
        return;
    } else if (password.length < 8) {
        showNotification('Password must be at least 8 characters long', 'error');
        return;
    }

    let password2 = $('#password2').val(); // Mengambil nilai dari input konfirmasi password
    if (!password2) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.error('Please enter your password confirmation ');
        return;
        // return alert('Please enter your password confirmation');
    } else if (password2.length < 8) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.error('Please enter your password confirmation ');
        return;
        // return alert('Password confirmation must be at least 8 characters long');
    }

    if (password !== password2) {
        alertify.set('notifier', 'position', 'top-right');
        alertify.error('Password and password confirmation do not match');
        return;
        return alert('Password and password confirmation do not match');
    }

    console.log(username, password);
    $.ajax({
        type: "POST",
        url: "/register",
        data: {
            username: username,
            password: password,
        },
        success: function (response) {
            if (response['result'] === 'success') {
                alertify.success("Registration complete!");
                setTimeout(function () {
                    window.location.href = "/login";
                }, 2000);
            } else {
                alert(response['msg']);
            }
        },
    });
}




// FUNGSI UPDATE ATAU EDIT PROFILE

function update() {
    let name = $("#username").val();
    let file = $("#input-pic")[0].files[0];
    let bio = $("#input-bio").val();
    let form_data = new FormData();

    form_data.append("file_give", file);
    form_data.append("name_give", name);
    form_data.append("about_give", bio);

    console.log(name, file, bio, form_data);

    $.ajax({
        type: "POST",
        url: "/profile/update",
        data: form_data,
        cache: false,
        contentType: false,
        processData: false,
        success: function (response) {
            if (response["result"] === "success") {
                alertify.set('notifier', 'position', 'top-right');
                alertify.success(response["msg"]);
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
        },
    });
}


function showNotification(message, type) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');

    if (type === 'success') {
        notification.classList.add('success');
    } else if (type === 'error') {
        notification.classList.add('error');
    }

    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 300);
    }, 3000);
}


function confirmDel(title) {
    alertify.confirm('Confirm Delete Event',
        'Are you sure you want to delete this event?',
        function () {
            deleteEvent(title);
        },
        function () {
            // User clicked 'cancel', no action needed
        }
    ).set('transition', 'zoom').set('closable', true);
}
function deleteEvent(title) {
    fetch('/event/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: title })
    })
        .then(response => {
            if (response.ok) {
                alertify.set('notifier', 'position', 'top-right');
                alertify.success("Event deleted successfully");
                window.location.reload();
            } else {
                alertify.set('notifier', 'position', 'top-right');
                alertify.error("Failed to delete event");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alertify.set('notifier', 'position', 'top-right');
            alertify.error("An error occurred while deleting the event");
        });
}

function confirmDelAll() {
    alertify.confirm('Confirm Delete Event',
        'Are you sure you want to delete all files?',
        function () {
            deleteEvent(title);
        },
        function () {
            // User clicked 'cancel', no action needed
        }
    ).set('transition', 'zoom').set('closable', true);
}
function deleteAll() {
    $.ajax({
        url: '/event/delete-all',
        type: 'POST',
        contentType: 'application/json',
        success: function (data) {
            alertify.set('notifier', 'position', 'top-right');
            alertify.success(data.message);
            window.location.reload();
        },
        error: function (xhr, textStatus, errorThrown) {
            console.error('Error:', errorThrown);
            alertify.set('notifier', 'position', 'top-right');
            alertify.error("An error occurred while deleting the event");
        }
    })
}

function update_event(eventId) {
    let title = document.getElementById(`input_title_${eventId}`).value;
    let file = document.getElementById(`inputFile_${eventId}`).files[0];
    let locate = document.getElementById(`input_location_${eventId}`).value;
    let date = document.getElementById(`input_date_${eventId}`).value;
    let desc = document.getElementById(`input_desc_${eventId}`).value;

    let formData = new FormData();
    formData.append('title', title);
    formData.append('image', file);
    formData.append('locate', locate);
    formData.append('date', date);
    formData.append('desc', desc);
    formData.append('eventId', eventId);

    $.ajax({
        type: 'POST',
        url: '/event-update',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        success: function (response) {
            if (response['result'] === 'success') {
                toastr['success'](response['msg'])
                setTimeout(function() {
                    window.location.reload();
                }, 3000); 
            }
            console.log(response);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function toggleColor(btn) {
    btn.classList.toggle("clicked");
}

function showModal(btn) {
    let eventId = btn.getAttribute('data-id');
    let card = btn.closest('.card');
    let title = card.querySelector('.card-title').textContent;
    let image = card.querySelector('.img-fluid').src;
    let locate = card.querySelector('.text-body-secondary').textContent.split(', ')[0];
    let dateWithExtraChars = card.querySelector('.text-body-secondary').textContent.split(', ')[1];
    let date = dateWithExtraChars.trim();
    let desc = card.querySelector('.card-text:not(.text-body-secondary)').textContent;

    let modalHtml = `
            <div class="modal fade" id="modal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="modalLabel">${title}</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="form-floating mb-3">
                                <input type="text" class="form-control" id="input_title_${eventId}" placeholder="name@example.com" value="${title}">
                                <label for="input_title_${eventId}">Input Your Title</label>
                            </div>
                            <div class="input-group mb-3">
                                <input type="file" class="form-control" id="inputFile_${eventId}" value="${image}">
                            </div>
                            <div class="row g-2">
                                <div class="col-md">
                                    <div class="form-floating">
                                        <input type="text" class="form-control" id="input_location_${eventId}" placeholder="name@example.com" value="${locate}">
                                        <label for="input_location_${eventId}">Location</label>
                                    </div>
                                </div>
                                <div class="col-md">
                                    <div class="form-floating">
                                        <input type="date" class="form-control" id="input_date_${eventId}" placeholder="name@example.com" value="${date}">
                                        <label for="input_date_${eventId}">Date</label>
                                    </div>
                                </div>
                                <div class="form-floating">
                                    <textarea class="form-control" placeholder="Leave a comment here" id="input_desc_${eventId}" style="height: 100px">${desc}</textarea>
                                    <label for="input_desc_${eventId}">Description</label>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-light" style="border: 2px solid var(--primary-color);" onclick="update_event('${eventId}')">Save</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    let modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = modalHtml;

    let modal = new bootstrap.Modal(document.getElementById('modal'));
    modal.show();
}
