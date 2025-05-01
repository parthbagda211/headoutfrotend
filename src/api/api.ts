export const API = {
  post: async (url: string, data: any) => {
    const response = await fetch(`https://headoutbackend-1-vwgp.onrender.com/api${url}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      mode: "cors",                // ✅ Ensure CORS is enabled
          
    });
    return await response.json();
  },

  get: async (url: string) => {
    const response = await fetch(`https://headoutbackend-1-vwgp.onrender.com/api${url}`, {
      method: "GET",
      mode: "cors",                // ✅ Enable CORS
     //ptional if not using cookies
    });
    return await response.json();
  },
};
