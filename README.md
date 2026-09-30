* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  background: #f4f4f4;
  font-family: Inter, 'Segoe UI', sans-serif;
  color: #1b1b1b;
}

body {
  min-height: 100vh;
}

button, input, select, textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}

.login-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #620d0d 0%, #b5860a 100%);
  padding: 24px;
}

.login-card {
  width: min(460px, 100%);
  background: rgba(255, 255, 255, 0.96);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
}

.login-header {
  background: linear-gradient(135deg, #8b1e1e 0%, #d4af37 100%);
  color: white;
  text-align: center;
  padding: 28px 20px 20px;
}

.login-header h1 {
  margin: 10px 0 0;
  font-size: clamp(1.8rem, 3vw, 2.5rem);
}

.brand-mark {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, 0.18);
  margin: 0 auto;
  font-size: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.login-body {
  padding: 24px;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.field-group label {
  font-weight: 700;
  color: #333;
}

.field-group input,
.field-group select,
.field-group textarea,
.toolbar-row input,
.toolbar-inline input {
  width: 100%;
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  padding: 11px 12px;
  background: #fff;
  color: #1c1c1c;
}

.field-group textarea {
  min-height: 120px;
  resize: vertical;
}

.login-actions,
.action-row,
.toolbar-row,
.toolbar-inline {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.btn {
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-weight: 700;
  transition: 0.2s ease;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #8d1d1d 0%, #531313 100%);
  color: white;
}

.btn-secondary {
  background: #f3f4f6;
  color: #1f1f1f;
  border: 1px solid #dfe3ea;
}

.btn-danger {
  background: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.header {
  background: linear-gradient(135deg, #5a0d0d 0%, #8b1e1e 30%, #d4af37 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 14px 22px;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 10px 22px rgba(74, 9, 9, 0.18);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand h2 {
  margin: 0;
  font-size: clamp(1.1rem, 2vw, 1.6rem);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-badge {
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.page-shell {
  display: flex;
  min-height: calc(100vh - 78px);
}

.sidebar {
  width: 220px;
  background: #fff;
  border-right: 1px solid #ece7d8;
  padding: 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-btn {
  border: 1px solid #e7dfc4;
  background: #fff;
  color: #222;
  border-radius: 10px;
  padding: 12px 14px;
  text-align: left;
  font-weight: 700;
}

.nav-btn.active {
  background: linear-gradient(135deg, #8d1d1d 0%, #5b0d0d 100%);
  color: white;
  border-color: transparent;
}

.content {
  flex: 1;
  padding: 20px;
}

.panel {
  display: block;
}

.card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.03);
  padding: 18px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  margin-bottom: 18px;
}

.section-head.between {
  justify-content: space-between;
}

.section-head h3 {
  margin: 0;
  font-size: 1.2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(170px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 700;
}

.stat-card strong {
  font-size: clamp(1.7rem, 2vw, 2.2rem);
}

.stat-card small {
  color: #22a061;
  font-weight: 700;
}

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tab-btn {
  border: 1px solid #e4d39b;
  background: #fff9e8;
  color: #3d3d3d;
  border-radius: 10px;
  padding: 9px 12px;
  font-weight: 700;
}

.tab-btn.active {
  background: linear-gradient(135deg, #8d1d1d 0%, #5b0d0d 100%);
  color: white;
  border-color: transparent;
}

.table-wrap {
  overflow-x: auto;
}

table {
  border-collapse: collapse;
  width: 100%;
  min-width: 820px;
}

th, td {
  padding: 12px 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
  vertical-align: top;
}

th {
  background: #faf7ef;
  color: #513d0e;
  font-size: 0.85rem;
}

.tiny-btn {
  border: 1px solid #dfe7ff;
  background: #eff6ff;
  color: #2563eb;
  padding: 6px 10px;
  border-radius: 8px;
  font-weight: 700;
}

.form-grid {
  display: grid;
  gap: 14px;
}

.form-grid.two-cols {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.mini-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin: 10px 0 18px;
}

.file-box {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border: 1px dashed #d3d3d3;
  background: #fafafa;
  border-radius: 12px;
}

.upload-preview-thumb {
  width: 100%;
  max-height: 160px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #ececec;
  cursor: pointer;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.72rem;
  font-weight: 700;
}

.status-badge.success {
  background: #dcfce7;
  color: #166534;
}

.status-badge.warning {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.info {
  background: #dbeafe;
  color: #1d4ed8;
}

.mt-24 {
  margin-top: 24px;
}

.mb-16 {
  margin-bottom: 16px;
}

.image-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 24px;
}

.image-modal-box {
  width: min(760px, 100%);
  background: white;
  border-radius: 18px;
  overflow: hidden;
}

.image-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(135deg, #8d1d1d 0%, #d4af37 100%);
  color: white;
  padding: 14px 18px;
  font-weight: 700;
}

.image-modal-box img {
  width: 100%;
  max-height: 72vh;
  object-fit: contain;
  background: #f5f5f5;
  padding: 18px;
}

.image-modal-box a {
  display: inline-flex;
  margin: 16px auto 18px;
}

@media (max-width: 900px) {
  .page-shell {
    display: block;
  }

  .sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ece7d8;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .stats-grid,
  .form-grid.two-cols,
  .mini-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 640px) {
  .content {
    padding: 14px;
  }

  .stats-grid,
  .form-grid.two-cols,
  .mini-grid {
    grid-template-columns: 1fr;
  }

  .header,
  .section-head.between,
  .toolbar-row,
  .toolbar-inline,
  .login-actions,
  .action-row {
    flex-direction: column;
    align-items: stretch;
  }

  .brand h2 {
    font-size: 1rem;
  }

  .nav-btn {
    flex: 1 1 calc(50% - 8px);
  }
}






























































































































































































































																																																																																																																	
