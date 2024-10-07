import { Linking } from "react-native";

const ngrok = "https://iqbal.switchcafebd.com";

export async function Fetch(
  database = "",
  url,
  method,
  body,
  formData = false
) {
  try {
    const newUrl = ngrok + url;
    const option = /"GET"|"DELETE"/.test(method)
      ? {
          headers: { database: database },
        }
      : formData
      ? {
          method,
          body,
          headers: { database: database },
        }
      : {
          method,
          headers: {
            "content-type": "application/json",
            database: database,
          },
          body: JSON.stringify(body),
        };
    const res = await fetch(newUrl, option);

    const result = await res.json();
    if (!res.ok) throw result;
    else return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function notify(database, title, body, data) {
  try {
    await Fetch(database, "/message", "POST", {
      title,
      body,
      data,
    });
  } catch (error) {
    console.log(error);
  }
}

export const serverUrl = ngrok + "/";

export function prittyPrint(obj) {
  console.log(JSON.stringify(obj, null, 3));
}

export function dateFormatter(date) {
  const d = new Date(date);
  return d.toLocaleDateString("en-GB");
}

export function openNumber(number) {
  Linking.openURL(`tel:${number}`);
}

export const role = {
  admin: "Admin",
  sales_man: "Sales Man",
  controller: "Controller",
  store_manager: "Store Manager",
};

export function sendnotification(data, store) {
  if (data.type === "receivedOrder") {
    store.setUpdateOrder((prev) => !prev);
    store.setUpNotification((prev) => !prev);
  } else if (data.type === "completeOrder") {
    store.setUpdateOrder((prev) => !prev);
    store.setUpdateReport((prev) => !prev);
    store.setUpNotification((prev) => !prev);
  } else if (data.type === "balance_transfer_request") {
    store.setUpdateUser((prev) => !prev);
  } else if (data.type === "balance_accepted") {
    store.setUpdateUser((prev) => !prev);
    store.setUpdateReport((prev) => !prev);
  } else if (data.type === "balance_decline") {
    store.setUpdateUser((prev) => !prev);
  } else if (data.type === "target_received") {
    store.setUpdateUser((prev) => !prev);
  } else if (data.type === "expense_req_sent") {
    store.setUpdateExpense((prev) => !prev);
  } else if (data.type === "expense_req_accepted") {
    store.setUpdateUser((prev) => !prev);
    store.setUpdateExpense((prev) => !prev);
  } else if (data.type === "expense_req_decline") {
    store.setUpdateExpense((prev) => !prev);
  } else if (data.type === "shop_added") {
    store.setUpdateCustomer((prev) => !prev);
  }
}
