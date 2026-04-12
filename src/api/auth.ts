import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  LoginRequest,
  RegisterRequest,
  VerifyOTPRequest,
  AuthResponse,
  UpdateProfileRequest,
  User,
} from "@/types/auth";

const API_BASE_URL = "http://localhost:8081/api";

class AuthService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/login",
      credentials,
    );
    return response.data;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>("/auth/register", data);
    return response.data;
  }

  async verifyOTP(data: VerifyOTPRequest): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/verify-otp",
      data,
    );
    return response.data;
  }

  async resendOTP(email: string): Promise<AuthResponse> {
    const response = await this.api.post<AuthResponse>(
      "/auth/resend-otp",
      null,
      { params: { email } },
    );
    return response.data;
  }

  async getProfile(): Promise<User> {
    const response = await this.api.get<User>("/user/profile");
    return response.data;
  }

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await this.api.put<User>("/user/update-profile", data);
    return response.data;
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  removeToken(): void {
    localStorage.removeItem("token");
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export default new AuthService();
