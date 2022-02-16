const ADD_SERVER = "servers/ADD_SERVER";
const SET_SERVERS = "servers/ADD_SERVERS";
const REMOVE_SERVER = "servers/REMOVE_SERVER";

const addServer = (server) => ({
  type: ADD_SERVER,
  server,
});
const setServers = (servers) => ({
  type: SET_SERVERS,
  servers,
});
const removeServerById = (id) => ({
  type: REMOVE_SERVER,
  id: id,
});

export const loadServers = () => async (dispatch) => {
  const response = await fetch(`/api/servers`);
  if (response.ok) {
    const data = await response.json();
    //return false if returned servers == 0
    if (Object.keys(data.servers) == 0) return false;
    await dispatch(setServers(data.servers));

    return true;
  } else {
    console.log("problem loading server");
  }
};

export const deleteServerById = (id) => async (dispatch) => {
  const response = await fetch(`/api/servers/${id}`, {
    method: "DELETE",
  });

  if (response.ok) {
    await dispatch(removeServerById(id));
    return null;
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const createServer = (server) => async (dispatch) => {
  const response = await fetch("/api/servers/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(server),
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};

export const createChannel = (channel) => async (dispatch) => {
  const response = await fetch(`/api/channels/new`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(channel),
  });

  if (response.ok) {
    const data = await response.json();
    await dispatch(addServer(data));
    return null;
  } else if (response.status < 500) {
    const data = await response.json();
    if (data.errors) {
      return data.errors;
    }
  } else {
    return ["An error occurred. Please try again."];
  }
};
// export const editServer = (serverid, desc) => async (dispatch) => {
//   const server = { description: desc };
//   const response = await fetch(`/api/servers/${serverid}`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(server),
//   });

//   if (response.ok) {
//     const data = await response.json();
//     await dispatch(addServer(data));
//     return null;
//   } else if (response.status < 500) {
//     const data = await response.json();
//     if (data.errors) {
//       return data.errors;
//     }
//   } else {
//     return ["An error occurred. Please try again."];
//   }
// };

const initialState = { servers: {} };
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_SERVER:
      return {
        servers: { ...state.servers, [action.server.id]: action.server },
      };
    case SET_SERVERS:
      return {
        servers: { ...action.servers },
      };
    case REMOVE_SERVER:
      const newServers = { ...state.servers };
      delete newServers[action.id];
      return {
        ...state,
        servers: newServers,
      };
    default:
      return state;
  }
}
