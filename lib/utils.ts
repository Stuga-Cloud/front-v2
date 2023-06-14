import ms from "ms";
import { Session } from "next-auth";

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
    if (!timestamp) return "never";
    return `${ms(Date.now() - new Date(timestamp).getTime())}${
        timeOnly ? "" : " ago"
    }`;
};

export function isConnected(session: Session | null): boolean {
    if (!session) {
        console.log("sessionfalse");
        return false;
    }
    console.log("session", !!session?.user);
    return !!session?.user;
}

export function generateRandomName() {
    const randomString = Math.random().toString(36).substring(2, 8);
    return `Database-${randomString}`;
}

export function nFormatter(num: number, digits?: number) {
    if (!num) return "0";
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
        .slice()
        .reverse()
        .find(function (item) {
            return num >= item.value;
        });
    return item
        ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") +
              item.symbol
        : "0";
}

export function capitalize(str: string) {
    if (!str || typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
    if (!str || str.length <= length) return str;
    return `${str.slice(0, length)}...`;
};

const validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
};

export const isEmailValid = (email: string | undefined) => {
    return email == undefined || (email.length > 0 && validateEmail(email));
};

export const sortUserByName = (
    a: { user: { name: string } },
    b: { user: { name: string } },
) => {
    if (a.user.name.toLowerCase() < b.user.name.toLowerCase()) {
        return -1;
    }
    if (a.user.name.toLowerCase() > b.user.name.toLowerCase()) {
        return 1;
    }
    return 0;
};
