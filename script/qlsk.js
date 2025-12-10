const API_BASE = 'https://test4-7cop.onrender.com';

// Dữ liệu mẫu cho tab Chờ duyệt & Đã duyệt (giữ nguyên để demo)
const pendingEvents = [
  {
    id: 'pending-001',
    name: 'ASTEES COLLECTION REVEAL',
    description: 'Loa loa loa…Không để các bạn phải chờ lâu thêm nữa, sự kiện thời trang ASTEEs Colletion Reval đã chính thức mở form đăng ký rồi đây.',
    startTime: '2026-11-23T10:00',
    endTime: '2026-11-23T15:00',
    registrationDeadline: '2026-10-23T23:00',
    location: 'Hội trường D-Học viện Công nghệ Bưu chính Viễn thông Cơ sở TPHCM',
    registrationLink: 'https://forms.gle/DdqnFSqYmFawhLqg6',
    coverImage: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/565116867_122109067953007168_7188552843937308533_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=JL9RBlLqDvAQ7kNvwGklou9&_nc_oc=AdkriqcE4ePcY2wCKt07sj04WOe59TgR7EGNFTE0-LXTL9JX4q_LKyc08Km2UZ9OUUA&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=k7CwjZe_0zGuot42qDYWaw&oh=00_AfjsgzqyiFVkjs3lODAmMOyE47qP1hl3NP0pnEAJf9byaA&oe=692BB1F6',
    organization: 'A\'zone',
    channels: ['web']
  },
  {
    id: 'pending-002',
    name: 'FABULOUS-ITMC MỞ ĐƠN TUYỂN THÀNH VIÊN MỚI',
    description: 'Một cánh cửa mới đã mở ra, chào đón những người bạn đồng hành đầy nhiệt huyết bước vào hành trình cùng ITMC.',
    startTime: '2025-11-25T07:00',
    endTime: '2025-11-25T15:00',
    registrationDeadline: '2025-11-24T20:00',
    location: 'Học viện Công nghệ Bưu chính Viễn thông – Cơ sở TP.HCM',
    registrationLink: 'https://forms.gle/6fCD8ZMh6oDHYtsu6',
    coverImage: 'https://scontent.fdad3-1.fna.fbcdn.net/v/t39.30808-6/547828632_1216108510557641_566180599963180957_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=cSFJ-oW5RcwQ7kNvwE4HsMC&_nc_oc=Adk1Wv_P4ZyQCCI6j3sjxHeejBZVNrIN1TJv6P-6ibA_nHrjv3GG0BlNACpK5IuANMU&_nc_zt=23&_nc_ht=scontent.fdad3-1.fna&_nc_gid=pGc--EBLpGSOxQLnZ7zwNQ&oh=00_AfhpOBVjAnzNYllKAgzHkQ2a8b26_OapTEw_rUFfMVvRKg&oe=692BCA85',
    organization: 'ITMC',
    channels: ['web']
  },
  {
    id: 'pending-003',
    name: 'MARTIST – KHI THANH XUÂN CẤT TIẾNG',
    description: '"Tuổi trẻ – đừng im lặng. Hãy để âm nhạc nói thay lòng mình." Và đó chính là thông điệp của "MArtist - Khi thanh xuân cất tiếng"!',
    startTime: '2026-11-25T07:00',
    endTime: '2026-11-25T15:00',
    registrationDeadline: '2026-11-24T20:00',
    location: 'Hội trường D – Học viện Công nghệ Bưu chính Viễn thông',
    registrationLink: 'https://forms.gle/SoMUjShn7mnULVUT9',
    coverImage: 'https://scontent.fdad3-5.fna.fbcdn.net/v/t39.30808-6/574564898_1454449043350192_975546984353294738_n.jpg?stp=dst-jpg_p526x296_tt6&_nc_cat=102&ccb=1-7&_nc_sid=127cfc&_nc_ohc=DbVvXUIpWswQ7kNvwEplIRf&_nc_oc=Adkrhn0-C1Z8GGRP-GsVnV2tzE66XSS4fAYNjXzSkodfHlOMmi59QC3oQnwi-da3Prs&_nc_zt=23&_nc_ht=scontent.fdad3-5.fna&_nc_gid=buV18m_Nwv2DDvmT51wa3Q&oh=00_AfiKckUAZlbGIFB8aqHoUoTYMy42Oruc4C4zfOFAfVUCmg&oe=692BBE9B',
    organization: 'LCD Marketing',
    channels: ['web']
  }
];

