export const API = {
    post: async (url: string, data: any) => {
      const response = await fetch(`http://localhost:5000/api${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return await response.json();
    },
  
    get: async (url: string) => {
      const response = await fetch(`http://localhost:5000/api${url}`);
      return await response.json();
    }
  };
  