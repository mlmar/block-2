const DEV = false;

const LOCAL_CLIENT = "http://localhost:3000";
const LOCAL_SERVER = "http://localhost:3300";

const DEPLOYED = "https://block10.herokuapp.com";

export const HOME_URL = DEV ? LOCAL_CLIENT : DEPLOYED;
export const SERVER_URL = DEV ? LOCAL_SERVER : DEPLOYED;

export const STRIPPED_HOME_URL = HOME_URL?.replace("http://","").replace("https://","");