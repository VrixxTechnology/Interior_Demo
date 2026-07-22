/**
 * BS PARADISE INTERIOR — ADMIN CMS INTERACTION SCRIPT
 * Manages Auth state toggle, Sidebar tab navigation, Modal dialogs, and Dummy CRUD actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. AUTHENTICATION STATE SIMULATION
  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('admin-login-form');
  const logoutBtn = document.getElementById('admin-logout-btn');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple simulation login
      loginView.style.display = 'none';
      dashboardView.style.display = 'flex';
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      dashboardView.style.display = 'none';
      loginView.style.display = 'flex';
    });
  }

  // 2. SIDEBAR TAB NAVIGATION
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-tab]');
  const adminTabSections = document.querySelectorAll('.admin-tab-section');
  const topbarTitle = document.querySelector('.topbar-title');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      const targetTab = link.getAttribute('data-tab');

      adminTabSections.forEach(section => {
        if (section.id === `tab-${targetTab}`) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });

      if (topbarTitle) {
        topbarTitle.textContent = link.textContent.trim();
      }
    });
  });

  // 3. MODAL DIALOGS MANAGER
  const modalBackdrop = document.getElementById('admin-modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body-content');
  const modalCloseBtns = document.querySelectorAll('.close-modal-trigger');

  function openAdminModal(title, contentHtml) {
    if (!modalBackdrop) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = contentHtml;
    modalBackdrop.classList.add('is-active');
  }

  function closeAdminModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-active');
    }
  }

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', closeAdminModal);
  });

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeAdminModal();
    });
  }

  // 4. "ADD NEW PHOTO" MODAL TRIGGER
  const addPhotoBtn = document.getElementById('btn-add-photo');
  if (addPhotoBtn) {
    addPhotoBtn.addEventListener('click', () => {
      const htmlContent = `
        <form id="dummy-add-photo-form" onsubmit="event.preventDefault(); alert('Demo Mode: Photo added successfully!'); document.querySelector('.close-modal-trigger').click();">
          <div style="display:flex; flex-direction:column; gap: 1rem;">
            <div>
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:0.375rem;">Photo Title</label>
              <input type="text" class="form-control" placeholder="e.g. Minimalist Villa Living Room" required style="width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:0.375rem;">Category</label>
              <select class="form-control" style="width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:6px;">
                <option>Living Room</option>
                <option>Bedroom</option>
                <option>Kitchen</option>
                <option>Office</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:0.375rem;">Image File</label>
              <input type="file" class="form-control" accept="image/*" style="width:100%; padding:0.5rem; border:1px solid #ddd; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:0.375rem;">Description</label>
              <textarea class="form-control" rows="3" placeholder="Brief project summary..." style="width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:6px;"></textarea>
            </div>
            <button type="submit" class="action-btn" style="background:#1C1A18; color:white; padding:0.875rem; margin-top:0.5rem; border-radius:6px;">Upload & Save Photo</button>
          </div>
        </form>
      `;
      openAdminModal('Add New Portfolio Photo', htmlContent);
    });
  }

  // 5. "ADD NEW VIDEO" MODAL TRIGGER
  const addVideoBtn = document.getElementById('btn-add-video');
  if (addVideoBtn) {
    addVideoBtn.addEventListener('click', () => {
      const htmlContent = `
        <form id="dummy-add-video-form" onsubmit="event.preventDefault(); alert('Demo Mode: Video embed added!'); document.querySelector('.close-modal-trigger').click();">
          <div style="display:flex; flex-direction:column; gap: 1rem;">
            <div>
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:0.375rem;">Video Title</label>
              <input type="text" class="form-control" placeholder="e.g. Modern Penthouse Walkthrough" required style="width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:6px;">
            </div>
            <div>
              <label style="display:block; font-size:0.8125rem; font-weight:600; margin-bottom:0.375rem;">YouTube Video URL or ID</label>
              <input type="text" class="form-control" placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ" required style="width:100%; padding:0.75rem; border:1px solid #ddd; border-radius:6px;">
            </div>
            <button type="submit" class="action-btn" style="background:#1C1A18; color:white; padding:0.875rem; margin-top:0.5rem; border-radius:6px;">Embed Video</button>
          </div>
        </form>
      `;
      openAdminModal('Embed New YouTube Video', htmlContent);
    });
  }

  // 6. DELETE & STATUS ACTION HANDLERS (VISUAL DUMMY)
  document.addEventListener('click', (e) => {
    if (e.target.closest('.delete-row-trigger')) {
      if (confirm('Demo Mode: Are you sure you want to delete this item?')) {
        const row = e.target.closest('tr');
        if (row) row.remove();
      }
    }

    if (e.target.closest('.status-change-trigger')) {
      const badge = e.target.closest('tr').querySelector('.badge');
      if (badge) {
        if (badge.classList.contains('badge-pending')) {
          badge.className = 'badge badge-confirmed';
          badge.textContent = 'Confirmed';
        } else if (badge.classList.contains('badge-confirmed')) {
          badge.className = 'badge badge-completed';
          badge.textContent = 'Completed';
        } else {
          badge.className = 'badge badge-pending';
          badge.textContent = 'Pending';
        }
      }
    }
  });
});
