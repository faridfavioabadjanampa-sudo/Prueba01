(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  function lsGet(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('lsGet error', key, e);
      return null;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('lsSet error', key, e);
    }
  }

  function sessionGet(key) {
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('sessionGet error', key, e);
      return null;
    }
  }
  function sessionSet(key, value) {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('sessionSet error', key, e);
    }
  }

  function generateId(prefix = 'id') {
    return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
  }

  /* ---------- UI small helpers ---------- */
  function showAlert(message, type = 'success') {
    // type: success | error | info
    const container = document.createElement('div');
    container.className = `ss-alert ss-alert-${type}`;
    container.textContent = message;
    // simple styling via inline (in case CSS not loaded); prefer adding CSS in styles.css
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.bottom = '20px';
    container.style.padding = '12px 16px';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    container.style.zIndex = 9999;
    container.style.background = (type === 'error') ? '#ffdddd' : (type === 'info') ? '#e8f0ff' : '#e6ffef';
    container.style.color = (type === 'error') ? '#9b1c1c' : '#023e8a';
    document.body.appendChild(container);
    setTimeout(() => {
      container.style.opacity = '1';
    }, 10);
    setTimeout(() => {
      container.style.transform = 'translateY(8px)';
    }, 10);
    setTimeout(() => {
      container.style.opacity = '0';
      container.style.transform = 'translateY(30px)';
      setTimeout(() => container.remove(), 400);
    }, 2400);
  }

  /* ---------- Data initialization ---------- */
  function initData() {
    if (!lsGet('ss_users')) {
      lsSet('ss_users', [
        { id: 'u_admin', name: 'Admin Serve', email: 'admin@servesalud.org', role: 'admin', password: 'admin123' },
        { id: 'u_coord', name: 'Coordinador', email: 'coord@servesalud.org', role: 'coordinador', password: 'coord123' },
        { id: 'u_demo', name: 'Usuario Demo', email: 'demo@servesalud.org', role: 'voluntario', password: 'demo123', hours: 32 }
      ]);
    }
    if (!lsGet('ss_ops')) {
      lsSet('ss_ops', [
        { id: 'op1', title: 'Acompañamiento emocional', hospital: 'Hospital Nacional', distrito: 'Cercado de Lima', date:'2025-12-12', time:'09:00', cupos:5, desc:'Acompañamiento emocional a pacientes.', img:'img/op-1.png' },
        { id: 'op2', title: 'Recepción y apoyo', hospital: 'Clínica San José', distrito: 'San Isidro', date:'2025-11-05', time:'08:00', cupos:4, desc:'Apoyo en recepción y logística.', img:'img/op-2.png' },
        { id: 'op3', title: 'Actividades recreativas', hospital: 'Hospital Materno Infantil', distrito: 'San Miguel', date:'2025-10-20', time:'10:00', cupos:6, desc:'Actividades para niños.', img:'img/op-3.png' }
      ]);
    }
    if (!lsGet('ss_apps')) lsSet('ss_apps', []);
    if (!lsGet('ss_cert')) lsSet('ss_cert', []);
    if (!lsGet('ss_posts')) lsSet('ss_posts', []);
    if (!lsGet('ss_notifications')) lsSet('ss_notifications', []);
    if (!lsGet('ss_attendance')) lsSet('ss_attendance', []);
  }

  /* ---------- Notifications ---------- */
  function addNotification(obj) {
    const arr = lsGet('ss_notifications') || [];
    const item = {
      id: generateId('not'),
      title: obj.title || 'Notificación',
      body: obj.body || '',
      type: obj.type || 'info',
      at: new Date().toISOString()
    };
    arr.unshift(item);
    lsSet('ss_notifications', arr);
  }

  function renderNotificationsIfNeeded() {
    const container = $('#notifications-list');
    if (!container) return;
    const nots = lsGet('ss_notifications') || [];
    container.innerHTML = nots.map(n => `
      <div class="card">
        <strong>${escapeHtml(n.title)}</strong>
        <p>${escapeHtml(n.body)}</p>
        <small class="muted">${new Date(n.at).toLocaleString()}</small>
      </div>
    `).join('') || '<p class="muted">No hay notificaciones.</p>';
  }

  /* ---------- Escape helper (very small) ---------- */
  function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/[&<>"'`=\/]/g, function(s) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','/':'&#x2F;','`':'&#x60;','=':'&#x3D;'})[s];
    });
  }

  /* ---------- Auth: register / login / recover ---------- */
  function handleRegister() {
    const form = $('#register-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('nombre') || {}).value || '';
      const dni = (document.getElementById('dni') || {}).value || '';
      const email = ((document.getElementById('email') || {}).value || '').trim().toLowerCase();
      const telefono = (document.getElementById('telefono') || {}).value || '';
      const password = (document.getElementById('password') || {}).value || '';
      const role = (document.getElementById('role') || {}).value || 'voluntario';

      if (!name || !email || !password) {
        showAlert('Completa nombre, correo y contraseña.', 'error');
        return;
      }

      const users = lsGet('ss_users') || [];
      if (users.find(u => u.email === email)) {
        showAlert('El correo ya está registrado.', 'error');
        return;
      }

      const newUser = { id: generateId('u'), name, dni, email, telefono, password, role, hours: 0 };
      users.push(newUser);
      lsSet('ss_users', users);
      sessionSet('ss_current_user', newUser);
      addNotification({ title: 'Registro', body: `Cuenta creada para ${name}` });
      showAlert('Registro exitoso. Redirigiendo al perfil...', 'success');
      setTimeout(() => window.location.href = 'perfil.html', 900);
    });
  }

  function handleLogin() {
    const forms = $$('#login-form, #login-form-2');
    if (!forms || forms.length === 0) return;
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = ((form.querySelector('input[type="email"]') || {}).value || '').trim().toLowerCase();
        const pass = ((form.querySelector('input[type="password"]') || {}).value || '');
        if (!email || !pass) {
          showAlert('Ingresa correo y contraseña.', 'error');
          return;
        }
        const users = lsGet('ss_users') || [];
        const user = users.find(u => u.email === email && u.password === pass);
        if (!user) {
          showAlert('Credenciales incorrectas.', 'error');
          return;
        }
        sessionSet('ss_current_user', user);
        addNotification({ title: 'Inicio de sesión', body: `Bienvenido ${user.name}` });
        showAlert('Inicio de sesión correcto. Redirigiendo...', 'success');
        setTimeout(() => {
          if (user.role === 'coordinador') window.location.href = 'coordinador-dashboard.html';
          else window.location.href = 'perfil.html';
        }, 700);
      });
    });
  }

  function handleRecover() {
    const form = $('#recover-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = ((document.getElementById('recover-email') || {}).value || '').trim().toLowerCase();
      const out = $('#recover-msg');
      const users = lsGet('ss_users') || [];
      const user = users.find(u => u.email === email);
      if (!user) {
        if (out) out.textContent = 'Si el correo existe, recibirás instrucciones (simulado).';
        showAlert('Si el correo existe, recibirás instrucciones (simulado).', 'info');
        return;
      }
      if (out) out.textContent = 'Se ha enviado un enlace de recuperación (simulado). Revisa tu correo.';
      addNotification({ title: 'Recuperación', body: `Se solicitó recuperación para ${email}` });
      showAlert('Enviado enlace de recuperación (simulado).', 'success');
    });
  }

  /* ---------- Opportunities rendering & actions ---------- */
  function renderOpportunitiesList() {
    const container = $('#op-cards');
    if (!container) return;
    const ops = lsGet('ss_ops') || [];
    container.innerHTML = '';
    ops.forEach(op => {
      const el = document.createElement('article');
      el.className = 'card';
      el.innerHTML = `
        <img src="${escapeHtml(op.img || 'img/op-1.jpg')}" alt="${escapeHtml(op.title)}" class="card-img">
        <div class="card-body">
          <h3>${escapeHtml(op.title)}</h3>
          <p class="muted">${escapeHtml(op.hospital)} — ${escapeHtml(op.distrito)}</p>
          <div class="card-actions">
            <button class="btn-secondary btn-view" data-op="${escapeHtml(op.id)}">Ver detalles</button>
            <button class="btn-outline btn-apply" data-op="${escapeHtml(op.id)}">Postularme</button>
          </div>
        </div>
      `;
      container.appendChild(el);
    });

    $$('.btn-view').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-op');
      if (id) {
        localStorage.setItem('ss_view_op', id);
        window.location.href = 'oportunidad-detalle.html';
      }
    }));
    $$('.btn-apply').forEach(btn => btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-op');
      if (id) {
        localStorage.setItem('ss_apply_op', id);
        window.location.href = 'postular.html';
      }
    }));
  }

  function fillOpDetailPage() {
    const titleEl = $('#op-title');
    if (!titleEl) return;
    const id = localStorage.getItem('ss_view_op') || 'op1';
    const ops = lsGet('ss_ops') || [];
    const op = ops.find(x => x.id === id) || ops[0];
    if (!op) return;
    const descEl = $('#op-desc'); if (descEl) descEl.textContent = op.desc || '';
    const cuposEl = $('#op-cupos'); if (cuposEl) cuposEl.textContent = op.cupos || '';
    $('#op-title').textContent = `${op.hospital} — ${op.title}`;
    const apps = (lsGet('ss_apps') || []).filter(a => a.opId === op.id);
    const listEl = $('#applicants-list');
    if (listEl) {
      if (apps.length === 0) listEl.textContent = 'No hay postulantes aún.';
      else listEl.innerHTML = apps.map(a => `<div>${escapeHtml(a.name)} — ${escapeHtml(a.status)}</div>`).join('');
    }
    const postBtn = $('#btn-postular');
    if (postBtn) {
      postBtn.addEventListener('click', () => {
        localStorage.setItem('ss_apply_op', op.id);
        window.location.href = 'postular.html';
      });
    }
  }

  /* ---------- Postulation (US11-US13) ---------- */
  function handlePostulation() {
    const form = $('#postular-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('post-nombre') || {}).value || '';
      const email = ((document.getElementById('post-email') || {}).value || '').trim().toLowerCase();
      const phone = (document.getElementById('post-telefono') || {}).value || '';
      const motivo = (document.getElementById('post-motivo') || {}).value || '';
      const fileInput = document.getElementById('post-file');
      const filename = (fileInput && fileInput.files && fileInput.files[0]) ? fileInput.files[0].name : null;
      const opId = localStorage.getItem('ss_apply_op') || 'op1';

      if (!name || !email || !motivo) {
        const out = $('#post-msg'); if (out) out.textContent = 'Por favor completa los campos requeridos.';
        showAlert('Completa los campos requeridos.', 'error');
        return;
      }

      const apps = lsGet('ss_apps') || [];
      const newApp = { id: generateId('app'), opId, name, email, phone, motivo, file: filename, status: 'Pendiente', createdAt: new Date().toISOString() };
      apps.push(newApp);
      lsSet('ss_apps', apps);
      addNotification({ title: 'Nueva postulación', body: `${name} postuló a ${opId}` });
      const out = $('#post-msg'); if (out) out.textContent = 'Postulación enviada correctamente (simulado).';
      showAlert('Postulación enviada.', 'success');
      form.reset();
      setTimeout(() => window.location.href = 'perfil.html', 800);
    });
  }

  /* ---------- Profile: render and edit ---------- */
  function renderProfile() {
    const profileRoot = $('.profile');
    if (!profileRoot) return;
    const user = sessionGet('ss_current_user');
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    const hoursEl = $('#hours'); if (hoursEl) hoursEl.textContent = user.hours || 0;
    // postulaciones del usuario
    const apps = (lsGet('ss_apps') || []).filter(a => a.email === user.email);
    const ul = document.querySelector('.postulaciones');
    if (ul) {
      ul.innerHTML = apps.map(a => `<li>${escapeHtml(getOpTitle(a.opId))} — <span class="status ${escapeHtml((a.status || '').toLowerCase())}">${escapeHtml(a.status)}</span></li>`).join('') || '<li class="muted">No hay postulaciones</li>';
    }
    // certificados
    const certs = (lsGet('ss_cert') || []).filter(c => c.email === user.email);
    const certContainer = document.querySelector('.certificates');
    if (certContainer) {
      certContainer.innerHTML = certs.length === 0 ? '<p class="muted">No hay certificados aún.</p>' : certs.map(c => `<div class="cert"><p>${escapeHtml(c.title)} — ${escapeHtml(c.op)}</p><a class="btn-secondary" href="${escapeHtml(c.link || '#')}" data-cert="${escapeHtml(c.id)}">Descargar (simulado)</a></div>`).join('');
    }
  }

  function handleEditProfile() {
    const form = $('#edit-profile-form');
    if (!form) return;
    const user = sessionGet('ss_current_user');
    if (!user) return;
    // prefill
    const inName = $('#edit-nombre'); if (inName) inName.value = user.name || '';
    const inDni = $('#edit-dni'); if (inDni) inDni.value = user.dni || '';
    const inEmail = $('#edit-email'); if (inEmail) inEmail.value = user.email || '';
    const inPhone = $('#edit-telefono'); if (inPhone) inPhone.value = user.telefono || '';
    const inRole = $('#edit-rol'); if (inRole) inRole.value = user.role || 'voluntario';

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const users = lsGet('ss_users') || [];
      const idx = users.findIndex(u => u.email === user.email);
      if (idx === -1) {
        const out = $('#edit-msg'); if (out) out.textContent = 'Usuario no encontrado';
        showAlert('Usuario no encontrado', 'error');
        return;
      }
      users[idx].name = (inName && inName.value) || users[idx].name;
      users[idx].dni = (inDni && inDni.value) || users[idx].dni;
      users[idx].telefono = (inPhone && inPhone.value) || users[idx].telefono;
      users[idx].role = (inRole && inRole.value) || users[idx].role;
      lsSet('ss_users', users);
      sessionSet('ss_current_user', users[idx]);
      const out = $('#edit-msg'); if (out) out.textContent = 'Perfil actualizado (simulado).';
      showAlert('Perfil actualizado.', 'success');
    });
  }

  /* ---------- Coordinator: create opportunity & manage applicants ---------- */
  function handleCreateOpportunity() {
    const form = $('#create-op-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = (document.getElementById('op-title') || {}).value || '';
      const hospital = (document.getElementById('op-hospital') || {}).value || '';
      const distrito = (document.getElementById('op-distrito') || {}).value || '';
      const date = (document.getElementById('op-fecha') || {}).value || '';
      const time = (document.getElementById('op-hora') || {}).value || '';
      const cupos = parseInt((document.getElementById('op-cupos') || {}).value || '0', 10);
      const desc = (document.getElementById('op-desc') || {}).value || '';

      if (!title || !hospital || !date) {
        const out = $('#create-op-msg'); if (out) out.textContent = 'Completa los campos requeridos.'; showAlert('Completa los campos requeridos.', 'error'); return;
      }
      const ops = lsGet('ss_ops') || [];
      const op = { id: generateId('op'), title, hospital, distrito, date, time, cupos, desc, img:'img/op-1.jpg', createdAt: new Date().toISOString() };
      ops.push(op);
      lsSet('ss_ops', ops);
      addNotification({ title: 'Oportunidad creada', body: `${title} publicada por coordinador.` });
      const out = $('#create-op-msg'); if (out) out.textContent = 'Oportunidad publicada (simulado).';
      showAlert('Oportunidad publicada.', 'success');
      setTimeout(() => window.location.href = 'coordinador-dashboard.html', 700);
    });
  }

  function renderCoordinatorOverview() {
    const elOps = $('#coord-ops-list');
    const elApps = $('#coord-apps-list');
    if (!elOps || !elApps) return;
    const ops = lsGet('ss_ops') || [];
    elOps.innerHTML = ops.map(o => `<div>${escapeHtml(o.title)} — ${escapeHtml(o.hospital)} <a class="btn-outline btn-coord-view" data-op="${escapeHtml(o.id)}">Ver postulantes</a></div>`).join('');
    const apps = lsGet('ss_apps') || [];
    elApps.innerHTML = (apps.slice(-5) || []).map(a => `<div>${escapeHtml(a.name)} — ${escapeHtml(getOpTitle(a.opId))} — ${escapeHtml(a.status)}</div>`).join('') || 'No hay postulaciones recientes.';
    $$('.btn-coord-view').forEach(b => b.addEventListener('click', (ev) => {
      const id = ev.currentTarget.getAttribute('data-op'); if (id) { localStorage.setItem('coord_view_op', id); window.location.href = 'coordinador-postulantes.html'; }
    }));
  }

  function renderCoordinatorApplicants() {
    const container = $('#coordinator-apps');
    if (!container) return;
    const opId = localStorage.getItem('coord_view_op') || null;
    const apps = lsGet('ss_apps') || [];
    const filtered = opId ? apps.filter(a => a.opId === opId) : apps;
    if (filtered.length === 0) { container.innerHTML = '<p class="muted">No hay postulantes.</p>'; return; }
    container.innerHTML = filtered.map(a => `
      <div class="card" id="app-${escapeHtml(a.id)}">
        <h4>${escapeHtml(a.name)}</h4>
        <p>${escapeHtml(a.motivo)}</p>
        <p>${escapeHtml(a.email)} — ${escapeHtml(a.phone)}</p>
        <div>
          <button class="btn-primary btn-approve" data-app="${escapeHtml(a.id)}">Aprobar</button>
          <button class="btn-outline btn-reject" data-app="${escapeHtml(a.id)}">Rechazar</button>
        </div>
      </div>
    `).join('');
    $$('.btn-approve').forEach(b => b.addEventListener('click', (ev) => approveApp(ev.currentTarget.getAttribute('data-app'))));
    $$('.btn-reject').forEach(b => b.addEventListener('click', (ev) => rejectApp(ev.currentTarget.getAttribute('data-app'))));
  }

  function approveApp(appId) {
    const apps = lsGet('ss_apps') || [];
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) { showAlert('Postulación no encontrada', 'error'); return; }
    apps[idx].status = 'Aprobada';
    lsSet('ss_apps', apps);
    // generar certificado simulado
    const certs = lsGet('ss_cert') || [];
    certs.push({ id: generateId('cert'), email: apps[idx].email, title: 'Certificado de Participación', op: getOpTitle(apps[idx].opId), link:'#', createdAt: new Date().toISOString() });
    lsSet('ss_cert', certs);
    addNotification({ title: 'Postulación aprobada', body: `${apps[idx].name} fue aprobad@ para ${getOpTitle(apps[idx].opId)}` });
    showAlert('Postulación aprobada.', 'success');
    renderCoordinatorApplicants();
  }

  function rejectApp(appId) {
    const apps = lsGet('ss_apps') || [];
    const idx = apps.findIndex(a => a.id === appId);
    if (idx === -1) { showAlert('Postulación no encontrada', 'error'); return; }
    apps[idx].status = 'Rechazada';
    lsSet('ss_apps', apps);
    addNotification({ title: 'Postulación rechazada', body: `${apps[idx].name} fue rechazad@` });
    showAlert('Postulación rechazada.', 'info');
    renderCoordinatorApplicants();
  }

  // expose for compatibility with any inline handlers
  window.approveApp = approveApp;
  window.rejectApp = rejectApp;

  /* ---------- Attendance (US18-US21) ---------- */
  function renderAttendancePage() {
    const sel = $('#asistencia-op');
    const list = $('#asistencia-list');
    if (!sel) return;
    sel.innerHTML = '<option value="">Selecciona</option>';
    const ops = lsGet('ss_ops') || [];
    ops.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.id;
      opt.textContent = `${o.title} — ${o.hospital} (${o.date})`;
      sel.appendChild(opt);
    });
    sel.addEventListener('change', () => {
      const opId = sel.value;
      const apps = (lsGet('ss_apps') || []).filter(a => a.opId === opId && a.status === 'Aprobada');
      if (!list) return;
      if (!apps.length) list.innerHTML = '<p class="muted">No hay voluntarios aprobados.</p>';
      else list.innerHTML = apps.map(a => `<div><label><input type="checkbox" data-app="${escapeHtml(a.id)}" checked> ${escapeHtml(a.name)}</label></div>`).join('');
    });
    const saveBtn = $('#save-asistencia');
    if (saveBtn) saveBtn.addEventListener('click', () => {
      const checked = Array.from(document.querySelectorAll('#asistencia-list input[type=checkbox]'))
        .filter(c => c.checked)
        .map(c => c.getAttribute('data-app'));
      const att = lsGet('ss_attendance') || [];
      const date = new Date().toISOString();
      checked.forEach(appId => att.push({ id: generateId('att'), appId, date }));
      lsSet('ss_attendance', att);
      const out = $('#asistencia-msg'); if (out) out.textContent = 'Asistencia registrada (simulado).';
      showAlert('Asistencia registrada (simulado).', 'success');
    });
  }

  /* ---------- Certificates rendering (US22-US24) ---------- */
  function renderCertificates() {
    const list = $('#cert-list');
    if (!list) return;
    const user = sessionGet('ss_current_user');
    if (!user) { list.innerHTML = '<p class="muted">Inicia sesión para ver tus certificados.</p>'; return; }
    const certs = (lsGet('ss_cert') || []).filter(c => c.email === user.email);
    list.innerHTML = certs.length === 0 ? '<p class="muted">No hay certificados.</p>' : certs.map(c => `<div class="cert"><p>${escapeHtml(c.title)} — ${escapeHtml(c.op)}</p><a class="btn-secondary" href="${escapeHtml(c.link || '#')}" data-cert="${escapeHtml(c.id)}">Descargar (simulado)</a></div>`).join('');
  }

  /* ---------- Reports (US34) ---------- */
  function handleReports() {
    const form = $('#report-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const from = $('#report-from').value;
      const to = $('#report-to').value;
      const apps = lsGet('ss_apps') || [];
      const filtered = apps.filter(a => {
        if (!from && !to) return true;
        const d = new Date(a.createdAt);
        const f = from ? new Date(from) : null;
        const t = to ? new Date(to) : null;
        if (f && d < f) return false;
        if (t && d > t) return false;
        return true;
      });
      if (!filtered.length) { const msg = $('#report-msg'); if (msg) msg.textContent = 'No hay datos para el rango.'; showAlert('No hay datos para el rango.', 'info'); return; }
      let csv = 'Nombre,Email,Oportunidad,Estado,Fecha\n';
      filtered.forEach(a => csv += `"${a.name}","${a.email}","${getOpTitle(a.opId)}","${a.status}","${a.createdAt}"\n`);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `reporte_${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove();
      const msg = $('#report-msg'); if (msg) msg.textContent = 'Reporte generado y descargado (simulado).';
      showAlert('Reporte generado y descargado (simulado).', 'success');
    });
  }

  /* ---------- Community posts (US34-US35) ---------- */
  function handleCommunity() {
    const form = $('#post-experience');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = (document.getElementById('post-title') || {}).value || '';
        const body = (document.getElementById('post-body') || {}).value || '';
        const user = sessionGet('ss_current_user') || { name: 'Anónimo' };
        if (!title || !body) { showAlert('Completa los campos', 'error'); return; }
        const posts = lsGet('ss_posts') || [];
        posts.unshift({ id: generateId('post'), title, body, author: user.name, at: new Date().toISOString() });
        lsSet('ss_posts', posts);
        renderPosts();
        form.reset();
        showAlert('Publicación realizada.', 'success');
      });
    }
    renderPosts();
  }

  function renderPosts() {
    const container = $('#posts-list');
    if (!container) return;
    const posts = lsGet('ss_posts') || [];
    container.innerHTML = posts.map(p => `<div class="post"><h4>${escapeHtml(p.title)}</h4><p>${escapeHtml(p.body)}</p><small class="muted">${escapeHtml(p.author)} — ${new Date(p.at).toLocaleString()}</small></div>`).join('') || '<p class="muted">No hay publicaciones aún.</p>';
  }

  /* ---------- Support (US25-US27) ---------- */
  function handleSupport() {
    const form = $('#support-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('support-name') || {}).value || '';
      const email = (document.getElementById('support-email') || {}).value || '';
      const msg = (document.getElementById('support-msg') || {}).value || '';
      if (!name || !email || !msg) { showAlert('Completa los campos de soporte.', 'error'); return; }
      const not = lsGet('ss_notifications') || [];
      not.push({ id: generateId('sup'), title: 'Soporte', body: `${name}: ${msg}`, email, at: new Date().toISOString() });
      lsSet('ss_notifications', not);
      const out = $('#support-msg-out'); if (out) out.textContent = 'Solicitud enviada (simulado).';
      showAlert('Solicitud de soporte enviada.', 'success');
      form.reset();
    });
  }

  /* ---------- Users admin (US31-US33) ---------- */
  function renderUsersList() {
    const container = $('#users-list');
    if (!container) return;
    const users = lsGet('ss_users') || [];
    container.innerHTML = users.map(u => `<div class="card"><strong>${escapeHtml(u.name)}</strong> — ${escapeHtml(u.email)} — ${escapeHtml(u.role)} <div><button class="btn-outline btn-role" data-email="${escapeHtml(u.email)}" data-role="voluntario">Voluntario</button> <button class="btn-outline btn-role" data-email="${escapeHtml(u.email)}" data-role="coordinador">Coordinador</button> <button class="btn-outline btn-delete" data-email="${escapeHtml(u.email)}">Eliminar</button></div></div>`).join('');
    $$('.btn-role').forEach(b => b.addEventListener('click', (ev) => changeRole(ev.currentTarget.getAttribute('data-email'), ev.currentTarget.getAttribute('data-role'))));
    $$('.btn-delete').forEach(b => b.addEventListener('click', (ev) => deleteUser(ev.currentTarget.getAttribute('data-email'))));
  }

  function changeRole(email, role) {
    const users = lsGet('ss_users') || [];
    const idx = users.findIndex(u => u.email === email);
    if (idx === -1) { showAlert('Usuario no encontrado', 'error'); return; }
    users[idx].role = role;
    lsSet('ss_users', users);
    renderUsersList();
    showAlert('Rol actualizado (simulado).', 'success');
  }

  function deleteUser(email) {
    let users = lsGet('ss_users') || [];
    users = users.filter(u => u.email !== email);
    lsSet('ss_users', users);
    renderUsersList();
    showAlert('Usuario eliminado (simulado).', 'info');
  }

  window.changeRole = changeRole;
  window.deleteUser = deleteUser;

  /* ---------- Small utils ---------- */
  function getOpTitle(opId) {
    const ops = lsGet('ss_ops') || [];
    const o = ops.find(x => x.id === opId);
    return o ? o.title : opId;
  }

  /* ---------- Minimal landing behaviors (menu / smooth scroll) ---------- */
  function handleMenuToggle() {
    const menuBtn = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    if (!menuBtn || !nav) return;
    menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
  }

  function handleSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  /* ---------- Init on DOMContentLoaded ---------- */
  function init() {
    initData();
    handleMenuToggle();
    handleSmoothScroll();

    // auth
    handleRegister();
    handleLogin();
    handleRecover();

    // landing / opportunites
    renderOpportunitiesList();
    fillOpDetailPage();

    // postulation
    handlePostulation();

    // profile
    renderProfile();
    handleEditProfile();

    // coordinator
    handleCreateOpportunity();
    renderCoordinatorOverview();
    renderCoordinatorApplicants();

    // attendance
    renderAttendancePage();

    // certificates
    renderCertificates();

    // reports
    handleReports();

    // community
    handleCommunity();

    // support
    handleSupport();

    // notifications
    renderNotificationsIfNeeded();

    // admin
    renderUsersList();
  }

  document.addEventListener('DOMContentLoaded', init);

})();
