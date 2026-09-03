/* ============ Profile Manager ============ */

const Profile = {
  STORAGE_KEY: "bc_beauty_profile",

  getProfile() {
    return Storage.get(this.STORAGE_KEY, null);
  },

  saveProfile(data) {
    const profile = {
      name: String(data.name || "").trim(),
      email: String(data.email || "").trim(),
      phone: String(data.phone || "").trim(),
      createdAt: new Date().toISOString()
    };

    if (!profile.name || !profile.email) {
      return { ok: false, error: "Nome e e-mail são obrigatórios" };
    }

    if (!this.isValidEmail(profile.email)) {
      return { ok: false, error: "E-mail inválido" };
    }

    Storage.set(this.STORAGE_KEY, profile);
    return { ok: true, profile };
  },

  clearProfile() {
    Storage.remove(this.STORAGE_KEY);
  },

  isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  },

  getDisplayName() {
    const profile = this.getProfile();
    return profile ? profile.name.split(" ")[0] : null;
  }
};