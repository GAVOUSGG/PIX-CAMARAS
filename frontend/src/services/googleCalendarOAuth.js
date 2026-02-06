/**
 * Servicio de OAuth 2.0 para Google Calendar API
 * Permite agregar, actualizar y eliminar eventos automáticamente
 */

// Configuración de OAuth (el usuario deberá configurar estos valores)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
const GOOGLE_REDIRECT_URI =
  import.meta.env.VITE_GOOGLE_REDIRECT_URI || window.location.origin;
const SCOPES = "https://www.googleapis.com/auth/calendar";

// URLs de Google OAuth
const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "google_calendar_access_token",
  REFRESH_TOKEN: "google_calendar_refresh_token",
  TOKEN_EXPIRY: "google_calendar_token_expiry",
  CODE_VERIFIER: "google_calendar_code_verifier",
};

/**
 * Genera un código verificador y challenge para PKCE
 */
const generatePKCE = () => {
  const codeVerifier = generateRandomString(128);
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);

  return crypto.subtle.digest("SHA-256", data).then((hash) => {
    const codeChallenge = base64URLEncode(hash);
    return { codeVerifier, codeChallenge };
  });
};

/**
 * Genera una cadena aleatoria
 */
const generateRandomString = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Codifica en Base64URL
 */
const base64URLEncode = (buffer) => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

/**
 * Inicia el flujo de autenticación OAuth
 */
export const initiateOAuth = async () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error(
      "Google Client ID no configurado. Por favor configura VITE_GOOGLE_CLIENT_ID en tu archivo .env"
    );
  }

  try {
    const { codeVerifier, codeChallenge } = await generatePKCE();

    // Guardar el code verifier para usarlo después
    sessionStorage.setItem(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

    // Parámetros para la URL de autorización
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: SCOPES,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      access_type: "offline",
      prompt: "consent",
    });

    const authUrl = `${GOOGLE_AUTH_URL}?${params.toString()}`;

    // Abrir ventana de autorización
    const authWindow = window.open(
      authUrl,
      "Google OAuth",
      "width=500,height=600,left=100,top=100"
    );

    return new Promise((resolve, reject) => {
      // Escuchar mensajes de la ventana de autorización
      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "GOOGLE_OAUTH_SUCCESS") {
          window.removeEventListener("message", messageListener);
          authWindow?.close();
          resolve(event.data.code);
        } else if (event.data.type === "GOOGLE_OAUTH_ERROR") {
          window.removeEventListener("message", messageListener);
          authWindow?.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener("message", messageListener);

      // También verificar si la ventana se cerró manualmente
      const checkClosed = setInterval(() => {
        if (authWindow?.closed) {
          clearInterval(checkClosed);
          window.removeEventListener("message", messageListener);
          reject(new Error("Autorización cancelada por el usuario"));
        }
      }, 1000);
    });
  } catch (error) {
    console.error("[OAuth] Error al iniciar autenticación:", error);
    throw error;
  }
};

/**
 * Intercambia el código de autorización por tokens
 */
export const exchangeCodeForTokens = async (code) => {
  const codeVerifier = sessionStorage.getItem(STORAGE_KEYS.CODE_VERIFIER);

  if (!codeVerifier) {
    throw new Error(
      "Code verifier no encontrado. Por favor inicia el flujo de OAuth nuevamente."
    );
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        code: code,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
        code_verifier: codeVerifier,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error_description || error.error || "Error al obtener tokens"
      );
    }

    const tokens = await response.json();

    // Guardar tokens
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);

    if (tokens.refresh_token) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
    }

    // Calcular expiración (por defecto 3600 segundos)
    const expiresIn = tokens.expires_in || 3600;
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());

    // Limpiar code verifier
    sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);

    console.log("[OAuth] Tokens obtenidos exitosamente");
    return tokens;
  } catch (error) {
    console.error("[OAuth] Error al intercambiar código por tokens:", error);
    throw error;
  }
};

/**
 * Obtiene un token de acceso válido (renueva si es necesario)
 */
export const getValidAccessToken = async () => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const expiryTime = localStorage.getItem(STORAGE_KEYS.TOKEN_EXPIRY);

  // Si no hay token, necesita autenticarse
  if (!accessToken) {
    throw new Error("No hay token de acceso. Por favor autentícate primero.");
  }

  // Si el token aún no ha expirado, devolverlo
  if (expiryTime && Date.now() < parseInt(expiryTime)) {
    return accessToken;
  }

  // Si hay refresh token, renovar el access token
  if (refreshToken) {
    try {
      const newToken = await refreshAccessToken(refreshToken);
      return newToken;
    } catch (error) {
      console.error("[OAuth] Error al renovar token:", error);
      // Si falla la renovación, limpiar tokens y pedir nueva autenticación
      clearTokens();
      throw new Error("Token expirado. Por favor autentícate nuevamente.");
    }
  }

  // Si no hay refresh token, necesita nueva autenticación
  clearTokens();
  throw new Error(
    "Token expirado y no hay refresh token. Por favor autentícate nuevamente."
  );
};

/**
 * Renueva el token de acceso usando el refresh token
 */
const refreshAccessToken = async (refreshToken) => {
  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        error.error_description || error.error || "Error al renovar token"
      );
    }

    const tokens = await response.json();

    // Guardar nuevo access token
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);

    // Calcular nueva expiración
    const expiresIn = tokens.expires_in || 3600;
    const expiryTime = Date.now() + expiresIn * 1000;
    localStorage.setItem(STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString());

    console.log("[OAuth] Token renovado exitosamente");
    return tokens.access_token;
  } catch (error) {
    console.error("❌ [OAuth] Error al renovar token:", error);
    throw error;
  }
};

/**
 * Limpia los tokens almacenados
 */
export const clearTokens = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRY);
  sessionStorage.removeItem(STORAGE_KEYS.CODE_VERIFIER);
  console.log("[OAuth] Tokens limpiados");
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = () => {
  const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  return !!accessToken;
};

/**
 * Maneja el callback de OAuth (debe llamarse cuando se recibe el código)
 */
export const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const error = urlParams.get("error");

  if (error) {
    // Notificar a la ventana principal
    if (window.opener) {
      window.opener.postMessage(
        { type: "GOOGLE_OAUTH_ERROR", error },
        window.location.origin
      );
    }
    return { success: false, error };
  }

  if (code) {
    try {
      await exchangeCodeForTokens(code);

      // Notificar a la ventana principal
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_OAUTH_SUCCESS", code },
          window.location.origin
        );
      }

      return { success: true };
    } catch (error) {
      if (window.opener) {
        window.opener.postMessage(
          { type: "GOOGLE_OAUTH_ERROR", error: error.message },
          window.location.origin
        );
      }
      return { success: false, error: error.message };
    }
  }

  return { success: false, error: "No se recibió código de autorización" };
};
