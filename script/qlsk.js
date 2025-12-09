const API_BASE = 'https://test4-7cop.onrender.com';
let events = [];
let organizations = [];

// Load organizations cho dropdown
async function loadOrganizations() {
  try {
    const res = await fetch(`${API_BASE}/api/organizations`);
    organizations = await res.json();
    const select = document.getElementById('eventOrganization');
    const editSelect = document.getElementById('editEventOrganization');
    select.innerHTML = '<option value="">-----</option>';
    editSelect.innerHTML = '<option value="">-----</option>';
    organizations.forEach(org => {
      select.innerHTML += `<option value="${org.id}">${org.name}</option>`;
      editSelect.innerHTML += `<option value="${org.id}">${org.name}</option>`;
    });
  } catch (err) { console.error('Lỗi load tổ chức:', err); }
}

// Load events + render
async function loadEvents() {
  try {
    const res = await fetch(`${API_BASE}/api/events`);
    events = await res.json();
    renderEvents();
  } catch (err) { alert('Lỗi kết nối server'); }
}

function renderEvents() {
  const tabs = {
    created: document.getElementById('created-content').querySelector('.event-card'),
    waitapproved: document.getElementById('waitapproved-content').querySelector('.event-card'),
    approved: document.getElementById('approved-content').querySelector('.event-card')
  };

  Object.values(tabs).forEach(tab => tab.innerHTML = '');

  events.forEach(event => {
    const orgName = event.Organization?.name || 'Không xác định';
    const card = createEventCard(event, orgName);
    const container = tabs[event.status || 'created'];
    container.appendChild(card);
  });

  updateTabBadges();
}

function createEventCard(event, orgName) {
  const card = document.createElement('div');
  card.className = 'content-card';
  card.innerHTML = `
    <div class="content-image"><img src="${event.image || 'https://via.placeholder.com/400x250'}" alt="${event.name}"></div>
    <div class="content-info">
      <div class="date"><p>${event.name}</p><div class="status-badge ${event.status === 'approved' ? 'approved' : 'disapproved'}">${event.registrationDeadline < new Date() ? 'Hết hạn' : 'Còn hạn'}</div></div>
      <div class="event-info">
        <p>${event.description || 'Chưa có mô tả'}</p>
        <p>⏰ Thời gian: ${formatDate(event.startTime)} - ${formatDate(event.endTime)}</p>
        <p>📅 Hạn đăng ký: ${formatDate(event.registrationDeadline)}</p>
        <p>📍 Địa điểm: ${event.location}</p>
        <p>🏢 Tổ chức: ${orgName}</p>
      </div>
      <div class="mxh">${(event.channels || []).map(ch => `<div class="mxh-web">${ch}</div>`).join('')}</div>
      <a class="dki" href="${event.registrationLink}" target="_blank">Link đăng ký →</a>
      <div class="button-container">
        ${event.status === 'pending' ? `<button class="see-btn" data-id="${event.id}">Xem</button>` : ''}
        ${event.status !== 'pending' ? `<button class="edit-event-btn" data-id="${event.id}">Sửa</button>` : ''}
        <button class="delete-btn" data-id="${event.id}">Xóa</button>
      </div>
    </div>
  `;
  return card;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('vi-VN').replace(',', '');
}

// Tạo sự kiện
document.getElementById('createEvent').onclick = async () => {
  const formData = new FormData();
  formData.append('name', document.getElementById('eventName').value);
  formData.append('description', document.getElementById('eventDescription').value);
  formData.append('startTime', document.getElementById('eventStartTime').value);
  formData.append('endTime', document.getElementById('eventEndTime').value);
  formData.append('registrationDeadline', document.getElementById('registrationDeadline').value);
  formData.append('location', document.getElementById('eventLocation').value);
  formData.append('registrationLink', document.getElementById('registrationLink').value);
  formData.append('organizationId', document.getElementById('eventOrganization').value);
  formData.append('channels', JSON.stringify(Array.from(document.querySelectorAll('input[name="socialChannels"]:checked')).map(cb => cb.value)));
  if (document.getElementById('eventImage').files[0]) {
    formData.append('image', document.getElementById('eventImage').files[0]);
  }

  try {
    const res = await fetch(`${API_BASE}/api/events`, { method: 'POST', body: formData });
    if (res.ok) {
      alert('Tạo sự kiện thành công!');
      document.getElementById('modalOverlay').classList.remove('active');
      loadEvents();
    }
  } catch (err) { alert('Lỗi'); }
};

// Load khi mở trang
document.addEventListener('DOMContentLoaded', () => {
  loadOrganizations();
  loadEvents();
});
