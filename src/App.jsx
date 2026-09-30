import { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';

const STORAGE_KEY = 'pallet-monitoring-system-v1';

const defaultData = {
  users: [
    { username: 'admin', password: 'admin', role: 'admin' },
    { username: 'operator', password: 'operator', role: 'operator' },
    { username: 'pengunjung', password: 'pengunjung', role: 'pengunjung' },
  ],
  plants: [
    { code: 'PL-01', name: 'Plant Bandung' },
    { code: 'PL-02', name: 'Plant Surabaya' },
    { code: 'PL-03', name: 'Plant Medan' },
  ],
  warehouses: [
    { code: 'WH-001', name: 'Gudang A' },
    { code: 'WH-002', name: 'Gudang B' },
    { code: 'WH-003', name: 'Gudang C' },
  ],
  expediteurs: [
    { code: 'EXP-001', name: 'CV Mitra Logistics' },
    { code: 'EXP-002', name: 'PT Sukses Jaya' },
    { code: 'EXP-003', name: 'PT Mandiri Cargo' },
  ],
  transactionTypes: [
    { code: 'TT-01', name: 'Pallet In' },
    { code: 'TT-02', name: 'Pallet Out' },
    { code: 'TT-03', name: 'Transfer Internal' },
  ],
  locations: ['Area Receiving', 'Area Staging', 'Area Loading', 'Area Sorting', 'Cold Storage'],
  transactions: [
    {
      id: 1,
      tanggal: '2026-09-30',
      plant: 'PL-01',
      shift: 'A',
      jenisTransaksi: 'TT-01',
      lokasi: 'Area Receiving',
      nomorTransaksi: 'TX-001',
      kodeEkspeditur: 'EXP-001',
      namaEkspeditur: 'CV Mitra Logistics',
      kodeGudangAsal: 'WH-001',
      namaGudangAsal: 'Gudang A',
      kodeGudangTujuan: 'WH-002',
      namaGudangTujuan: 'Gudang B',
      inRfi: 12,
      inTbr: 8,
      inBer: 3,
      outRfi: 0,
      outTbr: 0,
      outBer: 0,
      totalIn: 23,
      totalOut: 0,
      total: 23,
      catatan: 'Transaksi normal',
      upload: '',
    },
    {
      id: 2,
      tanggal: '2026-09-30',
      plant: 'PL-02',
      shift: 'B',
      jenisTransaksi: 'TT-02',
      lokasi: 'Area Loading',
      nomorTransaksi: 'TX-002',
      kodeEkspeditur: 'EXP-002',
      namaEkspeditur: 'PT Sukses Jaya',
      kodeGudangAsal: 'WH-002',
      namaGudangAsal: 'Gudang B',
      kodeGudangTujuan: 'WH-003',
      namaGudangTujuan: 'Gudang C',
      inRfi: 0,
      inTbr: 0,
      inBer: 0,
      outRfi: 6,
      outTbr: 4,
      outBer: 2,
      totalIn: 0,
      totalOut: 12,
      total: 12,
      catatan: 'Pengiriman sesuai jadwal',
      upload: '',
    },
  ],
};

const getStoredData = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    return structuredClone(defaultData);
  }
};

const saveData = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

const getShiftLabel = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 14) return 'A';
  if (hour >= 14 && hour < 22) return 'B';
  return 'C';
};

const getTypeName = (code, types) => {
  const match = types.find((item) => item.code === code);
  return match ? match.name : code;
};

const getNameByCode = (items, code) => {
  if (!code) return '';
  const match = items.find((item) => item.code.toLowerCase() === String(code).toLowerCase());
  return match ? match.name : '';
};

const initialForm = () => ({
  tanggal: new Date().toISOString().slice(0, 10),
  plant: 'PL-01',
  shift: getShiftLabel(),
  jenisTransaksi: 'TT-01',
  lokasi: 'Area Receiving',
  nomorTransaksi: '',
  kodeEkspeditur: '',
  namaEkspeditur: '',
  kodeGudangAsal: '',
  namaGudangAsal: '',
  kodeGudangTujuan: '',
  namaGudangTujuan: '',
  inRfi: 0,
  inTbr: 0,
  inBer: 0,
  outRfi: 0,
  outTbr: 0,
  outBer: 0,
  totalIn: 0,
  totalOut: 0,
  total: 0,
  catatan: '',
  upload: '',
});

