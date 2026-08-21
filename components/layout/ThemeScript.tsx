import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * Script inline y bloqueante. Va en el <head> para aplicar la clase `dark`
 * ANTES del primer pintado y evitar el destello blanco (FOUC).
 * Se escribe minificado a mano: se ejecuta en la ruta crítica.
 */
const script = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var d=s==="dark"||(s!=="light"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var e=document.documentElement;e.classList.toggle("dark",d);e.style.colorScheme=d?"dark":"light";}catch(_){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export default ThemeScript;
