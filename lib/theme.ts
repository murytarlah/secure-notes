export const THEME_STORAGE_KEY = "theme";

/** Runs in <head> to apply the saved theme before the first paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