const approvedEvents = [
  {
    id: 'approved-001',
    name: 'THE ASTRO - THE INFINITY GENERATION',
    description: 'CHÍNH THỨC MỞ ĐƠN ĐĂNG KÝ TUYỂN THÀNH VIÊN: THE ASTRO - THE INFINITY GENERATION',
    startTime: '2025-12-02T07:30',
    endTime: '2025-12-02T17:00',
    registrationDeadline: '2025-11-24T20:00',
    location: 'Hội trường D, Học viện Công nghệ Bưu chính Viễn thông – Cơ sở TP.HCM',
    registrationLink: 'https://forms.gle/7pVGy2kN9t7WJRbr6',
    coverImage: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/545054403_1242826237861546_7230088209638397878_n.jpg?stp=dst-jpg_s960x960_tt6&_nc_cat=104&ccb=1-7&_nc_sid=127cfc&_nc_ohc=BBqxo0nZs88Q7kNvwHOt-r5&_nc_oc=Adn4SmsLuB2HqqYCvvwRynPq2xyQVGwHrQIZn184TfXuuH4RYw2f6l7fTg4CfBFEKZQ&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=LWxGyBhPoEnbh4fZYvyB_Q&oh=00_AfgPkXOShQbs2TOAvaanBb81YF18o4FW43VDOmdkmHDaAA&oe=692BCEF6',
    organization: 'LCDCNDPT',
    channels: ['web']
  },
  {
    id: 'approved-002',
    name: 'HCM PTIT MULTIMEDIA 2025',
    description: 'Để chính thức khởi động cho sân chơi dành riêng cho sinh viên ngành Công nghệ Đa Phương Tiện, cuộc thi "HCM PTIT MULTIMEDIA 2025" chính thức khoác lên mình "chiếc áo" mới.',
    startTime: '2026-12-02T07:30',
    endTime: '2026-11-02T17:00',
    registrationDeadline: '2026-11-23T24:00',
    location: 'Hội trường 2A08, Học viện Công nghệ Bưu chính Viễn thông – Cơ sở TP.HCM',
    registrationLink: '#',
    coverImage: 'https://scontent.fdad3-4.fna.fbcdn.net/v/t39.30808-6/566219856_1231088645726163_5271916207151874176_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=h51wD-vw-BkQ7kNvwHX9X1p&_nc_oc=Adnyv-SpShf0Oh2NXDIiIlKzVvSiP9-Zr0AjcL1PDlR-XwdE-IvEWiFmG-pU3oVHpUc&_nc_zt=23&_nc_ht=scontent.fdad3-4.fna&_nc_gid=8kYYM8rHvcavUSCoL--kCQ&oh=00_AfiiPuJ0eeCTNFK5SmIdSTUd2-zkj3bEVUToDkppaFDwgw&oe=692BC395',
    organization: 'LCDCNDPT',
    channels: ['web', 'facebook', 'zalo']
  }
];

// Biến toàn cục
let events = []; // Dữ liệu thật từ backend
let organizations = [];

// Load tổ chức thật để điền dropdown
async function loadOrganizations() {
  try {
    const res = await fetch(`${API_BASE}/api/organizations`);
    if (!res.ok) throw new Error('Lỗi server');
    organizations = await res.json();
    populateOrganizationDropdown();
  } catch (err) {
    console.error('Không load được tổ chức:', err);
  }
}

function populateOrganizationDropdown() {
  const selects = [document.getElementById('eventOrganization'), document.getElementById('editEventOrganization')];
  selects.forEach(select => {
    if (!select) return;
    select.innerHTML = '<option value="">-----</option>';
    organizations.forEach(org => {
      const opt = document.createElement('option');
      opt.value = org.id;
      opt.textContent = org.name;
      select.appendChild(opt);
    });
  });
}