export default function App() {
  const [data, setData] = useState(() => getStoredData());
  const [user, setUser] = useState(() => {
    const raw = sessionStorage.getItem('pallet-user');
    return raw ? JSON.parse(raw) : null;
  });
  const [activeSection, setActiveSection] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('tab1');
  const [txSearch, setTxSearch] = useState('');
  const [loginForm, setLoginForm] = useState({
    role: 'admin',
    username: 'admin',
    password: 'admin',
  });
  const [transactionForm, setTransactionForm] = useState(initialForm());
  const [warehouseForm, setWarehouseForm] = useState({ code: '', name: '' });
  const [expediteurForm, setExpediteurForm] = useState({ code: '', name: '' });
  const [plantForm, setPlantForm] = useState({ code: '', name: '' });
  const [typeForm, setTypeForm] = useState({ code: '', name: '' });
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('pallet-user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('pallet-user');
    }
  }, [user]);

  useEffect(() => {
    const totalIn = Number(transactionForm.inRfi || 0) + Number(transactionForm.inTbr || 0) + Number(transactionForm.inBer || 0);
    const totalOut = Number(transactionForm.outRfi || 0) + Number(transactionForm.outTbr || 0) + Number(transactionForm.outBer || 0);
    setTransactionForm((prev) => ({
      ...prev,
      totalIn,
      totalOut,
      total: totalIn + totalOut,
    }));
  }, [transactionForm.inRfi, transactionForm.inTbr, transactionForm.inBer, transactionForm.outRfi, transactionForm.outTbr, transactionForm.outBer]);

  const isGuest = user?.role === 'pengunjung';

  const filteredTransactions = useMemo(() => {
    const q = txSearch.trim().toLowerCase();
    if (!q) return data.transactions;

    return data.transactions.filter((item) => {
      const flat = [
        item.nomorTransaksi,
        item.lokasi,
        item.plant,
        item.namaEkspeditur,
        item.namaGudangAsal,
        item.namaGudangTujuan,
        item.catatan,
      ].join(' ').toLowerCase();

      return flat.includes(q);
    });
  }, [data.transactions, txSearch]);

  const dashboardStats = useMemo(() => {
    const onPosition = data.transactions.filter((item) => item.total > 0).length;
    const onPool = data.transactions.filter((item) => item.totalOut > 0).length;
    const rilis = data.transactions.filter((item) => item.totalIn > 0).length;
    const tonaseGudang = data.transactions.reduce((sum, item) => sum + item.total, 0);

    return { onPosition, onPool, rilis, tonaseGudang };
  }, [data.transactions]);

  const handleLogin = () => {
    const { role, username, password } = loginForm;
    const match = data.users.find(
      (u) => u.role === role && u.username === username && u.password === password,
    );

    if (!match) {
      alert('Username, password, atau role tidak valid.');
      return;
    }

    setUser(match);
  };

  const handleLogout = () => setUser(null);

  const handleTransactionField = (field, value) => {
    setTransactionForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Silakan pilih file gambar.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const val = String(reader.result);
      setTransactionForm((prev) => ({ ...prev, upload: val }));
      setPreviewImage(val);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveTransaction = () => {
    if (!transactionForm.nomorTransaksi.trim() || !transactionForm.tanggal) {
      alert('Nomor transaksi dan tanggal wajib diisi.');
      return;
    }

    const entry = {
      ...transactionForm,
      id: Date.now(),
      nomorTransaksi: transactionForm.nomorTransaksi.trim(),
      kodeEkspeditur: transactionForm.kodeEkspeditur.trim(),
      kodeGudangAsal: transactionForm.kodeGudangAsal.trim(),
      kodeGudangTujuan: transactionForm.kodeGudangTujuan.trim(),
      namaEkspeditur: transactionForm.namaEkspeditur.trim(),
      namaGudangAsal: transactionForm.namaGudangAsal.trim(),
      namaGudangTujuan: transactionForm.namaGudangTujuan.trim(),
      catatan: transactionForm.catatan.trim(),
      totalIn: Number(transactionForm.totalIn || 0),
      totalOut: Number(transactionForm.totalOut || 0),
      total: Number(transactionForm.total || 0),
    };

    setData((prev) => ({
      ...prev,
      transactions: [entry, ...prev.transactions],
    }));

    setTransactionForm(initialForm());
    setPreviewImage('');
    alert('Transaksi berhasil disimpan.');
  };

  const handleAddWarehouse = () => {
    const code = warehouseForm.code.trim();
    const name = warehouseForm.name.trim();
    if (!code || !name) {
      alert('Kode dan nama gudang harus diisi.');
      return;
    }

    if (data.warehouses.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
      alert('Kode gudang sudah ada.');
      return;
    }

    setData((prev) => ({
      ...prev,
      warehouses: [...prev.warehouses, { code, name }],
    }));
    setWarehouseForm({ code: '', name: '' });
  };

  const handleAddExpediteur = () => {
    const code = expediteurForm.code.trim();
    const name = expediteurForm.name.trim();
    if (!code || !name) {
      alert('Kode dan nama ekspeditur harus diisi.');
      return;
    }

    if (data.expediteurs.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
      alert('Kode ekspeditur sudah ada.');
      return;
    }

    setData((prev) => ({
      ...prev,
      expediteurs: [...prev.expediteurs, { code, name }],
    }));
    setExpediteurForm({ code: '', name: '' });
  };

  const handleAddPlant = () => {
    const code = plantForm.code.trim();
    const name = plantForm.name.trim();
    if (!code || !name) {
      alert('Kode dan nama plant harus diisi.');
      return;
    }

    if (data.plants.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
      alert('Kode plant sudah ada.');
      return;
    }

    setData((prev) => ({
      ...prev,
      plants: [...prev.plants, { code, name }],
    }));
    setPlantForm({ code: '', name: '' });
  };

  const handleAddTransactionType = () => {
    const code = typeForm.code.trim();
    const name = typeForm.name.trim();
    if (!code || !name) {
      alert('Kode dan nama jenis transaksi harus diisi.');
      return;
    }

    if (data.transactionTypes.some((item) => item.code.toLowerCase() === code.toLowerCase())) {
      alert('Kode jenis transaksi sudah ada.');
      return;
    }

    setData((prev) => ({
      ...prev,
      transactionTypes: [...prev.transactionTypes, { code, name }],
    }));
    setTypeForm({ code: '', name: '' });
  };

  const exportToExcel = () => {
    const rows = filteredTransactions.map((item) => ({
      Tanggal: item.tanggal,
      Plant: item.plant,
      Shift: item.shift,
      Jenis_Transaksi: getTypeName(item.jenisTransaksi, data.transactionTypes),
      Lokasi: item.lokasi,
      Nomor_Transaksi: item.nomorTransaksi,
      Kode_Ekspeditur: item.kodeEkspeditur,
      Nama_Ekspeditur: item.namaEkspeditur,
      Kode_Gudang_Asal: item.kodeGudangAsal,
      Nama_Gudang_Asal: item.namaGudangAsal,
      Kode_Gudang_Tujuan: item.kodeGudangTujuan,
      Nama_Gudang_Tujuan: item.namaGudangTujuan,
      In_RFI: item.inRfi,
      In_TBR: item.inTbr,
      In_BER: item.inBer,
      Total_In: item.totalIn,
      Out_RFI: item.outRfi,
      Out_TBR: item.outTbr,
      Out_BER: item.outBer,
      Total_Out: item.totalOut,
      Total: item.total,
      Catatan: item.catatan,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');
    XLSX.writeFile(workbook, 'pallet-monitoring-system.xlsx');
  };

  const deleteRecord = (key, code) => {
    if (key === 'warehouse') {
      setData((prev) => ({ ...prev, warehouses: prev.warehouses.filter((item) => item.code !== code) }));
    }
    if (key === 'expediteur') {
      setData((prev) => ({ ...prev, expediteurs: prev.expediteurs.filter((item) => item.code !== code) }));
    }
    if (key === 'plant') {
      setData((prev) => ({ ...prev, plants: prev.plants.filter((item) => item.code !== code) }));
    }
    if (key === 'type') {
      setData((prev) => ({ ...prev, transactionTypes: prev.transactionTypes.filter((item) => item.code !== code) }));
    }
  };

  const tabData = {
    tab1: data.transactions.slice(0, 6).map((item) => ({
      nomorTransaksi: item.nomorTransaksi,
      gudangAsal: item.namaGudangAsal || item.kodeGudangAsal,
      gudangTujuan: item.namaGudangTujuan || item.kodeGudangTujuan,
      jenis: getTypeName(item.jenisTransaksi, data.transactionTypes),
      total: item.total,
      status: 'Aktif',
    })),
    tab2: data.transactions.slice(0, 6).map((item) => ({
      nomorTransaksi: item.nomorTransaksi,
      lokasi: item.lokasi,
      plant: item.plant,
      shift: item.shift,
      total: item.total,
      status: 'On Pool',
    })),
    tab3: data.transactions.slice(0, 6).map((item) => ({
      nomorTransaksi: item.nomorTransaksi,
      ekspeditur: item.namaEkspeditur || item.kodeEkspeditur,
      gudangTujuan: item.namaGudangTujuan || item.kodeGudangTujuan,
      total: item.total,
      status: 'Ready',
    })),
    tab4: data.warehouses.map((warehouse) => {
      const total = data.transactions
        .filter((item) => item.namaGudangAsal === warehouse.name || item.namaGudangTujuan === warehouse.name)
        .reduce((sum, item) => sum + item.total, 0);
      return {
        gudang: warehouse.name,
        tonase: total,
        rataRata: Math.max(0, Math.round(total / 2)),
        trend: `↑ ${Math.max(1, Math.round(total / 10))}%`,
      };
    }),
    tab5: data.expediteurs.map((expediteur) => {
      const total = data.transactions
        .filter((item) => item.namaEkspeditur === expediteur.name)
        .reduce((sum, item) => sum + item.total, 0);
      return {
        ekspeditur: expediteur.name,
        tonase: total,
        rataRata: Math.max(0, Math.round(total / 2)),
        trend: `↑ ${Math.max(1, Math.round(total / 8))}%`,
      };
    }),
    tab6: data.transactions.slice(0, 8).map((item) => ({
      gudang: item.namaGudangAsal || item.kodeGudangAsal,
      lokasi: item.lokasi,
      shift: item.shift,
      total: item.total,
      catatan: item.catatan || '-',
    })),
    tab7: data.transactions.slice(0, 8).map((item) => ({
      ekspeditur: item.namaEkspeditur || item.kodeEkspeditur,
      kode: item.kodeEkspeditur,
      gudangAsal: item.namaGudangAsal || item.kodeGudangAsal,
      gudangTujuan: item.namaGudangTujuan || item.kodeGudangTujuan,
      total: item.total,
    })),
  };

  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-mark">📦</div>
            <h1>Pallet Management System</h1>
          </div>
          <div className="login-body">
            <div className="field-group">
              <label>Role</label>
              <select
                value={loginForm.role}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                <option value="admin">Admin</option>
                <option value="operator">Operator</option>
                <option value="pengunjung">Pengunjung</option>
              </select>
            </div>

            <div className="field-group">
              <label>Username</label>
              <input
                value={loginForm.username}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
              />
            </div>

            <div className="field-group">
              <label>Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>

            <div className="login-actions">
              <button className="btn btn-primary" onClick={handleLogin}>Login</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  const match = data.users.find((u) => u.role === loginForm.role);
                  if (match) {
                    setLoginForm((prev) => ({ ...prev, username: match.username, password: match.password }));
                  }
                }}
              >
                Demo Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="brand-mark">📦</div>
          <h2>Pallet Management System</h2>
        </div>
        <div className="header-actions">
          <span className="user-badge">{user.role.toUpperCase()}</span>
          <button className="btn btn-primary" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="page-shell">
        <aside className="sidebar">
          <button className={activeSection === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveSection('dashboard')}>Dashboard</button>
          <button className={activeSection === 'transactions' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveSection('transactions')}>Transaksi</button>
          {!isGuest && (
            <>
              <button className={activeSection === 'warehouse' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveSection('warehouse')}>DB Gudang</button>
              <button className={activeSection === 'expediteur' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveSection('expediteur')}>DB Ekspeditur</button>
              <button className={activeSection === 'plant' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveSection('plant')}>DB Plant</button>
              <button className={activeSection === 'transactionType' ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveSection('transactionType')}>DB Jenis Transaksi</button>
            </>
          )}
        </aside>

        <main className="content">
          {activeSection === 'dashboard' && (
            <section className="panel">
              <div className="summary-grid">
                <div className="stat-card">
                  <span className="stat-label">Pallet On Position</span>
                  <strong>{dashboardStats.onPosition}</strong>
                  <small>Live</small>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Pallet On Pool</span>
                  <strong>{dashboardStats.onPool}</strong>
                  <small>Live</small>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Rilis Pallet</span>
                  <strong>{dashboardStats.rilis}</strong>
                  <small>Live</small>
                </div>
                <div className="stat-card">
                  <span className="stat-label">Tonase Gudang</span>
                  <strong>{dashboardStats.tonaseGudang}</strong>
                  <small>Ton</small>
                </div>
              </div>

              <div className="card">
                <div className="section-head">
                  <h3>Monitoring Dashboard</h3>
                </div>

                <div className="tabs">
                  {['tab1', 'tab2', 'tab3', 'tab4', 'tab5', 'tab6', 'tab7'].map((tab) => (
                    <button
                      key={tab}
                      className={activeTab === tab ? 'tab-btn active' : 'tab-btn'}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab === 'tab1' && 'Pallet On Position'}
                      {tab === 'tab2' && 'Pallet On Pool'}
                      {tab === 'tab3' && 'Rilis Pallet'}
                      {tab === 'tab4' && 'Tonase Gudang'}
                      {tab === 'tab5' && 'Tonase Ekspeditur'}
                      {tab === 'tab6' && 'Monitoring Gudang'}
                      {tab === 'tab7' && 'Monitoring Ekspeditur'}
                    </button>
                  ))}
                </div>

                {activeTab === 'tab1' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Nomor Transaksi</th>
                          <th>Gudang Asal</th>
                          <th>Gudang Tujuan</th>
                          <th>Jenis</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab1.map((row) => (
                          <tr key={row.nomorTransaksi}>
                            <td>{row.nomorTransaksi}</td>
                            <td>{row.gudangAsal}</td>
                            <td>{row.gudangTujuan}</td>
                            <td>{row.jenis}</td>
                            <td>{row.total}</td>
                            <td><span className="status-badge success">{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'tab2' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Nomor Transaksi</th>
                          <th>Lokasi</th>
                          <th>Plant</th>
                          <th>Shift</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab2.map((row) => (
                          <tr key={row.nomorTransaksi}>
                            <td>{row.nomorTransaksi}</td>
                            <td>{row.lokasi}</td>
                            <td>{row.plant}</td>
                            <td>{row.shift}</td>
                            <td>{row.total}</td>
                            <td><span className="status-badge warning">{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'tab3' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Nomor Transaksi</th>
                          <th>Ekspeditur</th>
                          <th>Gudang Tujuan</th>
                          <th>Total</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab3.map((row) => (
                          <tr key={row.nomorTransaksi}>
                            <td>{row.nomorTransaksi}</td>
                            <td>{row.ekspeditur}</td>
                            <td>{row.gudangTujuan}</td>
                            <td>{row.total}</td>
                            <td><span className="status-badge info">{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'tab4' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Gudang</th>
                          <th>Tonase</th>
                          <th>Rata-rata</th>
                          <th>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab4.map((row) => (
                          <tr key={row.gudang}>
                            <td>{row.gudang}</td>
                            <td>{row.tonase}</td>
                            <td>{row.rataRata}</td>
                            <td>{row.trend}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'tab5' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Ekspeditur</th>
                          <th>Tonase</th>
                          <th>Rata-rata</th>
                          <th>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab5.map((row) => (
                          <tr key={row.ekspeditur}>
                            <td>{row.ekspeditur}</td>
                            <td>{row.tonase}</td>
                            <td>{row.rataRata}</td>
                            <td>{row.trend}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'tab6' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Gudang</th>
                          <th>Lokasi</th>
                          <th>Shift</th>
                          <th>Total</th>
                          <th>Catatan</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab6.map((row) => (
                          <tr key={`${row.gudang}-${row.lokasi}`}>
                            <td>{row.gudang}</td>
                            <td>{row.lokasi}</td>
                            <td>{row.shift}</td>
                            <td>{row.total}</td>
                            <td>{row.catatan}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'tab7' && (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Ekspeditur</th>
                          <th>Kode</th>
                          <th>Gudang Asal</th>
                          <th>Gudang Tujuan</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tabData.tab7.map((row) => (
                          <tr key={`${row.ekspeditur}-${row.kode}`}>
                            <td>{row.ekspeditur}</td>
                            <td>{row.kode}</td>
                            <td>{row.gudangAsal}</td>
                            <td>{row.gudangTujuan}</td>
                            <td>{row.total}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          )}

          {activeSection === 'transactions' && (
            <section className="panel">
              <div className="card">
                <div className="section-head between">
                  <h3>Form Input Transaksi</h3>
                  <div className="toolbar-inline">
                    <input type="text" placeholder="Pencarian cepat..." value={txSearch} onChange={(e) => setTxSearch(e.target.value)} />
                    <button className="btn btn-primary" onClick={exportToExcel}>Unduh Excel</button>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="field-group">
                    <label>Tanggal</label>
                    <input type="date" value={transactionForm.tanggal} readOnly />
                  </div>
                  <div className="field-group">
                    <label>Plant</label>
                    <select value={transactionForm.plant} onChange={(e) => handleTransactionField('plant', e.target.value)}>
                      {data.plants.map((plant) => (
                        <option key={plant.code} value={plant.code}>{plant.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label>Shift</label>
                    <input type="text" value={transactionForm.shift} readOnly />
                  </div>
                  <div className="field-group">
                    <label>Jenis Transaksi</label>
                    <select value={transactionForm.jenisTransaksi} onChange={(e) => handleTransactionField('jenisTransaksi', e.target.value)}>
                      {data.transactionTypes.map((type) => (
                        <option key={type.code} value={type.code}>{type.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="field-group">
                    <label>Lokasi</label>
                    <select value={transactionForm.lokasi} onChange={(e) => handleTransactionField('lokasi', e.target.value)}>
                      {data.locations.map((location) => (
                        <option key={location} value={location}>{location}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field-group">
                    <label>Nomor Transaksi</label>
                    <input type="text" value={transactionForm.nomorTransaksi} onChange={(e) => handleTransactionField('nomorTransaksi', e.target.value)} placeholder="TX-001" />
                  </div>

                  <div className="field-group">
                    <label>Kode Ekspeditur</label>
                    <input
                      type="text"
                      value={transactionForm.kodeEkspeditur}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleTransactionField('kodeEkspeditur', value);
                        handleTransactionField('namaEkspeditur', getNameByCode(data.expediteurs, value));
                      }}
                    />
                  </div>
                  <div className="field-group">
                    <label>Nama Ekspeditur</label>
                    <input type="text" value={transactionForm.namaEkspeditur} readOnly />
                  </div>

                  <div className="field-group">
                    <label>Kode Gudang Asal</label>
                    <input
                      type="text"
                      value={transactionForm.kodeGudangAsal}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleTransactionField('kodeGudangAsal', value);
                        handleTransactionField('namaGudangAsal', getNameByCode(data.warehouses, value));
                      }}
                    />
                  </div>
                  <div className="field-group">
                    <label>Nama Gudang Asal</label>
                    <input type="text" value={transactionForm.namaGudangAsal} readOnly />
                  </div>

                  <div className="field-group">
                    <label>Kode Gudang Tujuan</label>
                    <input
                      type="text"
                      value={transactionForm.kodeGudangTujuan}
                      onChange={(e) => {
                        const value = e.target.value;
                        handleTransactionField('kodeGudangTujuan', value);
                        handleTransactionField('namaGudangTujuan', getNameByCode(data.warehouses, value));
                      }}
                    />
                  </div>
                  <div className="field-group">
                    <label>Nama Gudang Tujuan</label>
                    <input type="text" value={transactionForm.namaGudangTujuan} readOnly />
                  </div>
                </div>

                <div className="mini-grid">
                  <div className="field-group">
                    <label>In RFI</label>
                    <input type="number" value={transactionForm.inRfi} onChange={(e) => handleTransactionField('inRfi', Number(e.target.value || 0))} />
                  </div>
                  <div className="field-group">
                    <label>In TBR</label>
                    <input type="number" value={transactionForm.inTbr} onChange={(e) => handleTransactionField('inTbr', Number(e.target.value || 0))} />
                  </div>
                  <div className="field-group">
                    <label>In BER</label>
                    <input type="number" value={transactionForm.inBer} onChange={(e) => handleTransactionField('inBer', Number(e.target.value || 0))} />
                  </div>
                  <div className="field-group">
                    <label>Total In</label>
                    <input type="number" value={transactionForm.totalIn} readOnly />
                  </div>

                  <div className="field-group">
                    <label>Out RFI</label>
                    <input type="number" value={transactionForm.outRfi} onChange={(e) => handleTransactionField('outRfi', Number(e.target.value || 0))} />
                  </div>
                  <div className="field-group">
                    <label>Out TBR</label>
                    <input type="number" value={transactionForm.outTbr} onChange={(e) => handleTransactionField('outTbr', Number(e.target.value || 0))} />
                  </div>
                  <div className="field-group">
                    <label>Out BER</label>
                    <input type="number" value={transactionForm.outBer} onChange={(e) => handleTransactionField('outBer', Number(e.target.value || 0))} />
                  </div>
                  <div className="field-group">
                    <label>Total Out</label>
                    <input type="number" value={transactionForm.totalOut} readOnly />
                  </div>
                </div>

                <div className="grid-2 mb-16">
                  <div className="field-group">
                    <label>Total</label>
                    <input type="number" value={transactionForm.total} readOnly />
                  </div>
                  <div className="field-group">
                    <label>Upload BA/SJP</label>
                    <div className="file-box">
                      <input type="file" accept="image/*" onChange={handleUpload} />
                      {transactionForm.upload && (
                        <img
                          src={transactionForm.upload}
                          alt="Preview upload"
                          className="upload-preview-thumb"
                          onClick={() => setPreviewImage(transactionForm.upload)}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="field-group">
                  <label>Catatan</label>
                  <textarea value={transactionForm.catatan} onChange={(e) => handleTransactionField('catatan', e.target.value)} />
                </div>

                <div className="action-row">
                  <button className="btn btn-primary" onClick={handleSaveTransaction}>Simpan Transaksi</button>
                  <button className="btn btn-secondary" onClick={() => setTransactionForm(initialForm())}>Reset</button>
                </div>
              </div>

              <div className="card mt-24">
                <div className="section-head">
                  <h3>Data Transaksi</h3>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Tanggal</th>
                        <th>Plant</th>
                        <th>Shift</th>
                        <th>Jenis</th>
                        <th>Lokasi</th>
                        <th>Nomor</th>
                        <th>Ekspeditur</th>
                        <th>Gudang Asal</th>
                        <th>Gudang Tujuan</th>
                        <th>Total</th>
                        <th>Upload</th>
                        <th>Catatan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map((item) => (
                        <tr key={item.id}>
                          <td>{item.tanggal}</td>
                          <td>{item.plant}</td>
                          <td>{item.shift}</td>
                          <td>{getTypeName(item.jenisTransaksi, data.transactionTypes)}</td>
                          <td>{item.lokasi}</td>
                          <td>{item.nomorTransaksi}</td>
                          <td>{item.namaEkspeditur || item.kodeEkspeditur}</td>
                          <td>{item.namaGudangAsal || item.kodeGudangAsal}</td>
                          <td>{item.namaGudangTujuan || item.kodeGudangTujuan}</td>
                          <td>{item.total}</td>
                          <td>{item.upload ? <button className="tiny-btn" onClick={() => setPreviewImage(item.upload)}>Lihat</button> : '-'}</td>
                          <td>{item.catatan || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {!isGuest && activeSection === 'warehouse' && (
            <section className="panel">
              <div className="card">
                <h3>Database Gudang</h3>
                <div className="toolbar-row">
                  <input type="text" placeholder="Kode Gudang" value={warehouseForm.code} onChange={(e) => setWarehouseForm((prev) => ({ ...prev, code: e.target.value }))} />
                  <input type="text" placeholder="Nama Gudang" value={warehouseForm.name} onChange={(e) => setWarehouseForm((prev) => ({ ...prev, name: e.target.value }))} />
                  <button className="btn btn-primary" onClick={handleAddWarehouse}>Tambah Gudang</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Kode Gudang</th>
                        <th>Nama Gudang</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.warehouses.map((item) => (
                        <tr key={item.code}>
                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td><button className="btn btn-danger" onClick={() => deleteRecord('warehouse', item.code)}>Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {!isGuest && activeSection === 'expediteur' && (
            <section className="panel">
              <div className="card">
                <h3>Database Ekspeditur</h3>
                <div className="toolbar-row">
                  <input type="text" placeholder="Kode Ekspeditur" value={expediteurForm.code} onChange={(e) => setExpediteurForm((prev) => ({ ...prev, code: e.target.value }))} />
                  <input type="text" placeholder="Nama Ekspeditur" value={expediteurForm.name} onChange={(e) => setExpediteurForm((prev) => ({ ...prev, name: e.target.value }))} />
                  <button className="btn btn-primary" onClick={handleAddExpediteur}>Tambah Ekspeditur</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.expediteurs.map((item) => (
                        <tr key={item.code}>
                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td><button className="btn btn-danger" onClick={() => deleteRecord('expediteur', item.code)}>Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {!isGuest && activeSection === 'plant' && (
            <section className="panel">
              <div className="card">
                <h3>Database Plant</h3>
                <div className="toolbar-row">
                  <input type="text" placeholder="Kode Plant" value={plantForm.code} onChange={(e) => setPlantForm((prev) => ({ ...prev, code: e.target.value }))} />
                  <input type="text" placeholder="Nama Plant" value={plantForm.name} onChange={(e) => setPlantForm((prev) => ({ ...prev, name: e.target.value }))} />
                  <button className="btn btn-primary" onClick={handleAddPlant}>Tambah Plant</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Kode Plant</th>
                        <th>Nama Plant</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.plants.map((item) => (
                        <tr key={item.code}>
                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td><button className="btn btn-danger" onClick={() => deleteRecord('plant', item.code)}>Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {!isGuest && activeSection === 'transactionType' && (
            <section className="panel">
              <div className="card">
                <h3>Database Jenis Transaksi</h3>
                <div className="toolbar-row">
                  <input type="text" placeholder="Kode Jenis" value={typeForm.code} onChange={(e) => setTypeForm((prev) => ({ ...prev, code: e.target.value }))} />
                  <input type="text" placeholder="Nama Jenis" value={typeForm.name} onChange={(e) => setTypeForm((prev) => ({ ...prev, name: e.target.value }))} />
                  <button className="btn btn-primary" onClick={handleAddTransactionType}>Tambah Jenis</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Kode</th>
                        <th>Nama</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.transactionTypes.map((item) => (
                        <tr key={item.code}>
                          <td>{item.code}</td>
                          <td>{item.name}</td>
                          <td><button className="btn btn-danger" onClick={() => deleteRecord('type', item.code)}>Hapus</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage('')}>
          <div className="image-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="image-modal-header">
              <span>Preview BA/SJP</span>
              <button className="btn btn-secondary" onClick={() => setPreviewImage('')}>Tutup</button>
            </div>
            <img src={previewImage} alt="Preview" />
            <a className="btn btn-primary" href={previewImage} download="ba-sjp.png">Unduh Gambar</a>
          </div>
        </div>
      )}
    </>
  );
}
