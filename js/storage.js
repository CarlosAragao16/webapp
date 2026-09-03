/* ============ Storage Helper ============ */

const Storage = {
  get(key, fallback = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch (err) {
      console.warn("Erro ao ler localStorage:", key, err);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.warn("Erro ao gravar localStorage:", key, err);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn("Erro ao remover do localStorage:", key, err);
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (err) {
      console.warn("Erro ao limpar localStorage:", err);
      return false;
    }
  }
};
