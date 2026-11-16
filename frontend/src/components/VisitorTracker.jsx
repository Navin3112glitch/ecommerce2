import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function VisitorTracker() {
    const location = useLocation();

    useEffect(() => {
        // Do not count admin activity as customer visits.
        if (location.pathname.startsWith("/admin")) {
            return;
        }

        // Track only once per browser tab session.
        // This also prevents duplicate requests in React StrictMode.
        if (sessionStorage.getItem("quickkart-visitor-tracked")) {
            return;
        }

        sessionStorage.setItem("quickkart-visitor-tracked", "true");

        fetch("http://127.0.0.1:8000/api/analytics/track/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Visitor tracking failed");
                }
                return response.json();
            })
            .then(data => {
                console.log("QuickKart visitor tracked:", data);
            })
            .catch(error => {
                // Allow retry if the tracking request fails.
                sessionStorage.removeItem("quickkart-visitor-tracked");
                console.error("Visitor tracking error:", error);
            });

    }, []);

    return null;
}

export default VisitorTracker;