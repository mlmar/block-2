const DEV = process.env.REACT_APP_DEV;

const LOCAL_CLIENT = "http://localhost:3000";
const LOCAL_SERVER = "http://localhost:3300";

export const HOME_URL = DEV ? LOCAL_CLIENT : null;
export const SERVER_URL = DEV ? LOCAL_SERVER : null;

export const STRIPPED_HOME_URL = HOME_URL?.replace("http://","").replace("https://","");