// Load sự kiện thật từ backend
async function loadEvents() {
  try {
    const res = await fetch(`${API_BASE}/api/events`);
    if (!res.ok) throw new Error('Lỗi server');
    events = await res.json();
    renderCreatedEvents();
  } catch (err) {
    console.error('Không load được sự kiện:', err);
  }
}

function renderCreatedEvents() {
  const container = document.querySelector('#created-content .event-card');
  if (!container) return;
  container.innerHTML = '';
  if (events.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:60px;color:#666;grid-column:1/-1;">Chưa có sự kiện nào</div>';
    return;
  }
  events.forEach(event => addEventCard(event, 'created'));
}

// Render dữ liệu mẫu
function renderPendingEvents() {
  const container = document.querySelector('#waitapproved-content .event-card');
  container.innerHTML = '';
  pendingEvents.forEach(event => addEventCard(event, 'pending'));
}

function renderApprovedEvents() {
  const container = document.querySelector('#approved-content .event-card');
  container.innerHTML = '';
  approvedEvents.forEach(event => addEventCard(event, 'approved'));
}

// Hàm chung thêm card
function addEventCard(event, tab) {
  const container = document.querySelector(`#${tab === 'created' ? 'created' : tab === 'pending' ? 'waitapproved' : 'approved'}-content .event-card`);
  const card = document.createElement('div');
  card.className = 'content-card';
  card.dataset.id = event.id;

  const formatTime = (iso) => {
    if (!iso) return 'Chưa xác định';
    const d = new Date(iso);
    return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', '');
  };

  const socialHtml = event.channels?.includes('facebook') || event.channels?.includes('zalo') 
    ? `<div class="displaymxh">
        ${event.channels.includes('web') ? '<div class="mxh"><div class="mxh-web">Web</div></div>' : ''}
        ${event.channels.includes('facebook') ? '<div class="fb"><div class="fb-content">Facebook</div></div>' : ''}
        ${event.channels.includes('zalo') ? '<div class="zalo"><div class="zalo-content">Zalo</div></div>' : ''}
       </div>`
    : '<div class="mxh"><div class="mxh-web">Web</div></div>';

  const statusClass = new Date(event.registrationDeadline) >= new Date() ? 'approved' : 'disapproved';
  const statusText = new Date(event.registrationDeadline) >= new Date() ? 'Còn hạn' : 'Hết hạn';

  card.innerHTML = `
    <div class="content-image">
      <img src="${event.coverImage || 'https://via.placeholder.com/400x250/f0f0f0/999?text=No+Image'}" alt="${event.name}">
    </div>
    <div class="content-info">
      <div class="date">
        <p>${event.name}</p>
        <div class="status-badge ${statusClass}">${statusText}</div>
      </div>
      <div class="event-info">
        <p>${event.description || 'Chưa có mô tả'}</p>
        <p>⏰ Thời gian: ${formatTime(event.startTime)} - ${formatTime(event.endTime)}</p>
        <p>📅 Hạn đăng ký: ${formatTime(event.registrationDeadline)}</p>
        <p>📍 Địa điểm: ${event.location || 'Chưa xác định'}</p>
        <p>🏢 Tổ chức: ${event.organization || event.Organization?.name || '-----'}</p>
      </div>
      ${socialHtml}
      <a class="dki" href="${event.registrationLink}" target="_blank">Link đăng ký →</a>
      <div class="button-container">
        ${tab === 'created' ? `<button class="approve-btn edit-event-btn" data-event-id="${event.id}">Sửa</button><button class="delete-btn">Xóa</button>` : ''}
        ${tab === 'pending' ? `<button class="see-btn" data-event-id="${event.id}">Xem</button>` : ''}
        ${tab === 'approved' ? `<button class="delete-btn">Xóa</button>` : ''}
      </div>
    </div>
  `;
  container.appendChild(card);
}

// Load tất cả khi mở trang
document.addEventListener('DOMContentLoaded', () => {
  loadOrganizations();
  loadEvents();
  renderPendingEvents();
  renderApprovedEvents();
});
