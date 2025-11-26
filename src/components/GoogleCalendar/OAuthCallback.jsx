import { useEffect } from 'react';
import { handleOAuthCallback } from '../../services/googleCalendarOAuth';

/**
 * Componente para manejar el callback de OAuth de Google Calendar
 * Se renderiza cuando Google redirige después de la autorización
 */
const OAuthCallback = () => {
  useEffect(() => {
    const processCallback = async () => {
      try {
        const result = await handleOAuthCallback();
        
        if (result.success) {
          console.log('✅ OAuth callback procesado exitosamente');
          // Cerrar la ventana si fue abierta desde una popup
          if (window.opener) {
            // Notificar a la ventana principal que la autenticación fue exitosa
            window.opener.postMessage(
              { type: 'GOOGLE_OAUTH_SUCCESS', code: new URLSearchParams(window.location.search).get('code') },
              window.location.origin
            );
            // Pequeño delay para asegurar que el mensaje se envíe antes de cerrar
            setTimeout(() => window.close(), 100);
          } else {
            // Si no es popup, redirigir a la página principal
            window.location.href = '/';
          }
        } else {
          console.error('❌ Error en OAuth callback:', result.error);
          if (window.opener) {
            window.opener.postMessage(
              { type: 'GOOGLE_OAUTH_ERROR', error: result.error },
              window.location.origin
            );
            setTimeout(() => window.close(), 100);
          } else {
            alert('Error al autenticar con Google Calendar: ' + result.error);
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('❌ Error procesando OAuth callback:', error);
        alert('Error al procesar la autenticación: ' + error.message);
        if (window.opener) {
          window.close();
        } else {
          window.location.href = '/';
        }
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-white text-xl mb-4">Procesando autenticación...</div>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthCallback;

