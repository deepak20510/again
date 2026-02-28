const API_BASE = "http://localhost:5000/api/v1";

class ApiService {
  /* ================= CORE REQUEST ================= */

  static async request(endpoint, options = {}) {
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_BASE}${endpoint}`, config);

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API ERROR:", error.message);
      throw error;
    }
  }

  /* ================= AUTH ================= */

  static async signup(userData) {
    const res = await this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    if (res.success && res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res;
  }

  static async login(credentials) {
    const res = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (res.success && res.data?.token) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }

    return res;
  }

  static logout() {
    localStorage.clear();
  }

  /* ================= POSTS ================= */

  static async createPost(postData) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  }

  static async getPosts(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/posts${params ? `?${params}` : ""}`);
  }

  static async updatePost(postId, postData) {
    return this.request(`/posts/${postId}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    });
  }

  static async deletePost(postId) {
    return this.request(`/posts/${postId}`, {
      method: "DELETE",
    });
  }

  /* ================= TRAINER ================= */
  // ⚠ Using singular because backend uses /trainer

  static async createTrainerProfile(data) {
    return this.request("/trainer/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getMyTrainerProfile() {
    return this.request("/trainer/profile");
  }

  static async updateTrainerProfile(data) {
    return this.request("/trainer/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async searchTrainers(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/trainer/search${params ? `?${params}` : ""}`);
  }

  static async getTrainerProfile(id) {
    return this.request(`/trainer/${id}`);
  }

  /* ================= INSTITUTION ================= */

  static async createInstitutionProfile(data) {
    return this.request("/institution/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getMyInstitutionProfile() {
    return this.request("/institution/profile");
  }

  static async updateInstitutionProfile(data) {
    return this.request("/institution/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /* ================= MATERIAL ================= */
  // ⚠ Backend uses /material not /materials

  static async getMyMaterials() {
    return this.request("/material/my");
  }

  static async uploadMaterial(data) {
    return this.request("/material", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async getMaterial(id) {
    return this.request(`/material/${id}`);
  }

  static async updateMaterial(id, data) {
    return this.request(`/material/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  static async deleteMaterial(id) {
    return this.request(`/material/${id}`, {
      method: "DELETE",
    });
  }

  /* ================= ADMIN ================= */

  static async getAdminStats() {
    return this.request("/admin/stats");
  }

  static async getReports(filters = {}) {
    const params = new URLSearchParams(filters).toString();
    return this.request(`/admin/reports${params ? `?${params}` : ""}`);
  }

  static async resolveReport(id, data) {
    return this.request(`/admin/reports/${id}/resolve`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  static async suspendUser(id) {
    return this.request(`/admin/users/${id}/suspend`, {
      method: "POST",
    });
  }

  static async unsuspendUser(id) {
    return this.request(`/admin/users/${id}/unsuspend`, {
      method: "POST",
    });
  }
}

export default ApiService;
