// Simple toast utility - you can replace this with a proper toast library like react-hot-toast or sonner
export const toast = {
    success: (message: string) => {
        if (typeof window !== "undefined") {
            // For now, using alert - replace with proper toast library
            console.log("✅ Success:", message);
            // alert(message);
        }
    },
    error: (message: string) => {
        if (typeof window !== "undefined") {
            console.error("❌ Error:", message);
            // alert(message);
        }
    },
    info: (message: string) => {
        if (typeof window !== "undefined") {
            console.log("ℹ️ Info:", message);
        }
    },
};
