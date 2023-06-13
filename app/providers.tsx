"use-client";

import { Toaster } from "react-hot-toast";

export default function Providers() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
                // Define default options
                className: "",
                duration: 5000,
            }}
        />
    );
}
