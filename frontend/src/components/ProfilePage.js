import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaBoxOpen,
  FaLock,
  FaSave,
  FaEdit,
  FaBell,
  FaMapMarkerAlt,
  FaCreditCard,
  FaHistory,
  FaRegNewspaper,
  FaQuestionCircle,
  FaCog,
  FaHeart,
} from "react-icons/fa";
import ParticlesBackground from "./ParticlesBackground";
import { useAuth } from "./AuthContext";
import styles from './ProfilePage.module.css';

const mockOrders = [
  { id: "A123", date: "2025-07-15", total: 3490, status: "Доставлен" },
  { id: "B456", date: "2025-06-30", total: 1799, status: "В пути" },
];

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
  });
  const { updateUser } = useAuth();

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState("");
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressesMessage, setAddressesMessage] = useState("");

  useEffect(() => {
    if (activeTab === "profile") {
      setLoading(true);
      fetch("/api/users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setFormData({
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
          updateUser({
            username: data.username || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
          });
          setEditMode(false);
        })
        .catch(() => alert("Ошибка при загрузке данных профиля"))
        .finally(() => setLoading(false));
    }

    if (activeTab === "addresses") {
      setAddressesLoading(true);
      setTimeout(() => {
        setAddresses([
          { id: "1", address: "г. Москва, ул. Ленина, д. 10" },
          { id: "2", address: "г. Санкт-Петербург, Невский пр., д. 15" },
        ]);
        setAddressesLoading(false);
      }, 800);
    }
  }, [activeTab, updateUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    setLoading(true);
    const dataToSend = {
      username: formData.username,
      email: formData.email,
      phone: formData.phone || null,
      address: formData.address || null,
    };

    fetch("/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setSaveMessage("✅ Профиль успешно обновлён");
        setTimeout(() => setSaveMessage(""), 3000);
        setEditMode(false);
        setFormData({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
        updateUser({
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      })
      .catch(() => alert("Ошибка при сохранении профиля"))
      .finally(() => setLoading(false));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordMessage("❌ Новый пароль и подтверждение не совпадают");
      return;
    }
    setPasswordLoading(true);
    setPasswordMessage("");

    fetch("/api/users/change-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Ошибка при смене пароля");
        }
        return res.json();
      })
      .then(() => {
        setPasswordMessage("✅ Пароль успешно изменён");
        setPasswordData({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      })
      .catch((err) => setPasswordMessage(`❌ ${err.message}`))
      .finally(() => setPasswordLoading(false));
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    setAddresses((prev) => [
      ...prev,
      { id: Date.now().toString(), address: newAddress.trim() },
    ]);
    setNewAddress("");
    setAddressesMessage("✅ Адрес добавлен");
    setTimeout(() => setAddressesMessage(""), 3000);
  };

  const handleEditAddress = (id, newValue) => {
    setAddresses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, address: newValue } : item))
    );
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  };

  const tabs = [
    { id: "profile", label: "Профиль", icon: <FaUser /> },
    { id: "orders", label: "Мои заказы", icon: <FaBoxOpen /> },
    { id: "password", label: "Пароль", icon: <FaLock /> },
    { id: "notifications", label: "Уведомления", icon: <FaBell /> },
    { id: "addresses", label: "Адреса", icon: <FaMapMarkerAlt /> },
    { id: "payments", label: "Платежи", icon: <FaCreditCard /> },
    { id: "favorites", label: "Избранное", icon: <FaHeart /> },
    { id: "subscriptions", label: "Подписки", icon: <FaRegNewspaper /> },
    { id: "history", label: "История", icon: <FaHistory /> },
    { id: "support", label: "Поддержка", icon: <FaQuestionCircle /> },
    { id: "settings", label: "Настройки", icon: <FaCog /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        if (loading) return <p>Загрузка данных...</p>;
        return (
          <div className={styles.content + " fade-in"}>
            <div className={styles.sectionHeader}>
              <h2>Личная информация</h2>
              {!editMode ? (
                <button
                  className={`${styles.btn} ${styles.btnEdit}`}
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit /> Редактировать
                </button>
              ) : (
                <button
                  className={`${styles.btn} ${styles.btnSave}`}
                  onClick={handleSaveProfile}
                  disabled={loading}
                >
                  {loading ? "Сохранение..." : <><FaSave /> Сохранить</>}
                </button>
              )}
            </div>
            <div className={styles.formGrid}>
              {Object.entries(formData).map(([key, value]) => (
                <label key={key} className={styles.formGroup}>
                  <span>
                    {key === "username"
                      ? "Имя"
                      : key === "email"
                      ? "Email"
                      : key === "phone"
                      ? "Телефон"
                      : "Адрес"}
                  </span>
                  <input
                    type="text"
                    name={key}
                    value={value}
                    onChange={handleChange}
                    disabled={!editMode || loading}
                    className={
                      editMode ? styles.formInputEditable : styles.formInputReadonly
                    }
                  />
                </label>
              ))}
            </div>
            {saveMessage && (
              <div className={styles.saveSuccessMessage}>{saveMessage}</div>
            )}
          </div>
        );

      case "orders":
        return (
          <div className={styles.content + " fade-in"}>
            <h2 className={styles.sectionTitle}>История заказов</h2>
            {mockOrders.length > 0 ? (
              <table className={styles.ordersTable}>
                <thead>
                  <tr>
                    <th>Номер</th>
                    <th>Дата</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {mockOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td>{order.total.toLocaleString()} ₽</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className={styles.noData}>У вас пока нет заказов.</p>
            )}
          </div>
        );

      case "password":
        return (
          <div className={styles.content + " fade-in"}>
            <h2>Смена пароля</h2>
            <div className={styles.formGrid}>
              <label className={styles.formGroup}>
                <span>Старый пароль</span>
                <input
                  type="password"
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordLoading}
                  className={styles.formInputEditable}
                />
              </label>
              <label className={styles.formGroup}>
                <span>Новый пароль</span>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordLoading}
                  className={styles.formInputEditable}
                />
              </label>
              <label className={styles.formGroup}>
                <span>Подтверждение нового пароля</span>
                <input
                  type="password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  disabled={passwordLoading}
                  className={styles.formInputEditable}
                />
              </label>
            </div>
            <button
              className={`${styles.btn} ${styles.btnSave}`}
              onClick={handleChangePassword}
              disabled={passwordLoading}
            >
              {passwordLoading ? "Смена пароля..." : <><FaSave /> Изменить пароль</>}
            </button>
            {passwordMessage && (
              <div className={styles.saveSuccessMessage}>{passwordMessage}</div>
            )}
          </div>
        );

      case "addresses":
        return (
          <div className={styles.content + " fade-in"}>
            <h2>Мои адреса</h2>
            {addressesLoading ? (
              <p>Загрузка адресов...</p>
            ) : (
              <>
                <ul className={styles.addressList}>
                  {addresses.map(({ id, address }) => (
                    <li key={id} className={styles.addressItem}>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => handleEditAddress(id, e.target.value)}
                        className={`${styles.formInputEditable} ${styles.addressInput}`}
                      />
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => handleDeleteAddress(id)}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
                <div className={styles.addAddressBlock}>
                  <input
                    type="text"
                    placeholder="Новый адрес"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className={styles.formInputEditable}
                  />
                  <button onClick={handleAddAddress} className={`${styles.btn} ${styles.btnSave}`}>
                    Добавить адрес
                  </button>
                </div>
                {addressesMessage && (
                  <div className={styles.saveSuccessMessage}>{addressesMessage}</div>
                )}
              </>
            )}
          </div>
        );

      default:
        return <p>Выберите вкладку для просмотра информации.</p>;
    }
  };

  return (
    <>
      <ParticlesBackground />
      <div className={styles.profilePage}>
        <div className={styles.profileContainer}>
          <aside className={styles.sidebar}>
            <ul className={styles.tabsList}>
              {tabs.map(({ id, label, icon }) => (
                <li
                  key={id}
                  className={
                    activeTab === id
                      ? `${styles.tabItem} ${styles.active}`
                      : styles.tabItem
                  }
                  onClick={() => {
                    setActiveTab(id);
                    setEditMode(false);
                    setSaveMessage("");
                    setPasswordMessage("");
                    setAddressesMessage("");
                  }}
                >
                  <span className={styles.tabIcon}>{icon}</span>
                  {label}
                </li>
              ))}
            </ul>
          </aside>
          <main className={styles.mainContent}>{renderTabContent()}</main>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
